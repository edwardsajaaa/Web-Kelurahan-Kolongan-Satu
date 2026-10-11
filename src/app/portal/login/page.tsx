'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Award,
  Database,
  Building,
} from 'lucide-react';

function PortalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/portal';

  const [selectedRole, setSelectedRole] = useState<'lurah' | 'seklur'>('seklur');
  const [identifier, setIdentifier] = useState('19780203 200902 2 002');
  const [password, setPassword] = useState('seklur123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick fill handlers
  const handleSelectLurah = () => {
    setSelectedRole('lurah');
    setIdentifier('19731206 200312 2 007');
    setPassword('lurah123');
    setErrorMessage(null);
  };

  const handleSelectSeklur = () => {
    setSelectedRole('seklur');
    setIdentifier('19780203 200902 2 002');
    setPassword('seklur123');
    setErrorMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Mohon masukkan NIP/ID Pengguna dan Kata Sandi.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Login gagal. Periksa kembali kredensial Anda.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage(`Autentikasi Berhasil! Mengalihkan ke Portal sebagai ${data.user.roleTitle}...`);

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'kkt_portal_auth',
          data.user.roleCode === 'superadmin' ? 'lurah_authenticated' : 'seklur_authenticated'
        );
        localStorage.setItem('kkt_user_name', data.user.name);
        localStorage.setItem('kkt_user_nip', data.user.nip);
        localStorage.setItem('kkt_user_role', data.user.roleCode);
      }

      setTimeout(() => {
        router.push(redirectTarget);
        router.refresh();
      }, 700);
    } catch (err: any) {
      setErrorMessage(`Terjadi kesalahan jaringan: ${err.message || 'Gagal menghubungi server'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/40 via-slate-50 to-slate-50 pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs px-4 sm:px-6 lg:px-8 py-3.5 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-1 bg-slate-100 rounded-xl shadow-xs shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
              <img
                alt="Lambang Kota Tomohon - Kelurahan Kolongan Satu"
                className="w-10 h-10 object-contain"
                src="/images/logo-tomohon.png"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-[17px] text-slate-900 tracking-tight leading-tight">
                Kolongan Satu
              </span>
              <span className="text-[12px] text-slate-500 font-medium tracking-wide">
                Kecamatan Tomohon Tengah
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-brand-700 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-xs hover:shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6 z-10">
        <div className="w-full max-w-xl">
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/90 p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-200/70 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>Gerbang Keamanan Akses Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Masuk Portal <span className="text-brand-600">Aparatur Kelurahan</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Akses portal e-Monografi dilindungi dan hanya dapat diakses oleh aparatur kelurahan berwenang:{' '}
                <strong>Lurah</strong> &amp; <strong>Sekretaris Kelurahan</strong>.
              </p>
            </div>

            {/* Quick Role Selector (Lurah vs Seklur) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider">
                Pilih Akun Aparatur:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Akun Lurah */}
                <button
                  type="button"
                  onClick={handleSelectLurah}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    selectedRole === 'lurah'
                      ? 'bg-brand-50/90 border-brand-300 ring-2 ring-brand-500/20 shadow-xs'
                      : 'bg-slate-50/80 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    TK
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-brand-700 block uppercase">
                      Lurah (Superadmin)
                    </span>
                    <p className="text-xs font-bold text-slate-900 truncate">
                      Theresia J. Kaunang, SE
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      NIP: 19731206...
                    </p>
                  </div>
                </button>

                {/* 2. Akun Seklur */}
                <button
                  type="button"
                  onClick={handleSelectSeklur}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    selectedRole === 'seklur'
                      ? 'bg-brand-50/90 border-brand-300 ring-2 ring-brand-500/20 shadow-xs'
                      : 'bg-slate-50/80 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    FP
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-emerald-700 block uppercase">
                      Sekretaris Kelurahan
                    </span>
                    <p className="text-xs font-bold text-slate-900 truncate">
                      Febronia L. Pijoh, S.Kom
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      NIP: 19780203...
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Error / Success Notifications */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-2xl flex items-start space-x-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-2xl flex items-start space-x-2.5 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{successMessage}</p>
              </div>
            )}

            {/* Form Input */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  NIP / ID Pengguna Aparatur *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Masukkan NIP atau ID pengguna (contoh: lurah atau seklur)"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kata Sandi / PIN Keamanan *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi portal"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-brand-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer active:scale-98"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Otoritas Supabase...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Masuk ke Portal e-Monografi</span>
                  </>
                )}
              </button>
            </form>

            {/* Supabase Security Badge Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-brand-600" />
                <span>Database Supabase PostgreSQL Terkoneksi</span>
              </span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Audit Trail Aktif</span>
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200/80 bg-white/60">
        Sistem Informasi Pemerintahan &amp; Monografi Digital Kelurahan Kolongan Satu © 2026. Seluruh hak cipta dilindungi.
      </footer>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
        </div>
      }
    >
      <PortalLoginForm />
    </Suspense>
  );
}
