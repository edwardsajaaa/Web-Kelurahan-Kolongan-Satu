'use client';
import React, { useState } from 'react';
import { LetterRequest } from '@/data/lettersData';
import { Official } from '@/data/officialsData';
import {
  FileText,
  Clock,
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Printer,
  MessageSquare,
  AlertCircle,
  FileSpreadsheet,
  Building,
  User,
  Phone,
  Paperclip,
  Check,
  Send,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface ManagePersuratanViewProps {
  letters: LetterRequest[];
  onUpdateStatus: (id: string, newStatus: LetterRequest['statusSurat'], note?: string) => void;
  currentOfficial?: Official;
  onPrintLetter: (letter: LetterRequest) => void;
  showToast: (msg: string) => void;
}

export default function ManagePersuratanView({
  letters,
  onUpdateStatus,
  currentOfficial,
  onPrintLetter,
  showToast,
}: ManagePersuratanViewProps) {
  const [pipelineFilter, setPipelineFilter] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLingkungan, setFilterLingkungan] = useState<number | 'semua'>('semua');
  const [copiedResi, setCopiedResi] = useState<string | null>(null);

  // Peran aparatur aktif
  const isLurah = currentOfficial?.roleCode === 'superadmin';
  const isSeklur = currentOfficial?.roleCode === 'admin_seklur';
  const isStaf = currentOfficial?.roleCode === 'pelaksana_adm';
  const canVerifyStaf = isLurah || isSeklur || isStaf;
  const canParafSeklur = isLurah || isSeklur;
  const canSahkanLurah = isLurah;

  // Filter letters
  const filteredLetters = letters.filter((l) => {
    const matchSearch =
      !searchQuery ||
      l.noRegistrasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.namaPemohon.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.jenisSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nikPemohon.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nomorWaPemohon.toLowerCase().includes(searchQuery.toLowerCase());

    const matchPipeline =
      pipelineFilter === 'semua' || l.statusSurat === pipelineFilter;

    const matchLingkungan =
      filterLingkungan === 'semua' || l.lingkunganId === filterLingkungan;

    return matchSearch && matchPipeline && matchLingkungan;
  });

  const cleanPhoneNumber = (phone: string) => {
    return phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedResi(text);
      setTimeout(() => setCopiedResi(null), 2500);
    }
  };

  const handleSendWaNotification = (letter: LetterRequest) => {
    const cleanPhone = cleanPhoneNumber(letter.nomorWaPemohon);
    const message = `*PEMERINTAH KELURAHAN KOLONGAN SATU*
Kecamatan Tomohon Tengah, Kota Tomohon
------------------------------------------
Pemberitahuan Status Permohonan Surat:
📄 *Jenis Surat:* ${letter.jenisSurat}
🎫 *No. Registrasi:* ${letter.noRegistrasi}
👤 *Nama Pemohon:* ${letter.namaPemohon}
📌 *Status Terkini:* ${letter.statusLabel}

Catatan Petugas:
"${letter.catatanPetugas || 'Berkas Anda sedang diproses dan diverifikasi oleh pejabat berwenang kelurahan.'}"

_Pemerintah Kelurahan Kolongan Satu melayani dengan tertib, cepat, dan transparan._`;

    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner Ruang Kerja Persuratan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Alur &amp; Penerbitan Dokumen Surat Resmi (PDF)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Verifikasi kelengkapan berkas, pembubuhan paraf Sekretaris Kelurahan, pengesahan tanda tangan digital Lurah, dan penerbitan draf berkas PDF resmi ber-QR Code.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-auto bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-600">
          <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
          <div>
            <span className="font-bold text-slate-800 block">
              Pengguna Aktif: {currentOfficial?.name || 'Aparatur Kelurahan'}
            </span>
            <span className="text-[11px] text-slate-500">
              Otoritas: {currentOfficial?.roleTitle || 'Operator Kelurahan'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Empat Kartu Metrik Statistik Surat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Surat Masuk */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Surat Masuk
            </span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{letters.length}</span>
            <span className="text-xs text-slate-500 font-medium">Permohonan</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Semua permohonan aktif</p>
        </div>

        {/* Menunggu Verifikasi Staf */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-2xs hover:shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Menunggu Verifikasi
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">
              {letters.filter((l) => l.statusSurat === 'diajukan').length}
            </span>
            <span className="text-xs text-amber-700 font-medium">Antrean Staf</span>
          </div>
          <p className="text-[11px] text-amber-600/80 mt-1">Menunggu pemeriksaan fisik berkas</p>
        </div>

        {/* Proses / Paraf Seklur */}
        <div className="bg-white rounded-2xl p-5 border border-sky-200 shadow-2xs hover:shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Proses / Paraf Seklur
            </span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BadgeCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary">
              {letters.filter((l) => l.statusSurat === 'diverifikasi_staf' || l.statusSurat === 'diparaf_seklur').length}
            </span>
            <span className="text-xs text-primary font-medium">Verifikasi Seklur</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Koreksi administrasi &amp; paraf Seklur</p>
        </div>

        {/* Selesai & Sah Lurah */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-2xs hover:shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Selesai &amp; Sah Lurah
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              {letters.filter((l) => l.statusSurat === 'selesai_disahkan').length}
            </span>
            <span className="text-xs text-emerald-700 font-medium">Terbit Sah</span>
          </div>
          <p className="text-[11px] text-emerald-600/80 mt-1">Disahkan TTD Lurah Theresia</p>
        </div>
      </div>

      {/* 3. Workflow Ribbon Alur Berkas */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Masuk Sebagai:</span>
          <span className="font-bold text-primary">{currentOfficial?.name || 'Aparatur Kelurahan'}</span>
          <span className="text-[11px] text-slate-500">({currentOfficial?.roleTitle || 'Petugas'})</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-semibold text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/80">
          <span className="text-slate-400">Alur:</span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">Warga</span>
          <span>→</span>
          <span className={`px-2 py-0.5 rounded border ${isStaf ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold' : 'bg-white border-slate-200 text-slate-700'}`}>
            Staf Karlin
          </span>
          <span>→</span>
          <span className={`px-2 py-0.5 rounded border ${isSeklur ? 'bg-sky-100 border-sky-300 text-primary font-bold' : 'bg-white border-slate-200 text-slate-700'}`}>
            Seklur Febronia
          </span>
          <span>→</span>
          <span className={`px-2 py-0.5 rounded border ${isLurah ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-700'}`}>
            TTD Lurah Theresia
          </span>
        </div>
      </div>

      {/* 4. Panel Filter Pipeline & Pencarian Cepat */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor registrasi, nama pemohon, NIK, jenis surat, atau nomor HP..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition"
            />
          </div>

          {/* Filter Dropdown Lingkungan */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold shrink-0">Lingkungan:</span>
            <select
              value={filterLingkungan}
              onChange={(e) =>
                setFilterLingkungan(e.target.value === 'semua' ? 'semua' : Number(e.target.value))
              }
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="semua">Semua Jaga (I - V)</option>
              <option value={1}>Lingkungan I (Jaga 1)</option>
              <option value={2}>Lingkungan II (Jaga 2)</option>
              <option value={3}>Lingkungan III (Jaga 3)</option>
              <option value={4}>Lingkungan IV (Jaga 4)</option>
              <option value={5}>Lingkungan V (Jaga 5)</option>
            </select>
          </div>
        </div>

        {/* Pipeline Filter Segmented Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setPipelineFilter('semua')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              pipelineFilter === 'semua'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Semua Berkas ({letters.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setPipelineFilter('diajukan')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              pipelineFilter === 'diajukan'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>1. Menunggu Verifikasi Staf ({letters.filter((l) => l.statusSurat === 'diajukan').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setPipelineFilter('diverifikasi_staf')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              pipelineFilter === 'diverifikasi_staf'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            <BadgeCheck className="w-3.5 h-3.5" />
            <span>2. Menunggu Paraf Seklur ({letters.filter((l) => l.statusSurat === 'diverifikasi_staf').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setPipelineFilter('diparaf_seklur')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              pipelineFilter === 'diparaf_seklur'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. Menunggu Pengesahan Lurah ({letters.filter((l) => l.statusSurat === 'diparaf_seklur').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setPipelineFilter('selesai_disahkan')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              pipelineFilter === 'selesai_disahkan'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>4. Selesai &amp; Terbit PDF ({letters.filter((l) => l.statusSurat === 'selesai_disahkan').length})</span>
          </button>
        </div>
      </div>

      {/* 5. Daftar Kartu Permohonan Surat */}
      <div className="space-y-4">
        {filteredLetters.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Tidak Ada Berkas Permohonan Surat</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchQuery || pipelineFilter !== 'semua' || filterLingkungan !== 'semua'
                ? 'Tidak ada berkas yang sesuai dengan kriteria filter pencarian Anda.'
                : 'Seluruh antrean permohonan surat warga telah diproses dengan tertib.'}
            </p>
          </div>
        ) : (
          filteredLetters.map((l) => {
            const isCompleted = l.statusSurat === 'selesai_disahkan';
            const isParaf = l.statusSurat === 'diparaf_seklur';
            const isVerified = l.statusSurat === 'diverifikasi_staf';
            const isDraft = l.statusSurat === 'diajukan';

            return (
              <div
                key={l.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all space-y-5"
              >
                {/* Header Permohonan: Nomor Registrasi, Tanggal & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-xl bg-sky-50 text-sky-800 font-mono text-xs font-bold tracking-wider border border-sky-200">
                      {l.noRegistrasi}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {l.tanggalDiajukan}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(l.noRegistrasi)}
                      className="text-[11px] text-primary hover:underline font-semibold ml-1 cursor-pointer"
                    >
                      {copiedResi === l.noRegistrasi ? '✓ Tersalin' : 'Salin No. Reg'}
                    </button>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isDraft && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>Diajukan Warga</span>
                      </span>
                    )}
                    {isVerified && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                        <span>Diverifikasi Staf Karlin</span>
                      </span>
                    )}
                    {isParaf && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        <span>Diparaf Seklur Febronia</span>
                      </span>
                    )}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Selesai &amp; Terbit PDF</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Judul Surat */}
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {l.jenisSurat}
                </h2>

                {/* Stepper 4 Tahapan Berkas */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span>Alur &amp; Tahapan Penerbitan Dokumen Resmi:</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Output: Dokumen PDF Resmi
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-xs">
                    {/* Tahap 1: Berkas Masuk */}
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                        1
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block text-[11px]">Berkas Masuk</span>
                        <span className="text-[10px] text-slate-500">Diajukan warga</span>
                      </div>
                    </div>

                    {/* Tahap 2: Verifikasi Staf */}
                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${isVerified || isParaf || isCompleted ? 'bg-sky-50 border-sky-200 text-sky-900' : 'bg-white border-slate-200 text-slate-500'}`}>
                      <div className={`w-6 h-6 rounded-full font-black text-[10px] flex items-center justify-center shrink-0 ${isVerified || isParaf || isCompleted ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        2
                      </div>
                      <div>
                        <span className="font-bold block text-[11px]">Verifikasi Berkas</span>
                        <span className="text-[10px]">Staf Karlin</span>
                      </div>
                    </div>

                    {/* Tahap 3: Paraf Seklur */}
                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${isParaf || isCompleted ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white border-slate-200 text-slate-500'}`}>
                      <div className={`w-6 h-6 rounded-full font-black text-[10px] flex items-center justify-center shrink-0 ${isParaf || isCompleted ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                        3
                      </div>
                      <div>
                        <span className="font-bold block text-[11px]">Paraf Seklur</span>
                        <span className="text-[10px]">Seklur Febronia</span>
                      </div>
                    </div>

                    {/* Tahap 4: TTD Lurah */}
                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-white border-slate-200 text-slate-500'}`}>
                      <div className={`w-6 h-6 rounded-full font-black text-[10px] flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        4
                      </div>
                      <div>
                        <span className="font-bold block text-[11px]">TTD &amp; Terbit PDF</span>
                        <span className="text-[10px]">Lurah Theresia</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid Rincian Pemohon */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Pemohon
                    </span>
                    <div className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>{l.namaPemohon}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                      NIK: {l.nikPemohon}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Lingkungan &amp; WA
                    </span>
                    <div className="font-bold text-slate-900 mt-1">
                      Lingkungan {l.lingkunganId} (Jaga {l.lingkunganId})
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-slate-600 font-mono">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{l.nomorWaPemohon}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Keperluan Surat
                    </span>
                    <div className="font-bold text-slate-900 mt-1">{l.tujuanKeperluan}</div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Pekerjaan: {l.pekerjaan || 'Wiraswasta / Warga'}
                    </span>
                  </div>
                </div>

                {/* Lampiran & Catatan Petugas */}
                {l.catatanPetugas && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                    <span className="font-bold text-slate-700">Catatan Petugas:</span>
                    <p className="text-slate-800">{l.catatanPetugas}</p>
                  </div>
                )}

                {/* Tombol Aksi Otoritas Aparatur */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  {/* Lampiran Chip */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                      <Paperclip className="w-3.5 h-3.5 text-primary" />
                      <span>{l.berkasName || 'Lampiran.pdf'}</span>
                      <span className="text-slate-400 text-[10px]">(1.2 MB)</span>
                    </span>
                  </div>

                  {/* Kelompok Tombol Aksi Otoritas */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Aksi 1: Verifikasi Staf (Aktif jika diajukan) */}
                    {isDraft && canVerifyStaf && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateStatus(l.id, 'diverifikasi_staf', 'Berkas fisik dan identitas telah diperiksa lengkap oleh Staf Karlin.');
                          showToast(`Permohonan #${l.noRegistrasi} berhasil diverifikasi oleh Staf Karlin!`);
                        }}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <BadgeCheck className="w-3.5 h-3.5" />
                        <span>Verifikasi Berkas Staf</span>
                      </button>
                    )}

                    {/* Aksi 2: Paraf Seklur (Aktif jika diverifikasi_staf) */}
                    {isVerified && canParafSeklur && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateStatus(l.id, 'diparaf_seklur', 'Paraf persetujuan dibubuhkan oleh Seklur Febronia L. Pijoh, S.Kom.');
                          showToast(`Permohonan #${l.noRegistrasi} telah diberi paraf persetujuan Seklur!`);
                        }}
                        className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Beri Paraf Seklur</span>
                      </button>
                    )}

                    {/* Aksi 3: TTD & Pengesahan Lurah (Aktif jika diparaf_seklur) */}
                    {isParaf && canSahkanLurah && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateStatus(l.id, 'selesai_disahkan', 'Dokumen resmi telah ditandatangani dan disahkan secara digital oleh Lurah Theresia J. Kaunang, SE.');
                          showToast(`Permohonan #${l.noRegistrasi} berhasil disahkan oleh Lurah!`);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Sahkan &amp; TTD Lurah</span>
                      </button>
                    )}

                    {/* Aksi 4: Kirim Status ke WA Pemohon */}
                    <button
                      type="button"
                      onClick={() => handleSendWaNotification(l)}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kirim Status ke WA</span>
                    </button>

                    {/* Aksi 5: Pratinjau / Cetak Draf PDF */}
                    <button
                      type="button"
                      onClick={() => onPrintLetter(l)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{isCompleted ? 'Cetak Surat Sah (PDF)' : 'Pratinjau Draf PDF'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
