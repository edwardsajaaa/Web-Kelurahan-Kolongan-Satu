'use client';
import React from 'react';
import { Official } from '@/data/officialsData';
import RoleSwitcherDropdown from './RoleSwitcherDropdown';
import {
  Building2,
  Users,
  FileText,
  AlertTriangle,
  Droplets,
  PawPrint,
  MapPin,
  PlusCircle,
  FilePlus,
  AlertCircle,
} from 'lucide-react';

interface SidebarProps {
  currentOfficial: Official;
  onSelectOfficial: (official: Official) => void;
  activeNav: string;
  onSelectNav: (nav: string) => void;
  pendingLettersCount: number;
  activeReportsCount: number;
  onOpenInputMonografi: () => void;
  onOpenNewLetter: () => void;
  onOpenNewReport: () => void;
}

export default function Sidebar({
  currentOfficial,
  onSelectOfficial,
  activeNav,
  onSelectNav,
  pendingLettersCount,
  activeReportsCount,
  onOpenInputMonografi,
  onOpenNewLetter,
  onOpenNewReport,
}: SidebarProps) {
  const navItems = [
    {
      id: 'monografi',
      label: 'Semua Monografi',
      icon: Building2,
      badge: null,
    },
    {
      id: 'wilayah',
      label: 'Wilayah Jaga I - V',
      icon: MapPin,
      badge: '5 Jaga',
    },
    {
      id: 'kependudukan',
      label: 'Kependudukan & KK',
      icon: Users,
      badge: '1.484 Jiwa',
    },
    {
      id: 'peternakan',
      label: 'Potensi & Ternak',
      icon: PawPrint,
      badge: null,
    },
    {
      id: 'lingkungan',
      label: 'Sarana & Sanitasi',
      icon: Droplets,
      badge: null,
    },
    {
      id: 'surat',
      label: 'Layanan Surat Online',
      icon: FileText,
      badge: pendingLettersCount > 0 ? `${pendingLettersCount}` : null,
      badgeColor: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'lapor',
      label: 'Kotak Aduan Warga',
      icon: AlertTriangle,
      badge: activeReportsCount > 0 ? `${activeReportsCount} Baru` : null,
      badgeColor: 'bg-rose-100 text-rose-900',
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#dae2fd] flex flex-col justify-between h-full select-none shadow-xs z-20">
      {/* Top Branding Section */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="p-4 border-b border-[#e2e7ff]">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center font-black text-base shadow-sm">
              K1
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black tracking-wide text-[#131b2e]">KOLONGAN SATU</span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#006c49]" title="Sistem Aktif"></span>
              </div>
              <p className="text-[11px] text-[#535f70] font-medium truncate">Tomohon Tengah, Tomohon</p>
            </div>
          </div>
        </div>

        {/* Form Input Data - Quick Action Buttons */}
        <div className="p-3 border-b border-[#e2e7ff] bg-[#faf8ff] space-y-2">
          <p className="px-1 text-[10px] font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5 text-primary" />
            <span>Form Input Data</span>
          </p>

          {/* 1. Main Action: Input / Edit Monografi */}
          <button
            onClick={onOpenInputMonografi}
            className="w-full flex items-center justify-between px-3 py-2 bg-primary hover:bg-[#004d77] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            title="Buka form isian data monografi"
          >
            <div className="flex items-center space-x-2">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Input Data Monografi</span>
            </div>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">Form</span>
          </button>

          {/* 2 & 3. Secondary Actions: Buat Surat & Catat Laporan */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onOpenNewLetter}
              className="flex items-center justify-center space-x-1 px-2 py-1.5 bg-white hover:bg-[#f2f3ff] text-[#131b2e] hover:text-primary border border-[#dae2fd] rounded-xl text-[11px] font-bold transition shadow-2xs cursor-pointer"
              title="Formulir buat permohonan surat warga baru"
            >
              <FilePlus className="w-3.5 h-3.5 text-primary" />
              <span className="truncate">+ Buat Surat</span>
            </button>
            <button
              onClick={onOpenNewReport}
              className="flex items-center justify-center space-x-1 px-2 py-1.5 bg-white hover:bg-rose-50 text-[#131b2e] hover:text-rose-700 border border-[#dae2fd] rounded-xl text-[11px] font-bold transition shadow-2xs cursor-pointer"
              title="Formulir catat aduan/masalah warga baru"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span className="truncate">+ Catat Lapor</span>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          <p className="px-3 pt-1 pb-1 text-[10px] font-bold text-[#707881] uppercase tracking-wider">
            Menu Modul
          </p>
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition group cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-[#3f4850] hover:bg-[#f2f3ff] hover:text-primary'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 transition ${
                    isActive ? 'text-white' : 'text-[#707881] group-hover:text-primary'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ml-1.5 ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-[#e2e7ff] text-primary'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile Section with Role Switcher */}
      <div className="p-3 border-t border-[#dae2fd] bg-[#faf8ff]">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-[#707881] uppercase tracking-wider">
            Pengguna Aktif
          </span>
          <span className="text-[10px] text-primary font-bold">SK 2024</span>
        </div>
        <RoleSwitcherDropdown
          currentOfficial={currentOfficial}
          onSelectOfficial={onSelectOfficial}
        />
      </div>
    </aside>
  );
}
