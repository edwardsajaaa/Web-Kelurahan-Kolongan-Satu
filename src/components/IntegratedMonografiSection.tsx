'use client';

import React, { useState } from 'react';
import { DATA_MONOGRAFI_2024 } from '@/data/monografi2024';
import { DATA_MONOGRAFI_2025 } from '@/data/monografi2025';
import { AvailableYear, CURRENT_ACTIVE_YEAR } from '@/data';

interface IntegratedMonografiSectionProps {
  selectedYear?: AvailableYear | number;
  onYearChange?: (year: AvailableYear | number) => void;
  liveSummary?: any;
  availableYears?: number[];
}

export default function IntegratedMonografiSection({
  selectedYear: externalYear,
  onYearChange: externalOnYearChange,
  liveSummary,
  availableYears,
}: IntegratedMonografiSectionProps) {
  const [internalYear, setInternalYear] = useState<number>(CURRENT_ACTIVE_YEAR);
  const activeYear = (externalYear ?? internalYear) as number;

  const availableYearsList = availableYears && availableYears.length > 0 ? availableYears : [2024, 2025];

  const handleYearToggle = (year: number) => {
    setInternalYear(year);
    if (externalOnYearChange) {
      externalOnYearChange(year as any);
    }
  };

  const [activeCategory, setActiveCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    demografi: true,
    pendidikan: true,
    ekonomi: true,
    fasilitas: true,
    kelembagaan: true,
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
  const showPendidikan = (activeCategory === 'semua' || activeCategory === 'pendidikan') && matchesSearch('tenaga kerja umur angkatan balita lansia buta aksara sma smk s1 s2 s3 sd smp slb diploma guru murid rasio');
  const showEkonomi = (activeCategory === 'semua' || activeCategory === 'ekonomi') && matchesSearch('ekonomi pekerjaan pns wiraswasta petani bumn umkm warung toko bbm las cukur unggas ayam babi sapi ternak fides monstera wins etsuko alfamart perawat');
  const showFasilitas = (activeCategory === 'semua' || activeCategory === 'fasilitas') && matchesSearch('fasilitas ibadah gmim katolik elohim gsjk kristus kristianus kesehatan pustu posyandu dokter apotek sekolah sd tk perpustakaan jalan jembatan ojek bendi sampah sanitasi odf olahraga badminton basket volly');
  const showKelembagaan = (activeCategory === 'semua' || activeCategory === 'kelembagaan') && matchesSearch('kelembagaan linmas babinsa bhabinkamtibmas pkk lpm karang taruna parpol golkar pdip demokrat gerindra kantor inventaris lemari komputer buku');

  // Dynamic values depending on active year (2025 vs 2024 vs liveSummary)
  const is2025 = activeYear === 2025;
  const currentTotalJiwa = liveSummary?.totalPenduduk ?? (is2025 ? DATA_MONOGRAFI_2025.kependudukan.total_jiwa : DATA_MONOGRAFI_2024.demografi.totalPenduduk);
  const currentTotalKK = liveSummary?.kepalaKeluarga ?? (is2025 ? DATA_MONOGRAFI_2025.kependudukan.total_kk : DATA_MONOGRAFI_2024.demografi.kepalaKeluarga);
  const currentPria = liveSummary?.lakiLaki ?? (is2025 ? DATA_MONOGRAFI_2025.kependudukan.laki_laki : DATA_MONOGRAFI_2024.demografi.lakiLaki);
  const currentWanita = liveSummary?.perempuan ?? (is2025 ? DATA_MONOGRAFI_2025.kependudukan.perempuan : DATA_MONOGRAFI_2024.demografi.perempuan);
  const currentLuasHa = liveSummary?.luasTotalHa ?? (is2025 ? DATA_MONOGRAFI_2025.wilayah.luas_total_ha : DATA_MONOGRAFI_2024.geografis.luasTotalHa);

  const currentKatolik = is2025 ? DATA_MONOGRAFI_2025.keagamaan.katolik : 931;
  const currentProtestan = is2025 ? DATA_MONOGRAFI_2025.keagamaan.protestan : 504;
  const currentIslam = is2025 ? DATA_MONOGRAFI_2025.keagamaan.islam : 49;

  // Jaga distribution
  const jagaList = is2025
    ? [
        { id: 'jaga-1', nama: 'Lingkungan I (Jaga 1)', kk: 315, lakiLaki: 153, perempuan: 162, populasi: 315, pala: 'Jilly Turambi' },
        { id: 'jaga-2', nama: 'Lingkungan II (Jaga 2)', kk: 292, lakiLaki: 141, perempuan: 151, populasi: 292, pala: 'Robert Goni' },
        { id: 'jaga-3', nama: 'Lingkungan III (Jaga 3)', kk: 301, lakiLaki: 145, perempuan: 156, populasi: 301, pala: 'Meidy Supit' },
        { id: 'jaga-4', nama: 'Lingkungan IV (Jaga 4)', kk: 308, lakiLaki: 149, perempuan: 159, populasi: 308, pala: 'Frits Pangalila' },
        { id: 'jaga-5', nama: 'Lingkungan V (Jaga 5)', kk: 296, lakiLaki: 142, perempuan: 154, populasi: 296, pala: 'Steven Wowor' },
      ]
    : [
        { id: 'jaga-1', nama: 'Lingkungan I (Jaga 1)', kk: 105, lakiLaki: 150, perempuan: 160, populasi: 310, pala: 'Jilly Turambi' },
        { id: 'jaga-2', nama: 'Lingkungan II (Jaga 2)', kk: 108, lakiLaki: 140, perempuan: 145, populasi: 285, pala: 'Robert Goni' },
        { id: 'jaga-3', nama: 'Lingkungan III (Jaga 3)', kk: 112, lakiLaki: 145, perempuan: 150, populasi: 295, pala: 'Meidy Supit' },
        { id: 'jaga-4', nama: 'Lingkungan IV (Jaga 4)', kk: 107, lakiLaki: 148, perempuan: 156, populasi: 304, pala: 'Frits Pangalila' },
        { id: 'jaga-5', nama: 'Lingkungan V (Jaga 5)', kk: 108, lakiLaki: 142, perempuan: 148, populasi: 290, pala: 'Steven Wowor' },
      ];

  return (
    <section id="monografi-wilayah" className="w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 mb-16 2xl:mb-20 scroll-mt-24">
      
      {/* ============================================================ */}
      {/* 1. SECTION HEADER (Harmonized with Landing Page Aesthetic)   */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-5 border-b border-[#e2e7ff] gap-4 no-print">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl sm:text-3xl 2xl:text-4xl text-[#131b2e] font-bold tracking-tight">
              Monografi Kelurahan {activeYear}
            </h2>

            {/* Year Selector */}
            <div className="inline-flex items-center bg-[#f2f3ff] p-1 rounded-full border border-[#dae2fd]">
              {availableYearsList.map((yr) => (
                <button
                  key={yr}
                  onClick={() => handleYearToggle(yr)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeYear === yr
                      ? 'bg-[#006194] text-white shadow-xs'
                      : 'text-[#535f70] hover:text-[#131b2e]'
                  }`}
                >
                  {yr} {yr === Math.max(...availableYearsList) ? '(Terbaru)' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-[#006194] hover:bg-[#007bb9] text-white px-5 2xl:px-7 py-2.5 2xl:py-3.5 rounded-full text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Cetak Laporan Resmi ({activeYear})</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. INTERACTIVE CONTROLS: DROPDOWN, TABS & PENCARIAN          */}
      {/* ============================================================ */}
      <div className="mb-8 space-y-4 no-print">
        {/* Top Filter Bar: Mobile Dropdown + Search Input + Year Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#e2e7ff] shadow-xs">
          {/* Dropdown Selector for Fast Category Jumps */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <label htmlFor="category-select" className="text-xs font-bold text-[#131b2e] whitespace-nowrap flex items-center gap-1">
              <span className="material-symbols-outlined text-[#006194] text-[18px]">filter_list</span>
              <span>Kategori:</span>
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
              placeholder="Cari variabel (misal: katolik, fides, guru, linmas, pustu, alfamart)..."
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
                    1. Demografi, 5 Lingkungan Jaga &amp; Aliran Kepercayaan ({activeYear})
                  </h3>
                  <p className="text-xs text-[#3f4850]">
                    Register kependudukan, struktur teritorial Pala I–V, sebaran agama, dan data warga binaan khusus.
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
                      {currentTotalJiwa.toLocaleString('id-ID')} <span className="text-xs font-normal text-[#3f4850]">Jiwa</span>
                    </span>
                    <span className="text-[11px] text-[#006194] font-medium mt-1 block">
                      {currentPria} L ({((currentPria / currentTotalJiwa) * 100).toFixed(1)}%) &bull; {currentWanita} P ({((currentWanita / currentTotalJiwa) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="bg-[#f2f3ff]/80 p-4 2xl:p-5 rounded-2xl border border-[#dae2fd]">
                    <span className="text-xs text-[#3f4850] font-semibold block">Kepala Keluarga (KK)</span>
                    <span className="text-2xl 2xl:text-3xl font-bold text-[#131b2e] mt-1 block">
                      {currentTotalKK.toLocaleString('id-ID')} <span className="text-xs font-normal text-[#3f4850]">KK</span>
                    </span>
                    <span className="text-[11px] text-[#006c49] font-medium mt-1 block">
                      {is2025 ? 'Hak Pilih: 1.245 Jiwa' : 'Rata-rata 2,75 jiwa/KK'}
                    </span>
                  </div>
                  <div className="bg-[#f2f3ff]/80 p-4 2xl:p-5 rounded-2xl border border-[#dae2fd]">
                    <span className="text-xs text-[#3f4850] font-semibold block">Luas Wilayah Total</span>
                    <span className="text-2xl 2xl:text-3xl font-bold text-[#131b2e] mt-1 block">
                      {currentLuasHa.toLocaleString('id-ID')} <span className="text-xs font-normal text-[#3f4850]">Ha</span>
                    </span>
                    <span className="text-[11px] text-[#3f4850] font-medium mt-1 block">
                      {is2025 ? 'Tanah Kering 185,75 Ha' : '34,5 Ha Pemukiman (71,8%)'}
                    </span>
                  </div>
                  <div className="bg-[#f2f3ff]/80 p-4 2xl:p-5 rounded-2xl border border-[#dae2fd]">
                    <span className="text-xs text-[#3f4850] font-semibold block">Topografi / Sanitasi</span>
                    <span className="text-2xl 2xl:text-3xl font-bold text-[#006c49] mt-1 block">
                      {is2025 ? '23°C' : '95,5 Ratio'}
                    </span>
                    <span className="text-[11px] text-[#006c49] font-medium mt-1 block">
                      {is2025 ? '700 - 900 mdpl (Subur)' : '100% Sanitasi Sehat ODF'}
                    </span>
                  </div>
                </div>

                {/* Batas Wilayah Card (Terbaru 2025 vs 2024) */}
                <div className="p-4 bg-[#faf8ff] rounded-2xl border border-[#e2e7ff]">
                  <span className="font-bold text-xs sm:text-sm text-[#131b2e] block mb-2">
                    Batas Administratif Wilayah Hukum ({activeYear})
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-[#eaedff]">
                      <span className="text-[#3f4850] font-semibold block text-[11px]">Sebelah Utara:</span>
                      <strong className="text-[#131b2e]">{is2025 ? 'Kelurahan Kolongan' : 'Kelurahan Kamasi'}</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-[#eaedff]">
                      <span className="text-[#3f4850] font-semibold block text-[11px]">Sebelah Timur:</span>
                      <strong className="text-[#131b2e]">{is2025 ? 'Kel. Walian / Matani Tiga' : 'Kel. Paslaten Satu'}</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-[#eaedff]">
                      <span className="text-[#3f4850] font-semibold block text-[11px]">Sebelah Selatan:</span>
                      <strong className="text-[#131b2e]">{is2025 ? 'Kelurahan Lansot' : 'Kelurahan Kolongan'}</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-[#eaedff]">
                      <span className="text-[#3f4850] font-semibold block text-[11px]">Sebelah Barat:</span>
                      <strong className="text-[#131b2e]">{is2025 ? 'Kelurahan Lansot' : 'Kelurahan Kamasi Satu'}</strong>
                    </div>
                  </div>
                </div>

                {/* Tabel Detail 5 Lingkungan Jaga */}
                <div className="bg-white rounded-xl border border-[#eaedff] overflow-hidden">
                  <div className="px-4 py-3 bg-[#f2f3ff] border-b border-[#eaedff] flex justify-between items-center">
                    <span className="font-bold text-xs sm:text-sm text-[#131b2e]">
                      Rekapitulasi 5 Wilayah Lingkungan (Jaga I s/d Jaga V) - Data {activeYear}
                    </span>
                    <span className="text-[11px] bg-white px-2.5 py-0.5 rounded-full text-[#006194] font-semibold border border-[#dae2fd]">
                      5 Pala &bull; Terverifikasi
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
                        {jagaList.map((jg) => (
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
                          <td className="py-3 px-3 text-center">{currentTotalKK} KK</td>
                          <td className="py-3 px-3 text-center">{currentPria} Jiwa</td>
                          <td className="py-3 px-3 text-center">{currentWanita} Jiwa</td>
                          <td className="py-3 px-3 text-center text-[#006194]">{currentTotalJiwa.toLocaleString('id-ID')} Jiwa</td>
                          <td className="py-3 px-3 text-[#006c49]">
                            {is2025 ? 'Hak Pilih: 1.245 Pemilih' : 'Tersebar rata di 5 Lingkungan'}
                          </td>
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
                      <span>Agama &amp; Aliran Kepercayaan ({activeYear})</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                        <div>
                          <span className="font-bold text-[#131b2e] block">Katolik</span>
                          <span className="text-[11px] text-[#3f4850]">
                            {is2025 ? 'Sebaran 5 Jaga' : 'L: 440 &bull; P: 491'}
                          </span>
                        </div>
                        <span className="font-bold text-sm text-[#006194]">
                          {currentKatolik} Jiwa ({((currentKatolik / currentTotalJiwa) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                        <div>
                          <span className="font-bold text-[#131b2e] block">Kristen Protestan (GMIM)</span>
                          <span className="text-[11px] text-[#3f4850]">
                            {is2025 ? 'Jemaat Aktif' : 'L: 254 &bull; P: 250'}
                          </span>
                        </div>
                        <span className="font-bold text-sm text-[#006194]">
                          {currentProtestan} Jiwa ({((currentProtestan / currentTotalJiwa) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                        <div>
                          <span className="font-bold text-[#131b2e] block">Islam</span>
                          <span className="text-[11px] text-[#3f4850]">
                            {is2025 ? 'Warga Mukim' : 'L: 31 &bull; P: 18'}
                          </span>
                        </div>
                        <span className="font-bold text-sm text-[#131b2e]">
                          {currentIslam} Jiwa ({((currentIslam / currentTotalJiwa) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cacat Fisik & Mental atau Sarana Ibadah 2025 */}
                  <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd]">
                    <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#006c49] text-[18px]">
                        {is2025 ? 'church' : 'accessible'}
                      </span>
                      <span>{is2025 ? 'Gedung Gereja & Sarana Peribadatan (2025)' : 'Data Cacat Fisik & Mental (Binaan Sosial)'}</span>
                    </h4>
                    {is2025 ? (
                      <div className="space-y-2 text-xs">
                        {DATA_MONOGRAFI_2025.keagamaan.sarana_ibadah.map((g, idx) => (
                          <div key={idx} className="p-2 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                            <span className="font-medium text-[#131b2e]">{g}</span>
                            <span className="text-[#006c49] font-bold text-[11px]">Aktif Melayani</span>
                          </div>
                        ))}
                        <p className="text-[11px] text-[#3f4850] italic pt-1">
                          * Kerukunan antar-umat beragama terjalin harmonis di bawah naungan Badan Kerjasama Antar Umat Beragama (BKSAUA).
                        </p>
                      </div>
                    ) : (
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
                    )}
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
                    2. Tenaga Kerja, Kelompok Umur &amp; Pendidikan ({activeYear})
                  </h3>
                  <p className="text-xs text-[#3f4850]">
                    {is2025
                      ? 'Distribusi kelompok usia, rasio guru dan murid tiap jenjang, serta ijazah formal tahun 2025.'
                      : 'Komposisi angkatan kerja produktif, anak sekolah, lansia, melek aksara, serta jenjang ijazah resmi.'}
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
                {/* Kolom Kiri: Kelompok Umur */}
                <div className="space-y-2.5 text-xs">
                  <span className="font-bold text-sm text-[#131b2e] block mb-2">
                    Distribusi Kelompok Usia &amp; Angkatan ({activeYear})
                  </span>
                  {is2025 ? (
                    <>
                      <div className="p-3 bg-[#f2f3ff] rounded-xl flex justify-between items-center border border-[#eaedff]">
                        <div>
                          <span className="font-bold text-[#131b2e] block">Usia Produktif (18–56 Tahun)</span>
                          <span className="text-[11px] text-[#3f4850]">Angkatan Kerja Aktif</span>
                        </div>
                        <span className="text-base font-bold text-[#006c49]">864 Jiwa</span>
                      </div>
                      <div className="p-3 bg-[#f2f3ff] rounded-xl flex justify-between items-center border border-[#eaedff]">
                        <div>
                          <span className="font-bold text-[#131b2e] block">Usia Sekolah (7–18 Tahun)</span>
                          <span className="text-[11px] text-[#3f4850]">Wajib Belajar 12 Tahun</span>
                        </div>
                        <span className="text-base font-bold text-[#006194]">247 Jiwa</span>
                      </div>
                      <div className="p-3 bg-[#f2f3ff] rounded-xl flex justify-between items-center border border-[#eaedff]">
                        <div>
                          <span className="font-bold text-[#131b2e] block">Anak Balita (0–6 Tahun)</span>
                          <span className="text-[11px] text-[#3f4850]">Prasekolah &amp; Posyandu</span>
                        </div>
                        <span className="text-base font-bold text-[#006194]">121 Jiwa</span>
                      </div>
                      <div className="p-3 bg-[#f2f3ff] rounded-xl flex justify-between items-center border border-[#eaedff]">
                        <div>
                          <span className="font-bold text-[#131b2e] block">Lanjut Usia (&gt; 56 Tahun)</span>
                          <span className="text-[11px] text-[#3f4850]">Warga Senior Terawat</span>
                        </div>
                        <span className="text-base font-bold text-[#131b2e]">280 Jiwa</span>
                      </div>
                      <div className="p-3 bg-[#cce5ff]/50 rounded-xl flex justify-between items-center font-bold text-[#006194]">
                        <span>Hak Pilih Pemilu:</span>
                        <span>1.245 Jiwa</span>
                      </div>
                    </>
                  ) : (
                    <>
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
                      <div className="p-3 bg-[#f2f3ff] rounded-xl flex justify-between items-center border border-[#eaedff]">
                        <div>
                          <span className="font-bold text-[#131b2e] block">Anak Balita (Usia 0–6 Tahun)</span>
                          <span className="text-[11px] text-[#3f4850]">L: 56 &bull; P: 53</span>
                        </div>
                        <span className="text-base font-bold text-[#006194]">109 Jiwa</span>
                      </div>
                      <div className="p-3 bg-[#f2f3ff] rounded-xl flex justify-between items-center border border-[#eaedff]">
                        <div>
                          <span className="font-bold text-[#131b2e] block">Usia Sekolah (7–18 Tahun)</span>
                          <span className="text-[11px] text-[#3f4850]">L: 113 &bull; P: 109</span>
                        </div>
                        <span className="text-base font-bold text-[#006194]">222 Jiwa</span>
                      </div>
                      <div className="p-3 bg-[#f2f3ff] rounded-xl flex justify-between items-center border border-[#eaedff]">
                        <div>
                          <span className="font-bold text-[#131b2e] block">Penduduk Usia &gt; 56 Tahun (Lansia)</span>
                          <span className="text-[11px] text-[#3f4850]">L: 120 &bull; P: 157</span>
                        </div>
                        <span className="text-base font-bold text-[#131b2e]">277 Jiwa</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Kolom Kanan: Tingkat Kelulusan / Rasio Guru Murid */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-sm text-[#131b2e] block mb-2">
                    {is2025 ? 'Tingkat Kelulusan & Rasio Guru-Murid (2025)' : 'Tingkat Kelulusan Ijazah Pendidikan Formal (2024)'}
                  </span>
                  {is2025 ? (
                    <>
                      {/* Rasio Guru-Murid Table */}
                      <div className="bg-[#faf8ff] p-3 rounded-xl border border-[#eaedff] mb-2">
                        <span className="font-bold text-[#006194] block mb-1 text-[11px]">Rasio Guru &amp; Murid 2025:</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {DATA_MONOGRAFI_2025.pendidikan.rasio_guru_murid.map((r, i) => (
                            <div key={i} className="bg-white p-2 rounded-lg border border-[#eaedff]">
                              <span className="font-bold text-[#131b2e]">{r.jenjang}: </span>
                              <span className="text-[#3f4850]">{r.guru} Guru &bull; {r.murid} Murid</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {[
                        { jenjang: 'Tamat SMA / SMK', jml: '421 Jiwa (190 L, 231 P)', color: 'text-[#006194]' },
                        { jenjang: 'Tamat Sarjana S-1', jml: '175 Jiwa (76 L, 99 P)', color: 'text-[#006c49]' },
                        { jenjang: 'Tamat SMP / MTs', jml: '179 Jiwa (96 L, 83 P)', color: 'text-[#131b2e]' },
                        { jenjang: 'Tamat SD / Sederajat', jml: '70 Jiwa (35 L, 35 P)', color: 'text-[#131b2e]' },
                        { jenjang: 'Tamat Diploma (D2 & D3)', jml: '49 Jiwa (13 D2, 36 D3)', color: 'text-[#4d5d73]' },
                        { jenjang: 'Tamat Pascasarjana (S2 & S3)', jml: '24 Jiwa (22 S2, 2 S3)', color: 'text-[#006194]' },
                        { jenjang: 'Tamat SLB', jml: '1 Jiwa', color: 'text-[#006c49]' },
                      ].map((edu, idx) => (
                        <div key={idx} className="p-2 bg-[#f2f3ff] rounded-xl flex justify-between items-center border border-[#eaedff]">
                          <span className="font-medium text-[#131b2e]">{edu.jenjang}</span>
                          <span className={`font-bold ${edu.color}`}>{edu.jml}</span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
                    3. Mata Pencaharian, Potensi UMKM &amp; Sentra Bisnis ({activeYear})
                  </h3>
                  <p className="text-xs text-[#3f4850]">
                    {is2025
                      ? 'Sektor profesi dominan dan 9 tempat usaha terkemuka yang menggerakkan perekonomian kelurahan.'
                      : 'Pekerjaan dominan warga, sebaran unit usaha perdagangan, industri rumahan, dan populasi ternak.'}
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
                {/* 1. Sektor Dominan / Pekerjaan */}
                <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd]">
                  <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006194] text-[18px]">work</span>
                    <span>{is2025 ? 'Sektor Profesi Dominan (2025)' : 'Mata Pencaharian (2024)'}</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {is2025 ? (
                      DATA_MONOGRAFI_2025.ekonomi_dan_umkm.sektor_dominan.map((s, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                          <span className="font-semibold text-[#131b2e]">{s}</span>
                          <span className="text-[#006c49] font-bold text-[11px]">&bull; Aktif</span>
                        </div>
                      ))
                    ) : (
                      [
                        { job: 'Karyawan Swasta / BUMN', val: '146 Jiwa' },
                        { job: 'Wiraswasta / Pedagang', val: '94 Jiwa' },
                        { job: 'Petani & Perkebunan', val: '82 Jiwa' },
                        { job: 'PNS / TNI / Polri', val: '68 Jiwa' },
                        { job: 'Tukang Besi, Kayu & Bangunan', val: '45 Jiwa' },
                        { job: 'Pensiunan PNS / TNI / BUMN', val: '38 Jiwa' },
                        { job: 'Pelajar / Mahasiswa', val: '195 Jiwa' },
                        { job: 'Mengurus Rumah Tangga (IRT)', val: '215 Jiwa' },
                      ].map((p, i) => (
                        <div key={i} className="p-2 bg-white rounded-lg flex justify-between items-center border border-[#eaedff]">
                          <span className="text-[#3f4850]">{p.job}</span>
                          <span className="font-bold text-[#131b2e]">{p.val}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. Tempat Usaha / UMKM */}
                <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd] md:col-span-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">shopping_bag</span>
                    <span>{is2025 ? 'Sentra Bisnis & Tempat Usaha Terkemuka (2025)' : 'Unit Usaha Perdagangan & UMKM (2024)'}</span>
                  </h4>
                  {is2025 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                      {DATA_MONOGRAFI_2025.ekonomi_dan_umkm.tempat_usaha.map((u, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-[#eaedff] flex items-center gap-2 hover:border-[#006194] transition-all">
                          <span className="w-2 h-2 rounded-full bg-[#006194]"></span>
                          <span className="font-bold text-[#131b2e]">{u}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Warung Kelontong / Sembako</span>
                        <span className="font-bold text-[#006194]">19 Unit</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Toko / Kios Permanen</span>
                        <span className="font-bold text-[#006194]">2 Unit</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Pangkalan Gas LPG &amp; BBM</span>
                        <span className="font-bold text-[#006194]">4 Unit</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Koperasi Simpan Pinjam</span>
                        <span className="font-bold text-[#006c49]">1 Unit (Aktif)</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Peternakan Unggas &amp; Babi</span>
                        <span className="font-bold text-[#131b2e]">1.825 Ekor</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between border border-[#eaedff]">
                        <span>Grup Kesenian / Paduan Suara</span>
                        <span className="font-bold text-[#006194]">2 Kelompok</span>
                      </div>
                    </div>
                  )}
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
                    4. Sarana Publik, Kesehatan &amp; Olahraga ({activeYear})
                  </h3>
                  <p className="text-xs text-[#3f4850]">
                    Ketersediaan fisik gedung peribadatan, posyandu, pustu, gedung sekolah, sanitasi, dan akses olahraga.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Sarana Olahraga */}
                <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd] space-y-2 text-xs">
                  <span className="font-bold text-[#006194] uppercase tracking-wider block text-[11px]">
                    Sarana Olahraga
                  </span>
                  {is2025 ? (
                    <div className="p-3 bg-white rounded-xl border border-[#eaedff] space-y-2">
                      <p className="font-bold text-[#131b2e] leading-relaxed">
                        {DATA_MONOGRAFI_2025.sarana_publik.olahraga}
                      </p>
                      <span className="inline-block text-[11px] bg-[#cce5ff] text-[#006194] px-2.5 py-0.5 rounded-full font-semibold">
                        Total 6 Lapangan Terawat
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 bg-white rounded-xl border border-[#eaedff]">
                      <span className="font-bold text-[#131b2e]">Lapangan Voli &amp; Sepak Bola: 1 Unit</span>
                    </div>
                  )}
                </div>

                {/* 2. Kesehatan Masyarakat */}
                <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd] space-y-2 text-xs">
                  <span className="font-bold text-[#006c49] uppercase tracking-wider block text-[11px]">
                    Kesehatan Warga
                  </span>
                  <div className="p-3 bg-white rounded-xl border border-[#eaedff] space-y-1.5">
                    <p className="font-bold text-[#131b2e] leading-relaxed">
                      {is2025 ? DATA_MONOGRAFI_2025.sarana_publik.kesehatan : '1 Puskesmas Pembantu, 2 Posyandu, 3 Dokter, 1 Apotek'}
                    </p>
                    <span className="inline-block text-[11px] bg-[#6cf8bb]/30 text-[#006c49] px-2.5 py-0.5 rounded-full font-semibold">
                      Pelayanan Aktif Rutin
                    </span>
                  </div>
                </div>

                {/* 3. Kebersihan & Lingkungan */}
                <div className="p-4 bg-[#f2f3ff]/60 rounded-xl border border-[#dae2fd] space-y-2 text-xs">
                  <span className="font-bold text-[#4d5d73] uppercase tracking-wider block text-[11px]">
                    Kebersihan &amp; Sanitasi
                  </span>
                  <div className="p-3 bg-white rounded-xl border border-[#eaedff] space-y-1.5">
                    <p className="font-bold text-[#131b2e] leading-relaxed">
                      {is2025 ? DATA_MONOGRAFI_2025.sarana_publik.kebersihan : 'Armada Truk DLH Pemkot Tomohon Rutin, 100% ODF'}
                    </p>
                    <span className="inline-block text-[11px] bg-[#faf8ff] text-[#4d5d73] px-2.5 py-0.5 rounded-full font-semibold border border-[#eaedff]">
                      Jadwal Harian 5 Jaga
                    </span>
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
                        <span>Gedung Kantor Kelurahan</span>
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
            <span>Dokumen Teknis Resmi 3 Halaman Siap Cetak (Tahun {activeYear})</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#131b2e]">
            Cetak &amp; Unduh Laporan Monografi Resmi (Format A4)
          </h3>
          <p className="text-xs sm:text-sm text-[#3f4850] leading-relaxed">
            Format laporan administrasi baku pemerintahan Kota Tomohon untuk Tahun {activeYear} (Kop Surat resmi, register 5 Jaga, rekapitulasi demografi, fasilitas, dan lembar pengesahan tanda tangan Lurah &amp; Seklur).
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#006c49] font-medium">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">check_circle</span> Standar A4 Portrait
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">check_circle</span> Data Resmi {activeYear}
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
            <span>Cetak / Unduh PDF ({activeYear})</span>
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
              TAHUN ANGGARAN {activeYear}
            </p>
          </div>

          {/* BAGIAN I: DATA UMUM WILAYAH & GEOGRAFIS */}
          <div className="mb-4">
            <h3 className="text-xs font-bold uppercase bg-gray-200 border border-black px-2 py-0.5 mb-1.5">
              I. DATA UMUM &amp; BATAS ADMINISTRASI KELURAHAN ({activeYear})
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
                  <td className="border border-black px-2 py-1 font-bold">{currentLuasHa.toLocaleString('id-ID')} Hektar (Ha)</td>
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
                    <th className="border border-black px-2 py-0.5 text-left" colSpan={2}>PENGGUNAAN TATA GUNA LAHAN</th>
                  </tr>
                </thead>
                <tbody>
                  {is2025 ? (
                    <>
                      <tr>
                        <td className="border border-black px-2 py-0.5">Tanah Kering / Kebun</td>
                        <td className="border border-black px-2 py-0.5 text-right font-semibold">185,75 Ha</td>
                      </tr>
                      <tr>
                        <td className="border border-black px-2 py-0.5">Kawasan Pemukiman</td>
                        <td className="border border-black px-2 py-0.5 text-right font-semibold">34,50 Ha</td>
                      </tr>
                      <tr>
                        <td className="border border-black px-2 py-0.5">Pertanian / Perkebunan</td>
                        <td className="border border-black px-2 py-0.5 text-right font-semibold">9,50 Ha</td>
                      </tr>
                      <tr>
                        <td className="border border-black px-2 py-0.5">Fasilitas Umum &amp; Sawah</td>
                        <td className="border border-black px-2 py-0.5 text-right font-semibold">12,50 Ha</td>
                      </tr>
                      <tr className="bg-gray-100 font-bold">
                        <td className="border border-black px-2 py-0.5">TOTAL LUAS WILAYAH</td>
                        <td className="border border-black px-2 py-0.5 text-right font-bold">208,25 Ha</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td className="border border-black px-2 py-0.5">Kawasan Pemukiman</td>
                        <td className="border border-black px-2 py-0.5 text-right font-semibold">34,50 Ha (71,8%)</td>
                      </tr>
                      <tr>
                        <td className="border border-black px-2 py-0.5">Pertanian / Perkebunan</td>
                        <td className="border border-black px-2 py-0.5 text-right font-semibold">9,50 Ha (19,8%)</td>
                      </tr>
                      <tr>
                        <td className="border border-black px-2 py-0.5">Pekarangan &amp; Lahan Tidur</td>
                        <td className="border border-black px-2 py-0.5 text-right font-semibold">4,05 Ha (8,4%)</td>
                      </tr>
                      <tr className="bg-gray-100 font-bold">
                        <td className="border border-black px-2 py-0.5">TOTAL KESELURUHAN</td>
                        <td className="border border-black px-2 py-0.5 text-right font-bold">48,05 Ha</td>
                      </tr>
                    </>
                  )}
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
                    <td className="border border-black px-2 py-1">{is2025 ? 'Kelurahan Kolongan' : 'Kelurahan Kamasi'}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1 font-bold">Sebelah Timur</td>
                    <td className="border border-black px-2 py-1">{is2025 ? 'Kelurahan Walian / Matani Tiga' : 'Kelurahan Paslaten Satu'}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1 font-bold">Sebelah Selatan</td>
                    <td className="border border-black px-2 py-1">{is2025 ? 'Kelurahan Lansot' : 'Kelurahan Kolongan'}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1 font-bold">Sebelah Barat</td>
                    <td className="border border-black px-2 py-1">{is2025 ? 'Kelurahan Lansot' : 'Kelurahan Kamasi Satu'}</td>
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
                  <th className="border border-black px-2 py-1 w-24">KEPALA KELUARGA</th>
                  <th className="border border-black px-2 py-1 w-20">LAKI-LAKI</th>
                  <th className="border border-black px-2 py-1 w-20">PEREMPUAN</th>
                  <th className="border border-black px-2 py-1 w-24">JUMLAH JIWA</th>
                  <th className="border border-black px-2 py-1 text-left">KEPALA LINGKUNGAN (PALA)</th>
                </tr>
              </thead>
              <tbody>
                {jagaList.map((item, idx) => (
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
                  <td className="border border-black px-2 py-1">{currentTotalKK} KK</td>
                  <td className="border border-black px-2 py-1">{currentPria} Jiwa</td>
                  <td className="border border-black px-2 py-1">{currentWanita} Jiwa</td>
                  <td className="border border-black px-2 py-1 font-black">{currentTotalJiwa.toLocaleString('id-ID')} JIWA</td>
                  <td className="border border-black px-2 py-1 text-left text-[9px]">
                    {is2025 ? 'Hak Pilih Pemilu: 1.245 Pemilih' : 'Rasio Jenis Kelamin: 95,5 L per 100 P'}
                  </td>
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
              LAMPIRAN II: BUKU LAPORAN MONOGRAFI KELURAHAN KOLONGAN SATU ({activeYear})
            </h4>
            <p className="text-[10px] text-gray-700">Tabel Demografi Ketenagakerjaan, Pendidikan, dan Struktur Agama</p>
          </div>

          {/* BAGIAN III: STRUKTUR AGAMA */}
          <div className="mb-3">
            <h3 className="text-xs font-bold uppercase bg-gray-200 border border-black px-2 py-0.5 mb-1">
              III. SEBARAN AGAMA &amp; ALIRAN KEPERCAYAAN
            </h3>
            <table className="w-full border-collapse border border-black text-[10px]">
              <thead>
                <tr className="bg-gray-100 font-bold text-center">
                  <th className="border border-black px-2 py-0.5 text-left">AGAMA</th>
                  <th className="border border-black px-2 py-0.5 w-24">JUMLAH JIWA</th>
                  <th className="border border-black px-2 py-0.5 w-20">PERSENTASE</th>
                  <th className="border border-black px-2 py-0.5 text-left">SARANA IBADAH</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-2 py-0.5 font-semibold">Katolik</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">{currentKatolik} Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">{((currentKatolik / currentTotalJiwa) * 100).toFixed(1)}%</td>
                  <td className="border border-black px-2 py-0.5">Gedung Gereja Katolik Terpadu</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-0.5 font-semibold">Kristen Protestan</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">{currentProtestan} Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">{((currentProtestan / currentTotalJiwa) * 100).toFixed(1)}%</td>
                  <td className="border border-black px-2 py-0.5">Gedung Gereja GMIM Elohim, GSJK, Kristus A</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-0.5 font-semibold">Islam</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">{currentIslam} Jiwa</td>
                  <td className="border border-black px-2 py-0.5 text-center">{((currentIslam / currentTotalJiwa) * 100).toFixed(1)}%</td>
                  <td className="border border-black px-2 py-0.5">Musholla / Masjid Wilayah Terdekat</td>
                </tr>
                <tr className="bg-gray-100 font-bold text-center">
                  <td className="border border-black px-2 py-0.5 text-left">JUMLAH TOTAL</td>
                  <td className="border border-black px-2 py-0.5 font-black">{currentTotalJiwa.toLocaleString('id-ID')} JIWA</td>
                  <td className="border border-black px-2 py-0.5">100%</td>
                  <td className="border border-black px-2 py-0.5 text-left text-[9px]">Harmoni kerukunan terjaga</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BAGIAN IV: KELOMPOK UMUR */}
          <div className="mb-3">
            <h3 className="text-xs font-bold uppercase bg-gray-200 border border-black px-2 py-0.5 mb-1.5">
              IV. KELOMPOK UMUR &amp; DISTRIBUSI PENDUDUK
            </h3>
            <table className="w-full border-collapse border border-black text-[10px]">
              <thead>
                <tr className="bg-gray-100 font-bold text-center">
                  <th className="border border-black px-2 py-0.5 text-left">KELOMPOK USIA</th>
                  <th className="border border-black px-2 py-0.5 w-28">JUMLAH JIWA</th>
                  <th className="border border-black px-2 py-0.5 text-left">KETERANGAN &amp; PROGRAM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-2 py-0.5 font-bold">Usia Produktif (18–56 Tahun)</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold text-green-800">
                    {is2025 ? '864 Jiwa' : '876 Jiwa'}
                  </td>
                  <td className="border border-black px-2 py-0.5">Angkatan kerja utama perekonomian</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-0.5">Usia Sekolah (7–18 Tahun)</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">
                    {is2025 ? '247 Jiwa' : '222 Jiwa'}
                  </td>
                  <td className="border border-black px-2 py-0.5">Wajib belajar 12 tahun SD, SMP, SMA</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-0.5">Balita (0–6 Tahun)</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">
                    {is2025 ? '121 Jiwa' : '109 Jiwa'}
                  </td>
                  <td className="border border-black px-2 py-0.5">Sasaran gizi Posyandu &amp; imunisasi</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-0.5">Lanjut Usia (&gt; 56 Tahun)</td>
                  <td className="border border-black px-2 py-0.5 text-center font-bold">
                    {is2025 ? '280 Jiwa' : '277 Jiwa'}
                  </td>
                  <td className="border border-black px-2 py-0.5">Pelayanan Posyandu Lansia teratur</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center text-[9px] text-gray-600 border-t border-gray-400 pt-1 mt-3">
            <span>Sistem Informasi Monografi Kelurahan Kolongan Satu</span>
            <span>Halaman 2 dari 3</span>
          </div>
        </div>

        {/* ==================== HALAMAN 3 DARI 3 ==================== */}
        <div className="pt-4 pb-4">
          <div className="text-center border-b border-black pb-1 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5">
              LAMPIRAN III: SARANA, PRASARANA, &amp; LEMBAR PENGESAHAN RESMI ({activeYear})
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
                  <th className="border border-black px-2 py-0.5 text-left">KETERANGAN OPERASIONAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">1</td>
                  <td className="border border-black px-2 py-0.5 font-bold">Kantor Kelurahan Kolongan Satu</td>
                  <td className="border border-black px-2 py-0.5">1 Unit Gedung Utama</td>
                  <td className="border border-black px-2 py-0.5">Pusat pelayanan administrasi &amp; rapat warga</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">2</td>
                  <td className="border border-black px-2 py-0.5">Keamanan Linmas &amp; Kamtibmas</td>
                  <td className="border border-black px-2 py-0.5">12 Anggota Linmas, 2 Babinsa</td>
                  <td className="border border-black px-2 py-0.5">Siaga Aktif dan patroli lingkungan</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">3</td>
                  <td className="border border-black px-2 py-0.5">Sarana Olahraga Publik</td>
                  <td className="border border-black px-2 py-0.5">{is2025 ? '6 Lapangan' : '1 Lapangan'}</td>
                  <td className="border border-black px-2 py-0.5">{is2025 ? '2 Badminton, 2 Volly, 2 Basket' : 'Voli dan sepak bola'}</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">4</td>
                  <td className="border border-black px-2 py-0.5">Kesehatan (Posyandu &amp; Pustu)</td>
                  <td className="border border-black px-2 py-0.5">1 Pustu, Gedung Posyandu, Praktek Dokter</td>
                  <td className="border border-black px-2 py-0.5">Pemeriksaan kesehatan balita, lansia &amp; obat</td>
                </tr>
                <tr>
                  <td className="border border-black px-1.5 py-0.5 text-center">5</td>
                  <td className="border border-black px-2 py-0.5">Kebersihan &amp; Persampahan</td>
                  <td className="border border-black px-2 py-0.5">Petugas Rutin DLH Pemkot</td>
                  <td className="border border-black px-2 py-0.5">Pengangkutan sampah terjadwal seluruh Jaga</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BAGIAN VII: LEMBAR PENGESAHAN DOKUMEN RESMI (LEGALITAS LURAH) */}
          <div className="border border-black p-3 bg-gray-50/50 mb-3">
            <h3 className="text-[11px] font-bold uppercase text-center underline tracking-wider mb-2">
              LEMBAR PENGESAHAN &amp; PENETAPAN DOKUMEN MONOGRAFI RESMI TAHUN {activeYear}
            </h3>
            <p className="text-[10px] text-justify leading-relaxed mb-4">
              Demikian Buku Laporan Monografi Kelurahan Kolongan Satu, Kecamatan Tomohon Tengah, Kota Tomohon Tahun Anggaran {activeYear} ini disusun secara faktual berdasarkan register buku induk kependudukan, pemetaan batas ruang wilayah, dan rekapitulasi potensi kemasyarakatan terkini. Dokumen ini disahkan sebagai rujukan resmi perencanaan pembangunan, transparansi publik, dan pelayanan administrasi pemerintahan daerah.
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
                <p className="mb-0">Tahun Anggaran: {activeYear}</p>
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
