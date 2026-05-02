'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, Eye, EyeOff, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/login', form);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; errors?: { email?: string[] } } } };
      setError(axiosErr?.response?.data?.errors?.email?.[0] || axiosErr?.response?.data?.message || 'Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)' }}>
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)' }}>
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl" style={{ fontFamily: 'var(--font-syne)' }}>Invenlaw</span>
          </Link>
          <h1 className="text-2xl font-bold mb-1">Selamat Datang Kembali</h1>
          <p className="text-white/40 text-sm">Masuk untuk mengakses template hukum Anda</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl border border-white/[0.08]"
          style={{ background: 'rgba(22,22,22,0.95)', backdropFilter: 'blur(20px)' }}>
          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 rounded-xl text-sm text-red-400"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <input type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="nama@email.com" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" required
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C00)', boxShadow: '0 4px 20px rgba(255,107,0,0.3)' }}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Belum punya akun?{' '}
            <Link href="/register" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Daftar gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
