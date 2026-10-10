'use client';

import React from 'react';
import { GraduationCap, Users, Sparkles, Building2 } from 'lucide-react';
import { KKT_TEAM_DATA, KktMember } from '@/data/kktTeamData';

export default function KktTeamSection() {
  const { pengurusPosko, bidangProgram, bidangHumas, bidangPublikasi, bidangPelaporan, angkatan, university, poskoLocation } = KKT_TEAM_DATA;

  const renderMemberCard = (member: KktMember, isLeader: boolean = false) => (
    <div key={member.id} className="group flex flex-col text-left">
      {/* Photo Frame */}
      <div className="relative aspect-[4/5] w-full rounded-2xl 2xl:rounded-3xl overflow-hidden bg-[#eef3ee] border border-[#dae2fd]/70 shadow-xs group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
        <img
          src={member.photoUrl}
          alt={`${member.name} - ${member.role}`}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Subtle Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Member Details */}
      <div className="pt-3 2xl:pt-4 space-y-0.5">
        <h4 className="text-base sm:text-lg 2xl:text-xl font-bold text-[#131b2e] group-hover:text-[#006194] transition-colors leading-snug">
          {member.name}
        </h4>
        <p className="text-xs sm:text-sm 2xl:text-base text-[#535f70] font-medium">
          {member.role}
        </p>
      </div>
    </div>
  );

  return (
    <section
      id="tim-kkt"
      className="w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 mb-16 2xl:mb-20 scroll-mt-24 no-print"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-10 2xl:p-14 shadow-sm border border-[#e2e7ff] space-y-12">
        {/* ============================================================ */}
        {/* 1. SECTION HEADER (Harmonized with Landing Page Aesthetic)   */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#eaedff] gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#f2f3ff] text-[#006194] px-3.5 py-1 rounded-full text-xs 2xl:text-sm font-bold border border-[#dae2fd]">
              <GraduationCap className="w-4 h-4" />
              <span>{angkatan} &bull; {university}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl 2xl:text-4xl 3xl:text-5xl text-[#131b2e] font-bold tracking-tight">
              Tim KKT Kelurahan Kolongan Satu
            </h2>
            <p className="text-xs sm:text-sm 2xl:text-base text-[#535f70] max-w-2xl leading-relaxed">
              Mahasiswa Pengabdian Masyarakat {poskoLocation}, Kecamatan Tomohon Tengah. Bersinergi bersama Pemerintah Kelurahan dan warga dalam mewujudkan keterbukaan data monografi dan inovasi pelayanan publik terpadu.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-[#faf8ff] px-4 py-2 rounded-2xl border border-[#dae2fd] text-xs 2xl:text-sm text-[#006194] font-semibold shrink-0">
            <Building2 className="w-4 h-4" />
            <span>Posko Pengabdian Aktif</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. GROUP 1: PENGURUS POSKO                                   */}
        {/* ============================================================ */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-[#131b2e] tracking-tight">
              Pengurus Posko
            </h3>
            <div className="h-0.5 flex-1 bg-[#eaedff]" />
            <span className="text-xs 2xl:text-sm text-[#535f70] font-medium hidden sm:inline">
              3 Anggota Inti
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl">
            {pengurusPosko.map((m) => renderMemberCard(m, m.role.toLowerCase().includes('koordinator')))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. GROUP 2: BIDANG PROGRAM                                   */}
        {/* ============================================================ */}
        <div className="space-y-6 pt-4 border-t border-[#eaedff]">
          <div className="flex items-center gap-3">
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-[#131b2e] tracking-tight">
              Bidang Program
            </h3>
            <div className="h-0.5 flex-1 bg-[#eaedff]" />
            <span className="text-xs 2xl:text-sm text-[#535f70] font-medium hidden sm:inline">
              {bidangProgram.length} Anggota
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl">
            {bidangProgram.map((m) => renderMemberCard(m, m.role.toLowerCase().includes('koordinator')))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. GROUP 3: BIDANG HUBUNGAN MASYARAKAT (HUMAS)               */}
        {/* ============================================================ */}
        <div className="space-y-6 pt-4 border-t border-[#eaedff]">
          <div className="flex items-center gap-3">
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-[#131b2e] tracking-tight">
              Bidang Hubungan Masyarakat (Humas)
            </h3>
            <div className="h-0.5 flex-1 bg-[#eaedff]" />
            <span className="text-xs 2xl:text-sm text-[#535f70] font-medium hidden sm:inline">
              {bidangHumas.length} Anggota
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl">
            {bidangHumas.map((m) => renderMemberCard(m, m.role.toLowerCase().includes('koordinator')))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. GROUP 4: BIDANG PUBLIKASI, DEKORASI & DOKUMENTASI         */}
        {/* ============================================================ */}
        <div className="space-y-6 pt-4 border-t border-[#eaedff]">
          <div className="flex items-center gap-3">
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-[#131b2e] tracking-tight">
              Bidang Publikasi, Dekorasi, dan Dokumentasi
            </h3>
            <div className="h-0.5 flex-1 bg-[#eaedff]" />
            <span className="text-xs 2xl:text-sm text-[#535f70] font-medium hidden sm:inline">
              {bidangPublikasi.length} Anggota
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl">
            {bidangPublikasi.map((m) => renderMemberCard(m, m.role.toLowerCase().includes('koordinator')))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 6. GROUP 5: BIDANG PELAPORAN                                 */}
        {/* ============================================================ */}
        <div className="space-y-6 pt-4 border-t border-[#eaedff]">
          <div className="flex items-center gap-3">
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-[#131b2e] tracking-tight">
              Bidang Pelaporan
            </h3>
            <div className="h-0.5 flex-1 bg-[#eaedff]" />
            <span className="text-xs 2xl:text-sm text-[#535f70] font-medium hidden sm:inline">
              {bidangPelaporan.length} Anggota
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl">
            {bidangPelaporan.map((m) => renderMemberCard(m, m.role.toLowerCase().includes('koordinator')))}
          </div>
        </div>
      </div>
    </section>
  );
}
