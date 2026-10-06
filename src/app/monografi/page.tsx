'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MONOGRAFI_ITEMS, MonografiItem } from '@/data/monografiData';

export default function MonografiPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2024');
  const [liveItems, setLiveItems] = useState<MonografiItem[]>(MONOGRAFI_ITEMS);

  useEffect(() => {
    async function loadLiveMonografi() {
      try {
        const res = await fetch('/api/monografi');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && Array.isArray(json.data)) {
            setLiveItems(json.data);
          }
        }
      } catch (err) {
        console.warn('Gagal memuat live monografi:', err);
      }
    }
    loadLiveMonografi();
  }, []);

  // Compute dynamic population stats if available from liveItems
  const jagaItems = liveItems.filter((it) => it.id.startsWith('lingk-'));
  const dynamicTotalWarga = jagaItems.reduce((acc, it) => acc + (it.metrics?.totalWarga || 0), 0) || 1484;
  const dynamicTotalKK = jagaItems.reduce((acc, it) => acc + (it.metrics?.kepalaKeluarga || 0), 0) || 540;
  const dynamicPria = jagaItems.reduce((acc, it) => acc + (it.metrics?.pria || 0), 0) || 725;
  const dynamicWanita = jagaItems.reduce((acc, it) => acc + (it.metrics?.wanita || 0), 0) || 759;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId !== 'all') {
      const el = document.getElementById(tabId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  const showSecLahan = (activeTab === 'all' || activeTab === 'sec-lahan') && (
    matchesSearch('wilayah batas tata guna lahan administrasi pemukiman pertanian pekarangan')
  );

  const showSecDemografi = (activeTab === 'all' || activeTab === 'sec-demografi') && (
    matchesSearch('demografi piramida usia penduduk usia produktif disabilitas laki-laki perempuan')
  );

  const showSecPendidikan = (activeTab === 'all' || activeTab === 'sec-pendidikan') && (
    matchesSearch('pendidikan mata pencaharian sekolah lulusan pekerjaan wiraswasta petani guru')
  );

  const showSecAgraris = (activeTab === 'all' || activeTab === 'sec-agraris') && (
    matchesSearch('peternakan babi sapi unggas ayam air bersih sanitasi odf pdam')
  );

  const showSecSarana = (activeTab === 'all' || activeTab === 'sec-sarana') && (
    matchesSearch('sarana kelembagaan ibadah gereja posyandu pustu jalan linmas lpm pkk')
  );

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] antialiased min-h-screen font-sans selection:bg-[#006194] selection:text-white flex flex-col justify-between">
      {/* ============================================================ */}
      {/* 1. HEADER & NAVBAR                                          */}
      {/* ============================================================ */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-[#e2e7ff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 min-w-0 group">
            <div className="w-11 h-11 rounded-full bg-[#006194] flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-[#131b2e] truncate">Kelurahan Kolongan Satu</span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#cce5ff] text-[#006194] text-xs font-semibold">Tomohon</span>
              </div>
              <p className="text-xs text-[#3f4850] truncate">Kecamatan Tomohon Tengah, Kota Tomohon</p>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1 bg-[#f2f3ff] p-1.5 rounded-full border border-[#e2e7ff]">
            <Link href="/" className="text-sm px-4 py-2 rounded-full text-[#3f4850] hover:text-[#131b2e] hover:bg-white font-medium transition-colors">
              Beranda
            </Link>
            <Link href="/monografi" className="text-sm px-4 py-2 rounded-full bg-white text-[#006194] font-semibold shadow-xs transition-colors">
              Monografi Wilayah
            </Link>
            <button onClick={() => handleTabClick('sec-lahan')} className="text-sm px-4 py-2 rounded-full text-[#3f4850] hover:text-[#131b2e] hover:bg-white font-medium transition-colors cursor-pointer">
              5 Lingkungan Jaga
            </button>
            <Link href="/portal" className="text-sm px-4 py-2 rounded-full text-[#3f4850] hover:text-[#131b2e] hover:bg-white font-medium transition-colors">
              Layanan Mandiri
            </Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-[#bfc7d2]/40">
              <div className="text-right">
                <p className="text-xs font-bold text-[#131b2e] leading-tight">Theresia J. Kaunang, SE</p>
                <p className="text-[11px] text-[#006c49] font-medium leading-tight">Lurah Kolongan Satu</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#e2e7ff] flex items-center justify-center text-[#006194] font-bold shadow-xs">
                <span className="material-symbols-outlined text-lg">shield_person</span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-[#3f4850] hover:bg-[#f2f3ff]"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-[#e2e7ff] px-6 py-4 flex flex-col gap-2 shadow-lg">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#3f4850] font-medium py-1.5">Beranda</Link>
            <Link href="/monografi" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#006194] font-semibold py-1.5">Monografi Wilayah</Link>
            <Link href="/portal" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#3f4850] font-medium py-1.5">Layanan Mandiri / Portal</Link>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN BODY                                                 */}
      {/* ============================================================ */}
      <main className="w-full pt-20 bg-[#faf8ff] flex-1 no-print">
        <div className="flex flex-col w-full">

          {/* TOP HERO & META BANNER */}
          <section className="relative w-full bg-gradient-to-b from-[#e2e7ff]/30 via-[#faf8ff] to-[#faf8ff] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-5 relative z-10">

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-8 space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006194] bg-[#cce5ff]/50 px-2.5 py-1 rounded-md">
                    <span className="material-symbols-outlined text-sm">bar_chart</span>
                    <span>Profil &amp; Statistik Resmi</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#131b2e] leading-tight">
                    Monografi Kelurahan Kolongan Satu
                  </h1>
                  <p className="text-sm sm:text-base text-[#3f4850] max-w-2xl leading-relaxed">
                    Data statistik kependudukan, batas wilayah, serta sarana prasarana resmi Kelurahan Kolongan Satu, Kota Tomohon.
                  </p>
                </div>

                <div className="lg:col-span-4 grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white shadow-xs border border-[#e2e7ff]">
                  <div className="p-2.5 rounded-xl bg-[#f2f3ff]">
                    <span className="text-[11px] text-[#3f4850] block font-medium">Status Validasi</span>
                    <span className="text-sm font-bold text-[#006c49] flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-base">check_circle</span> Terverifikasi
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f2f3ff]">
                    <span className="text-[11px] text-[#3f4850] block font-medium">Wilayah</span>
                    <span className="text-sm font-bold text-[#006194] mt-0.5 block">5 Jaga</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f2f3ff]">
                    <span className="text-[11px] text-[#3f4850] block font-medium">Luas Wilayah</span>
                    <span className="text-sm font-bold text-[#131b2e] mt-0.5 block">48,05 Ha</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f2f3ff]">
                    <span className="text-[11px] text-[#3f4850] block font-medium">Sanitasi</span>
                    <span className="text-sm font-bold text-[#006c49] mt-0.5 block">100% ODF</span>
                  </div>
                </div>
              </div>

              {/* PERIODE SELECTOR BAR (CLEAN & SIMPLE) */}
              <div className="w-full bg-white rounded-2xl p-3.5 sm:p-4 shadow-xs border border-[#e2e7ff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-semibold text-[#131b2e] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006194] text-base">calendar_today</span>
                    Tahun Data:
                  </span>
                  <div className="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-full border border-[#eaedff]">
                    {['2024', '2023', '2022'].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setSelectedPeriod(yr)}
                        className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                          selectedPeriod === yr
                            ? 'bg-[#006194] text-white shadow-xs'
                            : 'text-[#3f4850] hover:text-[#131b2e] hover:bg-white'
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[#3f4850] text-[11px] sm:text-xs">
                  <span>Pembaruan: <strong className="text-[#131b2e]">Oktober 2024</strong></span>
                  <span>&bull;</span>
                  <span>Verifikator: <strong className="text-[#131b2e]">Kelurahan &amp; KKT 149 Unsrat</strong></span>
                </div>
              </div>

              {/* TABS & SEARCH BAR */}
              <div className="w-full bg-white p-2 rounded-2xl sm:rounded-full shadow-xs border border-[#e2e7ff] flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto py-1 px-1 scrollbar-hide">
                  {[
                    { id: 'all', label: 'Semua Data' },
                    { id: 'sec-lahan', label: '1. Wilayah & Lahan' },
                    { id: 'sec-demografi', label: '2. Kependudukan' },
                    { id: 'sec-pendidikan', label: '3. Pendidikan & Kerja' },
                    { id: 'sec-agraris', label: '4. Peternakan & Air' },
                    { id: 'sec-sarana', label: '5. Sarana & Lembaga' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-[#006194] text-white shadow-xs'
                          : 'bg-[#f2f3ff] text-[#3f4850] hover:text-[#131b2e] hover:bg-[#eaedff]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-80 flex items-center pr-1">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#707881] text-lg pointer-events-none">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari data monografi..."
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-[#faf8ff] text-[#131b2e] text-xs sm:text-sm border border-[#e2e7ff] focus:outline-none focus:ring-2 focus:ring-[#006194]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 text-xs text-[#707881] hover:text-[#131b2e]"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

            </div>
          </section>

          {/* ============================================================ */}
          {/* 3. 6 MASTER KPI SUMMARY METRICS                              */}
          {/* ============================================================ */}
          <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              
              {/* Total Penduduk */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#3f4850] font-medium">Total Penduduk</span>
                  <div className="w-8 h-8 rounded-full bg-[#cce5ff] flex items-center justify-center text-[#006194]">
                    <span className="material-symbols-outlined text-base">groups</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-bold text-[#131b2e]">{dynamicTotalWarga.toLocaleString('id-ID')}</span>
                    <span className="text-xs text-[#3f4850]">Jiwa</span>
                  </div>
                  <p className="text-[11px] text-[#3f4850] pt-1 border-t border-[#eaedff] font-medium">
                    {dynamicPria.toLocaleString('id-ID')} L ({Math.round((dynamicPria / dynamicTotalWarga) * 1000) / 10}%) • {dynamicWanita.toLocaleString('id-ID')} P ({Math.round((dynamicWanita / dynamicTotalWarga) * 1000) / 10}%)
                  </p>
                </div>
              </div>

              {/* Kepala Keluarga */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#3f4850] font-medium">Kepala Keluarga</span>
                  <div className="w-8 h-8 rounded-full bg-[#6cf8bb]/30 flex items-center justify-center text-[#006c49]">
                    <span className="material-symbols-outlined text-base">cottage</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-bold text-[#131b2e]">{dynamicTotalKK.toLocaleString('id-ID')}</span>
                    <span className="text-xs text-[#3f4850]">KK</span>
                  </div>
                  <p className="text-[11px] text-[#3f4850] pt-1 border-t border-[#eaedff]">
                    Rata-rata {(dynamicTotalWarga / dynamicTotalKK).toFixed(2)} jiwa/KK
                  </p>
                </div>
              </div>

              {/* Luas Wilayah */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#3f4850] font-medium">Luas Wilayah</span>
                  <div className="w-8 h-8 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#4d5d73]">
                    <span className="material-symbols-outlined text-base">square_foot</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-bold text-[#131b2e]">48,05</span>
                    <span className="text-xs text-[#3f4850]">Ha</span>
                  </div>
                  <p className="text-[11px] text-[#3f4850] pt-1 border-t border-[#eaedff]">
                    71,8% Pemukiman • 19,8% Kebun
                  </p>
                </div>
              </div>

              {/* Struktur Wilayah */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#3f4850] font-medium">Struktur Wilayah</span>
                  <div className="w-8 h-8 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#006194]">
                    <span className="material-symbols-outlined text-base">map</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-bold text-[#131b2e]">5</span>
                    <span className="text-xs text-[#3f4850]">Jaga</span>
                  </div>
                  <p className="text-[11px] text-[#3f4850] pt-1 border-t border-[#eaedff]">
                    Jaga I s/d V Terpetakan
                  </p>
                </div>
              </div>

              {/* Sanitasi & Air */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#3f4850] font-medium">Sanitasi &amp; Air</span>
                  <div className="w-8 h-8 rounded-full bg-[#6cf8bb]/30 flex items-center justify-center text-[#006c49]">
                    <span className="material-symbols-outlined text-base">verified</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-bold text-[#006c49]">100%</span>
                    <span className="text-xs font-semibold text-[#006c49]">ODF</span>
                  </div>
                  <p className="text-[11px] text-[#3f4850] pt-1 border-t border-[#eaedff]">
                    Jamban Sehat Seluruh KK
                  </p>
                </div>
              </div>

              {/* Melek Aksara */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#3f4850] font-medium">Melek Aksara</span>
                  <div className="w-8 h-8 rounded-full bg-[#cce5ff] flex items-center justify-center text-[#006194]">
                    <span className="material-symbols-outlined text-base">menu_book</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-bold text-[#006194]">100%</span>
                    <span className="text-xs font-semibold text-[#006194]">Bebas BA</span>
                  </div>
                  <p className="text-[11px] text-[#3f4850] pt-1 border-t border-[#eaedff]">
                    0 Buta Aksara Produktif
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 1: GEOGRAFIS, BATAS WILAYAH & TATA GUNA LAHAN        */}
          {/* ============================================================ */}
          {showSecLahan && (
            <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5" id="sec-lahan">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#006194] text-white text-xs font-bold">
                    1
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#131b2e]">
                    Wilayah, Batas &amp; Tata Guna Lahan
                  </h2>
                </div>
                <span className="text-xs text-[#3f4850] hidden sm:inline">Papan Monografi Lembar A-1</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left col: 5 cols */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {/* Batas Administratif */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] space-y-4">
                    <div className="flex items-center gap-2 text-[#006194]">
                      <span className="material-symbols-outlined">explore</span>
                      <h3 className="text-base font-bold text-[#131b2e]">Batas Wilayah Administratif (4 Penjuru)</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff]">
                        <span className="text-xs text-[#006194] block uppercase font-bold">Utara</span>
                        <p className="text-sm font-semibold text-[#131b2e] mt-0.5">Paslaten Satu</p>
                        <span className="text-[11px] text-[#3f4850]">Kec. Tomohon Timur</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff]">
                        <span className="text-xs text-[#006c49] block uppercase font-bold">Selatan</span>
                        <p className="text-sm font-semibold text-[#131b2e] mt-0.5">Talete Dua</p>
                        <span className="text-[11px] text-[#3f4850]">Kec. Tomohon Tengah</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff]">
                        <span className="text-xs text-[#4d5d73] block uppercase font-bold">Timur</span>
                        <p className="text-sm font-semibold text-[#131b2e] mt-0.5">Kelurahan Kolongan</p>
                        <span className="text-[11px] text-[#3f4850]">Kec. Tomohon Tengah</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff]">
                        <span className="text-xs text-[#3f4850] block uppercase font-bold">Barat</span>
                        <p className="text-sm font-semibold text-[#131b2e] mt-0.5">Kelurahan Kamasi</p>
                        <span className="text-[11px] text-[#3f4850]">Akses Kaki Lokon</span>
                      </div>
                    </div>
                  </div>

                  {/* Dinamika & Visualisasi Analitik */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#006194] text-xl">analytics</span>
                        <div>
                          <h4 className="text-sm font-bold text-[#131b2e] leading-tight">Dinamika &amp; Visualisasi Analitik</h4>
                          <p className="text-[11px] text-[#3f4850]">Faktual Terverifikasi 2024</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#006c49] text-xs font-semibold">Live Monografi</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold text-[#131b2e]">
                        <span>Kelompok Usia Utama</span>
                        <span className="text-[#006194] font-bold">59% Produktif</span>
                      </div>
                      <div className="w-full flex h-3 rounded-full overflow-hidden bg-[#eaedff]">
                        <div className="bg-[#dae2fd] h-full" style={{ width: '22%' }} title="0-17 Thn (22%)" />
                        <div className="bg-[#006194] h-full" style={{ width: '59%' }} title="18-56 Thn Produktif (59%)" />
                        <div className="bg-[#006c49] h-full" style={{ width: '19%' }} title="57+ Thn (19%)" />
                      </div>
                      <div className="flex justify-between text-[11px] text-[#3f4850] pt-0.5">
                        <span><span className="inline-block w-2 h-2 rounded-full bg-[#dae2fd] mr-1" />0-17 thn (22%)</span>
                        <span><span className="inline-block w-2 h-2 rounded-full bg-[#006194] mr-1" />18-56 thn (59%)</span>
                        <span><span className="inline-block w-2 h-2 rounded-full bg-[#006c49] mr-1" />&gt;56 thn (19%)</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#eaedff] grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-[#f2f3ff]">
                        <span className="block text-[11px] text-[#3f4850]">Usia Kerja</span>
                        <span className="font-bold text-sm text-[#006194]">876</span>
                        <span className="block text-[10px] text-[#006c49] font-semibold">Jiwa Aktif</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#f2f3ff]">
                        <span className="block text-[11px] text-[#3f4850]">Sanitasi ODF</span>
                        <span className="font-bold text-sm text-[#006c49]">100%</span>
                        <span className="block text-[10px] text-[#006c49] font-semibold">Paripurna</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#f2f3ff]">
                        <span className="block text-[11px] text-[#3f4850]">Wilayah Jaga</span>
                        <span className="font-bold text-sm text-[#131b2e]">5 Jaga</span>
                        <span className="block text-[10px] text-[#006194] font-semibold">Terhubung</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right col: 7 cols */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-base font-bold text-[#131b2e]">Distribusi &amp; Alokasi Lahan (48,05 Ha)</h3>
                          <p className="text-xs text-[#3f4850]">Penggunaan ruang faktual berdasarkan buku register kelurahan</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#6cf8bb]/30 text-[#006c49] text-xs font-bold">100% Terdata</span>
                      </div>

                      {/* Donut Chart & Progress Bars Container */}
                      <div className="my-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[#f2f3ff]/70 p-4 sm:p-5 rounded-2xl border border-[#e2e7ff]">
                        <div className="sm:col-span-5 flex flex-col items-center justify-center">
                          <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                              <circle cx="80" cy="80" r="62" fill="transparent" stroke="#e2e7ff" strokeWidth="18" />
                              <circle cx="80" cy="80" r="62" fill="transparent" stroke="#006194" strokeWidth="18" strokeDasharray="389.5" strokeDashoffset="109.8" strokeLinecap="round" />
                              <circle cx="80" cy="80" r="62" fill="transparent" stroke="#006c49" strokeWidth="18" strokeDasharray="389.5" strokeDashoffset="312.4" strokeLinecap="round" />
                              <circle cx="80" cy="80" r="62" fill="transparent" stroke="#66768d" strokeWidth="18" strokeDasharray="389.5" strokeDashoffset="357.2" strokeLinecap="round" />
                              <circle cx="80" cy="80" r="62" fill="transparent" stroke="#bfc7d2" strokeWidth="18" strokeDasharray="389.5" strokeDashoffset="388.5" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                              <span className="text-[10px] font-semibold text-[#3f4850] uppercase tracking-wider">Total Luas</span>
                              <span className="text-2xl font-bold text-[#131b2e] leading-tight">48,05</span>
                              <span className="text-xs font-bold text-[#006194]">Hektar</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="w-2 h-2 rounded-full bg-[#006c49]" />
                            <span className="text-[11px] font-medium text-[#3f4850]">Sensus Register Lahan Terpadu</span>
                          </div>
                        </div>

                        <div className="sm:col-span-7 space-y-2.5">
                          <div className="space-y-1">
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-[#131b2e] font-semibold flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#006194] inline-block shadow-xs" />
                                Pemukiman Warga
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#131b2e]">34,50 ha</span>
                                <span className="px-2 py-0.5 rounded-full bg-[#cce5ff] text-[#006194] font-semibold text-[11px]">71,8%</span>
                              </div>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden">
                              <div className="h-full bg-[#006194] rounded-full" style={{ width: '71.8%' }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-[#131b2e] font-semibold flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#006c49] inline-block shadow-xs" />
                                Pertanian &amp; Ladang
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#131b2e]">9,50 ha</span>
                                <span className="px-2 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#006c49] font-semibold text-[11px]">19,8%</span>
                              </div>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden">
                              <div className="h-full bg-[#006c49] rounded-full" style={{ width: '19.8%' }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-[#131b2e] font-semibold flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#66768d] inline-block shadow-xs" />
                                Pekarangan Rumah
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#131b2e]">4,00 ha</span>
                                <span className="px-2 py-0.5 rounded-full bg-[#e2e7ff] text-[#4d5d73] font-semibold text-[11px]">8,3%</span>
                              </div>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden">
                              <div className="h-full bg-[#66768d] rounded-full" style={{ width: '8.3%' }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-[#131b2e] font-semibold flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#bfc7d2] inline-block shadow-xs" />
                                Lahan Tidur / Resapan
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#131b2e]">0,05 ha</span>
                                <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#3f4850] font-semibold text-[11px]">0,1%</span>
                              </div>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden">
                              <div className="h-full bg-[#bfc7d2] rounded-full" style={{ width: '3%' }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tabel Klasifikasi Lahan */}
                      <div className="overflow-x-auto mt-4">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-[#f2f3ff] text-[#3f4850] border-b border-[#eaedff]">
                              <th className="py-2.5 px-3 rounded-l-xl font-semibold">Klasifikasi</th>
                              <th className="py-2.5 px-3 text-right font-semibold">Luas (Ha)</th>
                              <th className="py-2.5 px-3 text-right font-semibold">Rasio</th>
                              <th className="py-2.5 px-3 rounded-r-xl font-semibold">Keterangan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#eaedff] text-[#131b2e]">
                            <tr>
                              <td className="py-2.5 px-3 font-medium">Pemukiman</td>
                              <td className="py-2.5 px-3 text-right font-bold text-[#006194]">34,50</td>
                              <td className="py-2.5 px-3 text-right">71,80%</td>
                              <td className="py-2.5 px-3 text-[#3f4850]">Jaga I s/d V</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-3 font-medium">Pertanian / Ladang</td>
                              <td className="py-2.5 px-3 text-right font-bold text-[#006c49]">9,50</td>
                              <td className="py-2.5 px-3 text-right">19,77%</td>
                              <td className="py-2.5 px-3 text-[#3f4850]">Sayuran &amp; Bunga</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-3 font-medium">Pekarangan</td>
                              <td className="py-2.5 px-3 text-right font-bold text-[#4d5d73]">4,00</td>
                              <td className="py-2.5 px-3 text-right">8,32%</td>
                              <td className="py-2.5 px-3 text-[#3f4850]">Ternak &amp; Tanaman</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-3 font-medium">Lahan Tidur</td>
                              <td className="py-2.5 px-3 text-right font-semibold">0,05</td>
                              <td className="py-2.5 px-3 text-right">0,11%</td>
                              <td className="py-2.5 px-3 text-[#3f4850]">Resapan Alami</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-xs text-[#3f4850]">
                      <span>Total: <strong className="text-[#131b2e]">48,05 Hektar</strong></span>
                      <span className="text-[#006c49] font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span> 0% Konflik Sengketa Lahan
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* SECTION 2: DEMOGRAFI, STRUKTUR USIA & PIRAMIDA PENDUDUK     */}
          {/* ============================================================ */}
          {showSecDemografi && (
            <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5" id="sec-demografi">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#006194] text-white text-xs font-bold">
                    2
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#131b2e]">
                    Demografi &amp; Piramida Usia Penduduk
                  </h2>
                </div>
                <span className="text-xs text-[#3f4850] hidden sm:inline">Papan Monografi Lembar B-1 &amp; B-2</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Piramida & Segmentasi Usia (8 cols) */}
                <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-base font-bold text-[#131b2e]">Komposisi Usia &amp; Kelompok Tenaga Kerja</h3>
                        <p className="text-xs text-[#3f4850]">Rincian komparasi demografis berbasis sensus register faktual</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs bg-[#f2f3ff] px-3 py-1.5 rounded-full border border-[#e2e7ff]">
                        <span className="inline-flex items-center gap-1.5 text-[#006194] font-semibold">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#006194] inline-block" />
                          L: {dynamicPria.toLocaleString('id-ID')} ({Math.round((dynamicPria / dynamicTotalWarga) * 1000) / 10}%)
                        </span>
                        <span className="text-[#bfc7d2]">|</span>
                        <span className="inline-flex items-center gap-1.5 text-[#006c49] font-semibold">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#006c49] inline-block" />
                          P: {dynamicWanita.toLocaleString('id-ID')} ({Math.round((dynamicWanita / dynamicTotalWarga) * 1000) / 10}%)
                        </span>
                      </div>
                    </div>

                    {/* Dual Ratio Bar */}
                    <div className="mb-5 p-3 rounded-xl bg-[#f2f3ff] space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-[#131b2e]">
                        <span>Komparasi Rasio Gender: Laki-laki vs Perempuan</span>
                        <span>Total {dynamicTotalWarga.toLocaleString('id-ID')} Jiwa</span>
                      </div>
                      <div className="w-full h-4 rounded-full overflow-hidden flex bg-[#eaedff]">
                        <div className="bg-[#006194] h-full flex items-center justify-center text-[10px] text-white font-bold" style={{ width: '48.9%' }}>
                          48,9%
                        </div>
                        <div className="bg-[#006c49] h-full flex items-center justify-center text-[10px] text-white font-bold" style={{ width: '51.1%' }}>
                          51,1%
                        </div>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#3f4850] pt-0.5">
                        <span><strong className="text-[#006194]">{dynamicPria.toLocaleString('id-ID')}</strong> Laki-laki</span>
                        <span><strong className="text-[#006c49]">{dynamicWanita.toLocaleString('id-ID')}</strong> Perempuan (Selisih +{dynamicWanita - dynamicPria})</span>
                      </div>
                    </div>

                    {/* Vertical Age Cohorts Bar Chart */}
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#006194] text-base">equalizer</span>
                          Distribusi Kelompok Umur &amp; Status Tenaga Kerja
                        </h4>
                        <span className="text-[11px] text-[#3f4850] font-medium bg-[#eaedff] px-2.5 py-1 rounded-full">
                          Grafik Kolom Vertikal
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#f2f3ff] border border-[#e2e7ff]">
                        <div className="h-52 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-[#e2e7ff]">
                          
                          <div className="flex-1 flex flex-col items-center h-full justify-end group">
                            <span className="text-xs font-bold text-[#131b2e] mb-1 group-hover:text-[#006194] transition-colors">109</span>
                            <div className="w-full max-w-[48px] bg-[#007bb9]/80 hover:bg-[#007bb9] rounded-t-xl transition-all shadow-xs flex items-end justify-center pb-1 text-[10px] text-white font-semibold" style={{ height: '22%' }}>
                              7,3%
                            </div>
                            <span className="text-[11px] font-semibold text-[#131b2e] mt-2 text-center truncate max-w-full">0-6 Thn</span>
                            <span className="text-[10px] text-[#3f4850]">Balita</span>
                          </div>

                          <div className="flex-1 flex flex-col items-center h-full justify-end group">
                            <span className="text-xs font-bold text-[#131b2e] mb-1 group-hover:text-[#006194] transition-colors">222</span>
                            <div className="w-full max-w-[48px] bg-[#006194] hover:bg-[#007bb9] rounded-t-xl transition-all shadow-xs flex items-end justify-center pb-1 text-[10px] text-white font-semibold" style={{ height: '45%' }}>
                              15,0%
                            </div>
                            <span className="text-[11px] font-semibold text-[#131b2e] mt-2 text-center truncate max-w-full">7-18 Thn</span>
                            <span className="text-[10px] text-[#3f4850]">Sekolah</span>
                          </div>

                          <div className="flex-1 flex flex-col items-center h-full justify-end group relative">
                            <div className="absolute -top-3.5 bg-[#6cf8bb] text-[#002113] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                              Mayoritas
                            </div>
                            <span className="text-xs font-bold text-[#006c49] mb-1">494</span>
                            <div className="w-full max-w-[48px] bg-[#006c49] hover:bg-[#4edea3] rounded-t-xl transition-all shadow-sm flex items-end justify-center pb-1 text-[10px] text-white font-semibold" style={{ height: '100%' }}>
                              33,3%
                            </div>
                            <span className="text-[11px] font-bold text-[#006c49] mt-2 text-center truncate max-w-full">18-56 Thn</span>
                            <span className="text-[10px] text-[#006c49] font-semibold">Bekerja</span>
                          </div>

                          <div className="flex-1 flex flex-col items-center h-full justify-end group">
                            <span className="text-xs font-bold text-[#131b2e] mb-1 group-hover:text-[#4d5d73] transition-colors">382</span>
                            <div className="w-full max-w-[48px] bg-[#66768d] hover:bg-[#4d5d73] rounded-t-xl transition-all shadow-xs flex items-end justify-center pb-1 text-[10px] text-white font-semibold" style={{ height: '77%' }}>
                              25,7%
                            </div>
                            <span className="text-[11px] font-semibold text-[#131b2e] mt-2 text-center truncate max-w-full">IRT/Cari</span>
                            <span className="text-[10px] text-[#3f4850]">Produktif</span>
                          </div>

                          <div className="flex-1 flex flex-col items-center h-full justify-end group">
                            <span className="text-xs font-bold text-[#131b2e] mb-1 group-hover:text-[#006194] transition-colors">277</span>
                            <div className="w-full max-w-[48px] bg-[#93ccff] hover:bg-[#cce5ff] rounded-t-xl transition-all shadow-xs flex items-end justify-center pb-1 text-[10px] text-[#006194] font-bold" style={{ height: '56%' }}>
                              18,7%
                            </div>
                            <span className="text-[11px] font-semibold text-[#131b2e] mt-2 text-center truncate max-w-full">&gt;56 Thn</span>
                            <span className="text-[10px] text-[#3f4850]">Lansia</span>
                          </div>

                        </div>

                        <div className="flex flex-wrap items-center justify-between pt-2.5 px-1 text-xs text-[#3f4850] gap-2">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#006c49] inline-block" />
                              Angkatan Kerja Aktif: 494 Jiwa
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#006194] inline-block" />
                              Pelajar &amp; Balita: 331 Jiwa
                            </span>
                          </div>
                          <span className="text-[#006194] font-semibold">Total Basis: {dynamicTotalWarga.toLocaleString('id-ID')} Jiwa</span>
                        </div>
                      </div>
                    </div>

                    {/* Summary Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff]">
                        <span className="text-[11px] text-[#3f4850] block font-medium">Total Usia Produktif</span>
                        <span className="font-bold text-lg text-[#006194]">876 Jiwa</span>
                        <span className="text-[10px] text-[#006c49] font-semibold block">59,03% Mayoritas</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff]">
                        <span className="text-[11px] text-[#3f4850] block font-medium">Tingkat Partisipasi Kerja</span>
                        <span className="font-bold text-lg text-[#006c49]">56,4%</span>
                        <span className="text-[10px] text-[#3f4850] block">Dari Angkatan Produktif</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff]">
                        <span className="text-[11px] text-[#3f4850] block font-medium">Rasio Ketergantungan</span>
                        <span className="font-bold text-lg text-[#131b2e]">69,4%</span>
                        <span className="text-[10px] text-[#006c49] font-semibold block">Bonus Demografi Terbuka</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#f2f3ff] flex items-center justify-between text-xs text-[#3f4850] border border-[#e2e7ff]">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#006194]">info</span>
                      Register Kependudukan Terverifikasi Tingkat Jaga I s/d V
                    </span>
                    <span className="font-medium text-[#006c49]">Status Mutasi Nihil Anomali</span>
                  </div>
                </div>

                {/* Disabilitas & Kesejahteraan Sosial (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] space-y-4 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[#006194] mb-1">
                        <span className="material-symbols-outlined">accessible</span>
                        <h3 className="text-base font-bold text-[#131b2e]">Data Disabilitas &amp; Khusus</h3>
                      </div>
                      <p className="text-xs text-[#3f4850]">Warga binaan pendampingan sosial</p>

                      <div className="space-y-2.5 mt-4">
                        <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#e2e7ff]">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#707881]">hearing_disabled</span>
                            <span className="text-xs sm:text-sm font-medium text-[#131b2e]">Tuna Rungu / Wicara</span>
                          </div>
                          <span className="text-base font-bold text-[#131b2e]">2 <span className="text-xs font-normal text-[#3f4850]">orang</span></span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#e2e7ff]">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#707881]">visibility_off</span>
                            <span className="text-xs sm:text-sm font-medium text-[#131b2e]">Tuna Netra</span>
                          </div>
                          <span className="text-base font-bold text-[#131b2e]">1 <span className="text-xs font-normal text-[#3f4850]">orang</span></span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#e2e7ff]">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#707881]">assist_walker</span>
                            <span className="text-xs sm:text-sm font-medium text-[#131b2e]">Lumpuh Fisik</span>
                          </div>
                          <span className="text-base font-bold text-[#131b2e]">1 <span className="text-xs font-normal text-[#3f4850]">orang</span></span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#e2e7ff]">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#707881]">psychology</span>
                            <span className="text-xs sm:text-sm font-medium text-[#131b2e]">Kebutuhan Mental/Binaan</span>
                          </div>
                          <span className="text-base font-bold text-[#131b2e]">1 <span className="text-xs font-normal text-[#3f4850]">orang</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#6cf8bb]/30 border border-[#6cf8bb]/50 space-y-1">
                      <span className="text-xs text-[#006c49] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">health_and_safety</span>
                        Layanan Perlindungan Sosial
                      </span>
                      <p className="text-xs text-[#131b2e] leading-relaxed">
                        Seluruh warga berkebutuhan khusus telah tercatat di basis data perlindungan sosial Dinas Sosial Kota Tomohon dan menerima kunjungan berkala kader Posyandu.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* SECTION 3: PENDIDIKAN & MATA PENCAHARIAN WARGA              */}
          {/* ============================================================ */}
          {showSecPendidikan && (
            <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5" id="sec-pendidikan">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#006194] text-white text-xs font-bold">
                    3
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#131b2e]">
                    Tingkat Pendidikan &amp; Ragam Mata Pencaharian
                  </h2>
                </div>
                <span className="text-xs text-[#3f4850] hidden sm:inline">Papan Monografi Lembar C-1 &amp; C-2</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Distribusi Pendidikan (7 cols) */}
                <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-[#131b2e]">Tingkat Kelulusan Pendidikan Formal</h3>
                        <p className="text-xs text-[#3f4850]">Berdasarkan ijazah tertinggi yang dimiliki warga Kolongan Satu</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#cce5ff] text-[#006194] text-xs font-bold">1.016 Lulusan</span>
                    </div>

                    {/* Donut & Bar chart */}
                    <div className="mb-4 p-4 rounded-2xl bg-[#f2f3ff]/70 border border-[#e2e7ff] grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-5 flex flex-col items-center justify-center">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                            <circle cx="80" cy="80" r="60" fill="transparent" stroke="#e2e7ff" strokeWidth="20" />
                            <circle cx="80" cy="80" r="60" fill="transparent" stroke="#006194" strokeWidth="20" strokeDasharray="377" strokeDashoffset="183.9" strokeLinecap="round" />
                            <circle cx="80" cy="80" r="60" fill="transparent" stroke="#006c49" strokeWidth="20" strokeDasharray="377" strokeDashoffset="298.6" strokeLinecap="round" />
                            <circle cx="80" cy="80" r="60" fill="transparent" stroke="#007bb9" strokeWidth="20" strokeDasharray="377" strokeDashoffset="341.2" strokeLinecap="round" />
                            <circle cx="80" cy="80" r="60" fill="transparent" stroke="#66768d" strokeWidth="20" strokeDasharray="377" strokeDashoffset="361.9" strokeLinecap="round" />
                            <circle cx="80" cy="80" r="60" fill="transparent" stroke="#4edea3" strokeWidth="20" strokeDasharray="377" strokeDashoffset="372.4" strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                            <span className="text-[10px] font-semibold text-[#3f4850] uppercase tracking-wider">Lulusan</span>
                            <span className="text-xl font-bold text-[#131b2e] leading-tight">1.016</span>
                            <span className="text-[11px] font-bold text-[#006c49]">100% Melek</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-[#3f4850] mt-1.5 font-medium">Komposisi Lulusan Ijazah</span>
                      </div>

                      <div className="sm:col-span-7 space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-[#131b2e] flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#006194] inline-block" />
                              SMA / SMK (Sederajat)
                            </span>
                            <span className="font-bold text-[#006194]">520 <span className="text-[#3f4850] font-normal text-[11px]">(51,2%)</span></span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden">
                            <div className="h-full bg-[#006194] rounded-full" style={{ width: '51.2%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-[#131b2e] flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#006c49] inline-block" />
                              Sarjana (S1)
                            </span>
                            <span className="font-bold text-[#006c49]">212 <span className="text-[#3f4850] font-normal text-[11px]">(20,8%)</span></span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden">
                            <div className="h-full bg-[#006c49] rounded-full" style={{ width: '20.8%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-[#131b2e] flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#007bb9] inline-block" />
                              SMP / SLTP
                            </span>
                            <span className="font-bold text-[#131b2e]">154 <span className="text-[#3f4850] font-normal text-[11px]">(15,2%)</span></span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#eaedff] overflow-hidden">
                            <div className="h-full bg-[#007bb9] rounded-full" style={{ width: '15.2%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-[#131b2e] flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#66768d] inline-block" />
                              SD / Sederajat
                            </span>
                            <span className="font-bold text-[#131b2e]">78 <span className="text-[#3f4850] font-normal text-[11px]">(7,7%)</span></span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#eaedff] overflow-hidden">
                            <div className="h-full bg-[#66768d] rounded-full" style={{ width: '7.7%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-[#131b2e] flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] inline-block" />
                              Diploma &amp; Pascasarjana
                            </span>
                            <span className="font-bold text-[#131b2e]">50 <span className="text-[#3f4850] font-normal text-[11px]">(4,9%)</span></span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#eaedff] overflow-hidden">
                            <div className="h-full bg-[#4edea3] rounded-full" style={{ width: '4.9%' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Indicator Highlight */}
                    <div className="p-3.5 rounded-xl bg-[#e2e7ff]/40 flex items-center justify-between border border-[#dae2fd]">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#006c49] text-2xl">auto_stories</span>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-[#131b2e] block">Indeks Melek Aksara: 100%</span>
                          <span className="text-xs text-[#3f4850]">Bebas buta aksara usia produktif dengan ketersediaan SLB &amp; SD di wilayah.</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#006c49]">check_circle</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-xs text-[#3f4850]">
                    <span>1 Sekolah Luar Biasa (SLB C) dan 1 Sekolah Dasar aktif beroperasi</span>
                    <span className="font-semibold text-[#006194]">Pendidikan Berkeadilan</span>
                  </div>
                </div>

                {/* Ragam Mata Pencaharian (5 cols) */}
                <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-[#131b2e]">Sektor Pekerjaan Utama</h3>
                        <p className="text-xs text-[#3f4850]">Distribusi mata pencaharian warga aktif (494 Jiwa)</p>
                      </div>
                      <span className="material-symbols-outlined text-[#006194]">work</span>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-[#131b2e] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[#006194] text-base">storefront</span>
                            Wiraswasta, Warung &amp; Kios
                          </span>
                          <span className="font-bold text-[#006c49]">148 (30,0%)</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[#eaedff] overflow-hidden">
                          <div className="h-full bg-[#006c49] rounded-full" style={{ width: '30%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-[#131b2e] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[#006c49] text-base">agriculture</span>
                            Petani &amp; Pekebun Hortikultura
                          </span>
                          <span className="font-bold text-[#131b2e]">114 (23,1%)</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[#eaedff] overflow-hidden">
                          <div className="h-full bg-[#006194] rounded-full" style={{ width: '23.1%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-[#131b2e] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[#4d5d73] text-base">construction</span>
                            Tukang Kayu, Batu &amp; Las Besi
                          </span>
                          <span className="font-bold text-[#131b2e]">89 (18,0%)</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[#eaedff] overflow-hidden">
                          <div className="h-full bg-[#66768d] rounded-full" style={{ width: '18%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-[#131b2e] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[#006194] text-base">badge</span>
                            Aparatur Sipil (ASN/TNI/Polri)
                          </span>
                          <span className="font-bold text-[#131b2e]">58 (11,7%)</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[#eaedff] overflow-hidden">
                          <div className="h-full bg-[#007bb9] rounded-full" style={{ width: '11.7%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-[#131b2e] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[#707881] text-base">school</span>
                            Guru &amp; Tenaga Kependidikan
                          </span>
                          <span className="font-bold text-[#131b2e]">45 (9,1%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden">
                          <div className="h-full bg-[#bfc7d2] rounded-full" style={{ width: '9.1%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-[#131b2e] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[#707881] text-base">business_center</span>
                            Swasta, Ojek &amp; Jasa Angkutan
                          </span>
                          <span className="font-bold text-[#131b2e]">40 (8,1%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden">
                          <div className="h-full bg-[#bfc7d2] rounded-full" style={{ width: '8.1%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#eaedff]">
                    <p className="text-xs text-[#3f4850] leading-relaxed">
                      Perekonomian bercorak transisi agraris ke jasa dan perdagangan mikro yang berdekatan dengan pusat Kota Tomohon.
                    </p>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* SECTION 4: PETERNAKAN, SUMBER DAYA AIR & LINGKUNGAN          */}
          {/* ============================================================ */}
          {showSecAgraris && (
            <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5" id="sec-agraris">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#006194] text-white text-xs font-bold">
                    4
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#131b2e]">
                    Potensi Peternakan &amp; Ketahanan Air Bersih
                  </h2>
                </div>
                <span className="text-xs text-[#3f4850] hidden sm:inline">Papan Monografi Lembar D-1</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Populasi Ternak (6 cols) */}
                <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-[#131b2e]">Populasi Ternak Peliharaan Warga</h3>
                        <p className="text-xs text-[#3f4850]">Sensus komoditas ternak di 5 Lingkungan Jaga</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#6cf8bb]/30 text-[#006c49] text-xs font-bold">Sub-Sektor Unggulan</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="p-3.5 rounded-xl bg-[#f2f3ff] text-center flex flex-col justify-between border border-[#e2e7ff]">
                        <div>
                          <span className="material-symbols-outlined text-3xl text-[#006194] mb-1">pets</span>
                          <span className="text-xs text-[#3f4850] block font-medium">Ternak Babi</span>
                        </div>
                        <div className="my-2">
                          <span className="text-2xl font-bold text-[#131b2e]">340</span>
                          <span className="text-[11px] text-[#3f4850] block">Ekor Terdata</span>
                        </div>
                        <span className="text-[11px] text-[#006c49] font-semibold">Kandang Higienis</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#f2f3ff] text-center flex flex-col justify-between border border-[#e2e7ff]">
                        <div>
                          <span className="material-symbols-outlined text-3xl text-[#006c49] mb-1">grass</span>
                          <span className="text-xs text-[#3f4850] block font-medium">Ternak Sapi</span>
                        </div>
                        <div className="my-2">
                          <span className="text-2xl font-bold text-[#131b2e]">35</span>
                          <span className="text-[11px] text-[#3f4850] block">Ekor Terdata</span>
                        </div>
                        <span className="text-[11px] text-[#006194] font-semibold">Penggembalaan</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#f2f3ff] text-center flex flex-col justify-between border border-[#e2e7ff]">
                        <div>
                          <span className="material-symbols-outlined text-3xl text-[#4d5d73] mb-1">egg</span>
                          <span className="text-xs text-[#3f4850] block font-medium">Unggas / Ayam</span>
                        </div>
                        <div className="my-2">
                          <span className="text-2xl font-bold text-[#131b2e]">1.450</span>
                          <span className="text-[11px] text-[#3f4850] block">Ekor Terdata</span>
                        </div>
                        <span className="text-[11px] text-[#3f4850] font-semibold">Buras &amp; Petelur</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#f2f3ff] border border-[#e2e7ff] space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-[#eaedff]">
                        <span className="text-xs font-semibold text-[#131b2e] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#006194] text-base">donut_large</span>
                          Analitik &amp; Proporsi Populasi Ternak
                        </span>
                        <span className="text-xs font-bold text-[#006194] bg-[#cce5ff] px-2.5 py-0.5 rounded-full">Total 1.825 Ekor</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center py-1">
                        <div className="sm:col-span-5 flex flex-col items-center justify-center">
                          <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                              <circle cx="70" cy="70" r="52" fill="transparent" stroke="#e2e7ff" strokeWidth="16" />
                              <circle cx="70" cy="70" r="52" fill="transparent" stroke="#006194" strokeWidth="16" strokeDasharray="326.7" strokeDashoffset="67.3" strokeLinecap="round" />
                              <circle cx="70" cy="70" r="52" fill="transparent" stroke="#006c49" strokeWidth="16" strokeDasharray="326.7" strokeDashoffset="265.9" strokeLinecap="round" />
                              <circle cx="70" cy="70" r="52" fill="transparent" stroke="#66768d" strokeWidth="16" strokeDasharray="326.7" strokeDashoffset="320.2" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                              <span className="text-[10px] font-semibold text-[#3f4850] uppercase">Populasi</span>
                              <span className="text-lg font-bold text-[#131b2e] leading-none">1.825</span>
                              <span className="text-[10px] text-[#006c49] font-bold">Ekor</span>
                            </div>
                          </div>
                        </div>

                        <div className="sm:col-span-7 space-y-2">
                          <div className="space-y-1">
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="font-semibold text-[#131b2e] flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#006194] inline-block" />
                                Unggas / Ayam
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-[#131b2e]">1.450</span>
                                <span className="px-1.5 py-0.5 rounded-full bg-[#cce5ff] text-[#006194] font-bold text-[10px]">79,4%</span>
                              </div>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden">
                              <div className="h-full bg-[#006194]" style={{ width: '79.4%' }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="font-semibold text-[#131b2e] flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#006c49] inline-block" />
                                Ternak Babi (Kandang)
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-[#131b2e]">340</span>
                                <span className="px-1.5 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#006c49] font-bold text-[10px]">18,6%</span>
                              </div>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden">
                              <div className="h-full bg-[#006c49]" style={{ width: '18.6%' }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="font-semibold text-[#131b2e] flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#66768d] inline-block" />
                                Ternak Sapi
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-[#131b2e]">35</span>
                                <span className="px-1.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#4d5d73] font-bold text-[10px]">2,0%</span>
                              </div>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden">
                              <div className="h-full bg-[#66768d]" style={{ width: '5%' }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#eaedff] flex items-center justify-between text-[11px] text-[#3f4850]">
                        <span>Indeks Higienitas &amp; Sanitasi Kandang</span>
                        <span className="font-semibold text-[#006c49] flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">health_and_safety</span> 98,2% Sesuai SOP Kelayakan
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-xs text-[#3f4850]">
                    <span>Kandang diatur berjarak higienis dari permukiman</span>
                    <span className="font-semibold text-[#006c49]">Binaan Dinas Pertanian Tomohon</span>
                  </div>
                </div>

                {/* Sumber Daya Air & Sanitasi (6 cols) */}
                <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-[#131b2e]">Sumber Daya Air &amp; Sanitasi Alami</h3>
                        <p className="text-xs text-[#3f4850]">Kualitas pasokan air bersih konsumsi dan irigasi</p>
                      </div>
                      <span className="material-symbols-outlined text-[#006194]">water_drop</span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex items-start gap-3 border border-[#e2e7ff]">
                        <div className="w-10 h-10 rounded-full bg-[#cce5ff] flex items-center justify-center text-[#006194] shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-xl">waves</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-[#131b2e]">Aliran Sungai Alami</span>
                            <span className="px-2 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#006c49] text-xs font-semibold">Kondisi Baik</span>
                          </div>
                          <p className="text-xs text-[#3f4850] mt-0.5 leading-relaxed">
                            Debit air sedang, tidak tercemar, sebagai drainase resapan utama pegunungan.
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex items-start gap-3 border border-[#e2e7ff]">
                        <div className="w-10 h-10 rounded-full bg-[#6cf8bb]/30 flex items-center justify-center text-[#006c49] shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-xl">opacity</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-[#131b2e]">Mata Air Pegunungan Vulkanik</span>
                            <span className="px-2 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#006c49] text-xs font-semibold">Debit Besar</span>
                          </div>
                          <p className="text-xs text-[#3f4850] mt-0.5 leading-relaxed">
                            Mata air alami pegunungan dimanfaatkan untuk konsumsi dan sanitasi warga.
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex items-start gap-3 border border-[#e2e7ff]">
                        <div className="w-10 h-10 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#4d5d73] shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-xl">water_damage</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-[#131b2e]">Sumur Gali &amp; Pompa Air Warga</span>
                            <span className="font-bold text-[#131b2e] text-xs">14 Titik Sah</span>
                          </div>
                          <p className="text-xs text-[#3f4850] mt-0.5 leading-relaxed">
                            Tersebar di Jaga I - V dengan kondisi fisik terawat dan air jernih tanpa bau.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#eaedff] flex items-center justify-between text-xs text-[#131b2e]">
                      <span className="flex items-center gap-1.5 text-[#006c49] font-bold">
                        <span className="material-symbols-outlined text-sm">verified_user</span> Status ODF (Open Defecation Free)
                      </span>
                      <span className="font-medium">Jamban Sehat 100% Seluruh KK</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#eaedff] text-xs text-[#3f4850]">
                    Penyediaan air minum utama disuplai PDAM Kota Tomohon &amp; PAM Kelurahan.
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* SECTION 5: SARANA PRASARANA, KELEMBAGAAN & FASILITAS UMUM   */}
          {/* ============================================================ */}
          {showSecSarana && (
            <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5" id="sec-sarana">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#006194] text-white text-xs font-bold">
                    5
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#131b2e]">
                    Kelembagaan, Fasilitas Ibadah &amp; Sarana Publik
                  </h2>
                </div>
                <span className="text-xs text-[#3f4850] hidden sm:inline">Papan Monografi Lembar E-1 s/d E-3</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                
                {/* Card A: Pemerintah & Lembaga */}
                <div className="p-5 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#006194]">
                      <span className="material-symbols-outlined">account_balance</span>
                      <h3 className="text-sm sm:text-base font-bold text-[#131b2e]">Pemerintah &amp; Lembaga</h3>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#131b2e]">
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Kantor Kelurahan</span>
                        <span className="font-semibold text-[#006c49]">Permanen / Baik</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Listrik &amp; Air Bersih</span>
                        <span className="font-semibold text-[#131b2e]">PLN &amp; PAM</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Anggota Linmas Aktif</span>
                        <span className="font-bold text-[#006194]">12 Orang</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Babinsa &amp; Bhabinkamtibmas</span>
                        <span className="font-bold text-[#131b2e]">2 Petugas</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Organisasi PKK &amp; LPM</span>
                        <span className="font-semibold text-[#006c49]">Aktif Berjalan</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Karang Taruna</span>
                        <span className="font-semibold text-[#006c49]">Reguler Aktif</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-2 text-xs text-[#3f4850]">
                    Pusat koordinasi warga di Kantor Lurah Kolongan Satu.
                  </div>
                </div>

                {/* Card B: Sarana Peribadatan */}
                <div className="p-5 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#006c49]">
                      <span className="material-symbols-outlined">church</span>
                      <h3 className="text-sm sm:text-base font-bold text-[#131b2e]">Sarana Peribadatan</h3>
                    </div>
                    <div className="space-y-2.5 text-xs sm:text-sm text-[#131b2e]">
                      <div className="p-3 rounded-xl bg-[#f2f3ff] flex justify-between items-center border border-[#e2e7ff]">
                        <div>
                          <span className="font-semibold block">Gereja Protestan (GMIM)</span>
                          <span className="text-[11px] text-[#3f4850]">Pelayanan Jemaat Aktif</span>
                        </div>
                        <span className="text-lg font-bold text-[#006194]">4 <span className="text-xs font-normal">Unit</span></span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#f2f3ff] flex justify-between items-center border border-[#e2e7ff]">
                        <div>
                          <span className="font-semibold block">Gereja Katolik</span>
                          <span className="text-[11px] text-[#3f4850]">Stasi Peribadatan</span>
                        </div>
                        <span className="text-lg font-bold text-[#006194]">1 <span className="text-xs font-normal">Unit</span></span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#e2e7ff]/50 border border-[#dae2fd]">
                        <span className="text-xs text-[#006c49] font-bold block mb-1">Harmoni Keagamaan</span>
                        <p className="text-[11px] text-[#3f4850] leading-relaxed">
                          Toleransi antar-umat bergereja dan kegiatan sosial kerukunan masyarakat berlangsung dinamis dan kondusif.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-2 text-xs text-[#3f4850]">
                    Total 5 Sarana Ibadah Resmi dalam kondisi fisik prima.
                  </div>
                </div>

                {/* Card C: Kesehatan & Olahraga */}
                <div className="p-5 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#006194]">
                      <span className="material-symbols-outlined">medical_services</span>
                      <h3 className="text-sm sm:text-base font-bold text-[#131b2e]">Kesehatan &amp; Olahraga</h3>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#131b2e]">
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Posyandu Mandiri</span>
                        <span className="font-bold text-[#006194]">2 Unit</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Puskesmas Pembantu (Pustu)</span>
                        <span className="font-bold text-[#006194]">1 Unit</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Praktek Dokter / Bidan</span>
                        <span className="font-bold text-[#131b2e]">3 Titik</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Apotek Pelayanan</span>
                        <span className="font-bold text-[#131b2e]">1 Unit</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Lapangan Bola Voli</span>
                        <span className="font-semibold text-[#006c49]">Ada (Layak)</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Lapangan Sepak Bola</span>
                        <span className="font-semibold text-[#006c49]">Akses Terbuka</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-2 text-xs text-[#3f4850]">
                    Kegiatan posyandu balita &amp; lansia diselenggarakan tiap bulan.
                  </div>
                </div>

                {/* Card D: Transportasi & Kebersihan */}
                <div className="p-5 rounded-2xl bg-white shadow-xs border border-[#e2e7ff] flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#4d5d73]">
                      <span className="material-symbols-outlined">local_shipping</span>
                      <h3 className="text-sm sm:text-base font-bold text-[#131b2e]">Infrastruktur &amp; Akses</h3>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#131b2e]">
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Kondisi Jalan Utama</span>
                        <span className="font-semibold text-[#006c49]">Aspal Hotmix</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Jalan Lingkungan</span>
                        <span className="font-semibold text-[#131b2e]">Rabat Beton</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Truk Pengangkut Sampah</span>
                        <span className="font-bold text-[#006194]">Rutin Pemkot</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Moda Transportasi Warga</span>
                        <span className="font-semibold text-[#131b2e]">Ojek &amp; Bendi</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Perpustakaan Kelurahan</span>
                        <span className="font-semibold text-[#006c49]">Tersedia</span>
                      </li>
                      <li className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                        <span>Taman Ruang Hijau</span>
                        <span className="font-semibold text-[#006c49]">Asri &amp; Terawat</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-2 text-xs text-[#3f4850]">
                    Terintegrasi jaringan jalan lingkar Kota Tomohon.
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* SECTION CETAK & UNDUH LAPORAN RESMI (DIPINDAH KE BAWAH)      */}
          {/* ============================================================ */}
          <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 no-print">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-white to-[#f2f3ff] shadow-sm border border-[#e2e7ff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cce5ff] text-[#006194] text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                  <span>Dokumen Laporan Resmi 3 Halaman</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#131b2e]">
                  Cetak &amp; Unduh Laporan Resmi Monografi
                </h3>
                <p className="text-xs sm:text-sm text-[#3f4850] leading-relaxed">
                  Laporan resmi terstruktur format baku pemerintahan (Kop Surat Pemkot Tomohon, register rekapitulasi data teknis Jaga I–V, tabel demografi terpadu, dan lembar pengesahan tanda tangan Lurah). Siap cetak atau unduh ke PDF dalam 1–3 halaman rapi.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#006c49] font-medium">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">check_circle</span> Format A4 Standar
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">check_circle</span> Rincian Teknis 5 Jaga
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">check_circle</span> Pengesahan Lurah &amp; Seklur
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#006194] text-white hover:bg-[#007bb9] text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">print</span>
                  <span>Cetak / Unduh Laporan Resmi (PDF)</span>
                </button>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* BANNER KEMITRAAN DIGITALISASI 2025                            */}
          {/* ============================================================ */}
          <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 no-print">
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#006194] to-[#007bb9] text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#006194] shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs tracking-widest text-[#cce5ff] uppercase font-bold">
                    Digitalisasi Monografi Kelurahan 2025
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold">
                    Kemitraan Data &amp; Monografi Terbuka Kelurahan Kolongan Satu
                  </h3>
                  <p className="text-xs sm:text-sm text-[#cce5ff] max-w-2xl leading-relaxed">
                    Penyusunan dashboard portal monografi digital ini dirancang dan diverifikasi secara faktual bersama Pemerintah Kelurahan Kolongan Satu, Kecamatan Tomohon Tengah, Kota Tomohon.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-[#006194] hover:bg-[#f2f3ff] text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Kembali ke Atas
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="w-full bg-white mt-8 border-t border-[#eaedff] shadow-[0_1px_8px_rgba(0,0,0,0.04)] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#eaedff]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#007bb9] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">account_balance</span>
                </div>
                <span className="text-base font-bold text-[#131b2e]">Kelurahan Kolongan Satu</span>
              </div>
              <p className="text-xs sm:text-sm text-[#3f4850] max-w-md leading-relaxed">
                Pemerintah Kota Tomohon, Provinsi Sulawesi Utara. Sistem Informasi Administrasi &amp; Monografi Demografi Kependudukan Berkelanjutan.
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs sm:text-sm text-[#3f4850]">
              <Link href="/monografi" className="hover:text-[#006194] transition-colors">Transparansi Publik</Link>
              <Link href="/portal" className="hover:text-[#006194] transition-colors">Kontak Kelurahan</Link>
              <Link href="/portal" className="hover:text-[#006194] transition-colors">Pusat Bantuan</Link>
            </div>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#3f4850] text-xs">
            <p>&copy; 2025 Pemerintah Kelurahan Kolongan Satu, Tomohon. Hak Cipta Dilindungi.</p>
            <p className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006c49]" />
              Sistem Pelayanan Terpadu Aktif
            </p>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* LAPORAN MONOGRAFI RESMI PEMERINTAHAN (PRINT / PDF 3 HALAMAN) */}
      {/* ============================================================ */}
      <div id="official-monografi-print-report" className="print-only hidden font-serif text-black bg-white p-2 text-[11px] leading-snug">
        
        {/* ==================== HALAMAN 1 DARI 3 ==================== */}
        <div className="page-break pb-4">
          {/* KOP SURAT PEMERINTAH */}
          <div className="text-center border-b-[3px] border-black pb-2 mb-3 relative">
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 border border-black rounded-full flex items-center justify-center font-bold text-base shrink-0">
                ⭐
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wider uppercase m-0 leading-tight">PEMERINTAH KOTA TOMOHON</h3>
                <h2 className="text-base font-extrabold tracking-wide uppercase m-0 leading-tight">KECAMATAN TOMOHON TENGAH</h2>
                <h1 className="text-lg font-black tracking-widest uppercase m-0 leading-tight">KELURAHAN KOLONGAN SATU</h1>
                <p className="text-[10px] m-0 font-sans text-gray-700 leading-tight">
                  Alamat: Jl. Kolongan Raya, Kec. Tomohon Tengah, Kota Tomohon, Sulawesi Utara - Kode Pos: 95438
                </p>
              </div>
            </div>
            <div className="border-b border-black mt-2 pt-0.5" />
          </div>

          {/* JUDUL DOKUMEN & REGISTER */}
          <div className="text-center mb-3">
            <h2 className="text-sm font-bold uppercase underline tracking-wider m-0">
              BUKU REKAPITULASI MONOGRAFI KELURAHAN
            </h2>
            <p className="text-[10px] font-sans m-0">
              Nomor Register Data: <strong>140 / 08 / K1 / MON / VII / 2024</strong> &bull; Periode: <strong>Tahun Anggaran 2024</strong>
            </p>
          </div>

          {/* BAGIAN I: DATA GEOGRAFIS & TATA GUNA LAHAN */}
          <div className="mb-3">
            <h3 className="text-[11px] font-bold uppercase bg-gray-200 px-2 py-0.5 border border-black mb-1.5">
              I. IDENTITAS KEWILAYAHAN, BATAS &amp; TATA GUNA LAHAN
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="border border-black p-2">
                <p className="font-bold mb-1 underline">A. Batas Wilayah Administratif (4 Penjuru):</p>
                <table className="w-full text-[10px]">
                  <tbody>
                    <tr><td className="w-20 font-semibold">Utara</td><td>: Kelurahan Paslaten Satu, Kec. Tomohon Timur</td></tr>
                    <tr><td className="font-semibold">Selatan</td><td>: Kelurahan Talete Dua, Kec. Tomohon Tengah</td></tr>
                    <tr><td className="font-semibold">Timur</td><td>: Kelurahan Kolongan, Kec. Tomohon Tengah</td></tr>
                    <tr><td className="font-semibold">Barat</td><td>: Kelurahan Kamasi, Akses Kaki Gn. Lokon</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="border border-black p-2">
                <p className="font-bold mb-1 underline">B. Parameter Geografis Pokok:</p>
                <table className="w-full text-[10px]">
                  <tbody>
                    <tr><td className="w-28 font-semibold">Luas Wilayah Total</td><td>: <strong>48,05 Hektar</strong> (Terukur Resmi BPN)</td></tr>
                    <tr><td className="font-semibold">Jumlah Lingkungan</td><td>: <strong>5 Lingkungan Jaga</strong> (Jaga I s/d V)</td></tr>
                    <tr><td className="font-semibold">Karakteristik Tanah</td><td>: Lempung Hitam Vulkanik Subur</td></tr>
                    <tr><td className="font-semibold">Status Konflik Lahan</td><td>: 0% (Nihil / Bebas Sengketa)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p className="font-bold text-[10px] mb-1">C. Distribusi &amp; Alokasi Peruntukan Lahan Faktual (48,05 Ha):</p>
            <table className="w-full border-collapse border border-black text-[10px] text-left">
              <thead>
                <tr className="bg-gray-100 border-b border-black">
                  <th className="border border-black px-1.5 py-0.5 text-center w-8">No</th>
                  <th className="border border-black px-2 py-0.5">Klasifikasi / Peruntukan Lahan</th>
                  <th className="border border-black px-2 py-0.5 text-right w-20">Luas (Ha)</th>
                  <th className="border border-black px-2 py-0.5 text-right w-16">Rasio (%)</th>
                  <th className="border border-black px-2 py-0.5">Keterangan Faktual Register</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">1</td>
                  <td className="border border-black px-2 py-0.5">Kawasan Pemukiman &amp; Perumahan Warga</td>
                  <td className="border border-black px-2 py-0.5 text-right font-bold">34,50</td>
                  <td className="border border-black px-2 py-0.5 text-right">71,80%</td>
                  <td className="border border-black px-2 py-0.5">Tersebar padat teratur pada Jaga I s/d Jaga V</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">2</td>
                  <td className="border border-black px-2 py-0.5">Pertanian, Ladang &amp; Hortikultura</td>
                  <td className="border border-black px-2 py-0.5 text-right font-bold">9,50</td>
                  <td className="border border-black px-2 py-0.5 text-right">19,77%</td>
                  <td className="border border-black px-2 py-0.5">Komoditas sayuran segar &amp; tanaman hias</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">3</td>
                  <td className="border border-black px-2 py-0.5">Pekarangan Rumah &amp; Budidaya Ternak</td>
                  <td className="border border-black px-2 py-0.5 text-right font-bold">4,00</td>
                  <td className="border border-black px-2 py-0.5 text-right">8,32%</td>
                  <td className="border border-black px-2 py-0.5">Pekarangan asri warga dan kandang tradisional</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">4</td>
                  <td className="border border-black px-2 py-0.5">Lahan Tidur / Jalur Resapan Air</td>
                  <td className="border border-black px-2 py-0.5 text-right font-bold">0,05</td>
                  <td className="border border-black px-2 py-0.5 text-right">0,11%</td>
                  <td className="border border-black px-2 py-0.5">Kawasan tangkapan resapan air alami</td>
                </tr>
                <tr className="bg-gray-100 font-bold border-t border-black">
                  <td className="border border-black px-2 py-0.5 text-center" colSpan={2}>TOTAL LUAS WILAYAH TERVERIFIKASI</td>
                  <td className="border border-black px-2 py-0.5 text-right">48,05</td>
                  <td className="border border-black px-2 py-0.5 text-right">100,00%</td>
                  <td className="border border-black px-2 py-0.5">Papan Monografi Lembar A-1 Faktual</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BAGIAN II: DEMOGRAFI & REKAPITULASI 5 JAGA */}
          <div className="mb-2">
            <h3 className="text-[11px] font-bold uppercase bg-gray-200 px-2 py-0.5 border border-black mb-1.5">
              II. REKAPITULASI KEPENDUDUKAN TINGKAT LINGKUNGAN (JAGA I s/d JAGA V)
            </h3>
            <table className="w-full border-collapse border border-black text-[10px] text-left mb-2">
              <thead>
                <tr className="bg-gray-100 border-b border-black text-center">
                  <th className="border border-black px-1.5 py-0.5 w-8">No</th>
                  <th className="border border-black px-2 py-0.5 text-left">Nama Lingkungan</th>
                  <th className="border border-black px-2 py-0.5 w-16">Jml KK</th>
                  <th className="border border-black px-2 py-0.5 w-16">Laki-Laki</th>
                  <th className="border border-black px-2 py-0.5 w-16">Perempuan</th>
                  <th className="border border-black px-2 py-0.5 w-20">Total Jiwa</th>
                  <th className="border border-black px-2 py-0.5 w-14">Sex Ratio</th>
                  <th className="border border-black px-2 py-0.5 text-left">Kepala Lingkungan (PALA)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">1</td>
                  <td className="border border-black px-2 py-0.5 font-bold">Lingkungan I (Jaga 1)</td>
                  <td className="border border-black px-2 py-0.5 text-center">105 KK</td>
                  <td className="border border-black px-2 py-0.5 text-center">152 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">158 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">310 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">96,2</td>
                  <td className="border border-black px-2 py-0.5">Meky Mario Turangan / Athanasius Ricky Trie</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">2</td>
                  <td className="border border-black px-2 py-0.5 font-bold">Lingkungan II (Jaga 2)</td>
                  <td className="border border-black px-2 py-0.5 text-center">108 KK</td>
                  <td className="border border-black px-2 py-0.5 text-center">139 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">146 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">285 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">95,2</td>
                  <td className="border border-black px-2 py-0.5">Devid P.N. Tasie / Antonius Kapojos</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">3</td>
                  <td className="border border-black px-2 py-0.5 font-bold">Lingkungan III (Jaga 3)</td>
                  <td className="border border-black px-2 py-0.5 text-center">112 KK</td>
                  <td className="border border-black px-2 py-0.5 text-center">144 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">151 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">295 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">95,4</td>
                  <td className="border border-black px-2 py-0.5">Agustinus Sapanany / Paulus Wuntuale</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">4</td>
                  <td className="border border-black px-2 py-0.5 font-bold">Lingkungan IV (Jaga 4)</td>
                  <td className="border border-black px-2 py-0.5 text-center">107 KK</td>
                  <td className="border border-black px-2 py-0.5 text-center">149 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">155 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">304 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">96,1</td>
                  <td className="border border-black px-2 py-0.5">Stenly Posumah / Djoni Kapele</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">5</td>
                  <td className="border border-black px-2 py-0.5 font-bold">Lingkungan V (Jaga 5)</td>
                  <td className="border border-black px-2 py-0.5 text-center">108 KK</td>
                  <td className="border border-black px-2 py-0.5 text-center">141 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">149 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">290 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">94,6</td>
                  <td className="border border-black px-2 py-0.5">Joutje Rumagit / Fredi Rumagit</td>
                </tr>
                <tr className="bg-gray-100 font-bold border-t border-black text-center">
                  <td className="border border-black px-2 py-0.5" colSpan={2}>TOTAL REKAPITULASI RESMI</td>
                  <td className="border border-black px-2 py-0.5">540 KK</td>
                  <td className="border border-black px-2 py-0.5">725 Jiwa</td>
                  <td className="border border-black px-2 py-0.5">759 Jiwa</td>
                  <td className="border border-black px-2 py-0.5">1.484 Jiwa</td>
                  <td className="border border-black px-2 py-0.5">95,5</td>
                  <td className="border border-black px-2 py-0.5 text-left">Rata-rata: 2,75 Jiwa / KK</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-center text-[9px] text-gray-700 italic border-t border-gray-400 pt-1">
              <span>* Data Berdasarkan Register Kependudukan Faktual Kelurahan Kolongan Satu Tahun 2024</span>
              <span>Halaman 1 dari 3</span>
            </div>
          </div>
        </div>

        {/* ==================== HALAMAN 2 DARI 3 ==================== */}
        <div className="page-break pb-4 pt-2">
          {/* HEADER HALAMAN 2 */}
          <div className="flex justify-between items-center border-b border-black pb-1 mb-3 text-[10px] font-sans">
            <span className="font-bold uppercase tracking-wider">PEMERINTAH KOTA TOMOHON &bull; KELURAHAN KOLONGAN SATU</span>
            <span className="font-semibold">LAMPIRAN DATA TEKNIS &bull; HALAMAN 2 DARI 3</span>
          </div>

          {/* BAGIAN III: STRUKTUR USIA & PENDIDIKAN */}
          <div className="mb-3">
            <h3 className="text-[11px] font-bold uppercase bg-gray-200 px-2 py-0.5 border border-black mb-1.5">
              III. STRUKTUR DEMOGRAFI KELOMPOK UMUR &amp; TINGKAT PENDIDIKAN FORMAL
            </h3>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              {/* Tabel Kelompok Umur */}
              <div>
                <p className="font-bold text-[10px] mb-1">A. Komposisi Usia &amp; Tenaga Kerja:</p>
                <table className="w-full border-collapse border border-black text-[10px] text-left">
                  <thead>
                    <tr className="bg-gray-100 border-b border-black">
                      <th className="border border-black px-1.5 py-0.5">Kelompok Umur</th>
                      <th className="border border-black px-1.5 py-0.5 text-right">Jiwa</th>
                      <th className="border border-black px-1.5 py-0.5 text-right">%</th>
                      <th className="border border-black px-1.5 py-0.5">Klasifikasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black px-1.5 py-0.5">0 – 6 Tahun</td>
                      <td className="border border-black px-1.5 py-0.5 text-right font-bold">109</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">7,34%</td>
                      <td className="border border-black px-1.5 py-0.5">Balita / Prasekolah</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1.5 py-0.5">7 – 18 Tahun</td>
                      <td className="border border-black px-1.5 py-0.5 text-right font-bold">222</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">14,96%</td>
                      <td className="border border-black px-1.5 py-0.5">Usia Sekolah Wajib</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1.5 py-0.5 font-bold">18 – 56 Th (Bekerja)</td>
                      <td className="border border-black px-1.5 py-0.5 text-right font-bold">494</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">33,29%</td>
                      <td className="border border-black px-1.5 py-0.5">Angkatan Kerja Aktif</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1.5 py-0.5 font-bold">18 – 56 Th (IRT/Pencari)</td>
                      <td className="border border-black px-1.5 py-0.5 text-right font-bold">382</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">25,74%</td>
                      <td className="border border-black px-1.5 py-0.5">Produktif Mengurus RT</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1.5 py-0.5">&gt; 56 Tahun</td>
                      <td className="border border-black px-1.5 py-0.5 text-right font-bold">277</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">18,67%</td>
                      <td className="border border-black px-1.5 py-0.5">Lanjut Usia (Lansia)</td>
                    </tr>
                    <tr className="bg-gray-100 font-bold border-t border-black">
                      <td className="border border-black px-1.5 py-0.5">TOTAL POPULASI</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">1.484</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">100%</td>
                      <td className="border border-black px-1.5 py-0.5">Dep. Ratio: 69,4%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tabel Tingkat Kelulusan Pendidikan */}
              <div>
                <p className="font-bold text-[10px] mb-1">B. Tingkat Kelulusan Pendidikan Formal:</p>
                <table className="w-full border-collapse border border-black text-[10px] text-left">
                  <thead>
                    <tr className="bg-gray-100 border-b border-black">
                      <th className="border border-black px-1.5 py-0.5">Tingkat Pendidikan</th>
                      <th className="border border-black px-1.5 py-0.5 text-right">Lulusan</th>
                      <th className="border border-black px-1.5 py-0.5 text-right">%</th>
                      <th className="border border-black px-1.5 py-0.5">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black px-1.5 py-0.5">SD / Sederajat</td>
                      <td className="border border-black px-1.5 py-0.5 text-right font-bold">78</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">7,68%</td>
                      <td className="border border-black px-1.5 py-0.5">1 SD di Kelurahan</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1.5 py-0.5">SMP / Sederajat</td>
                      <td className="border border-black px-1.5 py-0.5 text-right font-bold">154</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">15,16%</td>
                      <td className="border border-black px-1.5 py-0.5">Pendidikan Dasar</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1.5 py-0.5 font-bold">SMA / SMK / MA</td>
                      <td className="border border-black px-1.5 py-0.5 text-right font-bold">520</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">51,18%</td>
                      <td className="border border-black px-1.5 py-0.5">Kelulusan Terbanyak</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1.5 py-0.5">Sarjana S1</td>
                      <td className="border border-black px-1.5 py-0.5 text-right font-bold">212</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">20,87%</td>
                      <td className="border border-black px-1.5 py-0.5">Pendidikan Tinggi</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1.5 py-0.5">Diploma &amp; Pascasarjana</td>
                      <td className="border border-black px-1.5 py-0.5 text-right font-bold">50</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">4,92%</td>
                      <td className="border border-black px-1.5 py-0.5">Spesialis &amp; Magister</td>
                    </tr>
                    <tr className="bg-gray-100 font-bold border-t border-black">
                      <td className="border border-black px-1.5 py-0.5">TOTAL LULUSAN</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">1.016</td>
                      <td className="border border-black px-1.5 py-0.5 text-right">100%</td>
                      <td className="border border-black px-1.5 py-0.5">Melek Aksara: 100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* BAGIAN IV: MATA PENCAHARIAN & KESEJAHTERAAN SOSIAL */}
          <div className="mb-3">
            <h3 className="text-[11px] font-bold uppercase bg-gray-200 px-2 py-0.5 border border-black mb-1.5">
              IV. SEKTOR MATA PENCAHARIAN &amp; KESEJAHTERAAN SOSIAL
            </h3>
            
            <div className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-8">
                <p className="font-bold text-[10px] mb-1">A. Distribusi Pekerjaan Utama (494 Jiwa Angkatan Bekerja):</p>
                <table className="w-full border-collapse border border-black text-[10px] text-left">
                  <thead>
                    <tr className="bg-gray-100 border-b border-black">
                      <th className="border border-black px-2 py-0.5">Sektor Pekerjaan / Lapangan Usaha</th>
                      <th className="border border-black px-2 py-0.5 text-right w-16">Jumlah</th>
                      <th className="border border-black px-2 py-0.5 text-right w-16">Rasio</th>
                      <th className="border border-black px-2 py-0.5">Karakteristik Usaha</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black px-2 py-0.5">Wiraswasta, Warung Makan, Kios &amp; Kuliner</td>
                      <td className="border border-black px-2 py-0.5 text-right font-bold">148 Jiwa</td>
                      <td className="border border-black px-2 py-0.5 text-right">29,96%</td>
                      <td className="border border-black px-2 py-0.5">Pusat perdagangan mikro &amp; kue basah</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-2 py-0.5">Petani, Pekebun Hortikultura &amp; Bunga</td>
                      <td className="border border-black px-2 py-0.5 text-right font-bold">114 Jiwa</td>
                      <td className="border border-black px-2 py-0.5 text-right">23,08%</td>
                      <td className="border border-black px-2 py-0.5">Sayur organik &amp; bunga krisan Tomohon</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-2 py-0.5">Pertukangan Kayu, Batu, Las &amp; Bengkel</td>
                      <td className="border border-black px-2 py-0.5 text-right font-bold">89 Jiwa</td>
                      <td className="border border-black px-2 py-0.5 text-right">18,02%</td>
                      <td className="border border-black px-2 py-0.5">Konstruksi dan kerajinan rumah panggung</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-2 py-0.5">Aparatur Sipil Negara (ASN, TNI, Polri)</td>
                      <td className="border border-black px-2 py-0.5 text-right font-bold">58 Jiwa</td>
                      <td className="border border-black px-2 py-0.5 text-right">11,74%</td>
                      <td className="border border-black px-2 py-0.5">Pegawai Pemkot Tomohon &amp; instansi vertikal</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-2 py-0.5">Guru, Dosen &amp; Tenaga Kependidikan</td>
                      <td className="border border-black px-2 py-0.5 text-right font-bold">45 Jiwa</td>
                      <td className="border border-black px-2 py-0.5 text-right">9,11%</td>
                      <td className="border border-black px-2 py-0.5">Pendidik di SD, SMP, SMA, dan Perguruan Tinggi</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-2 py-0.5">Karyawan Swasta, Ojek &amp; Transportasi</td>
                      <td className="border border-black px-2 py-0.5 text-right font-bold">40 Jiwa</td>
                      <td className="border border-black px-2 py-0.5 text-right">8,10%</td>
                      <td className="border border-black px-2 py-0.5">Jasa transportasi dan perdagangan modern</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="col-span-4 border border-black p-2">
                <p className="font-bold text-[10px] mb-1 underline">B. Data Khusus Disabilitas:</p>
                <p className="text-[9px] mb-1 leading-snug">Warga berkebutuhan khusus terdaftar dalam pembinaan Dinas Sosial Kota Tomohon:</p>
                <ul className="text-[10px] space-y-0.5 mb-2 pl-3 list-disc">
                  <li>Tuna Rungu / Wicara: <strong>2 Orang</strong></li>
                  <li>Tuna Netra: <strong>1 Orang</strong></li>
                  <li>Lumpuh / Disabilitas Fisik: <strong>1 Orang</strong></li>
                  <li>Binaan Kebutuhan Khusus: <strong>1 Orang</strong></li>
                </ul>
                <div className="bg-gray-100 p-1 border border-gray-400 text-[9px] italic">
                  * 100% Warga disabilitas tercatat menerima akses kesehatan berkala Posyandu dan bansos PKH.
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN V: PETERNAKAN & SUMBER AIR */}
          <div className="mb-2">
            <h3 className="text-[11px] font-bold uppercase bg-gray-200 px-2 py-0.5 border border-black mb-1.5">
              V. POTENSI PETERNAKAN, SUMBER DAYA AIR &amp; SANITASI
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-black p-2">
                <p className="font-bold text-[10px] mb-1 underline">A. Sektor Peternakan Warga (Total 1.825 Ekor):</p>
                <table className="w-full text-[10px]">
                  <tbody>
                    <tr><td className="font-semibold">Unggas / Ayam</td><td>: <strong>1.450 Ekor</strong> (79,45% - Buras &amp; Petelur Swadaya)</td></tr>
                    <tr><td className="font-semibold">Ternak Babi</td><td>: <strong>340 Ekor</strong> (18,63% - Kandang Berjarak Higienis)</td></tr>
                    <tr><td className="font-semibold">Ternak Sapi</td><td>: <strong>35 Ekor</strong> (1,92% - Penggembalaan Terpadu)</td></tr>
                    <tr><td className="font-semibold">Higienitas Kandang</td><td>: <strong>98,2%</strong> Sesuai SOP Dinas Pertanian Kota Tomohon</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="border border-black p-2">
                <p className="font-bold text-[10px] mb-1 underline">B. Ketahanan Air Bersih &amp; Sanitasi Lingkungan:</p>
                <table className="w-full text-[10px]">
                  <tbody>
                    <tr><td className="font-semibold">Pelanggan PDAM</td><td>: <strong>467 KK</strong> (86,48% - Jaringan Pipa Tomohon)</td></tr>
                    <tr><td className="font-semibold">Sumur Pompa / Gali</td><td>: <strong>73 KK</strong> (13,52% - 14 Titik Sumur Bersih Sah)</td></tr>
                    <tr><td className="font-semibold">MCK Komunal</td><td>: 3 Unit Terbangun &amp; Berfungsi Baik</td></tr>
                    <tr><td className="font-semibold">Status Sanitasi</td><td>: <strong>100% ODF</strong> (Seluruh KK Memiliki Jamban Sehat)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center text-[9px] text-gray-700 italic border-t border-gray-400 pt-1 mt-2">
              <span>* Data Lapangan Terverifikasi Dinas Pertanian dan Puskesmas Tomohon Tengah</span>
              <span>Halaman 2 dari 3</span>
            </div>
          </div>
        </div>

        {/* ==================== HALAMAN 3 DARI 3 ==================== */}
        <div className="pb-4 pt-2">
          {/* HEADER HALAMAN 3 */}
          <div className="flex justify-between items-center border-b border-black pb-1 mb-3 text-[10px] font-sans">
            <span className="font-bold uppercase tracking-wider">PEMERINTAH KOTA TOMOHON &bull; KELURAHAN KOLONGAN SATU</span>
            <span className="font-semibold">LAMPIRAN SARANA &amp; PENGESAHAN &bull; HALAMAN 3 DARI 3</span>
          </div>

          {/* BAGIAN VI: SARANA KELEMBAGAAN & FASILITAS PUBLIK */}
          <div className="mb-3">
            <h3 className="text-[11px] font-bold uppercase bg-gray-200 px-2 py-0.5 border border-black mb-1.5">
              VI. INVENTARISASI SARANA PRASARANA, KELEMBAGAAN &amp; FASILITAS PUBLIK
            </h3>
            
            <table className="w-full border-collapse border border-black text-[10px] text-left mb-3">
              <thead>
                <tr className="bg-gray-100 border-b border-black">
                  <th className="border border-black px-1.5 py-0.5 text-center w-8">No</th>
                  <th className="border border-black px-2 py-0.5">Bidang Fasilitas Publik</th>
                  <th className="border border-black px-2 py-0.5 w-32">Kuantitas / Jumlah</th>
                  <th className="border border-black px-2 py-0.5 w-28">Kondisi Fisik</th>
                  <th className="border border-black px-2 py-0.5">Keterangan Fungsi Operasional</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">1</td>
                  <td className="border border-black px-2 py-0.5 font-bold">Kantor Kelurahan Kolongan Satu</td>
                  <td className="border border-black px-2 py-0.5">1 Unit Gedung Utama</td>
                  <td className="border border-black px-2 py-0.5 font-semibold">Permanen / Baik</td>
                  <td className="border border-black px-2 py-0.5">Pusat pelayanan administrasi &amp; rapat warga</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">2</td>
                  <td className="border border-black px-2 py-0.5">Keamanan Linmas &amp; Kamtibmas</td>
                  <td className="border border-black px-2 py-0.5">12 Anggota Linmas, 2 Babinsa</td>
                  <td className="border border-black px-2 py-0.5">Siaga Aktif</td>
                  <td className="border border-black px-2 py-0.5">Patroli berkala dan koordinasi Polsek/Koramil</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">3</td>
                  <td className="border border-black px-2 py-0.5">Organisasi Kemasyarakatan</td>
                  <td className="border border-black px-2 py-0.5">PKK, LPM, Karang Taruna</td>
                  <td className="border border-black px-2 py-0.5">Aktif Rutin</td>
                  <td className="border border-black px-2 py-0.5">Program sosial, gotong royong, &amp; posyandu</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">4</td>
                  <td className="border border-black px-2 py-0.5">Gereja Protestan (GMIM)</td>
                  <td className="border border-black px-2 py-0.5">4 Gedung Gereja</td>
                  <td className="border border-black px-2 py-0.5">Kondisi Prima</td>
                  <td className="border border-black px-2 py-0.5">Pelayanan jemaat Protestan aktif beribadah</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">5</td>
                  <td className="border border-black px-2 py-0.5">Gereja Katolik</td>
                  <td className="border border-black px-2 py-0.5">1 Gedung Gereja</td>
                  <td className="border border-black px-2 py-0.5">Kondisi Prima</td>
                  <td className="border border-black px-2 py-0.5">Stasi peribadatan jemaat Katolik terpadu</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">6</td>
                  <td className="border border-black px-2 py-0.5">Sarana Pendidikan Dasar &amp; Khusus</td>
                  <td className="border border-black px-2 py-0.5">1 SD Negeri, 1 SLB C</td>
                  <td className="border border-black px-2 py-0.5">Aktif Mengajar</td>
                  <td className="border border-black px-2 py-0.5">Wajib belajar 9 tahun dan pendidikan inklusi</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">7</td>
                  <td className="border border-black px-2 py-0.5">Kesehatan (Posyandu &amp; Pustu)</td>
                  <td className="border border-black px-2 py-0.5">2 Posyandu, 1 Pustu, 3 Dokter</td>
                  <td className="border border-black px-2 py-0.5">Pelayanan Rutin</td>
                  <td className="border border-black px-2 py-0.5">Cek kesehatan balita, lansia &amp; obat-obatan</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">8</td>
                  <td className="border border-black px-2 py-0.5">Jaringan Jalan Utama &amp; Lingkungan</td>
                  <td className="border border-black px-2 py-0.5">4,5 Km Hotmix, 2,8 Km Beton</td>
                  <td className="border border-black px-2 py-0.5">Kondisi Mantap</td>
                  <td className="border border-black px-2 py-0.5">Jalur lingkar Tomohon &amp; penghubung antar-Jaga</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">9</td>
                  <td className="border border-black px-2 py-0.5">Sanitasi &amp; Persampahan</td>
                  <td className="border border-black px-2 py-0.5">1 TPS &amp; Truk DLH Pemkot</td>
                  <td className="border border-black px-2 py-0.5">Jadwal Harian</td>
                  <td className="border border-black px-2 py-0.5">Pengangkutan sampah terjadwal seluruh Jaga</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BAGIAN VII: LEMBAR PENGESAHAN DOKUMEN RESMI (LEGALITAS LURAH) */}
          <div className="border border-black p-3 bg-gray-50/50 mb-3">
            <h3 className="text-[11px] font-bold uppercase text-center underline tracking-wider mb-2">
              LEMBAR PENGESAHAN &amp; PENETAPAN DOKUMEN MONOGRAFI RESMI
            </h3>
            <p className="text-[10px] text-justify leading-relaxed mb-4">
              Demikian Buku Laporan Monografi Kelurahan Kolongan Satu, Kecamatan Tomohon Tengah, Kota Tomohon Tahun 2024 ini disusun secara faktual berdasarkan register buku induk kependudukan, pemetaan batas ruang wilayah, dan rekapitulasi potensi kemasyarakatan terkini. Dokumen ini disahkan sebagai rujukan resmi perencanaan pembangunan, transparansi publik, dan pelayanan administrasi pemerintahan daerah.
            </p>

            <div className="flex justify-between items-start text-[10px] px-6">
              {/* Kolom Tanda Tangan Sekretaris */}
              <div className="text-center w-64">
                <p className="mb-0">Mengetahui &amp; Memverifikasi,</p>
                <p className="font-bold mb-12">SEKRETARIS KELURAHAN KOLONGAN SATU</p>
                <p className="font-bold underline text-[11px] mb-0">FERROMEL L. PUA, S.Kom</p>
                <p className="text-[9px] text-gray-700">NIP. 19850412 201102 1 002</p>
              </div>

              {/* Stempel Kelurahan Tempat */}
              <div className="text-center pt-2">
                <div className="w-20 h-20 border border-dashed border-gray-400 rounded-full flex items-center justify-center text-[8px] text-gray-400 uppercase italic">
                  [Cap Stempel Dinas]
                </div>
              </div>

              {/* Kolom Tanda Tangan Lurah */}
              <div className="text-center w-64">
                <p className="mb-0">Ditetapkan di: Tomohon</p>
                <p className="mb-0">Pada tanggal: 15 Juli 2024</p>
                <p className="font-bold mb-12">LURAH KOLONGAN SATU,</p>
                <p className="font-bold underline text-[11px] mb-0">THERESIA J. KAUNANG, SE</p>
                <p className="text-[9px] text-gray-700">NIP. 19680702 199903 2 001</p>
              </div>
            </div>
          </div>

          {/* TEMBUSAN & ARSIP */}
          <div className="text-[9px] text-gray-700">
            <p className="font-bold mb-0.5">Tembusan Kepada Yth:</p>
            <ol className="list-decimal pl-4 space-y-0 text-[8.5px]">
              <li>Walikota Tomohon (sebagai laporan)</li>
              <li>Camat Tomohon Tengah, Kota Tomohon</li>
              <li>Kepala Badan Pusat Statistik (BPS) Kota Tomohon</li>
              <li>Pertinggal / Arsip Resmi Kelurahan Kolongan Satu</li>
            </ol>
            <div className="flex justify-between items-center italic border-t border-gray-400 pt-1 mt-2">
              <span>* Dokumen Sah Dicetak Melalui Sistem Informasi Monografi Digital Kelurahan Kolongan Satu</span>
              <span>Halaman 3 dari 3 (Selesai)</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
