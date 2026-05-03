'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { ArrowRight, CheckCircle, BookOpen, Star, Download, Shield, RefreshCw } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  active_templates_count?: number;
}

const features = [
  { icon: BookOpen, title: 'Template Lengkap', desc: '30+ template dokumen hukum yang dapat langsung digunakan dan disesuaikan.' },
  { icon: Shield, title: 'Dokumen Terstandar', desc: 'Setiap template telah ditinjau dan sesuai dengan peraturan hukum Indonesia.' },
  { icon: Download, title: 'DOCX & PDF', desc: 'Unduh template dalam format Word atau PDF sesuai kebutuhan Anda.' },
  { icon: Star, title: 'Editor Online', desc: 'Edit template langsung di browser tanpa perlu software tambahan.' },
  { icon: CheckCircle, title: 'Akses Seumur Hidup', desc: 'Bayar sekali, akses semua template selamanya termasuk update terbaru.' },
  { icon: RefreshCw, title: 'Selalu Diperbarui', desc: 'Template diperbarui mengikuti perubahan regulasi dan kebutuhan terkini.' },
];

const testimonials = [
  { name: 'Andi Pratama, S.H.', role: 'Advokat', text: 'Invenlaw sangat membantu pekerjaan saya. Template-nya profesional dan mudah diedit sesuai kebutuhan klien.' },
  { name: 'Sari Dewi', role: 'Pengusaha', text: 'Sebagai pemilik bisnis, saya sering butuh dokumen hukum. Dengan Invenlaw, semuanya jadi lebih mudah dan terjangkau.' },
  { name: 'Dr. Budi Santoso', role: 'Dosen Hukum', text: 'Saya merekomendasikan Invenlaw kepada mahasiswa saya. Template-nya sesuai standar dan sangat edukatif.' },
];

const bgImages = [
  '/invenlaw.webp',
  '/invenlaw-2.webp',
  '/invenlaw-3.webp',
  '/invenlaw-4.webp'
];

export default function HomeClient({ dict, lang }: { dict: any, lang: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data)).catch(() => { });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16 bg-[#0a0a0a]">
        
        {/* Background Image Slider */}
        {bgImages.map((src, index) => (
          <div 
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBg ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              backgroundImage: `url(${src})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
            }} 
          />
        ))}

        {/* Overlay Gradients to blend images with the dark theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#111]/40 to-[#0a0a0a] pointer-events-none" />

        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)' }} />
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full mb-8"
            style={{ background: 'rgba(255,107,0,0.1)', color: '#FF8C00', border: '1px solid rgba(255,107,0,0.2)' }}>
            ⚖️ {dict.home.hero_badge}
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            style={{ fontFamily: 'var(--font-syne)' }}>
            <span style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              {dict.home.hero_title}{' '}
            </span>
            <span style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00, #FFB74D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))' }}>
              {dict.home.hero_title_highlight}
            </span>
          </h1>

          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            {dict.home.hero_desc}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${lang}/pricing`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl transition-all hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)', boxShadow: '0 4px 30px rgba(255,107,0,0.4)' }}>
              {dict.home.hero_cta2} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href={`/${lang}/templates`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl border border-white/10 text-white/80 hover:text-white hover:border-white/20 hover:-translate-y-1 transition-all">
              {dict.home.hero_cta1}
            </Link>
          </div>

          <div className="mt-14 flex items-center justify-center gap-8 text-sm text-white/70"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            {['30+ Template', 'Lifetime Access', 'DOCX & PDF'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
              {dict.home.features_title} <span className="text-orange-400">{dict.home.features_title_highlight}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-8 rounded-2xl border border-white/[0.06] hover:border-orange-500/20 transition-all hover:-translate-y-1"
                style={{ background: 'rgba(22,22,22,0.8)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(255,107,0,0.1)' }}>
                  <f.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="py-24 px-4" style={{ background: '#111' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
                {dict.home.categories_title} <span className="text-orange-400">{dict.home.categories_title_highlight}</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {categories.map(cat => (
                <Link key={cat.id} href={`/${lang}/templates?category=${cat.slug}`}
                  className="group p-8 rounded-2xl border border-white/[0.06] hover:border-orange-500/20 transition-all hover:-translate-y-1"
                  style={{ background: 'rgba(22,22,22,0.8)' }}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(255,107,0,0.1)' }}>
                      <BookOpen className="w-7 h-7 text-orange-400" />
                    </div>
                    {cat.active_templates_count !== undefined && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ background: 'rgba(255,107,0,0.1)', color: '#FF8C00', border: '1px solid rgba(255,107,0,0.2)' }}>
                        {cat.active_templates_count} Template
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">{cat.name}</h3>
                  <p className="text-sm text-white/40">{cat.description}</p>
                  <div className="mt-6 flex items-center text-sm text-orange-400 font-medium gap-1">
                    {dict.home.categories_view_all} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
              Kata Mereka
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 lg:p-8 rounded-2xl border border-white/[0.06]"
                style={{ background: 'rgba(22,22,22,0.8)' }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-sm text-white/50 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-white/30">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4" style={{ background: '#111' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-10 lg:p-16 rounded-3xl border border-white/[0.06] overflow-hidden"
            style={{ background: 'rgba(22,22,22,0.9)' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(255,107,0,0.15) 0%, transparent 70%)' }} />
            <div className="relative">
              <h2 className="text-3xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
                {dict.home.cta_title}
              </h2>
              <p className="text-white/50 max-w-lg mx-auto mb-8">
                {dict.home.cta_desc}
              </p>
              <Link href={`/${lang}/pricing`}
                className="inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold text-white rounded-xl transition-all hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)', boxShadow: '0 4px 30px rgba(255,107,0,0.4)' }}>
                {dict.home.cta_btn} <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="mt-4 text-xs text-white/20">Satu kali pembayaran • Akses seumur hidup • Garansi 30 hari</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
