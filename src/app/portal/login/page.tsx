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
  Database,
  Building,
  Key,
  ShieldAlert,
  Phone,
  HelpCircle,
  X,
  MessageCircle,
} from 'lucide-react';

function PortalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/portal';
  const expiredReason = searchParams.get('expired');

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Mohon masukkan NIP atau Email resmi serta Kata Sandi Anda.');
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
        if (typeof data.rateLimitRemaining === 'number') {
          setRateLimitRemaining(data.rateLimitRemaining);
        }
        if (data.isLocked) {
          setIsLocked(true);
        }
        setIsLoading(false);
        return;
      }

      setSuccessMessage(`Autentikasi Berhasil! Mengalihkan ke Portal sebagai ${data.user.roleTitle}...`);
      setIsLocked(false);
      setRateLimitRemaining(null);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'kkt_portal_auth',
          data.user.roleCode === 'superadmin' ? 'lurah_authenticated' : 'seklur_authenticated'
        );
        sessionStorage.setItem('kkt_user_name', data.user.name);
        sessionStorage.setItem('kkt_user_nip', data.user.nip);
        sessionStorage.setItem('kkt_user_email', data.user.email);
        sessionStorage.setItem('kkt_user_role', data.user.roleCode);

        // Hapus localStorage agar tidak ada kredensial yang tersimpan permanen di perangkat
        localStorage.removeItem('kkt_portal_auth');
        localStorage.removeItem('kkt_user_name');
        localStorage.removeItem('kkt_user_nip');
        localStorage.removeItem('kkt_user_email');
        localStorage.removeItem('kkt_user_role');
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

  const handleOpenForgotModal = () => {
    setForgotIdentifier(identifier.trim());
    setForgotPhone('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setForgotError(null);
    setForgotSuccess(null);
    setIsForgotModalOpen(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim() || !forgotPhone.trim() || !forgotNewPassword.trim()) {
      setForgotError('Seluruh kolom verifikasi wajib diisi.');
      return;
    }

    if (forgotNewPassword.length < 8) {
      setForgotError('Kata sandi baru minimal 8 karakter demi keamanan.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Konfirmasi kata sandi baru tidak cocok. Periksa kembali.');
      return;
    }

    setForgotError(null);
    setIsForgotLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: forgotIdentifier.trim(),
          phoneVerification: forgotPhone.trim(),
          newPassword: forgotNewPassword.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setForgotError(data.message || 'Gagal memperbarui kata sandi.');
        setIsForgotLoading(false);
        return;
      }

      setForgotSuccess(data.message);
      setIdentifier(forgotIdentifier.trim());
      setPassword(forgotNewPassword.trim());
      setIsForgotLoading(false);

      setTimeout(() => {
        setIsForgotModalOpen(false);
        setSuccessMessage('Kata sandi baru berhasil disimpan! Silakan klik tombol Masuk.');
      }, 1500);
    } catch (err: any) {
      setForgotError(`Terjadi kesalahan server: ${err.message || 'Koneksi gagal'}`);
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-800 font-sans antialiased flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/40 via-[#faf8ff] to-[#faf8ff] pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="w-full bg-white/90 backdrop-blur-xl border-b border-[#dae2fd] shadow-2xs px-4 sm:px-6 lg:px-8 py-3.5 z-20">
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
            className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-primary bg-white hover:bg-slate-50 border border-[#dae2fd] px-4 py-2 rounded-xl shadow-xs hover:shadow-sm transition-all"
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
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-[#dae2fd] p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Portal Aparatur Resmi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Masuk Portal <span className="text-primary">Aparatur</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Akses khusus <strong>Lurah</strong> &amp; <strong>Sekretaris Kelurahan</strong> Kolongan Satu.
              </p>
            </div>

            {/* Official Security Architecture Banner */}
            <div className="bg-[#faf8ff] p-4 rounded-2xl border border-[#dae2fd] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Sistem Autentikasi Kriptografis
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Supabase Live
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Silakan masuk menggunakan <strong>NIP resmi</strong> (18 digit) atau <strong>Email kedinasan</strong> Anda. Sistem dilindungi verifikasi password terenkripsi bcrypt, pembatasan percobaan gagal (*rate limiting*), dan pencatatan audit log otomatis.
              </p>
            </div>

            {/* Expired / Re-authentication Prompt */}
            {expiredReason && (
              <div className="text-xs p-3.5 rounded-2xl flex items-start space-x-2.5 bg-amber-50 text-amber-900 border border-amber-200 animate-in fade-in duration-200">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Keamanan Perangkat Aktif</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {expiredReason === 'idle'
                      ? 'Sesi ditutup otomatis karena perangkat tidak aktif selama 1 jam. Silakan login kembali untuk melanjutkan.'
                      : 'Perangkat wajib melakukan autentikasi ulang setiap kali masuk ke Portal Kelurahan.'}
                  </p>
                </div>
              </div>
            )}

            {/* Error / Locked Notifications */}
            {errorMessage && (
              <div
                className={`text-xs p-3.5 rounded-2xl flex items-start space-x-2.5 animate-in fade-in duration-200 border ${
                  isLocked
                    ? 'bg-rose-100 text-rose-950 border-rose-300'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {isLocked ? (
                  <ShieldAlert className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <p className="leading-relaxed font-semibold">{errorMessage}</p>
                  {typeof rateLimitRemaining === 'number' && !isLocked && (
                    <p className="text-[11px] text-rose-600 font-medium">
                      Keamanan: Akun akan terkunci otomatis setelah {rateLimitRemaining} kali percobaan gagal lagi.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Success Notification */}
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
                  NIP atau Email Resmi Kedinasan *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isLocked}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Contoh: 19780203 200902 2 002 atau seklur@kolongansatu.tomohon.go.id"
                    className="w-full bg-slate-50 border border-[#dae2fd] focus:border-primary focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition font-mono disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Kata Sandi Kedinasan *
                  </label>
                  <button
                    type="button"
                    onClick={handleOpenForgotModal}
                    className="text-xs font-bold text-primary hover:text-[#004d77] hover:underline cursor-pointer"
                  >
                    Lupa Kata Sandi?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4 text-primary" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLocked}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi kedinasan Anda"
                    className="w-full bg-slate-50 border border-[#dae2fd] focus:border-primary focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition font-mono disabled:opacity-50"
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
                disabled={isLoading || isLocked}
                className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-[#004d77] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer active:scale-98"
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
            <div className="pt-3 border-t border-[#dae2fd] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-primary" />
                <span>Supabase PostgreSQL Security Hub</span>
              </span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Bcrypt &amp; Audit Trail Aktif</span>
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Pemulihan / Lupa Kata Sandi */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#dae2fd]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#dae2fd] bg-gradient-to-r from-primary via-[#00527c] to-[#004266] text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">
                    Pemulihan Kata Sandi Aparatur
                  </h2>
                  <p className="text-xs text-sky-100 mt-0.5">
                    Verifikasi identitas resmi Kelurahan Kolongan Satu
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleResetPassword} className="p-5 sm:p-6 space-y-4 bg-[#faf8ff] overflow-y-auto max-h-[80vh]">
              <div className="bg-white p-3.5 rounded-2xl border border-[#dae2fd] text-xs text-slate-600 leading-relaxed flex items-start space-x-2.5">
                <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p>
                  Demi keamanan ketat, masukkan <strong>NIP resmi</strong> dan <strong>Nomor WhatsApp kedinasan terdaftar</strong> (atau 4 digit terakhir) untuk membuktikan kepemilikan akun sebelum mengatur kata sandi baru.
                </p>
              </div>

              {forgotError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              {/* 1. NIP atau Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NIP atau Email Resmi Kedinasan *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="Contoh: 19780203 200902 2 002"
                    className="w-full bg-white border border-[#dae2fd] focus:border-primary rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              {/* 2. Nomor WhatsApp Terdaftar (Two-Factor Identity Match) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor WhatsApp Terdaftar (atau 4 digit terakhir) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <input
                    type="text"
                    required
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    placeholder="Contoh: 0813-4011-2233 atau 2233"
                    className="w-full bg-white border border-[#dae2fd] focus:border-primary rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Nomor kontak terdaftar di database kelurahan untuk validasi pejabat yang bersangkutan.
                </p>
              </div>

              {/* 3. Kata Sandi Baru */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi Baru * (Minimal 8 karakter)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4 text-primary" />
                  </div>
                  <input
                    type={showForgotNewPassword ? 'text' : 'password'}
                    required
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Masukkan kata sandi baru yang kuat"
                    className="w-full bg-white border border-[#dae2fd] focus:border-primary rounded-xl pl-9 pr-9 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 4. Konfirmasi Kata Sandi Baru */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ulangi Kata Sandi Baru *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4 text-primary" />
                  </div>
                  <input
                    type={showForgotNewPassword ? 'text' : 'password'}
                    required
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru untuk verifikasi"
                    className="w-full bg-white border border-[#dae2fd] focus:border-primary rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/80 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-[#004d77] text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isForgotLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan ke Supabase...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Simpan Kata Sandi Baru</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bantuan Diskominfo */}
              <div className="pt-3 border-t border-[#dae2fd] text-center">
                <p className="text-[11px] text-slate-500">
                  Lupa nomor WhatsApp terdaftar? Hubungi{' '}
                  <a
                    href="https://wa.me/6281295370427?text=Halo%20Admin%20Kelurahan%20Kolongan%20Satu,%20saya%20membutuhkan%20bantuan%20reset%20kata%20sandi%20portal%20aparatur."
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                    Admin Dukungan Teknis Kelurahan
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-[#dae2fd] bg-white/60">
        Sistem Informasi Pemerintahan &amp; Monografi Digital Kelurahan Kolongan Satu © 2026. Seluruh hak cipta dilindungi.
      </footer>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#faf8ff] text-slate-600">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      }
    >
      <PortalLoginForm />
    </Suspense>
  );
}
