'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Award,
  Laptop,
  MapPin,
  HeartHandshake,
  Camera,
  ChevronRight,
  Mail,
  BookOpen,
  Building2,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import { KKT_TEAM_DATA, KktMember, KktDivision } from '@/data/kktTeamData';

export default function KktTeamSection() {
  const [selectedMember, setSelectedMember] = useState<KktMember | null>(null);
  const [activeDivisionTab, setActiveDivisionTab] = useState<string>('all');

  const { leader, coreExecutive, divisions, university, angkatan, poskoLocation, dpl, periode } =
    KKT_TEAM_DATA;

  const getDivisionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-[#006194]" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-[#006c49]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-[#b84e00]" />;
      case 'Camera':
        return <Camera className="w-5 h-5 text-[#673ab7]" />;
      default:
        return <Users className="w-5 h-5 text-[#006194]" />;
    }
  };

  const filteredDivisions =
    activeDivisionTab === 'all'
      ? divisions
      : divisions.filter((d) => d.id === activeDivisionTab);

  return (
    <section
      id="tim-kkt"
      className="w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 mb-16 2xl:mb-20 scroll-mt-24 no-print"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-10 2xl:p-14 shadow-sm border border-[#e2e7ff] space-y-10">
        {/* ============================================================ */}
        {/* 1. SECTION HEADER & INSTITUTION BANNER                       */}
        {/* ============================================================ */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 border-b border-[#eaedff] gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#e2e7ff]/80 text-[#006194] px-4 py-1.5 rounded-full text-xs 2xl:text-sm font-bold shadow-2xs">
              <GraduationCap className="w-4 h-4" />
              <span>{angkatan} • {university}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl 2xl:text-4xl 3xl:text-5xl text-[#131b2e] font-bold tracking-tight">
              Struktur Organisasi Tim KKT
            </h2>
            <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] max-w-2xl leading-relaxed">
              Susunan fungsional mahasiswa pengabdian masyarakat {poskoLocation}, Kecamatan Tomohon Tengah. Bersinergi bersama Pemerintah Kelurahan dan warga dalam mewujudkan transparansi data monografi dan inovasi pelayanan digital.
            </p>
          </div>

          {/* Quick Info Badge */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 bg-[#f2f3ff] p-4 rounded-2xl border border-[#dae2fd]">
            <div className="flex items-center gap-2 text-xs 2xl:text-sm text-[#131b2e]">
              <Building2 className="w-4 h-4 text-[#006194]" />
              <span className="font-semibold">{university}</span>
            </div>
            <div className="flex items-center gap-2 text-xs 2xl:text-sm text-[#535f70]">
              <Award className="w-4 h-4 text-[#006c49]" />
              <span>{dpl.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs 2xl:text-sm text-[#535f70]">
              <Sparkles className="w-4 h-4 text-[#b84e00]" />
              <span>Periode Pengabdian {periode}</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. LEVEL 1: KOORDINATOR POSKO (KETUA TIM)                     */}
        {/* ============================================================ */}
        <div className="flex flex-col items-center">
          <div className="text-center mb-4">
            <span className="text-[11px] 2xl:text-xs font-bold uppercase tracking-wider text-[#006194] bg-[#f2f3ff] px-3 py-1 rounded-full border border-[#dae2fd]">
              Pimpinan Posko
            </span>
          </div>

          <div
            onClick={() => setSelectedMember(leader)}
            className="w-full max-w-xl bg-gradient-to-br from-white via-[#f8faff] to-[#eef4ff] rounded-2xl 2xl:rounded-3xl p-6 sm:p-7 border-2 border-[#006194]/30 shadow-md hover:shadow-xl hover:border-[#006194] transition-all duration-300 cursor-pointer group relative overflow-hidden"
          >
            {/* Ambient Corner Accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#006194]/10 rounded-full blur-2xl group-hover:bg-[#006194]/20 transition-all" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
              {/* Avatar Bubble */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#006194] to-[#0091df] text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md border-2 border-white">
                  KP
                </div>
                <div className="absolute -bottom-2 -right-2 p-1.5 bg-[#006c49] text-white rounded-lg shadow-xs">
                  <Award className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Leader Info */}
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#006194] text-white text-[11px] font-bold">
                  <span>{leader.role}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-bold text-[#131b2e] group-hover:text-[#006194] transition-colors">
                  {leader.name}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#006194]">
                  {leader.major} &bull; {leader.faculty}
                </p>
                {leader.nim && (
                  <p className="text-xs text-[#535f70] font-mono">{leader.nim}</p>
                )}
                <p className="text-xs sm:text-sm text-[#3f4850] pt-2 line-clamp-2 leading-relaxed">
                  {leader.responsibilities[0]}
                </p>
              </div>

              <ChevronRight className="hidden sm:block w-5 h-5 text-[#bfc7d2] group-hover:text-[#006194] group-hover:translate-x-1 transition-all self-center" />
            </div>
          </div>

          {/* Hierarchy Connector Line */}
          <div className="w-0.5 h-8 bg-[#dae2fd] my-1" />
        </div>

        {/* ============================================================ */}
        {/* 3. LEVEL 2: PENGURUS INTI (SEKRETARIS & BENDAHARA)            */}
        {/* ============================================================ */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-[11px] 2xl:text-xs font-bold uppercase tracking-wider text-[#3f4850] bg-[#f2f3ff] px-3 py-1 rounded-full border border-[#dae2fd]">
              Badan Pengurus Inti Posko
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 2xl:gap-6 max-w-4xl mx-auto">
            {/* Sekretaris */}
            <div
              onClick={() => setSelectedMember(coreExecutive.secretary)}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e2e7ff] hover:border-[#006194] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group flex items-start gap-4"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#006c49] to-[#10b981] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                SEK
              </div>
              <div className="flex-1 space-y-1">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#006c49] text-[10px] font-bold border border-emerald-200">
                  <BookOpen className="w-3 h-3" />
                  <span>{coreExecutive.secretary.role}</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#131b2e] group-hover:text-[#006194] transition-colors">
                  {coreExecutive.secretary.name}
                </h4>
                <p className="text-xs font-medium text-[#535f70]">
                  {coreExecutive.secretary.major} &bull; {coreExecutive.secretary.faculty}
                </p>
                {coreExecutive.secretary.nim && (
                  <p className="text-[11px] text-[#535f70] font-mono">{coreExecutive.secretary.nim}</p>
                )}
                <p className="text-xs text-[#3f4850] pt-1.5 line-clamp-2 leading-relaxed">
                  {coreExecutive.secretary.responsibilities[0]}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#bfc7d2] group-hover:text-[#006194] group-hover:translate-x-1 transition-all shrink-0 self-center" />
            </div>

            {/* Bendahara */}
            <div
              onClick={() => setSelectedMember(coreExecutive.treasurer)}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e2e7ff] hover:border-[#006194] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group flex items-start gap-4"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#b84e00] to-[#f59e0b] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                BEN
              </div>
              <div className="flex-1 space-y-1">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-[#b84e00] text-[10px] font-bold border border-amber-200">
                  <Award className="w-3 h-3" />
                  <span>{coreExecutive.treasurer.role}</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#131b2e] group-hover:text-[#006194] transition-colors">
                  {coreExecutive.treasurer.name}
                </h4>
                <p className="text-xs font-medium text-[#535f70]">
                  {coreExecutive.treasurer.major} &bull; {coreExecutive.treasurer.faculty}
                </p>
                {coreExecutive.treasurer.nim && (
                  <p className="text-[11px] text-[#535f70] font-mono">{coreExecutive.treasurer.nim}</p>
                )}
                <p className="text-xs text-[#3f4850] pt-1.5 line-clamp-2 leading-relaxed">
                  {coreExecutive.treasurer.responsibilities[0]}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#bfc7d2] group-hover:text-[#006194] group-hover:translate-x-1 transition-all shrink-0 self-center" />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. LEVEL 3: BIDANG & DIVISI PROGRAM KERJA                    */}
        {/* ============================================================ */}
        <div className="space-y-6 pt-4 border-t border-[#eaedff]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] 2xl:text-xs font-bold uppercase tracking-wider text-[#006194] bg-[#f2f3ff] px-3 py-1 rounded-full border border-[#dae2fd]">
                Bidang &amp; Divisi Program Kerja
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#131b2e] mt-1.5">
                Koordinasi Teknis &amp; Pelaksana Lapangan
              </h3>
            </div>

            {/* Division Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              <button
                type="button"
                onClick={() => setActiveDivisionTab('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeDivisionTab === 'all'
                    ? 'bg-[#006194] text-white shadow-xs'
                    : 'bg-[#f2f3ff] text-[#535f70] hover:text-[#131b2e]'
                }`}
              >
                Semua Bidang ({divisions.length})
              </button>
              {divisions.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActiveDivisionTab(d.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeDivisionTab === d.id
                      ? 'bg-[#006194] text-white shadow-xs'
                      : 'bg-[#f2f3ff] text-[#535f70] hover:text-[#131b2e]'
                  }`}
                >
                  {d.badge}
                </button>
              ))}
            </div>
          </div>

          {/* Divisions Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDivisions.map((div) => (
              <div
                key={div.id}
                className="bg-[#faf8ff] rounded-2xl p-6 border border-[#dae2fd] hover:border-[#006194] shadow-xs hover:shadow-md transition-all duration-300 space-y-5 flex flex-col justify-between"
              >
                {/* Division Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-white rounded-xl shadow-2xs border border-[#e2e7ff]">
                        {getDivisionIcon(div.iconName)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#535f70]">
                          {div.badge}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-[#131b2e]">
                          {div.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#3f4850] leading-relaxed bg-white/70 p-3 rounded-xl border border-[#e2e7ff]/60">
                    {div.focus}
                  </p>
                </div>

                {/* Coordinator Card */}
                <div className="space-y-3 pt-2 border-t border-[#dae2fd]/70">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#006194]">
                    Koordinator Bidang:
                  </div>
                  <div
                    onClick={() => setSelectedMember(div.coordinator)}
                    className="bg-white rounded-xl p-3.5 border border-[#e2e7ff] hover:border-[#006194] transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#006194] text-white flex items-center justify-center font-bold text-sm">
                        {div.coordinator.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#131b2e] group-hover:text-[#006194] transition-colors">
                          {div.coordinator.name}
                        </div>
                        <div className="text-xs text-[#535f70]">
                          {div.coordinator.major} &bull; {div.coordinator.faculty}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#bfc7d2] group-hover:text-[#006194] group-hover:translate-x-0.5 transition-all" />
                  </div>

                  {/* Members Pill List */}
                  {div.members.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#535f70]">
                        Anggota Bidang:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {div.members.map((mem) => (
                          <div
                            key={mem.id}
                            onClick={() => setSelectedMember(mem)}
                            className="bg-white/90 hover:bg-white rounded-lg p-2.5 border border-[#e2e7ff] hover:border-[#006194] transition-all cursor-pointer group flex items-center justify-between"
                          >
                            <div className="truncate pr-1">
                              <div className="text-xs font-bold text-[#131b2e] group-hover:text-[#006194] transition-colors truncate">
                                {mem.name}
                              </div>
                              <div className="text-[11px] text-[#535f70] truncate">
                                {mem.role}
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-[#bfc7d2] group-hover:text-[#006194] shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. FOOTER NOTICE / EDIT INFORMATION                          */}
        {/* ============================================================ */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#eaedff] border border-[#dae2fd] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#3f4850]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#006194] shrink-0" />
            <span>
              <strong>Informasi Posko KKT:</strong> Susunan nama, NIM, jurusan, dan foto anggota dapat disesuaikan langsung pada file data <code className="bg-white px-2 py-0.5 rounded text-[#006194] font-mono">src/data/kktTeamData.ts</code>.
            </span>
          </div>
          <span className="shrink-0 text-[11px] font-semibold text-[#006194] bg-white px-3 py-1 rounded-full border border-[#dae2fd]">
            KKT Unsrat 149 &bull; Kolongan Satu
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. MODAL DETAIL ANGGOTA TIM KKT                              */}
      {/* ============================================================ */}
      {selectedMember && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#dae2fd] space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#eaedff] pb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#006194] to-[#0091df] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                  {selectedMember.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#006194] bg-[#f2f3ff] px-2.5 py-0.5 rounded-full border border-[#dae2fd]">
                    {selectedMember.role}
                  </span>
                  <h3 className="text-xl font-bold text-[#131b2e] mt-1">
                    {selectedMember.name}
                  </h3>
                  <p className="text-xs text-[#535f70] font-medium">
                    {selectedMember.major} &bull; {selectedMember.faculty}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="p-1.5 rounded-full text-[#535f70] hover:text-[#131b2e] hover:bg-[#f2f3ff] transition-colors"
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            {/* Member Details */}
            <div className="space-y-4">
              {selectedMember.nim && (
                <div className="bg-[#faf8ff] p-3 rounded-xl border border-[#dae2fd] text-xs">
                  <span className="text-[#535f70] font-semibold">Nomor Induk Mahasiswa (NIM): </span>
                  <span className="font-mono text-[#131b2e] font-bold">{selectedMember.nim}</span>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3f4850]">
                  Tanggung Jawab &amp; Program Kerja:
                </h4>
                <ul className="space-y-2">
                  {selectedMember.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#3f4850] leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#006c49] shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedMember.contact?.email && (
                <div className="pt-2 flex items-center gap-2 text-xs text-[#535f70]">
                  <Mail className="w-4 h-4 text-[#006194]" />
                  <span>Email: {selectedMember.contact.email}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="px-6 py-2.5 rounded-full bg-[#006194] text-white text-xs sm:text-sm font-semibold hover:bg-[#007bb9] transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
