'use client';
import React, { useState } from 'react';
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
  Camera,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface ModalCitizenReportProps {
  isOpen: boolean;
  onClose: () => void;
  reports: CitizenReport[];
  onAddReport: (newReport: CitizenReport) => void;
  onUpdateReportStatus: (id: string, newStatus: CitizenReport['status'], tanggapan?: string) => void;
  currentOfficial: Official;
}

export default function ModalCitizenReport({
  isOpen,
  onClose,
  reports,
  onAddReport,
  onUpdateReportStatus,
  currentOfficial,
}: ModalCitizenReportProps) {
  const [activeTab, setActiveTab] = useState<'daftar' | 'lapor'>('daftar');

  // Form states
  const [nama, setNama] = useState('');
  const [kontak, setKontak] = useState('');
  const [lingkunganId, setLingkunganId] = useState(3);
  const [klasifikasi, setKlasifikasi] = useState<CitizenReport['klasifikasi']>('Air Bersih');
  const [isiLaporan, setIsiLaporan] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !kontak || !isiLaporan) {
      alert('Mohon lengkapi Nama, Kontak HP/WA, dan Rincian Masalah!');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReport: CitizenReport = {
      id: `rep-${Date.now()}`,
      ticketNo: `LAPOR-KKT-${randomSuffix}`,
      namaWarga: nama,
      kontakWarga: kontak,
      lingkunganId: lingkunganId,
      lingkunganName: `Lingkungan ${lingkunganId}`,
      klasifikasi: klasifikasi,
      isiLaporan: isiLaporan,
      status: 'menunggu_tanggapan',
      statusLabel: 'Menunggu Disposisi',
      dilaporkanPada: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WITA',
    };

    onAddReport(newReport);
    setActiveTab('daftar');
    alert(`Laporan berhasil dikirim!\nNomor Tiket Anda: ${newReport.ticketNo}\nPala dan Kasie terkait akan segera menindaklanjuti.`);
  };

  const isStaff = currentOfficial.roleCode !== 'publik';

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
            <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Form Laporan Insiden & Keluhan Warga</h3>
                <p className="text-xs text-slate-500">
                  Laporan akan langsung diteruskan ke nomor ponsel Kepala Lingkungan (Pala) dan Kasie terkait.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Pelapor *
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / HP Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    value={kontak}
                    onChange={(e) => setKontak(e.target.value)}
                    placeholder="0812-XXXX-XXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lokasi Lingkungan (Jaga) *
                  </label>
                  <select
                    value={lingkunganId}
                    onChange={(e) => setLingkunganId(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Air Bersih">Air Bersih & Pipa Mata Air</option>
                    <option value="Drainase">Saluran Drainase / Saluran Air</option>
                    <option value="Lampu Jalan">Lampu Penerangan Jalan Umum</option>
                    <option value="Sampah">Sampah Liar / Kebersihan Lingkungan</option>
                    <option value="Keamanan & Trantib">Keamanan, Poskamling & Trantib</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Detail Kerusakan / Uraian Masalah *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={isiLaporan}
                    onChange={(e) => setIsiLaporan(e.target.value)}
                    placeholder="Sebutkan lokasi pasti, patokan tempat, dan kondisi kerusakan secara rinci..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('daftar')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white shadow-md shadow-rose-700/20 transition flex items-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Laporan Pengaduan</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
