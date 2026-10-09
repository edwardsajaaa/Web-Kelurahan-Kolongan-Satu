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
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] font-sans antialiased selection:bg-[#006194] selection:text-white flex flex-col justify-between relative overflow-hidden">
      {/* Ambient Background Glow matching Website Hero */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#cce5ff]/40 via-[#faf8ff] to-[#faf8ff] pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-[#006194]/6 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Top Navbar matching Landing Page */}
      <header className="w-full bg-[#ffffff]/90 backdrop-blur-xl border-b border-[#e2e7ff]/80 shadow-[0_1px_12px_rgba(0,0,0,0.03)] px-4 sm:px-6 lg:px-8 py-3.5 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-1 bg-[#f2f3ff] rounded-full shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <img
                alt="Lambang Kolongan Satu"
                className="w-10 h-10 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmHZWdfGwGmtKd7WQmqYAolpSTVfdzZ9o_PS86bfdJVmhgEbRRth-v4rnoCOXBuQ4rQllgVR5nednaoxhTKE3HaZrfgKH07dp48WXlGpdCkPwVw7t1SLyV-UQxj_n3EiZqaWXZItQiD2p_vqtKi_xSE74TrV0f1V-Azvr4pEqGb2SCR7zqAIzDYHRNzTburxA3gDsFwOEtNColVLoZ5UF1Xy0WSKOkbAkPEIA04HcG2N0n-qDAhHKdo7iOJD-lul2L9S0"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-[17px] text-[#131b2e] tracking-tight leading-tight">
                Kolongan Satu
              </span>
              <span className="text-[12px] text-[#3f4850] font-medium tracking-wide">
                Kota Tomohon
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#006194] bg-white hover:bg-[#e2e7ff] border border-[#e2e7ff] px-4 py-2 rounded-full shadow-xs hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </header>

      {/* 2. Main Container with Cohesive White Card (No Jarring Split Dark Block) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6 z-10">
        <div className="w-full max-w-lg">
          {/* Main Card with clean civic border and subtle shadow */}
          <div className="bg-white rounded-3xl shadow-xl shadow-[#006194]/5 border border-[#dae2fd] p-6 sm:p-8 space-y-6">
            
            {/* Header Section inside Card */}
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center gap-1.5 bg-[#e2e7ff] text-[#006194] px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006194]" />
                <span>Gerbang Keamanan Akses Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">
                Akses Khusus <span className="text-[#006194]">Sekretaris Kelurahan</span>
              </h1>
              <p className="text-xs sm:text-[13px] text-[#535f70] max-w-md mx-auto leading-relaxed">
                Sistem pengelolaan data monografi, persuratan dinas, dan arsip kelurahan diproteksi satu pintu untuk menjamin validitas &amp; kerahasiaan data.
              </p>
            </div>

            {/* Official Authorized Personnel Badge */}
            <div className="bg-[#f8faff] border border-[#dae2fd] rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#006194] to-[#007bb9] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-[#e2e7ff] shrink-0">
                FP
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#006c49] bg-[#e7fce3] border border-[#bbf7a0] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Aparatur Berwenang
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#131b2e] truncate mt-0.5">
                  Ferromel L. Pua, S.Kom
                </h3>
                <p className="text-xs text-[#535f70] font-medium truncate">
                  Sekretaris Kelurahan • NIP: 19780203 200501 1 012
                </p>
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
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#707881] hover:text-[#131b2e] cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Fill Button matching Warm Hero Pill */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleQuickFillSeklur}
                  className="w-full py-2.5 px-4 rounded-full bg-[#ffeed9] hover:bg-[#ffe5c7] text-[#9c4300] border border-[#ffb978]/70 text-xs font-bold transition shadow-xs hover:shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#b84e00]" />
                  <span>Gunakan Kredensial Seklur (Demo Otomatis)</span>
                </button>
              </div>

              {/* Submit Action matching Hero Primary Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-full bg-[#006194] hover:bg-[#007bb9] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#006194]/20 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
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
            <div className="pt-3 border-t border-[#dae2fd] text-[11px] text-[#535f70] space-y-1.5 text-center">
              <p className="flex items-center justify-center space-x-1.5 font-medium">
                <FileCheck2 className="w-3.5 h-3.5 text-[#006c49]" />
                <span>Sistem memvalidasi identitas tunggal untuk mencegah duplikasi &amp; manipulasi data.</span>
              </p>
              <p className="text-[10px] text-[#707881]">
                Pemberitahuan: Warga masyarakat yang membutuhkan layanan mandiri dapat menggunakan fitur di halaman muka tanpa perlu masuk ke portal ini.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="py-4 text-center text-xs text-[#707881] border-t border-[#dae2fd] bg-white/70 backdrop-blur-sm z-10">
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
