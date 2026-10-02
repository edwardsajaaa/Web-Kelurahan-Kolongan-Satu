'use client';
import React from 'react';
import { MonografiItem } from '@/data/monografiData';
import { Official } from '@/data/officialsData';
import {
  MapPin,
  CheckCircle2,
  Clock,
  FileEdit,
  Download,
  Share2,
  Calendar,
  Users,
  Home,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  PieChart,
  Send,
  Sparkles,
  Info,
  Check,
  Award,
  AlertCircle
} from 'lucide-react';

interface DetailViewProps {
  item: MonografiItem;
  currentOfficial: Official;
  onApproveItem?: (id: string) => void;
  onVerifySeklur?: (id: string) => void;
  onOpenLetterModal: () => void;
  onOpenReportModal: () => void;
  onOpenPrintPreview: (item: MonografiItem) => void;
  onTriggerWhatsApp: (item: MonografiItem) => void;
}

export default function DetailView({
  item,
  currentOfficial,
  onApproveItem,
  onVerifySeklur,
  onOpenLetterModal,
  onOpenReportModal,
  onOpenPrintPreview,
  onTriggerWhatsApp,
}: DetailViewProps) {
  const isLurah = currentOfficial.roleCode === 'superadmin';
  const isSeklur = currentOfficial.roleCode === 'admin_seklur';
  const isKasieOrPala = ['kasie_pem', 'kasie_kesra', 'kasie_bang', 'operator_pala'].includes(currentOfficial.roleCode);

  return (
    <main className="flex-1 bg-white h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between select-text">
      <div className="space-y-6 max-w-4xl mx-auto w-full pb-12">
        {/* Header & Location */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
              <span>Kecamatan Tomohon Tengah, Kota Tomohon, Sulawesi Utara</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {item.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-md">
                Tahun Data {item.year}
              </span>
              {item.palaName && (
                <span className="text-xs text-slate-600">
                  Pala: <strong className="text-slate-800">{item.palaName}</strong>
                </span>
              )}
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-600">
                PJ: <strong className="text-slate-800">{item.kasieName}</strong>
              </span>
            </div>
          </div>

          {/* Validation Status Badge */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {item.statusTahapan === 'disahkan_lurah' ? (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Sah: Lurah Kolongan Satu</span>
              </span>
            ) : item.statusTahapan === 'diverifikasi_seklur' ? (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-full text-xs font-bold shadow-xs">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Paraf Seklur (Menunggu Lurah)</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-sky-50 text-sky-800 border border-sky-300 rounded-full text-xs font-bold shadow-xs">
                <FileEdit className="w-4 h-4 text-sky-600" />
                <span>Draf Masukan Pala / Kasie</span>
              </span>
            )}
          </div>
        </div>

        {/* Workflow Action Notice Bar for Officials */}
        {item.statusTahapan === 'diverifikasi_seklur' && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900">
                  Data Baru Siap Pengesahan Akhir Pimpinan!
                </p>
                <p className="text-[11px] text-amber-700">
                  Telah diverifikasi oleh Sekretaris Kelurahan (Ferromel L. Pua, S.Kom). Siap disahkan Lurah.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onTriggerWhatsApp(item)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center space-x-1.5 shadow-sm"
                title="Buka pesan WhatsApp simulasi ke ponsel Lurah"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim WA Lurah</span>
              </button>

              {isLurah && onApproveItem && (
                <button
                  onClick={() => onApproveItem(item.id)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center space-x-1.5 shadow-md shadow-slate-900/10"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sahkan Data Ini (TTD)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {item.statusTahapan === 'draft' && isSeklur && onVerifySeklur && (
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                <FileEdit className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-900">
                  Draf Masukan Lapangan Menunggu Verifikasi Anda
                </p>
                <p className="text-[11px] text-indigo-700">
                  Sebagai Sekretaris Kelurahan, verifikasi keabsahan angka sebelum diteruskan ke Lurah.
                </p>
              </div>
            </div>

            <button
              onClick={() => onVerifySeklur(item.id)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition flex items-center space-x-1.5 shadow-sm whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verifikasi & Teruskan ke Lurah</span>
            </button>
          </div>
        )}

        {/* Hero Header Image Banner */}
        <div className="w-full h-72 rounded-3xl overflow-hidden relative shadow-sm border border-slate-100 group">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Floating Pill on Image */}
          <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-medium border border-white/10">
              <span className="text-sky-300 font-bold">Data Resmi Monografi</span> Periode Tahun {item.year}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenPrintPreview(item)}
                className="px-3.5 py-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5 backdrop-blur-sm"
              >
                <Download className="w-3.5 h-3.5 text-sky-700" />
                <span>Cetak Lembar Monografi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chips Metrik Ikonik (4 Blok Angka Utama) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {item.metrics.totalWarga ? (
            <>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Penduduk</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {item.metrics.totalWarga.toLocaleString()} <span className="text-xs font-semibold text-slate-500">Jiwa</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kepala Keluarga</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {item.metrics.kepalaKeluarga?.toLocaleString()} <span className="text-xs font-semibold text-slate-500">KK</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Laki-Laki</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {item.metrics.pria?.toLocaleString()} <span className="text-xs font-semibold text-slate-500">Jiwa</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perempuan</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {item.metrics.wanita?.toLocaleString()} <span className="text-xs font-semibold text-slate-500">Jiwa</span>
                </p>
              </div>
            </>
          ) : (
            item.metrics.customMetrics?.map((cm, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{cm.label}</p>
                <p className="text-xl font-black text-slate-900 mt-1">{cm.value}</p>
              </div>
            ))
          )}
        </div>

        {/* Narrative & Field Notes */}
        <div className="space-y-3 bg-slate-50/60 p-5 rounded-2xl border border-slate-200/70">
          <div className="flex items-center space-x-2 text-slate-700">
            <Info className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Deskripsi Entitas & Catatan Lapangan
            </h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {item.description}
          </p>
          {item.detailedNotes && item.detailedNotes.length > 0 && (
            <ul className="pt-2 space-y-1.5">
              {item.detailedNotes.map((note, idx) => (
                <li key={idx} className="flex items-start text-xs text-slate-600 space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 flex-shrink-0"></span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Visual Interactive Charts */}
        {item.chartData && (
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                  {item.chartData.type === 'donut' ? (
                    <PieChart className="w-4 h-4" />
                  ) : (
                    <BarChart3 className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.chartData.title}</h4>
                  <p className="text-[11px] text-slate-500">Visualisasi statistik agregat terverifikasi</p>
                </div>
              </div>
            </div>

            {/* Custom Interactive SVG / CSS Chart */}
            <div className="space-y-3 pt-1">
              {item.chartData.items.map((chartItem, idx) => {
                const maxValue = Math.max(...item.chartData!.items.map((i) => i.value));
                const percentage = Math.round((chartItem.value / (maxValue || 1)) * 100);

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{chartItem.label}</span>
                      <div className="space-x-1.5">
                        <span className="text-slate-900 font-bold">{chartItem.value.toLocaleString()}</span>
                        {chartItem.note && (
                          <span className="text-[11px] text-slate-400 font-normal">({chartItem.note})</span>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(percentage, 4)}%`,
                          backgroundColor: chartItem.color || '#0284c7'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Data Table */}
        {item.tableData && (
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Tabel Rincian Lembar Monografi Resmi
              </span>
              <span className="text-[10px] text-slate-500">
                Pembaruan: {item.lastUpdated}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    {item.tableData.headers.map((h, i) => (
                      <th key={i} className="px-4 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {item.tableData.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-slate-50/80 transition">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className={`px-4 py-2.5 ${cellIdx === 0 ? 'font-medium text-slate-800' : ''}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Floating Action Cards at Bottom */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Pelayanan Terpadu Mandiri</span>
            </div>
            <h4 className="text-base font-extrabold text-white">Butuh Layanan Administrasi atau Laporan?</h4>
            <p className="text-xs text-slate-300 max-w-lg">
              Warga Kolongan Satu dapat mengajukan surat online atau melaporkan gangguan sarana langsung dari ponsel tanpa harus antre di kantor kelurahan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              onClick={onOpenLetterModal}
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition shadow-md active:scale-95"
            >
              Ajukan Permohonan Surat
            </button>
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition"
            >
              Lapor Kerusakan Lingkungan
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
