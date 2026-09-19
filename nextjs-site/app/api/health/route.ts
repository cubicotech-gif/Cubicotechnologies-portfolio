import { NextResponse } from 'next/server';
import {
  supabaseAdmin,
  supabaseConfigError,
  supabaseHost,
  hasServiceRoleKey,
  explainSupabaseError,
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
 * Diagnostics for the admin setup panel. Returns the state of configuration,
 * connectivity, tables and storage, so a failure names its own cause instead
 * of surfacing "fetch failed".
 */
export async function GET() {
  const checks: Check[] = [
    envCheck('NEXT_PUBLIC_SUPABASE_URL', true),
    envCheck('NEXT_PUBLIC_SUPABASE_ANON_KEY', true),
    envCheck('SUPABASE_SERVICE_ROLE_KEY', false),
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
    { ok: checks.every((c) => c.status === 'ok' || c.status === 'warn'), host: supabaseHost, checks },
    { status: 200 }
  );
}
