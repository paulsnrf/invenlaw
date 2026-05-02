'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, Eye, EyeOff, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await api.post('/register', form);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      setErrors(axiosErr?.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  const fieldErr = (key: string) => errors[key]?.[0];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)' }}>
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

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
              {loading ? 'Memproses...' : 'Buat Akun'}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
