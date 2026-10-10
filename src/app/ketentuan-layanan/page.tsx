'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  Scale,
  Printer,
  Download,
  Gavel,
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  MapPin,
  Mail,
  Clock,
  MessageCircle,
  Building2,
  Home,
  UserCheck,
  Phone,
  FileBadge,
  ChevronRight,
  LogIn,
  FileCheck2,
  HandCoins,
  ShieldAlert
} from 'lucide-react';

export default function KetentuanLayananPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col antialiased">
      {/* ============================================================ */}
      {/* 1. TOP NAVIGATION BAR                                        */}
      {/* ============================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eaedff] no-print">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left Brand with Crest Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-1 bg-[#f2f3ff] rounded-full shadow-xs shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/images/logo-tomohon.png"
                alt="Lambang Kelurahan Kolongan Satu"
                width={40}
                height={40}
                className="w-10 h-10 object-contain rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[16px] text-[#131b2e] font-bold tracking-tight leading-tight group-hover:text-[#006194] transition-colors">
                Kelurahan Kolongan Satu
              </span>
              <span className="text-[11px] text-[#3f4850] font-medium tracking-wide">
                Kecamatan Tomohon Tengah, Kota Tomohon
              </span>
            </div>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm text-[#3f4850] hover:text-[#006194] font-medium transition-colors">
              Beranda
            </Link>
            <Link href="/#profil-wilayah" className="text-sm text-[#3f4850] hover:text-[#006194] font-medium transition-colors">
              Profil & Sejarah
            </Link>
            <Link href="/#monografi-wilayah" className="text-sm text-[#3f4850] hover:text-[#006194] font-medium transition-colors">
              Monografi
            </Link>
            <Link href="/#layanan-publik" className="text-sm text-[#3f4850] hover:text-[#006194] font-medium transition-colors">
              Layanan Publik
            </Link>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center">
            <Link
              href="/portal/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#006194] bg-white hover:bg-[#eaedff] border border-[#dae2fd] px-4 py-2 rounded-full shadow-xs hover:shadow-sm transition-all duration-300"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN PAGE CONTENT                                         */}
      {/* ============================================================ */}
      <main className="w-full pt-24 sm:pt-28 pb-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 no-print">
            <ol className="flex items-center space-x-2 text-xs font-medium text-[#3f4850]">
              <li>
                <Link href="/" className="hover:text-[#006194] transition-colors flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" />
                  <span>Beranda</span>
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5 text-[#bfc7d2]" />
              </li>
              <li aria-current="page" className="text-[#006194] font-semibold">
                {activeTab === 'terms' ? 'Ketentuan Layanan Portal Digital' : 'Kebijakan Privasi & Perlindungan Data'}
              </li>
            </ol>
          </nav>

          {/* HERO HEADER SECTION */}
          <section className="relative w-full overflow-hidden rounded-3xl bg-white border border-[#eaedff] p-6 sm:p-8 lg:p-10 shadow-sm mb-8">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-[#006194]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-3xl space-y-3">
                {/* Badge / Pill */}
                <div className="inline-flex items-center gap-2 bg-[#cce5ff]/50 border border-[#93ccff] px-3.5 py-1 rounded-full text-[#004b73] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
                  <span>Portal Resmi Pelayanan Publik</span>
                  <span className="text-[#93ccff]">•</span>
                  <span>Standar Operasional Prosedur (SOP) Kelurahan</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#131b2e] font-extrabold tracking-tight leading-tight">
                  {activeTab === 'terms' ? 'Ketentuan Layanan Portal Digital' : 'Kebijakan Privasi & Perlindungan Data'}
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-[#3f4850] leading-relaxed max-w-2xl">
                  {activeTab === 'terms'
                    ? 'Pedoman hak, kewajiban, tata tertib pemanfaatan portal pelayanan publik dan administrasi kependudukan Kelurahan Kolongan Satu, Kota Tomohon.'
                    : 'Komitmen keterbukaan, keamanan data kependudukan, dan hak privasi warga Kelurahan Kolongan Satu, Kota Tomohon.'}
                </p>
              </div>

              {/* Quick Actions & Metadata Pill */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-center gap-3 shrink-0 no-print">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-[#3f4850] bg-[#f2f3ff] px-3.5 py-1.5 rounded-full border border-[#eaedff]">
                  <span className="w-2 h-2 rounded-full bg-[#006c49]"></span>
                  <span>Berlaku efektif: <strong className="text-[#131b2e]">Tahun 2025/2026</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    type="button"
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-[#f2f3ff] border border-[#dae2fd] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#006194] shadow-xs hover:shadow transition-all duration-200 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-[#006194]" />
                    <span>Cetak Dokumen</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    type="button"
                    className="inline-flex items-center gap-1.5 bg-[#006194] hover:bg-[#004b73] text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all duration-200 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>Unduh PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Switcher Navigation */}
            <div className="mt-8 pt-6 border-t border-[#eaedff] flex flex-wrap items-center justify-between gap-3 no-print">
              <div className="inline-flex items-center p-1 bg-[#f2f3ff] rounded-2xl border border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setActiveTab('terms')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'terms'
                      ? 'bg-white text-[#006194] shadow-xs'
                      : 'text-[#3f4850] hover:text-[#131b2e]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Ketentuan Layanan</span>
                </button>
                <Link
                  href="/kebijakan-privasi"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all text-[#3f4850] hover:text-[#131b2e]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kebijakan Privasi</span>
                </Link>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-[#3f4850]">
                <Gavel className="w-4 h-4 text-[#006c49]" />
                <span>Kepatuhan Standar Pelayanan Publik Ombudsman & Pemkot Tomohon</span>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 3. 3 SERVICE GUARANTEE FEATURE CARDS                         */}
          {/* ============================================================ */}
          <section aria-labelledby="guarantee-heading" className="mb-8">
            <h2 className="sr-only" id="guarantee-heading">Prinsip Pelayanan Publik</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Card 1 */}
              <div className="bg-white border border-[#eaedff] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
                <div className="p-3 bg-[#cce5ff]/60 text-[#006194] rounded-2xl shrink-0">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#131b2e]">
                    Keabsahan Dokumen Resmi
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3f4850] mt-1 leading-relaxed">
                    Setiap surat yang diterbitkan memiliki Nomor Registrasi Sah &amp; legalisir resmi pejabat berwenang.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-[#eaedff] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
                <div className="p-3 bg-[#6cf8bb]/30 text-[#006c49] rounded-2xl shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#131b2e]">
                    Standar Waktu Verifikasi (SOP)
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3f4850] mt-1 leading-relaxed">
                    Verifikasi berkas diproses maksimal 1×24 jam pada hari dinas kerja (Senin–Jumat, 08.00–16.00 WITA).
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-[#eaedff] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
                <div className="p-3 bg-[#d3e4fe]/70 text-[#4d5d73] rounded-2xl shrink-0">
                  <HandCoins className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#131b2e]">
                    Bebas Biaya (Gratis 100%)
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3f4850] mt-1 leading-relaxed">
                    Seluruh pelayanan persuratan publik tidak dipungut biaya apapun (Anti-Pungli &amp; Anti-Gratifikasi).
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ============================================================ */}
          {/* 4. MAIN TERMS ARTICLES & SIDEBAR                             */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Main Document Content Column (Left) */}
            <div className="lg:col-span-8 space-y-6">

              {/* Notice Banner */}
              <div className="p-4 sm:p-5 bg-[#fef3c7]/60 rounded-2xl border border-[#fde68a] flex items-start gap-3.5 shadow-2xs">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                  <strong className="block font-bold mb-0.5 text-amber-900">
                    Pemberitahuan Kepatuhan &amp; Integritas Layanan
                  </strong>
                  Dengan mengakses portal digital Kelurahan Kolongan Satu, pengguna menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan layanan berikut demi tertib administrasi publik yang akuntabel.
                </div>
              </div>

              {/* Pasal 1 */}
              <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#cce5ff] text-[#006194] font-bold text-sm flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h2 className="text-base sm:text-lg text-[#131b2e] font-bold tracking-tight">
                    Ketentuan Umum &amp; Kelayakan Pengguna
                  </h2>
                </div>
                <div className="pl-0 sm:pl-11 text-[#3f4850] text-sm leading-relaxed space-y-3">
                  <p>
                    Layanan administrasi daring ini diperuntukkan bagi warga masyarakat yang memenuhi persyaratan kependudukan yang sah:
                  </p>
                  <ul className="space-y-2 list-disc list-inside pl-1 text-xs sm:text-sm">
                    <li>
                      <strong>Domisili Wilayah:</strong> Pemohon adalah warga yang tercatat secara sah dalam wilayah administratif <strong>Kelurahan Kolongan Satu (Lingkungan/Jaga I sampai Jaga V)</strong> atau memiliki kepentingan dinas di wilayah kelurahan.
                    </li>
                    <li>
                      <strong>Keabsahan Data Identitas:</strong> Pemohon wajib mengisi NIK, Nomor KK, nama lengkap, dan data diri yang sesuai dengan dokumen catatan sipil (KTP-el/KK) resmi.
                    </li>
                    <li>
                      <strong>Larangan Pemalsuan Berkas:</strong> Segala bentuk pemalsuan data, penggunaan NIK orang lain tanpa hak, atau manipulasi surat keterangan merupakan pelanggaran pidana dan akan diteruskan kepada pihak berwenang sesuai undang-undang yang berlaku.
                    </li>
                  </ul>
                </div>
              </article>

              {/* Pasal 2 */}
              <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#cce5ff] text-[#006194] font-bold text-sm flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h2 className="text-base sm:text-lg text-[#131b2e] font-bold tracking-tight">
                    Standar Operasional Prosedur (SOP) Penerbitan Surat
                  </h2>
                </div>
                <div className="pl-0 sm:pl-11 text-[#3f4850] text-sm leading-relaxed space-y-4">
                  <p>
                    Pengajuan persuratan mandiri diproses sesuai regulasi tata naskah dinas Pemerintah Kota Tomohon:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="p-4 bg-[#f2f3ff] rounded-xl border border-[#eaedff] space-y-1">
                      <strong className="text-[#131b2e] block font-bold">Waktu Verifikasi Berkas:</strong>
                      <p className="text-xs text-[#3f4850]">
                        Diproses pada hari kerja dinas <strong>Senin - Jumat (08.00 - 16.00 WITA)</strong>. Estimasi penyelesaian berkisar 1×24 jam sejak berkas terverifikasi lengkap.
                      </p>
                    </div>
                    <div className="p-4 bg-[#f2f3ff] rounded-xl border border-[#eaedff] space-y-1">
                      <strong className="text-[#131b2e] block font-bold">Kode Registrasi &amp; Legalisir:</strong>
                      <p className="text-xs text-[#3f4850]">
                        Dokumen memiliki Nomor Registrasi Sah dan tanda tangan pengesahan Lurah atau Sekretaris Kelurahan.
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#707881]">
                    * Dokumen yang telah selesai dapat diunduh dalam format digital atau diambil langsung versi fisik di loket pelayanan Kantor Kelurahan Kolongan Satu.
                  </p>
                </div>
              </article>

              {/* Pasal 3 */}
              <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#006194] text-white font-bold text-sm flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h2 className="text-base sm:text-lg text-[#131b2e] font-bold tracking-tight">
                    Tata Tertib Layanan Aspirasi &amp; Pengaduan Warga
                  </h2>
                </div>
                <div className="pl-0 sm:pl-11 text-[#3f4850] text-sm leading-relaxed space-y-3">
                  <p>
                    Fasilitas pelaporan masalah lingkungan (Lapor Masalah) diselenggarakan untuk perbaikan sarana warga:
                  </p>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-3.5 rounded-xl text-xs sm:text-sm text-red-950">
                      <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        Dilarang menyampaikan laporan yang memuat unsur <strong className="text-red-700">fitnah, pencemaran nama baik, suku, agama, ras (SARA), ujaran kebencian, atau informasi bohong (hoaks)</strong>.
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-[#f2f3ff] border border-[#eaedff] p-3.5 rounded-xl text-xs sm:text-sm text-[#3f4850]">
                      <CheckCircle2 className="w-5 h-5 text-[#006c49] shrink-0 mt-0.5" />
                      <div>
                        Laporan sarana publik (jalan, drainase, lampu penerangan, air bersih, sampah) harus disertai bukti foto nyata serta lokasi wilayah Jaga yang jelas.
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Pasal 4 */}
              <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#006194] text-white font-bold text-sm flex items-center justify-center shrink-0">
                    4
                  </span>
                  <h2 className="text-base sm:text-lg text-[#131b2e] font-bold tracking-tight">
                    Hak Cipta Data &amp; Informasi Monografi Publik
                  </h2>
                </div>
                <div className="pl-0 sm:pl-11 text-[#3f4850] text-sm leading-relaxed space-y-2">
                  <p>
                    Seluruh data monografi digital, grafik statistik kependudukan, peta wilayah 3D, dan publikasi resmi pada portal ini adalah milik sah Pemerintah Kelurahan Kolongan Satu, Pemerintah Kota Tomohon.
                  </p>
                  <p className="text-xs text-[#707881]">
                    Pemanfaatan data untuk kajian akademis, riset perguruan tinggi, maupun laporan masyarakat diwajibkan mencantumkan sumber resmi rujukan portal Kelurahan Kolongan Satu.
                  </p>
                </div>
              </article>

              {/* Pasal 5 */}
              <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#cce5ff] text-[#006194] font-bold text-sm flex items-center justify-center shrink-0">
                    5
                  </span>
                  <h2 className="text-base sm:text-lg text-[#131b2e] font-bold tracking-tight">
                    Perubahan &amp; Penyesuaian Ketentuan
                  </h2>
                </div>
                <div className="pl-0 sm:pl-11 text-[#3f4850] text-sm leading-relaxed space-y-2">
                  <p>
                    Pemerintah Kelurahan Kolongan Satu berhak melakukan penyesuaian ketentuan layanan secara berkala sesuai perkembangan regulasi Pemerintah Kota Tomohon, Kementerian Dalam Negeri, dan Kementerian Komunikasi dan Digital RI.
                  </p>
                </div>
              </article>

            </div>

            {/* Sidebar Column (Right) */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* Sekretariat Pelayanan Informasi & Pengaduan Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#eaedff] shadow-xs sticky top-28 space-y-6">
                
                <div className="flex items-center gap-3 pb-4 border-b border-[#eaedff]">
                  <div className="w-10 h-10 rounded-xl bg-[#006194] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#131b2e] leading-tight">
                      Sekretariat Pelayanan Informasi &amp; Pengaduan
                    </h3>
                    <span className="text-xs text-[#006194] font-medium">
                      Kantor Kelurahan Kolongan Satu
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4 text-xs sm:text-sm text-[#3f4850]">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#006194] mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-[#131b2e] block mb-0.5">Alamat Kantor:</strong>
                      <p className="leading-relaxed">
                        Jl. Zanosui / Wanua Atas, Kecamatan Tomohon Tengah, Kota Tomohon, Sulawesi Utara 95438
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#006194] mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-[#131b2e] block mb-0.5">Surel Resmi:</strong>
                      <a
                        href="mailto:kel.kolongansatu@tomohon.go.id"
                        className="text-[#006194] hover:underline font-semibold"
                      >
                        kel.kolongansatu@tomohon.go.id
                      </a>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#006194] mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-[#131b2e] block mb-0.5">Jam Layanan Kantor:</strong>
                      <p className="leading-relaxed">Senin - Jumat: 08.00 - 16.00 WITA</p>
                      <p className="text-xs text-[#707881]">Sabtu, Minggu &amp; Libur Nasional: Tutup</p>
                    </div>
                  </div>

                  {/* Fast Contact Button */}
                  <div className="pt-2 no-print">
                    <a
                      href="https://wa.me/6281244000100?text=Halo%20Sekretariat%20Kelurahan%20Kolongan%20Satu,%20saya%20ingin%20berkonsultasi%20terkait%20layanan%20persuratan/administrasi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#6cf8bb]/30 hover:bg-[#6cf8bb]/50 text-[#006c49] font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors border border-[#4edea3]/40 shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 text-[#006c49]" />
                      <span>Hubungi Hotline Pengaduan</span>
                    </a>
                  </div>
                </div>

                {/* Security & Standard Regulatory Stamp */}
                <div className="bg-[#f2f3ff] p-3.5 rounded-xl border border-[#eaedff] text-xs text-[#3f4850] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#006c49] font-semibold">
                    <BadgeCheck className="w-4 h-4" />
                    <span>Standar Pelayanan Publik SPBE</span>
                  </div>
                  <p className="text-[11px] text-[#707881] leading-relaxed">
                    Pedoman tata kelola integritas dokumen dan pelayanan elektronik terpadu Kota Tomohon.
                  </p>
                </div>

              </div>
            </aside>

          </div>

        </div>
      </main>

      {/* ============================================================ */}
      {/* 5. OFFICIAL 4-COLUMN FOOTER                                  */}
      {/* ============================================================ */}
      <footer className="w-full bg-[#f2f3ff] text-[#3f4850] pt-12 pb-8 border-t border-[#eaedff] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            
            {/* Column 1: Kolongan Satu */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-[#006194] rounded-full"></div>
                <h4 className="text-base text-[#131b2e] font-bold">Kolongan Satu</h4>
              </div>
              <p className="text-xs sm:text-sm text-[#3f4850] leading-relaxed">
                Pemerintah Kelurahan Kolongan Satu, pusat administrasi dan keterbukaan data monografi kependudukan, wilayah, dan pelayanan masyarakat terpadu Kota Tomohon.
              </p>
            </div>

            {/* Column 2: Jam Pelayanan */}
            <div className="flex flex-col gap-3">
              <h5 className="text-sm text-[#131b2e] font-bold">Jam Pelayanan</h5>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#3f4850]">
                <li>Senin - Kamis: 08.00 - 16.00 WITA</li>
                <li>Jumat: 08.00 - 15.30 WITA</li>
                <li>Sabtu &amp; Minggu: Tutup (Layanan Daring Aktif)</li>
              </ul>
            </div>

            {/* Column 3: Tautan Cepat */}
            <div className="flex flex-col gap-3">
              <h5 className="text-sm text-[#131b2e] font-bold">Tautan Cepat</h5>
              <nav className="flex flex-col space-y-1.5 text-xs sm:text-sm">
                <Link href="/#peta-lingkungan" className="text-[#3f4850] hover:text-[#006194] transition-colors">
                  Peta Wilayah Lingkungan
                </Link>
                <Link href="/#monografi-wilayah" className="text-[#3f4850] hover:text-[#006194] transition-colors">
                  Statistik Demografi
                </Link>
                <Link href="/#layanan-publik" className="text-[#3f4850] hover:text-[#006194] transition-colors">
                  Permohonan Surat Keterangan
                </Link>
                <Link href="/#potensi-umkm" className="text-[#3f4850] hover:text-[#006194] transition-colors">
                  UMKM &amp; Potensi Desa
                </Link>
              </nav>
            </div>

            {/* Column 4: Kontak Kantor */}
            <div className="flex flex-col gap-3">
              <h5 className="text-sm text-[#131b2e] font-bold">Kontak Kantor</h5>
              <p className="text-xs sm:text-sm text-[#3f4850] leading-relaxed">
                Jl. Kolongan Raya, Kecamatan Tomohon Tengah, Kota Tomohon, Sulawesi Utara 95438
              </p>
              <p className="text-xs sm:text-sm text-[#3f4850]">
                Surel:{' '}
                <a href="mailto:kel.kolongansatu@tomohon.go.id" className="text-[#006194] hover:underline font-medium">
                  kel.kolongansatu@tomohon.go.id
                </a>
              </p>
            </div>

          </div>

          {/* Copyright Bottom Bar */}
          <div className="pt-4 border-t border-[#dae2fd] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#3f4850]">
            <p>© 2024 Pemerintah Kelurahan Kolongan Satu, Kota Tomohon. Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-4">
              <Link
                href="/kebijakan-privasi"
                className="text-[#3f4850] hover:text-[#006194] transition-colors"
              >
                Kebijakan Privasi
              </Link>
              <span>•</span>
              <span className="text-[#006194] font-semibold">
                Ketentuan Layanan
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
