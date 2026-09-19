'use client';

import { useCallback, useEffect, useState } from 'react';
import Icon from '@/components/Icon';

type CheckStatus = 'ok' | 'fail' | 'warn' | 'skipped';

interface Check {
  name: string;
  status: CheckStatus;
  detail: string;
}

interface Health {
  ok: boolean;
  host: string | null;
  checks: Check[];
}

const STYLES: Record<CheckStatus, { chip: string; icon: 'check' | 'alert-circle' | 'clock' }> = {
  ok: { chip: 'bg-emerald-50 text-emerald-800', icon: 'check' },
  fail: { chip: 'bg-red-50 text-red-700', icon: 'alert-circle' },
  warn: { chip: 'bg-accent-100 text-accent-800', icon: 'alert-circle' },
  skipped: { chip: 'bg-navy-100 text-navy-700', icon: 'clock' },
};

/**
 * Surfaces backend configuration problems in the admin UI. Without this a
 * misconfigured deployment only shows 500s in the browser console.
 */
export default function SetupCheck() {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);

  const run = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health', { cache: 'no-store' });
      setHealth((await response.json()) as Health);
    } catch (error: any) {
      setHealth({
        ok: false,
        host: null,
        checks: [
          {
            name: 'Diagnostics',
            status: 'fail',
            detail: `Could not reach /api/health: ${error.message}. The app server itself may not be running.`,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    run();
  }, [run]);

  // Nothing to say when everything is healthy.
  if (loading || !health || health.ok) return null;

  const failures = health.checks.filter((check) => check.status === 'fail');

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-red-200 bg-red-50/60">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-700">
            <Icon name="alert-circle" size={20} />
          </span>
          <div>
            <h2 className="font-semibold text-red-900">
              The site cannot reach its database
            </h2>
            <p className="text-sm text-red-700">
              {failures.length} check{failures.length === 1 ? '' : 's'} failing. Saving and
              uploading will not work until this is fixed.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={run}
          className="focus-ring rounded-full border border-red-300 bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
        >
          Re-run checks
        </button>
      </div>

      <ul className="divide-y divide-red-100">
        {health.checks.map((check) => {
          const style = STYLES[check.status];
          return (
            <li key={check.name} className="flex gap-3 px-5 py-3">
              <span
                className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full ${style.chip}`}
              >
                <Icon name={style.icon} size={13} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy-950">{check.name}</p>
                <p className="mt-0.5 break-words text-sm leading-6 text-muted">
                  {check.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
