'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logos/logo.svg"
                alt="Cubico Technologies Logo"
                width={40}
                height={40}
                className="group-hover:scale-110 transition-transform"
              />
            </div>
            <span className="font-display font-bold text-xl text-white">Cubico</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-1">
            <li>
              <Link href="/" className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:bg-white/5">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="px-4 py-2 rounded-lg text-zinc-400 font-medium transition-all hover:text-white hover:bg-white/5">
                Services
              </Link>
            </li>
            <li>
              <Link href="/process" className="px-4 py-2 rounded-lg text-zinc-400 font-medium transition-all hover:text-white hover:bg-white/5">
                Process
              </Link>
            </li>
            <li>
              <Link href="/contact" className="ml-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-white to-zinc-400 text-black font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all">
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5">
          <div className="px-4 py-4 space-y-2">
            <Link href="/" className="block px-4 py-2 rounded-lg text-white font-medium bg-white/5">
              Home
            </Link>
            <Link href="/services" className="block px-4 py-2 rounded-lg text-zinc-400 font-medium hover:text-white hover:bg-white/5 transition-all">
              Services
            </Link>
            <Link href="/process" className="block px-4 py-2 rounded-lg text-zinc-400 font-medium hover:text-white hover:bg-white/5 transition-all">
              Process
            </Link>
            <Link href="/contact" className="block px-4 py-2 rounded-lg bg-gradient-to-r from-white to-zinc-400 text-black font-semibold text-center">
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
