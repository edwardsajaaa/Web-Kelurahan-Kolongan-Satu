'use client';

import React, { useState, useMemo } from 'react';
import { MONOGRAFI_2024 } from '@/data/monografi2024';

export default function IntegratedMonografiSection() {
  const [activeCategory, setActiveCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFullRegistry, setShowFullRegistry] = useState<boolean>(true);
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    demografi: true,
    pendidikan: true,
    ekonomi: true,
    fasilitas: true,
    kelembagaan: true,
    bukuDesa: true,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  const categories = [
    { id: 'semua', label: '🌟 Semua Data Sekaligus', icon: 'grid_view' },
    { id: 'demografi', label: '1. Demografi, Agama & 5 Jaga', icon: 'groups' },
    { id: 'pendidikan', label: '2. Tenaga Kerja & Pendidikan', icon: 'school' },
    { id: 'ekonomi', label: '3. Mata Pencaharian, UMKM & Ternak', icon: 'storefront' },
    { id: 'fasilitas', label: '4. Sarana Ibadah, Kesehatan & Jalan', icon: 'church' },
    { id: 'kelembagaan', label: '5. Kelembagaan, Linmas & Inventaris', icon: 'account_balance' },
  ];

  const showDemografi = (activeCategory === 'semua' || activeCategory === 'demografi') && matchesSearch('demografi penduduk kepala keluarga jaga katolik protestan islam cacat rungu netra lumpuh stress idiot');
  const showPendidikan = (activeCategory === 'semua' || activeCategory === 'pendidikan') && matchesSearch('tenaga kerja umur angkatan balita lansia buta aksara sma smk s1 s2 s3 sd smp slb diploma');
  const showEkonomi = (activeCategory === 'semua' || activeCategory === 'ekonomi') && matchesSearch('ekonomi pekerjaan pns wiraswasta petani bumn umkm warung toko bbm las cukur unggas ayam babi sapi ternak');
  const showFasilitas = (activeCategory === 'semua' || activeCategory === 'fasilitas') && matchesSearch('fasilitas ibadah gmim katolik kesehatan pustu posyandu dokter apotek sekolah sd tk perpustakaan jalan jembatan ojek bendi sampah sanitasi odf');
  const showKelembagaan = (activeCategory === 'semua' || activeCategory === 'kelembagaan') && matchesSearch('kelembagaan linmas babinsa bhabinkamtibmas pkk lpm karang taruna parpol golkar pdip demokrat gerindra kantor inventaris lemari komputer buku');

  return (
    <section id="monografi-wilayah" className="w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 mb-16 2xl:mb-20 scroll-mt-24">
      
      {/* ============================================================ */}
      {/* 1. SECTION HEADER (Harmonized with Landing Page Aesthetic)   */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-5 border-b border-[#e2e7ff] gap-4 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#cce5ff]/70 px-3 2xl:px-4 py-1 2xl:py-1.5 rounded-full text-[#006194] text-xs 2xl:text-sm font-bold mb-2">
            <span className="material-symbols-outlined text-[16px] 2xl:text-[18px]">verified</span>
            <span>Data Papan Monografi Faktual Kelurahan (100% Seluruh Variabel)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl 2xl:text-4xl 3xl:text-5xl text-[#131b2e] font-bold tracking-tight">
            Monografi Lengkap Kelurahan Kolongan Satu
          </h2>
          <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] mt-1.5 max-w-3xl leading-relaxed">
            Seluruh variabel fisik papan monografi pemerintahan resmi (register kependudukan, rincian 5 Jaga, sebaran agama, tenaga kerja, pendidikan, mata pencaharian, UMKM, fasilitas publik, kelembagaan, hingga 12 buku administrasi kantor).
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-[#006194] hover:bg-[#007bb9] text-white px-5 2xl:px-7 py-2.5 2xl:py-3.5 rounded-full text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Cetak Laporan Resmi (3 Hal)</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. INTERACTIVE CONTROLS: DROPDOWN, TABS & PENCARIAN          */}
      {/* ============================================================ */}
      <div className="mb-8 space-y-4 no-print">
        {/* Top Filter Bar: Mobile Dropdown + Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#e2e7ff] shadow-xs">
          {/* Dropdown Selector for Fast Category Jumps */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <label htmlFor="category-select" className="text-xs font-bold text-[#131b2e] whitespace-nowrap flex items-center gap-1">
              <span className="material-symbols-outlined text-[#006194] text-[18px]">filter_list</span>
              <span>Pilih Kategori:</span>
            </label>
            <select
              id="category-select"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full text-xs sm:text-sm bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-semibold py-2 px-3 rounded-xl border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194] transition-all cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search Field */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4850] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari variabel (misal: katolik, bendi, ojek, linmas, pustu, babi)..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#faf8ff] rounded-xl border border-[#e2e7ff] text-[#131b2e] placeholder-[#71787e] focus:outline-none focus:ring-2 focus:ring-[#006194] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#3f4850] hover:text-[#131b2e] text-xs p-1"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Desktop Category Navigation Tabs (Pill Buttons) */}
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-4 2xl:px-5 py-2.5 rounded-full text-xs 2xl:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-[#006194] text-white border-[#006194] shadow-xs'
                  : 'bg-white text-[#3f4850] border-[#e2e7ff] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CORE MONOGRAFI SECTIONS                                   */}
      {/* ============================================================ */}
      <div className="space-y-8 no-print">

        {/* ------------------------------------------------------------ */}
        {/* SEKSI 1: DEMOGRAFI, REKAPITULASI 5 JAGA, AGAMA & DISABILITAS */}
        {/* ------------------------------------------------------------ */}
        {showDemografi && (
          <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eaedff]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#cce5ff] text-[#006194] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">groups</span>
                </div>
                <div>
                  <h3 className="text-lg 2xl:text-xl font-bold text-[#131b2e]">
                    1. Demografi, 5 Lingkungan Jaga &amp; Aliran Kepercayaan
                  </h3>
                  <p className="text-xs text-[#3f4850]">
                    Register kependudukan, struktur teritorial Pala I–V, agama, dan data warga binaan khusus.
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleAccordion('demografi')}
                className="text-xs text-[#006194] font-semibold inline-flex items-center gap-1 hover:underline self-start sm:self-auto cursor-pointer"
              >
                <span>{openAccordions['demografi'] ? 'Sembunyikan' : 'Tampilkan'}</span>
                <span className="material-symbols-outlined text-sm">
                  {openAccordions['demografi'] ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>

            {openAccordions['demografi'] && (
              <div className="space-y-6">
                {/* 4 Summary Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="bg-[#f2f3ff]/80 p-4 2xl:p-5 rounded-2xl border border-[#dae2fd]">
                    <span className="text-xs text-[#3f4850] font-semibold block">Total Penduduk</span>
                    <span className="text-2xl 2xl:text-3xl font-bold text-[#131b2e] mt-1 block">
                      1.484 <span className="text-xs font-normal text-[#3f4850]">Jiwa</span>
                    </span>
                    <span className="text-[11px] text-[#006194] font-medium mt-1 block">
                      725 L (48,9%) &bull; 759 P (51,1%)
                    </span>
                  </div>
                  <div className="bg-[#f2f3ff]/80 p-4 2xl:p-5 rounded-2xl border border-[#dae2fd]">
                    <span className="text-xs text-[#3f4850] font-semibold block">Kepala Keluarga (KK)</span>
                    <span className="text-2xl 2xl:text-3xl font-bold text-[#131b2e] mt-1 block">
                      540 <span className="text-xs font-normal text-[#3f4850]">KK</span>
                    </span>
                    <span className="text-[11px] text-[#006c49] font-medium mt-1 block">
                      Rata-rata 2,75 jiwa/KK
                    </span>
                  </div>
                  <div className="bg-[#f2f3ff]/80 p-4 2xl:p-5 rounded-2xl border border-[#dae2fd]">
                    <span className="text-xs text-[#3f4850] font-semibold block">Luas Wilayah</span>
                    <span className="text-2xl 2xl:text-3xl font-bold text-[#131b2e] mt-1 block">
                      48,05 <span className="text-xs font-normal text-[#3f4850]">Ha</span>
                    </span>
                    <span className="text-[11px] text-[#3f4850] font-medium mt-1 block">
                      34,5 Ha Pemukiman (71,8%)
                    </span>
                  </div>
                  <div className="bg-[#f2f3ff]/80 p-4 2xl:p-5 rounded-2xl border border-[#dae2fd]">
                    <span className="text-xs text-[#3f4850] font-semibold block">Sex Ratio &amp; ODF</span>
                    <span className="text-2xl 2xl:text-3xl font-bold text-[#006c49] mt-1 block">
                      95,5 <span className="text-xs font-normal text-[#3f4850]">Ratio</span>
                    </span>
                    <span className="text-[11px] text-[#006c49] font-medium mt-1 block">
                      100% Sanitasi Sehat ODF
                    </span>
                  </div>
                </div>

                {/* Tabel Detail 5 Lingkungan Jaga */}
                <div className="bg-white rounded-xl border border-[#eaedff] overflow-hidden">
                  <div className="px-4 py-3 bg-[#f2f3ff] border-b border-[#eaedff] flex justify-between items-center">
                    <span className="font-bold text-xs sm:text-sm text-[#131b2e]">
                      Rekapitulasi 5 Wilayah Lingkungan (Jaga I s/d Jaga V)
                    </span>
                    <span className="text-[11px] bg-white px-2.5 py-0.5 rounded-full text-[#006194] font-semibold border border-[#dae2fd]">
                      5 Pala &amp; 10 Mevrouw
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm text-left">
                      <thead>
                        <tr className="bg-[#faf8ff] text-[#3f4850] border-b border-[#eaedff]">
                          <th className="py-2.5 px-3">Wilayah</th>
                          <th className="py-2.5 px-3 text-center">Kepala Keluarga</th>
                          <th className="py-2.5 px-3 text-center">Laki-Laki</th>
                          <th className="py-2.5 px-3 text-center">Perempuan</th>
                          <th className="py-2.5 px-3 text-center font-bold text-[#006194]">Total Jiwa</th>
                          <th className="py-2.5 px-3">Kepala Lingkungan (PALA)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eaedff] text-[#131b2e]">
                        {MONOGRAFI_2024.jaga.map((jg) => (
                          <tr key={jg.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                            <td className="py-2.5 px-3 font-bold">{jg.nama}</td>
                            <td className="py-2.5 px-3 text-center">{jg.kk} KK</td>
                            <td className="py-2.5 px-3 text-center">{jg.lakiLaki} Jiwa</td>
                            <td className="py-2.5 px-3 text-center">{jg.perempuan} Jiwa</td>
                            <td className="py-2.5 px-3 text-center font-bold text-[#006194]">{jg.populasi} Jiwa</td>
                            <td className="py-2.5 px-3 text-[#3f4850] font-medium">{jg.pala}</td>
                          </tr>
                        ))}
                        <tr className="bg-[#f2f3ff] font-bold text-[#131b2e]">
                          <td className="py-3 px-3">JUMLAH KESELURUHAN</td>
                          <td className="py-3 px-3 text-center">540 KK</td>
                          <td className="py-3 px-3 text-center">725 Jiwa</td>
                          <td className="py-3 px-3 text-center">759 Jiwa</td>
                          <td className="py-3 px-3 text-center text-[#006194]">1.484 Jiwa</td>
                          <td className="py-3 px-3 text-[#006c49]">Tersebar rata di 5 Lingkungan</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sebaran Agama & Disabilitas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Agama / Aliran Kepercayaan */}
                  <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd]">
                    <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#006194] text-[18px]">church</span>
                      <span>Agama &amp; Aliran Kepercayaan (Faktual Papan Data)</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                        <div>
                          <span className="font-bold text-[#131b2e] block">Katolik</span>
                          <span className="text-[11px] text-[#3f4850]">L: 440 &bull; P: 491</span>
                        </div>
                        <span className="font-bold text-sm text-[#006194]">931 Jiwa (62,7%)</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                        <div>
                          <span className="font-bold text-[#131b2e] block">Kristen Protestan (GMIM)</span>
                          <span className="text-[11px] text-[#3f4850]">L: 254 &bull; P: 250</span>
                        </div>
                        <span className="font-bold text-sm text-[#006194]">504 Jiwa (34,0%)</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                        <div>
                          <span className="font-bold text-[#131b2e] block">Islam</span>
                          <span className="text-[11px] text-[#3f4850]">L: 31 &bull; P: 18</span>
                        </div>
                        <span className="font-bold text-sm text-[#131b2e]">49 Jiwa (3,3%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Cacat Fisik & Mental */}
                  <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd]">
                    <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#006c49] text-[18px]">accessible</span>
                      <span>Data Cacat Fisik &amp; Mental (Binaan Sosial)</span>
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      {[
                        { label: 'Tuna Rungu', val: '2 Jiwa (P: 2)' },
                        { label: 'Tuna Netra', val: '1 Jiwa (P: 1)' },
                        { label: 'Lumpuh / Cacat Fisik', val: '2 Jiwa (L: 1, P: 1)' },
                        { label: 'Binaan Mental / Idiot', val: '2 Jiwa (L: 2)' },
                        { label: 'Masalah Kejiwaan / Stress', val: '3 Jiwa (L: 1, P: 2)' },
                      ].map((item, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                          <span className="font-medium text-[#131b2e]">{item.label}</span>
                          <span className="font-bold text-[#006194]">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SEKSI 2: TENAGA KERJA, KELOMPOK UMUR & TINGKAT PENDIDIKAN    */}
        {/* ------------------------------------------------------------ */}
        {showPendidikan && (
          <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eaedff]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#cce5ff] text-[#006194] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">school</span>
                </div>
                <div>
                  <h3 className="text-lg 2xl:text-xl font-bold text-[#131b2e]">
                    2. Tenaga Kerja, Kelompok Umur &amp; Tingkat Kelulusan Pendidikan
                  </h3>
                  <p className="text-xs text-[#3f4850]">
                    Komposisi angkatan kerja produktif, anak sekolah, lansia, melek aksara, serta jenjang ijazah resmi.
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleAccordion('pendidikan')}
                className="text-xs text-[#006194] font-semibold inline-flex items-center gap-1 hover:underline self-start sm:self-auto cursor-pointer"
              >
                <span>{openAccordions['pendidikan'] ? 'Sembunyikan' : 'Tampilkan'}</span>
                <span className="material-symbols-outlined text-sm">
                  {openAccordions['pendidikan'] ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>

            {openAccordions['pendidikan'] && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kolom Kiri: Tenaga Kerja & Kelompok Umur */}
                <div className="space-y-2.5 text-xs">
                  <span className="font-bold text-sm text-[#131b2e] block mb-2">
                    Distribusi Tenaga Kerja &amp; Kelompok Usia (Faktual Papan)
                  </span>
                  <div className="p-3 bg-[#f2f3ff] rounded-xl flex justify-between items-center border border-[#eaedff]">
                    <div>
                      <span className="font-bold text-[#131b2e] block">Penduduk Usia 18–56 Thn Bekerja</span>
                      <span className="text-[11px] text-[#3f4850]">Angkatan Kerja Produktif (L: 322 &bull; P: 172)</span>
                    </div>
                    <span className="text-base font-bold text-[#006c49]">494 Jiwa</span>
                  </div>
                  <div className="p-3 bg-[#f2f3ff] rounded-xl flex justify-between items-center border border-[#eaedff]">
                    <div>
                      <span className="font-bold text-[#131b2e] block">Penduduk Usia 18–56 Thn Tdk Kerja / IRT</span>
                      <span className="text-[11px] text-[#3f4850]">Ibu Rumah Tangga &amp; Lainnya (L: 114 &bull; P: 268)</span>
                    </div>
                    <span className="text-base font-bold text-[#4d5d73]">382 Jiwa</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg flex justify-between items-center border border-[#dae2fd]">
                    <span className="font-semibold text-[#131b2e]">Total Populasi Usia 18–56 Tahun:</span>
                    <span className="font-bold text-[#006194]">876 Jiwa (L: 436, P: 440)</span>
                  </div>
                  <div className="p-3 bg-[#f2f3ff] rounded-xl flex justify-between items-center border border-[#eaedff]">
                    <div>
                      <span className="font-bold text-[#131b2e] block">Anak Balita (Usia 0–6 Tahun)</span>
                      <span className="text-[11px] text-[#3f4850]">Prasekolah / Binaan Posyandu (L: 56 &bull; P: 53)</span>
                    </div>
                    <span className="text-base font-bold text-[#006194]">109 Jiwa</span>
                  </div>
                  <div className="p-3 bg-[#f2f3ff] rounded-xl flex justify-between items-center border border-[#eaedff]">
                    <div>
                      <span className="font-bold text-[#131b2e] block">Usia Sekolah (7–18 Tahun)</span>
                      <span className="text-[11px] text-[#3f4850]">Wajib Belajar 12 Tahun (L: 113 &bull; P: 109)</span>
                    </div>
                    <span className="text-base font-bold text-[#006194]">222 Jiwa</span>
                  </div>
                  <div className="p-3 bg-[#f2f3ff] rounded-xl flex justify-between items-center border border-[#eaedff]">
                    <div>
                      <span className="font-bold text-[#131b2e] block">Penduduk Usia &gt; 56 Tahun (Lansia)</span>
                      <span className="text-[11px] text-[#3f4850]">Lanjut Usia Terawat (L: 120 &bull; P: 157)</span>
                    </div>
                    <span className="text-base font-bold text-[#131b2e]">277 Jiwa</span>
                  </div>
                  <div className="p-3 bg-[#6cf8bb]/30 rounded-xl flex justify-between items-center font-bold text-[#006c49]">
                    <span>Buta Aksara Usia 18–56 Tahun:</span>
                    <span>0 Jiwa (100% Bebas BA)</span>
                  </div>
                </div>

                {/* Kolom Kanan: Tingkat Kelulusan Pendidikan Formal */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-sm text-[#131b2e] block mb-2">
                    Tingkat Kelulusan Ijazah Pendidikan Formal
                  </span>
                  {[
                    { jenjang: 'Tamat SMA / SMK / Sederajat', jml: '520 Jiwa', pct: '50,7%', color: 'text-[#006194]' },
                    { jenjang: 'Tamat Sarjana (S-1 / D-4)', jml: '212 Jiwa', pct: '20,7%', color: 'text-[#006c49]' },
                    { jenjang: 'Tamat SMP / Sederajat', jml: '154 Jiwa', pct: '15,0%', color: 'text-[#131b2e]' },
                    { jenjang: 'Tamat SD / Sederajat', jml: '78 Jiwa', pct: '7,6%', color: 'text-[#131b2e]' },
                    { jenjang: 'Tamat Diploma D-3 / Sederajat', jml: '40 Jiwa', pct: '3,9%', color: 'text-[#4d5d73]' },
                    { jenjang: 'Tamat Diploma D-1 / D-2', jml: '10 Jiwa', pct: '1,0%', color: 'text-[#4d5d73]' },
                    { jenjang: 'Tamat Magister (S-2)', jml: '8 Jiwa', pct: '0,8%', color: 'text-[#006194]' },
                    { jenjang: 'Tamat Doktor (S-3)', jml: '2 Jiwa', pct: '0,2%', color: 'text-[#006194]' },
                    { jenjang: 'Tamat Sekolah Luar Biasa (SLB C)', jml: '1 Jiwa', pct: 'Inklusi', color: 'text-[#006c49]' },
                  ].map((edu, idx) => (
                    <div key={idx} className="p-2.5 bg-[#f2f3ff] rounded-xl flex justify-between items-center border border-[#eaedff]">
                      <span className="font-medium text-[#131b2e]">{edu.jenjang}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${edu.color}`}>{edu.jml}</span>
                        <span className="bg-white px-2 py-0.5 rounded-full text-[10px] text-[#3f4850] border border-[#eaedff] font-semibold">
                          {edu.pct}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-[#cce5ff]/60 rounded-xl flex justify-between items-center font-bold text-[#006194] mt-2">
                    <span>Total Warga Berijazah Tercatat:</span>
                    <span className="text-sm">1.025 Lulusan</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SEKSI 3: MATA PENCAHARIAN, EKONOMI UMKM & PETERNAKAN         */}
        {/* ------------------------------------------------------------ */}
        {showEkonomi && (
          <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eaedff]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#cce5ff] text-[#006194] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">storefront</span>
                </div>
                <div>
                  <h3 className="text-lg 2xl:text-xl font-bold text-[#131b2e]">
                    3. Mata Pencaharian Warga, Usaha UMKM &amp; Peternakan
                  </h3>
                  <p className="text-xs text-[#3f4850]">
                    Pekerjaan dominan warga, sebaran unit usaha perdagangan, industri rumahan, dan populasi ternak.
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleAccordion('ekonomi')}
                className="text-xs text-[#006194] font-semibold inline-flex items-center gap-1 hover:underline self-start sm:self-auto cursor-pointer"
              >
                <span>{openAccordions['ekonomi'] ? 'Sembunyikan' : 'Tampilkan'}</span>
                <span className="material-symbols-outlined text-sm">
                  {openAccordions['ekonomi'] ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>

            {openAccordions['ekonomi'] && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Mata Pencaharian */}
                <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd]">
                  <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006194] text-[18px]">work</span>
                    <span>Mata Pencaharian (Register Faktual)</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { job: 'Karyawan Swasta / BUMN', val: '146 Jiwa' },
                      { job: 'Wiraswasta / Pedagang', val: '94 Jiwa' },
                      { job: 'Petani & Perkebunan', val: '82 Jiwa' },
                      { job: 'PNS / TNI / Polri', val: '68 Jiwa' },
                      { job: 'Tukang Besi, Kayu & Bangunan', val: '45 Jiwa' },
                      { job: 'Pensiunan PNS / TNI / BUMN', val: '38 Jiwa' },
                      { job: 'Pelajar / Mahasiswa', val: '195 Jiwa' },
                      { job: 'Mengurus Rumah Tangga (IRT)', val: '215 Jiwa' },
                      { job: 'Belum / Tidak Bekerja', val: '143 Jiwa' },
                      { job: 'Perangkat Kelurahan / PALA', val: '7 Jiwa' },
                    ].map((p, i) => (
                      <div key={i} className="p-2 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                        <span className="text-[#3f4850]">{p.job}</span>
                        <span className="font-bold text-[#131b2e]">{p.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. UMKM, Perdagangan & Jasa */}
                <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd]">
                  <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">shopping_bag</span>
                    <span>Unit Usaha Perdagangan &amp; UMKM</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                      <span>Warung Kelontong / Sembako</span>
                      <span className="font-bold text-[#006194]">19 Unit</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                      <span>Toko / Kios Permanen</span>
                      <span className="font-bold text-[#006194]">2 Unit</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                      <span>Pangkalan Gas LPG &amp; BBM</span>
                      <span className="font-bold text-[#006194]">4 Unit</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                      <span>Rumah Makan &amp; Restoran</span>
                      <span className="font-bold text-[#006c49]">1 Unit</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                      <span>Koperasi Simpan Pinjam</span>
                      <span className="font-bold text-[#006c49]">1 Unit (Aktif)</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                      <span>Industri Bahan Bangunan / Kayu</span>
                      <span className="font-bold text-[#131b2e]">5 Unit</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                      <span>Industri Pengolahan Makanan</span>
                      <span className="font-bold text-[#131b2e]">2 Unit</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                      <span>Bengkel Las &amp; Tukang Besi</span>
                      <span className="font-bold text-[#131b2e]">1 Unit</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                      <span>Jasa Cukur Rambut / Pangkas</span>
                      <span className="font-bold text-[#131b2e]">1 Unit</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                      <span>Grup Kesenian &amp; Paduan Suara</span>
                      <span className="font-bold text-[#006194]">2 Kelompok</span>
                    </div>
                  </div>
                </div>

                {/* 3. Populasi Peternakan */}
                <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd]">
                  <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#4d5d73] text-[18px]">pets</span>
                    <span>Populasi Peternakan (Total 1.825 Ekor)</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-[#eaedff] flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#131b2e] block">Unggas / Ayam (Petelur &amp; Buras)</span>
                        <span className="text-[11px] text-[#3f4850]">Budidaya pekarangan warga</span>
                      </div>
                      <span className="font-bold text-[#006194]">1.450 Ekor</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#eaedff] flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#131b2e] block">Ternak Babi</span>
                        <span className="text-[11px] text-[#3f4850]">Kandang terstandarisasi</span>
                      </div>
                      <span className="font-bold text-[#006c49]">340 Ekor</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#eaedff] flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#131b2e] block">Ternak Sapi</span>
                        <span className="text-[11px] text-[#3f4850]">Penggembalaan kebun</span>
                      </div>
                      <span className="font-bold text-[#131b2e]">35 Ekor</span>
                    </div>
                    <div className="p-2.5 bg-[#6cf8bb]/30 rounded-xl text-[11px] text-[#006c49] font-bold">
                      &bull; Higienitas Lingkungan Ternak: 100% Bebas pencemaran pemukiman padat
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SEKSI 4: SARANA IBADAH, KESEHATAN, PENDIDIKAN & TRANSPORTASI */}
        {/* ------------------------------------------------------------ */}
        {showFasilitas && (
          <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eaedff]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#cce5ff] text-[#006194] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">church</span>
                </div>
                <div>
                  <h3 className="text-lg 2xl:text-xl font-bold text-[#131b2e]">
                    4. Sarana Ibadah, Kesehatan, Gedung Pendidikan &amp; Transportasi
                  </h3>
                  <p className="text-xs text-[#3f4850]">
                    Ketersediaan fisik gedung peribadatan, posyandu, pustu, gedung sekolah, sanitasi, dan akses jalan.
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleAccordion('fasilitas')}
                className="text-xs text-[#006194] font-semibold inline-flex items-center gap-1 hover:underline self-start sm:self-auto cursor-pointer"
              >
                <span>{openAccordions['fasilitas'] ? 'Sembunyikan' : 'Tampilkan'}</span>
                <span className="material-symbols-outlined text-sm">
                  {openAccordions['fasilitas'] ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>

            {openAccordions['fasilitas'] && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Ibadah & Olahraga */}
                <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd] space-y-2 text-xs">
                  <span className="font-bold text-[#006194] uppercase tracking-wider block text-[11px]">
                    Ibadah &amp; Olahraga
                  </span>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Gereja Kristen (GMIM)</span>
                    <span className="font-bold text-[#006194]">4 Unit</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Gereja Katolik</span>
                    <span className="font-bold text-[#006194]">1 Unit</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Lapangan Voli &amp; Bola</span>
                    <span className="font-bold text-[#131b2e]">1 Unit</span>
                  </div>
                  <p className="text-[11px] text-[#3f4850] italic pt-1">
                    Seluruh 5 rumah ibadah dalam kondisi fisik prima dan menjunjung tinggi kerukunan antar-umat.
                  </p>
                </div>

                {/* 2. Kesehatan Masyarakat */}
                <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd] space-y-2 text-xs">
                  <span className="font-bold text-[#006c49] uppercase tracking-wider block text-[11px]">
                    Kesehatan Warga
                  </span>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Puskesmas Pembantu (Pustu)</span>
                    <span className="font-bold text-[#006c49]">1 Unit</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Posyandu Terintegrasi</span>
                    <span className="font-bold text-[#006c49]">2 Unit</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Praktek Dokter / Bidan</span>
                    <span className="font-bold text-[#131b2e]">3 Titik</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Apotek Pelayanan</span>
                    <span className="font-bold text-[#131b2e]">1 Unit</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Rumah Sakit Rujukan</span>
                    <span className="text-[#3f4850]">RSUD (1,5 Km)</span>
                  </div>
                </div>

                {/* 3. Gedung Pendidikan Fisik */}
                <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd] space-y-2 text-xs">
                  <span className="font-bold text-[#006194] uppercase tracking-wider block text-[11px]">
                    Fasilitas Pendidikan
                  </span>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Sekolah Dasar (SD Negeri)</span>
                    <span className="font-bold text-[#131b2e]">1 Unit</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Taman Kanak-kanak (TK)</span>
                    <span className="font-bold text-[#131b2e]">1 Unit</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Sekolah Luar Biasa (SLB C)</span>
                    <span className="font-bold text-[#006c49]">1 Unit</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Perpustakaan Kelurahan</span>
                    <span className="font-bold text-[#006194]">1 Unit</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Playgroup, SMP, SMA</span>
                    <span className="text-[#71787e]">- (Pusat Kota)</span>
                  </div>
                </div>

                {/* 4. Transportasi, Sanitasi & Kebersihan */}
                <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd] space-y-2 text-xs">
                  <span className="font-bold text-[#4d5d73] uppercase tracking-wider block text-[11px]">
                    Transportasi &amp; Lingkungan
                  </span>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Jalan Provinsi Hotmix</span>
                    <span className="font-bold text-[#006c49]">4,5 Km (Baik)</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Jembatan Beton</span>
                    <span className="font-bold text-[#131b2e]">3 Unit (Baik)</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Angkutan Ojek</span>
                    <span className="font-bold text-[#006194]">Ada (Aktif)</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Bendi Tradisional</span>
                    <span className="text-[#71787e]">Tidak Ada</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Warnet Komersial</span>
                    <span className="text-[#71787e]">Tidak Ada (4G/5G)</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                    <span>Truk Sampah DLH Pemkot</span>
                    <span className="font-bold text-[#006c49]">1 Unit (Rutin)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SEKSI 5: KELEMBAGAAN, LINMAS, POLITIK & INVENTARIS KANTOR     */}
        {/* ------------------------------------------------------------ */}
        {showKelembagaan && (
          <div className="bg-white rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eaedff]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#cce5ff] text-[#006194] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">account_balance</span>
                </div>
                <div>
                  <h3 className="text-lg 2xl:text-xl font-bold text-[#131b2e]">
                    5. Kelembagaan, Linmas, Partai Politik &amp; 12 Buku Administrasi Kantor
                  </h3>
                  <p className="text-xs text-[#3f4850]">
                    Aparatur keamanan, kelembagaan masyarakat, inventaris fisik kantor kelurahan, dan register administrasi wajib.
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleAccordion('kelembagaan')}
                className="text-xs text-[#006194] font-semibold inline-flex items-center gap-1 hover:underline self-start sm:self-auto cursor-pointer"
              >
                <span>{openAccordions['kelembagaan'] ? 'Sembunyikan' : 'Tampilkan'}</span>
                <span className="material-symbols-outlined text-sm">
                  {openAccordions['kelembagaan'] ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>

            {openAccordions['kelembagaan'] && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Keamanan & Ormas */}
                  <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd]">
                    <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#006194] text-[18px]">shield_person</span>
                      <span>Keamanan &amp; Organisasi Warga</span>
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Anggota Linmas (Hansip)</span>
                        <span className="font-bold text-[#006194]">12 Orang</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Satgas Linmas</span>
                        <span className="font-bold text-[#006194]">1 Orang</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Babinsa &amp; Bhabinkamtibmas</span>
                        <span className="font-bold text-[#131b2e]">2 Petugas (TNI/Polri)</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Pengurus PKK Aktif</span>
                        <span className="font-bold text-[#006c49]">12 Anggota</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Anggota LPM Kelurahan</span>
                        <span className="font-bold text-[#006c49]">15 Anggota</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Karang Taruna</span>
                        <span className="font-bold text-[#131b2e]">1 Organisasi</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Organisasi Keagamaan</span>
                        <span className="font-bold text-[#131b2e]">13 Organisasi</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Kelompok Gotong Royong (Mapalus)</span>
                        <span className="font-bold text-[#006c49]">Ada &amp; Terpelihara</span>
                      </div>
                    </div>
                  </div>

                  {/* Lembaga Politik & Fasilitas Kantor */}
                  <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd]">
                    <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#006194] text-[18px]">how_to_vote</span>
                      <span>Partai Politik &amp; Kantor Lurah</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-white rounded-lg border border-[#eaedff]">
                        <span className="font-bold text-[#131b2e] block mb-1">Partai Politik (Dasar Hukum &amp; Pengurus):</span>
                        <div className="grid grid-cols-2 gap-1 text-[11px]">
                          <span className="bg-[#f2f3ff] p-1 rounded text-center font-medium">Golkar: Ada</span>
                          <span className="bg-[#f2f3ff] p-1 rounded text-center font-medium">PDIP: Ada</span>
                          <span className="bg-[#f2f3ff] p-1 rounded text-center font-medium">Demokrat: Ada</span>
                          <span className="bg-[#f2f3ff] p-1 rounded text-center font-medium">Gerindra: Ada</span>
                        </div>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Kondisi Gedung Kantor</span>
                        <span className="font-bold text-[#006c49]">Permanen (Baik)</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Jumlah Ruangan Kantor</span>
                        <span className="font-bold text-[#131b2e]">4 Ruangan</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Listrik PLN &amp; Air Bersih PAM</span>
                        <span className="font-bold text-[#006c49]">Lengkap Ada</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Kendaraan Dinas Operasional</span>
                        <span className="font-bold text-[#131b2e]">Ada</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Kantor LPM &amp; PKK</span>
                        <span className="font-bold text-[#006c49]">Ada &amp; Layak</span>
                      </div>
                    </div>
                  </div>

                  {/* Inventaris & 12 Buku Administrasi Wajib */}
                  <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd]">
                    <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#006194] text-[18px]">inventory_2</span>
                      <span>Inventaris &amp; 12 Buku Administrasi</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-white rounded-lg border border-[#eaedff] text-center">
                          <span className="text-[10px] text-[#3f4850] block">Lemari Arsip</span>
                          <span className="text-sm font-bold text-[#006194]">4 Unit</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-[#eaedff] text-center">
                          <span className="text-[10px] text-[#3f4850] block">Komputer Kantor</span>
                          <span className="text-sm font-bold text-[#006194]">4 Unit</span>
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-[#eaedff]">
                        <span className="font-bold text-[11px] text-[#131b2e] block mb-1">
                          12 Buku Register Desa (Semua Ada):
                        </span>
                        <div className="grid grid-cols-2 gap-1 text-[10px] text-[#3f4850]">
                          <span>&check; Peraturan Desa</span>
                          <span>&check; SK Lurah</span>
                          <span>&check; Adm. Kependudukan</span>
                          <span>&check; Inventaris</span>
                          <span>&check; Aparat Desa</span>
                          <span>&check; Pajak / PBB</span>
                          <span>&check; Buku Tanah</span>
                          <span>&check; Ekspedisi Surat</span>
                          <span>&check; Surat Masuk/Keluar</span>
                          <span>&check; Registrasi Pelayanan</span>
                          <span>&check; Profil Kelurahan</span>
                          <span>&check; Induk Penduduk</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* 4. BANNER CETAK & UNDUH DOKUMEN RESMI 3 HALAMAN (DI BAWAH)   */}
      {/* ============================================================ */}
      <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-white to-[#f2f3ff] shadow-sm border border-[#e2e7ff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 no-print">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cce5ff] text-[#006194] text-xs font-bold">
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
            <span>Dokumen Teknis Resmi 3 Halaman Siap Cetak</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#131b2e]">
            Cetak &amp; Unduh Laporan Monografi Resmi (A4 Format)
          </h3>
          <p className="text-xs sm:text-sm text-[#3f4850] leading-relaxed">
            Format laporan administrasi baku pemerintahan Kota Tomohon (Kop Surat resmi, register 5 Jaga, rekapitulasi demografi, fasilitas, dan lembar pengesahan tanda tangan Lurah &amp; Seklur).
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#006c49] font-medium">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">check_circle</span> Standar A4 Portrait
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">check_circle</span> Variabel Papan UNIMA 2022 Faktual
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">check_circle</span> Sah Tertanda Tangan Lurah
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#006194] text-white hover:bg-[#007bb9] text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">print</span>
            <span>Cetak / Unduh PDF (3 Hal)</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. LAPORAN MONOGRAFI RESMI PEMERINTAHAN (PRINT-ONLY 3 HAL)   */}
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

          <div className="text-center mb-4">
            <h2 className="text-base font-bold uppercase tracking-wide underline mb-0.5">
              BUKU LAPORAN MONOGRAFI WILAYAH &amp; KEPENDUDUKAN
            </h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-800">
              SEMESTER I / TAHUN ANGGARAN 2024
            </p>
          </div>

          {/* BAGIAN I: DATA UMUM WILAYAH & GEOGRAFIS */}
          <div className="mb-4">
            <h3 className="text-xs font-bold uppercase bg-gray-200 border border-black px-2 py-0.5 mb-1.5">
              I. DATA UMUM &amp; BATAS ADMINISTRASI KELURAHAN
            </h3>
            <table className="w-full border-collapse border border-black text-[10px]">
              <tbody>
                <tr>
                  <td className="border border-black px-2 py-1 font-bold w-48">1. Nama Kelurahan</td>
                  <td className="border border-black px-2 py-1">KOLONGAN SATU</td>
                  <td className="border border-black px-2 py-1 font-bold w-48">5. Tipologi Kelurahan</td>
                  <td className="border border-black px-2 py-1">Permukiman &amp; Jasa Perdagangan</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1 font-bold">2. Kecamatan</td>
                  <td className="border border-black px-2 py-1">Tomohon Tengah</td>
                  <td className="border border-black px-2 py-1 font-bold">6. Luas Wilayah Total</td>
                  <td className="border border-black px-2 py-1 font-bold">48,05 Hektar (Ha)</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1 font-bold">3. Kota / Provinsi</td>
                  <td className="border border-black px-2 py-1">Kota Tomohon / Sulawesi Utara</td>
                  <td className="border border-black px-2 py-1 font-bold">7. Jumlah Wilayah Jaga</td>
                  <td className="border border-black px-2 py-1">5 Lingkungan (Jaga I s/d V)</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1 font-bold">4. Kode Wilayah / Kemendagri</td>
                  <td className="border border-black px-2 py-1">71.73.02.1004</td>
                  <td className="border border-black px-2 py-1 font-bold">8. Kode Pos Wilayah</td>
                  <td className="border border-black px-2 py-1">95438</td>
                </tr>
              </tbody>
            </table>

            {/* TABEL PENGGUNAAN RUANG & BATAS WILAYAH */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <table className="w-full border-collapse border border-black text-[10px]">
                <thead>
                  <tr className="bg-gray-100 font-bold">
                    <th className="border border-black px-2 py-0.5 text-left" colSpan={3}>PENGGUNAAN TATA GUNA LAHAN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Kawasan Pemukiman &amp; Perumahan</td>
                    <td className="border border-black px-2 py-0.5 text-right font-semibold">34,50 Ha</td>
                    <td className="border border-black px-2 py-0.5 text-right">71,80%</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Pertanian / Perkebunan Sayur &amp; Pangan</td>
                    <td className="border border-black px-2 py-0.5 text-right font-semibold">9,50 Ha</td>
                    <td className="border border-black px-2 py-0.5 text-right">19,77%</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Pekarangan Rumah &amp; Taman</td>
                    <td className="border border-black px-2 py-0.5 text-right font-semibold">4,00 Ha</td>
                    <td className="border border-black px-2 py-0.5 text-right">8,33%</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Lahan Tidur / Fasilitas Umum</td>
                    <td className="border border-black px-2 py-0.5 text-right font-semibold">0,05 Ha</td>
                    <td className="border border-black px-2 py-0.5 text-right">0,10%</td>
                  </tr>
                  <tr className="bg-gray-100 font-bold">
                    <td className="border border-black px-2 py-0.5">TOTAL KESELURUHAN</td>
                    <td className="border border-black px-2 py-0.5 text-right font-bold">48,05 Ha</td>
                    <td className="border border-black px-2 py-0.5 text-right font-bold">100%</td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full border-collapse border border-black text-[10px]">
                <thead>
                  <tr className="bg-gray-100 font-bold">
                    <th className="border border-black px-2 py-0.5 text-left" colSpan={2}>BATAS BATAS WILAYAH HUKUM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-1 font-bold w-28">Sebelah Utara</td>
                    <td className="border border-black px-2 py-1">Kelurahan Kamasi, Kec. Tomohon Tengah</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1 font-bold">Sebelah Timur</td>
                    <td className="border border-black px-2 py-1">Kelurahan Paslaten Satu, Kec. Tomohon Timur</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1 font-bold">Sebelah Selatan</td>
                    <td className="border border-black px-2 py-1">Kelurahan Kolongan, Kec. Tomohon Tengah</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1 font-bold">Sebelah Barat</td>
                    <td className="border border-black px-2 py-1">Kelurahan Kamasi Satu, Kec. Tomohon Tengah</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* BAGIAN II: REKAPITULASI KEPENDUDUKAN 5 JAGA */}
          <div className="mb-2">
            <h3 className="text-xs font-bold uppercase bg-gray-200 border border-black px-2 py-0.5 mb-1.5">
              II. REKAPITULASI KEPENDUDUKAN MENURUT 5 LINGKUNGAN (JAGA I - V)
            </h3>
            <table className="w-full border-collapse border border-black text-[10px]">
              <thead>
                <tr className="bg-gray-100 text-center font-bold">
                  <th className="border border-black px-1.5 py-1 w-8">NO</th>
                  <th className="border border-black px-2 py-1 text-left">WILAYAH / JAGA</th>
                  <th className="border border-black px-2 py-1 w-24">KEPALA KELUARGA (KK)</th>
                  <th className="border border-black px-2 py-1 w-20">LAKI-LAKI</th>
                  <th className="border border-black px-2 py-1 w-20">PEREMPUAN</th>
                  <th className="border border-black px-2 py-1 w-24">JUMLAH JIWA</th>
                  <th className="border border-black px-2 py-1 text-left">KEPALA LINGKUNGAN (PALA)</th>
                </tr>
              </thead>
              <tbody>
                {MONOGRAFI_2024.jaga.map((item, idx) => (
                  <tr key={item.id} className="text-center">
                    <td className="border border-black px-1.5 py-0.5">{idx + 1}</td>
                    <td className="border border-black px-2 py-0.5 text-left font-bold">{item.nama}</td>
                    <td className="border border-black px-2 py-0.5">{item.kk} KK</td>
                    <td className="border border-black px-2 py-0.5">{item.lakiLaki}</td>
                    <td className="border border-black px-2 py-0.5">{item.perempuan}</td>
                    <td className="border border-black px-2 py-0.5 font-bold">{item.populasi} Jiwa</td>
                    <td className="border border-black px-2 py-0.5 text-left">{item.pala}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100 text-center font-bold">
                  <td className="border border-black px-1.5 py-1" colSpan={2}>JUMLAH TOTAL</td>
                  <td className="border border-black px-2 py-1">540 KK</td>
                  <td className="border border-black px-2 py-1">725 Jiwa</td>
                  <td className="border border-black px-2 py-1">759 Jiwa</td>
                  <td className="border border-black px-2 py-1 font-black">1.484 JIWA</td>
                  <td className="border border-black px-2 py-1 text-left text-[9px]">Rasio Jenis Kelamin: 95,5 L per 100 P</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center text-[9px] text-gray-600 border-t border-gray-400 pt-1 mt-3">
            <span>Sistem Informasi Monografi Kelurahan Kolongan Satu</span>
            <span>Halaman 1 dari 3</span>
          </div>
        </div>

        {/* ==================== HALAMAN 2 DARI 3 ==================== */}
        <div className="page-break pt-4 pb-4">
          <div className="text-center border-b border-black pb-1 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5">
              LAMPIRAN II: BUKU LAPORAN MONOGRAFI KELURAHAN KOLONGAN SATU
            </h4>
            <p className="text-[10px] text-gray-700">Tabel Demografi Ketenagakerjaan, Pendidikan, dan Struktur Agama</p>
          </div>

          {/* BAGIAN III: STRUKTUR AGAMA & CACAT MENTAL/FISIK */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase bg-gray-200 border border-black px-2 py-0.5 mb-1">
                III. SEBARAN AGAMA &amp; ALIRAN KEPERCAYAAN
              </h3>
              <table className="w-full border-collapse border border-black text-[10px]">
                <thead>
                  <tr className="bg-gray-100 font-bold text-center">
                    <th className="border border-black px-2 py-0.5 text-left">AGAMA</th>
                    <th className="border border-black px-1 py-0.5 w-12">L</th>
                    <th className="border border-black px-1 py-0.5 w-12">P</th>
                    <th className="border border-black px-2 py-0.5 w-16">TOTAL</th>
                    <th className="border border-black px-1 py-0.5 w-12">%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-0.5 font-semibold">Katolik</td>
                    <td className="border border-black px-1 py-0.5 text-center">440</td>
                    <td className="border border-black px-1 py-0.5 text-center">491</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">931</td>
                    <td className="border border-black px-1 py-0.5 text-center">62,7%</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5 font-semibold">Kristen Protestan</td>
                    <td className="border border-black px-1 py-0.5 text-center">254</td>
                    <td className="border border-black px-1 py-0.5 text-center">250</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">504</td>
                    <td className="border border-black px-1 py-0.5 text-center">34,0%</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5 font-semibold">Islam</td>
                    <td className="border border-black px-1 py-0.5 text-center">31</td>
                    <td className="border border-black px-1 py-0.5 text-center">18</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">49</td>
                    <td className="border border-black px-1 py-0.5 text-center">3,3%</td>
                  </tr>
                  <tr className="bg-gray-100 font-bold text-center">
                    <td className="border border-black px-2 py-0.5 text-left">JUMLAH TOTAL</td>
                    <td className="border border-black px-1 py-0.5">725</td>
                    <td className="border border-black px-1 py-0.5">759</td>
                    <td className="border border-black px-2 py-0.5 font-black">1.484</td>
                    <td className="border border-black px-1 py-0.5">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase bg-gray-200 border border-black px-2 py-0.5 mb-1">
                DATA DISABILITAS &amp; BINAAN SOSIAL
              </h3>
              <table className="w-full border-collapse border border-black text-[10px]">
                <thead>
                  <tr className="bg-gray-100 font-bold text-center">
                    <th className="border border-black px-2 py-0.5 text-left">JENIS CACAT / DISABILITAS</th>
                    <th className="border border-black px-1 py-0.5 w-12">L</th>
                    <th className="border border-black px-1 py-0.5 w-12">P</th>
                    <th className="border border-black px-2 py-0.5 w-16">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Tuna Rungu</td>
                    <td className="border border-black px-1 py-0.5 text-center">-</td>
                    <td className="border border-black px-1 py-0.5 text-center">2</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">2 Jiwa</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Tuna Netra</td>
                    <td className="border border-black px-1 py-0.5 text-center">-</td>
                    <td className="border border-black px-1 py-0.5 text-center">1</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">1 Jiwa</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Lumpuh / Cacat Fisik</td>
                    <td className="border border-black px-1 py-0.5 text-center">1</td>
                    <td className="border border-black px-1 py-0.5 text-center">1</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">2 Jiwa</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Binaan Mental / Idiot</td>
                    <td className="border border-black px-1 py-0.5 text-center">2</td>
                    <td className="border border-black px-1 py-0.5 text-center">-</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">2 Jiwa</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Masalah Kejiwaan / Stress</td>
                    <td className="border border-black px-1 py-0.5 text-center">1</td>
                    <td className="border border-black px-1 py-0.5 text-center">2</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">3 Jiwa</td>
                  </tr>
                  <tr className="bg-gray-100 font-bold text-center">
                    <td className="border border-black px-2 py-0.5 text-left">TOTAL BINAAN KHUSUS</td>
                    <td className="border border-black px-1 py-0.5">4</td>
                    <td className="border border-black px-1 py-0.5">6</td>
                    <td className="border border-black px-2 py-0.5 font-black">10 JIWA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* BAGIAN IV: KELOMPOK UMUR & ANGKATAN KERJA */}
          <div className="mb-3">
            <h3 className="text-xs font-bold uppercase bg-gray-200 border border-black px-2 py-0.5 mb-1.5">
              IV. KETENAGAKERJAAN &amp; KELOMPOK UMUR PRODUKTIF
            </h3>
            <table className="w-full border-collapse border border-black text-[10px]">
              <thead>
                <tr className="bg-gray-100 font-bold text-center">
                  <th className="border border-black px-2 py-0.5 text-left">KATEGORI TENAGA KERJA / KELOMPOK UMUR</th>
                  <th className="border border-black px-2 py-0.5 w-24">LAKI-LAKI</th>
                  <th className="border border-black px-2 py-0.5 w-24">PEREMPUAN</th>
                  <th className="border border-black px-2 py-0.5 w-28">JUMLAH JIWA</th>
                  <th className="border border-black px-2 py-0.5 text-left">KETERANGAN REGISTER</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-2 py-0.5 font-bold">Penduduk Usia 18–56 Tahun Bekerja</td>
                  <td className="border border-black px-2 py-0.5 text-center">322 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">172 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold text-green-800">494 Jiwa</td>
                  <td className="border border-black px-2 py-0.5">Angkatan kerja aktif berkontribusi ekonomi</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-0.5 font-bold">Penduduk Usia 18–56 Thn Tdk Kerja / IRT</td>
                  <td className="border border-black px-2 py-0.5 text-center">114 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">268 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">382 Jiwa</td>
                  <td className="border border-black px-2 py-0.5">Mayoritas Ibu Rumah Tangga (IRT) &amp; pencari kerja</td>
                </tr>
                <tr className="bg-gray-50 font-semibold">
                  <td className="border border-black px-2 py-0.5 pl-4">Subtotal Usia Produktif (18–56 Tahun)</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">436 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">440 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">876 Jiwa</td>
                  <td className="border border-black px-2 py-0.5">59,03% dari total populasi kelurahan</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-0.5">Anak Usia 0 – 6 Tahun (Balita)</td>
                  <td className="border border-black px-2 py-0.5 text-center">56 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">53 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">109 Jiwa</td>
                  <td className="border border-black px-2 py-0.5">Sasaran program gizi Posyandu &amp; PAUD</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-0.5">Penduduk Usia 7 – 18 Tahun (Sekolah)</td>
                  <td className="border border-black px-2 py-0.5 text-center">113 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">109 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">222 Jiwa</td>
                  <td className="border border-black px-2 py-0.5">Wajib belajar 12 tahun (SD, SMP, SMA)</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-0.5">Penduduk Usia &gt; 56 Tahun (Lanjut Usia)</td>
                  <td className="border border-black px-2 py-0.5 text-center">120 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">157 Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">277 Jiwa</td>
                  <td className="border border-black px-2 py-0.5">Sasaran pemeriksaan Posyandu Lansia teratur</td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-black px-2 py-0.5">Buta Aksara Usia 18–56 Tahun</td>
                  <td className="border border-black px-2 py-0.5 text-center">0</td>
                  <td className="border border-black px-2 py-0.5 text-center">0</td>
                  <td className="border border-black px-2 py-0.5 text-center font-black">0 JIWA</td>
                  <td className="border border-black px-2 py-0.5 text-green-900">100% Bebas Buta Aksara (Melek Aksara Penuh)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BAGIAN V: TINGKAT PENDIDIKAN TERTINGGI */}
          <div className="mb-2">
            <h3 className="text-xs font-bold uppercase bg-gray-200 border border-black px-2 py-0.5 mb-1.5">
              V. TINGKAT KELULUSAN PENDIDIKAN FORMAL
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <table className="w-full border-collapse border border-black text-[10px]">
                <thead>
                  <tr className="bg-gray-100 font-bold text-center">
                    <th className="border border-black px-2 py-0.5 text-left">JENJANG PENDIDIKAN</th>
                    <th className="border border-black px-2 py-0.5 w-20">JUMLAH</th>
                    <th className="border border-black px-2 py-0.5 w-16">PERSENTASE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Tamat SMA / SMK / Sederajat</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">520 Jiwa</td>
                    <td className="border border-black px-2 py-0.5 text-center">50,7%</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Tamat Sarjana (D-4 / S-1)</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">212 Jiwa</td>
                    <td className="border border-black px-2 py-0.5 text-center">20,7%</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Tamat SMP / MTs / Sederajat</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">154 Jiwa</td>
                    <td className="border border-black px-2 py-0.5 text-center">15,0%</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Tamat SD / MI / Sederajat</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">78 Jiwa</td>
                    <td className="border border-black px-2 py-0.5 text-center">7,6%</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Tamat Diploma (D-1 s/d D-3)</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">50 Jiwa</td>
                    <td className="border border-black px-2 py-0.5 text-center">4,9%</td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full border-collapse border border-black text-[10px]">
                <thead>
                  <tr className="bg-gray-100 font-bold text-center">
                    <th className="border border-black px-2 py-0.5 text-left">JENJANG TINGGI &amp; INKLUSI</th>
                    <th className="border border-black px-2 py-0.5 w-20">JUMLAH</th>
                    <th className="border border-black px-2 py-0.5 w-16">PERSENTASE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Tamat Pascasarjana Magister (S-2)</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">8 Jiwa</td>
                    <td className="border border-black px-2 py-0.5 text-center">0,8%</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Tamat Pendidikan Doktor (S-3)</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">2 Jiwa</td>
                    <td className="border border-black px-2 py-0.5 text-center">0,2%</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5">Sekolah Luar Biasa (SLB C)</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">1 Jiwa</td>
                    <td className="border border-black px-2 py-0.5 text-center">0,1%</td>
                  </tr>
                  <tr className="bg-gray-100 font-bold">
                    <td className="border border-black px-2 py-0.5">TOTAL LULUSAN FORMAL</td>
                    <td className="border border-black px-2 py-0.5 text-center font-black">1.025 JIWA</td>
                    <td className="border border-black px-2 py-0.5 text-center font-bold">100%</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-0.5 italic text-[9px]" colSpan={3}>
                      * Lulusan terdistribusi aktif pada sektor pendidikan, medis, jasa swasta &amp; aparatur sipil negara.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center text-[9px] text-gray-600 border-t border-gray-400 pt-1 mt-3">
            <span>Sistem Informasi Monografi Kelurahan Kolongan Satu</span>
            <span>Halaman 2 dari 3</span>
          </div>
        </div>

        {/* ==================== HALAMAN 3 DARI 3 ==================== */}
        <div className="page-break pt-4 pb-4">
          <div className="text-center border-b border-black pb-1 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5">
              LAMPIRAN III: SARANA, PRASARANA, &amp; LEMBAR PENGESAHAN RESMI
            </h4>
            <p className="text-[10px] text-gray-700">Inventarisasi Fasilitas Publik, Kelembagaan, dan Validasi Legalitas Pemerintahan</p>
          </div>

          {/* BAGIAN VI: SARANA PRASARANA & INVENTARISASI */}
          <div className="mb-4">
            <h3 className="text-xs font-bold uppercase bg-gray-200 border border-black px-2 py-0.5 mb-1.5">
              VI. INVENTARISASI SARANA, PRASARANA &amp; LEMBAGA KEMASYARAKATAN
            </h3>
            <table className="w-full border-collapse border border-black text-[10px]">
              <thead>
                <tr className="bg-gray-100 font-bold text-center">
                  <th className="border border-black px-1.5 py-0.5 w-8">NO</th>
                  <th className="border border-black px-2 py-0.5 text-left">FASILITAS / SARANA PRASARANA</th>
                  <th className="border border-black px-2 py-0.5 w-40">VOLUME / KAPASITAS</th>
                  <th className="border border-black px-2 py-0.5 w-32">KONDISI FISIK</th>
                  <th className="border border-black px-2 py-0.5 text-left">KETERANGAN OPERASIONAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">1</td>
                  <td className="border border-black px-2 py-0.5 font-bold">Kantor Kelurahan Kolongan Satu</td>
                  <td className="border border-black px-2 py-0.5">1 Unit Gedung Utama (4 Ruangan)</td>
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
                  <td className="border border-black px-2 py-0.5">1 SD Negeri, 1 TK, 1 SLB C</td>
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
                  <td className="border border-black px-2 py-0.5">1 Truk DLH Pemkot Rutin</td>
                  <td className="border border-black px-2 py-0.5">Jadwal Harian</td>
                  <td className="border border-black px-2 py-0.5">100% ODF &amp; Pengangkutan sampah terjadwal</td>
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

    </section>
  );
}
