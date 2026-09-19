import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

/**
 * Chrome for the public marketing pages. The admin panel sits outside this
 * group so it does not inherit the site navigation and footer.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
