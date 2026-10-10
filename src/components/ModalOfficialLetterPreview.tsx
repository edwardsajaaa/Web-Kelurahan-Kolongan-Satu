'use client';
import React from 'react';
import { LetterRequest } from '@/data/lettersData';
import { Printer, X, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';

interface ModalOfficialLetterPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  letter: LetterRequest | null;
}

export default function ModalOfficialLetterPreview({
  isOpen,
  onClose,
  letter,
}: ModalOfficialLetterPreviewProps) {
  if (!isOpen || !letter) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 print:static print:p-0 print:bg-white print:block">
      <div className="bg-white w-full max-w-3xl max-h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 print:max-w-none print:max-h-none print:rounded-none print:border-none print:shadow-none print:overflow-visible">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Printer className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Pratinjau Dokumen Surat Resmi</h2>
              <p className="text-[11px] text-slate-300">Format Cetak Pemerintah Kelurahan Kolongan Satu</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Paper Layout */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-white text-slate-900 font-serif leading-relaxed print:p-0 print:overflow-visible">
          {/* KOP SURAT RESMI */}
          <div className="text-center border-b-4 border-double border-slate-900 pb-3 mb-6 relative">
            {/* Logo Lambang Daerah Kota Tomohon */}
            <div className="flex items-center justify-center space-x-4 mb-1">
              <div className="w-14 h-14 flex items-center justify-center shrink-0">
                <img
                  src="/images/logo-tomohon.png"
                  alt="Lambang Daerah Kota Tomohon"
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wider uppercase font-sans">
                  PEMERINTAH KOTA TOMOHON
                </h3>
                <h2 className="text-base font-extrabold tracking-wider uppercase font-sans">
                  KECAMATAN TOMOHON TENGAH
                </h2>
                <h1 className="text-xl font-black tracking-widest uppercase font-sans text-slate-900">
                  KELURAHAN KOLONGAN SATU
                </h1>
                <p className="text-[11px] font-sans text-slate-600 italic">
                  Alamat: Jalan Raya Tomohon, Kelurahan Kolongan Satu, Kota Tomohon - Sulawesi Utara 95438
                </p>
              </div>
            </div>
          </div>

          {/* JUDUL SURAT */}
          <div className="text-center mb-6">
            <h2 className="text-base font-bold underline uppercase tracking-wide">
              {letter.jenisSurat}
            </h2>
            <p className="text-xs font-sans text-slate-700 mt-1">
              Nomor: 470 / KKT / {letter.noRegistrasi.replace('REG-KKT-', '')} / 2026
            </p>
          </div>

          {/* ISI PERNYATAAN SURAT */}
          <div className="text-xs space-y-3 font-sans leading-relaxed text-slate-800 text-justify">
            <p>
              Yang bertanda tangan di bawah ini, Lurah Kolongan Satu, Kecamatan Tomohon Tengah, Kota Tomohon, Provinsi Sulawesi Utara, menerangkan dengan sesungguhnya bahwa:
            </p>

            <div className="pl-6 space-y-1.5 py-2 font-sans">
              <div className="grid grid-cols-3">
                <span className="font-semibold text-slate-700">Nama Lengkap</span>
                <span className="col-span-2 font-bold uppercase text-slate-950">: {letter.namaPemohon}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="font-semibold text-slate-700">Nomor Induk Kependudukan (NIK)</span>
                <span className="col-span-2 font-mono font-bold text-slate-950">: {letter.nikPemohon}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="font-semibold text-slate-700">Alamat Tempat Tinggal</span>
                <span className="col-span-2 text-slate-950">: {letter.alamatLengkap}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="font-semibold text-slate-700">Pekerjaan</span>
                <span className="col-span-2 text-slate-950">: {letter.pekerjaan || 'Wiraswasta'}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="font-semibold text-slate-700">Wilayah Penugasan Jaga</span>
                <span className="col-span-2 text-slate-950">: Lingkungan {letter.lingkunganId} (Jaga {letter.lingkunganId})</span>
              </div>
            </div>

            <p>
              Adalah benar-benar warga yang bertempat tinggal di wilayah administratif Kelurahan Kolongan Satu, Kecamatan Tomohon Tengah, dan tercatat secara sah pada lembaran Buku Register Kependudukan dan Monografi Digital Kelurahan Kolongan Satu.
            </p>

            <p>
              Surat Keterangan ini diberikan kepada yang bersangkutan untuk keperluan:{' '}
              <strong className="underline text-slate-950">{letter.tujuanKeperluan}</strong>.
            </p>

            <p>
              Demikian Surat Keterangan ini dibuat dan diberikan untuk dapat dipergunakan sebagaimana mestinya.
            </p>
          </div>

          {/* TANDA TANGAN PEJABAT & STEMPEL ELEKTRONIK */}
          <div className="pt-8 flex justify-between items-end font-sans">
            {/* Barcode & Verifikasi Keaslian */}
            <div className="text-center p-3 border border-slate-300 rounded-xl bg-slate-50 w-44 space-y-1">
              <div className="w-16 h-16 mx-auto bg-white p-1 border border-slate-200 rounded flex items-center justify-center">
                <QrCode className="w-14 h-14 text-slate-800" />
              </div>
              <p className="text-[9px] font-bold text-slate-700">KOLONGAN SATU VERIFIED</p>
              <p className="text-[8px] text-slate-500 font-mono">{letter.noRegistrasi}</p>
            </div>

            {/* Kolom Tanda Tangan Lurah */}
            <div className="text-center w-64 space-y-1">
              <p className="text-xs text-slate-700">Tomohon, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
              <p className="text-xs font-bold text-slate-900">LURAH KOLONGAN SATU</p>

              {/* Tanda Tangan & Stempel Resmi */}
              <div className="h-24 flex items-center justify-center relative my-1">
                <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-emerald-500/40 flex items-center justify-center rotate-12 text-[10px] font-bold text-emerald-700/60 uppercase">
                  STEMPEL RESMI DIGITAL
                </div>
                <div className="z-10 font-serif italic font-black text-xl text-sky-900 rotate-[-5deg]">
                  Theresia J. Kaunang
                </div>
              </div>

              <p className="text-xs font-extrabold text-slate-950 underline">
                THERESIA J. KAUNANG, SE
              </p>
              <p className="text-[10px] text-slate-600 font-mono">
                NIP. 19731206 199803 2 004
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
