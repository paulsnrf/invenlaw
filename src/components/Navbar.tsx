'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useDictionary } from '@/components/DictionaryProvider';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { dict, lang } = useDictionary();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === `/${lang}`) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

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
              className="h-[75px] w-auto scale-[2.2] origin-left translate-y-[4px] translate-x-[15px]"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => {
              const active = isActive(link.href);
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`relative text-[13px] font-medium transition-colors py-1 ${active ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-orange-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    >
                      <div className="absolute inset-0 blur-[4px] bg-orange-500/50" />
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Buttons & Lang Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 mr-2 px-2 py-1 rounded-lg border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <Link href={switchLang('id')} className={`text-[11px] font-semibold px-2 py-1 rounded-md transition-colors ${lang === 'id' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}>ID</Link>
              <Link href={switchLang('en')} className={`text-[11px] font-semibold px-2 py-1 rounded-md transition-colors ${lang === 'en' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}>EN</Link>
            </div>

            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
            ) : session ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
                  {session.user?.image ? (
                    <Image src={session.user.image} alt="Profile" width={32} height={32} className="rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-white/80">{session.user?.name?.split(' ')[0] || 'User'}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 py-2 rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all" style={{ background: 'rgba(22,22,22,0.95)', backdropFilter: 'blur(20px)' }}>
                  <Link href={`/${lang}/akun-saya`} className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5">{dict.nav.account}</Link>
                  <button onClick={() => signOut({ callbackUrl: `/${lang}` })} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5">Logout</button>
                </div>
              </div>
            ) : (
              <>
                <Link href={`/${lang}/login`}
                  className="px-4 py-2 text-[12px] font-medium text-white/70 hover:text-white transition-colors">
                  {dict.nav.login}
                </Link>
                <Link href={`/${lang}/register`}
                  className="px-4 py-1 text-[12px] font-semibold text-white rounded-xl transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)', boxShadow: '0 4px 20px rgba(255,107,0,0.3)' }}>
                  {dict.nav.register}
                </Link>
              </>
            )}
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
            <div className="pt-2 flex flex-col gap-2 border-t border-white/5">
              {status === 'loading' ? (
                <div className="h-10 bg-white/10 animate-pulse rounded-xl"></div>
              ) : session ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    {session.user?.image ? (
                      <Image src={session.user.image} alt="Profile" width={40} height={40} className="rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-lg">
                        {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">{session.user?.name}</p>
                      <p className="text-xs text-white/50">{session.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Link href={`/${lang}/akun-saya`} className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white border border-white/10 hover:bg-white/5 transition-all">
                      {dict.nav.account}
                    </Link>
                    <button onClick={() => signOut({ callbackUrl: `/${lang}` })} className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link href={`/${lang}/login`} className="flex-1 text-center py-2.5 rounded-xl text-sm text-white/70 hover:text-white border border-white/10 hover:bg-white/5 transition-all">
                    {dict.nav.login}
                  </Link>
                  <Link href={`/${lang}/register`} className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)' }}>
                    {dict.nav.register}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )
      }
    </nav >
  );
}
