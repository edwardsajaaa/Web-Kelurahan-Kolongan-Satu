'use client';

import React, { useState } from 'react';
import { KKT_TEAM_DATA, KktMember } from '@/data/kktTeamData';
import ModalFilosofiLogo from '@/components/ModalFilosofiLogo';
import { Users, Layers, GraduationCap, Award, ShieldCheck, UserCheck } from 'lucide-react';

export default function KktTeamSection() {
  const {
    pengurusPosko,
    bidangProgram,
    bidangHumas,
    bidangPublikasi,
    bidangPelaporan,
    poskoLocation,
    stats,
    supervisors,
  } = KKT_TEAM_DATA;
  const [isFilosofiOpen, setIsFilosofiOpen] = useState(false);

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
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-[#eaedff] gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl 2xl:text-4xl 3xl:text-5xl text-[#131b2e] font-bold tracking-tight">
              Tim KKT Kelurahan Kolongan Satu
            </h2>
            <p className="text-xs sm:text-sm 2xl:text-base text-[#535f70] leading-relaxed">
              Mahasiswa Pengabdian Masyarakat {poskoLocation}, Kecamatan Tomohon Tengah. Bersinergi bersama Pemerintah Kelurahan dan warga dalam mewujudkan keterbukaan data monografi dan inovasi pelayanan publik terpadu.
            </p>
          </div>

          {/* Logo KKT 149 (Hanya logo, klik untuk melihat filosofi) */}
          <button
            type="button"
            onClick={() => setIsFilosofiOpen(true)}
            className="shrink-0 self-start md:self-center group cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95"
            title="Klik untuk melihat filosofi lambang KKT 149"
          >
            <img
              src="/images/logo-kkt-149.png"
              alt="Logo KKT 149 UNSRAT Kolongan Satu - Klik untuk melihat filosofi"
              className="w-16 h-16 sm:w-20 sm:h-20 2xl:w-24 2xl:h-24 object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all"
            />
          </button>
        </div>

        {/* ============================================================ */}
        {/* 2. STATISTIK POSKO KKT 149                                   */}
        {/* ============================================================ */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Stat 1: Total Orang */}
            <div className="bg-[#faf8ff] border border-[#eaedff] rounded-2xl p-5 2xl:p-6 flex items-start gap-4 shadow-2xs hover:shadow-sm transition-all">
              <div className="p-3 bg-[#cce5ff]/70 text-[#006194] rounded-2xl shrink-0">
                <Users className="w-6 h-6 2xl:w-7 2xl:h-7" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs 2xl:text-sm font-semibold text-[#535f70] uppercase tracking-wider block">
                  Total Anggota Posko
                </span>
                <div className="text-2xl sm:text-3xl 2xl:text-4xl font-extrabold text-[#131b2e] tracking-tight">
                  {stats.totalAnggota}
                </div>
                <p className="text-xs 2xl:text-sm text-[#535f70] pt-1">
                  {stats.detailAnggota}
                </p>
              </div>
            </div>

            {/* Stat 2: Bidang Kerja */}
            <div className="bg-[#faf8ff] border border-[#eaedff] rounded-2xl p-5 2xl:p-6 flex items-start gap-4 shadow-2xs hover:shadow-sm transition-all">
              <div className="p-3 bg-[#6cf8bb]/35 text-[#006c49] rounded-2xl shrink-0">
                <Layers className="w-6 h-6 2xl:w-7 2xl:h-7" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs 2xl:text-sm font-semibold text-[#535f70] uppercase tracking-wider block">
                  Bidang Kerja
                </span>
                <div className="text-2xl sm:text-3xl 2xl:text-4xl font-extrabold text-[#131b2e] tracking-tight">
                  {stats.totalBidang}
                </div>
                <p className="text-xs 2xl:text-sm text-[#535f70] pt-1">
                  {stats.daftarBidang}
                </p>
              </div>
            </div>

            {/* Stat 3: Angkatan */}
            <div className="bg-[#faf8ff] border border-[#eaedff] rounded-2xl p-5 2xl:p-6 flex items-start gap-4 shadow-2xs hover:shadow-sm transition-all">
              <div className="p-3 bg-[#d3e4fe]/80 text-[#004b73] rounded-2xl shrink-0">
                <GraduationCap className="w-6 h-6 2xl:w-7 2xl:h-7" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs 2xl:text-sm font-semibold text-[#535f70] uppercase tracking-wider block">
                  Angkatan KKT
                </span>
                <div className="text-2xl sm:text-3xl 2xl:text-4xl font-extrabold text-[#131b2e] tracking-tight">
                  {stats.angkatanNumber}
                </div>
                <p className="text-xs 2xl:text-sm text-[#535f70] pt-1">
                  Universitas Sam Ratulangi (UNSRAT)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. DOSEN PEMBIMBING, PENGAWAS & KOORDINATOR P3KKNT           */}
        {/* ============================================================ */}
        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-3">
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-[#131b2e] tracking-tight">
              Dosen Pembimbing, Pengawas &amp; P3KKNT
            </h3>
            <div className="h-0.5 flex-1 bg-[#eaedff]" />
            <span className="text-xs 2xl:text-sm text-[#535f70] font-medium hidden sm:inline">
              LPPM Universitas Sam Ratulangi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Dosen Pembimbing Lapangan */}
            <div className="bg-[#faf8ff] border border-[#eaedff] hover:border-[#006194]/40 rounded-2xl p-5 2xl:p-6 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] 2xl:text-xs font-bold bg-[#cce5ff]/80 text-[#004b73]">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{supervisors.dosenPembimbing.badge}</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg 2xl:text-xl font-bold text-[#131b2e] leading-snug">
                    {supervisors.dosenPembimbing.name}
                  </h4>
                  <p className="text-xs 2xl:text-sm text-[#006194] font-semibold mt-1">
                    {supervisors.dosenPembimbing.role}
                  </p>
                  <p className="text-xs 2xl:text-sm text-[#535f70] mt-1 leading-relaxed">
                    {supervisors.dosenPembimbing.title}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#eaedff] text-[11px] 2xl:text-xs text-[#707881] font-medium">
                {supervisors.dosenPembimbing.institution}
              </div>
            </div>

            {/* Dosen Pengawas Lapangan */}
            <div className="bg-[#faf8ff] border border-[#eaedff] hover:border-[#006194]/40 rounded-2xl p-5 2xl:p-6 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] 2xl:text-xs font-bold bg-[#6cf8bb]/40 text-[#005236]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{supervisors.dosenPengawas.badge}</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg 2xl:text-xl font-bold text-[#131b2e] leading-snug">
                    {supervisors.dosenPengawas.name}
                  </h4>
                  <p className="text-xs 2xl:text-sm text-[#006c49] font-semibold mt-1">
                    {supervisors.dosenPengawas.role}
                  </p>
                  <p className="text-xs 2xl:text-sm text-[#535f70] mt-1 leading-relaxed">
                    {supervisors.dosenPengawas.title}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#eaedff] text-[11px] 2xl:text-xs text-[#707881] font-medium">
                {supervisors.dosenPengawas.institution}
              </div>
            </div>

            {/* Koordinator P3KKNT */}
            <div className="bg-[#faf8ff] border border-[#eaedff] hover:border-[#006194]/40 rounded-2xl p-5 2xl:p-6 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] 2xl:text-xs font-bold bg-[#d3e4fe]/90 text-[#0b1c30]">
                    <Award className="w-3.5 h-3.5" />
                    <span>{supervisors.koordinatorP3KKNT.badge}</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg 2xl:text-xl font-bold text-[#131b2e] leading-snug">
                    {supervisors.koordinatorP3KKNT.name}
                  </h4>
                  <p className="text-xs 2xl:text-sm text-[#004b73] font-semibold mt-1">
                    {supervisors.koordinatorP3KKNT.role}
                  </p>
                  <p className="text-xs 2xl:text-sm text-[#535f70] mt-1 leading-relaxed">
                    {supervisors.koordinatorP3KKNT.title}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#eaedff] text-[11px] 2xl:text-xs text-[#707881] font-medium">
                {supervisors.koordinatorP3KKNT.institution}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. GROUP 1: PENGURUS POSKO                                   */}
        {/* ============================================================ */}
        <div className="space-y-6 pt-2">
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

      {/* Modal Filosofi & Makna Lambang KKT 149 */}
      <ModalFilosofiLogo
        isOpen={isFilosofiOpen}
        onClose={() => setIsFilosofiOpen(false)}
      />
    </section>
  );
}
