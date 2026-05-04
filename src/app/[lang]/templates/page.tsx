'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDictionary } from '@/components/DictionaryProvider';
import api from '@/lib/api';
import {
  Search,
  FileText,
  Download,
  Eye,
  Lock,
  ArrowRight,
  BookOpen,
  Loader2,
  Sparkles,
  Filter,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

interface Template {
  id: string;
  title: string;
  slug: string;
  description: string;
  isPremium: boolean;
  downloadCount: number;
  viewCount: number;
  previewImage?: string;
  category: Category;
}

function TemplatesContent() {
  const { lang, dict } = useDictionary();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchQuery) params.q = searchQuery;
      if (activeCategory) params.category = activeCategory;

      const res = await api.get('/templates', { params });
      setTemplates(res.data.data || []);
    } catch {
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero Header */}
        <section
          className="relative py-20 lg:py-28 px-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)',
          }}
        >
          {/* Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,107,0,0.1) 0%, transparent 70%)',
            }}
          />


          <div className="relative max-w-7xl mx-auto text-center">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full mb-6"
              style={{
                background: 'rgba(255,107,0,0.1)',
                color: '#FF8C00',
                border: '1px solid rgba(255,107,0,0.2)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" /> {dict.templates.hero_badge}
            </span>

            <h1
              className="text-4xl md:text-5xl lg:text-[66px] font-bold mb-4"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              {dict.templates.hero_title.split(' ').slice(0, -2).join(' ')}{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #FF6B00, #FF8C00, #FFB74D)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {dict.templates.hero_title.split(' ').slice(-2).join(' ')}
              </span>
            </h1>
            <p className="text-white/50 text-base max-w-xl mx-auto mb-10">
              {dict.templates.hero_desc}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute -inset-px rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,107,0,0.3), transparent, rgba(255,140,0,0.15))',
                }}
              />
              <div
                className="relative flex items-center rounded-2xl border border-white/[0.06] overflow-hidden"
                style={{ background: 'rgba(22,22,22,0.95)' }}
              >
                <Search className="w-5 h-5 text-white/30 ml-5 shrink-0" />
                <input
                  type="text"
                  placeholder={dict.templates.search_placeholder}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-white/30 px-4 py-4 outline-none text-sm"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
                    className="mr-4 text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    {dict.templates.search_clear}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4" style={{ background: '#0a0a0a' }}>
          <div className="max-w-7xl mx-auto">
            {/* Category Filter */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-white/40" />
                <span className="text-sm font-medium text-white/40">{dict.templates.filter_category}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory('')}
                  className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
                  style={{
                    background: !activeCategory
                      ? 'linear-gradient(135deg, #FF6B00, #FF8C00)'
                      : 'rgba(255,255,255,0.05)',
                    color: !activeCategory ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: !activeCategory
                      ? 'none'
                      : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: !activeCategory
                      ? '0 4px 20px rgba(255,107,0,0.3)'
                      : 'none',
                  }}
                >
                  {dict.templates.filter_all}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setActiveCategory(activeCategory === cat.slug ? '' : cat.slug)
                    }
                    className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
                    style={{
                      background:
                        activeCategory === cat.slug
                          ? 'linear-gradient(135deg, #FF6B00, #FF8C00)'
                          : 'rgba(255,255,255,0.05)',
                      color:
                        activeCategory === cat.slug
                          ? '#fff'
                          : 'rgba(255,255,255,0.5)',
                      border:
                        activeCategory === cat.slug
                          ? 'none'
                          : '1px solid rgba(255,255,255,0.08)',
                      boxShadow:
                        activeCategory === cat.slug
                          ? '0 4px 20px rgba(255,107,0,0.3)'
                          : 'none',
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-orange-400 animate-spin mb-4" />
                <p className="text-sm text-white/30">{dict.templates.loading}</p>
              </div>
            ) : templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(255,107,0,0.1)' }}
                >
                  <BookOpen className="w-10 h-10 text-orange-400/50" />
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {dict.templates.empty_title}
                </h3>
                <p className="text-sm text-white/40 max-w-sm text-center mb-6">
                  {searchQuery
                    ? dict.templates.empty_search_desc.replace('{query}', searchQuery)
                    : dict.templates.empty_desc}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchInput('');
                      setActiveCategory('');
                    }}
                    className="px-6 py-2.5 text-sm font-medium rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
                  >
                    {dict.templates.empty_reset}
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-white/40">
                    {dict.templates.showing.replace('{count}', templates.length)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <Link
                      key={template.id}
                      href={`/${lang}/templates/${template.slug}`}
                      className="group relative rounded-2xl border border-white/[0.06] overflow-hidden transition-all hover:-translate-y-1 hover:border-orange-500/20"
                      style={{ background: 'rgba(22,22,22,0.8)' }}
                    >
                      {/* Card Header / Preview */}
                      <div
                        className="relative h-44 flex items-center justify-center overflow-hidden"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(255,107,0,0.05) 0%, rgba(22,22,22,0.5) 100%)',
                        }}
                      >
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage:
                              'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
                            backgroundSize: '20px 20px',
                          }}
                        />
                        <div className="relative flex flex-col items-center gap-3">
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center"
                            style={{ background: 'rgba(255,107,0,0.15)' }}
                          >
                            <FileText className="w-7 h-7 text-orange-400" />
                          </div>
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
                        </div>

                        {/* Premium Badge */}
                        {template.isPremium && (
                          <div
                            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg"
                            style={{
                              background: 'rgba(255,107,0,0.15)',
                              color: '#FFB74D',
                              border: '1px solid rgba(255,107,0,0.2)',
                            }}
                          >
                            <Lock className="w-3 h-3" /> Premium
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        <h3 className="text-base font-semibold mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                          {template.title}
                        </h3>
                        <p className="text-sm text-white/40 line-clamp-2 leading-relaxed mb-4">
                          {template.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                          <div className="flex items-center gap-4 text-xs text-white/30">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" /> {template.viewCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="w-3.5 h-3.5" /> {template.downloadCount}
                            </span>
                          </div>
                          <span className="flex items-center gap-1 text-xs font-medium text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            {dict.templates.view_details} <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4" style={{ background: '#111' }}>
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="relative p-10 lg:p-16 rounded-3xl border border-white/[0.06] overflow-hidden"
              style={{ background: 'rgba(22,22,22,0.9)' }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse, rgba(255,107,0,0.15) 0%, transparent 70%)',
                }}
              />
              <div className="relative">
                <h2
                  className="text-3xl lg:text-4xl font-bold mb-4"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {dict.home.cta_title}
                </h2>
                <p className="text-white/50 max-w-lg mx-auto mb-8">
                  {dict.home.cta_desc}
                </p>
                <Link
                  href={`/${lang}/pricing`}
                  className="inline-flex items-center gap-2 px-10 py-4 text-base font-semibold text-white rounded-xl transition-all hover:-translate-y-1"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B00, #FF8C00)',
                    boxShadow: '0 4px 30px rgba(255,107,0,0.4)',
                  }}
                >
                  {dict.home.cta_btn} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
        </main>
        <Footer />
      </div>
    }>
      <TemplatesContent />
    </Suspense>
  );
}
