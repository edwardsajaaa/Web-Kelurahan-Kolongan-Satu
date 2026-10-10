'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileText,
  X,
  Lock,
  Scale,
  Building2,
  Mail,
  MapPin,
  Clock,
  Printer,
  ExternalLink,
  UserCheck,
  AlertTriangle,
  BadgeCheck,
  FileBadge,
  Phone,
  MessageCircle
} from 'lucide-react';

interface ModalLegalPolicyProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms';
}

export default function ModalLegalPolicy({
  isOpen,
  onClose,
  initialTab = 'privacy',
}: ModalLegalPolicyProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#dae2fd]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#006194] to-[#004b73] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-xs">
              {activeTab === 'privacy' ? (
                <ShieldCheck className="w-5 h-5 text-sky-200" />
              ) : (
                <Scale className="w-5 h-5 text-sky-200" />
              )}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-sky-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Portal Transparansi SPBE • UU PDP No. 27/2022</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {activeTab === 'privacy' ? 'Kebijakan Privasi & Perlindungan Data' : 'Ketentuan Layanan Portal Digital'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/kebijakan-privasi"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer hidden md:flex items-center gap-1.5 text-xs font-semibold"
              title="Buka tampilan halaman penuh"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Halaman Penuh</span>
            </Link>
            <button
              onClick={() => window.print()}
              type="button"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer hidden sm:flex items-center gap-1 text-xs font-semibold"
              title="Cetak dokumen"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline">Cetak</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher & Notice Bar */}
        <div className="px-4 sm:px-6 pt-3 pb-2.5 bg-[#f8f9ff] border-b border-[#eaedff] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-[#006194] text-white shadow-xs'
                  : 'bg-white text-[#535f70] hover:text-[#131b2e] border border-[#dae2fd]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kebijakan Privasi</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('terms')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-[#006194] text-white shadow-xs'
                  : 'bg-white text-[#535f70] hover:text-[#131b2e] border border-[#dae2fd]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ketentuan Layanan</span>
            </button>
          </div>
          <span className="text-[11px] font-medium text-[#71787e] hidden sm:inline">
            Berlaku efektif: <strong className="text-[#131b2e]">Tahun 2025/2026</strong>
          </span>
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6 text-[#131b2e] text-xs sm:text-sm leading-relaxed">
          
          {/* 3 Security Guarantee Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#f8f9ff] border border-[#eaedff] rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
              <div className="p-2 bg-[#cce5ff]/60 text-[#006194] rounded-xl shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#131b2e]">Enkripsi & Non-Komersial</h4>
                <p className="text-[11px] text-[#535f70] mt-0.5 leading-snug">
                  Data SSL dienkripsi & dijamin tidak pernah diperjualbelikan.
                </p>
              </div>
            </div>

            <div className="bg-[#f8f9ff] border border-[#eaedff] rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
              <div className="p-2 bg-[#6cf8bb]/30 text-[#006c49] rounded-xl shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#131b2e]">Akses Terbatas</h4>
                <p className="text-[11px] text-[#535f70] mt-0.5 leading-snug">
                  Hanya aparatur kelurahan berwenang yang memiliki izin akses.
                </p>
              </div>
            </div>

            <div className="bg-[#f8f9ff] border border-[#eaedff] rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
              <div className="p-2 bg-[#d3e4fe]/70 text-[#4d5d73] rounded-xl shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#131b2e]">Kedaulatan Warga</h4>
                <p className="text-[11px] text-[#535f70] mt-0.5 leading-snug">
                  Hak penuh klarifikasi dan pembaruan data kependudukan.
                </p>
              </div>
            </div>
          </div>

          {activeTab === 'privacy' ? (
            /* ================= KEBIJAKAN PRIVASI ================= */
            <div className="space-y-5">
              
              {/* Pasal 1 */}
              <div className="bg-[#faf8ff] rounded-2xl p-4 sm:p-5 border border-[#eaedff] space-y-2">
                <h4 className="text-sm font-bold text-[#006194] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#cce5ff] text-[#006194] flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  Landasan Hukum & Komitmen Privasi
                </h4>
                <p className="text-[#3f4850] text-xs sm:text-sm pl-0 sm:pl-8 leading-relaxed">
                  Pemerintah Kelurahan Kolongan Satu, Kecamatan Tomohon Tengah, berkomitmen melindungi hak privasi warga berdasarkan prinsip transparansi dan kepatuhan penuh terhadap <strong>Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)</strong> serta regulasi Sistem Pemerintahan Berbasis Elektronik (SPBE) Pemerintah Kota Tomohon.
                </p>
              </div>

              {/* Pasal 2 */}
              <div className="bg-[#faf8ff] rounded-2xl p-4 sm:p-5 border border-[#eaedff] space-y-3">
                <h4 className="text-sm font-bold text-[#006194] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#cce5ff] text-[#006194] flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  Klasifikasi Data yang Dikelola
                </h4>
                <p className="text-[#3f4850] text-xs sm:text-sm pl-0 sm:pl-8">
                  Kelurahan mengumpulkan dan memproses data kependudukan semata-mata demi kebutuhan administrasi pemerintahan dan pelayanan publik:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-0 sm:pl-8">
                  <div className="p-3 bg-white rounded-xl border border-[#eaedff] flex items-start gap-2.5">
                    <FileBadge className="w-4 h-4 text-[#006194] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs text-[#131b2e] block">Data Identitas Kependudukan</strong>
                      <span className="text-[11px] text-[#535f70]">NIK, Nomor KK, Nama Lengkap, Tempat & Tanggal Lahir.</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#eaedff] flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#006194] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs text-[#131b2e] block">Data Domisili & Wilayah Jaga</strong>
                      <span className="text-[11px] text-[#535f70]">Alamat tinggal, RT/RW, dan Wilayah Lingkungan (Jaga I–V).</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#eaedff] flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-[#006194] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs text-[#131b2e] block">Permohonan Persuratan Publik</strong>
                      <span className="text-[11px] text-[#535f70]">SKU, Surat Domisili, dan Pengantar SKCK mandiri.</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#eaedff] flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-[#006194] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs text-[#131b2e] block">Kontak Komunikasi Warga</strong>
                      <span className="text-[11px] text-[#535f70]">Nomor Telepon/WhatsApp aktif untuk validasi dokumen.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pasal 3 */}
              <div className="bg-[#faf8ff] rounded-2xl p-4 sm:p-5 border border-[#eaedff] space-y-3">
                <h4 className="text-sm font-bold text-[#006194] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#006194] text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  Keamanan & Pembatasan Akses
                </h4>
                <div className="pl-0 sm:pl-8 space-y-2">
                  <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-950">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>Data pribadi warga <strong>TIDAK PERNAH DIJUAL, DISEWAKAN, ATAU DIBAGIKAN</strong> kepada pihak ketiga atau entitas komersial mana pun.</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 bg-white border border-[#eaedff] rounded-xl text-xs text-[#3f4850]">
                    <ShieldCheck className="w-4 h-4 text-[#006194] shrink-0 mt-0.5" />
                    <span>Akses database dibatasi hanya untuk aparatur kelurahan berwenang (Lurah, Sekkel, Kasie Pemerintahan, dan Operator Terverifikasi).</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 bg-white border border-[#eaedff] rounded-xl text-xs text-[#3f4850]">
                    <Lock className="w-4 h-4 text-[#006c49] shrink-0 mt-0.5" />
                    <span>Pertukaran transmisi data dienkripsi dengan protokol aman HTTPS/SSL standar SPBE RI.</span>
                  </div>
                </div>
              </div>

              {/* Pasal 4 & 5 */}
              <div className="bg-[#faf8ff] rounded-2xl p-4 sm:p-5 border border-[#eaedff] space-y-2">
                <h4 className="text-sm font-bold text-[#006194] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#006194] text-white flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  Hak Subjek Data & Alur Pengaduan
                </h4>
                <p className="text-[#3f4850] text-xs sm:text-sm pl-0 sm:pl-8 leading-relaxed">
                  Setiap warga berhak memperoleh kejelasan pemrosesan data, mengajukan koreksi/pemutakhiran ketidaksesuaian data kependudukan pribadi, serta menyampaikan pengaduan di loket pelayanan Kantor Kelurahan Kolongan Satu pada hari dinas atau via saluran resmi SPBE.
                </p>
              </div>

            </div>
          ) : (
            /* ================= KETENTUAN LAYANAN ================= */
            <div className="space-y-5">
              
              <div className="bg-[#faf8ff] rounded-2xl p-4 sm:p-5 border border-[#eaedff] space-y-2">
                <h4 className="text-sm font-bold text-[#006194] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#cce5ff] text-[#006194] flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  Kelayakan Pengguna & Keabsahan Data
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-[#3f4850] pl-0 sm:pl-8">
                  <li>Layanan ditujukan bagi warga penduduk yang berdomisili sah dalam wilayah <strong>Kelurahan Kolongan Satu (Jaga I–V)</strong>.</li>
                  <li>Pemohon wajib mengisi data identitas yang valid, benar, dan dapat dipertanggungjawabkan di hadapan hukum.</li>
                  <li>Pemalsuan identitas merupakan tindak pidana yang dapat diproses hukum.</li>
                </ul>
              </div>

              <div className="bg-[#faf8ff] rounded-2xl p-4 sm:p-5 border border-[#eaedff] space-y-2">
                <h4 className="text-sm font-bold text-[#006194] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#cce5ff] text-[#006194] flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  Standar Operasional Pelayanan (SOP)
                </h4>
                <div className="space-y-2 pl-0 sm:pl-8 text-xs text-[#3f4850]">
                  <div className="p-3 bg-white rounded-xl border border-[#eaedff]">
                    <strong>Waktu Verifikasi:</strong> Diproses pada hari kerja (Senin–Jumat, 08.00–16.00 WITA) estimasi 1×24 jam sejak berkas lengkap.
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#eaedff]">
                    <strong>Legalitas Berkas:</strong> Dokumen memiliki Nomor Registrasi sah serta tanda tangan pengesahan pejabat berwenang.
                  </div>
                </div>
              </div>

              <div className="bg-[#faf8ff] rounded-2xl p-4 sm:p-5 border border-[#eaedff] space-y-2">
                <h4 className="text-sm font-bold text-[#006194] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#006194] text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  Ketentuan Layanan Aspirasi & Hak Cipta
                </h4>
                <p className="text-xs sm:text-sm text-[#3f4850] pl-0 sm:pl-8 leading-relaxed">
                  Laporan masyarakat harus objektif dan bebas dari unsur SARA atau fitnah. Seluruh data monografi publik dilindungi oleh hak cipta Pemerintah Kelurahan Kolongan Satu, Pemerintah Kota Tomohon.
                </p>
              </div>

            </div>
          )}

          {/* Official Contact & Secretariat Card */}
          <div className="p-4 sm:p-5 bg-[#f2f3ff] rounded-2xl border border-[#eaedff] text-xs text-[#3f4850] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-[#006194]">
                <Building2 className="w-4 h-4" />
                <span>Sekretariat Pelayanan Informasi & Pengaduan</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#006c49] font-semibold">
                <BadgeCheck className="w-3.5 h-3.5" />
                <span>Standar SPBE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs text-[#3f4850]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#006194] shrink-0 mt-0.5" />
                <span>Jl. Zanosui / Wanua Atas, Kec. Tomohon Tengah, Kota Tomohon, Sulawesi Utara 95438</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#006194] shrink-0 mt-0.5" />
                <span>Surel: <strong className="text-[#006194]">kel.kolongansatu@tomohon.go.id</strong></span>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <Clock className="w-3.5 h-3.5 text-[#006194] shrink-0 mt-0.5" />
                <span>Jam Layanan: Senin - Jumat 08.00 - 16.00 WITA (Sabtu & Minggu Tutup)</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between gap-3">
              <a
                href="https://wa.me/6281244000100?text=Halo%20Sekretariat%20Kelurahan%20Kolongan%20Satu,%20saya%20ingin%20berkonsultasi%20terkait%20layanan%20kependudukan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#006c49] hover:text-[#005236] transition"
              >
                <MessageCircle className="w-4 h-4 text-[#006c49]" />
                <span>Hubungi Hotline Pengaduan WhatsApp</span>
              </a>

              <Link
                href="/kebijakan-privasi"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006194] hover:underline"
              >
                <span>Buka Versi Halaman Web Penuh</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#dae2fd] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#71787e] hidden sm:block">
            {activeTab === 'privacy'
              ? 'Kebijakan diperbarui secara berkala sesuai regulasi SPBE RI.'
              : 'Ketentuan ini mengikat seluruh pengguna portal publik.'}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/kebijakan-privasi"
              className="px-4 py-2 rounded-full text-xs font-bold border border-[#dae2fd] text-[#006194] hover:bg-white transition"
            >
              Buka Halaman Penuh
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-xs font-bold bg-[#006194] hover:bg-[#007bb9] text-white transition shadow-xs cursor-pointer"
            >
              Tutup Jendela
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
