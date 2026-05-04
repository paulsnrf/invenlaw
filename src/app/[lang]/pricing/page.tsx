'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDictionary } from '@/components/DictionaryProvider';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';

export default function PricingPage() {
  const { lang, dict } = useDictionary();
  const price = 99000;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="py-24 px-4"
          style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full mb-6"
              style={{ background: 'rgba(255,107,0,0.1)', color: '#FF8C00', border: '1px solid rgba(255,107,0,0.2)' }}>
              <Zap className="w-3.5 h-3.5" /> {dict.pricing.hero_badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-[66px] font-bold mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
              {dict.pricing.hero_title}
            </h1>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              {dict.pricing.hero_desc}
            </p>

            {/* Card */}
            <div className="mt-16 max-w-md mx-auto relative">
              <div className="absolute -inset-px rounded-3xl"
                style={{ background: 'linear-gradient(135deg, rgba(255,107,0,0.4), transparent, rgba(255,140,0,0.2))' }} />
              <div className="relative p-8 lg:p-10 rounded-3xl border border-white/[0.06] overflow-hidden"
                style={{ background: 'rgba(22,22,22,0.98)' }}>
                {/* Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse, rgba(255,107,0,0.15) 0%, transparent 70%)' }} />

                <div className="relative">
                  <div className="text-sm font-semibold text-orange-400 mb-2">{dict.pricing.card_title}</div>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-5xl font-bold" style={{ fontFamily: 'var(--font-syne)' }}>
                      Rp{price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <p className="text-xs text-white/30 mb-8">{dict.pricing.card_price_desc}</p>

                  <ul className="space-y-3 mb-8 text-left">
                    {dict.pricing.card_features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                        <CheckCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href={`/${lang}/register`}
                    className="flex items-center justify-center gap-2 w-full py-4 text-base font-semibold text-white rounded-xl transition-all hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)', boxShadow: '0 4px 30px rgba(255,107,0,0.4)' }}>
                    {dict.pricing.card_cta} <ArrowRight className="w-5 h-5" />
                  </Link>

                  <p className="text-center text-xs text-white/20 mt-4">
                    {dict.pricing.card_footer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
