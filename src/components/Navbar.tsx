'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Scale } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/templates', label: 'Template' },
  { href: '/pricing', label: 'Harga' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
      style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)' }}>
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>
              Invenlaw
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login"
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
              Masuk
            </Link>
            <Link href="/register"
              className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)', boxShadow: '0 4px 20px rgba(255,107,0,0.3)' }}>
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] px-4 py-4 space-y-2"
          style={{ background: 'rgba(17,17,17,0.97)' }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className="block px-4 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors"
              onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex gap-2 border-t border-white/5">
            <Link href="/login" className="flex-1 text-center py-2.5 rounded-xl text-sm text-white/70 hover:text-white border border-white/10 hover:bg-white/5 transition-all">
              Masuk
            </Link>
            <Link href="/register" className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)' }}>
              Daftar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
