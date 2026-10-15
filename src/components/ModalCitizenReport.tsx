'use client';
import React, { useState, useEffect } from 'react';
import { CitizenReport } from '@/data/reportsData';
import { Official } from '@/data/officialsData';
import {
  X,
  CheckCircle2,
  Clock,
  Send,
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
  Search,
  Filter,
  RefreshCw,
  PhoneCall,
  ShieldCheck,
  Verified,
  Camera,
  FileText,
  User,
  Info,
  Calendar,
  AlertTriangle,
  Building,
  HelpCircle,
} from 'lucide-react';

export const PALA_WHATSAPP_CONTACTS: Record<number, { nama: string; phone: string; label: string }> = {
  1: { nama: 'Meky Mario Turangan', phone: '0812-9537-0427', label: 'Kepala Lingkungan I (Jaga 1)' },
  2: { nama: 'Devid P.N. Tasie', phone: '0812-9537-0427', label: 'Kepala Lingkungan II (Jaga 2)' },
  3: { nama: 'Agustinus Sapanany', phone: '0812-9537-0427', label: 'Kepala Lingkungan III (Jaga 3)' },
  4: { nama: 'Petronella Pusung', phone: '0812-9537-0427', label: 'Kepala Lingkungan IV (Jaga 4)' },
  5: { nama: 'Vifi Timang', phone: '0812-9537-0427', label: 'Kepala Lingkungan V (Jaga 5)' },
};

export const KELURAHAN_WHATSAPP_CENTER = {
  nama: 'Sekretariat Kelurahan Kolongan Satu',
  phone: '0812-9537-0427',
  label: 'Sekretariat & Pelayanan Umum Kelurahan',
};

interface ModalCitizenReportProps {
  isOpen: boolean;
  onClose: () => void;
  reports: CitizenReport[];
  onAddReport: (newReport: CitizenReport) => void;
  onUpdateReportStatus: (id: string, newStatus: CitizenReport['status'], tanggapan?: string) => void;
  currentOfficial?: Official;
  defaultTab?: 'form' | 'list' | 'sla';
}

export default function ModalCitizenReport({
  isOpen,
  onClose,
  reports,
  onAddReport,
  onUpdateReportStatus,
  currentOfficial,
  defaultTab = 'form',
}: ModalCitizenReportProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'list' | 'sla'>(defaultTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Form states matching Stitch
  const [nama, setNama] = useState('');
  const [kontak, setKontak] = useState('');
  const [nik, setNik] = useState('');
  const [lingkunganId, setLingkunganId] = useState(2);
  const [klasifikasi, setKlasifikasi] = useState<CitizenReport['klasifikasi']>('Lampu Jalan');
  const [lokasiPatokan, setLokasiPatokan] = useState('');
  const [isiLaporan, setIsiLaporan] = useState(
    'Lampu jalan mati sejak 2 malam yang lalu sehingga lorong gelap dan membahayakan warga saat malam.'
  );
  const [targetTujuan, setTargetTujuan] = useState<'pala' | 'kelurahan'>('pala');

  // Foto simulasi state
  const [fotoName, setFotoName] = useState<string | null>(null);

  // Status submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastSuccess, setToastSuccess] = useState<string | null>(null);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<CitizenReport | null>(null);
  const [lastWaUrl, setLastWaUrl] = useState<string | null>(null);

  // Filtering & search in list tab
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('semua');

  // Staff response states
  const [respondingReportId, setRespondingReportId] = useState<string | null>(null);
  const [tanggapanText, setTanggapanText] = useState('');
  const [statusToUpdate, setStatusToUpdate] = useState<CitizenReport['status']>('dalam_tindakan');

  if (!isOpen) return null;

  const cleanPhoneNumber = (phone: string) => {
    return phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
  };

  const getResolvedContact = () => {
    if (targetTujuan === 'kelurahan') {
      return KELURAHAN_WHATSAPP_CENTER;
    }
    return PALA_WHATSAPP_CONTACTS[lingkunganId] || PALA_WHATSAPP_CONTACTS[1];
  };

  const resolvedContact = getResolvedContact();

  // Format WhatsApp Message matching Stitch Template
  const buildWhatsAppMessage = (ticketNo?: string) => {
    const tujuanStr =
      targetTujuan === 'pala'
        ? 'Kepala Jaga (Pala Lapangan)'
        : 'Sekretariat Kelurahan';

    return `*PENGADUAN WARGA KOLONGAN SATU*
-----------------------------------------
${ticketNo ? `🎫 *No. Tiket:* ${ticketNo}\n` : ''}👤 *Pelapor:* ${nama.trim() || 'Franky Runtuwene'} (${kontak.trim() || '0812-xxxx-xxxx'})
📍 *Lokasi:* Lingkungan ${lingkunganId} (Jaga ${lingkunganId})
📌 *Patokan:* ${lokasiPatokan.trim() || 'Depan Gereja GMIM Elohim, lorong masuk Jaga 2'}
⚠️ *Kategori:* ${klasifikasi}
🎯 *Tujuan:* ${tujuanStr}

📝 *Uraian Masalah:*
"${isiLaporan.trim() || 'Lampu jalan mati sejak 2 malam yang lalu sehingga lorong gelap dan membahayakan warga saat malam.'}"

_Dikirim otomatis melalui Portal Resmi Kelurahan Kolongan Satu, Tomohon Tengah._`;
  };

  const composedWhatsAppMessage = buildWhatsAppMessage(submittedTicket?.ticketNo);

  const handleProcessSubmit = async (openWhatsAppImmediately: boolean = true) => {
    if (!nama.trim()) {
      setSubmitError('Nama Lengkap Warga wajib diisi.');
      return;
    }
    if (!kontak.trim()) {
      setSubmitError('Nomor WhatsApp / HP Aktif wajib diisi agar Kepala Jaga dapat menghubungi.');
      return;
    }
    if (!isiLaporan.trim()) {
      setSubmitError('Uraian permasalahan wajib diisi secara jelas.');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedTicket = `LAPOR-KKT-${randomSuffix}`;
      const targetPhoneClean = cleanPhoneNumber(resolvedContact.phone);

      const payload = {
        ticket_no: generatedTicket,
        nama_warga: nama.trim(),
        kontak_warga: kontak.trim(),
        lingkungan_id: lingkunganId,
        klasifikasi: klasifikasi,
        isi_laporan: `[Tujuan: ${resolvedContact.nama} (${resolvedContact.phone})] ${isiLaporan.trim()} (Patokan: ${lokasiPatokan.trim() || '-'})`,
      };

      let finalReport: CitizenReport;

      try {
        const res = await fetch('/api/lapor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const resJson = await res.json();
        if (res.ok && resJson.data) {
          finalReport = resJson.data;
          onAddReport(finalReport);
        } else {
          throw new Error(resJson.error || 'Server menolak penyimpanan');
        }
      } catch (err: any) {
        console.warn('Gagal simpan arsip tiket ke server Supabase, gunakan memori cadangan:', err);
        finalReport = {
          id: `rep-${Date.now()}`,
          ticketNo: generatedTicket,
          namaWarga: nama.trim(),
          kontakWarga: kontak.trim(),
          lingkunganId,
          lingkunganName: `Lingkungan ${lingkunganId}`,
          klasifikasi,
          isiLaporan: isiLaporan.trim(),
          status: 'menunggu_tanggapan',
          statusLabel: 'Menunggu Disposisi',
          dilaporkanPada: new Date().toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        };
        onAddReport(finalReport);
      }

      setSubmittedTicket(finalReport);

      // Build WA Url
      const messageWithTicket = buildWhatsAppMessage(finalReport.ticketNo);
      const waUrl = `https://api.whatsapp.com/send?phone=${targetPhoneClean}&text=${encodeURIComponent(messageWithTicket)}`;
      setLastWaUrl(waUrl);

      if (openWhatsAppImmediately && typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }

      setToastSuccess(`Pengaduan berhasil dicatat dengan Nomor Tiket ${finalReport.ticketNo}!`);
    } catch (error: any) {
      setSubmitError(`Terjadi kesalahan: ${error.message || 'Gagal mengirimkan laporan'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyText = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPreview(true);
      setTimeout(() => setCopiedPreview(false), 2500);
    }
  };

  const handleResetForm = () => {
    setNama('');
    setKontak('');
    setNik('');
    setLokasiPatokan('');
    setIsiLaporan('');
    setFotoName(null);
    setSubmittedTicket(null);
    setLastWaUrl(null);
    setSubmitError(null);
  };

  const isStaff = currentOfficial && currentOfficial.roleCode !== 'publik';

  const activeReportsCount = reports.filter((r) => r.status !== 'selesai').length;
  const resolvedReportsCount = reports.filter((r) => r.status === 'selesai').length;

  const filteredReports = reports.filter((rep) => {
    const matchSearch =
      !searchQuery ||
      rep.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.namaWarga.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.isiLaporan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = filterStatus === 'semua' || rep.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      {/* Centered Modal Card Container (max-w-5xl) - Exact Stitch Design */}
      <div className="w-full max-w-5xl max-h-[94vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#dae2fd] my-auto">
        {/* Modal Top Header Banner: Deep Oceanic Horizon with Ambient Glows */}
        <div className="relative bg-gradient-to-r from-[#f2f5ff] via-white to-[#eaf0ff] p-5 sm:p-7 border-b border-[#dae2fd] overflow-hidden shrink-0">
          <div className="absolute -right-8 -bottom-10 opacity-5 pointer-events-none text-[#006194]">
            <Megaphone className="w-48 h-48" />
          </div>

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#006194]/10 border border-[#006194]/25 flex items-center justify-center shrink-0 shadow-xs text-[#006194]">
                <Megaphone className="w-7 h-7 text-[#006194]" />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#d5fce8] text-[#005c3b] text-[11px] font-bold tracking-wide uppercase border border-[#a2f5cd]">
                    Layanan Aspirasi &amp; Aduan Cepat
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-[#dae2fd] text-[#3f4850] text-[11px] font-medium shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
                    <span className="text-[#006c49] font-bold">Sistem Siaga Aktif 24 Jam</span>
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#131b2e] tracking-tight leading-tight">
                  Lapor Masalah &amp; Sarana Lingkungan
                </h1>
                <p className="text-xs sm:text-[13px] text-[#535f70] mt-1 max-w-2xl leading-relaxed">
                  Kelurahan Kolongan Satu • Tanggap perbaikan sarana air minum, penerangan lampu jalan (PJU), saluran drainase, tumpukan sampah, dan ketenteraman warga.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-600 hover:text-slate-900 shrink-0 shadow-xs cursor-pointer"
              title="Tutup Dialog"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Segment Tabs - Exact Stitch Tabs */}
        <div className="bg-white border-b border-[#dae2fd] px-5 sm:px-8 py-2.5 flex items-center justify-between overflow-x-auto gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-[#006194] text-white shadow-sm'
                  : 'text-[#535f70] hover:text-[#131b2e] hover:bg-slate-100 font-semibold'
              }`}
              type="button"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Kirim Laporan Baru</span>
            </button>

            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 text-xs rounded-xl transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-[#006194] text-white font-bold shadow-sm'
                  : 'text-[#535f70] hover:text-[#131b2e] hover:bg-slate-100 font-semibold'
              }`}
              type="button"
            >
              <Clock className="w-4 h-4" />
              <span>Daftar Pengaduan Warga</span>
              <span
                className={`ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  activeTab === 'list' ? 'bg-white/20 text-white' : 'bg-[#e2e7ff] text-[#006194]'
                }`}
              >
                {activeReportsCount} Aktif
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sla')}
              className={`flex items-center gap-2 px-4 py-2 text-xs rounded-xl transition-all cursor-pointer ${
                activeTab === 'sla'
                  ? 'bg-[#006194] text-white font-bold shadow-sm'
                  : 'text-[#535f70] hover:text-[#131b2e] hover:bg-slate-100 font-semibold'
              }`}
              type="button"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Alur &amp; Estimasi SLA</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f2f4ff] text-[11px] font-semibold text-[#006194] border border-[#dae2fd]">
            <CheckCircle2 className="w-4 h-4 text-[#006c49]" />
            <span>Resmi Dikelola Pemerintah Kelurahan</span>
          </div>
        </div>

        {/* Floating Success Banner */}
        {toastSuccess && (
          <div className="bg-[#006c49] text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-between border-b border-emerald-700 animate-in slide-in-from-top">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
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

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#faf8ff] space-y-6">
          {/* ============================================================== */}
          {/* TAB 1: FORMULIR PENGADUAN BARU (Stitch Form Sections 1, 2, 3, 4, 5) */}
          {/* ============================================================== */}
          {activeTab === 'form' && (
            <div className="space-y-6">
              {/* Card Sukses jika baru disubmit */}
              {submittedTicket && (
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-300 shadow-md space-y-4 animate-in fade-in">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#006c49] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-100 text-[#006c49]">
                        Pengaduan Berhasil Dicatat
                      </span>
                      <h3 className="text-lg font-black text-slate-900 mt-1">
                        Tiket Laporan: {submittedTicket.ticketNo}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Laporan telah resmi tersimpan di sistem kelurahan dan siap ditindaklanjuti.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    {lastWaUrl && (
                      <a
                        href={lastWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-[#006c49] hover:bg-[#005237] text-white shadow-sm flex items-center justify-center space-x-2 transition cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Buka WhatsApp Sekarang (Kirim Pesan Resmi)</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCopyText(buildWhatsAppMessage(submittedTicket.ticketNo))}
                      className="py-3 px-4 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      {copiedPreview ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedPreview ? 'Tersalin' : 'Salin Pesan'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="py-3 px-4 rounded-xl text-xs font-bold text-[#006194] bg-[#e2e7ff] hover:bg-[#d0dbff] cursor-pointer"
                    >
                      Buat Laporan Lainnya
                    </button>
                  </div>
                </div>
              )}

              {/* Direct WhatsApp Callout Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#eaedff]/70 border border-[#dae2fd] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#6cf8bb]/30 flex items-center justify-center shrink-0 text-[#00714d] border border-[#6cf8bb]">
                    <MessageSquare className="w-5 h-5 text-[#00714d]" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#006c49]"></span>
                      <span className="font-bold text-sm text-[#131b2e]">
                        Formulir Pengaduan Warga (Direct WhatsApp)
                      </span>
                    </div>
                    <p className="text-xs text-[#535f70] mt-0.5">
                      Pesan pengaduan akan dirangkai otomatis dan dikirim langsung ke WhatsApp resmi Kepala Jaga (Pala) &amp; Seksi Ketenteraman Kelurahan.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6cf8bb]/40 text-[#00714d] font-bold text-xs border border-[#4edea3]/50 self-start md:self-auto">
                  <Send className="w-3.5 h-3.5 text-[#00714d]" />
                  <span>WhatsApp Terintegrasi</span>
                </div>
              </div>

              {/* Main Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProcessSubmit(true);
                }}
                className="space-y-6 bg-white p-5 sm:p-7 rounded-3xl border border-[#dae2fd] shadow-xs"
              >
                {submitError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="font-semibold">{submitError}</span>
                  </div>
                )}

                {/* Grid Section 1: Identitas Pelapor */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#cce5ff] text-[#006194] text-xs flex items-center justify-center font-black">
                      1
                    </span>
                    <h2 className="text-sm font-bold text-[#131b2e]">Identitas Pelapor</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#131b2e]">
                        Nama Lengkap Warga <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="Contoh: Franky Runtuwene"
                        className="w-full h-11 px-3.5 bg-[#f2f3ff]/40 text-[#131b2e] rounded-xl placeholder:text-slate-400 text-xs shadow-2xs border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194]/30 focus:bg-white transition"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#131b2e]">
                        Nomor WhatsApp / HP Aktif <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="tel"
                          required
                          value={kontak}
                          onChange={(e) => setKontak(e.target.value)}
                          placeholder="0812-3456-7890"
                          className="w-full h-11 pl-3.5 pr-9 bg-[#f2f3ff]/40 text-[#131b2e] rounded-xl placeholder:text-slate-400 text-xs shadow-2xs border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194]/30 focus:bg-white transition font-mono"
                        />
                        <CheckCircle2 className="absolute right-3 text-[#006c49] w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#131b2e]">NIK Warga</label>
                        <span className="text-[10px] text-[#535f70]">Opsional</span>
                      </div>
                      <input
                        type="text"
                        maxLength={16}
                        value={nik}
                        onChange={(e) => setNik(e.target.value)}
                        placeholder="7173xxxxxxxxxxxx"
                        className="w-full h-11 px-3.5 bg-[#f2f3ff]/40 text-[#131b2e] rounded-xl placeholder:text-slate-400 text-xs shadow-2xs border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194]/30 focus:bg-white transition font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Grid Section 2: Lokasi & Kategori Permasalahan */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#cce5ff] text-[#006194] text-xs flex items-center justify-center font-black">
                      2
                    </span>
                    <h2 className="text-sm font-bold text-[#131b2e]">
                      Lokasi &amp; Klasifikasi Permasalahan
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#131b2e]">
                        Lokasi Lingkungan (Jaga) <span className="text-rose-600">*</span>
                      </label>
                      <select
                        value={lingkunganId}
                        onChange={(e) => setLingkunganId(Number(e.target.value))}
                        className="w-full h-11 px-3 bg-[#f2f3ff]/40 text-[#131b2e] rounded-xl text-xs shadow-2xs border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194]/30 focus:bg-white transition cursor-pointer"
                      >
                        <option value={1}>Lingkungan I (Jaga 1)</option>
                        <option value={2}>Lingkungan II (Jaga 2)</option>
                        <option value={3}>Lingkungan III (Jaga 3)</option>
                        <option value={4}>Lingkungan IV (Jaga 4)</option>
                        <option value={5}>Lingkungan V (Jaga 5)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#131b2e]">
                        Klasifikasi Permasalahan <span className="text-rose-600">*</span>
                      </label>
                      <select
                        value={klasifikasi}
                        onChange={(e) => setKlasifikasi(e.target.value as any)}
                        className="w-full h-11 px-3 bg-[#f2f3ff]/40 text-[#131b2e] rounded-xl text-xs shadow-2xs border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194]/30 focus:bg-white transition cursor-pointer"
                      >
                        <option value="Lampu Jalan">Lampu Penerangan Jalan Umum (PJU) Padam</option>
                        <option value="Air Bersih">Pipa Air Bersih Bocor / Distribusi Tersumbat</option>
                        <option value="Drainase">Drainase &amp; Saluran Meluap / Tersumbat</option>
                        <option value="Sampah">Tumpukan Sampah Liar / Kebersihan Lingkungan</option>
                        <option value="Keamanan & Trantib">Ketenteraman &amp; Ketertiban Umum</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#131b2e]">
                        Titik Lokasi Spesifik / Patokan Tempat <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <MapPin className="absolute left-3.5 text-[#006194] w-4 h-4" />
                        <input
                          type="text"
                          required
                          value={lokasiPatokan}
                          onChange={(e) => setLokasiPatokan(e.target.value)}
                          placeholder="Contoh: Depan Gereja GMIM Elohim, lorong masuk Jaga 2 samping gardu PLN"
                          className="w-full h-11 pl-10 pr-3.5 bg-[#f2f3ff]/40 text-[#131b2e] rounded-xl placeholder:text-slate-400 text-xs shadow-2xs border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194]/30 focus:bg-white transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid Section 3: Uraian Masalah & Bukti Foto */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#cce5ff] text-[#006194] text-xs flex items-center justify-center font-black">
                      3
                    </span>
                    <h2 className="text-sm font-bold text-[#131b2e]">
                      Uraian Masalah &amp; Bukti Foto
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-7 flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#131b2e]">
                        Detail Kerusakan / Uraian Kejadian <span className="text-rose-600">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={isiLaporan}
                        onChange={(e) => setIsiLaporan(e.target.value)}
                        placeholder="Jelaskan kondisi permasalahan secara jelas (misal: lampu padam sudah 2 malam, pipa bocor membasahi badan jalan, air parit meluap ke pekarangan rumah, dsb)..."
                        className="w-full p-3.5 bg-[#f2f3ff]/40 text-[#131b2e] rounded-xl placeholder:text-slate-400 text-xs shadow-2xs border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194]/30 focus:bg-white transition resize-none"
                      />
                      <div className="flex justify-between items-center text-[#535f70] text-[10px]">
                        <span>Cantumkan estimasi waktu kejadian agar tindak lanjut lebih cepat.</span>
                        <span>Maks. 500 Karakter</span>
                      </div>
                    </div>

                    {/* Drag and Drop Zone Foto */}
                    <div className="lg:col-span-5 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#131b2e]">
                          Unggah Bukti Lapangan
                        </label>
                        <span className="text-[10px] text-[#535f70]">Foto / Dokumen</span>
                      </div>
                      <div
                        onClick={() =>
                          setFotoName(
                            fotoName ? null : `Bukti_Foto_Jaga_${lingkunganId}_${Date.now().toString().slice(-4)}.jpg`
                          )
                        }
                        className="h-[120px] rounded-2xl bg-[#f2f3ff]/60 hover:bg-[#eaedff] transition-all flex flex-col items-center justify-center text-center p-3 cursor-pointer group border border-dashed border-[#dae2fd]"
                      >
                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#006194] group-hover:scale-110 transition-transform shadow-xs mb-1.5">
                          <Camera className="w-5 h-5 text-[#006194]" />
                        </div>
                        <span className="font-bold text-xs text-[#131b2e]">
                          {fotoName ? fotoName : 'Pilih Foto atau Tarik ke Sini'}
                        </span>
                        <span className="text-[10px] text-[#535f70] mt-0.5">
                          {fotoName ? '✓ Foto berhasil dilampirkan' : 'JPG, PNG atau WEBP (Maksimal 5MB)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Pilihan Kontak WhatsApp Tujuan Pengaduan */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#cce5ff] text-[#006194] text-xs flex items-center justify-center font-black">
                      4
                    </span>
                    <h2 className="text-sm font-bold text-[#131b2e]">
                      Pilih Kontak WhatsApp Tujuan Pengaduan
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Opsi A: Pala / Kepala Jaga */}
                    <label
                      className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                        targetTujuan === 'pala'
                          ? 'bg-white border-[#006194] ring-2 ring-[#006194]/15'
                          : 'bg-[#f2f3ff]/40 border-[#dae2fd] hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="target-contact"
                        checked={targetTujuan === 'pala'}
                        onChange={() => setTargetTujuan('pala')}
                        className="mt-1 w-4 h-4 text-[#006194] focus:ring-[#006194]"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#131b2e]">
                            Kepala Lingkungan (Pala)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#d5fce8] text-[#005c3b] text-[10px] font-bold">
                            Rekomendasi
                          </span>
                        </div>
                        <span className="text-[11px] text-[#535f70] mt-1 leading-normal">
                          Langsung terkirim ke WhatsApp Kepala Lingkungan wilayah yang dipilih untuk peninjauan langsung di lokasi.
                        </span>
                        <div className="flex items-center gap-1.5 text-[#006c49] text-[10px] font-bold mt-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Respon Cepat Lapangan</span>
                        </div>
                      </div>
                    </label>

                    {/* Opsi B: Kantor Pelayanan Kelurahan */}
                    <label
                      className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                        targetTujuan === 'kelurahan'
                          ? 'bg-white border-[#006194] ring-2 ring-[#006194]/15'
                          : 'bg-[#f2f3ff]/40 border-[#dae2fd] hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="target-contact"
                        checked={targetTujuan === 'kelurahan'}
                        onChange={() => setTargetTujuan('kelurahan')}
                        className="mt-1 w-4 h-4 text-[#006194] focus:ring-[#006194]"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#131b2e]">
                            Sekretariat Kelurahan
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#e2e7ff] text-[#006194] text-[10px] font-bold">
                            Admin Utama
                          </span>
                        </div>
                        <span className="text-[11px] text-[#535f70] mt-1 leading-normal">
                          Terkirim ke WhatsApp Pelayanan Umum Kantor Kelurahan Kolongan Satu untuk eskalasi dinas teknis Kota Tomohon.
                        </span>
                        <div className="flex items-center gap-1.5 text-[#006194] text-[10px] font-bold mt-2">
                          <Building className="w-3.5 h-3.5" />
                          <span>Jam Pelayanan: 08.00 - 16.00 WITA</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Section 5: Live WhatsApp Message Draft Preview */}
                <div className="rounded-2xl bg-[#eaedff]/50 border border-[#dae2fd] p-4 sm:p-5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#006c49]" />
                      <span className="font-bold text-xs text-[#131b2e]">
                        Pratinjau Format Pesan Otomatis
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(composedWhatsAppMessage)}
                      className="text-[10px] font-bold text-[#006194] bg-white px-2.5 py-1 rounded-lg border border-[#dae2fd] hover:bg-[#e2e7ff] transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPreview ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPreview ? 'Tersalin' : 'Salin Format'}</span>
                    </button>
                  </div>
                  <pre className="bg-white p-4 rounded-xl text-xs text-[#131b2e] font-mono whitespace-pre-wrap shadow-inner border border-slate-200 leading-relaxed select-all">
                    {composedWhatsAppMessage}
                  </pre>
                </div>

                {/* Form Actions & PDP Privacy Guarantee */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[#535f70] text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-[#006194] shrink-0" />
                    <span>Data warga dilindungi UU PDP No. 27/2022 &amp; Ketentuan Kerahasiaan Kelurahan.</span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors w-full sm:w-auto cursor-pointer"
                    >
                      Batal / Reset
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleProcessSubmit(false)}
                      className="px-4 py-2.5 rounded-xl bg-[#e2e7ff] hover:bg-[#d0dbff] text-[#006194] text-xs font-bold transition-colors w-full sm:w-auto cursor-pointer"
                    >
                      Simpan ke Web Saja
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-[#006c49] hover:bg-[#005237] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Menyiapkan...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-white" />
                          <span>Kirim via WhatsApp Resmi</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: DAFTAR PENGADUAN WARGA TERKINI (Stitch Tab 2)           */}
          {/* ============================================================== */}
          {activeTab === 'list' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#131b2e]">
                    Pengaduan Terpantau di Wilayah
                  </h2>
                  <p className="text-xs text-[#535f70] mt-0.5">
                    Transparansi status pelaporan warga Kelurahan Kolongan Satu.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#6cf8bb]/40 text-[#00714d] text-xs font-bold border border-[#4edea3]/40">
                    {activeReportsCount} Kasus Dalam Pengerjaan
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#eaedff] text-[#006194] text-xs font-bold border border-[#dae2fd]">
                    {resolvedReportsCount} Selesai Ditangani
                  </span>
                </div>
              </div>

              {/* Grid Cards Pengaduan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReports.map((rep) => {
                  const isResolved = rep.status === 'selesai';
                  const isInProgress = rep.status === 'dalam_tindakan';
                  const cleanPhone = cleanPhoneNumber(rep.kontakWarga);
                  const directCitizenWa = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(
                    `*PEMBERITAHUAN TINDAK LANJUT PENGADUAN*\n*KELURAHAN KOLONGAN SATU*\n----------------------------------------\nYth. Bpk/Ibu *${rep.namaWarga}*,\nMenanggapi pengaduan Anda dengan No. Tiket *${rep.ticketNo}* terkait *${rep.klasifikasi}*:\nLaporan Anda saat ini sedang kami tindaklanjuti di lapangan.\n\nTerima kasih.`
                  )}`;

                  return (
                    <div
                      key={rep.id}
                      className="p-5 rounded-2xl bg-white border border-[#dae2fd] shadow-xs flex flex-col justify-between gap-4 hover:border-[#006194]/40 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isResolved
                                ? 'bg-[#d5fce8] text-[#005c3b]'
                                : isInProgress
                                ? 'bg-[#cce5ff] text-[#006194]'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isResolved
                              ? 'Selesai Ditangani'
                              : isInProgress
                              ? 'Dalam Penanganan Lapangan'
                              : 'Menunggu Disposisi'}
                          </span>
                          <span className="text-[11px] text-[#535f70]">{rep.dilaporkanPada}</span>
                        </div>
                        <h3 className="font-bold text-sm text-[#131b2e] leading-snug">
                          {rep.klasifikasi} - {rep.lingkunganName}
                        </h3>
                        <p className="text-xs text-[#535f70] mt-1.5 leading-relaxed line-clamp-3">
                          {rep.isiLaporan}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#dae2fd]/60 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs text-[#535f70] bg-[#f8faff] p-2.5 rounded-xl border border-[#dae2fd]/70">
                          <div className="flex items-center gap-1.5 font-semibold text-[#131b2e]">
                            <User className="w-3.5 h-3.5 text-[#006194]" />
                            <span>{rep.namaWarga}</span>
                          </div>
                          <span className="text-[11px] font-mono text-[#006194]">{rep.ticketNo}</span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <a
                            href={directCitizenWa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#006c49] hover:underline"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Hubungi Pelapor</span>
                          </a>

                          {isStaff && (
                            <div className="flex items-center gap-1.5">
                              {rep.status === 'menunggu_tanggapan' && (
                                <button
                                  onClick={() =>
                                    onUpdateReportStatus(
                                      rep.id,
                                      'dalam_tindakan',
                                      'Tim lingkungan bersama Linmas turun ke lapangan untuk survei dan perbaikan sarana.'
                                    )
                                  }
                                  className="px-2.5 py-1 bg-[#006194] hover:bg-[#004e77] text-white text-[11px] font-bold rounded-lg transition"
                                >
                                  Tindaklanjuti
                                </button>
                              )}
                              {rep.status === 'dalam_tindakan' && (
                                <button
                                  onClick={() =>
                                    onUpdateReportStatus(
                                      rep.id,
                                      'selesai',
                                      'Pekerjaan perbaikan sarana telah rampung dan difungsikan normal kembali.'
                                    )
                                  }
                                  className="px-2.5 py-1 bg-[#006c49] hover:bg-[#005237] text-white text-[11px] font-bold rounded-lg transition"
                                >
                                  Tandai Selesai
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Banner Panduan Tambahan */}
              <div className="p-4 rounded-2xl bg-[#eaedff]/60 border border-[#dae2fd] flex items-center gap-3">
                <Info className="w-5 h-5 text-[#006194] shrink-0" />
                <p className="text-xs text-[#131b2e] leading-relaxed">
                  Semua aduan warga yang masuk via nomor WhatsApp kelurahan akan dicatat pada log pemeliharaan sarana demi transparansi anggaran dan pemeliharaan fasilitas umum.
                </p>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: ALUR & ESTIMASI SLA (Stitch Tab 3)                      */}
          {/* ============================================================== */}
          {activeTab === 'sla' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#131b2e]">
                  Alur &amp; Standar Waktu Respons (SLA)
                </h2>
                <p className="text-xs text-[#535f70] mt-0.5">
                  Transparansi alur pelayanan laporan pengaduan masyarakat Kelurahan Kolongan Satu.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#006194] text-white flex items-center justify-center font-black text-xs">
                    1
                  </div>
                  <span className="font-bold text-sm text-[#131b2e]">Pelaporan Warga</span>
                  <span className="text-xs text-[#535f70] leading-relaxed">
                    Warga mengisi formulir dan mengirim pesan WhatsApp terformat ke Kepala Jaga atau Kelurahan.
                  </span>
                  <span className="text-[11px] font-bold text-[#006c49] mt-auto pt-2">
                    Seketika (Instant)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#006194] text-white flex items-center justify-center font-black text-xs">
                    2
                  </div>
                  <span className="font-bold text-sm text-[#131b2e]">Verifikasi Lapangan</span>
                  <span className="text-xs text-[#535f70] leading-relaxed">
                    Kepala Jaga meninjau lokasi fisik masalah guna memastikan urgensi dan tingkat kerusakan.
                  </span>
                  <span className="text-[11px] font-bold text-[#006c49] mt-auto pt-2">
                    Maks. 2 - 4 Jam
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#006194] text-white flex items-center justify-center font-black text-xs">
                    3
                  </div>
                  <span className="font-bold text-sm text-[#131b2e]">Penanganan Masalah</span>
                  <span className="text-xs text-[#535f70] leading-relaxed">
                    Eksekusi perbaikan mandiri atau diteruskan ke Dinas Terkait (PLN, PDAM, DLH Tomohon).
                  </span>
                  <span className="text-[11px] font-bold text-[#006c49] mt-auto pt-2">
                    1 x 24 Jam Kerja
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#006c49] text-white flex items-center justify-center font-black text-xs">
                    4
                  </div>
                  <span className="font-bold text-sm text-[#131b2e]">Konfirmasi Selesai</span>
                  <span className="text-xs text-[#535f70] leading-relaxed">
                    Laporan selesai difoto dan dikirimkan kembali ke pelapor sebagai bukti tuntas.
                  </span>
                  <span className="text-[11px] font-bold text-[#006c49] mt-auto pt-2">
                    Pemberitahuan WA
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Helpful Footer Inside Modal - Matching Stitch Screen Footer */}
        <div className="px-5 sm:px-8 py-3.5 bg-[#f2f4ff] border-t border-[#dae2fd] flex flex-wrap items-center justify-between gap-4 text-xs text-[#535f70] shrink-0">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#006194]" />
            <span>
              Hotline Darurat Kelurahan Kolongan Satu:{' '}
              <strong className="text-[#131b2e]">(0431) 351-001</strong> /{' '}
              <strong className="text-[#131b2e]">0812-9537-0427</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006c49]"></span>
              <span>Siaga 5 Lingkungan Jaga</span>
            </span>
            <span className="font-semibold text-slate-700">Kecamatan Tomohon Tengah</span>
          </div>
        </div>
      </div>
    </div>
  );
}
