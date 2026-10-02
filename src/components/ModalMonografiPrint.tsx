'use client';
import React from 'react';
import { MonografiItem } from '@/data/monografiData';
import { Printer, X, FileText, CheckCircle2 } from 'lucide-react';

interface ModalMonografiPrintProps {
  isOpen: boolean;
  onClose: () => void;
  item: MonografiItem | null;
}

export default function ModalMonografiPrint({
  isOpen,
  onClose,
  item,
}: ModalMonografiPrintProps) {
  if (!isOpen || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Top Control Bar */}
        <div className="no-print p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Lembaran Rekapitulasi Monografi Resmi</h2>
              <p className="text-[11px] text-slate-300">Format Fisik Papan Profil Kelurahan Kolongan Satu</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-white text-slate-900 font-serif leading-relaxed">
          {/* Official Kop */}
          <div className="text-center border-b-4 border-double border-slate-900 pb-3 mb-6">
            <h3 className="text-xs font-bold uppercase font-sans tracking-widest text-slate-700">
              PEMERINTAH KOTA TOMOHON • KECAMATAN TOMOHON TENGAH
            </h3>
            <h1 className="text-xl font-black uppercase font-sans tracking-wide text-slate-950 mt-1">
              KELURAHAN KOLONGAN SATU
            </h1>
            <p className="text-[10px] font-sans text-slate-600 italic mt-0.5">
              Lembaran Register Arsip Data Monografi Profil Kelurahan Periode Tahun {item.year}
            </p>
          </div>

          <div className="mb-6 font-sans">
            <div className="flex justify-between items-center bg-slate-100 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Judul Rekapitulasi</span>
                <h2 className="text-base font-extrabold text-slate-900">{item.title}</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500">Status Validasi</span>
                <p className="text-xs font-bold text-emerald-800">
                  {item.statusTahapan === 'disahkan_lurah' ? '✓ DISAHKAN RESMI LURAH' : 'DRAF OPERATOR'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-3 mb-6 font-sans text-center">
            {item.metrics.totalWarga ? (
              <>
                <div className="p-3 border border-slate-300 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Total Penduduk</span>
                  <p className="text-base font-extrabold text-slate-900">{item.metrics.totalWarga} Jiwa</p>
                </div>
                <div className="p-3 border border-slate-300 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Kepala Keluarga</span>
                  <p className="text-base font-extrabold text-slate-900">{item.metrics.kepalaKeluarga} KK</p>
                </div>
                <div className="p-3 border border-slate-300 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Laki-Laki</span>
                  <p className="text-base font-extrabold text-slate-900">{item.metrics.pria} Jiwa</p>
                </div>
                <div className="p-3 border border-slate-300 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Perempuan</span>
                  <p className="text-base font-extrabold text-slate-900">{item.metrics.wanita} Jiwa</p>
                </div>
              </>
            ) : (
              item.metrics.customMetrics?.map((m, idx) => (
                <div key={idx} className="p-3 border border-slate-300 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{m.label}</span>
                  <p className="text-base font-extrabold text-slate-900">{m.value}</p>
                </div>
              ))
            )}
          </div>

          {/* Description */}
          <div className="mb-6 font-sans text-xs text-slate-700 leading-relaxed space-y-2">
            <h4 className="font-bold uppercase text-[11px] text-slate-900 border-b border-slate-200 pb-1">
              Ringkasan Naratif Monografi
            </h4>
            <p>{item.description}</p>
            {item.detailedNotes && (
              <ul className="list-disc pl-5 space-y-1">
                {item.detailedNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Table Data */}
          {item.tableData && (
            <div className="mb-8 font-sans">
              <h4 className="font-bold uppercase text-[11px] text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Tabel Statistik Data Agregat
              </h4>
              <table className="w-full text-xs text-left border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    {item.tableData.headers.map((h, i) => (
                      <th key={i} className="p-2 border-r border-slate-300 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.tableData.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-slate-200">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-2 border-r border-slate-200">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 font-sans text-center text-xs">
            <div>
              <p className="text-slate-600">Mengetahui & Memverifikasi,</p>
              <p className="font-bold text-slate-900 mt-0.5">Sekretaris Kelurahan Kolongan Satu</p>
              <div className="h-16 flex items-center justify-center italic text-slate-700 font-serif">
                Ferromel L. Pua, S.Kom
              </div>
              <p className="font-bold underline text-slate-950">FERROMEL L. PUA, S.Kom</p>
              <p className="text-[10px] text-slate-600 font-mono">NIP. 19780203 200501 1 012</p>
            </div>

            <div>
              <p className="text-slate-600">Mengesahkan Secara Sah,</p>
              <p className="font-bold text-slate-900 mt-0.5">Lurah Kolongan Satu</p>
              <div className="h-16 flex items-center justify-center italic font-bold text-slate-900 font-serif">
                Theresia J. Kaunang, SE
              </div>
              <p className="font-bold underline text-slate-950">THERESIA J. KAUNANG, SE</p>
              <p className="text-[10px] text-slate-600 font-mono">NIP. 19731206 199803 2 004</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
