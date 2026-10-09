'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, X, CheckCircle2, Lock, Scale, AlertCircle, Building2, Mail, MapPin, Printer } from 'lucide-react';

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
      <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#dae2fd]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#006194] to-[#004f7a] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-xs">
              {activeTab === 'privacy' ? (
                <ShieldCheck className="w-5 h-5 text-sky-200" />
              ) : (
                <Scale className="w-5 h-5 text-sky-200" />
              )}
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-200">
                Pemerintah Kelurahan Kolongan Satu
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {activeTab === 'privacy' ? 'Kebijakan Privasi & Perlindungan Data' : 'Ketentuan Layanan Portal Digital'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Tab Switcher */}
        <div className="px-4 sm:px-6 pt-3 pb-2 bg-[#f8f9ff] border-b border-[#e2e7ff] flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#006194] text-white shadow-xs'
                : 'bg-white text-[#535f70] hover:text-[#131b2e] border border-[#dae2fd]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
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
          <span className="ml-auto text-[11px] font-medium text-[#71787e] hidden md:inline">
            Berlaku efektif: Tahun 2025/2026
          </span>
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-[#131b2e] text-xs sm:text-sm leading-relaxed">
          {activeTab === 'privacy' ? (
            /* ================= KEBIJAKAN PRIVASI ================= */
            <div className="space-y-6">
              {/* Introduction Card */}
              <div className="p-4 bg-[#eef4ff] rounded-2xl border border-[#cfe1ff] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#006194] shrink-0 mt-0.5" />
                <div className="text-xs text-[#004f7a]">
                  <strong className="block font-bold mb-0.5">Komitmen Pelindungan Data Pribadi Warga</strong>
                  Pemerintah Kelurahan Kolongan Satu berkomitmen menjaga kerahasiaan dan keamanan seluruh data kependudukan masyarakat sesuai amanat <strong>Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)</strong> serta regulasi Sistem Pemerintahan Berbasis Elektronik (SPBE) Kota Tomohon.
                </div>
              </div>

              {/* Pasal 1 */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#006194] mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#e2e7ff] text-[#006194] flex items-center justify-center text-xs font-bold">1</span>
                  Data yang Kami Kumpulkan
                </h4>
                <p className="text-[#3f4850] mb-2">
                  Melalui portal digital ini, data pribadi dikumpulkan secara terbatas hanya untuk kepentingan administrasi publik dan pelayanan kemasyarakatan yang sah:
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-[#3f4850] pl-2">
                  <li><strong>Layanan Surat Keterangan:</strong> Nama lengkap, NIK (Nomor Induk Kependudukan), Nomor Kartu Keluarga (KK), tempat/tanggal lahir, jenis kelamin, alamat domisili (Jaga 1–5), nomor WhatsApp/telepon, dan surat pengantar Kepala Lingkungan (Pala).</li>
                  <li><strong>Layanan Aspirasi & Pengaduan (Lapor Masalah):</strong> Identitas pelapor, lokasi permasalahan geospasial, foto dokumentasi kendala, dan keterangan perbaikan sarana/prasarana.</li>
                  <li><strong>Data Statistik Terbuka:</strong> Data monografi kelurahan disajikan dalam agregat terbuka (total jiwa, sebaran agama, kelompok usia, mata pencaharian) tanpa mencantumkan identitas pribadi individu.</li>
                </ul>
              </div>

              {/* Pasal 2 */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#006194] mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#e2e7ff] text-[#006194] flex items-center justify-center text-xs font-bold">2</span>
                  Tujuan Penggunaan Data
                </h4>
                <p className="text-[#3f4850] mb-2">
                  Data yang diberikan warga hanya digunakan untuk:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#3f4850]">
                  <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#e2e7ff] flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Verifikasi keabsahan data kependudukan dalam register resmi kelurahan.</span>
                  </div>
                  <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#e2e7ff] flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Penerbitan dokumen resmi berkode registrasi sah dan legalisir Lurah.</span>
                  </div>
                  <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#e2e7ff] flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Pemberitahuan notifikasi progres dokumen ke nomor pemohon via WhatsApp resmi.</span>
                  </div>
                  <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#e2e7ff] flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Tindak lanjut penanganan aduan masyarakat oleh Satgas & Linmas Kelurahan.</span>
                  </div>
                </div>
              </div>

              {/* Pasal 3 */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#006194] mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#e2e7ff] text-[#006194] flex items-center justify-center text-xs font-bold">3</span>
                  Keamanan & Perlindungan Akses
                </h4>
                <p className="text-[#3f4850] mb-2">
                  Pemerintah Kelurahan menjamin bahwa:
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-[#3f4850] pl-2">
                  <li>Data pribadi <strong>TIDAK PERNAH DIJUAL, DISEWAKAN, ATAU DIBAGIKAN</strong> kepada pihak ketiga komersial mana pun.</li>
                  <li>Akses terhadap basis data kependudukan dibatasi secara ketat hanya untuk aparatur kelurahan yang berwenang (Lurah, Sekretaris Kelurahan, Kasie Pemerintahan, dan Operator Terverifikasi).</li>
                  <li>Pertukaran data dienkripsi dengan protokol aman HTTPS/SSL standar perbankan dan pemerintahan.</li>
                </ul>
              </div>

              {/* Pasal 4 */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#006194] mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#e2e7ff] text-[#006194] flex items-center justify-center text-xs font-bold">4</span>
                  Hak Subjek Data (Masyarakat)
                </h4>
                <p className="text-[#3f4850]">
                  Setiap warga berhak mengajukan klarifikasi, pembetulan, atau penyesuaian atas data diri yang tidak akurat dalam sistem melalui loket pelayanan Kantor Kelurahan Kolongan Satu pada hari dan jam kerja dinas.
                </p>
              </div>
            </div>
          ) : (
            /* ================= KETENTUAN LAYANAN ================= */
            <div className="space-y-6">
              {/* Introduction Card */}
              <div className="p-4 bg-[#fef3c7] rounded-2xl border border-[#fde68a] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <strong className="block font-bold mb-0.5">Syarat & Ketentuan Penggunaan Portal Kelurahan</strong>
                  Dengan mengakses dan memanfaatkan fasilitas layanan daring pada portal digital Kelurahan Kolongan Satu, pengguna menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan layanan berikut ini.
                </div>
              </div>

              {/* Pasal 1 */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#006194] mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#e2e7ff] text-[#006194] flex items-center justify-center text-xs font-bold">1</span>
                  Kelayakan Pengguna & Keabsahan Data
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-[#3f4850] pl-2">
                  <li>Layanan permohonan surat ditujukan bagi warga penduduk yang berdomisili sah atau tercatat dalam wilayah administratif <strong>Kelurahan Kolongan Satu (Lingkungan I sampai V)</strong>.</li>
                  <li>Pemohon wajib mengisi data identitas diri yang valid, benar, dan dapat dipertanggungjawabkan di hadapan hukum.</li>
                  <li>Segala bentuk pemalsuan NIK, pemalsuan identitas, atau keterangan palsu merupakan pelanggaran hukum yang dapat diproses sesuai perundang-undangan pidana yang berlaku.</li>
                </ul>
              </div>

              {/* Pasal 2 */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#006194] mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#e2e7ff] text-[#006194] flex items-center justify-center text-xs font-bold">2</span>
                  Standar Operasional Pelayanan (SOP)
                </h4>
                <div className="space-y-2 text-xs text-[#3f4850]">
                  <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#e2e7ff]">
                    <strong className="text-[#131b2e] block">Waktu Verifikasi Dokumen:</strong>
                    Pengajuan surat keterangan diproses pada hari kerja (Senin–Jumat, 08.00–16.00 WITA). Estimasi penyelesaian berkisar 1×24 jam sejak berkas dinyatakan lengkap oleh petugas.
                  </div>
                  <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#e2e7ff]">
                    <strong className="text-[#131b2e] block">Legalitas Berkas:</strong>
                    Setiap dokumen surat yang diterbitkan memiliki Nomor Registrasi Surat resmi serta tanda tangan pengesahan pejabat yang berwenang. Dokumen dapat dicetak mandiri atau diambil secara fisik di kantor kelurahan.
                  </div>
                </div>
              </div>

              {/* Pasal 3 */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#006194] mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#e2e7ff] text-[#006194] flex items-center justify-center text-xs font-bold">3</span>
                  Ketentuan Layanan Aspirasi & Pengaduan Warga
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-[#3f4850] pl-2">
                  <li>Laporan masalah prasarana (lampu jalan, drainase, air bersih, sampah, ketertiban umum) harus disertai keterangan lokasi yang akurat dan foto pendukung yang relevan.</li>
                  <li>Dilarang menyampaikan laporan yang memuat unsur fitnah, ujaran kebencian, suku, agama, ras, dan antargolongan (SARA), pornografi, atau konten yang menyesatkan.</li>
                  <li>Pemerintah Kelurahan berhak menolak atau menghapus laporan yang tidak memenuhi kriteria kesantunan publik.</li>
                </ul>
              </div>

              {/* Pasal 4 */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#006194] mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#e2e7ff] text-[#006194] flex items-center justify-center text-xs font-bold">4</span>
                  Hak Cipta Data & Informasi Publik
                </h4>
                <p className="text-[#3f4850]">
                  Seluruh data monografi wilayah, grafik kependudukan, citra geospasial 3D, dan publikasi resmi pada portal ini dilindungi undang-undang hak cipta milik Pemerintah Kelurahan Kolongan Satu, Pemerintah Kota Tomohon. Pemanfaatan data untuk kajian akademis, riset, atau referensi publik diwajibkan mencantumkan sumber resmi.
                </p>
              </div>
            </div>
          )}

          {/* Official Contact Card */}
          <div className="p-4 bg-[#f2f3ff] rounded-2xl border border-[#dae2fd] text-xs text-[#3f4850] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#006194]">
              <Building2 className="w-4 h-4" />
              <span>Sekretariat Pelayanan Informasi & Pengaduan</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#535f70] shrink-0" />
              <span>Kantor Kelurahan Kolongan Satu, Jl. Zanosui / Wanua Atas, Kecamatan Tomohon Tengah, Kota Tomohon, Sulawesi Utara 95438</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#535f70] shrink-0" />
              <span>Surel Dinas: kel.kolongansatu@tomohon.go.id • Pelayanan: Senin - Jumat 08.00 - 16.00 WITA</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#dae2fd] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#71787e]">
            {activeTab === 'privacy'
              ? 'Kebijakan diperbarui secara berkala sesuai regulasi SPBE RI.'
              : 'Ketentuan ini mengikat seluruh pengguna portal publik.'}
          </div>
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
  );
}
