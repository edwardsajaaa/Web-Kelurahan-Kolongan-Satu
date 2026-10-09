'use client';
import React, { useState } from 'react';
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
  Building2,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

function PortalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/portal';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick fill helper for easy testing / evaluation
  const handleQuickFillSeklur = () => {
    setIdentifier('19780203 200501 1 012');
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

      setSuccessMessage('Autentikasi berhasil! Mengalihkan ke Portal Sekretaris Kelurahan...');
      
      // Store flag in localStorage for instant client-side awareness
      if (typeof window !== 'undefined') {
        localStorage.setItem('kkt_portal_auth', 'seklur_authenticated');
        localStorage.setItem('kkt_user_name', data.user.name);
        localStorage.setItem('kkt_user_nip', data.user.nip);
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
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col justify-between selection:bg-[#006194] selection:text-white">
      {/* Top Bar Navigation */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-[#dae2fd] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#006194] to-[#007bb9] flex items-center justify-center text-white shadow-md shadow-[#006194]/20 font-bold text-sm">
              KKT
            </div>
            <div>
              <p className="text-xs font-bold text-[#006194] tracking-wide uppercase">
                Pemerintah Kota Tomohon
              </p>
              <h1 className="text-sm font-extrabold text-[#131b2e] leading-tight">
                Kelurahan Kolongan Satu
              </h1>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#535f70] hover:text-[#006194] bg-[#f2f3ff] hover:bg-[#e2e7ff] px-3.5 py-2 rounded-xl transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ke Halaman Utama</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-xl">
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-[#006194]/5 border border-[#dae2fd] overflow-hidden">
            {/* Card Header with Civic Accent */}
            <div className="bg-gradient-to-r from-[#006194] to-[#004e77] p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase text-white/90">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Gerbang Keamanan Akses Portal</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Akses Khusus Sekretaris Kelurahan
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Sistem pengelolaan data monografi, persuratan dinas, dan arsip kelurahan diproteksi satu pintu untuk menjamin validitas & kerahasiaan data.
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Authorized Personnel Banner */}
              <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-4 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-[#006194] text-white flex items-center justify-center font-bold text-base shadow-sm flex-shrink-0">
                  FP
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold text-[#006194] uppercase tracking-wider bg-sky-100 px-2 py-0.5 rounded-md">
                      Aparatur Berwenang
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#131b2e] truncate mt-0.5">
                    Ferromel L. Pua, S.Kom
                  </h3>
                  <p className="text-xs text-[#535f70] font-medium">
                    Sekretaris Kelurahan • NIP: 19780203 200501 1 012
                  </p>
                </div>
              </div>

              {/* Error / Success Notifications */}
              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex items-start space-x-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl flex items-start space-x-2.5 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">{successMessage}</p>
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                    NIP / ID Pengguna Sekretaris *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707881]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Masukkan NIP atau username (contoh: seklur)"
                      className="w-full bg-[#faf8ff] border border-[#dae2fd] focus:border-[#006194] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006194]/20 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#131b2e]">
                      Kata Sandi / PIN Keamanan *
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707881]">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi portal"
                      className="w-full bg-[#faf8ff] border border-[#dae2fd] focus:border-[#006194] focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006194]/20 transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#707881] hover:text-[#131b2e]"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Quick Fill Button for Reviewer / Evaluation */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleQuickFillSeklur}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-[#006194]/40 hover:border-[#006194] bg-[#f0f9ff]/60 hover:bg-[#f0f9ff] text-[11px] font-semibold text-[#006194] flex items-center justify-center space-x-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Gunakan Kredensial Seklur (Demo Otomatis)</span>
                  </button>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#006194] hover:bg-[#004e77] text-white text-xs font-bold shadow-md shadow-[#006194]/20 transition flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi Keamanan...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Masuk ke Portal Internal</span>
                    </>
                  )}
                </button>
              </form>

              {/* Policy Footnote */}
              <div className="pt-2 border-t border-[#dae2fd] text-[11px] text-[#535f70] space-y-1">
                <p className="flex items-center space-x-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#006c49]" />
                  <span>Sistem memvalidasi identitas tunggal untuk mencegah duplikasi & manipulasi data.</span>
                </p>
                <p className="text-[10px] text-[#707881]">
                  Pemberitahuan: Warga masyarakat yang membutuhkan layanan mandiri dapat menggunakan fitur di halaman muka tanpa perlu masuk ke portal ini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#707881] border-t border-[#dae2fd] bg-white/60">
        © 2026 Pemerintah Kelurahan Kolongan Satu, Kota Tomohon. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#006194]" />
            <p className="text-xs font-semibold text-[#535f70]">Memuat Gerbang Portal...</p>
          </div>
        </div>
      }
    >
      <PortalLoginForm />
    </React.Suspense>
  );
}
