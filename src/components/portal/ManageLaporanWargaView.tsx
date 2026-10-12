'use client';
import React, { useState } from 'react';
import { CitizenReport } from '@/data/reportsData';
import { Official } from '@/data/officialsData';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  MessageSquare,
  Send,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck,
  User,
  Calendar,
  Check,
  RefreshCw,
  AlertCircle,
  Building,
  Camera,
  FileText,
} from 'lucide-react';

interface ManageLaporanWargaViewProps {
  reports: CitizenReport[];
  onUpdateReportStatus: (id: string, newStatus: CitizenReport['status'], tanggapan?: string) => void;
  currentOfficial?: Official;
  showToast: (msg: string) => void;
}

export default function ManageLaporanWargaView({
  reports,
  onUpdateReportStatus,
  currentOfficial,
  showToast,
}: ManageLaporanWargaViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [filterLingkungan, setFilterLingkungan] = useState<number | 'semua'>('semua');

  // State untuk form respon per laporan
  const [respondingReportId, setRespondingReportId] = useState<string | null>(null);
  const [tanggapanText, setTanggapanText] = useState('');

  // Perhitungan statistik
  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === 'menunggu_tanggapan').length;
  const inProgressReports = reports.filter((r) => r.status === 'dalam_tindakan').length;
  const resolvedReports = reports.filter((r) => r.status === 'selesai').length;

  // Filter laporan
  const filteredReports = reports.filter((rep) => {
    const matchSearch =
      !searchQuery ||
      rep.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.namaWarga.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.isiLaporan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.kontakWarga.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = filterStatus === 'semua' || rep.status === filterStatus;
    const matchLingkungan = filterLingkungan === 'semua' || rep.lingkunganId === filterLingkungan;

    return matchSearch && matchStatus && matchLingkungan;
  });

  const cleanPhoneNumber = (phone: string) => {
    return phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
  };

  const handleOpenResponse = (rep: CitizenReport) => {
    if (respondingReportId === rep.id) {
      setRespondingReportId(null);
      setTanggapanText('');
    } else {
      setRespondingReportId(rep.id);
      setTanggapanText(rep.tanggapanPetugas || '');
    }
  };

  const handleSubmitResponse = (
    rep: CitizenReport,
    newStatus: CitizenReport['status'],
    sendWa: boolean = false
  ) => {
    onUpdateReportStatus(rep.id, newStatus, tanggapanText);
    showToast(
      `Status laporan #${rep.ticketNo} berhasil diubah ke: ${
        newStatus === 'selesai' ? 'SELESAI & TUNTAS' : 'SEDANG DALAM TINDAKAN'
      }`
    );

    if (sendWa && rep.kontakWarga) {
      const cleanPhone = cleanPhoneNumber(rep.kontakWarga);
      const statusTitle = newStatus === 'selesai' ? 'TELAH SELESAI DITANGANI' : 'SEDANG DALAM TINDAKAN LAPANGAN';
      const officialName = currentOfficial ? `${currentOfficial.name} (${currentOfficial.roleTitle})` : 'Aparatur Kelurahan';

      const waMsg = `*PEMBERITAHUAN TINDAK LANJUT LAPORAN WARGA*
Kelurahan Kolongan Satu, Tomohon Tengah
--------------------------------------------
Halo Bapak/Ibu *${rep.namaWarga}*,

Laporan Anda dengan nomor tiket:
🎫 *No. Tiket:* ${rep.ticketNo}
📍 *Lokasi:* ${rep.lingkunganName}
⚠️ *Perihal:* ${rep.klasifikasi}

Status terkini: *${statusTitle}*
📝 *Catatan Petugas:*
"${tanggapanText.trim() || 'Laporan telah ditinjau dan ditindaklanjuti oleh aparatur kelurahan.'}"

Diverifikasi oleh: ${officialName}
_Pemerintah Kelurahan Kolongan Satu, Tomohon Tengah._`;

      const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waMsg)}`;
      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }
    }

    setRespondingReportId(null);
    setTanggapanText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Ringkasan & Panduan Kerja Aparat */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kotak Pengaduan &amp; Tindak Lanjut Warga
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Daftar pengaduan kerusakan infrastruktur jalan, pipa air bersih, saluran drainase, sampah, dan ketenteraman warga untuk diverifikasi serta ditindaklanjuti oleh aparat kelurahan.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs text-slate-600">
          <Building className="w-5 h-5 text-primary shrink-0" />
          <div>
            <span className="font-bold text-slate-800 block">Penanggung Jawab Wilayah:</span>
            <span>Lurah, Seklur, &amp; Kepala Lingkungan (Pala I - V)</span>
          </div>
        </div>
      </div>

      {/* 2. Empat Kartu Metrik Rekapitulasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Aduan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Aduan Masuk
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalReports}</span>
            <span className="text-xs text-slate-500 font-medium">Laporan</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Seluruh arsip pelaporan masyarakat</p>
        </div>

        {/* Menunggu Disposisi */}
        <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-2xs hover:shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              Menunggu Tindakan
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600">{pendingReports}</span>
            <span className="text-xs text-rose-700 font-medium">Antrean</span>
          </div>
          <p className="text-[11px] text-rose-600/80 mt-1">Perlu tinjauan lapangan segera</p>
        </div>

        {/* Dalam Tindakan */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-2xs hover:shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Dalam Pengerjaan
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{inProgressReports}</span>
            <span className="text-xs text-amber-700 font-medium">Proses</span>
          </div>
          <p className="text-[11px] text-amber-600/80 mt-1">Sedang dikerjakan oleh tim teknis / Pala</p>
        </div>

        {/* Selesai / Tuntas */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-2xs hover:shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Selesai &amp; Tuntas
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{resolvedReports}</span>
            <span className="text-xs text-emerald-700 font-medium">Selesai</span>
          </div>
          <p className="text-[11px] text-emerald-600/80 mt-1">Tuntas dan terkonfirmasi warga</p>
        </div>
      </div>

      {/* 3. Panel Filter & Pencarian Cepat */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor tiket, nama pelapor, nomor telepon, atau isi masalah..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition"
            />
          </div>

          {/* Filter Dropdown Lingkungan */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold shrink-0">Wilayah:</span>
              <select
                value={filterLingkungan}
                onChange={(e) =>
                  setFilterLingkungan(e.target.value === 'semua' ? 'semua' : Number(e.target.value))
                }
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="semua">Semua Wilayah Jaga</option>
                <option value={1}>Lingkungan I (Jaga 1)</option>
                <option value={2}>Lingkungan II (Jaga 2)</option>
                <option value={3}>Lingkungan III (Jaga 3)</option>
                <option value={4}>Lingkungan IV (Jaga 4)</option>
                <option value={5}>Lingkungan V (Jaga 5)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Segmented Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setFilterStatus('semua')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterStatus === 'semua'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Aduan ({totalReports})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('menunggu_tanggapan')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterStatus === 'menunggu_tanggapan'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Menunggu Tindakan ({pendingReports})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('dalam_tindakan')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterStatus === 'dalam_tindakan'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Dalam Pengerjaan ({inProgressReports})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('selesai')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterStatus === 'selesai'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Selesai ({resolvedReports})
          </button>
        </div>
      </div>

      {/* 4. Daftar Kartu Pengaduan (Feed) */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Tidak Ada Laporan Pengaduan</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchQuery || filterStatus !== 'semua' || filterLingkungan !== 'semua'
                ? 'Tidak ada laporan yang sesuai dengan kriteria filter pencarian Anda.'
                : 'Seluruh aduan masyarakat telah selesai ditangani dengan tertib.'}
            </p>
          </div>
        ) : (
          filteredReports.map((rep) => {
            const isResponding = respondingReportId === rep.id;
            const cleanPhone = cleanPhoneNumber(rep.kontakWarga);

            return (
              <div
                key={rep.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all space-y-5"
              >
                {/* Header Kartu: Tiket, Tanggal & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-mono text-xs font-bold tracking-wider border border-slate-200">
                      {rep.ticketNo}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rep.dilaporkanPada}</span>
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-[11px] font-bold">
                      {rep.klasifikasi}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {rep.status === 'menunggu_tanggapan' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                        <span>Menunggu Disposisi</span>
                      </span>
                    )}
                    {rep.status === 'dalam_tindakan' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>Sedang Dalam Tindakan</span>
                      </span>
                    )}
                    {rep.status === 'selesai' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Selesai &amp; Tuntas</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid Info Pelapor & Lokasi */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Identitas Pelapor
                    </span>
                    <div className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>{rep.namaWarga}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-slate-600 font-mono">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{rep.kontakWarga}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Lokasi Kejadian
                    </span>
                    <div className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{rep.lingkunganName}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Kecamatan Tomohon Tengah
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Status Penyelesaian
                    </span>
                    <div className="font-semibold text-slate-800 mt-1">
                      {rep.diselesaikanPada ? `Selesai: ${rep.diselesaikanPada}` : 'Dalam Penanganan Lapangan'}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Disposisi: {rep.disposisiKepada || 'Pala Lingkungan Terkait'}
                    </span>
                  </div>
                </div>

                {/* Uraian Masalah Warga */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700">Rincian Permasalahan:</span>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed font-sans shadow-2xs">
                    "{rep.isiLaporan}"
                  </div>
                </div>

                {/* Catatan / Tanggapan Petugas Sebelumnya */}
                {rep.tanggapanPetugas && !isResponding && (
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Catatan Tindak Lanjut Aparatur:</span>
                    </div>
                    <p className="text-emerald-900 leading-relaxed">{rep.tanggapanPetugas}</p>
                  </div>
                )}

                {/* Panel Form Respon & Update Petugas (Ketika Dibuka) */}
                {isResponding && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span>Masukkan Catatan / Tindak Lanjut Resmi Aparatur:</span>
                      </label>
                      <span className="text-[10px] text-slate-500">
                        Oleh: {currentOfficial?.name || 'Aparatur Kelurahan'}
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={tanggapanText}
                      onChange={(e) => setTanggapanText(e.target.value)}
                      placeholder="Contoh: Petugas PLN area Tomohon telah dihubungi dan penggantian lampu tiang ke-2 dijadwalkan sore ini..."
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setRespondingReportId(null)}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                      >
                        Batal
                      </button>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Simpan Status: Dalam Tindakan */}
                        <button
                          type="button"
                          onClick={() => handleSubmitResponse(rep, 'dalam_tindakan', false)}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Tandai: Dalam Tindakan</span>
                        </button>

                        {/* Simpan Status: Selesai */}
                        <button
                          type="button"
                          onClick={() => handleSubmitResponse(rep, 'selesai', false)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tandai: Selesai</span>
                        </button>

                        {/* Simpan & Kirim WhatsApp ke Warga */}
                        <button
                          type="button"
                          onClick={() => handleSubmitResponse(rep, 'selesai', true)}
                          className="px-4 py-2 bg-[#006c49] hover:bg-[#005237] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Selesai + Kabari via WA</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Tombol Aksi Aparat */}
                {!isResponding && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    {/* Hubungi Pelapor langsung via WA */}
                    <a
                      href={`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(
                        `Halo Bapak/Ibu ${rep.namaWarga}, kami dari Kantor Kelurahan Kolongan Satu terkait laporan aduan Anda #${rep.ticketNo} (${rep.klasifikasi})...`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Chat WhatsApp Warga</span>
                      <ExternalLink className="w-3 h-3 text-emerald-600" />
                    </a>

                    {/* Tombol Buka Tindak Lanjut */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenResponse(rep)}
                        className="px-4 py-2 rounded-xl bg-primary hover:bg-[#004d77] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Proses &amp; Tanggapi Aduan</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
