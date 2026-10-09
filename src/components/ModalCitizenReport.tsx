'use client';
import React, { useState, useEffect } from 'react';
import { CitizenReport } from '@/data/reportsData';
import { Official } from '@/data/officialsData';
import {
  AlertTriangle,
  X,
  CheckCircle2,
  Clock,
  Send,
  Droplets,
  Lightbulb,
  Trash2,
  Shield,
  MapPin,
  MessageSquare,
  Sparkles,
  Loader2,
  AlertCircle,
  Check,
  Phone,
  ExternalLink,
  Copy,
  Megaphone,
} from 'lucide-react';

export const PALA_WHATSAPP_CONTACTS: Record<number, { nama: string; phone: string; label: string }> = {
  1: { nama: 'Meky Mario Turangan', phone: '0813-1122-3344', label: 'Kepala Lingkungan I (Jaga 1)' },
  2: { nama: 'Devid P.N. Tasie', phone: '0813-2233-4455', label: 'Kepala Lingkungan II (Jaga 2)' },
  3: { nama: 'Agustinus Sapanany', phone: '0813-3344-5566', label: 'Kepala Lingkungan III (Jaga 3)' },
  4: { nama: 'Petronella Pusung', phone: '0813-4455-6677', label: 'Kepala Lingkungan IV (Jaga 4)' },
  5: { nama: 'Vifi Timang', phone: '0813-5566-7799', label: 'Kepala Lingkungan V (Jaga 5)' },
};

export const KELURAHAN_WHATSAPP_CENTER = {
  nama: 'Layanan Pengaduan Kelurahan Kolongan Satu',
  phone: '0812-4455-8891',
  label: 'Call Center & Posko Kelurahan',
};

interface ModalCitizenReportProps {
  isOpen: boolean;
  onClose: () => void;
  reports: CitizenReport[];
  onAddReport: (newReport: CitizenReport) => void;
  onUpdateReportStatus: (id: string, newStatus: CitizenReport['status'], tanggapan?: string) => void;
  currentOfficial?: Official;
  defaultTab?: 'daftar' | 'lapor';
}

export default function ModalCitizenReport({
  isOpen,
  onClose,
  reports,
  onAddReport,
  onUpdateReportStatus,
  currentOfficial,
  defaultTab = 'lapor',
}: ModalCitizenReportProps) {
  const [activeTab, setActiveTab] = useState<'daftar' | 'lapor'>(defaultTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Form states
  const [nama, setNama] = useState('');
  const [kontak, setKontak] = useState('');
  const [lingkunganId, setLingkunganId] = useState(1);
  const [klasifikasi, setKlasifikasi] = useState<CitizenReport['klasifikasi']>('Lampu Jalan');
  const [lokasiPatokan, setLokasiPatokan] = useState('');
  const [isiLaporan, setIsiLaporan] = useState('');
  const [targetTujuan, setTargetTujuan] = useState<'kelurahan' | 'pala'>('kelurahan');

  // Status submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastSuccess, setToastSuccess] = useState<string | null>(null);
  const [copiedPreview, setCopiedPreview] = useState(false);

  if (!isOpen) return null;

  const targetContact = targetTujuan === 'pala' ? PALA_WHATSAPP_CONTACTS[lingkunganId] : KELURAHAN_WHATSAPP_CENTER;

  // Format WhatsApp Message
  const composedWhatsAppMessage = `*PENGADUAN WARGA - KELURAHAN KOLONGAN SATU*
━━━━━━━━━━━━━━━━━━━━━━━
• *Nama Pelapor:* ${nama.trim() || '(Nama Warga)'}
• *Kontak Pelapor:* ${kontak.trim() || '-'}
• *Wilayah:* Lingkungan ${lingkunganId} (Jaga ${lingkunganId})
• *Kategori Masalah:* ${klasifikasi}
• *Lokasi / Patokan:* ${lokasiPatokan.trim() || '(Sesuai Jaga ' + lingkunganId + ')'}
• *Uraian Masalah:*
${isiLaporan.trim() || '(Belum diisi)'}
━━━━━━━━━━━━━━━━━━━━━━━
_Pesan pengaduan resmi via Website Kelurahan Kolongan Satu, Tomohon Tengah_`;

  const handleSendToWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !isiLaporan.trim()) {
      setSubmitError('Mohon lengkapi Nama Pelapor dan Uraian Masalah sebelum mengirim!');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // 1. Prepare target phone number (strip non-digits, replace 0 with 62)
      const rawPhone = targetContact.phone;
      const cleanPhone = rawPhone.replace(/[^0-9]/g, '').replace(/^0/, '62');
      const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(composedWhatsAppMessage)}`;

      // 2. Save ticket record to backend /api/lapor for kelurahan tracking
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const ticketNo = `LAPOR-KKT-${randomSuffix}`;

      const payload = {
        nama_warga: nama.trim(),
        kontak_warga: kontak.trim() || cleanPhone,
        lingkungan_id: lingkunganId,
        klasifikasi: klasifikasi,
        isi_laporan: `[WhatsApp -> ${targetContact.nama} (${targetContact.phone})] ${isiLaporan.trim()} (Patokan: ${lokasiPatokan.trim() || '-'})`,
      };

      try {
        const res = await fetch('/api/lapor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const resJson = await res.json();
          if (resJson.data) {
            onAddReport(resJson.data);
          }
        }
      } catch (err) {
        console.warn('Gagal simpan arsip tiket ke server:', err);
        // Fallback local report entry
        const fallbackReport: CitizenReport = {
          id: `rep-${Date.now()}`,
          ticketNo,
          namaWarga: nama.trim(),
          kontakWarga: kontak.trim() || '-',
          lingkunganId,
          lingkunganName: `Lingkungan ${lingkunganId}`,
          klasifikasi,
          isiLaporan: isiLaporan.trim(),
          status: 'menunggu_tanggapan',
          statusLabel: 'Terkirim ke WhatsApp',
          dilaporkanPada: new Date().toLocaleDateString('id-ID'),
        };
        onAddReport(fallbackReport);
      }

      // 3. Open WhatsApp in new tab
      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }

      setToastSuccess(`Pengaduan berhasil disiapkan! WhatsApp dibuka menuju nomor ${targetContact.nama} (${targetContact.phone}).`);
      
      // Reset form
      setNama('');
      setKontak('');
      setLokasiPatokan('');
      setIsiLaporan('');
    } catch (error: any) {
      setSubmitError(`Terjadi kesalahan: ${error.message || 'Gagal merangkai WhatsApp'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyText = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(composedWhatsAppMessage);
      setCopiedPreview(true);
      setTimeout(() => setCopiedPreview(false), 2500);
    }
  };

  const isStaff = currentOfficial && currentOfficial.roleCode !== 'publik';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#dae2fd]">
        {/* Modal Header - Civic Theme matching Landing Page */}
        <div className="p-5 md:p-6 border-b border-[#dae2fd] bg-gradient-to-r from-[#006194] to-[#004e77] text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center space-x-3.5 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs flex-shrink-0">
              <Megaphone className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Layanan Aspirasi & Aduan
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Lapor Masalah & Sarana Lingkungan
              </h2>
              <p className="text-xs text-white/80">
                Kelurahan Kolongan Satu • Tanggap Kerusakan Sarana Air, Drainase, Lampu & Kebersihan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition relative z-10 cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Success Banner */}
        {toastSuccess && (
          <div className="bg-[#006c49] text-white px-5 py-3 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top duration-200 border-b border-emerald-700">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
              <span>{toastSuccess}</span>
            </div>
            <button
              onClick={() => setToastSuccess(null)}
              className="text-emerald-100 hover:text-white ml-2 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex border-b border-[#dae2fd] bg-[#faf8ff] px-5 md:px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('daftar')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition border-b-2 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'daftar'
                ? 'bg-white border-[#006194] text-[#006194] shadow-xs'
                : 'border-transparent text-[#535f70] hover:text-[#131b2e]'
            }`}
          >
            <span>Daftar Pengaduan Warga</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'daftar' ? 'bg-[#e2e7ff] text-[#006194]' : 'bg-slate-200 text-[#535f70]'
            }`}>
              {reports.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('lapor')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition border-b-2 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'lapor'
                ? 'bg-white border-[#006194] text-[#006194] shadow-xs'
                : 'border-transparent text-[#535f70] hover:text-[#131b2e]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Kirim Laporan Baru</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-[#faf8ff]">
          {activeTab === 'daftar' && (
            <div className="space-y-3">
              {reports.map((rep) => {
                const isResolved = rep.status === 'selesai';
                const isInProgress = rep.status === 'dalam_tindakan';

                return (
                  <div
                    key={rep.id}
                    className="bg-white rounded-2xl border border-[#dae2fd] p-4 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dae2fd]/60 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#006194] bg-[#e2e7ff] px-2.5 py-1 rounded-md">
                          {rep.ticketNo}
                        </span>
                        <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                          {rep.lingkunganName}
                        </span>
                        <span className="text-xs text-[#707881]">•</span>
                        <span className="text-xs text-[#535f70]">{rep.dilaporkanPada}</span>
                      </div>

                      {/* Status */}
                      <div>
                        {isResolved ? (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Selesai Ditangani</span>
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-xs font-bold">
                            <Clock className="w-3 h-3 text-sky-600" />
                            <span>Sedang Dalam Tindakan</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Menunggu Tanggapan</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 text-xs font-semibold text-[#006194] mb-1">
                        <span>Klasifikasi: <strong>{rep.klasifikasi}</strong></span>
                        <span className="text-[#707881]">•</span>
                        <span>Pelapor: <strong className="text-[#131b2e]">{rep.namaWarga}</strong> ({rep.kontakWarga})</span>
                      </div>
                      <p className="text-xs text-[#131b2e] leading-relaxed bg-[#faf8ff] p-3 rounded-xl border border-[#dae2fd]">
                        {rep.isiLaporan}
                      </p>
                    </div>

                    {rep.disposisiKepada && (
                      <div className="text-xs text-sky-800 bg-sky-50/70 p-2.5 rounded-xl border border-sky-100">
                        <p className="font-bold text-[11px] text-sky-900">Disposisi Penanganan:</p>
                        <p className="text-sky-800">{rep.disposisiKepada}</p>
                        {rep.tanggapanPetugas && (
                          <p className="mt-1 text-[#535f70] font-normal">
                            <em>Tanggapan: {rep.tanggapanPetugas}</em>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Staff Actions */}
                    {isStaff && (
                      <div className="flex items-center justify-end space-x-2 pt-1 border-t border-[#dae2fd]/60">
                        {rep.status === 'menunggu_tanggapan' && (
                          <button
                            onClick={() => onUpdateReportStatus(rep.id, 'dalam_tindakan', 'Tim lingkungan turun ke lapangan untuk perbaikan sarana.')}
                            className="px-3.5 py-1.5 bg-[#006194] hover:bg-[#004e77] text-white text-xs font-bold rounded-xl transition"
                          >
                            Tindaklanjuti Lapangan
                          </button>
                        )}
                        {rep.status === 'dalam_tindakan' && (
                          <button
                            onClick={() => onUpdateReportStatus(rep.id, 'selesai', 'Pekerjaan perbaikan selesai dan telah difungsikan kembali.')}
                            className="px-3.5 py-1.5 bg-[#006c49] hover:bg-[#005237] text-white text-xs font-bold rounded-xl transition"
                          >
                            Tandai Telah Selesai
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'lapor' && (
            <form onSubmit={handleSendToWhatsApp} className="bg-white p-5 md:p-6 rounded-3xl border border-[#dae2fd] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#dae2fd]/60">
                <div>
                  <h3 className="text-sm font-extrabold text-[#131b2e] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006c49] animate-pulse"></span>
                    <span>Formulir Pengaduan Warga (Direct WhatsApp)</span>
                  </h3>
                  <p className="text-xs text-[#535f70] mt-0.5">
                    Pesan pengaduan akan dirangkai otomatis dan dikirim langsung ke WhatsApp resmi kelurahan / Kepala Jaga.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#006c49] bg-[#f0fdf4] px-3 py-1 rounded-full border border-[#bbf7d0] shrink-0">
                  <Phone className="w-3 h-3 text-[#006c49]" />
                  <span>WhatsApp Terintegrasi</span>
                </div>
              </div>

              {submitError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                    Nama Pelapor / Warga *
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Franky Runtuwene"
                    className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl px-3.5 py-2.5 text-xs text-[#131b2e] focus:outline-none focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                    Nomor WhatsApp / HP Pelapor
                  </label>
                  <input
                    type="tel"
                    value={kontak}
                    onChange={(e) => setKontak(e.target.value)}
                    placeholder="0812-XXXX-XXXX"
                    className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl px-3.5 py-2.5 text-xs text-[#131b2e] focus:outline-none focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                    Lokasi Lingkungan (Jaga) *
                  </label>
                  <select
                    value={lingkunganId}
                    onChange={(e) => setLingkunganId(Number(e.target.value))}
                    className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl px-3.5 py-2.5 text-xs text-[#131b2e] focus:outline-none focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 focus:bg-white transition cursor-pointer"
                  >
                    <option value={1}>Lingkungan I (Jaga 1)</option>
                    <option value={2}>Lingkungan II (Jaga 2)</option>
                    <option value={3}>Lingkungan III (Jaga 3)</option>
                    <option value={4}>Lingkungan IV (Jaga 4)</option>
                    <option value={5}>Lingkungan V (Jaga 5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                    Klasifikasi Permasalahan *
                  </label>
                  <select
                    value={klasifikasi}
                    onChange={(e) => setKlasifikasi(e.target.value as any)}
                    className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl px-3.5 py-2.5 text-xs text-[#131b2e] focus:outline-none focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 focus:bg-white transition cursor-pointer"
                  >
                    <option value="Lampu Jalan">Lampu Penerangan Jalan Umum (PJU Padam)</option>
                    <option value="Air Bersih">Air Bersih & Pipa Mata Air</option>
                    <option value="Drainase">Saluran Drainase / Saluran Air Tersumbat</option>
                    <option value="Sampah">Sampah Liar / Kebersihan Lingkungan</option>
                    <option value="Keamanan & Trantib">Keamanan, Poskamling & Trantib</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                    Lokasi Spesifik / Patokan Tempat
                  </label>
                  <input
                    type="text"
                    value={lokasiPatokan}
                    onChange={(e) => setLokasiPatokan(e.target.value)}
                    placeholder="Contoh: Depan Gereja GMIM Elohim / samping gardu PLN / lorong masuk Jaga 3..."
                    className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl px-3.5 py-2.5 text-xs text-[#131b2e] focus:outline-none focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 focus:bg-white transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                    Detail Kerusakan / Uraian Masalah *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={isiLaporan}
                    onChange={(e) => setIsiLaporan(e.target.value)}
                    placeholder="Jelaskan kondisi permasalahan secara jelas (misal: lampu padam sudah 2 malam, pipa bocor membasahi jalan, dsb)..."
                    className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl p-3.5 text-xs text-[#131b2e] focus:outline-none focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 focus:bg-white transition"
                  />
                </div>

                {/* Target WhatsApp Contact Selector */}
                <div className="md:col-span-2 bg-[#f0f9ff] p-4 rounded-2xl border border-[#bae6fd] space-y-2.5">
                  <label className="block text-xs font-bold text-[#006194]">
                    Pilih Kontak WhatsApp Tujuan Pengaduan:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <label className={`flex items-start gap-2.5 p-3 rounded-xl border transition cursor-pointer ${
                      targetTujuan === 'kelurahan'
                        ? 'bg-white border-[#006194] ring-2 ring-[#006194]/15 shadow-xs'
                        : 'bg-white/70 border-[#dae2fd] hover:bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="targetTujuan"
                        checked={targetTujuan === 'kelurahan'}
                        onChange={() => setTargetTujuan('kelurahan')}
                        className="mt-0.5 text-[#006194] focus:ring-[#006194]"
                      />
                      <div className="min-w-0 text-xs">
                        <p className="font-bold text-[#131b2e]">{KELURAHAN_WHATSAPP_CENTER.label}</p>
                        <p className="text-[11px] text-[#006194] font-semibold">{KELURAHAN_WHATSAPP_CENTER.phone}</p>
                        <p className="text-[10px] text-[#535f70]">Posko Siaga Kelurahan Kolongan Satu</p>
                      </div>
                    </label>

                    <label className={`flex items-start gap-2.5 p-3 rounded-xl border transition cursor-pointer ${
                      targetTujuan === 'pala'
                        ? 'bg-white border-[#006194] ring-2 ring-[#006194]/15 shadow-xs'
                        : 'bg-white/70 border-[#dae2fd] hover:bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="targetTujuan"
                        checked={targetTujuan === 'pala'}
                        onChange={() => setTargetTujuan('pala')}
                        className="mt-0.5 text-[#006194] focus:ring-[#006194]"
                      />
                      <div className="min-w-0 text-xs">
                        <p className="font-bold text-[#131b2e]">{PALA_WHATSAPP_CONTACTS[lingkunganId]?.label}</p>
                        <p className="text-[11px] text-[#006194] font-semibold">{PALA_WHATSAPP_CONTACTS[lingkunganId]?.phone}</p>
                        <p className="text-[10px] text-[#535f70] truncate">{PALA_WHATSAPP_CONTACTS[lingkunganId]?.nama}</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Live WhatsApp Message Preview */}
                <div className="md:col-span-2 bg-[#f4f7fb] p-4 rounded-2xl border border-[#dae2fd] space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#131b2e]">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-[#006c49]" />
                      <span>Pratinjau Format Pesan WhatsApp:</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyText}
                      className="inline-flex items-center gap-1.5 text-xs text-[#006194] hover:bg-[#e2e7ff] font-semibold bg-white px-3 py-1 rounded-xl border border-[#dae2fd] shadow-xs transition cursor-pointer"
                      title="Salin teks pesan"
                    >
                      {copiedPreview ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPreview ? 'Tersalin' : 'Salin Teks'}</span>
                    </button>
                  </div>

                  <div className="bg-[#e7fce3] p-3.5 rounded-2xl rounded-tl-xs shadow-xs border border-[#bbf7a0] text-xs text-[#0f2a1d] font-sans whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                    {composedWhatsAppMessage}
                  </div>
                  <p className="text-[11px] text-[#535f70] italic">
                    * Format di atas siap kirim. Saat Anda menekan tombol di bawah, aplikasi WhatsApp akan langsung dibuka dengan pesan yang telah terisi.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#dae2fd]/60">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold text-[#535f70] hover:bg-[#f2f3ff] hover:text-[#131b2e] border border-transparent hover:border-[#dae2fd] transition order-2 sm:order-1 cursor-pointer"
                >
                  Tutup
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-7 py-3 rounded-full text-xs font-bold bg-[#006194] hover:bg-[#004e77] text-white shadow-md shadow-[#006194]/20 transition flex items-center justify-center space-x-2 disabled:opacity-60 order-1 sm:order-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyiapkan WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>Kirim Pengaduan via WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5 text-sky-200" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
