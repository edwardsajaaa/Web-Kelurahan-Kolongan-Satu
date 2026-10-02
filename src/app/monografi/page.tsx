'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function MonografiPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('semua');

  const tabs = [
    { id: 'semua', label: 'Semua Data' },
    { id: 'wilayah', label: 'Wilayah & Lahan' },
    { id: 'kependudukan', label: 'Kependudukan' },
    { id: 'pendidikan', label: 'Pendidikan & Kerja' },
    { id: 'peternakan', label: 'Peternakan & Air' },
    { id: 'sarana', label: 'Sarana & Lembaga' },
  ];

  // Helper: consistent container class
  const cx = 'w-full max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1536px] 3xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12';

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] font-sans antialiased selection:bg-[#006194] selection:text-white flex flex-col justify-between">
      {/* ============================================================ */}
      {/* HEADER & NAVBAR — identical to landing page                  */}
      {/* ============================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/92 backdrop-blur-xl border-b border-[#e2e7ff]/80 shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
        <div className={`h-20 2xl:h-24 ${cx} flex items-center justify-between gap-4`}>
          <Link href="/" className="flex items-center gap-3 2xl:gap-4 group">
            <div className="p-1 2xl:p-1.5 bg-[#f2f3ff] rounded-full shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <img alt="Lambang Kolongan Satu" className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmHZWdfGwGmtKd7WQmqYAolpSTVfdzZ9o_PS86bfdJVmhgEbRRth-v4rnoCOXBuQ4rQllgVR5nednaoxhTKE3HaZrfgKH07dp48WXlGpdCkPwVw7t1SLyV-UQxj_n3EiZqaWXZItQiD2p_vqtKi_xSE74TrV0f1V-Azvr4pEqGb2SCR7zqAIzDYHRNzTburxA3gDsFwOEtNColVLoZ5UF1Xy0WSKOkbAkPEIA04HcG2N0n-qDAhHKdo7iOJD-lul2L9S0" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-[17px] 2xl:text-xl text-[#131b2e] tracking-tight leading-tight">Kolongan Satu</span>
              <span className="text-[12px] 2xl:text-sm text-[#3f4850] font-medium tracking-wide">Kota Tomohon</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 2xl:gap-12">
            <Link href="/" className="text-[14px] 2xl:text-[16px] text-[#3f4850] hover:text-[#006194] font-medium transition-colors">Beranda</Link>
            <Link href="/monografi" className="text-[14px] 2xl:text-[16px] text-[#006194] font-semibold transition-colors">Monografi</Link>
            <Link href="/portal" className="text-[14px] 2xl:text-[16px] text-[#3f4850] hover:text-[#006194] font-medium transition-colors">Layanan Publik</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/portal" className="hidden sm:inline-flex items-center gap-1.5 2xl:gap-2 text-[14px] 2xl:text-[15px] font-semibold text-white bg-[#006194] hover:bg-[#007bb9] px-5 2xl:px-7 py-2.5 2xl:py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
              <span className="material-symbols-outlined text-[17px]">dashboard</span>
              <span>Buka Portal Monografi</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-xl text-[#3f4850] hover:bg-[#f2f3ff]" aria-label="Toggle menu">
              <span className="material-symbols-outlined text-[24px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#e2e7ff] px-6 py-4 flex flex-col gap-3 shadow-lg">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-[14px] text-[#3f4850] font-medium py-1.5">Beranda</Link>
            <Link href="/monografi" onClick={() => setMobileMenuOpen(false)} className="text-[14px] text-[#006194] font-semibold py-1.5">Monografi</Link>
            <Link href="/portal" onClick={() => setMobileMenuOpen(false)} className="text-[14px] text-[#3f4850] font-medium py-1.5">Layanan Publik</Link>
            <Link href="/portal" onClick={() => setMobileMenuOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#006194] py-2.5 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>Buka Portal Monografi</span>
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
          {/* 1. HERO: Title + Lead                                        */}
          {/* ============================================================ */}
          <section className="relative w-full overflow-hidden pb-6 2xl:pb-8">
            <div className="absolute inset-0 bg-gradient-to-b from-[#cce5ff]/30 via-[#faf8ff] to-[#faf8ff] pointer-events-none -z-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] 2xl:w-[1300px] h-[300px] bg-[#006194]/5 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className={`${cx} pt-6 2xl:pt-10`}>
              {/* Breadcrumb bar */}
              <div className="flex flex-wrap items-center gap-2 mb-6 2xl:mb-8">
                <div className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full text-xs 2xl:text-sm font-medium text-[#3f4850] border border-[#e2e7ff] shadow-xs">
                  <span className="material-symbols-outlined text-[16px] text-[#006194]">verified</span>
                  <span>Data Tervalidasi 2024 — NIP Lurah: 19680702 199903 2 001</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-[#6cf8bb]/20 px-3 py-1.5 rounded-full text-xs font-semibold text-[#006c49] border border-[#6cf8bb]/40">
                  <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse" />
                  <span>Publikasi Monografi Triwulan II</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div className="max-w-2xl 2xl:max-w-3xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl 2xl:text-[3.5rem] text-[#131b2e] font-bold tracking-tight leading-[1.1] mb-3 2xl:mb-4">
                    Monografi Digital Kelurahan Kolongan Satu
                  </h1>
                  <p className="text-sm sm:text-base 2xl:text-lg text-[#3f4850] leading-relaxed">
                    Transparansi statistik kewilayahan, demografi, tata guna lahan, serta potensi kemasyarakatan berbasis data tervalidasi.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link href="/portal" className="inline-flex items-center gap-2 bg-[#006194] hover:bg-[#007bb9] text-white px-6 2xl:px-8 py-3 rounded-full text-sm 2xl:text-base font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                    <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                    <span>Unduh Monografi PDF</span>
                  </Link>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap px-4 2xl:px-5 py-2 2xl:py-2.5 rounded-full text-xs 2xl:text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#006194] text-white border-[#006194] shadow-sm'
                        : 'bg-white text-[#3f4850] border-[#e2e7ff] hover:border-[#006194]/40 hover:text-[#006194]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 2. QUICK STATS — 5 metric cards                              */}
          {/* ============================================================ */}
          <section className={`${cx} mb-10 2xl:mb-14`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 2xl:gap-4">
              {[
                { value: '1.484', unit: 'Jiwa', label: 'Total Penduduk', badge: '+2.4%', badgeColor: 'text-[#006c49] bg-[#6cf8bb]/30' },
                { value: '540', unit: 'KK', label: 'Kepala Keluarga', badge: 'Terdata', badgeColor: 'text-[#4d5d73] bg-[#d3e4fe]/60' },
                { value: '48,05', unit: 'Ha', label: 'Luas Wilayah', badge: 'Terukur BPN', badgeColor: 'text-[#006c49] bg-[#6cf8bb]/30' },
                { value: '5', unit: 'Jaga', label: 'Wilayah Lingkungan', badge: 'I — V', badgeColor: 'text-[#006194] bg-[#cce5ff]/60' },
                { value: '100%', unit: '', label: 'Layanan Publik Digital', badge: 'Aktif', badgeColor: 'text-[#006c49] bg-[#6cf8bb]/30' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl 2xl:rounded-3xl p-5 2xl:p-6 shadow-sm hover:shadow-md transition-all border border-[#e2e7ff]/80 group">
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] 2xl:text-xs text-[#3f4850] font-semibold uppercase tracking-wider">{s.label}</span>
                    <span className={`text-[10px] 2xl:text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${s.badgeColor}`}>{s.badge}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl 2xl:text-4xl font-bold text-[#131b2e] tracking-tight group-hover:text-[#006194] transition-colors">{s.value}</span>
                    {s.unit && <span className="text-sm 2xl:text-base text-[#3f4850] font-medium">{s.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* 3. WILAYAH, BATAS & TATA GUNA LAHAN                         */}
          {/* ============================================================ */}
          {(activeTab === 'semua' || activeTab === 'wilayah') && (
          <section className={`${cx} mb-10 2xl:mb-14`}>
            <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 2xl:p-10 shadow-sm border border-[#e2e7ff]">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[22px] text-[#006194]">globe_asia</span>
                <h2 className="text-xl sm:text-2xl 2xl:text-3xl text-[#131b2e] font-bold">Wilayah, Batas &amp; Tata Guna Lahan</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 2xl:gap-8 mb-6">
                {/* Batas Wilayah Administratif */}
                <div className="bg-[#f2f3ff] rounded-xl 2xl:rounded-2xl p-5 2xl:p-6 border border-[#e2e7ff]/80">
                  <h3 className="text-sm 2xl:text-base text-[#131b2e] font-bold mb-4">Batas Wilayah Administratif (5 Perbatasan)</h3>
                  <div className="space-y-2.5">
                    {[
                      { dir: 'Utara', val: 'Kelurahan Kolongan' },
                      { dir: 'Timur', val: 'Kelurahan Matani Satu' },
                      { dir: 'Selatan', val: 'Sonder Dua' },
                      { dir: 'Barat', val: 'Kelurahan Kinilow' },
                      { dir: 'Tenggara', val: 'Kelurahan Kakaskasen' },
                    ].map((b, i) => (
                      <div key={i} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg text-xs 2xl:text-sm border border-[#e2e7ff]/60">
                        <span className="font-semibold text-[#006194]">{b.dir}</span>
                        <span className="text-[#131b2e] font-medium">{b.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distribusi & Alokasi Lahan */}
                <div className="bg-[#f2f3ff] rounded-xl 2xl:rounded-2xl p-5 2xl:p-6 border border-[#e2e7ff]/80">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm 2xl:text-base text-[#131b2e] font-bold">Distribusi &amp; Alokasi Lahan (48,05 Ha)</h3>
                    <span className="text-[11px] text-[#3f4850] font-medium bg-white px-2 py-0.5 rounded-full border border-[#e2e7ff]/60">Peta Wilayah 4 Fungsi</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs 2xl:text-sm">
                      <thead>
                        <tr className="text-left text-[#3f4850] border-b border-[#dae2fd]">
                          <th className="py-2 pr-4 font-semibold">Jenis Lahan</th>
                          <th className="py-2 pr-4 font-semibold text-right">Luas (Ha)</th>
                          <th className="py-2 pr-4 font-semibold text-right">Persen (%)</th>
                          <th className="py-2 font-semibold text-right">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody className="text-[#131b2e]">
                        {[
                          ['Pemukiman / Pekarangan', '17,25', '35,9%', 'Utama'],
                          ['Pertanian / Ladang', '14,30', '29,8%', 'Produktif'],
                          ['Perkebunan / Kebun', '9,50', '19,8%', 'Campuran'],
                          ['Lahan Tkd Produktif', '4,00', '8,3%', 'Potensi'],
                          ['Lahan Lain', '3,00', '6,2%', 'Pemerintah Desa'],
                        ].map((r, i) => (
                          <tr key={i} className="border-b border-[#eaedff] last:border-0">
                            <td className="py-2.5 pr-4 font-medium">{r[0]}</td>
                            <td className="py-2.5 pr-4 text-right font-semibold text-[#006194]">{r[1]}</td>
                            <td className="py-2.5 pr-4 text-right">{r[2]}</td>
                            <td className="py-2.5 text-right"><span className="bg-[#cce5ff]/50 text-[#006194] text-[10px] font-semibold px-2 py-0.5 rounded-full">{r[3]}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Infrastruktur & Aksesibilitas */}
              <div className="bg-[#f2f3ff] rounded-xl 2xl:rounded-2xl p-5 2xl:p-6 border border-[#e2e7ff]/80">
                <h3 className="text-sm 2xl:text-base text-[#131b2e] font-bold mb-4">Infrastruktur &amp; Aksesibilitas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 2xl:gap-4">
                  {[
                    { label: 'Jalan Aspal', val: '4,5 Km', icon: 'road' },
                    { label: 'Jalan Paving', val: '2,8 Km', icon: 'road' },
                    { label: 'Jembatan', val: '3 Unit', icon: 'domain' },
                    { label: 'Gorong-gorong', val: '12 Unit', icon: 'water_damage' },
                  ].map((inf, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 2xl:p-5 text-center border border-[#e2e7ff]/60">
                      <span className="material-symbols-outlined text-[24px] 2xl:text-[28px] text-[#006194] mb-1 block">{inf.icon}</span>
                      <div className="text-lg 2xl:text-xl font-bold text-[#131b2e]">{inf.val}</div>
                      <div className="text-[10px] 2xl:text-xs text-[#3f4850] font-medium mt-0.5">{inf.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          )}

          {/* ============================================================ */}
          {/* 4. DEMOGRAFI & PIRAMIDA USIA PENDUDUK                        */}
          {/* ============================================================ */}
          {(activeTab === 'semua' || activeTab === 'kependudukan') && (
          <section className={`${cx} mb-10 2xl:mb-14`}>
            <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 2xl:p-10 shadow-sm border border-[#e2e7ff]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[22px] text-[#006194]">groups</span>
                  <h2 className="text-xl sm:text-2xl 2xl:text-3xl text-[#131b2e] font-bold">Demografi &amp; Piramida Usia Penduduk</h2>
                </div>
                <span className="text-xs 2xl:text-sm text-[#3f4850] font-medium bg-[#f2f3ff] px-3 py-1 rounded-full border border-[#e2e7ff]/60">Peta Monografi 4 Fungsi</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 2xl:gap-8 mb-6">
                {/* Komposisi Umur / Kelompok Tenaga Kerja */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-sm 2xl:text-base text-[#131b2e] font-bold">Komposisi Umur &amp; Kelompok Tenaga Kerja</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Usia Produktif (18-59)', val: '876', pct: 59, color: 'bg-[#006194]' },
                      { label: 'Luar Usia Produktif (0-17)', val: '386', pct: 26, color: 'bg-[#93ccff]' },
                      { label: 'Lansia (60+)', val: '222', pct: 15, color: 'bg-[#4d5d73]' },
                    ].map((g, i) => (
                      <div key={i} className="bg-[#f2f3ff] rounded-xl p-4 2xl:p-5 border border-[#e2e7ff]/80">
                        <div className="text-[10px] 2xl:text-xs text-[#3f4850] font-semibold uppercase tracking-wider mb-1">{g.label}</div>
                        <div className="text-2xl 2xl:text-3xl font-bold text-[#131b2e] mb-2">{g.val} <span className="text-sm font-medium text-[#3f4850]">Jiwa</span></div>
                        <div className="w-full h-2 bg-[#e2e7ff] rounded-full overflow-hidden">
                          <div className={`h-full ${g.color} rounded-full`} style={{ width: `${g.pct}%` }} />
                        </div>
                        <div className="text-[10px] text-[#3f4850] font-medium mt-1 text-right">{g.pct}%</div>
                      </div>
                    ))}
                  </div>

                  {/* Catatan Kependudukan */}
                  <div className="bg-[#f2f3ff] rounded-xl p-4 2xl:p-5 border border-[#e2e7ff]/80">
                    <h4 className="text-xs 2xl:text-sm font-bold text-[#131b2e] mb-2">Catatan Kependudukan</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Usia Produktif (18-59 Tahun)', val: '876 Jiwa' },
                        { label: 'Di Bawah Produktif Terdata (0-17)', val: '386 Jiwa' },
                        { label: 'Angkatan Kerja Aktif (18-55)', val: '661 Jiwa' },
                        { label: 'Warga Usia Pensiun (56+)', val: '317 Jiwa' },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5 text-xs 2xl:text-sm">
                          <span className="text-[#3f4850]">{c.label}</span>
                          <span className="font-semibold text-[#006194]">{c.val}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] 2xl:text-xs text-[#3f4850] mt-2 pt-2 border-t border-[#dae2fd]">
                      56,8% penduduk bergerak di sektor pertanian, perkebunan campuran (kelapa, cengkeh), dan usaha kuliner.
                    </p>
                    <p className="text-[10px] 2xl:text-xs text-[#3f4850] mt-1">
                      Data Wajib Penanganan (Disabilitas) Tahun 2024: <strong className="text-[#131b2e]">BUMN</strong>
                    </p>
                  </div>
                </div>

                {/* Data Disabilitas & Khusus */}
                <div className="space-y-4">
                  <h3 className="text-sm 2xl:text-base text-[#131b2e] font-bold">Data Disabilitas &amp; Khusus</h3>
                  <div className="bg-[#f2f3ff] rounded-xl p-4 2xl:p-5 border border-[#e2e7ff]/80 space-y-3">
                    <p className="text-xs 2xl:text-sm text-[#3f4850] leading-relaxed">
                      Kelurahan Kolongan Satu memiliki <strong className="text-[#131b2e]">4 warga disabilitas terdaftar</strong> yang menerima layanan kesehatan dan pembinaan khusus dari Puskesmas Kecamatan Tomohon Tengah serta PKK/LKMD Kelurahan.
                    </p>
                    <div className="space-y-2">
                      {[
                        { label: 'Tuna Netra / Penglihatan', val: '1 Jiwa' },
                        { label: 'Tuna Rungu / Pendengaran', val: '1 Jiwa' },
                        { label: 'Disabilitas Fisik', val: '2 Jiwa' },
                      ].map((d, i) => (
                        <div key={i} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg text-xs 2xl:text-sm border border-[#e2e7ff]/60">
                          <span className="text-[#3f4850] font-medium">{d.label}</span>
                          <span className="font-semibold text-[#131b2e]">{d.val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-[#dae2fd] mt-2">
                      <p className="text-[10px] 2xl:text-xs text-[#3f4850]">
                        Warga berkebutuhan khusus mendapatkan prioritas dalam program bantuan sosial (PKH) dan pelayanan persuratan kantor kelurahan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          )}

          {/* ============================================================ */}
          {/* 5. TINGKAT PENDIDIKAN & RAGAM MATA PENCAHARIAN               */}
          {/* ============================================================ */}
          {(activeTab === 'semua' || activeTab === 'pendidikan') && (
          <section className={`${cx} mb-10 2xl:mb-14`}>
            <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 2xl:p-10 shadow-sm border border-[#e2e7ff]">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[22px] text-[#006194]">school</span>
                <h2 className="text-xl sm:text-2xl 2xl:text-3xl text-[#131b2e] font-bold">Tingkat Pendidikan &amp; Ragam Mata Pencaharian</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 2xl:gap-8">
                {/* Tingkat Pendidikan */}
                <div>
                  <h3 className="text-sm 2xl:text-base text-[#131b2e] font-bold mb-4">Tingkat Kelulusan Pendidikan Formal</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-4">
                    {[
                      { label: 'SD / Sederajat', val: '78', color: 'bg-[#cce5ff]', text: 'text-[#006194]' },
                      { label: 'SMP', val: '151', color: 'bg-[#93ccff]', text: 'text-[#006194]' },
                      { label: 'SMA / SMK', val: '529', color: 'bg-[#006194]', text: 'text-white' },
                      { label: 'D3 / D4', val: '50', color: 'bg-[#4d5d73]', text: 'text-white' },
                      { label: 'S1 / S2 / S3', val: '50', color: 'bg-[#131b2e]', text: 'text-white' },
                    ].map((e, i) => (
                      <div key={i} className={`${e.color} ${e.text} rounded-xl p-3 2xl:p-4 text-center`}>
                        <div className="text-2xl 2xl:text-3xl font-bold">{e.val}</div>
                        <div className="text-[9px] 2xl:text-[10px] font-semibold mt-0.5 opacity-85">{e.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#f2f3ff] rounded-xl p-3 2xl:p-4 border border-[#e2e7ff]/80">
                    <h4 className="text-xs font-bold text-[#131b2e] mb-2">Catatan Khusus Edukasi</h4>
                    <div className="grid grid-cols-2 gap-2 text-[10px] 2xl:text-xs text-[#3f4850]">
                      {[
                        { label: 'Tidak / Belum Sekolah', val: '212' },
                        { label: 'Tidak Tamat SD', val: '11' },
                        { label: 'Masih SD - SMP', val: '1' },
                        { label: 'Masih SMA', val: '—' },
                      ].map((n, i) => (
                        <div key={i} className="flex justify-between py-1">
                          <span>{n.label}</span>
                          <span className="font-semibold text-[#131b2e]">{n.val}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-[#3f4850] mt-2 pt-2 border-t border-[#dae2fd]">
                      Data terakhir dihimpun dari Dinas Pendidikan dan Kebudayaan Kota Tomohon melalui akses data kependudukan kelurahan.
                    </p>
                  </div>
                </div>

                {/* Sektor Mata Pencaharian */}
                <div>
                  <h3 className="text-sm 2xl:text-base text-[#131b2e] font-bold mb-4">Sektor Pekerjaan/Usaha Warga</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Petani, Pekebun & Peternak', val: '356 Jiwa', pct: 41 },
                      { label: 'Karyawan, Wiraswasta & Jasa', val: '287 Jiwa', pct: 33 },
                      { label: 'PNS, TNI/Polri, Guru, Tenaga Medis', val: '89 Jiwa', pct: 10 },
                      { label: 'Ibu Rumah Tangga, Pelajar & Lainnya', val: '138 Jiwa', pct: 16 },
                    ].map((j, i) => (
                      <div key={i} className="bg-[#f2f3ff] rounded-xl p-3.5 2xl:p-4 border border-[#e2e7ff]/80">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs 2xl:text-sm text-[#131b2e] font-medium">{j.label}</span>
                          <span className="text-xs 2xl:text-sm font-bold text-[#006194]">{j.val}</span>
                        </div>
                        <div className="w-full h-2 bg-[#e2e7ff] rounded-full overflow-hidden">
                          <div className="h-full bg-[#006194] rounded-full transition-all" style={{ width: `${j.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#f2f3ff] rounded-xl p-3 2xl:p-4 border border-[#e2e7ff]/80 mt-3">
                    <p className="text-[10px] 2xl:text-xs text-[#3f4850]">
                      Kelulusan SMA/SMK merupakan level tertinggi dengan 529 warga. Sektor pertanian menyerap tenaga kerja terbesar di kelurahan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          )}

          {/* ============================================================ */}
          {/* 6. POTENSI PETERNAKAN & KEBUTUHAN AIR BERSIH                 */}
          {/* ============================================================ */}
          {(activeTab === 'semua' || activeTab === 'peternakan') && (
          <section className={`${cx} mb-10 2xl:mb-14`}>
            <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 2xl:p-10 shadow-sm border border-[#e2e7ff]">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[22px] text-[#006194]">pets</span>
                <h2 className="text-xl sm:text-2xl 2xl:text-3xl text-[#131b2e] font-bold">Potensi Peternakan &amp; Kebutuhan Air Bersih</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 2xl:gap-8">
                {/* Populasi Ternak */}
                <div>
                  <h3 className="text-sm 2xl:text-base text-[#131b2e] font-bold mb-4">Populasi Ternak Peliharaan Warga</h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Sapi / Kerbau', val: '340', unit: 'Ekor' },
                      { label: 'Babi', val: '35', unit: 'Ekor' },
                      { label: 'Ayam / Unggas', val: '1.450', unit: 'Ekor' },
                    ].map((t, i) => (
                      <div key={i} className="bg-[#f2f3ff] rounded-xl p-4 2xl:p-5 text-center border border-[#e2e7ff]/80">
                        <div className="text-2xl 2xl:text-3xl font-bold text-[#131b2e]">{t.val}</div>
                        <div className="text-[10px] 2xl:text-xs text-[#006194] font-semibold">{t.unit}</div>
                        <div className="text-[10px] 2xl:text-xs text-[#3f4850] mt-1">{t.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#f2f3ff] rounded-xl p-3 2xl:p-4 border border-[#e2e7ff]/80 text-[10px] 2xl:text-xs text-[#3f4850] space-y-1">
                    <p>Peternakan babi tradisional (skala rumahan). Ayam potong dan petelur dikembangkan secara swadaya.</p>
                    <p>Rencana Kolaborasi Dinas Pertanian Kota Tomohon untuk peningkatan vaksinasi ternak rutin.</p>
                  </div>
                </div>

                {/* Sanitasi & Air Bersih */}
                <div>
                  <h3 className="text-sm 2xl:text-base text-[#131b2e] font-bold mb-4">Sanitasi, Drainase &amp; Sumber Air Warga</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Jumlah Penerima Akses Air Bersih', val: '1.484 Jiwa', badge: '100%', badgeC: 'bg-[#6cf8bb]/30 text-[#006c49]' },
                      { label: 'Sumber Utama: PDAM Kota Tomohon', val: '467 KK', badge: '87%', badgeC: 'bg-[#cce5ff] text-[#006194]' },
                      { label: 'Sumur & Perlengkapan Sederhana', val: '73 KK', badge: '13%', badgeC: 'bg-[#d3e4fe] text-[#4d5d73]' },
                      { label: 'MCK Komunal Terbangun', val: '3 Unit', badge: 'Aktif', badgeC: 'bg-[#6cf8bb]/30 text-[#006c49]' },
                      { label: 'Saluran Drainase / Irigasi Teknis', val: '4,2 Km', badge: 'Permanen', badgeC: 'bg-[#cce5ff] text-[#006194]' },
                    ].map((w, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 px-3.5 bg-[#f2f3ff] rounded-xl text-xs 2xl:text-sm border border-[#e2e7ff]/80">
                        <span className="text-[#131b2e] font-medium">{w.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#006194]">{w.val}</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${w.badgeC}`}>{w.badge}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] 2xl:text-xs text-[#3f4850] mt-3 px-1">
                    Penyediaan air bersih merata ke seluruh 5 Lingkungan. Koordinasi rutin Puskesmas dan Sanitarian Kecamatan.
                  </p>
                </div>
              </div>
            </div>
          </section>
          )}

          {/* ============================================================ */}
          {/* 7. KEMASYARAKATAN, FASILITAS IBADAH & SARANA PUBLIK          */}
          {/* ============================================================ */}
          {(activeTab === 'semua' || activeTab === 'sarana') && (
          <section className={`${cx} mb-10 2xl:mb-14`}>
            <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 2xl:p-10 shadow-sm border border-[#e2e7ff]">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[22px] text-[#006194]">account_balance</span>
                <h2 className="text-xl sm:text-2xl 2xl:text-3xl text-[#131b2e] font-bold">Kemasyarakatan, Fasilitas Ibadah &amp; Sarana Publik</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
                {/* Pemerintahan & Lembaga */}
                <div className="bg-[#f2f3ff] rounded-xl p-5 2xl:p-6 border border-[#e2e7ff]/80">
                  <h3 className="text-xs 2xl:text-sm text-[#006194] font-bold mb-3 uppercase tracking-wider">Pemerintahan &amp; Lembaga</h3>
                  <div className="space-y-2 text-xs 2xl:text-sm">
                    {[
                      { label: 'Kantor Kelurahan', val: '1 Unit' },
                      { label: 'Anggota LPM/LKMD', val: '14 Org' },
                      { label: 'Kader PKK Aktif/Posyandu', val: '15 Org' },
                      { label: 'Karang Taruna', val: '1 Org' },
                      { label: 'Hansip / Linmas', val: '10 Org' },
                      { label: 'Pos Kamling Aktif', val: 'Rutin Aktif' },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5">
                        <span className="text-[#3f4850]">{p.label}</span>
                        <span className="font-semibold text-[#131b2e]">{p.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sarana Pendidikan */}
                <div className="bg-[#f2f3ff] rounded-xl p-5 2xl:p-6 border border-[#e2e7ff]/80">
                  <h3 className="text-xs 2xl:text-sm text-[#006194] font-bold mb-3 uppercase tracking-wider">Sarana Pendidikan</h3>
                  <div className="space-y-2 text-xs 2xl:text-sm">
                    {[
                      { label: 'PAUD / TK', val: '1 Unit' },
                      { label: 'Sekolah Dasar (SD)', val: '1 Unit' },
                      { label: 'SMP / Sederajat', val: '—' },
                      { label: 'SMA / SMK', val: '—' },
                      { label: 'Taman Baca', val: '1 Unit' },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5">
                        <span className="text-[#3f4850]">{p.label}</span>
                        <span className="font-semibold text-[#131b2e]">{p.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kesehatan & Olahraga */}
                <div className="bg-[#f2f3ff] rounded-xl p-5 2xl:p-6 border border-[#e2e7ff]/80">
                  <h3 className="text-xs 2xl:text-sm text-[#006194] font-bold mb-3 uppercase tracking-wider">Kesehatan &amp; Olahraga</h3>
                  <div className="space-y-2 text-xs 2xl:text-sm">
                    {[
                      { label: 'Posyandu', val: '2 Unit' },
                      { label: 'Polindes / Pustu', val: '1 Unit' },
                      { label: 'Lapangan Olahraga', val: '1 Unit' },
                      { label: 'Bidan Desa', val: '1 Org' },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5">
                        <span className="text-[#3f4850]">{p.label}</span>
                        <span className="font-semibold text-[#131b2e]">{p.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Infrastruktur & Akses */}
                <div className="bg-[#f2f3ff] rounded-xl p-5 2xl:p-6 border border-[#e2e7ff]/80">
                  <h3 className="text-xs 2xl:text-sm text-[#006194] font-bold mb-3 uppercase tracking-wider">Infrastruktur &amp; Akses</h3>
                  <div className="space-y-2 text-xs 2xl:text-sm">
                    {[
                      { label: 'Pos Pemadam', val: '—' },
                      { label: 'Mata Air / Sumber Air', val: '1 Lok' },
                      { label: 'Persampahan / TPS', val: '1 Unit' },
                      { label: 'Tiang Penerangan Jalan', val: '42 Unit' },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5">
                        <span className="text-[#3f4850]">{p.label}</span>
                        <span className="font-semibold text-[#131b2e]">{p.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          )}

          {/* ============================================================ */}
          {/* 8. KKT COLLABORATION STRIP                                   */}
          {/* ============================================================ */}
          <section className={`${cx} mb-10 2xl:mb-14`}>
            <div className="bg-[#f2f3ff] rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 2xl:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 border border-[#dae2fd]">
              <div className="flex items-center gap-4 2xl:gap-6">
                <div className="w-14 h-14 2xl:w-16 2xl:h-16 rounded-full bg-[#cce5ff] flex items-center justify-center text-[#006194] shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[32px] 2xl:text-[36px]">school</span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg 2xl:text-xl text-[#131b2e] font-bold">Kolaborasi Kuliah Kerja Terpadu (KKT) 149 UNSRAT</h4>
                  <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] mt-1 leading-relaxed">
                    Penyusunan data profil monografi ini dilaksanakan atas kerjasama mahasiswa KKT Ke-149 Universitas Sam Ratulangi dengan Kelurahan Kolongan Satu, Kota Tomohon.
                  </p>
                </div>
              </div>
              <Link href="/portal" className="shrink-0 w-full sm:w-auto text-xs sm:text-sm 2xl:text-base font-semibold bg-white text-[#131b2e] hover:bg-[#faf8ff] px-5 2xl:px-8 py-3 2xl:py-4 rounded-full shadow-xs border border-[#dae2fd] hover:border-[#bfc7d2] transition-colors inline-flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006194]">open_in_new</span>
                <span>Buka Portal Interaktif</span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* ============================================================ */}
      {/* FOOTER — consistent with landing page                        */}
      {/* ============================================================ */}
      <footer className="w-full bg-[#f2f3ff] text-[#3f4850] pt-10 2xl:pt-14 pb-6 2xl:pb-10 border-t border-[#dae2fd]">
        <div className={cx}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-6 bg-[#006194] rounded-full" />
              <h4 className="text-base 2xl:text-lg text-[#131b2e] font-bold">Kelurahan Kolongan Satu</h4>
            </div>
            <p className="text-xs 2xl:text-sm text-[#3f4850]">
              Jl. Kolongan Raya, Kec. Tomohon Tengah, Kota Tomohon, Sulawesi Utara 95438
            </p>
          </div>
          <div className="pt-4 border-t border-[#dae2fd] flex flex-col md:flex-row items-center justify-between gap-3 text-xs 2xl:text-sm text-[#3f4850]">
            <p>&copy; 2024 Pemerintah Kelurahan Kolongan Satu, Kota Tomohon. Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-[#006194] transition-colors">Beranda</Link>
              <span>&middot;</span>
              <Link href="/portal" className="hover:text-[#006194] transition-colors">Portal Aparatur</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
