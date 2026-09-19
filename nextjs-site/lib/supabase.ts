// Supabase client configuration.
//
// Environment values are trimmed before use: a trailing newline or a stray
// space survives a copy-paste into .env.local or the Vercel dashboard and
// produces a bare "TypeError: fetch failed" at request time, which gives no
// hint about the real cause.
import { createClient } from '@supabase/supabase-js';

function readEnv(name: string): string {
  return (process.env[name] ?? '').trim();
}

const supabaseUrl = readEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabaseServiceKey = readEnv('SUPABASE_SERVICE_ROLE_KEY');

/** Project ref taken from the API URL, e.g. "abcdefgh" in abcdefgh.supabase.co */
export function projectRefFromUrl(url: string): string | null {
  try {
    const host = new URL(url).hostname;
    if (!host.endsWith('.supabase.co') && !host.endsWith('.supabase.in')) return null;
    return host.split('.')[0] || null;
  } catch {
    return null;
  }
}

export interface KeyInfo {
  /** 'jwt' for legacy anon/service_role keys, 'modern' for sb_publishable_/sb_secret_. */
  format: 'jwt' | 'modern' | 'unknown';
  /** Project ref carried inside a legacy JWT key, when readable. */
  ref: string | null;
  /** 'anon' | 'service_role' from the JWT role claim. */
  role: string | null;
  expired: boolean;
}

/**
 * Reads the public claims of a Supabase key. The signature is NOT verified —
 * only Supabase can do that — but the payload is enough to catch the common
 * mistake of pairing a key from one project with another project's URL, which
 * surfaces at runtime only as "signature verification failed".
 */
export function inspectKey(key: string): KeyInfo {
  if (!key) return { format: 'unknown', ref: null, role: null, expired: false };

  if (key.startsWith('sb_publishable_') || key.startsWith('sb_secret_')) {
    return { format: 'modern', ref: null, role: null, expired: false };
  }

  const parts = key.split('.');
  if (parts.length !== 3) return { format: 'unknown', ref: null, role: null, expired: false };

  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return {
      format: 'jwt',
      ref: typeof payload.ref === 'string' ? payload.ref : null,
      role: typeof payload.role === 'string' ? payload.role : null,
      expired: typeof payload.exp === 'number' ? payload.exp * 1000 < Date.now() : false,
    };
  } catch {
    return { format: 'unknown', ref: null, role: null, expired: false };
  }
}

/**
 * Describes a key/URL project mismatch, or null when they agree or cannot
 * be compared.
 */
export function keyMismatch(
  label: string,
  key: string,
  urlRef: string | null
): string | null {
  if (!key || !urlRef) return null;
  const info = inspectKey(key);
  if (info.format !== 'jwt' || !info.ref) return null;
  if (info.ref === urlRef) return null;
  return `${label} belongs to Supabase project "${info.ref}", but NEXT_PUBLIC_SUPABASE_URL points at project "${urlRef}". Copy the keys from Settings → API of the "${urlRef}" project.`;
}

export const projectRef = projectRefFromUrl(supabaseUrl);

/**
 * Non-null when the configuration cannot work, so routes can return a useful
 * message instead of throwing at import time and yielding an opaque 500.
 */
export const supabaseConfigError: string | null = (() => {
  if (!supabaseUrl) {
    return 'NEXT_PUBLIC_SUPABASE_URL is not set. Add it to .env.local (local) or the project environment variables (hosted), then restart or redeploy.';
  }
  if (!supabaseAnonKey) {
    return 'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Copy the anon/public key from Supabase → Settings → API.';
  }

  let parsed: URL;
  try {
    parsed = new URL(supabaseUrl);
  } catch {
    return `NEXT_PUBLIC_SUPABASE_URL is not a valid URL ("${supabaseUrl}"). It should look like https://your-project-ref.supabase.co`;
  }

  if (parsed.protocol !== 'https:') {
    return `NEXT_PUBLIC_SUPABASE_URL must start with https:// (got "${parsed.protocol}//").`;
  }
  if (parsed.hostname === 'supabase.com' || parsed.hostname === 'app.supabase.com') {
    return 'NEXT_PUBLIC_SUPABASE_URL points at the Supabase dashboard, not your project API. Use the Project URL from Settings → API, which looks like https://your-project-ref.supabase.co';
  }
  if (!parsed.hostname.endsWith('.supabase.co') && !parsed.hostname.endsWith('.supabase.in')) {
    // Self-hosted deployments are legitimate, so this is not treated as fatal.
    return null;
  }

  // A key from a different project is accepted by the client and only fails
  // later with "signature verification failed", which names neither project.
  const urlRef = parsed.hostname.split('.')[0];
  const anonMismatch = keyMismatch('NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKey, urlRef);
  if (anonMismatch) return anonMismatch;
  const serviceMismatch = keyMismatch('SUPABASE_SERVICE_ROLE_KEY', supabaseServiceKey, urlRef);
  if (serviceMismatch) return serviceMismatch;

  if (inspectKey(supabaseAnonKey).expired) {
    return 'NEXT_PUBLIC_SUPABASE_ANON_KEY has expired. Generate fresh keys in Supabase → Settings → API.';
  }
  if (supabaseServiceKey && inspectKey(supabaseServiceKey).expired) {
    return 'SUPABASE_SERVICE_ROLE_KEY has expired. Generate fresh keys in Supabase → Settings → API.';
  }

  return null;
})();

export const isSupabaseConfigured = supabaseConfigError === null;

// A syntactically valid placeholder keeps createClient from throwing during
// module import when the configuration is broken; every route checks
// supabaseConfigError before using the client.
const safeUrl = supabaseConfigError ? 'https://placeholder.supabase.co' : supabaseUrl;
const safeKey = supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(safeUrl, safeKey);

export const supabaseAdmin = supabaseServiceKey
  ? createClient(safeUrl, supabaseServiceKey)
  : supabase;

export const hasServiceRoleKey = Boolean(supabaseServiceKey);

/** The project host, for diagnostics. Never exposes a key. */
export const supabaseHost = (() => {
  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return null;
  }
})();

/**
 * Turns a Supabase/undici failure into something a person can act on.
 * "TypeError: fetch failed" on its own tells you nothing.
 */
export function explainSupabaseError(error: unknown): string {
  const message =
    error instanceof Error ? error.message : typeof error === 'string' ? error : String(error);

  if (/fetch failed|ENOTFOUND|EAI_AGAIN|ECONNREFUSED|getaddrinfo/i.test(message)) {
    return `Could not reach Supabase at ${supabaseHost ?? 'the configured URL'}. Check that NEXT_PUBLIC_SUPABASE_URL matches the Project URL in Supabase → Settings → API exactly (no trailing spaces or quotes), and that the project is not paused. Original error: ${message}`;
  }
  if (/signature verification failed|invalid signature|invalid claim/i.test(message)) {
    return `Supabase rejected the key's signature. This almost always means the key belongs to a different Supabase project than NEXT_PUBLIC_SUPABASE_URL (${supabaseHost ?? 'unset'}), or was truncated when pasted. Re-copy both the anon key and the service_role key from Settings → API of that exact project. Original error: ${message}`;
  }
  if (/Invalid API key|JWT|401|apikey|not authorized|Unauthorized/i.test(message)) {
    return `Supabase rejected the API key. Re-copy the keys from Supabase → Settings → API and redeploy. Original error: ${message}`;
  }
  if (/relation .* does not exist|schema cache/i.test(message)) {
    return `The database schema is missing. Run DATABASE_SETUP.sql in the Supabase SQL editor. Original error: ${message}`;
  }
  return message;
}

export default supabase;
