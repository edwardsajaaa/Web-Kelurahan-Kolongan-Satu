'use client';

import React, { useEffect } from 'react';
import {
  X,
  GraduationCap,
  Mountain,
  Church,
  BookOpen,
  Leaf,
  Compass,
  MapPin,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ModalFilosofiLogoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalFilosofiLogo({ isOpen, onClose }: ModalFilosofiLogoProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filosofiItems = [
    {
      icon: Mountain,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      title: 'Gunung Lokon & Langit Biru Cerah',
      desc: 'Melambangkan kemegahan alam Kota Tomohon, keteguhan tekad, serta cita-cita luhur mahasiswa dalam mengabdi di tanah Minahasa di bawah naungan Gunung Lokon yang agung.',
    },
    {
      icon: Church,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      title: 'Gereja & Simbol Religi',
      desc: 'Mencerminkan nilai religius, moralitas, kerukunan antarumat, dan kehangatan kekeluargaan warga Kelurahan Kolongan Satu yang berlandaskan kasih persaudaraan.',
    },
    {
      icon: MapPin,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      title: 'Papan Posko "TOMOHON KOLONGAN 1" & Pemukiman',
      desc: 'Menegaskan identitas lokasi posko pengabdian nyata. Melambangkan kehadiran mahasiswa yang membaur harmonis dan bersinergi langsung bersama masyarakat desa.',
    },
    {
      icon: BookOpen,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      title: 'Buku Terbuka & Tiga Figur Akademisi',
      desc: 'Representasi Tri Dharma Perguruan Tinggi (Pendidikan, Penelitian, dan Pengabdian). Tiga figur insan akademis melambangkan sinergi gotong royong, kebersamaan, dan kesatuan tekad melayani.',
    },
    {
      icon: Leaf,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      title: 'Sepasang Daun Hijau',
      desc: 'Melambangkan pertumbuhan berkelanjutan, kesuburan tanah agraris Kota Tomohon (Kota Bunga), serta semangat pembaruan dan kelestarian lingkungan hidup.',
    },
    {
      icon: Compass,
      color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
      title: 'Bingkai Lingkaran & Biru Dongker (Navy)',
      desc: 'Bentuk lingkaran melambangkan kebulatan tekad dan ikatan persaudaraan yang utuh. Warna biru dongker melambangkan kedalaman ilmu, profesionalisme akademis UNSRAT, dan ketenangan bertindak.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#dae2fd] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#006194] to-[#004770] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-xs">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-sky-200" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-200">
                KKT Angkatan 149 &bull; Universitas Sam Ratulangi
              </div>
              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                Makna &amp; Filosofi Lambang KKT Posko Kolongan Satu
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Hero Section: Logo Preview & Overview */}
          <div className="bg-[#faf8ff] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#dae2fd] flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white p-2 shadow-md border border-[#dae2fd] flex items-center justify-center overflow-hidden">
                <img
                  src="/images/logo-kkt-149.png"
                  alt="Logo KKT 149 UNSRAT Kolongan Satu"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <a
                href="/images/logo-kkt-149.png"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-1 right-1 bg-[#006194] text-white p-2 rounded-full shadow-md hover:bg-[#004f7a] transition flex items-center justify-center text-xs"
                title="Buka gambar ukuran penuh"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 bg-[#eef3ff] text-[#006194] px-3 py-1 rounded-full text-xs font-bold border border-[#dae2fd]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Identitas Visual Pengabdian Masyarakat 2026</span>
              </div>
              <h4 className="text-lg sm:text-2xl font-bold text-[#131b2e] leading-snug">
                Lambang Resmi KKT 149 UNSRAT Posko Kolongan Satu
              </h4>
              <p className="text-xs sm:text-sm text-[#535f70] leading-relaxed">
                Setiap goresan dan elemen visual dalam lambang ini memadukan jati diri akademisi Universitas Sam Ratulangi dengan kearifan lokal, bentang alam, serta kehidupan bermasyarakat di Kelurahan Kolongan Satu, Kota Tomohon.
              </p>
            </div>
          </div>

          {/* Grid of 6 Philosophical Elements */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold uppercase tracking-wider text-[#131b2e]">
              Rincian Unsur &amp; Makna Simbolis
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filosofiItems.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-[#e2e7ff] hover:border-[#006194]/40 hover:shadow-sm transition-all flex items-start gap-3.5"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h6 className="text-sm font-bold text-[#131b2e] leading-tight">
                        {item.title}
                      </h6>
                      <p className="text-xs text-[#535f70] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#faf8ff] border-t border-[#dae2fd] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-[#535f70] font-medium">
            KKT 149 UNSRAT &bull; Kelurahan Kolongan Satu, Kota Tomohon
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-bold bg-[#006194] hover:bg-[#004f7a] text-white transition shadow-xs cursor-pointer"
          >
            Tutup Informasi
          </button>
        </div>
      </div>
    </div>
  );
}
