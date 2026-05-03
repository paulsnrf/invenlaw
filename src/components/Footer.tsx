import Link from 'next/link';
import Image from 'next/image';
import { useDictionary } from '@/components/DictionaryProvider';

export default function Footer() {
  const { dict, lang } = useDictionary();
  return (
    <footer className="border-t border-white/[0.06] mt-auto" style={{ background: '#111' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          {/* Brand */}
          <div className="flex-1 max-w-sm">
            <Link href={`/${lang}`} className="flex items-center mb-4">
              <Image
                src="/inven.svg"
                alt="Invenlaw"
                width={110}
                height={110}
                className="h-[110px] w-auto"
              />
            </Link>
            <p className="text-xs text-white/40 leading-relaxed">
              {dict.footer.desc}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">{dict.footer.nav}</h4>
            <ul className="space-y-2">
              {[
                [`/${lang}`, dict.nav.home], 
                [`/${lang}/templates`, dict.nav.templates], 
                [`/${lang}/pricing`, dict.nav.pricing]
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-white/40 hover:text-orange-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">{dict.footer.legal}</h4>
            <ul className="space-y-2">
              {[
                ['#', dict.footer.privacy], 
                ['#', dict.footer.terms], 
                ['#', dict.footer.contact]
              ].map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-white/40 hover:text-orange-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest text-white/20">
            &copy; {new Date().getFullYear()} Invenlaw. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            {/* X (Twitter) */}
            <Link href="#" className="text-white/20 hover:text-orange-500 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Link>
            <Link href="#" className="text-white/20 hover:text-orange-500 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
