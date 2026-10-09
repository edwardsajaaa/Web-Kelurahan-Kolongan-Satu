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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-rose-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Lapor Masalah & Sarana Lingkungan</h2>
              <p className="text-xs text-slate-300">
                Layanan Cepat Tanggap Kerusakan Sarana Air, Drainase, Lampu & Kebersihan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Success Banner */}
        {toastSuccess && (
          <div className="bg-emerald-600 text-white px-5 py-3 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top duration-200">
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
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('daftar')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'daftar'
                ? 'bg-white border-rose-600 text-rose-800 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Daftar Pengaduan Warga</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-bold">
              {reports.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('lapor')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'lapor'
                ? 'bg-white border-rose-600 text-rose-800 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Kirim Laporan Baru</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-slate-50/50">
          {activeTab === 'daftar' && (
            <div className="space-y-3">
              {reports.map((rep) => {
                const isResolved = rep.status === 'selesai';
                const isInProgress = rep.status === 'dalam_tindakan';

                return (
                  <div
                    key={rep.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {rep.ticketNo}
                        </span>
                        <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                          {rep.lingkunganName}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{rep.dilaporkanPada}</span>
                      </div>

                      {/* Status */}
                      <div>
                        {isResolved ? (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Selesai Ditangani</span>
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-300 rounded-full text-xs font-bold">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Sedang Dalam Tindakan</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-300 rounded-full text-xs font-bold">
                            <Clock className="w-3 h-3 text-rose-600" />
                            <span>Menunggu Disposisi</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 text-xs font-semibold text-rose-700 mb-1">
                        <span>Klasifikasi: <strong>{rep.klasifikasi}</strong></span>
                        <span className="text-slate-400">•</span>
                        <span>Pelapor: <strong className="text-slate-800">{rep.namaWarga}</strong> ({rep.kontakWarga})</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {rep.isiLaporan}
                      </p>
                    </div>

                    {rep.disposisiKepada && (
                      <div className="text-xs text-indigo-700 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
                        <p className="font-bold text-[11px] text-indigo-900">Disposisi Penanganan:</p>
                        <p className="text-indigo-800">{rep.disposisiKepada}</p>
                        {rep.tanggapanPetugas && (
                          <p className="mt-1 text-slate-600 font-normal">
                            <em>Tanggapan: {rep.tanggapanPetugas}</em>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Staff Actions */}
                    {isStaff && (
                      <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-100">
                        {rep.status === 'menunggu_tanggapan' && (
                          <button
                            onClick={() => onUpdateReportStatus(rep.id, 'dalam_tindakan', 'Tim lingkungan turun ke lapangan untuk perbaikan sarana.')}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition"
                          >
                            Tindaklanjuti Lapangan
                          </button>
                        )}
                        {rep.status === 'dalam_tindakan' && (
                          <button
                            onClick={() => onUpdateReportStatus(rep.id, 'selesai', 'Pekerjaan perbaikan selesai dan telah difungsikan kembali.')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
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
            <form onSubmit={handleSendToWhatsApp} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Formulir Pengaduan Warga (Direct WhatsApp)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pesan pengaduan akan dirangkai otomatis dan dikirim langsung ke WhatsApp resmi kelurahan / Kepala Jaga.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>WhatsApp Terintegrasi</span>
                </div>
              </div>

              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Pelapor / Warga *
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Franky Runtuwene"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / HP Pelapor
                  </label>
                  <input
                    type="tel"
                    value={kontak}
                    onChange={(e) => setKontak(e.target.value)}
                    placeholder="0812-XXXX-XXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lokasi Lingkungan (Jaga) *
                  </label>
                  <select
                    value={lingkunganId}
                    onChange={(e) => setLingkunganId(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition cursor-pointer"
                  >
                    <option value={1}>Lingkungan I (Jaga 1)</option>
                    <option value={2}>Lingkungan II (Jaga 2)</option>
                    <option value={3}>Lingkungan III (Jaga 3)</option>
                    <option value={4}>Lingkungan IV (Jaga 4)</option>
                    <option value={5}>Lingkungan V (Jaga 5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Klasifikasi Permasalahan *
                  </label>
                  <select
                    value={klasifikasi}
                    onChange={(e) => setKlasifikasi(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition cursor-pointer"
                  >
                    <option value="Lampu Jalan">Lampu Penerangan Jalan Umum (PJU Padam)</option>
                    <option value="Air Bersih">Air Bersih & Pipa Mata Air</option>
                    <option value="Drainase">Saluran Drainase / Saluran Air Tersumbat</option>
                    <option value="Sampah">Sampah Liar / Kebersihan Lingkungan</option>
                    <option value="Keamanan & Trantib">Keamanan, Poskamling & Trantib</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lokasi Spesifik / Patokan Tempat
                  </label>
                  <input
                    type="text"
                    value={lokasiPatokan}
                    onChange={(e) => setLokasiPatokan(e.target.value)}
                    placeholder="Contoh: Depan Gereja GMIM Elohim / samping gardu PLN / lorong masuk Jaga 3..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Detail Kerusakan / Uraian Masalah *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={isiLaporan}
                    onChange={(e) => setIsiLaporan(e.target.value)}
                    placeholder="Jelaskan kondisi permasalahan secara jelas (misal: lampu padam sudah 2 malam, pipa bocor membasahi jalan, dsb)..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                {/* Target WhatsApp Contact Selector */}
                <div className="md:col-span-2 bg-[#f2fbf6] p-3.5 rounded-xl border border-emerald-200/80 space-y-2">
                  <label className="block text-xs font-bold text-[#006c49]">
                    Kirim Pengaduan Menuju Nomor WhatsApp:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition cursor-pointer ${
                      targetTujuan === 'kelurahan'
                        ? 'bg-white border-emerald-600 shadow-xs'
                        : 'bg-white/60 border-slate-200 hover:bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="targetTujuan"
                        checked={targetTujuan === 'kelurahan'}
                        onChange={() => setTargetTujuan('kelurahan')}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="min-w-0 text-xs">
                        <p className="font-bold text-slate-900">{KELURAHAN_WHATSAPP_CENTER.label}</p>
                        <p className="text-[11px] text-emerald-800 font-semibold">{KELURAHAN_WHATSAPP_CENTER.phone}</p>
                        <p className="text-[10px] text-slate-500">Posko Kelurahan Kolongan Satu</p>
                      </div>
                    </label>

                    <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition cursor-pointer ${
                      targetTujuan === 'pala'
                        ? 'bg-white border-emerald-600 shadow-xs'
                        : 'bg-white/60 border-slate-200 hover:bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="targetTujuan"
                        checked={targetTujuan === 'pala'}
                        onChange={() => setTargetTujuan('pala')}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="min-w-0 text-xs">
                        <p className="font-bold text-slate-900">{PALA_WHATSAPP_CONTACTS[lingkunganId]?.label}</p>
                        <p className="text-[11px] text-emerald-800 font-semibold">{PALA_WHATSAPP_CONTACTS[lingkunganId]?.phone}</p>
                        <p className="text-[10px] text-slate-500 truncate">{PALA_WHATSAPP_CONTACTS[lingkunganId]?.nama}</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Live WhatsApp Message Preview */}
                <div className="md:col-span-2 bg-[#efeae2] p-4 rounded-2xl border border-[#d1c7b7] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Pratinjau Format Pesan WhatsApp:</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyText}
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold bg-white/70 hover:bg-white px-2 py-0.5 rounded-lg border border-slate-300 transition"
                      title="Salin teks pesan"
                    >
                      {copiedPreview ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPreview ? 'Tersalin' : 'Salin Teks'}</span>
                    </button>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200/80 text-xs text-slate-800 font-sans whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                    {composedWhatsAppMessage}
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    * Pesan di atas akan langsung terbuka di aplikasi / web WhatsApp saat Anda mengklik tombol di bawah.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 order-2 sm:order-1"
                >
                  Tutup
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-[#006c49] hover:bg-[#005237] text-white shadow-md shadow-emerald-900/20 transition flex items-center justify-center space-x-2 disabled:opacity-60 order-1 sm:order-2 cursor-pointer"
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
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
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
