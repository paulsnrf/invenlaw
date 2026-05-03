'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useDictionary } from '@/components/DictionaryProvider';

export default function Navbar() {
  const { dict, lang } = useDictionary();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Helper to switch language in the URL
  const switchLang = (newLang: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    // Check if the first segment is a locale
    if (segments[1] === 'id' || segments[1] === 'en') {
      segments[1] = newLang;
      return segments.join('/') || '/';
    }
    return `/${newLang}${pathname}`;
  };

  const navLinks = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/templates`, label: dict.nav.templates },
    { href: `/${lang}/pricing`, label: dict.nav.pricing },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
      style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center group">
            <Image
              src="/inven.svg"
              alt="Invenlaw"
              width={75}
              height={75}
              className="h-[75px] w-auto scale-170 origin-left translate-y-[2px]"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="text-[13px] font-medium text-white/60 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Buttons & Lang Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 mr-2 px-2 py-1 rounded-lg border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <Link href={switchLang('id')} className={`text-[11px] font-semibold px-2 py-1 rounded-md transition-colors ${lang === 'id' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}>ID</Link>
              <Link href={switchLang('en')} className={`text-[11px] font-semibold px-2 py-1 rounded-md transition-colors ${lang === 'en' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}>EN</Link>
            </div>

            <Link href={`/${lang}/login`}
              className="px-4 py-2 text-[12px] font-medium text-white/70 hover:text-white transition-colors">
              {dict.nav.login}
            </Link>
            <Link href={`/${lang}/register`}
              className="px-4 py-1 text-[12px] font-semibold text-white rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)', boxShadow: '0 4px 20px rgba(255,107,0,0.3)' }}>
              {dict.nav.register}
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
      {
        mobileOpen && (
          <div className="md:hidden border-t border-white/[0.06] px-4 py-4 space-y-2"
            style={{ background: 'rgba(17,17,17,0.97)' }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="block px-4 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors"
                onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="pt-3 pb-2 flex gap-2 border-t border-white/5 justify-center">
              <Link href={switchLang('id')} className={`flex-1 text-center py-2 rounded-lg text-sm font-semibold transition-colors ${lang === 'id' ? 'bg-orange-500 text-white' : 'text-white/40 border border-white/10 hover:text-white'}`}>ID</Link>
              <Link href={switchLang('en')} className={`flex-1 text-center py-2 rounded-lg text-sm font-semibold transition-colors ${lang === 'en' ? 'bg-orange-500 text-white' : 'text-white/40 border border-white/10 hover:text-white'}`}>EN</Link>
            </div>
            <div className="pt-2 flex gap-2 border-t border-white/5">
              <Link href={`/${lang}/login`} className="flex-1 text-center py-2.5 rounded-xl text-sm text-white/70 hover:text-white border border-white/10 hover:bg-white/5 transition-all">
                {dict.nav.login}
              </Link>
              <Link href={`/${lang}/register`} className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)' }}>
                {dict.nav.register}
              </Link>
            </div>
          </div>
        )
      }
    </nav >
  );
}
