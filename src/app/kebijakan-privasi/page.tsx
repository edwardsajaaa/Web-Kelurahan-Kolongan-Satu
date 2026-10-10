'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Scale,
  Printer,
  Download,
  FileText,
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
  LogIn
} from 'lucide-react';

export default function KebijakanPrivasiPage() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

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
                Kebijakan Privasi & Perlindungan Data
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
                  <span>Portal Transparansi SPBE</span>
                  <span className="text-[#93ccff]">•</span>
                  <span>Regulasi UU PDP No. 27/2022</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#131b2e] font-extrabold tracking-tight leading-tight">
                  Kebijakan Privasi &amp; Perlindungan Data
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-[#3f4850] leading-relaxed max-w-2xl">
                  Komitmen keterbukaan, keamanan data kependudukan, dan hak privasi warga Kelurahan Kolongan Satu, Kota Tomohon.
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
                  onClick={() => setActiveTab('privacy')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'privacy'
                      ? 'bg-white text-[#006194] shadow-xs'
                      : 'text-[#3f4850] hover:text-[#131b2e]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kebijakan Privasi</span>
                </button>
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
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-[#3f4850]">
                <Gavel className="w-4 h-4 text-[#006c49]" />
                <span>Kepatuhan Standar SPBE Diskominfo Kota Tomohon</span>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 3. SECURITY GUARANTEE FEATURE CARDS                          */}
          {/* ============================================================ */}
          <section aria-labelledby="guarantee-heading" className="mb-8">
            <h2 className="sr-only" id="guarantee-heading">Prinsip Keamanan Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Card 1 */}
              <div className="bg-white border border-[#eaedff] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
                <div className="p-3 bg-[#cce5ff]/60 text-[#006194] rounded-2xl shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#131b2e]">
                    Enkripsi &amp; Non-Komersial
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3f4850] mt-1 leading-relaxed">
                    Data warga dienkripsi SSL &amp; dijamin tidak pernah dijual kepada pihak komersial mana pun.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-[#eaedff] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
                <div className="p-3 bg-[#6cf8bb]/30 text-[#006c49] rounded-2xl shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#131b2e]">
                    Akses Terbatas Terverifikasi
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3f4850] mt-1 leading-relaxed">
                    Hanya aparatur berwenang (Lurah, Sekkel, Kasie &amp; Operator sah) yang memiliki izin.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-[#eaedff] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
                <div className="p-3 bg-[#d3e4fe]/70 text-[#4d5d73] rounded-2xl shrink-0">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#131b2e]">
                    Kedaulatan Hak Warga
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3f4850] mt-1 leading-relaxed">
                    Hak penuh mengajukan klarifikasi, pembaruan, dan pembetulan data kependudukan.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ============================================================ */}
          {/* 4. MAIN POLICY ARTICLES & SIDEBAR                            */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Main Document Content Column (Left) */}
            <div className="lg:col-span-8 space-y-6">

              {activeTab === 'privacy' ? (
                <>
                  {/* Pasal 1 */}
                  <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#cce5ff] text-[#006194] font-bold text-sm flex items-center justify-center shrink-0">
                        1
                      </span>
                      <h2 className="text-base sm:text-lg text-[#131b2e] font-bold tracking-tight">
                        Landasan Hukum &amp; Komitmen Privasi
                      </h2>
                    </div>
                    <div className="pl-0 sm:pl-11 text-[#3f4850] text-sm leading-relaxed space-y-2.5">
                      <p>
                        Pemerintah Kelurahan Kolongan Satu, Kecamatan Tomohon Tengah, berkomitmen melindungi dan menghormati hak privasi setiap warga. Pengelolaan data masyarakat dilakukan berdasarkan prinsip transparansi, akuntabilitas, dan kepatuhan penuh terhadap <strong>Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)</strong> serta Peraturan Pemerintah dan regulasi Sistem Pemerintahan Berbasis Elektronik (SPBE) Pemerintah Kota Tomohon.
                      </p>
                      <p className="text-xs text-[#707881]">
                        Sistem ini diselenggarakan secara resmi demi mempermudah pencatatan monografi kependudukan, pelaporan statistik terpadu, dan percepatan administrasi persuratan publik bagi warga Kelurahan Kolongan Satu.
                      </p>
                    </div>
                  </article>

                  {/* Pasal 2 */}
                  <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#cce5ff] text-[#006194] font-bold text-sm flex items-center justify-center shrink-0">
                        2
                      </span>
                      <h2 className="text-base sm:text-lg text-[#131b2e] font-bold tracking-tight">
                        Klasifikasi Data yang Dikelola
                      </h2>
                    </div>
                    <div className="pl-0 sm:pl-11 text-[#3f4850] text-sm leading-relaxed space-y-4">
                      <p>
                        Kelurahan mengumpulkan dan memproses data kependudukan semata-mata demi kebutuhan administrasi pemerintahan dan pelayanan publik desa/kelurahan:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-start gap-3 bg-[#f2f3ff] p-3.5 rounded-xl border border-[#eaedff]">
                          <FileBadge className="w-5 h-5 text-[#006194] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-[#131b2e] block">Data Identitas Kependudukan</span>
                            <span className="text-xs text-[#3f4850]">NIK, Nomor Kartu Keluarga (KK), Nama Lengkap, Tempat &amp; Tanggal Lahir.</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-[#f2f3ff] p-3.5 rounded-xl border border-[#eaedff]">
                          <MapPin className="w-5 h-5 text-[#006194] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-[#131b2e] block">Data Domisili &amp; Wilayah Jaga</span>
                            <span className="text-xs text-[#3f4850]">Alamat tinggal, RT/RW, dan Wilayah Lingkungan (Jaga I sampai Jaga V).</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-[#f2f3ff] p-3.5 rounded-xl border border-[#eaedff]">
                          <FileText className="w-5 h-5 text-[#006194] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-[#131b2e] block">Permohonan Persuratan Publik</span>
                            <span className="text-xs text-[#3f4850]">Surat Keterangan Usaha (SKU), Domisili, dan Pengantar SKCK mandiri.</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-[#f2f3ff] p-3.5 rounded-xl border border-[#eaedff]">
                          <Phone className="w-5 h-5 text-[#006194] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-[#131b2e] block">Kontak Komunikasi Warga</span>
                            <span className="text-xs text-[#3f4850]">Nomor Telepon/WhatsApp aktif untuk konfirmasi validasi berkas dinas.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* Pasal 3 */}
                  <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#006194] text-white font-bold text-sm flex items-center justify-center shrink-0">
                        3
                      </span>
                      <h2 className="text-base sm:text-lg text-[#131b2e] font-bold tracking-tight">
                        Keamanan &amp; Pembatasan Akses
                      </h2>
                    </div>
                    <div className="pl-0 sm:pl-11 space-y-3">
                      <p className="text-sm font-semibold text-[#131b2e]">Pemerintah Kelurahan menjamin secara berkala bahwa:</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-xl text-xs sm:text-sm text-red-950">
                          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            Data pribadi warga <span className="font-bold text-red-700 uppercase">TIDAK PERNAH DIJUAL, DISEWAKAN, ATAU DIBAGIKAN</span> kepada pihak ketiga atau entitas komersial mana pun.
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-[#f2f3ff] border border-[#eaedff] p-4 rounded-xl text-xs sm:text-sm text-[#3f4850]">
                          <ShieldCheck className="w-5 h-5 text-[#006194] shrink-0 mt-0.5" />
                          <div>
                            Akses terhadap basis data monografi kependudukan dibatasi secara ketat hanya untuk aparatur kelurahan yang berwenang <strong>(Lurah, Sekretaris Kelurahan, Kasie Pemerintahan, dan Operator Terverifikasi)</strong>.
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-[#f2f3ff] border border-[#eaedff] p-4 rounded-xl text-xs sm:text-sm text-[#3f4850]">
                          <Lock className="w-5 h-5 text-[#006c49] shrink-0 mt-0.5" />
                          <div>
                            Pertukaran transmisi data dienkripsi dengan protokol aman <strong>HTTPS/SSL</strong> standar SPBE Kementerian Komunikasi dan Digital RI.
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
                        Hak Subjek Data Masyarakat
                      </h2>
                    </div>
                    <div className="pl-0 sm:pl-11 text-[#3f4850] text-sm leading-relaxed space-y-2.5">
                      <p>
                        Sesuai mandat UU PDP No. 27/2022, setiap warga Kelurahan Kolongan Satu sebagai subjek data memiliki hak untuk:
                      </p>
                      <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm pl-1">
                        <li>Memperoleh informasi mengenai kejelasan identitas dan pemrosesan basis data monografi.</li>
                        <li>Mengajukan perbaikan, pemutakhiran, dan verifikasi atas ketidaksesuaian data kependudukan pribadi.</li>
                        <li>Menyampaikan pengaduan jika ditemukan indikasi kebocoran atau penyalahgunaan data administratif.</li>
                      </ul>
                    </div>
                  </article>

                  {/* Pasal 5 */}
                  <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#cce5ff] text-[#006194] font-bold text-sm flex items-center justify-center shrink-0">
                        5
                      </span>
                      <h2 className="text-base sm:text-lg text-[#131b2e] font-bold tracking-tight">
                        Alur Pengaduan &amp; Layanan Bantuan
                      </h2>
                    </div>
                    <div className="pl-0 sm:pl-11 text-[#3f4850] text-sm leading-relaxed space-y-2">
                      <p>
                        Warga dapat mengajukan permohonan koreksi dan klarifikasi berkas kependudukan secara langsung di loket pelayanan Kantor Kelurahan Kolongan Satu pada hari dan jam dinas, atau secara daring melalui Pusat Layanan Pengaduan Resmi SPBE.
                      </p>
                    </div>
                  </article>
                </>
              ) : (
                <>
                  {/* Ketentuan Layanan Articles */}
                  <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#cce5ff] text-[#006194] font-bold text-sm flex items-center justify-center shrink-0">
                        1
                      </span>
                      <h2 className="text-base sm:text-lg text-[#131b2e] font-bold tracking-tight">
                        Kelayakan Pengguna &amp; Keabsahan Data
                      </h2>
                    </div>
                    <div className="pl-0 sm:pl-11 text-[#3f4850] text-sm leading-relaxed space-y-2.5">
                      <ul className="space-y-2 list-disc list-inside pl-1 text-xs sm:text-sm">
                        <li>Layanan permohonan surat ditujukan bagi warga penduduk yang berdomisili sah atau tercatat dalam wilayah administratif <strong>Kelurahan Kolongan Satu (Lingkungan I sampai V)</strong>.</li>
                        <li>Pemohon wajib mengisi data identitas diri yang valid, benar, dan dapat dipertanggungjawabkan di hadapan hukum.</li>
                        <li>Segala bentuk pemalsuan NIK, pemalsuan identitas, atau keterangan palsu merupakan pelanggaran hukum yang dapat diproses sesuai perundang-undangan pidana yang berlaku.</li>
                      </ul>
                    </div>
                  </article>

                  <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#cce5ff] text-[#006194] font-bold text-sm flex items-center justify-center shrink-0">
                        2
                      </span>
                      <h2 className="text-base sm:text-lg text-[#131b2e] font-bold tracking-tight">
                        Standar Operasional Pelayanan (SOP)
                      </h2>
                    </div>
                    <div className="pl-0 sm:pl-11 text-[#3f4850] text-sm leading-relaxed space-y-3">
                      <div className="p-4 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
                        <strong className="text-[#131b2e] block text-xs sm:text-sm mb-1">Waktu Verifikasi Dokumen:</strong>
                        <p className="text-xs sm:text-sm">Pengajuan surat keterangan diproses pada hari kerja (Senin–Jumat, 08.00–16.00 WITA). Estimasi penyelesaian berkisar 1×24 jam sejak berkas dinyatakan lengkap oleh petugas.</p>
                      </div>
                      <div className="p-4 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
                        <strong className="text-[#131b2e] block text-xs sm:text-sm mb-1">Legalitas Berkas:</strong>
                        <p className="text-xs sm:text-sm">Setiap dokumen surat yang diterbitkan memiliki Nomor Registrasi Surat resmi serta tanda tangan pengesahan pejabat yang berwenang. Dokumen dapat dicetak mandiri atau diambil secara fisik di kantor kelurahan.</p>
                      </div>
                    </div>
                  </article>

                  <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#006194] text-white font-bold text-sm flex items-center justify-center shrink-0">
                        3
                      </span>
                      <h2 className="text-base sm:text-lg text-[#131b2e] font-bold tracking-tight">
                        Ketentuan Layanan Aspirasi &amp; Pengaduan Warga
                      </h2>
                    </div>
                    <div className="pl-0 sm:pl-11 text-[#3f4850] text-sm leading-relaxed space-y-2">
                      <ul className="space-y-2 list-disc list-inside pl-1 text-xs sm:text-sm">
                        <li>Laporan masalah prasarana (lampu jalan, drainase, air bersih, sampah, ketertiban umum) harus disertai keterangan lokasi yang akurat dan foto pendukung yang relevan.</li>
                        <li>Dilarang menyampaikan laporan yang memuat unsur fitnah, ujaran kebencian, suku, agama, ras, dan antargolongan (SARA), pornografi, atau konten yang menyesatkan.</li>
                        <li>Pemerintah Kelurahan berhak menolak atau menghapus laporan yang tidak memenuhi kriteria kesantunan publik.</li>
                      </ul>
                    </div>
                  </article>

                  <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eaedff] shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#006194] text-white font-bold text-sm flex items-center justify-center shrink-0">
                        4
                      </span>
                      <h2 className="text-base sm:text-lg text-[#131b2e] font-bold tracking-tight">
                        Hak Cipta Data &amp; Informasi Publik
                      </h2>
                    </div>
                    <div className="pl-0 sm:pl-11 text-[#3f4850] text-sm leading-relaxed">
                      <p>
                        Seluruh data monografi wilayah, grafik kependudukan, citra geospasial 3D, dan publikasi resmi pada portal ini dilindungi undang-undang hak cipta milik Pemerintah Kelurahan Kolongan Satu, Pemerintah Kota Tomohon. Pemanfaatan data untuk kajian akademis, riset, atau referensi publik diwajibkan mencantumkan sumber resmi.
                      </p>
                    </div>
                  </article>
                </>
              )}

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
                      href="https://wa.me/6281244000100?text=Halo%20Sekretariat%20Kelurahan%20Kolongan%20Satu,%20saya%20ingin%20berkonsultasi%20terkait%20layanan%20kependudukan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#6cf8bb]/30 hover:bg-[#6cf8bb]/50 text-[#006c49] font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors border border-[#4edea3]/40 shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 text-[#006c49]" />
                      <span>Hubungi Hotline Pengaduan</span>
                    </a>
                  </div>
                </div>

                {/* Security Regulatory Stamp */}
                <div className="bg-[#f2f3ff] p-3.5 rounded-xl border border-[#eaedff] text-xs text-[#3f4850] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#006c49] font-semibold">
                    <BadgeCheck className="w-4 h-4" />
                    <span>Standar Keamanan Data SPBE</span>
                  </div>
                  <p className="text-[11px] text-[#707881] leading-relaxed">
                    Dokumen resmi tata kelola keamanan informasi kependudukan dan integrasi layanan elektronik Kota Tomohon.
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
              <button
                type="button"
                onClick={() => setActiveTab('privacy')}
                className={`transition-colors cursor-pointer ${activeTab === 'privacy' ? 'text-[#006194] font-semibold' : 'hover:text-[#006194]'}`}
              >
                Kebijakan Privasi
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveTab('terms')}
                className={`transition-colors cursor-pointer ${activeTab === 'terms' ? 'text-[#006194] font-semibold' : 'hover:text-[#006194]'}`}
              >
                Ketentuan Layanan
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
