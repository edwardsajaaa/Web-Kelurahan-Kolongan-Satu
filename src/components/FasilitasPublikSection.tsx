'use client';

import React, { useState } from 'react';
import {
  Building2,
  Church,
  HeartPulse,
  GraduationCap,
  Zap,
  MapPin,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Landmark,
  HeartHandshake,
  Fuel,
  Coffee,
  CheckCircle2,
  Droplets,
  Waves,
  ShieldCheck,
} from 'lucide-react';

export interface FasilitasItem {
  id: string;
  name: string;
  category: 'pemerintahan' | 'ibadah' | 'kesehatan' | 'pendidikan' | 'infrastruktur' | 'sanitasi_air';
  categoryLabel: string;
  categoryColor: string;
  icon: any;
  jaga: string;
  alamat: string;
  deskripsi: string;
  status: string;
  gmapsUrl?: string;
}

export const FASILITAS_DATA: FasilitasItem[] = [
  // 1. Pemerintahan & Kelembagaan
  {
    id: 'kantor-kelurahan',
    name: 'Kantor Kelurahan Kolongan Satu',
    category: 'pemerintahan',
    categoryLabel: 'Pusat Pemerintahan',
    categoryColor: 'bg-[#cce5ff] text-[#006194]',
    icon: Building2,
    jaga: 'Jaga 2 (Sentral Administrasi)',
    alamat: 'Jl. Zanosui, Kelurahan Kolongan Satu',
    deskripsi: 'Pusat layanan administrasi kependudukan, pengurusan persuratan dinas, dan koordinasi aparatur 5 Jaga.',
    status: 'Permanen / Sangat Baik',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kantor+Kelurahan+Kolongan+Satu+Tomohon',
  },
  {
    id: 'lpka-tomohon',
    name: 'LPKA Kelas II Tomohon',
    category: 'pemerintahan',
    categoryLabel: 'Lembaga Pemasyarakatan Khusus Anak',
    categoryColor: 'bg-[#cce5ff] text-[#006194]',
    icon: Shield,
    jaga: 'Jaga 1 & 2',
    alamat: 'Jl. Kolongan Satu (Sebelah Lapas Perempuan)',
    deskripsi: 'Lembaga Pembinaan Khusus Anak di bawah naungan Kementerian Hukum dan HAM RI.',
    status: 'Aktif Operasional',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=LPKA+Kelas+II+Tomohon',
  },
  {
    id: 'lapas-perempuan',
    name: 'Lapas Perempuan Kelas IIB Manado',
    category: 'pemerintahan',
    categoryLabel: 'Lapas Perempuan',
    categoryColor: 'bg-[#cce5ff] text-[#006194]',
    icon: Building2,
    jaga: 'Jaga 2 (Wanua Atas)',
    alamat: 'Jl. Wanua Atas, Kolongan Satu',
    deskripsi: 'Lembaga Pemasyarakatan Perempuan Kelas IIB Manado yang berlokasi resmi di wilayah Kelurahan Kolongan Satu.',
    status: 'Aktif Operasional',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lapas+Perempuan+Kelas+IIB+Manado+Tomohon',
  },
  {
    id: 'kantor-walikota',
    name: 'Kawasan Kantor Walikota Tomohon',
    category: 'pemerintahan',
    categoryLabel: 'Pusat Pemerintahan Kota',
    categoryColor: 'bg-[#cce5ff] text-[#006194]',
    icon: Landmark,
    jaga: 'Jaga 4 (Sisi Barat)',
    alamat: 'Kawasan Jl. Sreko / Jl. Slanag',
    deskripsi: 'Kompleks pusat pemerintahan Kota Tomohon yang berbatasan langsung dengan koridor barat kelurahan.',
    status: 'Pusat Pemerintahan',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kantor+Walikota+Tomohon',
  },

  // 2. Sarana Ibadah
  {
    id: 'gmim-elohim',
    name: 'GMIM Elohim Kolongan 1',
    category: 'ibadah',
    categoryLabel: 'Gereja Protestan (GMIM)',
    categoryColor: 'bg-[#d3e4fe] text-[#004b73]',
    icon: Church,
    jaga: 'Jaga 2 & 3',
    alamat: 'Jl. Zanosui (Seberang WINS Dental)',
    deskripsi: 'Gedung gereja GMIM Elohim sebagai pusat peribadatan jemaat protestan terbesar di kelurahan.',
    status: 'Pelayanan Aktif',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=GMIM+Elohim+Kolongan+1+Tomohon',
  },
  {
    id: 'aula-st-petrus',
    name: 'Aula St. Petrus & Stasi Katolik',
    category: 'ibadah',
    categoryLabel: 'Sarana Ibadah & Gedung Serbaguna',
    categoryColor: 'bg-[#d3e4fe] text-[#004b73]',
    icon: Church,
    jaga: 'Jaga 1',
    alamat: 'Jl. P.L. Kaunang, Kolongan Satu',
    deskripsi: 'Gedung pertemuan dan stasi peribadatan jemaat Katolik untuk pembinaan rohani dan kemasyarakatan.',
    status: 'Pelayanan Aktif',
    gmapsUrl: 'https://www.google.com/maps?q=1.3178446908697126,124.8356077027369',
  },
  {
    id: 'christianos-edelweiss',
    name: 'Christianos Tomohon',
    category: 'ibadah',
    categoryLabel: 'Sarana Peribadatan Jemaat',
    categoryColor: 'bg-[#d3e4fe] text-[#004b73]',
    icon: Church,
    jaga: 'Jaga 1 (Edelweiss)',
    alamat: 'Kawasan Edelweiss, Koridor Timur Laut',
    deskripsi: 'Gedung peribadatan dan persekutuan komunitas kristiani di koridor timur laut kelurahan.',
    status: 'Pelayanan Aktif',
    gmapsUrl: 'https://www.google.com/maps?q=1.318251254526585,124.83430548951661',
  },

  // 3. Kesehatan & Olahraga
  {
    id: 'wins-dental',
    name: 'Klinik WINS Dental',
    category: 'kesehatan',
    categoryLabel: 'Layanan Kesehatan Gigi',
    categoryColor: 'bg-[#6cf8bb]/40 text-[#005236]',
    icon: HeartPulse,
    jaga: 'Jaga 2',
    alamat: 'Jl. Zanosui (Depan GMIM Elohim)',
    deskripsi: 'Klinik praktek perawatan dan estetika kesehatan gigi modern untuk warga Kolongan Satu dan sekitarnya.',
    status: 'Buka Setiap Hari Kerja',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=WINS+dental+Tomohon',
  },
  {
    id: 'pustu-kolongan',
    name: 'Puskesmas Pembantu (Pustu)',
    category: 'kesehatan',
    categoryLabel: 'Fasilitas Kesehatan Tingkat Pertama',
    categoryColor: 'bg-[#6cf8bb]/40 text-[#005236]',
    icon: HeartPulse,
    jaga: 'Jaga 2',
    alamat: 'Kompleks Pemukiman Kolongan Satu',
    deskripsi: 'Layanan pertolongan pertama, imunisasi, rawat jalan dasar, dan penyuluhan kesehatan warga.',
    status: 'Tersedia / Rutin',
  },
  {
    id: 'posyandu-terpadu',
    name: 'Posyandu Mandiri Balita & Lansia (2 Unit)',
    category: 'kesehatan',
    categoryLabel: 'Kesehatan Masyarakat',
    categoryColor: 'bg-[#6cf8bb]/40 text-[#005236]',
    icon: HeartPulse,
    jaga: 'Tersebar di 5 Lingkungan',
    alamat: 'Pos Pelayanan Terpadu Lingkungan',
    deskripsi: 'Pemeriksaan tensi rutin lansia, pemantauan kurva nutrisi anak, penimbangan balita, dan vitamin.',
    status: 'Jadwal Bulanan Teratur',
  },

  // 4. Pendidikan & Sosial
  {
    id: 'slb-kolongan',
    name: 'SLB (Sekolah Luar Biasa) Kolongan',
    category: 'pendidikan',
    categoryLabel: 'Pendidikan Inklusif Khusus',
    categoryColor: 'bg-[#ffeed9] text-[#9c4300]',
    icon: GraduationCap,
    jaga: 'Jaga 1',
    alamat: 'Kawasan Pendidikan Khusus, Kolongan Satu',
    deskripsi: 'Sekolah Luar Biasa untuk pembinaan, bimbingan, dan pembelajaran akademik anak berkebutuhan khusus.',
    status: 'Berjalan Aktif',
    gmapsUrl: 'https://www.google.com/maps?q=1.31817340191659,124.83542167227685',
  },
  {
    id: 'panti-asuhan-tuna-grahita',
    name: 'Panti Asuhan Tuna Grahita',
    category: 'pendidikan',
    categoryLabel: 'Layanan Sosial & Asuhan',
    categoryColor: 'bg-[#ffeed9] text-[#9c4300]',
    icon: HeartHandshake,
    jaga: 'Jaga 1',
    alamat: 'Kawasan Pelayanan Sosial Kolongan Satu',
    deskripsi: 'Panti asuhan dan tempat bimbingan sosial mandiri bagi penyandang tuna grahita dengan penuh kasih sayang.',
    status: 'Pelayanan Sosial Terbuka',
    gmapsUrl: 'https://www.google.com/maps?q=1.318664254262629,124.83538978661507',
  },

  // 5. Energi, Infrastruktur & Niaga
  {
    id: 'geothermal-lahendong',
    name: 'Pertamina Geothermal Energy (Area Lahendong)',
    category: 'infrastruktur',
    categoryLabel: 'Energi Terbarukan Panas Bumi',
    categoryColor: 'bg-[#e2e7ff] text-[#004b73]',
    icon: Zap,
    jaga: 'Jaga 5 (Ujung Selatan)',
    alamat: 'Kawasan Panas Bumi Lahendong, Kolongan Satu',
    deskripsi: 'Fasilitas strategis pemanfaatan energi ramah lingkungan panas bumi (geothermal) untuk ketahanan listrik regional.',
    status: 'Objek Vital Nasional',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pertamina+Geothermal+Energy+Lahendong+Tomohon',
  },
  {
    id: 'spbu-pertamina',
    name: 'SPBU Pertamina 74.953.13',
    category: 'infrastruktur',
    categoryLabel: 'Stasiun Pengisian Bahan Bakar',
    categoryColor: 'bg-[#e2e7ff] text-[#004b73]',
    icon: Fuel,
    jaga: 'Jaga 5 (Tenggara)',
    alamat: 'Batas Tenggara Wilayah Kolongan Satu',
    deskripsi: 'Stasiun pengisian bahan bakar resmi untuk melayani mobilitas kendaraan warga dan pelintas jalan raya.',
    status: 'Operasional 24 Jam',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=SPBU+74.953.13+Tomohon',
  },
  {
    id: 'renao-bakeshop',
    name: 'Renao Bakeshop & Eatery',
    category: 'infrastruktur',
    categoryLabel: 'Sentra Kuliner & Bakery',
    categoryColor: 'bg-[#e2e7ff] text-[#004b73]',
    icon: Coffee,
    jaga: 'Jaga 4 (Dekat Kantor Walikota)',
    alamat: 'Jl. Zanosui / Jl. Sreko, Kolongan Satu',
    deskripsi: 'Usaha kuliner roti modern dan tempat pertemuan warga di sudut barat koridor Jl. Zanosui.',
    status: 'Buka Setiap Hari',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Renao+Bakeshop+Tomohon',
  },

  // 6. Sanitasi Lingkungan & Sumber Daya Air
  {
    id: 'mata-air-alami',
    name: '14 Titik Mata Air Alami Vulkanik',
    category: 'sanitasi_air',
    categoryLabel: 'Sumber Daya Air Alami',
    categoryColor: 'bg-[#d0f0fd] text-[#006194]',
    icon: Droplets,
    jaga: 'Tersebar di Jaga 1 s/d 5',
    alamat: 'Koridor lereng & resapan alami Kolongan Satu',
    deskripsi: 'Sebaran 14 titik mata air vulkanik alami dengan debit stabil dan jernih yang menjadi sumber vital air bersih warga.',
    status: 'Debit Terjaga & Terawat',
  },
  {
    id: 'sumur-pompa-mandiri',
    name: '380 Unit Sumur Pompa & Gali Mandiri',
    category: 'sanitasi_air',
    categoryLabel: 'Air Bersih Rumah Tangga',
    categoryColor: 'bg-[#d0f0fd] text-[#006194]',
    icon: Droplets,
    jaga: 'Wilayah Lingkungan I – V',
    alamat: 'Area pemukiman 5 Lingkungan Jaga',
    deskripsi: 'Sumur pompa dan sumur gali keluarga yang dirawat berkala dengan kualitas air tanah higienis dan tidak berbau.',
    status: '380 Unit Berfungsi Normal',
  },
  {
    id: 'jaringan-pdam',
    name: 'Jaringan Perpipaan Air PDAM (160 Rumah)',
    category: 'sanitasi_air',
    categoryLabel: 'Infrastruktur Air Bersih',
    categoryColor: 'bg-[#d0f0fd] text-[#006194]',
    icon: Waves,
    jaga: 'Jaga 1, 2, 3, 4, 5',
    alamat: 'Jaringan pipa transmisi PDAM Kota Tomohon',
    deskripsi: 'Suplai air bersih terdistribusi ke 160 sambungan rumah melalui kemitraan PDAM Tomohon dan PAM Kelurahan.',
    status: 'Distribusi Lancar',
  },
  {
    id: 'sanitasi-odf-paripurna',
    name: 'Sanitasi Total & Sertifikasi 100% ODF',
    category: 'sanitasi_air',
    categoryLabel: 'Sanitasi & Jamban Sehat',
    categoryColor: 'bg-[#6cf8bb]/40 text-[#005236]',
    icon: ShieldCheck,
    jaga: '550 Kepala Keluarga (100% KK)',
    alamat: 'Seluruh Wilayah Kelurahan Kolongan Satu',
    deskripsi: 'Status Paripurna Bebas Buang Air Besar Sembarangan (Open Defecation Free) dengan 100% jamban sehat keluarga dan tangki septik aman.',
    status: '100% ODF Paripurna',
  },
  {
    id: 'drainase-dan-sungai',
    name: 'Saluran Drainase 3.200 M & Aliran Sungai',
    category: 'sanitasi_air',
    categoryLabel: 'Drainase & Pengendali Banjir',
    categoryColor: 'bg-[#d0f0fd] text-[#006194]',
    icon: Waves,
    jaga: 'Koridor Utama 5 Jaga',
    alamat: 'Sepanjang jalan penghubung & batas alam',
    deskripsi: 'Jaringan saluran drainase permanen sepanjang 3,2 km terhubung dengan aliran sungai alami sebagai resapan dan pencegah genangan air.',
    status: 'Kondisi Baik & Terawat',
  },
];

interface FasilitasPublikSectionProps {
  onDirectToMap?: () => void;
}

export default function FasilitasPublikSection({ onDirectToMap }: FasilitasPublikSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua Fasilitas', icon: Layers, count: FASILITAS_DATA.length },
    { id: 'pemerintahan', label: 'Pemerintahan', icon: Building2, count: 4 },
    { id: 'ibadah', label: 'Sarana Ibadah', icon: Church, count: 3 },
    { id: 'kesehatan', label: 'Kesehatan', icon: HeartPulse, count: 3 },
    { id: 'pendidikan', label: 'Pendidikan & Sosial', icon: GraduationCap, count: 2 },
    { id: 'infrastruktur', label: 'Energi & Niaga', icon: Zap, count: 3 },
    { id: 'sanitasi_air', label: 'Sanitasi & Sumber Air', icon: Droplets, count: 5 },
  ];

  const filteredData = activeTab === 'all'
    ? FASILITAS_DATA
    : FASILITAS_DATA.filter((item) => item.category === activeTab);

  const handleGoToMap = () => {
    if (onDirectToMap) {
      onDirectToMap();
    }
  };

  return (
    <section
      id="fasilitas-wilayah"
      className="w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 mb-12 2xl:mb-16 scroll-mt-24 no-print"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-10 2xl:p-14 shadow-sm border border-[#e2e7ff] space-y-8 2xl:space-y-10">
        {/* ============================================================ */}
        {/* SECTION HEADER                                               */}
        {/* ============================================================ */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-[#eaedff]">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl 2xl:text-4xl text-[#131b2e] font-bold tracking-tight">
              Fasilitas &amp; Sarana Publik Kelurahan
            </h2>
          </div>

          <a
            href="#peta-wilayah"
            onClick={handleGoToMap}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#006194] hover:bg-[#004f7a] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md shrink-0 self-start lg:self-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-sky-200" />
            <span>Lihat Semua di Peta 3D</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* ============================================================ */}
        {/* QUICK STATS SUMMARY BANNER (6 STATS PILLARS)                 */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff] flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#cce5ff] text-[#006194] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-[#131b2e] block leading-tight">4 Unit</span>
              <span className="text-[11px] text-[#535f70] font-medium block">Pemerintahan</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff] flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#d3e4fe] text-[#004b73] flex items-center justify-center shrink-0">
              <Church className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-[#131b2e] block leading-tight">3 Unit</span>
              <span className="text-[11px] text-[#535f70] font-medium block">Sarana Ibadah</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff] flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#6cf8bb]/40 text-[#005236] flex items-center justify-center shrink-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-[#131b2e] block leading-tight">3 Unit</span>
              <span className="text-[11px] text-[#535f70] font-medium block">Pustu &amp; Posyandu</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff] flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#ffeed9] text-[#9c4300] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-[#131b2e] block leading-tight">2 Unit</span>
              <span className="text-[11px] text-[#535f70] font-medium block">SLB &amp; Panti</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff] flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#004b73] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-[#131b2e] block leading-tight">3 Unit</span>
              <span className="text-[11px] text-[#535f70] font-medium block">Geothermal &amp; Energi</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff] flex items-center gap-3 shadow-2xs col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-[#d0f0fd] text-[#006194] flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-[#131b2e] block leading-tight">14 Titik &amp; ODF</span>
              <span className="text-[11px] text-[#535f70] font-medium block">Sanitasi &amp; Air Bersih</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CATEGORY FILTER PILL TABS                                    */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const IconC = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#006194] text-white shadow-xs'
                    : 'bg-[#f2f3ff] text-[#3f4850] hover:bg-[#e2e7ff] hover:text-[#006194]'
                }`}
              >
                <IconC className="w-4 h-4" />
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-white text-[#535f70]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* FACILITIES GRID CARDS                                        */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredData.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                className="bg-[#faf8ff] hover:bg-white rounded-2xl p-5 2xl:p-6 border border-[#eaedff] hover:border-[#006194]/40 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  {/* Top Category Badge & Icon */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] 2xl:text-xs font-bold ${item.categoryColor}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>{item.categoryLabel}</span>
                    </span>

                    <div className="w-8 h-8 rounded-xl bg-white text-[#006194] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Facility Name & Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#131b2e] group-hover:text-[#006194] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#535f70] mt-1.5 leading-relaxed line-clamp-3">
                      {item.deskripsi}
                    </p>
                  </div>

                  {/* Location & Status Info */}
                  <div className="space-y-1.5 pt-2 text-[11px] 2xl:text-xs text-[#535f70]">
                    <div className="flex items-center gap-1.5 text-[#006194] font-medium">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.jaga}</span>
                    </div>
                    <div className="text-[#707881] truncate pl-5">
                      {item.alamat}
                    </div>
                  </div>
                </div>

                {/* Footer Strip with Action Links */}
                <div className="pt-3.5 mt-4 border-t border-[#eaedff] flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006c49]">
                    <CheckCircle2 className="w-3 h-3 text-[#006c49]" />
                    <span>{item.status}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href="#peta-wilayah"
                      onClick={handleGoToMap}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006194] hover:text-[#004f7a] bg-white hover:bg-[#cce5ff]/50 px-2.5 py-1 rounded-full border border-[#eaedff] transition-all cursor-pointer"
                      title="Lihat titik di Peta 3D"
                    >
                      <span>Peta 3D</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>

                    {item.gmapsUrl && (
                      <a
                        href={item.gmapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-[#535f70] hover:text-[#006194] border border-[#eaedff] hover:bg-[#f2f3ff] transition-colors"
                        title="Buka Google Maps"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* INFRASTRUKTUR SANITASI & SUMBER DAYA AIR BANNER              */}
        {/* ============================================================ */}
        <div className="bg-gradient-to-br from-[#faf8ff] via-[#f0f4ff] to-[#e8f2ff] rounded-3xl p-6 sm:p-8 2xl:p-10 border border-[#dae2fd] shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#dae2fd]/70 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#cce5ff] text-[#006194]">
                <Droplets className="w-3.5 h-3.5" />
                <span>Ketahanan Lingkungan Hidup &amp; Air Bersih</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-[#131b2e]">
                Sarana Sanitasi Lingkungan &amp; Sumber Daya Air Kolongan Satu
              </h3>
              <p className="text-xs sm:text-sm text-[#535f70] max-w-3xl leading-relaxed">
                Kelurahan Kolongan Satu dianugerahi berkah geografis lereng pegunungan dengan limpahan mata air alami, sistem drainase terpadu, dan pencapaian 100% ODF (Open Defecation Free) mandiri.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#6cf8bb]/40 text-[#005236] text-xs font-bold border border-[#6cf8bb]">
                <ShieldCheck className="w-4 h-4 text-[#006c49]" />
                <span>100% ODF Terverifikasi</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4.5 rounded-2xl border border-[#dae2fd] shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#006194] flex items-center justify-between">
                <span>Mata Air Alami</span>
                <Droplets className="w-4 h-4 text-[#006194]" />
              </div>
              <div className="text-2xl font-black text-[#131b2e] mt-1.5">14 Titik</div>
              <p className="text-xs text-[#535f70] mt-1">Debit stabil pegunungan vulkanik di Jaga 1–5</p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#dae2fd] shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#006194] flex items-center justify-between">
                <span>Sumur Pompa Warga</span>
                <Droplets className="w-4 h-4 text-[#006194]" />
              </div>
              <div className="text-2xl font-black text-[#131b2e] mt-1.5">380 Unit</div>
              <p className="text-xs text-[#535f70] mt-1">Sumur pompa &amp; gali higienis bebas bau</p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#dae2fd] shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#006194] flex items-center justify-between">
                <span>Sambungan PDAM</span>
                <Waves className="w-4 h-4 text-[#006194]" />
              </div>
              <div className="text-2xl font-black text-[#131b2e] mt-1.5">160 Rumah</div>
              <p className="text-xs text-[#535f70] mt-1">Jaringan transmisi teratur PDAM Tomohon</p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#dae2fd] shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#006194] flex items-center justify-between">
                <span>Saluran Drainase</span>
                <Waves className="w-4 h-4 text-[#006194]" />
              </div>
              <div className="text-2xl font-black text-[#131b2e] mt-1.5">3.200 Meter</div>
              <p className="text-xs text-[#535f70] mt-1">Saluran permanen pencegah genangan &amp; banjir</p>
            </div>
          </div>

          <div className="p-4 bg-white/80 rounded-2xl border border-[#dae2fd] text-xs text-[#535f70] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#006c49] shrink-0" />
              <span>
                <strong>Sistem Sanitasi Ramah Lingkungan:</strong> Seluruh 550 Kepala Keluarga telah memiliki jamban keluarga sehat bersekat dan tangki septik permanen (Zero BABS). Pengangkutan sampah dikoordinasikan rutin bersama Dinas Lingkungan Hidup Kota Tomohon.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
