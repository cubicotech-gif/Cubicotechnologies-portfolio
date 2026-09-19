import Link from 'next/link';
import Icon from '@/components/Icon';
import { SITE } from '@/lib/site';

const quickLinks = [
  { href: '/showcase', label: 'Showcase' },
  { href: '/services', label: 'How we work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const subjectLinks = [
  { href: '/showcase#academic', label: 'Academic Concepts' },
  { href: '/showcase#islamic', label: 'Islamic Studies & Arabic' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-white">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white"
            >
              <Icon name="sparkles" size={18} />
            </span>
            <span className="font-semibold tracking-tight">{SITE.shortName}</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#c8d9f4]">
            {SITE.description}
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="focus-ring mt-5 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-white hover:text-accent-300"
          >
            <Icon name="mail" size={17} />
            {SITE.email}
          </a>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8fd2ff]">
            Studio
          </h2>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus-ring rounded text-sm text-[#c8d9f4] transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Showcase sections">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8fd2ff]">
            Lesson areas
          </h2>
          <ul className="mt-4 space-y-2.5">
            {subjectLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus-ring rounded text-sm text-[#c8d9f4] transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="section-shell">
        <div className="flex flex-col gap-3 border-t border-white/15 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#a9c0e5]">
            &copy; {year} {SITE.name}. All rights reserved.
          </p>
          <p className="text-sm text-[#a9c0e5]">
            Thoughtful animation for clearer learning.
          </p>
        </div>
      </div>
    </footer>
  );
}
