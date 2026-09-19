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
  if (/Invalid API key|JWT|401|apikey/i.test(message)) {
    return `Supabase rejected the API key. Re-copy the keys from Supabase → Settings → API and redeploy. Original error: ${message}`;
  }
  if (/relation .* does not exist|schema cache/i.test(message)) {
    return `The database schema is missing. Run DATABASE_SETUP.sql in the Supabase SQL editor. Original error: ${message}`;
  }
  return message;
}

export default supabase;
