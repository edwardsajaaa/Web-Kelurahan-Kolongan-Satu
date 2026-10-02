'use client';
import React from 'react';
import { Official } from '@/data/officialsData';
import RoleSwitcherDropdown from './RoleSwitcherDropdown';
import {
  Building2,
  Users,
  FileText,
  AlertTriangle,
  Send,
  Database,
  BarChart3,
  Droplets,
  PawPrint,
  GraduationCap,
  Layers,
  Coins,
  CheckCircle2,
  Sparkles,
  MapPin,
  Flame,
  Shield
} from 'lucide-react';

interface SidebarProps {
  currentOfficial: Official;
  onSelectOfficial: (official: Official) => void;
  activeNav: string;
  onSelectNav: (nav: string) => void;
  pendingLettersCount: number;
  activeReportsCount: number;
  onOpenWhatsAppSimulator: () => void;
  onOpenSqlModal: () => void;
}

export default function Sidebar({
  currentOfficial,
  onSelectOfficial,
  activeNav,
  onSelectNav,
  pendingLettersCount,
  activeReportsCount,
  onOpenWhatsAppSimulator,
  onOpenSqlModal,
}: SidebarProps) {
  const navItems = [
    {
      id: 'monografi',
      label: 'Monografi Desa',
      icon: Building2,
      badge: null,
      desc: 'Dasbor Utama Master-Detail'
    },
    {
      id: 'wilayah',
      label: 'Wilayah Jaga I - V',
      icon: MapPin,
      badge: '5 Jaga',
      desc: 'Pemetaan Lingkungan'
    },
    {
      id: 'kependudukan',
      label: 'Kependudukan',
      icon: Users,
      badge: '1.484 Jiwa',
      desc: 'Demografi & Piramida'
    },
    {
      id: 'pendidikan',
      label: 'Pendidikan & Sosial',
      icon: GraduationCap,
      badge: null,
      desc: 'Klasifikasi SDM & Kesra'
    },
    {
      id: 'peternakan',
      label: 'Potensi & Ternak',
      icon: PawPrint,
      badge: 'Babi & Sapi',
      desc: 'Komoditas Unggulan'
    },
    {
      id: 'lingkungan',
      label: 'Air & Sanitasi',
      icon: Droplets,
      badge: '14 Mata Air',
      desc: 'Ekosistem Tounelet'
    },
    {
      id: 'transparansi',
      label: 'Transparansi APB-Kel',
      icon: Coins,
      badge: '92.4%',
      desc: 'Anggaran Dana Kelurahan'
    },
    {
      id: 'surat',
      label: 'Layanan Surat Online',
      icon: FileText,
      badge: pendingLettersCount > 0 ? `${pendingLettersCount} Berkas` : null,
      badgeColor: 'bg-amber-100 text-amber-800',
      desc: 'Permohonan Mandiri Warga'
    },
    {
      id: 'lapor',
      label: 'Lapor Masalah Warga',
      icon: AlertTriangle,
      badge: activeReportsCount > 0 ? `${activeReportsCount} Tiket` : null,
      badgeColor: 'bg-rose-100 text-rose-800',
      desc: 'Pengaduan & Insiden Sarana'
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between h-full select-none shadow-sm z-20">
      {/* Top Branding Section */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="h-11 w-11 bg-gradient-to-br from-sky-700 via-sky-800 to-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md shadow-sky-800/20 border border-sky-600/30">
              K1
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black tracking-wide text-slate-900">KOLONGAN SATU</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Sistem Aktif 24 Jam Nonstop"></span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate">Tomohon Tengah, Kota Tomohon</p>
              <p className="text-[10px] text-sky-700 font-semibold uppercase tracking-wider">Sulawesi Utara</p>
            </div>
          </div>

          <div className="mt-3 py-1 px-2.5 bg-sky-50/70 border border-sky-100 rounded-lg flex items-center justify-between text-[10px] text-sky-800 font-medium">
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              <span>Edge Cloud Serverless</span>
            </div>
            <span className="font-bold text-sky-900">Uptime 99.99%</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </p>
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition group ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 transition ${
                    isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 ml-1.5 ${
                    isActive ? 'bg-sky-500/20 text-sky-300' : item.badgeColor || 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 pb-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Integrasi & Otomasi
            </p>
          </div>

          {/* Quick Action Button: WhatsApp Gateway */}
          <button
            onClick={onOpenWhatsAppSimulator}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 transition group"
            title="Buka simulasi pesan notifikasi WhatsApp dengan magic link persetujuan pejabat"
          >
            <div className="flex items-center space-x-2.5">
              <Send className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition" />
              <span className="font-semibold text-left">WhatsApp Gateway</span>
            </div>
            <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
              Jemput Bola
            </span>
          </button>

          {/* Quick Action Button: SQL Schema */}
          <button
            onClick={onOpenSqlModal}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition group"
            title="Lihat DDL PostgreSQL & Aturan Keamanan RLS Supabase"
          >
            <div className="flex items-center space-x-2.5">
              <Database className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-left">Skema Database & DDL</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">SQL</span>
          </button>
        </div>
      </div>

      {/* Bottom Profile Section with Role Switcher */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/50">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Aparatur Masuk
          </span>
          <span className="text-[10px] text-sky-700 font-semibold">SK 2024</span>
        </div>
        <RoleSwitcherDropdown
          currentOfficial={currentOfficial}
          onSelectOfficial={onSelectOfficial}
        />
      </div>
    </aside>
  );
}
