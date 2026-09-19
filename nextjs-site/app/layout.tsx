import type { Metadata } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SITE } from '@/lib/site';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Animated Lessons for Schools`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'educational animation',
    'animated lessons',
    'curriculum animation',
    'Islamic studies animation',
    'Arabic language learning videos',
    'school animation studio',
    'e-learning video production',
  ],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} | Animated Lessons for Schools`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} | Animated Lessons for Schools`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${dmSans.variable} ${fraunces.variable} bg-white font-sans text-ink antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="relative flex min-h-screen flex-col">
          <Navigation />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
