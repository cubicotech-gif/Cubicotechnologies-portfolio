'use client';

import type { ReactNode } from 'react';
import Icon from '@/components/Icon';

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export type BannerTone = 'success' | 'error' | 'info';

export function Banner({ tone, message }: { tone: BannerTone; message: string }) {
  if (!message) return null;
  const tones: Record<BannerTone, string> = {
    success: 'bg-emerald-50 text-emerald-900',
    error: 'bg-red-50 text-red-800',
    info: 'bg-sky text-brand-800',
  };
  return (
    <p
      role="status"
      aria-live="polite"
      className={`mb-5 flex items-start gap-3 rounded-xl p-4 text-sm leading-6 ${tones[tone]}`}
    >
      <span className="mt-0.5 flex-none">
        <Icon name={tone === 'success' ? 'check' : tone === 'error' ? 'alert-circle' : 'message-square'} size={17} />
      </span>
      {message}
    </p>
  );
}

export function AdminField({
  id,
  label,
  hint,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-navy-950">
        {label}
        {required && (
          <span className="text-red-600" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
      <h2 className="font-display text-lg font-semibold text-navy-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}

export function Spinner({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-3 rounded-2xl border border-line bg-white p-8 text-sm text-muted">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-brand-600" />
      {label}
    </p>
  );
}
