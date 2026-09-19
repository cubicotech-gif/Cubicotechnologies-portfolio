'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon, { type IconName } from '@/components/Icon';

const links: { href: string; label: string; icon: IconName }[] = [
  { href: '/admin', label: 'Overview', icon: 'blocks' },
  { href: '/admin/lessons', label: 'Lessons', icon: 'film' },
  { href: '/admin/enquiries', label: 'Enquiries', icon: 'message-square' },
  { href: '/admin/library', label: 'Media library', icon: 'pen-tool' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-950 text-white"
          >
            <Icon name="sparkles" size={18} />
          </span>
          <div>
            <p className="font-semibold leading-tight text-navy-950">Studio admin</p>
            <p className="text-xs text-muted">Manage lessons and enquiries</p>
          </div>
        </div>

        <nav aria-label="Admin sections" className="order-3 w-full sm:order-2 sm:w-auto">
          <ul className="flex flex-wrap gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`focus-ring inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive(link.href)
                      ? 'bg-sky text-brand-700'
                      : 'text-[#476082] hover:bg-sky hover:text-brand-700'
                  }`}
                >
                  <Icon name={link.icon} size={16} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/"
          className="order-2 focus-ring inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-brand-600 hover:text-brand-700 sm:order-3"
        >
          View site
          <Icon name="external-link" size={15} />
        </Link>
      </div>
    </header>
  );
}
