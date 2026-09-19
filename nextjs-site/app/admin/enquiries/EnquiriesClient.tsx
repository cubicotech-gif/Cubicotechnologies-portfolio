'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from '@/components/Icon';
import { Banner, EmptyState, PageHeading, Spinner, type BannerTone } from '@/components/admin/AdminUI';

interface Enquiry {
  id: string;
  institution_name: string;
  contact_name: string;
  role?: string | null;
  work_email: string;
  phone?: string | null;
  curriculum_area: string;
  year_group: string;
  timeline?: string | null;
  project_brief: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

const STATUSES: Enquiry['status'][] = ['new', 'read', 'replied'];

const STATUS_STYLES: Record<Enquiry['status'], string> = {
  new: 'bg-accent-100 text-accent-800',
  read: 'bg-sky text-brand-700',
  replied: 'bg-emerald-50 text-emerald-800',
};

export default function EnquiriesClient() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Enquiry['status']>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ tone: BannerTone; message: string }>({
    tone: 'info',
    message: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      if (data.success) {
        setEnquiries(data.submissions as Enquiry[]);
      } else {
        setBanner({ tone: 'error', message: data.error || 'Could not load enquiries.' });
      }
    } catch (error: any) {
      setBanner({ tone: 'error', message: `Could not load enquiries: ${error.message}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: enquiries.length, new: 0, read: 0, replied: 0 };
    for (const enquiry of enquiries) result[enquiry.status] = (result[enquiry.status] ?? 0) + 1;
    return result;
  }, [enquiries]);

  const visible = useMemo(
    () => (filter === 'all' ? enquiries : enquiries.filter((e) => e.status === filter)),
    [enquiries, filter]
  );

  const setStatus = async (enquiry: Enquiry, status: Enquiry['status']) => {
    // Optimistic: the row updates immediately, and reloads if the write fails.
    setEnquiries((current) =>
      current.map((item) => (item.id === enquiry.id ? { ...item, status } : item))
    );
    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: enquiry.id, status }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Update failed');
    } catch (error: any) {
      setBanner({ tone: 'error', message: `Could not update status: ${error.message}` });
      await load();
    }
  };

  const remove = async (enquiry: Enquiry) => {
    if (!window.confirm(`Delete the enquiry from ${enquiry.institution_name}?`)) return;
    try {
      const response = await fetch(`/api/contact?id=${encodeURIComponent(enquiry.id)}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Delete failed');
      setBanner({ tone: 'success', message: 'Enquiry deleted.' });
      await load();
    } catch (error: any) {
      setBanner({ tone: 'error', message: `Could not delete: ${error.message}` });
    }
  };

  return (
    <>
      <PageHeading
        title="Enquiries"
        subtitle="Requests submitted through the contact form."
      />

      <Banner tone={banner.tone} message={banner.message} />

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter enquiries">
        {(['all', ...STATUSES] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={`focus-ring rounded-full border px-4 py-2 text-sm font-semibold capitalize transition ${
              filter === key
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-line bg-white text-navy-900 hover:border-brand-300'
            }`}
          >
            {key} ({counts[key] ?? 0})
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading enquiries…" />
      ) : visible.length === 0 ? (
        <EmptyState
          title={filter === 'all' ? 'No enquiries yet' : `No ${filter} enquiries`}
          body="Submissions from the contact form appear here, newest first, with the institution, year group and curriculum area attached."
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((enquiry) => {
            const isOpen = expanded === enquiry.id;
            return (
              <li
                key={enquiry.id}
                className="overflow-hidden rounded-2xl border border-line bg-white shadow-card"
              >
                <div className="flex flex-wrap items-center gap-4 p-4">
                  <div className="min-w-48 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[enquiry.status]}`}
                      >
                        {enquiry.status}
                      </span>
                      <span className="text-xs text-muted">
                        {new Date(enquiry.created_at).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="mt-1.5 font-semibold text-navy-950">
                      {enquiry.institution_name}
                    </p>
                    <p className="text-sm text-muted">
                      {enquiry.contact_name}
                      {enquiry.role ? ` — ${enquiry.role}` : ''} &middot;{' '}
                      {enquiry.curriculum_area} &middot; {enquiry.year_group}
                    </p>
                  </div>

                  <div className="flex flex-none flex-wrap items-center gap-1">
                    <a
                      href={`mailto:${enquiry.work_email}?subject=${encodeURIComponent(
                        `Your animated lesson enquiry — ${enquiry.curriculum_area}`
                      )}`}
                      className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-600 hover:bg-sky"
                    >
                      <Icon name="mail" size={15} />
                      Reply
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setExpanded(isOpen ? null : enquiry.id);
                        if (!isOpen && enquiry.status === 'new') setStatus(enquiry, 'read');
                      }}
                      aria-expanded={isOpen}
                      className="focus-ring rounded-lg px-3 py-2 text-sm font-semibold text-[#476082] hover:bg-sky hover:text-brand-700"
                    >
                      {isOpen ? 'Hide' : 'Open'}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(enquiry)}
                      className="focus-ring rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-line bg-canvas p-5">
                    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Detail label="Work email">
                        <a
                          href={`mailto:${enquiry.work_email}`}
                          className="focus-ring rounded text-brand-600 underline underline-offset-2"
                        >
                          {enquiry.work_email}
                        </a>
                      </Detail>
                      <Detail label="Phone">{enquiry.phone || '—'}</Detail>
                      <Detail label="Timeline">{enquiry.timeline || '—'}</Detail>
                      <Detail label="Year group">{enquiry.year_group}</Detail>
                    </dl>

                    <div className="mt-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted">
                        Project brief
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">
                        {enquiry.project_brief}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                      <span className="text-sm font-semibold text-navy-950">
                        Mark as
                      </span>
                      {STATUSES.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setStatus(enquiry, status)}
                          disabled={enquiry.status === status}
                          className="focus-ring rounded-full border border-line bg-white px-3 py-1.5 text-sm font-semibold capitalize text-navy-900 transition hover:border-brand-300 disabled:cursor-default disabled:border-brand-600 disabled:bg-brand-600 disabled:text-white"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{children}</dd>
    </div>
  );
}
