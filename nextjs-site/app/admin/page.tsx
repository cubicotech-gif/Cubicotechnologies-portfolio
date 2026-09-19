'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon, { type IconName } from '@/components/Icon';
import { PageHeading } from '@/components/admin/AdminUI';
import { SHOWCASE_SECTIONS } from '@/lib/site';

interface Stats {
  academic: number;
  islamic: number;
  hidden: number;
  newEnquiries: number;
  totalEnquiries: number;
}

const EMPTY: Stats = {
  academic: 0,
  islamic: 0,
  hidden: 0,
  newEnquiries: 0,
  totalEnquiries: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [lessonsRes, enquiriesRes] = await Promise.all([
          fetch('/api/portfolio'),
          fetch('/api/contact'),
        ]);
        const [lessonsData, enquiriesData] = await Promise.all([
          lessonsRes.json(),
          enquiriesRes.json(),
        ]);

        const lessons: any[] = lessonsData.success ? lessonsData.items : [];
        const enquiries: any[] = enquiriesData.success ? enquiriesData.submissions : [];

        setStats({
          academic: lessons.filter((l) => l.section !== 'islamic' && l.active !== false).length,
          islamic: lessons.filter((l) => l.section === 'islamic' && l.active !== false).length,
          hidden: lessons.filter((l) => l.active === false).length,
          newEnquiries: enquiries.filter((e) => e.status === 'new').length,
          totalEnquiries: enquiries.length,
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const tiles: { label: string; value: number; hint: string }[] = [
    { label: SHOWCASE_SECTIONS[0].title, value: stats.academic, hint: 'live lessons' },
    { label: SHOWCASE_SECTIONS[1].title, value: stats.islamic, hint: 'live lessons' },
    { label: 'Hidden lessons', value: stats.hidden, hint: 'not on the public site' },
    { label: 'New enquiries', value: stats.newEnquiries, hint: `${stats.totalEnquiries} in total` },
  ];

  const actions: { href: string; icon: IconName; title: string; copy: string }[] = [
    {
      href: '/admin/lessons',
      icon: 'film',
      title: 'Add or edit lessons',
      copy: 'Upload a video, paste a YouTube or Vimeo link, set the poster and reorder each section.',
    },
    {
      href: '/admin/enquiries',
      icon: 'message-square',
      title: 'Read enquiries',
      copy: 'Institution requests from the contact form, with the curriculum area and year group attached.',
    },
    {
      href: '/admin/library',
      icon: 'pen-tool',
      title: 'Media library',
      copy: 'Everything uploaded to storage. Useful for reusing a file or clearing out old media.',
    },
  ];

  return (
    <>
      <PageHeading
        title="Overview"
        subtitle="What is currently live on the public site."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <p className="text-sm font-semibold text-muted">{tile.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-navy-950">
              {loading ? '—' : tile.value}
            </p>
            <p className="mt-1 text-xs text-muted">{tile.hint}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-10 font-display text-xl font-semibold text-navy-950">
        What would you like to do?
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="focus-ring card-lift rounded-2xl border border-line bg-white p-6 shadow-card"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky text-brand-700">
              <Icon name={action.icon} size={22} />
            </span>
            <h3 className="mt-4 font-semibold text-navy-950">{action.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{action.copy}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-600">
              Open
              <Icon name="arrow-right" size={15} />
            </span>
          </Link>
        ))}
      </div>

      {!loading && stats.academic + stats.islamic === 0 && (
        <div className="mt-8 rounded-2xl border border-line bg-sky p-6">
          <h2 className="font-display text-lg font-semibold text-navy-950">
            The showcase is running on sample content
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-800">
            Until you add lessons here, the public showcase falls back to the eight
            built-in samples so the site never looks empty. Your first saved lesson
            replaces all of them.
          </p>
          <Link href="/admin/lessons" className="btn-primary mt-5">
            Add your first lesson
            <Icon name="arrow-right" size={17} />
          </Link>
        </div>
      )}
    </>
  );
}
