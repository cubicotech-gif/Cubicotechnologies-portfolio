import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-200 py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <div className="relative w-72 h-24 px-6 py-4 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all">
                <Image
                  src="/images/logos/logo.png"
                  alt="Cubico Technologies Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Empowering Islamic education through innovative digital solutions and creative content.
            </p>
            <div className="flex items-center space-x-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
                <span className="text-xl">📘</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
                <span className="text-xl">🐦</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
                <span className="text-xl">💼</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
                <span className="text-xl">📺</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Home</Link></li>
              <li><Link href="/services" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Services</Link></li>
              <li><Link href="/process" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Our Process</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-gray-900">Services</h4>
            <ul className="space-y-3">
              <li><Link href="/services" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Animation Production</Link></li>
              <li><Link href="/services" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Educational Content</Link></li>
              <li><Link href="/services" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Web Development</Link></li>
              <li><Link href="/services" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Digital Solutions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-gray-900">Contact</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="font-medium">Karachi, Pakistan</li>
              <li><a href="mailto:info@cubico.tech" className="hover:text-gray-900 transition-colors font-medium">info@cubico.tech</a></li>
              <li className="font-medium">+92 XXX XXXXXXX</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm font-medium">&copy; 2024 Cubico Technologies. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
