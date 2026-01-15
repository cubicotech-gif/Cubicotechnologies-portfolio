import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logos/logo.svg"
                  alt="Cubico Technologies Logo"
                  width={40}
                  height={40}
                />
              </div>
              <span className="font-display font-bold text-xl">Cubico</span>
            </Link>
            <p className="text-zinc-400 mb-6">
              Empowering Islamic education through innovative digital solutions and creative content.
            </p>
            <div className="flex items-center space-x-3">
              <a href="#" className="w-10 h-10 rounded-lg glass hover:bg-white/10 flex items-center justify-center transition-all">
                <span className="text-xl">📘</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass hover:bg-white/10 flex items-center justify-center transition-all">
                <span className="text-xl">🐦</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass hover:bg-white/10 flex items-center justify-center transition-all">
                <span className="text-xl">💼</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass hover:bg-white/10 flex items-center justify-center transition-all">
                <span className="text-xl">📺</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-zinc-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/services" className="text-zinc-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/process" className="text-zinc-400 hover:text-white transition-colors">Our Process</Link></li>
              <li><Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              <li><Link href="/services" className="text-zinc-400 hover:text-white transition-colors">Animation Production</Link></li>
              <li><Link href="/services" className="text-zinc-400 hover:text-white transition-colors">Educational Content</Link></li>
              <li><Link href="/services" className="text-zinc-400 hover:text-white transition-colors">Web Development</Link></li>
              <li><Link href="/services" className="text-zinc-400 hover:text-white transition-colors">Digital Solutions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-zinc-400">
              <li>Karachi, Pakistan</li>
              <li><a href="mailto:info@cubico.tech" className="hover:text-white transition-colors">info@cubico.tech</a></li>
              <li>+92 XXX XXXXXXX</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-400 text-sm">&copy; 2024 Cubico Technologies. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
