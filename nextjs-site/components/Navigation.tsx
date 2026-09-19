'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Icon from '@/components/Icon';
import { SITE } from '@/lib/site';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/showcase', label: 'Showcase' },
  { href: '/services', label: 'How we work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/site-settings?key=site_logo');
        const data = await response.json();
        if (data.success && data.settings?.value) {
          setLogoUrl(data.settings.value);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    fetchLogo();
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav
        aria-label="Primary"
        className={`w-full border-b transition duration-250 ${
          scrolled
            ? 'border-line bg-white/94 shadow-[0_8px_28px_rgba(16,42,92,0.10)] backdrop-blur-xl'
            : 'border-transparent bg-white/70 backdrop-blur-sm'
        }`}
      >
        <div className="section-shell flex items-center justify-between py-4">
          <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={SITE.name}
                width={266}
                height={80}
                className="h-11 w-auto object-contain"
                quality={100}
                priority
              />
            ) : (
              <>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm"
                >
                  <Icon name="sparkles" size={18} />
                </span>
                <span className="font-semibold tracking-tight text-navy-950">
                  {SITE.shortName}
                </span>
              </>
            )}
          </Link>

          <ul className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`focus-ring rounded-md text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'text-brand-600'
                      : 'text-[#476082] hover:text-brand-600'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link href="/contact" className="btn-dark hidden sm:inline-flex">
              Request a lesson
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="focus-ring rounded-lg p-2 text-navy-950 md:hidden"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="border-t border-line bg-white md:hidden">
            <div className="section-shell space-y-1 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`focus-ring block rounded-lg px-4 py-3 font-semibold transition ${
                    isActive(link.href)
                      ? 'bg-sky text-brand-600'
                      : 'text-[#476082] hover:bg-sky hover:text-brand-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" className="btn-primary mt-2 w-full">
                Request a lesson
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
