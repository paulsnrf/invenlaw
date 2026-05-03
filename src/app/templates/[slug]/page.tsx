'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import {
  FileText,
  Download,
  Eye,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  BookOpen,
  Share2,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Template {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  isPremium: boolean;
  downloadCount: number;
  viewCount: number;
  fileUrl?: string;
  previewImage?: string;
  category: Category;
  createdAt: string;
}

interface RelatedTemplate {
  id: string;
  title: string;
  slug: string;
  description: string;
  isPremium: boolean;
  downloadCount: number;
  viewCount: number;
}

export default function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [template, setTemplate] = useState<Template | null>(null);
  const [related, setRelated] = useState<RelatedTemplate[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/templates/${slug}`);
        setTemplate(res.data.template);
        setRelated(res.data.related || []);
        setIsSubscribed(res.data.is_subscribed || false);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-orange-400 animate-spin mb-4" />
            <p className="text-sm text-white/30">Memuat template...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !template) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(255,107,0,0.1)' }}
            >
              <BookOpen className="w-10 h-10 text-orange-400/50" />
            </div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Template Tidak Ditemukan
            </h2>
            <p className="text-sm text-white/40 mb-6">
              Template yang Anda cari mungkin telah dihapus atau tidak tersedia.
            </p>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Template
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Header */}
        <section
          className="relative py-16 lg:py-24 px-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
          }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/30 mb-8">
              <Link
                href="/templates"
                className="hover:text-white/60 transition-colors"
              >
                Template
              </Link>
              <span>/</span>
              <span className="text-white/50">
                {template.category?.name || 'Umum'}
              </span>
              <span>/</span>
              <span className="text-white/70 truncate max-w-[200px]">
                {template.title}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left: Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(255,107,0,0.1)',
                      color: '#FF8C00',
                      border: '1px solid rgba(255,107,0,0.2)',
                    }}
                  >
                    {template.category?.name || 'Umum'}
                  </span>
                  {template.isPremium && (
                    <span
                      className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: 'rgba(255,107,0,0.15)',
                        color: '#FFB74D',
                        border: '1px solid rgba(255,107,0,0.2)',
                      }}
                    >
                      <Lock className="w-3 h-3" /> Premium
                    </span>
                  )}
                </div>

                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {template.title}
                </h1>

                <p className="text-white/50 text-base leading-relaxed mb-8 max-w-2xl">
                  {template.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-white/40">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" /> {template.viewCount} dilihat
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Download className="w-4 h-4" /> {template.downloadCount}{' '}
                    unduhan
                  </span>
                </div>
              </div>

              {/* Right: Action Card */}
              <div className="lg:w-80 shrink-0">
                <div className="relative">
                  <div
                    className="absolute -inset-px rounded-2xl"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,107,0,0.3), transparent, rgba(255,140,0,0.15))',
                    }}
                  />
                  <div
                    className="relative p-6 rounded-2xl border border-white/[0.06]"
                    style={{ background: 'rgba(22,22,22,0.95)' }}
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                      style={{ background: 'rgba(255,107,0,0.1)' }}
                    >
                      <FileText className="w-8 h-8 text-orange-400" />
                    </div>

                    {template.isPremium && !isSubscribed ? (
                      <>
                        <p className="text-center text-sm text-white/50 mb-5">
                          Template ini memerlukan akses Premium untuk diunduh.
                        </p>
                        <Link
                          href="/pricing"
                          className="flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold text-white rounded-xl transition-all hover:-translate-y-0.5"
                          style={{
                            background:
                              'linear-gradient(135deg, #FF6B00, #FF8C00)',
                            boxShadow: '0 4px 30px rgba(255,107,0,0.4)',
                          }}
                        >
                          Dapatkan Akses <ArrowRight className="w-4 h-4" />
                        </Link>
                        <p className="text-center text-xs text-white/20 mt-3">
                          Mulai dari Rp99.000 • Akses seumur hidup
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-center text-sm text-white/50 mb-5">
                          Template ini siap untuk diunduh.
                        </p>
                        <button
                          className="flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold text-white rounded-xl transition-all hover:-translate-y-0.5"
                          style={{
                            background:
                              'linear-gradient(135deg, #FF6B00, #FF8C00)',
                            boxShadow: '0 4px 30px rgba(255,107,0,0.4)',
                          }}
                        >
                          <Download className="w-4 h-4" /> Download Template
                        </button>
                      </>
                    )}

                    <button className="flex items-center justify-center gap-2 w-full py-3 mt-3 text-sm font-medium text-white/50 rounded-xl border border-white/10 hover:text-white hover:border-white/20 transition-all">
                      <Share2 className="w-4 h-4" /> Bagikan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        {template.content && (
          <section className="py-16 px-4">
            <div className="max-w-3xl mx-auto">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                Tentang Template Ini
              </h2>
              <div
                className="prose prose-invert prose-sm max-w-none text-white/60 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: template.content }}
              />
            </div>
          </section>
        )}

        {/* Features */}
        <section className="py-16 px-4" style={{ background: '#111' }}>
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-2xl font-bold mb-8"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Yang Anda Dapatkan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Format DOCX yang mudah diedit',
                'Sesuai dengan hukum Indonesia',
                'Panduan pengisian dokumen',
                'Update template gratis selamanya',
                'Dapat digunakan berulang kali',
                'Dukungan via email',
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06]"
                  style={{ background: 'rgba(22,22,22,0.8)' }}
                >
                  <CheckCircle className="w-5 h-5 text-orange-400 shrink-0" />
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Templates */}
        {related.length > 0 && (
          <section className="py-16 px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  Template Terkait
                </h2>
                <Link
                  href="/templates"
                  className="text-sm text-orange-400 font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Lihat Semua <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((t) => (
                  <Link
                    key={t.id}
                    href={`/templates/${t.slug}`}
                    className="group p-5 rounded-2xl border border-white/[0.06] hover:border-orange-500/20 transition-all hover:-translate-y-1"
                    style={{ background: 'rgba(22,22,22,0.8)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: 'rgba(255,107,0,0.1)' }}
                    >
                      <FileText className="w-5 h-5 text-orange-400" />
                    </div>
                    <h4 className="text-sm font-semibold mb-1 group-hover:text-orange-400 transition-colors line-clamp-2">
                      {t.title}
                    </h4>
                    <p className="text-xs text-white/30 line-clamp-2">
                      {t.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
