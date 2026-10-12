'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ArrowLeft,
  FileSpreadsheet,
  BookOpen,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { CitizenReport, INITIAL_REPORTS } from '@/data/reportsData';
import { PALA_WHATSAPP_CONTACTS, KELURAHAN_WHATSAPP_CENTER } from '@/components/ModalCitizenReport';

export default function LaporPage() {
  const [activeTab, setActiveTab] = useState<'form' | 'list' | 'sla'>('form');

  // Form states matching Stitch template
  const [nama, setNama] = useState('Franky Runtuwene');
  const [kontak, setKontak] = useState('0812-3456-7890');
  const [nik, setNik] = useState('7173xxxxxxxxxxxx');
  const [lingkunganId, setLingkunganId] = useState(2);
  const [klasifikasi, setKlasifikasi] = useState<string>('Lampu Penerangan Jalan Umum (PJU) Padam');
  const [lokasiPatokan, setLokasiPatokan] = useState(
    'Depan Gereja GMIM Elohim, lorong masuk Jaga 2 samping gardu PLN'
  );
  const [isiLaporan, setIsiLaporan] = useState(
    'Lampu jalan mati sejak 2 malam yang lalu sehingga lorong gelap dan membahayakan warga saat malam.'
  );
  const [targetTujuan, setTargetTujuan] = useState<'pala' | 'kelurahan' | 'custom'>('pala');
  const [customPhone, setCustomPhone] = useState('');
  const [showCustomPhone, setShowCustomPhone] = useState(false);

  // Foto simulasi state
  const [fotoName, setFotoName] = useState<string | null>(null);

  // Submission states
  const [reports, setReports] = useState<CitizenReport[]>(INITIAL_REPORTS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastSuccess, setToastSuccess] = useState<string | null>(null);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<CitizenReport | null>(null);
  const [lastWaUrl, setLastWaUrl] = useState<string | null>(null);

  const cleanPhoneNumber = (phone: string) => {
    return phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
  };

  const getResolvedContact = () => {
    if (targetTujuan === 'custom') {
      return {
        nama: 'Nomor Uji Coba Kustom',
        phone: customPhone.trim() || '0812-0000-0000',
        label: 'Uji Coba Kirim ke Nomor Kustom',
      };
    }
    if (targetTujuan === 'kelurahan') {
      return KELURAHAN_WHATSAPP_CENTER;
    }
    return PALA_WHATSAPP_CONTACTS[lingkunganId] || PALA_WHATSAPP_CONTACTS[1];
  };

  const resolvedContact = getResolvedContact();

  const buildWhatsAppMessage = (ticketNo?: string) => {
    const tujuanStr =
      targetTujuan === 'pala'
        ? 'Kepala Jaga (Pala Lapangan)'
        : targetTujuan === 'kelurahan'
        ? 'Sekretariat Kelurahan'
        : `Uji Coba (${customPhone || 'Nomor Bebas'})`;

    return `*PENGADUAN WARGA KOLONGAN SATU*
-----------------------------------------
${ticketNo ? `🎫 *No. Tiket:* ${ticketNo}\n` : ''}👤 *Pelapor:* ${nama.trim() || 'Franky Runtuwene'} (${kontak.trim() || '0812-xxxx-xxxx'})
📍 *Lokasi:* Lingkungan ${lingkunganId === 1 ? 'I (Jaga 1)' : lingkunganId === 2 ? 'II (Jaga 2)' : lingkunganId === 3 ? 'III (Jaga 3)' : lingkunganId === 4 ? 'IV (Jaga 4)' : 'V (Jaga 5)'}
📌 *Patokan:* ${lokasiPatokan.trim() || 'Depan Gereja GMIM Elohim, lorong masuk Jaga 2'}
⚠️ *Kategori:* ${klasifikasi}
🎯 *Tujuan:* ${tujuanStr}

📝 *Uraian Masalah:*
"${isiLaporan.trim() || 'Lampu jalan mati sejak 2 malam yang lalu sehingga lorong gelap dan membahayakan warga saat malam.'}"

_Dikirim otomatis melalui Portal Resmi Kelurahan Kolongan Satu, Tomohon Tengah._`;
  };

  const composedWhatsAppMessage = buildWhatsAppMessage(submittedTicket?.ticketNo);

  const handleProcessSubmit = async () => {
    if (!nama.trim()) {
      setSubmitError('Nama Lengkap Warga wajib diisi.');
      return;
    }
    if (!kontak.trim()) {
      setSubmitError('Nomor WhatsApp / HP Aktif wajib diisi.');
      return;
    }
    if (!isiLaporan.trim()) {
      setSubmitError('Uraian permasalahan wajib diisi.');
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
        isi_laporan: `[Tujuan: ${resolvedContact.nama}] ${isiLaporan.trim()} (Patokan: ${lokasiPatokan.trim() || '-'})`,
      };

      try {
        await fetch('/api/lapor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        console.warn('Simpan backend offline:', e);
      }

      const newRep: CitizenReport = {
        id: `rep-${Date.now()}`,
        ticketNo: generatedTicket,
        namaWarga: nama.trim(),
        kontakWarga: kontak.trim(),
        lingkunganId,
        lingkunganName: `Lingkungan ${lingkunganId}`,
        klasifikasi: (klasifikasi as any) || 'Lampu Jalan',
        isiLaporan: isiLaporan.trim(),
        status: 'menunggu_tanggapan',
        statusLabel: 'Menunggu Disposisi',
        dilaporkanPada: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      };

      setReports((prev) => [newRep, ...prev]);
      setSubmittedTicket(newRep);

      const messageWithTicket = buildWhatsAppMessage(newRep.ticketNo);
      const waUrl = `https://api.whatsapp.com/send?phone=${targetPhoneClean}&text=${encodeURIComponent(messageWithTicket)}`;
      setLastWaUrl(waUrl);

      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }

      setToastSuccess(`Pengaduan berhasil dikirim dengan Nomor Tiket ${newRep.ticketNo}!`);
    } catch (err: any) {
      setSubmitError(err.message || 'Gagal mengirim pengaduan');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col font-sans text-slate-800 antialiased selection:bg-[#006194]/20 selection:text-[#006194]">
      {/* 1. Header Navbar Atas Sesuai Desain Stitch */}
      <header className="w-full bg-white border-b border-[#dae2fd]/70 shadow-2xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Judul Instansi */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#006194]/10 border border-[#006194]/20 flex items-center justify-center text-[#006194] group-hover:bg-[#006194] group-hover:text-white transition shadow-2xs">
              <Building className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 group-hover:text-[#006194] transition leading-tight">
                Pusat Rekapitulasi &amp; Pelayanan Persuratan
              </span>
              <span className="text-xs text-slate-500">
                Kelurahan Kolongan Satu • Tomohon Tengah
              </span>
            </div>
          </Link>

          {/* Navigasi Utama */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-[#006194] transition">
              Rekap &amp; Antrean
            </Link>
            <Link href="/" className="hover:text-[#006194] transition">
              Katalog &amp; Syarat
            </Link>
            <Link href="/" className="hover:text-[#006194] transition">
              Ajukan Mandiri
            </Link>
            <Link href="/" className="hover:text-[#006194] transition">
              Lacak Resi
            </Link>
          </nav>

          {/* Status Loket & Operator Info */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d5fce8] text-[#005c3b] text-xs font-bold border border-[#a2f5cd]">
              <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
              <span>Loket Pelayanan Aktif</span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center text-slate-600 font-bold text-xs">
                OP
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight">Operator Kelurahan</span>
                <span className="text-[10px] text-slate-500 font-mono">NIP. 19850412...</span>
              </div>
              <Link
                href="/"
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition ml-1"
                title="Kembali ke Beranda"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Container Halaman Utama dengan Ambient Backdrop & Cardstitch */}
      <main className="flex-1 py-8 px-3 sm:px-6 lg:px-8 flex justify-center items-start relative">
        {/* Glow ambient background */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#006194]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#006c49]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* ============================================================== */}
        {/* CENTERED MODAL / CARD CONTAINER (max-w-5xl) - PERSIS GAMBAR    */}
        {/* ============================================================== */}
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col border border-[#dae2fd] relative z-10">
          {/* Header Banner: Deep Oceanic Horizon */}
          <div className="relative bg-gradient-to-r from-[#f2f5ff] via-white to-[#eaf0ff] p-6 lg:p-8 border-b border-[#dae2fd] overflow-hidden">
            {/* Watermark megaphone di pojok kanan belakang */}
            <div className="absolute -right-6 -bottom-10 opacity-5 pointer-events-none text-[#006194]">
              <Megaphone className="w-44 h-44" />
            </div>

            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#006194]/10 border border-[#006194]/25 flex items-center justify-center shrink-0 shadow-2xs text-[#006194]">
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
                  <p className="text-xs sm:text-[13px] text-[#535f70] mt-1.5 max-w-2xl leading-relaxed">
                    Kelurahan Kolongan Satu • Tanggap perbaikan sarana air minum, penerangan lampu jalan (PJU), saluran drainase, tumpukan sampah, dan ketenteraman warga.
                  </p>
                </div>
              </div>

              <Link
                href="/"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-600 hover:text-slate-900 shrink-0 shadow-xs cursor-pointer"
                title="Tutup & Kembali"
              >
                <X className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Navigation Segment Tabs */}
          <div className="bg-white border-b border-[#dae2fd] px-6 lg:px-8 py-2.5 flex items-center justify-between overflow-x-auto gap-4">
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
                    activeTab === 'list' ? 'bg-white/20 text-white' : 'bg-[#6ee7b7]/40 text-[#065f46]'
                  }`}
                >
                  2 Aktif
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

            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f4ff] text-[11px] font-semibold text-[#006194] border border-[#dae2fd]">
              <CheckCircle2 className="w-4 h-4 text-[#006c49]" />
              <span>Resmi Dikelola Pemerintah Kelurahan</span>
            </div>
          </div>

          {/* TAB 1: FORMULIR PENGADUAN BARU */}
          {activeTab === 'form' && (
            <div className="p-6 lg:p-8 space-y-6">
              {/* Direct WhatsApp Callout Banner */}
              <div className="p-4 lg:p-5 rounded-2xl bg-[#ecfdf5] border border-[#bbf7d0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#a7f3d0] flex items-center justify-center shrink-0 text-[#065f46]">
                    <MessageSquare className="w-5 h-5 text-[#065f46]" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                      <span className="font-bold text-sm text-[#131b2e]">
                        Formulir Pengaduan Warga (Direct WhatsApp)
                      </span>
                    </div>
                    <p className="text-xs text-[#535f70] mt-0.5">
                      Pesan pengaduan akan dirangkai otomatis dan dikirim langsung ke WhatsApp resmi Kepala Jaga (Pala) &amp; Seksi Ketenteraman Kelurahan.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#a7f3d0] text-[#065f46] font-bold text-xs border border-[#6ee7b7]/50 self-start md:self-auto shadow-2xs">
                  <Send className="w-3.5 h-3.5 text-[#065f46]" />
                  <span>WhatsApp Terintegrasi</span>
                </div>
              </div>

              {/* Main Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProcessSubmit();
                }}
                className="space-y-6"
              >
                {submitError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="font-semibold">{submitError}</span>
                  </div>
                )}

                {/* 1. Identitas Pelapor */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-[#e0f2fe] text-[#0284c7] font-bold text-xs flex items-center justify-center">
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
                        className="w-full h-11 px-3.5 bg-white text-[#131b2e] rounded-xl placeholder:text-slate-400 text-xs shadow-2xs border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194]/30 transition"
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
                          className="w-full h-11 pl-3.5 pr-10 bg-white text-[#131b2e] rounded-xl placeholder:text-slate-400 text-xs shadow-2xs border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194]/30 transition font-mono"
                        />
                        <ShieldCheck className="absolute right-3 text-[#10b981] w-4 h-4" />
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
                        className="w-full h-11 px-3.5 bg-white text-[#131b2e] rounded-xl placeholder:text-slate-400 text-xs shadow-2xs border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194]/30 transition font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Lokasi & Klasifikasi Permasalahan */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-[#e0f2fe] text-[#0284c7] font-bold text-xs flex items-center justify-center">
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
                        className="w-full h-11 px-3 bg-white text-[#131b2e] rounded-xl text-xs shadow-2xs border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194]/30 transition cursor-pointer"
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
                        onChange={(e) => setKlasifikasi(e.target.value)}
                        className="w-full h-11 px-3 bg-white text-[#131b2e] rounded-xl text-xs shadow-2xs border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194]/30 transition cursor-pointer"
                      >
                        <option value="Lampu Penerangan Jalan Umum (PJU) Padam">
                          Lampu Penerangan Jalan Umum (PJU) Padam
                        </option>
                        <option value="Pipa Air Bersih Bocor / Distribusi Tersumbat">
                          Pipa Air Bersih Bocor / Distribusi Tersumbat
                        </option>
                        <option value="Drainase & Saluran Meluap / Tersumbat">
                          Drainase &amp; Saluran Meluap / Tersumbat
                        </option>
                        <option value="Tumpukan Sampah Liar / Kebersihan Lingkungan">
                          Tumpukan Sampah Liar / Kebersihan Lingkungan
                        </option>
                        <option value="Pohon Tumbang / Bahaya Kabel Terjuntai">
                          Pohon Tumbang / Bahaya Kabel Terjuntai
                        </option>
                        <option value="Ketenteraman & Ketertiban Umum">
                          Ketenteraman &amp; Ketertiban Umum
                        </option>
                        <option value="Lainnya (Fasilitas Publik)">Lainnya (Fasilitas Publik)</option>
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
                          className="w-full h-11 pl-10 pr-3.5 bg-white text-[#131b2e] rounded-xl placeholder:text-slate-400 text-xs shadow-2xs border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194]/30 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Uraian Masalah & Bukti Foto */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-[#e0f2fe] text-[#0284c7] font-bold text-xs flex items-center justify-center">
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
                        className="w-full p-3.5 bg-white text-[#131b2e] rounded-xl placeholder:text-slate-400 text-xs shadow-2xs border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#006194]/30 transition resize-none leading-relaxed"
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
                        className="h-[120px] rounded-2xl bg-[#f8faff] hover:bg-[#eaedff]/60 transition-all flex flex-col items-center justify-center text-center p-3 cursor-pointer group border border-dashed border-[#dae2fd]"
                      >
                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#006194] group-hover:scale-110 transition-transform shadow-xs mb-1.5 border border-[#dae2fd]/60">
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

                {/* 4. Pilih Kontak WhatsApp Tujuan Pengaduan (2 Card Berdampingan Sesuai Gambar) */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-[#e0f2fe] text-[#0284c7] font-bold text-xs flex items-center justify-center">
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
                          : 'bg-[#f8faff] border-[#dae2fd] hover:bg-white'
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
                          : 'bg-[#f8faff] border-[#dae2fd] hover:bg-white'
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

                  {/* Toggle Uji Coba Nomor Bebas */}
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => setShowCustomPhone(!showCustomPhone)}
                      className="text-[11px] text-[#006194] hover:underline font-semibold"
                    >
                      {showCustomPhone ? '▲ Sembunyikan Uji Coba Nomor HP Lain' : '▼ Ingin uji coba kirim ke nomor HP pribadi Anda? Klik di sini'}
                    </button>
                    {showCustomPhone && (
                      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left flex flex-col sm:flex-row gap-2 items-center">
                        <span className="text-xs text-amber-900 font-medium">Nomor WhatsApp Tester:</span>
                        <input
                          type="tel"
                          value={customPhone}
                          onChange={(e) => {
                            setCustomPhone(e.target.value);
                            setTargetTujuan('custom');
                          }}
                          placeholder="0812-xxxx-xxxx"
                          className="flex-1 h-9 px-3 bg-white border border-amber-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Live WhatsApp Message Draft Preview (Persis Kotak Stitch) */}
                <div className="rounded-2xl bg-[#f8faff] border border-[#dae2fd] p-4 lg:p-5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#10b981]" />
                      <span className="font-bold text-xs text-[#131b2e]">
                        Pratinjau Format Pesan Otomatis
                      </span>
                    </div>
                    <span className="text-[11px] text-[#535f70]">Teks otomatis tersusun</span>
                  </div>

                  <pre className="bg-white p-4 rounded-xl font-mono text-xs text-slate-800 whitespace-pre-wrap border border-[#dae2fd]/70 leading-relaxed shadow-2xs select-all">
{composedWhatsAppMessage}
                  </pre>
                </div>

                {/* Form Actions & PDP Privacy Guarantee */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[#535f70] text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#006194]" />
                    <span>Data warga dilindungi UU PDP No. 27/2022 &amp; Ketentuan Kerahasiaan Kelurahan.</span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer w-full sm:w-auto"
                    >
                      Batal / Reset
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-[#006c49] hover:bg-[#005237] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Kirim via WhatsApp Resmi</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: DAFTAR PENGADUAN WARGA */}
          {activeTab === 'list' && (
            <div className="p-6 lg:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Pengaduan Terpantau di Wilayah</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Transparansi status pelaporan warga Kelurahan Kolongan Satu.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#d5fce8] text-[#005c3b] text-xs font-bold">2 Kasus Dalam Pengerjaan</span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">18 Selesai Bulan Ini</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#f8faff] border border-[#dae2fd] shadow-2xs flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#d5fce8] text-[#005c3b] text-[10px] font-bold">
                        Dalam Penanganan Lapangan
                      </span>
                      <span className="text-[10px] text-slate-500">Hari ini, 09:20 WITA</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">PJU Padam di Lorong Jaga 2</h3>
                    <p className="text-xs text-slate-600 mt-1">Patokan: Depan Gereja GMIM Elohim, 2 tiang penerangan tidak berfungsi.</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 text-slate-600 text-xs bg-white p-3 rounded-xl border border-[#dae2fd]/60">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#006194]" />
                      <span className="font-semibold">Pala Jaga 2 • Bpk. M. Senduk</span>
                    </div>
                    <span className="text-[#006c49] font-bold text-[11px]">Eskalasi ke PLN Area</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#f8faff] border border-[#dae2fd] shadow-2xs flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#006194] text-[10px] font-bold">
                        Diverifikasi Kelurahan
                      </span>
                      <span className="text-[10px] text-slate-500">Kemarin, 16:45 WITA</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Endapan Pasir Saluran Air (Drainase)</h3>
                    <p className="text-xs text-slate-600 mt-1">Patokan: Tikungan Lorong Masuk Jaga 4 menuju arah kebun sayur warga.</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 text-slate-600 text-xs bg-white p-3 rounded-xl border border-[#dae2fd]/60">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#006194]" />
                      <span className="font-semibold">Satgas Kebersihan Kelurahan</span>
                    </div>
                    <span className="text-[#006194] font-bold text-[11px]">Jadwal Kerja Bakti</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ALUR & ESTIMASI SLA */}
          {activeTab === 'sla' && (
            <div className="p-6 lg:p-8 space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Alur &amp; Standar Waktu Respons (SLA)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Transparansi alur pelayanan laporan pengaduan masyarakat Kelurahan Kolongan Satu.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#f8faff] border border-[#dae2fd] flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#006194] text-white flex items-center justify-center font-black text-xs">1</div>
                  <span className="text-xs font-bold text-slate-900">Pelaporan Warga</span>
                  <span className="text-xs text-slate-600">Warga mengisi formulir dan mengirim pesan WhatsApp terformat ke Kepala Jaga.</span>
                  <span className="text-[11px] text-[#006c49] font-bold mt-auto pt-2">Seketika (Instant)</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8faff] border border-[#dae2fd] flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#006194] text-white flex items-center justify-center font-black text-xs">2</div>
                  <span className="text-xs font-bold text-slate-900">Verifikasi Lapangan</span>
                  <span className="text-xs text-slate-600">Kepala Jaga meninjau lokasi fisik masalah guna memastikan urgensi dan tingkat kerusakan.</span>
                  <span className="text-[11px] text-[#006c49] font-bold mt-auto pt-2">Maks. 2 - 4 Jam</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8faff] border border-[#dae2fd] flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#006194] text-white flex items-center justify-center font-black text-xs">3</div>
                  <span className="text-xs font-bold text-slate-900">Penanganan Masalah</span>
                  <span className="text-xs text-slate-600">Eksekusi perbaikan mandiri atau diteruskan ke Dinas Terkait (PLN, PDAM, DLH Tomohon).</span>
                  <span className="text-[11px] text-[#006c49] font-bold mt-auto pt-2">1 x 24 Jam Kerja</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8faff] border border-[#dae2fd] flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#006c49] text-white flex items-center justify-center font-black text-xs">4</div>
                  <span className="text-xs font-bold text-slate-900">Konfirmasi Selesai</span>
                  <span className="text-xs text-slate-600">Laporan selesai difoto dan dikirimkan kembali ke pelapor sebagai bukti tuntas.</span>
                  <span className="text-[11px] text-[#006c49] font-bold mt-auto pt-2">Pemberitahuan WA</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Helpful Footer Inside Modal */}
          <div className="px-6 lg:px-8 py-3.5 bg-[#f2f4ff] border-t border-[#dae2fd] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#006194]" />
              <span>
                Hotline Darurat Kelurahan Kolongan Satu:{' '}
                <strong className="text-slate-800">(0431) 351-001</strong> /{' '}
                <strong className="text-slate-800">0812-4455-6677</strong>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#006c49]"></span>
                Siaga 5 Lingkungan Jaga
              </span>
              <span className="text-slate-400">|</span>
              <span className="font-semibold text-slate-700">Kecamatan Tomohon Tengah</span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer Halaman Bawah Sesuai Desain Stitch */}
      <footer className="w-full bg-white border-t border-[#dae2fd]/60 py-8 mt-12 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#006194]/10 border border-[#006194]/20 flex items-center justify-center text-[#006194]">
              <Building className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800">Pemerintah Kota Tomohon</span>
              <span className="text-[11px] text-slate-500">Kantor Kelurahan Kolongan Satu, Jl. Tomohon Tengah</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span>Jam Kerja: 08:00 - 16:00 WITA</span>
            <span>•</span>
            <span>Kontak Pelayanan Warga: (0431) 351-001</span>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right">
            © 2024 Kelurahan Kolongan Satu. Seluruh Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}
