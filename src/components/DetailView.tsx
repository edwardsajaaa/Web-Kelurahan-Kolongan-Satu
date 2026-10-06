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
  BarChart3,
  PieChart,
  Send,
  Check,
  Award,
} from 'lucide-react';

interface DetailViewProps {
  item: MonografiItem;
  currentOfficial: Official;
  onApproveItem?: (id: string) => void;
  onVerifySeklur?: (id: string) => void;
  onOpenEditModal?: (item: MonografiItem) => void;
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
  onOpenEditModal,
  onOpenLetterModal,
  onOpenReportModal,
  onOpenPrintPreview,
  onTriggerWhatsApp,
}: DetailViewProps) {
  const isLurah = currentOfficial.roleCode === 'superadmin';
  const isSeklur = currentOfficial.roleCode === 'admin_seklur';

  return (
    <main className="flex-1 bg-[#faf8ff] h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between select-text">
      <div className="space-y-6 max-w-4xl mx-auto w-full pb-12">
        {/* Header & Location */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#dae2fd] pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[#535f70] text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>Kecamatan Tomohon Tengah • Kota Tomohon</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#131b2e] tracking-tight">
              {item.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs bg-[#e2e7ff] text-primary font-bold px-3 py-0.5 rounded-full">
                Tahun Data {item.year}
              </span>
              {item.palaName && (
                <span className="text-xs text-[#535f70]">
                  Pala: <strong className="text-[#131b2e] font-semibold">{item.palaName}</strong>
                </span>
              )}
              <span className="text-xs text-[#bfc7d2]">•</span>
              <span className="text-xs text-[#535f70]">
                Penanggung Jawab: <strong className="text-[#131b2e] font-semibold">{item.kasieName}</strong>
              </span>
            </div>
          </div>

          {/* Validation Status Badge & Edit Action */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {onOpenEditModal && (
              <button
                onClick={() => onOpenEditModal(item)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-[#e2e7ff] text-primary border border-[#dae2fd] rounded-full text-xs font-bold shadow-xs transition cursor-pointer"
                title="Edit rincian angka & informasi monografi"
              >
                <FileEdit className="w-3.5 h-3.5 text-primary" />
                <span>Edit Data</span>
              </button>
            )}

            {item.statusTahapan === 'disahkan_lurah' ? (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#6cf8bb]/20 text-[#006c49] border border-[#6cf8bb]/50 rounded-full text-xs font-bold shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#006c49]" />
                <span>Sah: Lurah Kolongan Satu</span>
              </span>
            ) : item.statusTahapan === 'diverifikasi_seklur' ? (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold shadow-xs">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Paraf Seklur</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#e2e7ff] text-primary border border-[#dae2fd] rounded-full text-xs font-bold shadow-xs">
                <FileEdit className="w-4 h-4 text-primary" />
                <span>Draf Masukan</span>
              </span>
            )}
          </div>
        </div>

        {/* Compact Action Bar for Seklur / Lurah Approvals */}
        {item.statusTahapan === 'diverifikasi_seklur' && (
          <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold flex-shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#131b2e]">
                  Data Siap Pengesahan Lurah
                </p>
                <p className="text-[11px] text-[#535f70]">
                  Telah diverifikasi oleh Sekretaris Kelurahan
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onTriggerWhatsApp(item)}
                className="px-3 py-1.5 rounded-xl bg-[#f2f3ff] text-primary border border-[#dae2fd] text-xs font-bold hover:bg-[#e2e7ff] transition flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5 text-primary" />
                <span>Kirim WA Lurah</span>
              </button>

              {isLurah && onApproveItem && (
                <button
                  onClick={() => onApproveItem(item.id)}
                  className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-[#004d77] transition flex items-center space-x-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Sahkan & Terbitkan Data</span>
                </button>
              )}
            </div>
          </div>
        )}

        {item.statusTahapan === 'draft' && isSeklur && onVerifySeklur && (
          <div className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#e2e7ff] text-primary flex items-center justify-center font-bold flex-shrink-0">
                <FileEdit className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#131b2e]">
                  Draf Menunggu Verifikasi
                </p>
                <p className="text-[11px] text-[#535f70]">
                  Verifikasi data lapangan untuk diteruskan ke Lurah
                </p>
              </div>
            </div>

            <button
              onClick={() => onVerifySeklur(item.id)}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-[#004d77] transition flex items-center space-x-1.5 shadow-xs whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Paraf / Verifikasi Draf</span>
            </button>
          </div>
        )}

        {/* Hero Header Image Banner */}
        <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden relative shadow-xs border border-[#e2e7ff] group">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Floating Pill on Image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
            <div className="bg-[#131b2e]/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-white text-xs font-medium border border-white/10">
              <span className="text-[#93ccff] font-bold">Monografi Terverifikasi</span> • Tahun {item.year}
            </div>

            <button
              onClick={() => onOpenPrintPreview(item)}
              className="px-3.5 py-1.5 bg-white/95 hover:bg-white text-primary rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1.5 backdrop-blur-xs"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Cetak Lembar Monografi</span>
            </button>
          </div>
        </div>

        {/* Metrik Utama (4 Blok Angka) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {item.metrics.totalWarga ? (
            <>
              <div className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs">
                <p className="text-[10px] font-bold text-[#707881] uppercase tracking-wider">Total Penduduk</p>
                <p className="text-2xl font-black text-[#131b2e] mt-1">
                  {item.metrics.totalWarga.toLocaleString()} <span className="text-xs font-semibold text-[#535f70]">Jiwa</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs">
                <p className="text-[10px] font-bold text-[#707881] uppercase tracking-wider">Kepala Keluarga</p>
                <p className="text-2xl font-black text-[#131b2e] mt-1">
                  {item.metrics.kepalaKeluarga?.toLocaleString()} <span className="text-xs font-semibold text-[#535f70]">KK</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs">
                <p className="text-[10px] font-bold text-[#707881] uppercase tracking-wider">Laki-Laki</p>
                <p className="text-2xl font-black text-[#131b2e] mt-1">
                  {item.metrics.pria?.toLocaleString()} <span className="text-xs font-semibold text-[#535f70]">Jiwa</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs">
                <p className="text-[10px] font-bold text-[#707881] uppercase tracking-wider">Perempuan</p>
                <p className="text-2xl font-black text-[#131b2e] mt-1">
                  {item.metrics.wanita?.toLocaleString()} <span className="text-xs font-semibold text-[#535f70]">Jiwa</span>
                </p>
              </div>
            </>
          ) : (
            item.metrics.customMetrics?.map((cm, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs">
                <p className="text-[10px] font-bold text-[#707881] uppercase tracking-wider">{cm.label}</p>
                <p className="text-xl font-black text-[#131b2e] mt-1">{cm.value}</p>
              </div>
            ))
          )}
        </div>

        {/* Deskripsi & Ringkasan */}
        <div className="bg-white p-5 rounded-2xl border border-[#dae2fd] shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
            Ringkasan & Profil
          </h3>
          <p className="text-sm text-[#3f4850] leading-relaxed font-normal">
            {item.description}
          </p>
          {item.detailedNotes && item.detailedNotes.length > 0 && (
            <ul className="pt-1 space-y-1.5">
              {item.detailedNotes.map((note, idx) => (
                <li key={idx} className="flex items-start text-xs text-[#535f70] space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Visual Interactive Charts */}
        {item.chartData && (
          <div className="p-5 rounded-2xl border border-[#dae2fd] bg-white shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-[#e2e7ff] pb-3">
              <div className="p-2 bg-[#f2f3ff] text-primary rounded-xl">
                {item.chartData.type === 'donut' ? (
                  <PieChart className="w-4 h-4" />
                ) : (
                  <BarChart3 className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#131b2e]">{item.chartData.title}</h4>
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
                      <span className="text-[#3f4850]">{chartItem.label}</span>
                      <div className="space-x-1.5">
                        <span className="text-[#131b2e] font-bold">{chartItem.value.toLocaleString()}</span>
                        {chartItem.note && (
                          <span className="text-[11px] text-[#707881] font-normal">({chartItem.note})</span>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-[#f2f3ff] h-2.5 rounded-full overflow-hidden flex">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(percentage, 4)}%`,
                          backgroundColor: chartItem.color || '#006194'
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
          <div className="rounded-2xl border border-[#dae2fd] overflow-hidden bg-white shadow-xs">
            <div className="bg-[#f2f3ff] px-4 py-3 border-b border-[#dae2fd] flex items-center justify-between">
              <span className="text-xs font-bold text-[#131b2e]">
                Tabel Rincian Data
              </span>
              <span className="text-[10px] text-[#707881]">
                Pembaruan: {item.lastUpdated}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf8ff] text-[#535f70] uppercase font-bold text-[10px] tracking-wider border-b border-[#e2e7ff]">
                  <tr>
                    {item.tableData.headers.map((h, i) => (
                      <th key={i} className="px-4 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e7ff] text-[#3f4850]">
                  {item.tableData.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-[#faf8ff] transition">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className={`px-4 py-2.5 ${cellIdx === 0 ? 'font-semibold text-[#131b2e]' : ''}`}>
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

        {/* Bottom Service Cards */}
        <div className="p-5 rounded-2xl bg-white border border-[#dae2fd] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center md:text-left">
            <h4 className="text-sm font-extrabold text-[#131b2e]">Layanan Mandiri Warga</h4>
            <p className="text-xs text-[#535f70]">
              Pengurusan surat keterangan dan pelaporan sarana lingkungan secara online.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              onClick={onOpenLetterModal}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-[#004d77] text-white font-bold text-xs transition shadow-xs"
            >
              Permohonan Surat
            </button>
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2 rounded-xl bg-[#f2f3ff] hover:bg-[#e2e7ff] text-primary border border-[#dae2fd] font-bold text-xs transition"
            >
              Lapor Kerusakan
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
