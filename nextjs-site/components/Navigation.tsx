'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-64 h-20 px-6 py-3 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all">
              <Image
                src="/images/logos/logo.png"
                alt="Cubico Technologies Logo"
                fill
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-2">
            <li>
              <Link href="/" className="px-5 py-2.5 rounded-lg text-gray-900 font-semibold transition-all hover:bg-gray-100">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="px-5 py-2.5 rounded-lg text-gray-700 font-medium transition-all hover:text-gray-900 hover:bg-gray-100">
                Services
              </Link>
            </li>
            <li>
              <Link href="/process" className="px-5 py-2.5 rounded-lg text-gray-700 font-medium transition-all hover:text-gray-900 hover:bg-gray-100">
                Process
              </Link>
            </li>
            <li>
              <Link href="/contact" className="ml-3 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:scale-105">
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            <Link href="/" className="block px-4 py-3 rounded-lg text-gray-900 font-semibold bg-gray-100">
              Home
            </Link>
            <Link href="/services" className="block px-4 py-3 rounded-lg text-gray-700 font-medium hover:text-gray-900 hover:bg-gray-100 transition-all">
              Services
            </Link>
            <Link href="/process" className="block px-4 py-3 rounded-lg text-gray-700 font-medium hover:text-gray-900 hover:bg-gray-100 transition-all">
              Process
            </Link>
            <Link href="/contact" className="block px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-center hover:shadow-lg transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
