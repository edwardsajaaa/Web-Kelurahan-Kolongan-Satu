'use client';

import React, { useEffect } from 'react';
import {
  X,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Download,
  BookOpen,
  Users,
  Leaf,
  Mountain,
  Church,
  Palette,
  CheckCircle2,
  Quote,
  ShieldCheck,
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

  const semiotikaItems = [
    {
      num: '01',
      icon: Mountain,
      iconColor: 'bg-[#cce5ff]/60 text-[#006194]',
      badgeColor: 'text-[#006194]',
      title: 'Gunung Lokon & Alam Tomohon',
      desc: 'Melambangkan keteguhan, ketinggian cita-cita, serta kekayaan alam subur dan keasrian vulkanik tanah Minahasa di Kota Tomohon yang menaungi Posko Kolongan Satu.',
      tag: 'Keteguhan Karakter & Potensi Alam',
    },
    {
      num: '02',
      icon: Church,
      iconColor: 'bg-[#6cf8bb]/30 text-[#006c49]',
      badgeColor: 'text-[#006c49]',
      title: 'Perkampungan & Rumah Ibadah',
      desc: 'Melambangkan nilai religiusitas yang kokoh, toleransi antarwarga, kerukunan bermasyarakat, dan kehangatan tradisi kekeluargaan rukun warga Wanua Kolongan Satu.',
      tag: 'Religiusitas & Kehangatan Wanua',
    },
    {
      num: '03',
      icon: BookOpen,
      iconColor: 'bg-[#d3e4fe]/70 text-[#004b73]',
      badgeColor: 'text-[#004b73]',
      title: 'Buku Terbuka (Tridharma)',
      desc: 'Melambangkan ilmu pengetahuan, dedikasi riset akademis, dan komitmen transfer pengetahuan dari mahasiswa UNSRAT kepada segenap lapisan masyarakat kelurahan.',
      tag: 'Aplikasi Riset & Edukasi Terpadu',
    },
    {
      num: '04',
      icon: Users,
      iconColor: 'bg-[#cce5ff]/60 text-[#006194]',
      badgeColor: 'text-[#006194]',
      title: 'Tiga Figur Bergandengan',
      desc: 'Merepresentasikan sinergi kolaboratif antara Mahasiswa KKT, Aparatur Pemerintah Kelurahan, dan Tokoh Masyarakat yang bersatu padu membangun daerah.',
      tag: 'Tri-Partit Kolaborasi Pembangunan',
    },
    {
      num: '05',
      icon: Leaf,
      iconColor: 'bg-[#6cf8bb]/30 text-[#006c49]',
      badgeColor: 'text-[#006c49]',
      title: 'Dua Helai Daun Hijau Bertunas',
      desc: 'Simbol kesuburan agraris Tomohon, regenerasi generasi muda, keberlanjutan program kerja (sustainability), dan keasrian ekologis lingkungan sekitarnya.',
      tag: 'Regenerasi & Keberlanjutan Program',
    },
    {
      num: '06',
      icon: Palette,
      iconColor: 'bg-[#eaedff] text-[#131b2e]',
      badgeColor: 'text-[#535f70]',
      title: 'Harmoni Biru & Hijau',
      desc: 'Warna biru melambangkan kedamaian, integritas intelektual almamater, dan keterbukaan data; warna hijau melambangkan kesegaran alam, ketenangan, dan kemakmuran warga.',
      tag: 'Kedamaian, Integritas, & Kemakmuran',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#faf8ff] w-full max-w-6xl max-h-[92vh] 2xl:max-h-[88vh] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#dae2fd] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#006194] to-[#004770] text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-xs">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-sky-200" />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-sky-200">
                KKT Angkatan 149 &bull; Universitas Sam Ratulangi
              </div>
              <h3 className="text-base sm:text-xl 2xl:text-2xl font-bold text-white tracking-tight leading-snug">
                Makna &amp; Filosofi Lambang KKT Posko Kolongan Satu
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/images/logo-kkt-149.png"
              download="Lambang_KKT149_Kolongan_Satu.png"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition cursor-pointer"
              title="Unduh Berkas Lambang"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Berkas</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8">
          {/* Bento Showcase Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* Left Column (5 Cols): Emblem Visual Focus */}
            <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs border border-[#dae2fd] flex flex-col justify-between items-center text-center relative overflow-hidden group">
              <div className="absolute -top-16 -left-16 w-40 h-40 bg-[#006194]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-[#006c49]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Top verification tag */}
              <div className="w-full flex items-center justify-between pb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6cf8bb]/30 text-[#005236] text-[11px] 2xl:text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#006c49]"></span>
                  <span>Lambang Resmi Terverifikasi</span>
                </span>
                <span className="text-[11px] 2xl:text-xs text-[#707881] font-semibold">Posko Kolongan 1</span>
              </div>

              {/* Circular Graphic Showcase Frame */}
              <div className="relative my-4 py-2 flex items-center justify-center">
                <div className="absolute inset-0 m-auto w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-[#cce5ff]/50 via-[#eaedff]/40 to-[#6ffbbe]/40 blur-xl opacity-80 group-hover:scale-105 transition-transform duration-500" />
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white shadow-md p-3 flex items-center justify-center ring-8 ring-[#f2f3ff]">
                  <img
                    src="/images/logo-kkt-149.png"
                    alt="Lambang Resmi KKT 149 UNSRAT Posko Kolongan Satu"
                    className="w-full h-full object-contain rounded-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Bottom Micro Metadata & Asset Details */}
              <div className="w-full flex flex-col gap-2 pt-2">
                <div className="flex items-center justify-between text-left py-2 px-3 rounded-xl bg-[#f2f3ff] text-xs text-[#535f70]">
                  <span>Resolusi Master:</span>
                  <span className="font-semibold text-[#131b2e]">1254 &times; 1254 PX</span>
                </div>
                <div className="flex items-center justify-between text-left py-2 px-3 rounded-xl bg-[#f2f3ff] text-xs text-[#535f70]">
                  <span>Afiliasi:</span>
                  <span className="font-semibold text-[#131b2e]">UNSRAT Manado</span>
                </div>
                <a
                  href="/images/logo-kkt-149.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-full bg-[#eaedff] text-[#006194] text-xs font-bold hover:bg-[#dce2ff] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Resolusi Penuh</span>
                </a>
              </div>
            </div>

            {/* Right Column (7 Cols): Short Philosophy Card */}
            <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs border border-[#dae2fd] flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#006194]">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold tracking-wider uppercase">Filosofi Singkat</span>
                </div>

                <h4 className="text-xl sm:text-2xl font-bold text-[#131b2e] leading-snug">
                  Harmonisasi Sains, Iman, dan Pengabdian Wanua
                </h4>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#f2f3ff] text-xs sm:text-sm text-[#131b2e] leading-relaxed font-normal border border-[#eaedff]">
                  &ldquo;Logo KKT 149 UNSRAT melambangkan semangat pengabdian, pendidikan, kebersamaan, dan pembangunan masyarakat di Kelurahan Kolongan Satu, Kota Tomohon. Gunung dan alam mencerminkan kekuatan serta potensi daerah, perkampungan dan rumah ibadah melambangkan keharmonisan masyarakat, sementara buku terbuka merepresentasikan ilmu pengetahuan. Tiga figur manusia menggambarkan kolaborasi mahasiswa dan masyarakat, sedangkan daun hijau melambangkan pertumbuhan dan keberlanjutan. Warna biru dan hijau mencerminkan kepercayaan, ketenangan, kehidupan, dan kesejahteraan. Identitas KKT 149 UNSRAT &ndash; Kota Tomohon &bull; Kolongan 1 menunjukkan angkatan dan lokasi pelaksanaan kegiatan.&rdquo;
                </div>

                {/* Quick Pillars Highlight */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-[#faf8ff] border border-[#eaedff] flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#006194]/10 text-[#006194] flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#131b2e]">Edukasi</span>
                      <span className="text-[10px] text-[#535f70]">Tridharma Kampus</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#faf8ff] border border-[#eaedff] flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#006c49]/10 text-[#006c49] flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#131b2e]">Kolaborasi</span>
                      <span className="text-[10px] text-[#535f70]">Sinergi Warga</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#faf8ff] border border-[#eaedff] flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#6cf8bb]/30 text-[#006c49] flex items-center justify-center shrink-0">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#131b2e]">Keberlanjutan</span>
                      <span className="text-[10px] text-[#535f70]">Kesejahteraan Wanua</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Note */}
              <div className="pt-3 border-t border-[#eaedff] flex flex-wrap items-center justify-between gap-2 text-xs text-[#535f70]">
                <span>Ditetapkan: Periode Pengabdian KKT 149 UNSRAT</span>
                <span className="font-semibold text-[#006194]">Kelurahan Kolongan Satu</span>
              </div>
            </div>
          </section>

          {/* Detailed Semiotics Breakdown Grid */}
          <section className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-[#006194] block mb-0.5">
                  Bedah Desain &amp; Semiotika
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-[#131b2e]">
                  Rincian Unsur &amp; Makna Simbolis
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#535f70] max-w-md">
                Tiap komponen geometris dan pigmen warna dirancang secara terukur untuk mencerminkan nilai luhur Tri Dharma dan kearifan lokal Tomohon.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {semiotikaItems.map((item) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={item.num}
                    className="bg-white rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between border border-[#e2e7ff] group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${item.iconColor}`}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-extrabold text-[#9da5b0]">{item.num}</span>
                      </div>
                      <h5 className="text-base font-bold text-[#131b2e] leading-snug">
                        {item.title}
                      </h5>
                      <p className="text-xs text-[#535f70] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className={`pt-4 mt-4 border-t border-[#eaedff] flex items-center gap-1.5 text-xs font-semibold ${item.badgeColor}`}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.tag}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Cultural Heritage Banner: Si Tou Timou Tumou Tou */}
          <section className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs border border-[#dae2fd] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 bg-[#006194]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-start gap-4 max-w-3xl">
              <div className="w-12 h-12 rounded-2xl bg-[#cce5ff]/70 text-[#006194] flex items-center justify-center shrink-0 mt-1">
                <Quote className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] sm:text-xs text-[#006194] uppercase font-bold tracking-wider block">
                  Falsafah Luhur Minahasa &bull; Dr. G.S.S.J. Ratulangi
                </span>
                <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-[#131b2e] italic tracking-tight">
                  &ldquo;Si Tou Timou Tumou Tou&rdquo;
                </h4>
                <p className="text-xs sm:text-sm text-[#535f70] leading-relaxed">
                  Manusia baru dapat disebut sebagai manusia jika ia mampu memanusiakan manusia lainnya. Mahasiswa KKT Angkatan 149 UNSRAT bertekad mengamalkan nilai ini melalui dedikasi nyata, penyusunan monografi digital transparan, dan pelayanan tanpa pamrih di bumi Kolongan Satu.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f2f3ff] text-[#006194] text-xs font-bold border border-[#dae2fd]">
                <ShieldCheck className="w-4 h-4 text-[#006c49]" />
                <span>Pengabdian Luhur 2026</span>
              </span>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#dae2fd] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-[#535f70] font-medium">
            KKT 149 UNSRAT &bull; Kelurahan Kolongan Satu, Kota Tomohon
          </p>
          <div className="flex items-center gap-2">
            <a
              href="/images/logo-kkt-149.png"
              download="Lambang_KKT149_Kolongan_Satu.png"
              className="inline-flex sm:hidden items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#eaedff] text-[#006194] transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#006194] hover:bg-[#004f7a] text-white transition shadow-sm hover:shadow-md cursor-pointer"
            >
              Tutup Informasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
