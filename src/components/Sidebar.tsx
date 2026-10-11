'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Official } from '@/data/officialsData';
import {
  MapPin,
  Users,
  Building,
  FileText,
  AlertTriangle,
  Plus,
  LogOut,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  currentOfficial: Official;
  onSelectOfficial?: (official: Official) => void;
  activeNav: string;
  onSelectNav: (nav: string) => void;
  pendingLettersCount: number;
  activeReportsCount: number;
  onOpenInputMonografi: () => void;
  onOpenNewLetter: () => void;
  onOpenNewReport: () => void;
  onLogout?: () => void;
  selectedYear?: number;
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
  onLogout,
  selectedYear = 2025,
}: SidebarProps) {
  // Shortcut Ctrl+N to open new entry
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        onOpenInputMonografi();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenInputMonografi]);

  return (
    <aside
      className="w-72 bg-white border-r border-slate-200/80 flex flex-col shrink-0 h-full select-none z-20"
      data-purpose="app-sidebar"
    >
      {/* Brand & Institution Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3.5">
        <div className="relative w-12 h-12 rounded-xl bg-slate-50 p-1 shadow-xs border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
          <img
            alt="Logo Kelurahan Kolongan Satu"
            className="w-full h-full object-contain"
            src="/images/logo-tomohon.png"
            onError={(e) => {
              // fallback if needed
              (e.target as HTMLImageElement).src =
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAFgSm2KbqeeiG5Ig0Gy-vrz3syWeppE-OfnfqKrBFCq-lyifRke8j1hSeGABKt83sxvHuRJGukfrU5m67owmp2dmkJ-uyfWFaC7z9mENrLJrr4kEfRxWYHAcNKYctSKYEhaep6O8n8P4L8_KjnbpBJfs3TMJM5jRt14rNSdanvLEzzHFwfxH1P39Ny6GRvj6YQXetS63W0LBntoqiRFDaf6xuJ1BJLFttdxlBSRsTbCVPbWkV0av7x1KvbDy1zWNpEACM';
            }}
          />
        </div>
        <div className="overflow-hidden min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs uppercase tracking-wider font-extrabold text-brand-600">
              e-Monografi
            </span>
            <span
              className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
              title="Sistem Aktif Online"
            ></span>
          </div>
          <h1 className="text-sm font-bold text-slate-900 truncate tracking-tight">
            KOLONGAN SATU
          </h1>
          <p className="text-[11px] text-slate-500 truncate">
            Tomohon Tengah, Kota Tomohon
          </p>
        </div>
      </div>

      {/* Quick Action / Primary Add Action */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onOpenInputMonografi}
          className="w-full py-2.5 px-3.5 bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white rounded-xl shadow-xs shadow-brand-500/20 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
          data-purpose="quick-new-entry"
          title="Tambah / Entri Data Monografi Baru (Ctrl+N)"
        >
          <Plus className="w-4 h-4" />
          <span>+ Entri Data Baru</span>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-white/20 rounded font-mono">
            Ctrl+N
          </span>
        </button>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-6" data-purpose="sidebar-nav">
        {/* Section: Master Data Wilayah */}
        <div>
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Monografi Kelurahan (2025)
          </span>
          <ul className="mt-2 space-y-1">
            {/* Rekapitulasi Kependudukan & Teritorial 2025 */}
            <li>
              <button
                type="button"
                onClick={() => onSelectNav('kependudukan')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                  activeNav === 'kependudukan'
                    ? 'bg-brand-50/90 text-brand-700 font-bold border border-brand-200/70 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Users
                    className={`w-4 h-4 ${
                      activeNav === 'kependudukan' ? 'text-brand-600' : 'text-slate-400'
                    }`}
                  />
                  <span>Rekap Kependudukan &amp; Teritorial</span>
                </span>
                <span className="text-[10px] bg-sky-100 text-brand-700 px-1.5 py-0.5 rounded font-medium">
                  1.512
                </span>
              </button>
            </li>
          </ul>
        </div>

        {/* Section: Pelayanan & Administrasi Warga */}
        <div>
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Administrasi Warga
          </span>
          <ul className="mt-2 space-y-1">
            {/* Rekap & Penerbitan Surat */}
            <li>
              <button
                type="button"
                onClick={() => onSelectNav('surat')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                  activeNav === 'surat'
                    ? 'bg-brand-50/90 text-brand-700 font-bold border border-brand-200/70 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FileText
                    className={`w-4 h-4 ${
                      activeNav === 'surat' ? 'text-brand-600' : 'text-slate-400'
                    }`}
                  />
                  <span>Rekap &amp; Penerbitan Surat</span>
                </span>
                {pendingLettersCount > 0 ? (
                  <span className="text-[10px] bg-amber-100 text-amber-700 font-semibold px-1.5 py-0.5 rounded-full">
                    {pendingLettersCount} Baru
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    Tertib
                  </span>
                )}
              </button>
            </li>

            {/* Kotak Aduan Warga */}
            <li>
              <button
                type="button"
                onClick={() => onSelectNav('lapor')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                  activeNav === 'lapor'
                    ? 'bg-brand-50/90 text-brand-700 font-bold border border-brand-200/70 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <AlertTriangle
                    className={`w-4 h-4 ${
                      activeNav === 'lapor' ? 'text-brand-600' : 'text-slate-400'
                    }`}
                  />
                  <span>Kotak Aduan Warga</span>
                </span>
                {activeReportsCount > 0 ? (
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded-full">
                    {activeReportsCount} Aduan
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    0 Baru
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Sidebar Bottom: Operator Profile & Session */}
      <div
        className="p-3 border-t border-slate-200/80 bg-slate-50/50"
        data-purpose="operator-profile"
      >
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-inner">
            {currentOfficial.avatarText || (currentOfficial.roleCode === 'superadmin' ? 'TK' : 'FP')}
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate">
              {currentOfficial.name}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {currentOfficial.roleTitle || (currentOfficial.roleCode === 'superadmin' ? 'Lurah Kolongan Satu' : 'Sekretaris Kelurahan')}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[9px] font-semibold text-emerald-700">
                {currentOfficial.roleCode === 'superadmin' ? 'Sesi Lurah (Superadmin)' : 'Sesi Sekretaris Kelurahan'}
              </span>
            </div>
          </div>
        </div>

        {/* Return / Exit links */}
        <div className="mt-2.5 flex items-center justify-between px-1 text-[11px]">
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="text-slate-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Sesi</span>
            </button>
          ) : (
            <Link
              href="/portal/login"
              className="text-slate-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Sesi</span>
            </Link>
          )}

          <Link
            href="/"
            className="text-brand-600 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Portal Publik</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
