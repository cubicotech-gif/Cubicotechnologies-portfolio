import { NextResponse } from 'next/server';
import {
  supabaseAdmin,
  supabaseConfigError,
  supabaseHost,
  hasServiceRoleKey,
  explainSupabaseError,
  inspectKey,
  projectRef,
} from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type CheckStatus = 'ok' | 'fail' | 'warn' | 'skipped';

interface Check {
  name: string;
  status: CheckStatus;
  detail: string;
}

/** Reports whether an env var is present without ever revealing its value. */
function envCheck(name: string, required: boolean): Check {
  const raw = process.env[name];
  const value = (raw ?? '').trim();

  if (!value) {
    return {
      name,
      status: required ? 'fail' : 'warn',
      detail: required ? 'Not set.' : 'Not set (optional, but writes will fail without it).',
    };
  }
  if (raw !== value) {
    return {
      name,
      status: 'warn',
      detail:
        'Set, but has leading or trailing whitespace. It is trimmed at runtime, but clean it up in your environment settings.',
    };
  }
  return { name, status: 'ok', detail: `Set (${value.length} characters).` };
}

/**
 * Compares the project ref embedded in a Supabase key against the ref in the
 * URL. A mismatch is the usual cause of "signature verification failed".
 */
function keyCheck(envName: string, expectedRole: string): Check {
  const key = (process.env[envName] ?? '').trim();
  const name = `${envName} identity`;

  if (!key) return { name, status: 'skipped', detail: 'Not set.' };

  const info = inspectKey(key);

  if (info.format === 'modern') {
    return { name, status: 'ok', detail: 'Using a current-format key (sb_...).' };
  }
  if (info.format !== 'jwt') {
    return {
      name,
      status: 'fail',
      detail: 'Not a recognisable Supabase key. It may have been truncated when pasted — the keys are long, so check the whole value was copied.',
    };
  }
  if (info.expired) {
    return { name, status: 'fail', detail: 'This key has expired. Generate fresh keys in Settings → API.' };
  }
  if (info.role && info.role !== expectedRole) {
    return {
      name,
      status: 'fail',
      detail: `This is a "${info.role}" key, but ${envName} expects the "${expectedRole}" key. The two sit next to each other in Settings → API and are easy to swap.`,
    };
  }
  if (info.ref && projectRef && info.ref !== projectRef) {
    return {
      name,
      status: 'fail',
      detail: `Key belongs to project "${info.ref}" but the URL points at project "${projectRef}". Copy both keys from Settings → API of the "${projectRef}" project.`,
    };
  }
  return {
    name,
    status: 'ok',
    detail: `Valid ${info.role ?? 'unknown'} key for project "${info.ref ?? 'unknown'}".`,
  };
}

/**
 * Diagnostics for the admin setup panel. Returns the state of configuration,
 * connectivity, tables and storage, so a failure names its own cause instead
 * of surfacing "fetch failed".
 */
export async function GET() {
  const checks: Check[] = [
    envCheck('NEXT_PUBLIC_SUPABASE_URL', true),
    envCheck('NEXT_PUBLIC_SUPABASE_ANON_KEY', true),
    envCheck('SUPABASE_SERVICE_ROLE_KEY', false),
    keyCheck('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon'),
    keyCheck('SUPABASE_SERVICE_ROLE_KEY', 'service_role'),
  ];

  if (supabaseConfigError) {
    checks.push({ name: 'Configuration', status: 'fail', detail: supabaseConfigError });
    return NextResponse.json({ ok: false, host: supabaseHost, checks }, { status: 200 });
  }

  checks.push({
    name: 'Configuration',
    status: 'ok',
    detail: `Pointing at ${supabaseHost}.`,
  });

  // Connectivity and table presence in one pass: a reachable project with a
  // missing table reports a different error than an unreachable host.
  const tables = ['portfolio_items', 'contact_submissions', 'site_settings'];
  let reachable = true;

  for (const table of tables) {
    try {
      const { error } = await supabaseAdmin.from(table).select('id').limit(1);
      if (error) {
        if (/fetch failed|ENOTFOUND|EAI_AGAIN|ECONNREFUSED/i.test(error.message)) {
          reachable = false;
        }
        checks.push({
          name: `Table: ${table}`,
          status: 'fail',
          detail: explainSupabaseError(error.message),
        });
      } else {
        checks.push({ name: `Table: ${table}`, status: 'ok', detail: 'Present and readable.' });
      }
    } catch (error: any) {
      reachable = false;
      checks.push({
        name: `Table: ${table}`,
        status: 'fail',
        detail: explainSupabaseError(error),
      });
    }
  }

  if (!hasServiceRoleKey) {
    checks.push({
      name: 'Storage bucket: images',
      status: 'skipped',
      detail: 'Cannot check without SUPABASE_SERVICE_ROLE_KEY.',
    });
  } else if (!reachable) {
    checks.push({
      name: 'Storage bucket: images',
      status: 'skipped',
      detail: 'Skipped because the project is unreachable.',
    });
  } else {
    try {
      const { data, error } = await supabaseAdmin.storage.listBuckets();
      if (error) {
        checks.push({
          name: 'Storage bucket: images',
          status: 'fail',
          detail: explainSupabaseError(error.message),
        });
      } else if (!data?.some((bucket) => bucket.id === 'images')) {
        checks.push({
          name: 'Storage bucket: images',
          status: 'fail',
          detail:
            'The bucket does not exist. Run DATABASE_SETUP.sql, which creates it with a 100MB limit.',
        });
      } else {
        checks.push({
          name: 'Storage bucket: images',
          status: 'ok',
          detail: 'Present. Uploads will work.',
        });
      }
    } catch (error: any) {
      checks.push({
        name: 'Storage bucket: images',
        status: 'fail',
        detail: explainSupabaseError(error),
      });
    }
  }

  return NextResponse.json(
    { ok: !checks.some((c) => c.status === 'fail'), host: supabaseHost, checks },
    { status: 200 }
  );
}
