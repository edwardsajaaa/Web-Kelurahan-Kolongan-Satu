'use client';

import React from 'react';
import {
  Network,
  Briefcase,
  UserCheck,
  Shield,
  HeartHandshake,
  Hammer,
} from 'lucide-react';

export default function StrukturOrganisasiSection() {
  const seksiTeknis = [
    {
      badge: 'KASIE. PEMERINTAHAN DAN TRANTIB',
      badgeColor: 'bg-[#cce5ff] text-[#004b73]',
      icon: Shield,
      name: 'DJONNY MAWEIKERE, S.IP',
      nip: '19700616 200801 1 027',
      pembantu: 'Pembantu Kasie. Pemerintahan dan Trantib',
    },
    {
      badge: 'KASIE. KESRA',
      badgeColor: 'bg-[#6cf8bb]/40 text-[#005236]',
      icon: HeartHandshake,
      name: 'ENGLIN LIMI TUMIWA, S.IP',
      nip: '19900318 201102 2 001',
      pembantu: 'Pembantu Kasie. Kesra',
    },
    {
      badge: 'KASIE. PEMBANGUNAN',
      badgeColor: 'bg-[#d3e4fe] text-[#004b73]',
      icon: Hammer,
      name: 'RAYNOLD MATINDAS, SE',
      nip: '19821105 201102 1 001',
      pembantu: 'Pembantu Kasie. Pembangunan',
    },
  ];

  const unsurKewilayahan = [
    {
      lingkungan: 'LINGKUNGAN I',
      pala: 'MEKY MARIO TURANGAN',
      mevrouw: 'ATHANASIUS RICKY TIBIE',
    },
    {
      lingkungan: 'LINGKUNGAN II',
      pala: 'DEVID P.N. TASIK',
      mevrouw: 'ANTONIUS KAPOJOS',
    },
    {
      lingkungan: 'LINGKUNGAN III',
      pala: 'AGUSTINUS KAPARANG',
      mevrouw: 'PAULUS MONTOLALU',
    },
    {
      lingkungan: 'LINGKUNGAN IV',
      pala: 'NOVEMBLYS PUSUNG',
      mevrouw: 'JEFRY MAWIKERE',
    },
    {
      lingkungan: 'LINGKUNGAN V',
      pala: 'DRY TURAMBI',
      mevrouw: 'MUKLI NELSON MUAJA',
    },
  ];

  return (
    <section
      id="struktur-organisasi"
      className="w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 mb-12 2xl:mb-16 scroll-mt-24 no-print"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-10 2xl:p-14 shadow-sm border border-[#e2e7ff] space-y-10">
        {/* ============================================================ */}
        {/* SECTION HEADER                                               */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#eaedff] gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cce5ff]/70 text-[#006194] text-xs font-bold">
              <Network className="w-3.5 h-3.5" />
              <span>Struktur Pemerintahan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl 2xl:text-4xl text-[#131b2e] font-bold tracking-tight">
              Struktur Organisasi &amp; Tata Kelola
            </h2>
          </div>
          <p className="text-xs sm:text-sm 2xl:text-base text-[#535f70] max-w-md 2xl:max-w-lg leading-relaxed">
            Papan struktur resmi aparatur Pemerintah Kelurahan Kolongan Satu, Kecamatan Tomohon Tengah.
          </p>
        </div>

        {/* ============================================================ */}
        {/* HIERARCHY CHART                                              */}
        {/* ============================================================ */}
        <div className="space-y-8 pt-2">
          {/* LEVEL 1: LURAH (Top Center) */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-lg bg-white rounded-2xl border-2 border-[#006194] shadow-sm p-5 2xl:p-6 text-center relative group hover:shadow-md transition-shadow">
              <span className="inline-block px-5 py-1 rounded-full text-xs font-bold bg-[#006194] text-white uppercase tracking-wider mb-2.5">
                Lurah
              </span>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-extrabold text-[#131b2e] leading-snug">
                THERESIA J. KAUNANG, SE
              </h3>
              <p className="text-xs sm:text-sm font-mono font-semibold text-[#006194] mt-1 bg-[#cce5ff]/40 inline-block px-3 py-0.5 rounded-full">
                NIP : 19731206 200312 2 007
              </p>
              <p className="text-xs text-[#535f70] font-medium mt-1.5">
                Pimpinan Utama Wilayah Kelurahan Kolongan Satu
              </p>
            </div>

            {/* Connecting Vertical Stem */}
            <div className="w-0.5 h-8 bg-[#006194]/40 my-1" />
          </div>

          {/* LEVEL 2: JABATAN FUNGSIONAL & SEKRETARIAT */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Box 1: Jabatan Fungsional */}
            <div className="bg-[#f2f3ff]/80 rounded-2xl p-5 2xl:p-6 border border-[#dae2fd] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#cce5ff] text-[#004b73]">
                    UNSUR STAF
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white/80 text-[#006194] flex items-center justify-center shadow-2xs">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#131b2e] mt-3">
                  JABATAN FUNGSIONAL
                </h4>
                <p className="text-xs sm:text-sm text-[#535f70] mt-1.5 leading-relaxed">
                  Pelayanan teknis, operasional keahlian, dan penunjang tugas pokok kelurahan.
                </p>
              </div>
            </div>

            {/* Box 2: Sekretaris & Pelaksana */}
            <div className="bg-[#f2f3ff]/80 rounded-2xl p-5 2xl:p-6 border border-[#dae2fd] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#006194] text-white">
                    SEKRETARIS
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white/80 text-[#006194] flex items-center justify-center shadow-2xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#131b2e] mt-3">
                  FEBRONIA L. PIJOH, S.Kom
                </h4>
                <p className="text-xs sm:text-sm font-mono font-semibold text-[#006194] mt-0.5 mb-3">
                  NIP : 19780203 200902 2 002
                </p>

                {/* Sub-roles inside secretariat */}
                <div className="space-y-2 pt-2 border-t border-[#dae2fd]/70">
                  <div className="flex items-center justify-between text-xs py-1.5 px-3 bg-white/90 rounded-xl border border-[#eaedff]">
                    <div>
                      <span className="font-semibold text-[#131b2e] block">KARLIN S. PIETER</span>
                      <span className="text-[10px] text-[#535f70] font-mono">NIP : 19710830 201102 2 001</span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#cce5ff]/80 text-[#004b73]">
                      Pelaksana
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 px-3 bg-white/90 rounded-xl border border-[#eaedff]">
                    <span className="text-[#535f70] font-medium">-</span>
                    <span className="text-[11px] font-medium text-[#535f70]">
                      Pembantu Sekretaris
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION DIVIDER: SEKSI TEKNIS PELAYANAN                      */}
          {/* ============================================================ */}
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#dae2fd]"></div>
            </div>
            <div className="relative inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white text-xs font-bold uppercase tracking-wider text-[#006194] border border-[#dae2fd] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#006194]"></span>
              <span>Seksi Teknis Pelayanan</span>
            </div>
          </div>

          {/* LEVEL 3: 3 KASIE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {seksiTeknis.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#f2f3ff]/70 hover:bg-white rounded-2xl p-5 2xl:p-6 border border-[#dae2fd] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-[11px] 2xl:text-xs font-bold ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-white/80 text-[#006194] flex items-center justify-center shadow-2xs">
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-[#131b2e] leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs font-mono font-semibold text-[#006194] mt-0.5">
                        NIP : {item.nip}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 mt-4 border-t border-[#eaedff] flex items-center justify-between text-[11px] 2xl:text-xs text-[#535f70]">
                    <span>Staf:</span>
                    <span className="font-semibold text-[#131b2e]">{item.pembantu}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ============================================================ */}
          {/* SECTION DIVIDER: UNSUR KEWILAYAHAN                           */}
          {/* ============================================================ */}
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#dae2fd]"></div>
            </div>
            <div className="relative inline-flex flex-col items-center px-5 py-2 rounded-2xl bg-white border border-[#dae2fd] shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006c49]">
                <span className="w-2 h-2 rounded-full bg-[#006c49]"></span>
                <span>Unsur Kewilayahan (Kepala Lingkungan &amp; Wakil)</span>
              </div>
              <span className="text-[11px] text-[#535f70] font-normal mt-0.5">
                Aparatur Pelaksana Tingkat Lingkungan I sampai Lingkungan V
              </span>
            </div>
          </div>

          {/* LEVEL 4: 5 LINGKUNGAN CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {unsurKewilayahan.map((lingk, idx) => (
              <div
                key={idx}
                className="bg-[#f2f3ff]/70 hover:bg-white rounded-2xl p-4 2xl:p-5 border border-[#dae2fd] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-full py-1.5 rounded-full text-center text-xs font-bold bg-[#006194] text-white mb-3.5 shadow-2xs">
                    {lingk.lingkungan}
                  </div>
                  <div className="space-y-0.5 mb-3">
                    <span className="text-[10px] 2xl:text-[11px] font-bold text-[#535f70] uppercase tracking-wider block">
                      Kepala Lingkungan
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#131b2e] leading-snug">
                      {lingk.pala}
                    </p>
                  </div>
                  <div className="space-y-0.5 pt-2.5 border-t border-[#eaedff]">
                    <span className="text-[10px] 2xl:text-[11px] font-bold text-[#535f70] uppercase tracking-wider block">
                      Wakil Kepala Lingkungan
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-[#006194] leading-snug">
                      {lingk.mevrouw}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
