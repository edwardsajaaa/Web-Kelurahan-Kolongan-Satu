'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MONOGRAFI_ITEMS } from '@/data/monografiData';
import { OFFICIALS } from '@/data/officialsData';
import { INITIAL_LETTERS, LetterRequest } from '@/data/lettersData';
import { MONOGRAFI_2024 } from '@/data/monografi2024';

import dynamic from 'next/dynamic';
import ActivitySlider from '@/components/ActivitySlider';

const ModalLetterRequest = dynamic(() => import('@/components/ModalLetterRequest'), { ssr: false });
const ModalMonografiPrint = dynamic(() => import('@/components/ModalMonografiPrint'), { ssr: false });
const ModalWhatsAppSimulator = dynamic(() => import('@/components/ModalWhatsAppSimulator'), { ssr: false });
const ModalOfficialLetterPreview = dynamic(() => import('@/components/ModalOfficialLetterPreview'), { ssr: false });

export default function LandingPage() {
  // Interactive modal states on the landing page
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isPrintMonografiOpen, setIsPrintMonografiOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isPrintLetterOpen, setIsPrintLetterOpen] = useState(false);
  const [printLetterTarget, setPrintLetterTarget] = useState<LetterRequest | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data
  const [letters, setLetters] = useState<LetterRequest[]>(INITIAL_LETTERS);
  const currentOfficial = OFFICIALS[0];
  const activeMonografi = MONOGRAFI_ITEMS[0];

  const handleAddLetter = async (newLetter: LetterRequest) => {
    setLetters((prev) => [newLetter, ...prev]);
    try {
      const res = await fetch('/api/surat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLetter),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.id) {
          setLetters((prev) => prev.map((l) => (l.noRegistrasi === newLetter.noRegistrasi ? json.data : l)));
        }
      }
    } catch (e) {
      console.warn('Gagal menyimpan surat via API:', e);
    }
  };

  const handleUpdateLetterStatus = async (id: string, newStatus: LetterRequest['statusSurat'], note?: string) => {
    setLetters((prev) =>
      prev.map((l) => (l.id === id ? { ...l, statusSurat: newStatus, catatanPetugas: note || l.catatanPetugas } : l))
    );
    try {
      await fetch('/api/surat', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          statusSurat: newStatus,
          catatanPetugas: note,
          officialName: currentOfficial.name,
        }),
      });
    } catch (e) {
      console.warn('Gagal update status surat via API:', e);
    }
  };

  const handlePrintLetter = (letter: LetterRequest) => {
    setPrintLetterTarget(letter);
    setIsPrintLetterOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] font-sans antialiased selection:bg-[#006194] selection:text-white flex flex-col justify-between">
      {/* ============================================================ */}
      {/* 1. HEADER & NAVBAR (Fluid Responsive)                        */}
      {/* ============================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/92 backdrop-blur-xl border-b border-[#e2e7ff]/80 shadow-[0_1px_12px_rgba(0,0,0,0.04)] transition-all">
        <div className="h-20 2xl:h-24 w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 2xl:gap-4 group">
            <div className="p-1 2xl:p-1.5 bg-[#f2f3ff] rounded-full shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <img
                alt="Lambang Kolongan Satu"
                className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmHZWdfGwGmtKd7WQmqYAolpSTVfdzZ9o_PS86bfdJVmhgEbRRth-v4rnoCOXBuQ4rQllgVR5nednaoxhTKE3HaZrfgKH07dp48WXlGpdCkPwVw7t1SLyV-UQxj_n3EiZqaWXZItQiD2p_vqtKi_xSE74TrV0f1V-Azvr4pEqGb2SCR7zqAIzDYHRNzTburxA3gDsFwOEtNColVLoZ5UF1Xy0WSKOkbAkPEIA04HcG2N0n-qDAhHKdo7iOJD-lul2L9S0"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-[17px] 2xl:text-xl text-[#131b2e] tracking-tight leading-tight">
                Kolongan Satu
              </span>
              <span className="text-[12px] 2xl:text-sm text-[#3f4850] font-medium tracking-wide">
                Kota Tomohon
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 2xl:gap-12">
            <a
              href="#"
              className="text-[14px] 2xl:text-[16px] text-[#006194] font-semibold transition-colors hover:text-[#007bb9]"
            >
              Beranda
            </a>
            <a
              href="#sejarah-wilayah"
              className="text-[14px] 2xl:text-[16px] text-[#3f4850] hover:text-[#006194] font-medium transition-colors"
            >
              Profil &amp; Sejarah
            </a>
            <Link
              href="/monografi"
              className="text-[14px] 2xl:text-[16px] text-[#3f4850] hover:text-[#006194] font-medium transition-colors"
            >
              Monografi
            </Link>
            <a
              href="#layanan-cepat"
              className="text-[14px] 2xl:text-[16px] text-[#3f4850] hover:text-[#006194] font-medium transition-colors"
            >
              Layanan Publik
            </a>
          </nav>

          {/* Right Action: Masuk Portal */}
          <div className="flex items-center gap-2">
            <Link
              href="/portal"
              className="inline-flex items-center gap-1.5 2xl:gap-2 text-[14px] 2xl:text-[15px] font-semibold text-[#006194] bg-white hover:bg-[#e2e7ff] border border-[#e2e7ff] px-5 2xl:px-7 py-2.5 2xl:py-3 rounded-full shadow-xs hover:shadow-md transition-all duration-300"
            >
              <span className="material-symbols-outlined text-[17px] 2xl:text-[20px]">login</span>
              <span>Masuk Portal</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#3f4850] hover:bg-[#f2f3ff]"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#e2e7ff] px-6 py-4 flex flex-col gap-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] text-[#006194] font-semibold py-1.5"
            >
              Beranda
            </a>
            <a
              href="#sejarah-wilayah"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] text-[#3f4850] font-medium py-1.5"
            >
              Profil &amp; Sejarah
            </a>
            <Link
              href="/monografi"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] text-[#3f4850] font-medium py-1.5"
            >
              Monografi
            </Link>
            <a
              href="#layanan-cepat"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] text-[#3f4850] font-medium py-1.5"
            >
              Layanan Publik
            </a>
            <Link
              href="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#006194] py-2.5 rounded-full shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Buka Portal Aparatur</span>
            </Link>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* MAIN CONTENT                                                */}
      {/* ============================================================ */}
      <main className="w-full pt-20 2xl:pt-24 flex-1">
        <div className="flex flex-col w-full">
          {/* ============================================================ */}
          {/* 2. HERO SHOWCASE SECTION (Fluid Container)                   */}
          {/* ============================================================ */}
          <section className="relative w-full overflow-hidden pb-8 2xl:pb-12">
            {/* Ambient Background Glow (Full Bleed) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#cce5ff]/40 via-[#faf8ff] to-[#faf8ff] pointer-events-none -z-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] 2xl:w-[1300px] 3xl:w-[1600px] h-[360px] 2xl:h-[500px] bg-[#006194]/6 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 pt-6 2xl:pt-10">
              {/* Hero Title & Lead */}
              <div className="flex flex-col items-center text-center max-w-3xl 2xl:max-w-4xl mx-auto pt-6 pb-4 2xl:pt-8 2xl:pb-6 mb-8 2xl:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl 3xl:text-7xl text-[#131b2e] font-bold tracking-tight mb-3 2xl:mb-5 leading-[1.15]">
                  Pelayanan Terbuka &amp;{' '}
                  <span className="text-[#006194] font-bold">Dekat Warga</span>
                </h1>
                <p className="text-base sm:text-lg 2xl:text-xl 3xl:text-2xl text-[#3f4850] max-w-xl 2xl:max-w-3xl mx-auto mb-7 2xl:mb-10 leading-relaxed font-normal">
                  Transparansi data monografi dan akses kemudahan administrasi bagi seluruh masyarakat Kolongan Satu.
                </p>

                {/* Hero CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 2xl:gap-4 w-full sm:w-auto">
                  <Link
                    href="/monografi"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#006194] hover:bg-[#007bb9] text-white px-7 2xl:px-9 py-3 2xl:py-4 rounded-full text-sm 2xl:text-base font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    <span>Jelajahi Monografi</span>
                    <span className="material-symbols-outlined text-[18px] 2xl:text-[20px]">arrow_forward</span>
                  </Link>
                  <button
                    onClick={() => setIsLetterModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#f2f3ff] text-[#131b2e] border border-[#e2e7ff] px-6 2xl:px-8 py-3 2xl:py-4 rounded-full text-sm 2xl:text-base font-medium transition-all duration-300 hover:border-[#bfc7d2] shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] 2xl:text-[20px] text-[#006194]">description</span>
                    <span>Layanan Persuratan</span>
                  </button>
                </div>
              </div>

              {/* Slider Dokumentasi Kegiatan */}
              <ActivitySlider />
            </div>
          </section>

          {/* ============================================================ */}
          {/* 3. FLOATING QUICK-STATS STRIP (Fluid Grid)                   */}
          {/* ============================================================ */}
          <section
            className="relative z-10 w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 -mt-8 sm:-mt-12 2xl:-mt-16 mb-12 2xl:mb-16"
            id="monografi-ringkas"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
              {/* Card 1: Kependudukan */}
              <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 2xl:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#e2e7ff]/80 group">
                <div className="mb-3 2xl:mb-4">
                  <span className="text-xs 2xl:text-sm text-[#3f4850] font-semibold uppercase tracking-wider">
                    Kependudukan
                  </span>
                </div>
                <div>
                  <div className="text-4xl 2xl:text-5xl 3xl:text-6xl leading-none text-[#131b2e] font-bold tracking-tight mb-1 group-hover:text-[#006194] transition-colors">
                    {MONOGRAFI_2024.demografi.totalPenduduk.toLocaleString('id-ID')}
                  </div>
                  <div className="text-sm 2xl:text-base text-[#006194] font-semibold">
                    Total Penduduk (Jiwa)
                  </div>
                </div>
                <div className="pt-3 2xl:pt-4 mt-4 2xl:mt-6 bg-[#f2f3ff]/70 -mx-6 2xl:-mx-8 -mb-6 2xl:-mb-8 px-6 2xl:px-8 pb-3 2xl:pb-4 rounded-b-2xl 2xl:rounded-b-3xl flex items-center justify-between text-[#3f4850] text-xs 2xl:text-sm font-medium border-t border-[#e2e7ff]/70">
                  <span>{MONOGRAFI_2024.demografi.lakiLaki.toLocaleString('id-ID')} Laki-laki</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bfc7d2]" />
                  <span>{MONOGRAFI_2024.demografi.perempuan.toLocaleString('id-ID')} Perempuan</span>
                </div>
              </div>

              {/* Card 2: Kartu Keluarga */}
              <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 2xl:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#e2e7ff]/80 group">
                <div className="mb-3 2xl:mb-4">
                  <span className="text-xs 2xl:text-sm text-[#3f4850] font-semibold uppercase tracking-wider">
                    Kartu Keluarga
                  </span>
                </div>
                <div>
                  <div className="text-4xl 2xl:text-5xl 3xl:text-6xl leading-none text-[#131b2e] font-bold tracking-tight mb-1 group-hover:text-[#006194] transition-colors">
                    {MONOGRAFI_2024.demografi.kepalaKeluarga.toLocaleString('id-ID')}
                  </div>
                  <div className="text-sm 2xl:text-base text-[#006194] font-semibold">
                    Kepala Keluarga (KK)
                  </div>
                </div>
                <div className="pt-3 2xl:pt-4 mt-4 2xl:mt-6 bg-[#f2f3ff]/70 -mx-6 2xl:-mx-8 -mb-6 2xl:-mb-8 px-6 2xl:px-8 pb-3 2xl:pb-4 rounded-b-2xl 2xl:rounded-b-3xl flex items-center justify-between text-[#3f4850] text-xs 2xl:text-sm font-medium border-t border-[#e2e7ff]/70">
                  <span>Tercatat Dukcapil</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bfc7d2]" />
                  <span>100% Ber-KTP</span>
                </div>
              </div>

              {/* Card 3: Struktur Teritorial */}
              <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 2xl:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#e2e7ff]/80 group">
                <div className="mb-3 2xl:mb-4">
                  <span className="text-xs 2xl:text-sm text-[#3f4850] font-semibold uppercase tracking-wider">
                    Struktur Teritorial
                  </span>
                </div>
                <div>
                  <div className="text-4xl 2xl:text-5xl 3xl:text-6xl leading-none text-[#131b2e] font-bold tracking-tight mb-1 group-hover:text-[#006194] transition-colors">
                    {MONOGRAFI_2024.jaga.length}
                  </div>
                  <div className="text-sm 2xl:text-base text-[#006194] font-semibold">
                    Wilayah Lingkungan (Jaga I - V)
                  </div>
                </div>
                <div className="pt-3 2xl:pt-4 mt-4 2xl:mt-6 bg-[#f2f3ff]/70 -mx-6 2xl:-mx-8 -mb-6 2xl:-mb-8 px-6 2xl:px-8 pb-3 2xl:pb-4 rounded-b-2xl 2xl:rounded-b-3xl flex items-center justify-between text-[#3f4850] text-xs 2xl:text-sm font-medium border-t border-[#e2e7ff]/70">
                  <span>5 Kepala Lingkungan (Pala)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bfc7d2]" />
                  <span>10 Mevrouw</span>
                </div>
              </div>

              {/* Card 4: Digitalisasi Kelurahan */}
              <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 2xl:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#e2e7ff]/80 group">
                <div className="mb-3 2xl:mb-4">
                  <span className="text-xs 2xl:text-sm text-[#3f4850] font-semibold uppercase tracking-wider">
                    Digitalisasi Kelurahan
                  </span>
                </div>
                <div>
                  <div className="text-4xl 2xl:text-5xl 3xl:text-6xl leading-none text-[#131b2e] font-bold tracking-tight mb-1 group-hover:text-[#006194] transition-colors">
                    100%
                  </div>
                  <div className="text-sm 2xl:text-base text-[#006194] font-semibold">
                    Layanan Publik Digital
                  </div>
                </div>
                <div className="pt-3 2xl:pt-4 mt-4 2xl:mt-6 bg-[#f2f3ff]/70 -mx-6 2xl:-mx-8 -mb-6 2xl:-mb-8 px-6 2xl:px-8 pb-3 2xl:pb-4 rounded-b-2xl 2xl:rounded-b-3xl flex items-center justify-between text-[#3f4850] text-xs 2xl:text-sm font-medium border-t border-[#e2e7ff]/70">
                  <span>Akses Terbuka &amp; Cepat</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bfc7d2]" />
                  <span>WhatsApp Terintegrasi</span>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 4. VISI & MISI KELURAHAN (Dipimpin Lurah)                    */}
          {/* ============================================================ */}
          <section className="w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 mb-12 2xl:mb-16">
            <div className="bg-[#eaedff] rounded-2xl 2xl:rounded-3xl p-6 sm:p-10 2xl:p-14 shadow-sm border border-[#dae2fd]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-12 items-center">
                {/* Photo & Name Lurah */}
                <div className="lg:col-span-4 flex flex-col items-center">
                  <div className="relative w-44 h-44 sm:w-48 sm:h-48 2xl:w-56 2xl:h-56 rounded-full overflow-hidden shadow-lg border-4 2xl:border-6 border-white bg-[#f2f3ff]">
                    <img
                      alt="Theresia J. Kaunang, SE - Lurah Kolongan Satu"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmkT6Lxix1606pAklH9PB0OUWSCEjrjFzfwpcSlm9ywVv07O2Su_cFxdAg5h0JsNg3dRn1ADxpSno52ixis48MJGvhehRAdU2FOb9ZF7Z_r7_MES5fFjLyAe4iPN62of3xU8GFBILuVfFT06TsS3S2QxpWmW1yChADq4DUcF6D6CI8LxNn5-aqqacCtv1DuPk4Hab5fN6T30VHoWZv6aR7MNqFmDzFWeLxqRpIesFtP-KrsOcBKGnf4Q"
                    />
                  </div>
                  <div className="mt-4 2xl:mt-5 text-center">
                    <h3 className="text-lg sm:text-xl 2xl:text-2xl text-[#131b2e] font-bold">
                      Theresia J. Kaunang, SE
                    </h3>
                    <p className="text-xs sm:text-sm 2xl:text-base text-[#006194] font-semibold mt-0.5">
                      Lurah Kolongan Satu
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-2 flex-wrap justify-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#006194] text-[11px] 2xl:text-xs font-semibold shadow-xs border border-[#dae2fd]">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      <span>Semangat Mapalus</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 text-[#3f4850] text-[11px] 2xl:text-xs font-medium border border-[#dae2fd]">
                      <span className="material-symbols-outlined text-[15px] text-[#006c49]">location_on</span>
                      <span>Tomohon Tengah</span>
                    </div>
                  </div>
                </div>

                {/* Visi & Misi Content */}
                <div className="lg:col-span-8 flex flex-col text-left space-y-4 2xl:space-y-5">
                  {/* VISI BOX */}
                  <div className="bg-white/90 backdrop-blur-xs rounded-xl 2xl:rounded-2xl p-5 2xl:p-6 border border-[#dae2fd] shadow-2xs">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 bg-[#006194] text-white text-[11px] 2xl:text-xs font-bold rounded-full uppercase tracking-wider">
                        Visi
                      </span>
                      <span className="text-xs 2xl:text-sm text-[#3f4850] font-medium">Kelurahan Kolongan Satu</span>
                    </div>
                    <blockquote className="text-base sm:text-lg 2xl:text-xl text-[#131b2e] font-bold leading-snug">
                      “Terwujudnya Kelurahan Kolongan Satu yang Maju, Berdaya Saing, Sejahtera, dan Berbudaya Berlandaskan Semangat Gotong Royong Mapalus.”
                    </blockquote>
                  </div>

                  {/* MISI BOX */}
                  <div className="bg-white/90 backdrop-blur-xs rounded-xl 2xl:rounded-2xl p-5 2xl:p-6 border border-[#dae2fd] shadow-2xs space-y-3.5 2xl:space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-[#006c49] text-white text-[11px] 2xl:text-xs font-bold rounded-full uppercase tracking-wider">
                        Misi
                      </span>
                      <span className="text-xs 2xl:text-sm text-[#3f4850] font-medium">Langkah Strategis Pelayanan</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 2xl:gap-3">
                      <div className="flex items-start gap-3 bg-[#f2f3ff]/80 rounded-xl p-3 2xl:p-3.5 border border-[#dae2fd]/80 transition-all hover:bg-[#f2f3ff]">
                        <div className="w-7 h-7 2xl:w-8 2xl:h-8 rounded-lg bg-[#cce5ff] text-[#006194] font-bold text-xs 2xl:text-sm flex items-center justify-center shrink-0 mt-0.5">
                          1
                        </div>
                        <div className="text-xs sm:text-sm 2xl:text-base text-[#131b2e] leading-relaxed">
                          <strong className="font-semibold text-[#006194]">Pelayanan Publik Digital &amp; Prima:</strong> Menghadirkan tata kelola pemerintahan yang transparan, cepat, dan mudah diakses bagi seluruh warga Lingkungan I sampai V.
                        </div>
                      </div>

                      <div className="flex items-start gap-3 bg-[#f2f3ff]/80 rounded-xl p-3 2xl:p-3.5 border border-[#dae2fd]/80 transition-all hover:bg-[#f2f3ff]">
                        <div className="w-7 h-7 2xl:w-8 2xl:h-8 rounded-lg bg-[#cce5ff] text-[#006194] font-bold text-xs 2xl:text-sm flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </div>
                        <div className="text-xs sm:text-sm 2xl:text-base text-[#131b2e] leading-relaxed">
                          <strong className="font-semibold text-[#006194]">Pemberdayaan Ekonomi &amp; Wilayah:</strong> Mendorong kemandirian masyarakat melalui penguatan UMKM, potensi pertanian subur kaki Gunung Lokon, dan ketahanan pangan.
                        </div>
                      </div>

                      <div className="flex items-start gap-3 bg-[#f2f3ff]/80 rounded-xl p-3 2xl:p-3.5 border border-[#dae2fd]/80 transition-all hover:bg-[#f2f3ff]">
                        <div className="w-7 h-7 2xl:w-8 2xl:h-8 rounded-lg bg-[#cce5ff] text-[#006194] font-bold text-xs 2xl:text-sm flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </div>
                        <div className="text-xs sm:text-sm 2xl:text-base text-[#131b2e] leading-relaxed">
                          <strong className="font-semibold text-[#006194]">Kerukunan &amp; Pelestarian Budaya:</strong> Memelihara keamanan, ketenteraman lingkungan, dan kelestarian kearifan lokal Minahasa dengan falsafah <em>Si Tou Timou Tumou Tou</em>.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 5. SEJARAH & ASAL-USUL                                       */}
          {/* ============================================================ */}
          <section className="w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 mb-12 2xl:mb-16" id="sejarah-wilayah">
            <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 sm:p-10 2xl:p-14 shadow-sm border border-[#e2e7ff]">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#eaedff] gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-[#cce5ff]/50 px-3 2xl:px-4 py-1 2xl:py-1.5 rounded-full text-[#006194] text-xs 2xl:text-sm font-semibold mb-2 2xl:mb-3">
                    <span className="material-symbols-outlined text-[16px] 2xl:text-[18px]">history_edu</span>
                    <span>Kilasan Historis</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl 2xl:text-4xl 3xl:text-5xl text-[#131b2e] font-bold tracking-tight">
                    Sejarah &amp; Asal-Usul
                  </h2>
                </div>
                <p className="text-sm 2xl:text-base text-[#3f4850] max-w-md 2xl:max-w-lg">
                  Akar budaya wanua Minahasa berlandaskan semangat luhur Mapalus.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 2xl:gap-8">
                {/* 1. Awal Mula */}
                <div className="bg-[#f2f3ff] rounded-2xl 2xl:rounded-3xl p-6 2xl:p-8 border border-[#e2e7ff]/80 hover:border-[#006194]/40 transition-colors">
                  <span className="inline-block text-[11px] 2xl:text-xs font-semibold text-[#006194] bg-[#cce5ff] px-2.5 2xl:px-3 py-0.5 rounded-full mb-3 2xl:mb-4">
                    Awal Mula
                  </span>
                  <h4 className="text-lg 2xl:text-2xl text-[#131b2e] font-bold mb-2 2xl:mb-3">
                    Wanua Kolongan
                  </h4>
                  <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] leading-relaxed">
                    Permukiman agraris subur di kaki Gunung Lokon yang menjunjung tinggi kekeluargaan dan persaudaraan adat Toumbulu.
                  </p>
                </div>

                {/* 2. Pemekaran */}
                <div className="bg-[#f2f3ff] rounded-2xl 2xl:rounded-3xl p-6 2xl:p-8 border border-[#e2e7ff]/80 hover:border-[#006c49]/40 transition-colors">
                  <span className="inline-block text-[11px] 2xl:text-xs font-semibold text-[#006c49] bg-[#6cf8bb]/50 px-2.5 2xl:px-3 py-0.5 rounded-full mb-3 2xl:mb-4">
                    Pemekaran
                  </span>
                  <h4 className="text-lg 2xl:text-2xl text-[#131b2e] font-bold mb-2 2xl:mb-3">
                    Kolongan Satu
                  </h4>
                  <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] leading-relaxed">
                    Penataan wilayah untuk mendekatkan pelayanan warga dan efisiensi tata kelola pemerintahan permukiman.
                  </p>
                </div>

                {/* 3. Nilai Luhur */}
                <div className="bg-[#f2f3ff] rounded-2xl 2xl:rounded-3xl p-6 2xl:p-8 border border-[#e2e7ff]/80 hover:border-[#006194]/40 transition-colors">
                  <span className="inline-block text-[11px] 2xl:text-xs font-semibold text-[#006194] bg-[#cce5ff] px-2.5 2xl:px-3 py-0.5 rounded-full mb-3 2xl:mb-4">
                    Nilai Luhur
                  </span>
                  <h4 className="text-lg 2xl:text-2xl text-[#131b2e] font-bold mb-2 2xl:mb-3">
                    Si Tou Timou Tumou Tou
                  </h4>
                  <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] leading-relaxed">
                    Falsafah memanusiakan sesama menjadi pegangan teguh pelayanan dan kerukunan warga di 5 Lingkungan Jaga.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 6. PUSAT LAYANAN WARGA (Fluid Grid)                          */}
          {/* ============================================================ */}
          <section className="w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 mb-12 2xl:mb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
              <div>
                <span className="text-xs 2xl:text-sm text-[#006194] font-bold tracking-wider uppercase block mb-1">
                  Layanan &amp; Informasi Terpadu
                </span>
                <h2 className="text-2xl sm:text-3xl 2xl:text-4xl 3xl:text-5xl text-[#131b2e] font-bold">
                  Pusat Layanan Warga
                </h2>
              </div>
              <p className="text-sm 2xl:text-base text-[#3f4850] max-w-md 2xl:max-w-lg">
                Akses cepat ke portal esensial kependudukan, wilayah, dan persuratan mandiri.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-8">
              {/* Card 1: Monografi Kependudukan */}
              <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 2xl:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group border border-[#e2e7ff]">
                <div className="space-y-4 2xl:space-y-6">
                  <div className="w-12 h-12 2xl:w-16 2xl:h-16 rounded-xl 2xl:rounded-2xl bg-[#cce5ff] flex items-center justify-center text-[#006194]">
                    <span className="material-symbols-outlined text-[24px] 2xl:text-[32px]">analytics</span>
                  </div>
                  <h3 className="text-lg 2xl:text-2xl text-[#131b2e] group-hover:text-[#006194] transition-colors font-bold">
                    Monografi Kependudukan
                  </h3>
                  <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] leading-relaxed">
                    Statistik 1.484 jiwa, kelompok umur produktif, dan data pendidikan warga terverifikasi.
                  </p>
                </div>
                <div className="pt-5 2xl:pt-6 mt-6 2xl:mt-8 border-t border-[#e2e7ff]">
                  <Link
                    href="/monografi"
                    className="inline-flex items-center gap-1.5 2xl:gap-2 text-sm 2xl:text-base text-[#006194] font-semibold group-hover:translate-x-1 transition-all"
                  >
                    <span>Buka Monografi</span>
                    <span className="material-symbols-outlined text-[18px] 2xl:text-[20px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Card 2: Peta & 5 Wilayah Jaga */}
              <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 2xl:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group border border-[#e2e7ff]">
                <div className="space-y-4 2xl:space-y-6">
                  <div className="w-12 h-12 2xl:w-16 2xl:h-16 rounded-xl 2xl:rounded-2xl bg-[#6ffbbe]/40 flex items-center justify-center text-[#006c49]">
                    <span className="material-symbols-outlined text-[24px] 2xl:text-[32px]">map</span>
                  </div>
                  <h3 className="text-lg 2xl:text-2xl text-[#131b2e] group-hover:text-[#006194] transition-colors font-bold">
                    Peta &amp; 5 Wilayah Jaga
                  </h3>
                  <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] leading-relaxed">
                    Batas administratif wilayah lingkungan dan kontak aparatur Kepala Jaga (Pala I - V).
                  </p>
                </div>
                <div className="pt-5 2xl:pt-6 mt-6 2xl:mt-8 border-t border-[#e2e7ff]">
                  <Link
                    href="/portal"
                    className="inline-flex items-center gap-1.5 2xl:gap-2 text-sm 2xl:text-base text-[#006194] font-semibold group-hover:translate-x-1 transition-all"
                  >
                    <span>Lihat Wilayah</span>
                    <span className="material-symbols-outlined text-[18px] 2xl:text-[20px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Card 3: Layanan Persuratan Online */}
              <div
                className="bg-white rounded-2xl 2xl:rounded-3xl p-6 2xl:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group border border-[#e2e7ff]"
                id="layanan-cepat"
              >
                <div className="space-y-4 2xl:space-y-6">
                  <div className="w-12 h-12 2xl:w-16 2xl:h-16 rounded-xl 2xl:rounded-2xl bg-[#cce5ff] flex items-center justify-center text-[#006194]">
                    <span className="material-symbols-outlined text-[24px] 2xl:text-[32px]">description</span>
                  </div>
                  <h3 className="text-lg 2xl:text-2xl text-[#131b2e] group-hover:text-[#006194] transition-colors font-bold">
                    Layanan Persuratan Online
                  </h3>
                  <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] leading-relaxed">
                    Pengurusan surat keterangan domisili, SKU, pengantar SKCK mandiri dan cepat.
                  </p>
                </div>
                <div className="pt-5 2xl:pt-6 mt-6 2xl:mt-8 border-t border-[#e2e7ff]">
                  <button
                    onClick={() => setIsLetterModalOpen(true)}
                    className="inline-flex items-center gap-1.5 2xl:gap-2 text-sm 2xl:text-base text-[#006194] font-semibold group-hover:translate-x-1 transition-all cursor-pointer"
                  >
                    <span>Buat Surat</span>
                    <span className="material-symbols-outlined text-[18px] 2xl:text-[20px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 7. CIVIC TRANSPARENCY & KKT COLLABORATION STRIP              */}
          {/* ============================================================ */}
          <section className="w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 mb-12 2xl:mb-16">
            <div className="bg-[#f2f3ff] rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 2xl:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 2xl:gap-10 border border-[#dae2fd]">
              <div className="flex items-center gap-4 2xl:gap-6">
                <div className="w-14 h-14 2xl:w-18 2xl:h-18 rounded-full bg-[#cce5ff] flex items-center justify-center text-[#006194] shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[32px] 2xl:text-[40px]">school</span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg 2xl:text-2xl text-[#131b2e] font-bold">
                    Kolaborasi Akademis KKT 149 UNSRAT
                  </h4>
                  <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] mt-1 leading-relaxed">
                    Penyusunan data profil monografi dan digitalisasi pelayanan terlaksana atas kerjasama mahasiswa Kuliah Kerja Terpadu (KKT) Ke-149 Universitas Sam Ratulangi dengan Kelurahan Kolongan Satu.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setIsPrintMonografiOpen(true)}
                  className="w-full sm:w-auto text-xs sm:text-sm 2xl:text-base font-semibold bg-white text-[#131b2e] hover:bg-[#faf8ff] px-5 2xl:px-8 py-3 2xl:py-4 rounded-full shadow-xs border border-[#dae2fd] hover:border-[#bfc7d2] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] 2xl:text-[22px] text-[#006194]">picture_as_pdf</span>
                  <span>Unduh Laporan Monografi PDF</span>
                </button>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 8. GEOGRAPHIC LOCATION & CONTACT SNIPPET                     */}
          {/* ============================================================ */}
          <section className="w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 mb-12 2xl:mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 2xl:gap-10 items-center bg-white rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 2xl:p-12 shadow-sm border border-[#e2e7ff]">
              {/* Left: Office Location Details */}
              <div className="lg:col-span-6 space-y-3 2xl:space-y-5 text-left">
                <div className="inline-flex items-center gap-1.5 text-xs 2xl:text-sm text-[#006194] font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px] 2xl:text-[22px]">location_on</span>
                  Pusat Pelayanan Kantor
                </div>
                <h3 className="text-xl sm:text-2xl 2xl:text-3xl 3xl:text-4xl text-[#131b2e] font-bold">
                  Kantor Kelurahan Kolongan Satu
                </h3>
                <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] leading-relaxed">
                  Berada strategis di jantung Kecamatan Tomohon Tengah. Melayani administrasi persuratan, perizinan, dan koordinasi kewilayahan warga Lingkungan I sampai V secara terpadu.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 2xl:gap-5 pt-2">
                  <div className="bg-[#f2f3ff] p-3.5 2xl:p-5 rounded-xl 2xl:rounded-2xl border border-[#e2e7ff]/80">
                    <div className="text-xs 2xl:text-sm text-[#3f4850] font-medium">Alamat Lengkap</div>
                    <div className="text-xs sm:text-sm 2xl:text-base text-[#131b2e] font-semibold mt-0.5">
                      Jl. Kolongan Raya, Tomohon Tengah, Kota Tomohon
                    </div>
                  </div>
                  <div className="bg-[#f2f3ff] p-3.5 2xl:p-5 rounded-xl 2xl:rounded-2xl border border-[#e2e7ff]/80">
                    <div className="text-xs 2xl:text-sm text-[#3f4850] font-medium">Layanan Daring</div>
                    <div className="text-xs sm:text-sm 2xl:text-base text-[#131b2e] font-semibold mt-0.5">
                      Aktif 24 Jam via WhatsApp Portal
                    </div>
                  </div>
                </div>
                <div className="pt-1">
                  <a
                    href="https://www.google.com/maps/place/Kolongan+Satu,+Kec.+Tomohon+Tengah,+Kota+Tomohon,+Sulawesi+Utara/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#006194] hover:bg-[#007bb9] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-300"
                  >
                    <span className="material-symbols-outlined text-[18px]">near_me</span>
                    <span>Petunjuk Arah Google Maps</span>
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                </div>
              </div>

              {/* Right: Embedded Interactive Map Container */}
              <div className="lg:col-span-6 w-full">
                <div className="w-full h-72 sm:h-80 2xl:h-96 rounded-xl 2xl:rounded-2xl shadow-inner relative overflow-hidden border border-[#dae2fd] bg-[#f2f3ff] group">
                  <iframe
                    title="Peta Lokasi Kelurahan Kolongan Satu, Tomohon"
                    src="https://maps.google.com/maps?q=Kolongan+Satu,+Tomohon+Tengah,+Kota+Tomohon,+Sulawesi+Utara&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <a
                    href="https://www.google.com/maps/place/Kolongan+Satu,+Kec.+Tomohon+Tengah,+Kota+Tomohon,+Sulawesi+Utara/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 bg-white/95 hover:bg-[#006194] text-[#131b2e] hover:text-white backdrop-blur-md px-3.5 2xl:px-4 py-1.5 2xl:py-2 rounded-full text-xs 2xl:text-sm font-semibold shadow-md flex items-center gap-1.5 border border-[#dae2fd] hover:border-[#006194] transition-all duration-300 group-hover:scale-105"
                  >
                    <span className="material-symbols-outlined text-[16px] 2xl:text-[18px] text-[#006194] group-hover:text-white transition-colors">
                      open_in_new
                    </span>
                    <span>Buka di Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ============================================================ */}
      {/* 9. FOOTER (Full Bleed Fluid Responsive)                      */}
      {/* ============================================================ */}
      <footer className="w-full bg-[#f2f3ff] text-[#3f4850] pt-12 2xl:pt-16 pb-8 2xl:pb-12 border-t border-[#dae2fd] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 2xl:gap-12 mb-10 2xl:mb-14">
            {/* Col 1: About */}
            <div className="flex flex-col gap-2.5 2xl:gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 2xl:h-8 bg-[#006194] rounded-full" />
                <h4 className="text-lg 2xl:text-2xl text-[#131b2e] font-bold">Kolongan Satu</h4>
              </div>
              <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] leading-relaxed">
                Pemerintah Kelurahan Kolongan Satu, pusat administrasi dan keterbukaan data monografi kependudukan, wilayah, dan pelayanan masyarakat terpadu Kota Tomohon.
              </p>
            </div>

            {/* Col 2: Operating Hours */}
            <div className="flex flex-col gap-2.5 2xl:gap-4">
              <h5 className="text-base 2xl:text-xl text-[#131b2e] font-bold">Jam Pelayanan</h5>
              <ul className="space-y-1.5 2xl:space-y-2 text-xs sm:text-sm 2xl:text-base text-[#3f4850]">
                <li>Senin - Kamis: 08.00 - 16.00 WITA</li>
                <li>Jumat: 08.00 - 15.30 WITA</li>
                <li>Sabtu &amp; Minggu: Tutup (Layanan Daring Aktif)</li>
              </ul>
            </div>

            {/* Col 3: Quick Links */}
            <div className="flex flex-col gap-2.5 2xl:gap-4">
              <h5 className="text-base 2xl:text-xl text-[#131b2e] font-bold">Tautan Cepat</h5>
              <nav className="flex flex-col space-y-1.5 2xl:space-y-2 text-xs sm:text-sm 2xl:text-base">
                <Link href="/portal" className="text-[#3f4850] hover:text-[#006194] transition-colors">
                  Peta Wilayah Lingkungan
                </Link>
                <Link href="/monografi" className="text-[#3f4850] hover:text-[#006194] transition-colors">
                  Statistik Monografi
                </Link>
                <button
                  onClick={() => setIsLetterModalOpen(true)}
                  className="text-left text-[#3f4850] hover:text-[#006194] transition-colors cursor-pointer"
                >
                  Permohonan Surat Keterangan
                </button>
                <Link href="/portal" className="text-[#3f4850] hover:text-[#006194] transition-colors">
                  UMKM &amp; Potensi Desa
                </Link>
              </nav>
            </div>

            {/* Col 4: Office Contacts */}
            <div className="flex flex-col gap-2.5 2xl:gap-4">
              <h5 className="text-base 2xl:text-xl text-[#131b2e] font-bold">Kontak Kantor</h5>
              <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] leading-relaxed">
                Jl. Kolongan Raya, Kecamatan Tomohon Tengah, Kota Tomohon, Sulawesi Utara 95438
              </p>
              <p className="text-xs sm:text-sm 2xl:text-base text-[#006194] font-medium">
                Surel: kel.kolongansatu@tomohon.go.id
              </p>
            </div>
          </div>

          {/* Bottom Copyright bar */}
          <div className="pt-4 2xl:pt-6 border-t border-[#dae2fd] flex flex-col md:flex-row items-center justify-between gap-3 text-xs 2xl:text-sm text-[#3f4850]">
            <p>© 2024 Pemerintah Kelurahan Kolongan Satu, Kota Tomohon. Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-[#006194] transition-colors">
                Kebijakan Privasi
              </a>
              <span>•</span>
              <a href="#" className="hover:text-[#006194] transition-colors">
                Ketentuan Layanan
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 10. MODALS (Integrated Interactive Features)                 */}
      {/* ============================================================ */}
      <ModalLetterRequest
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        letters={letters}
        onAddLetter={handleAddLetter}
        onUpdateStatus={handleUpdateLetterStatus}
        currentOfficial={currentOfficial}
        onPrintLetter={handlePrintLetter}
      />

      <ModalMonografiPrint
        isOpen={isPrintMonografiOpen}
        onClose={() => setIsPrintMonografiOpen(false)}
        item={activeMonografi}
      />

      <ModalOfficialLetterPreview
        isOpen={isPrintLetterOpen}
        onClose={() => setIsPrintLetterOpen(false)}
        letter={printLetterTarget}
      />

      <ModalWhatsAppSimulator
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        activeItem={activeMonografi}
        onApproveViaMagicLink={() => {}}
        currentOfficial={currentOfficial}
      />
    </div>
  );
}
