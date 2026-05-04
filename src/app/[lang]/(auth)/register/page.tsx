'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Scale, Eye, EyeOff, AlertCircle, ChevronLeft } from 'lucide-react';
import { signIn } from 'next-auth/react';

// Svg Icons for OAuth
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'id';
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (form.password !== form.password_confirmation) {
      setErrors({ password: ['Password konfirmasi tidak cocok.'] });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ email: [data.message || 'Terjadi kesalahan'] });
        return;
      }

      // Auto login after successful registration
      const signInRes = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (signInRes?.error) {
        setErrors({ email: [signInRes.error] });
      } else {
        router.push(`/${lang}`);
      }
    } catch (err) {
      setErrors({ email: ['Gagal menghubungi server. Silakan coba lagi.'] });
    } finally {
      setLoading(false);
    }
  };

  const fieldErr = (key: string) => errors[key]?.[0];

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)' }}>
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-8 left-8 md:top-10 md:left-10 p-2.5 rounded-full bg-white/[0.03] border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-xl group z-10 hidden sm:flex"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* Mobile Back Button (smaller, less padding) */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-4 p-2 rounded-full bg-white/[0.03] border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all backdrop-blur-xl group z-10 sm:hidden"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)' }}>
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl" style={{ fontFamily: 'var(--font-syne)' }}>Invenlaw</span>
          </Link>
          <h1 className="text-2xl font-bold mb-1">Buat Akun Baru</h1>
          <p className="text-white/40 text-sm">Daftar gratis dan mulai akses template hukum</p>
        </div>

        <div className="p-8 rounded-2xl border border-white/[0.08]"
          style={{ background: 'rgba(22,22,22,0.95)', backdropFilter: 'blur(20px)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Nama Lengkap</label>
              <input type="text" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Nama Anda" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${fieldErr('name') ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}` }}
              />
              {fieldErr('name') && <p className="text-xs text-red-400 mt-1">{fieldErr('name')}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <input type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="nama@email.com" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${fieldErr('email') ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}` }}
              />
              {fieldErr('email') && <p className="text-xs text-red-400 mt-1">{fieldErr('email')}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 karakter" required minLength={8}
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${fieldErr('password') ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}` }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErr('password') && <p className="text-xs text-red-400 mt-1">{fieldErr('password')}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Konfirmasi Password</label>
              <input type={showPass ? 'text' : 'password'} value={form.password_confirmation}
                onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                placeholder="Ulangi password" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>

            {Object.keys(errors).length > 0 && !['name','email','password'].some(k => errors[k]) && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-red-400"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                Terjadi kesalahan, silakan coba lagi.
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)', boxShadow: '0 4px 20px rgba(255,107,0,0.3)' }}>
              {loading ? 'Memproses...' : 'Daftar dengan Email'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.06]"></div>
            <span className="text-xs font-medium text-white/30 uppercase tracking-wider">Atau daftar dengan</span>
            <div className="flex-1 h-px bg-white/[0.06]"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button type="button" onClick={() => signIn('google', { callbackUrl: `/${lang}` })}
              className="flex items-center justify-center py-3 px-4 rounded-xl text-white hover:bg-white/5 transition-all border border-white/[0.08] hover:border-white/20">
              <GoogleIcon />
            </button>
            <button type="button" onClick={() => alert('Facebook Login Segera Hadir!')}
              className="flex items-center justify-center py-3 px-4 rounded-xl text-white hover:bg-[#1877F2]/10 transition-all border border-white/[0.08] hover:border-[#1877F2]/50">
              <FacebookIcon />
            </button>
            <button type="button" onClick={() => alert('X Login Segera Hadir!')}
              className="flex items-center justify-center py-3 px-4 rounded-xl text-white hover:bg-white/5 transition-all border border-white/[0.08] hover:border-white/40">
              <XIcon />
            </button>
          </div>

          <p className="text-center text-sm text-white/40 mt-8">
            Sudah punya akun?{' '}
            <Link href={`/${lang}/login`} className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
