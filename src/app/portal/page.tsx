'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { MONOGRAFI_ITEMS, MonografiItem } from '@/data/monografiData';
import { OFFICIALS, Official } from '@/data/officialsData';
import { INITIAL_LETTERS, LetterRequest } from '@/data/lettersData';
import { INITIAL_REPORTS, CitizenReport } from '@/data/reportsData';

import Sidebar from '@/components/Sidebar';
import DetailView from '@/components/DetailView';
import ModalLetterRequest from '@/components/ModalLetterRequest';
import ModalCitizenReport from '@/components/ModalCitizenReport';
import ModalWhatsAppSimulator from '@/components/ModalWhatsAppSimulator';
import ModalOfficialLetterPreview from '@/components/ModalOfficialLetterPreview';
import ModalMonografiPrint from '@/components/ModalMonografiPrint';
import ModalEditMonografi from '@/components/ModalEditMonografi';

import {
  Menu,
  X,
  CheckCircle2,
  Building,
  Plus,
  Search,
  AlertCircle,
  CalendarPlus,
  Trash2,
} from 'lucide-react';

export default function PortalPage() {
  // Master data states
  const [monografiList, setMonografiList] = useState<MonografiItem[]>(MONOGRAFI_ITEMS);
  const [availableYears, setAvailableYears] = useState<number[]>([2024, 2025]);
  const [selectedId, setSelectedId] = useState<string>('kependudukan-2025');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // User Authentication & Role: Dedicated Sekretaris Kelurahan (Febronia L. Pijoh, S.Kom)
  const seklurOfficial = OFFICIALS.find((o) => o.roleCode === 'admin_seklur') || OFFICIALS[1];
  const [currentOfficial, setCurrentOfficial] = useState<Official>(seklurOfficial);

  // Citizen letters and incident reports states
  const [letters, setLetters] = useState<LetterRequest[]>(INITIAL_LETTERS);
  const [reports, setReports] = useState<CitizenReport[]>(INITIAL_REPORTS);

  // Active navigation tab
  const [activeNav, setActiveNav] = useState<string>('monografi');

  // Modals state
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isPrintLetterOpen, setIsPrintLetterOpen] = useState(false);
  const [isPrintMonografiOpen, setIsPrintMonografiOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTargetItem, setEditTargetItem] = useState<MonografiItem | null>(null);

  // Modal Buka Tahun Baru
  const [isNewYearModalOpen, setIsNewYearModalOpen] = useState(false);
  const [newYearInput, setNewYearInput] = useState<number>(2026);
  const [newYearError, setNewYearError] = useState<string | null>(null);

  // Selected item for print preview
  const [printLetterTarget, setPrintLetterTarget] = useState<LetterRequest | null>(null);

  // Mobile sidebar toggle
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Find currently active monografi item
  const activeDetail = useMemo(() => {
    const found = monografiList.find((c) => c.id === selectedId);
    if (found) return found;
    const firstInYear = monografiList.find((c) => c.year === selectedYear);
    return firstInYear || monografiList[0];
  }, [monografiList, selectedId, selectedYear]);

  // Auth Guard & Initial fetch from backend APIs
  useEffect(() => {
    async function loadBackendData() {
      // 1. Double check authentication status
      try {
        const resSession = await fetch('/api/auth/session');
        if (resSession.ok) {
          const sessionData = await resSession.json();
          if (!sessionData.authenticated) {
            window.location.href = '/portal/login';
            return;
          }
        }
      } catch (err) {
        console.warn('Gagal memverifikasi sesi login:', err);
      }

      // 2. Fetch data
      try {
        const [resLetters, resReports, resMonografi] = await Promise.all([
          fetch('/api/surat'),
          fetch('/api/lapor'),
          fetch('/api/monografi'),
        ]);

        if (resLetters.ok) {
          const dataLetters = await resLetters.json();
          if (dataLetters.success && dataLetters.data) {
            setLetters(dataLetters.data);
          }
        }

        if (resReports.ok) {
          const dataReports = await resReports.json();
          if (dataReports.success && dataReports.data) {
            setReports(dataReports.data);
          }
        }

        if (resMonografi.ok) {
          const dataMonografi = await resMonografi.json();
          if (dataMonografi.success && dataMonografi.data) {
            setMonografiList(dataMonografi.data);
          }
          if (dataMonografi.availableYears && Array.isArray(dataMonografi.availableYears)) {
            setAvailableYears(dataMonografi.availableYears);
          }
        }
      } catch (err) {
        console.warn('Menggunakan data awal lokal:', err);
      }
    }

    loadBackendData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout error:', e);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kkt_portal_auth');
      localStorage.removeItem('kkt_user_name');
      localStorage.removeItem('kkt_user_nip');
      window.location.href = '/portal/login';
    }
  };

  // Actions
  const handleApproveByLurah = async (itemId: string) => {
    const previousList = [...monografiList];
    const targetItem = monografiList.find((i) => i.id === itemId);
    const itemTitle = targetItem ? targetItem.title : 'Data Monografi';

    // Optimistic UI Update
    setMonografiList((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              statusTahapan: 'disahkan_lurah',
              badgeLabel: 'Disahkan Lurah (Publikasi Sah)',
              lastUpdated: `${new Date().toLocaleDateString('id-ID')} - Disahkan Lurah Theresia J. Kaunang`,
            }
          : item
      )
    );

    showToast(
      `Data "${itemTitle}" berhasil disahkan secara digital oleh Lurah Theresia J. Kaunang, SE dan resmi diterbitkan ke publik!`
    );

    try {
      const res = await fetch('/api/monografi', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: itemId,
          statusTahapan: 'disahkan_lurah',
          officialName: 'Lurah Theresia J. Kaunang, SE',
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menyimpan pengesahan ke server.');
      }
    } catch (e: any) {
      console.warn('Gagal sinkronisasi pengesahan monografi ke API:', e);
      setMonografiList(previousList);
      showToast(
        `Peringatan: Gagal sinkronisasi pengesahan ke server (${e.message || 'Koneksi error'}). Status dikembalikan.`
      );
    }
  };

  const handleVerifyBySeklur = async (itemId: string) => {
    const previousList = [...monografiList];
    const targetItem = monografiList.find((i) => i.id === itemId);
    const itemTitle = targetItem ? targetItem.title : 'Data Monografi';

    // Optimistic UI Update
    setMonografiList((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              statusTahapan: 'diverifikasi_seklur',
              badgeLabel: 'Diverifikasi Seklur',
              lastUpdated: `${new Date().toLocaleDateString('id-ID')} - Paraf Seklur Febronia L. Pijoh`,
            }
          : item
      )
    );

    showToast(
      `Data "${itemTitle}" telah diverifikasi administratif oleh Seklur Febronia L. Pijoh, S.Kom!`
    );

    try {
      const res = await fetch('/api/monografi', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: itemId,
          statusTahapan: 'diverifikasi_seklur',
          officialName: 'Seklur Febronia L. Pijoh, S.Kom',
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menyimpan paraf verifikasi ke server.');
      }
    } catch (e: any) {
      console.warn('Gagal verifikasi monografi ke API:', e);
      setMonografiList(previousList);
      showToast(
        `Peringatan: Gagal sinkronisasi verifikasi ke server (${e.message || 'Koneksi error'}). Status dikembalikan.`
      );
    }
  };

  const handleOpenEditModal = (item: MonografiItem) => {
    setEditTargetItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveMonografiEdit = async (updatedItem: MonografiItem) => {
    const prevList = [...monografiList];

    // Optimistic UI update
    setMonografiList((prev) =>
      prev.map((m) => (m.id === updatedItem.id ? updatedItem : m))
    );

    showToast(`Perubahan data "${updatedItem.title}" berhasil disimpan!`);

    try {
      const res = await fetch('/api/monografi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });

      if (!res.ok) {
        throw new Error('Gagal menyimpan pembaruan ke server');
      }
    } catch (err: any) {
      console.warn('Gagal simpan edit monografi ke API:', err);
      setMonografiList(prevList);
      showToast(`Peringatan: Gagal sinkronisasi ke server (${err.message}). Status dikembalikan.`);
    }
  };

  const handleCreateNewYear = async (newYear: number) => {
    try {
      showToast(`Membuka periode draf monografi tahun ${newYear}...`);
      const res = await fetch('/api/monografi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_year', newYear }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.availableYears) {
          setAvailableYears(data.availableYears);
        } else {
          setAvailableYears((prev) =>
            prev.includes(newYear) ? prev : [...prev, newYear].sort()
          );
        }
        if (data.items) {
          setMonografiList(data.items);
        }
        setSelectedYear(newYear);
        const firstInNewYear = data.items?.find((m: MonografiItem) => m.year === newYear);
        if (firstInNewYear) {
          setSelectedId(firstInNewYear.id);
        }
        showToast(`Periode draf monografi ${newYear} berhasil disiapkan! Silakan input data.`);
        setIsNewYearModalOpen(false);
      } else {
        throw new Error(data.error || 'Gagal membuat tahun baru');
      }
    } catch (err: any) {
      console.warn('Gagal membuat tahun baru:', err);
      showToast(`Gagal membuat tahun baru: ${err.message || 'Koneksi bermasalah'}`);
    }
  };

  const handleUpdateLetterStatus = async (
    id: string,
    newStatus: LetterRequest['statusSurat'],
    note?: string
  ) => {
    setLetters((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              statusSurat: newStatus,
              statusLabel:
                newStatus === 'diverifikasi_staf'
                  ? 'Diverifikasi Staf Karlin'
                  : newStatus === 'diparaf_seklur'
                  ? 'Diparaf Seklur Febronia'
                  : newStatus === 'selesai_disahkan'
                  ? 'Selesai & Disahkan Lurah'
                  : 'Ditolak',
              catatanPetugas: note || l.catatanPetugas,
              diparafOleh:
                newStatus === 'diparaf_seklur'
                  ? 'Febronia L. Pijoh, S.Kom (Seklur)'
                  : l.diparafOleh,
              disahkanOleh:
                newStatus === 'selesai_disahkan'
                  ? 'Theresia J. Kaunang, SE (Lurah)'
                  : l.disahkanOleh,
              tanggalSelesai:
                newStatus === 'selesai_disahkan'
                  ? new Date().toLocaleString('id-ID')
                  : l.tanggalSelesai,
            }
          : l
      )
    );

    try {
      await fetch('/api/surat', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          statusSurat: newStatus,
          catatanPetugas: note,
          officialName: currentOfficial.name,
        }),
      });
    } catch (e) {
      console.warn('Gagal memperbarui status surat ke API:', e);
    }

    showToast(
      `Status permohonan surat berhasil diperbarui ke: ${newStatus
        .replace('_', ' ')
        .toUpperCase()}`
    );
  };

  const handleAddLetter = (newLetter: LetterRequest) => {
    setLetters((prev) => {
      const exists = prev.some(
        (l) => l.noRegistrasi === newLetter.noRegistrasi || l.id === newLetter.id
      );
      if (exists) return prev.map((l) => (l.noRegistrasi === newLetter.noRegistrasi ? newLetter : l));
      return [newLetter, ...prev];
    });
    showToast(`Permohonan surat berhasil diajukan dengan nomor ${newLetter.noRegistrasi}`);
  };

  const handleAddReport = (newReport: CitizenReport) => {
    setReports((prev) => {
      const exists = prev.some(
        (r) => r.ticketNo === newReport.ticketNo || r.id === newReport.id
      );
      if (exists) return prev.map((r) => (r.ticketNo === newReport.ticketNo ? newReport : r));
      return [newReport, ...prev];
    });
    showToast(`Laporan aduan #${newReport.ticketNo} berhasil dicatat.`);
  };

  const handleUpdateReportStatus = async (
    id: string,
    newStatus: CitizenReport['status'],
    tanggapan?: string
  ) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: newStatus,
              statusLabel:
                newStatus === 'dalam_tindakan' ? 'Sedang Dalam Tindakan' : 'Selesai',
              tanggapanPetugas: tanggapan || r.tanggapanPetugas,
              diselesaikanPada:
                newStatus === 'selesai'
                  ? new Date().toLocaleString('id-ID')
                  : r.diselesaikanPada,
            }
          : r
      )
    );

    try {
      await fetch('/api/lapor', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: newStatus,
          tanggapanPetugas: tanggapan,
        }),
      });
    } catch (e) {
      console.warn('Gagal memperbarui laporan ke API:', e);
    }

    showToast(`Status laporan pengaduan berhasil diperbarui ke: ${newStatus.toUpperCase()}`);
  };

  const handlePrintLetter = (letter: LetterRequest) => {
    setPrintLetterTarget(letter);
    setIsPrintLetterOpen(true);
  };

  const handleNavSelect = (navId: string) => {
    setActiveNav(navId);
    setIsMobileSidebarOpen(false);

    if (navId === 'surat') {
      setIsLetterModalOpen(true);
      return;
    }
    if (navId === 'lapor') {
      setIsReportModalOpen(true);
      return;
    }

    if (navId === 'monografi') {
      setSelectedCategory('all');
    } else if (navId === 'wilayah') {
      setSelectedCategory('wilayah');
      const found = monografiList.find((m) => m.year === selectedYear && m.categoryKey === 'wilayah');
      if (found) setSelectedId(found.id);
    } else if (navId === 'kependudukan') {
      setSelectedCategory('kependudukan');
      const found = monografiList.find((m) => m.year === selectedYear && m.categoryKey === 'kependudukan');
      if (found) setSelectedId(found.id);
    } else if (navId === 'lingkungan') {
      setSelectedCategory('lingkungan');
      const found = monografiList.find((m) => m.year === selectedYear && m.categoryKey === 'lingkungan');
      if (found) setSelectedId(found.id);
    }
  };

  // Filter modules for horizontal selector strip
  const visibleModules = useMemo(() => {
    return monografiList.filter((item) => {
      const matchYear = item.year === selectedYear;
      const matchCategory =
        selectedCategory === 'all' || item.categoryKey === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.statsValue.toLowerCase().includes(searchQuery.toLowerCase());

      return matchYear && (matchCategory || searchQuery.trim() !== '') && matchSearch;
    });
  }, [monografiList, selectedYear, selectedCategory, searchQuery]);

  return (
    <div className="h-screen w-full font-sans text-slate-800 antialiased flex flex-col md:flex-row overflow-hidden bg-slate-50">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[9999] bg-white text-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-200 flex items-center space-x-3 animate-in slide-in-from-top-4 duration-300 max-w-md">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs leading-relaxed">
            <p className="font-bold text-slate-900">Pemberitahuan Sistem</p>
            <p className="text-slate-600 mt-0.5">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700 text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Mobile Bar */}
      <div className="md:hidden flex items-center justify-between p-3.5 bg-white border-b border-slate-200 z-30">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 bg-brand-600 text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-xs">
            K1
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-900 leading-tight">
              PORTAL KOLONGAN SATU
            </h1>
            <p className="text-[10px] text-slate-500">Tomohon Tengah, Kota Tomohon</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleOpenEditModal(activeDetail)}
            className="px-2.5 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
            title="Input / Edit Data Monografi"
          >
            <span>+ Entri</span>
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 bg-slate-100 text-slate-800 rounded-xl cursor-pointer"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 1. KOLOM KIRI: SIDEBAR NAVIGASI (STITCH DESIGN) */}
      <div
        className={`${
          isMobileSidebarOpen ? 'block fixed inset-0 z-40 md:relative' : 'hidden md:flex'
        } h-full shrink-0`}
      >
        <Sidebar
          currentOfficial={currentOfficial}
          onSelectOfficial={(off) => {
            setCurrentOfficial(off);
            showToast(`Peran pengguna aktif: ${off.name} (${off.roleTitle})`);
          }}
          activeNav={activeNav}
          onSelectNav={handleNavSelect}
          pendingLettersCount={
            letters.filter((l) => l.statusSurat !== 'selesai_disahkan').length
          }
          activeReportsCount={reports.filter((r) => r.status !== 'selesai').length}
          onOpenInputMonografi={() => handleOpenEditModal(activeDetail)}
          onOpenNewLetter={() => setIsLetterModalOpen(true)}
          onOpenNewReport={() => setIsReportModalOpen(true)}
          onLogout={handleLogout}
          selectedYear={selectedYear}
        />
      </div>

      {/* 2. KOLOM KANAN: WORKSPACE CANVAS (STITCH MAIN CONTENT CANVAS) */}
      <main
        className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100/60"
        data-purpose="monography-workspace"
      >
        {/* Top System Context Bar */}
        <header
          className="bg-white border-b border-slate-200/90 px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-2xs z-10"
          data-purpose="workspace-header"
        >
          {/* Breadcrumb & Territorial Scope */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                <span>Kecamatan Tomohon Tengah</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-900 font-semibold">Kelurahan Kolongan Satu</span>
                <span className="text-slate-300">•</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[10px]">
                  Tervalidasi Lurah
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Modul Pengisian Monografi Komprehensif
              </h2>
            </div>
          </div>

          {/* Year Selector Tabs & Quick New Year Button */}
          <div className="flex items-center gap-3">
            <div className="inline-flex p-1 bg-slate-100/80 rounded-xl border border-slate-200">
              {availableYears.map((yr) => {
                const isActiveYear = selectedYear === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => {
                      setSelectedYear(yr);
                      const firstInYear = monografiList.find((m) => m.year === yr);
                      if (firstInYear) setSelectedId(firstInYear.id);
                    }}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActiveYear
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    {isActiveYear && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    )}
                    <span>
                      {yr} {yr === 2025 ? '(Aktif)' : '(Arsip)'}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                const maxYear = Math.max(...availableYears, 2025);
                setNewYearInput(maxYear + 1);
                setNewYearError(null);
                setIsNewYearModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-slate-300 hover:border-brand-500 hover:text-brand-600 text-xs font-medium text-slate-600 transition-all bg-white hover:bg-brand-50/50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Buka Tahun Baru</span>
            </button>
          </div>
        </header>

        {/* Scrollable Ergonomic Workspace Canvas */}
        <div
          className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6"
          data-purpose="form-scrollable-container"
        >
          {/* Horizontal Module Selector Strip */}
          <div
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs"
            data-purpose="module-selector-tabs"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Kategori Monografi:
                </span>
                <span className="text-xs text-slate-400">
                  Pilih lembar kerja untuk mengisi sub-sektor
                </span>
              </div>

              {/* Live Module Search */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari bab, indikator, jaga..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Module Pill Buttons with Badges */}
            <div className="flex items-center gap-2 pt-3 overflow-x-auto pb-1 scrollbar-none">
              {visibleModules.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-1">
                  Tidak ada modul yang cocok dengan pencarian "{searchQuery}".
                </div>
              ) : (
                visibleModules.map((mod) => {
                  const isSelected = activeDetail.id === mod.id;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(mod.id);
                        setSelectedCategory(mod.categoryKey);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium'
                      }`}
                    >
                      <span>{mod.title}</span>
                      {mod.metrics.totalWarga ? (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {mod.metrics.totalWarga.toLocaleString('id-ID')} Jw
                        </span>
                      ) : mod.categoryKey === 'wilayah' ? (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          Sah
                        </span>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Module Workspace (Form + Preview Canvas) */}
          <DetailView
            item={activeDetail}
            currentOfficial={currentOfficial}
            onSaveItem={handleSaveMonografiEdit}
            onApproveItem={handleApproveByLurah}
            onVerifySeklur={handleVerifyBySeklur}
            onOpenLetterModal={() => setIsLetterModalOpen(true)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenPrintPreview={() => setIsPrintMonografiOpen(true)}
            onTriggerWhatsApp={() => setIsWhatsAppOpen(true)}
          />
        </div>
      </main>

      {/* MODAL 1: PERMOHONAN PERSURATAN WARGA */}
      <ModalLetterRequest
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        letters={letters}
        onAddLetter={handleAddLetter}
        onUpdateStatus={handleUpdateLetterStatus}
        currentOfficial={currentOfficial}
        onPrintLetter={handlePrintLetter}
      />

      {/* MODAL 2: LAPOR MASALAH LINGKUNGAN */}
      <ModalCitizenReport
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reports={reports}
        onAddReport={handleAddReport}
        onUpdateReportStatus={handleUpdateReportStatus}
        currentOfficial={currentOfficial}
      />

      {/* MODAL 3: SIMULATOR WHATSAPP NOTIFIKASI PEJABAT */}
      <ModalWhatsAppSimulator
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        activeItem={activeDetail}
        onApproveViaMagicLink={handleApproveByLurah}
        currentOfficial={currentOfficial}
      />

      {/* MODAL 4: CETAK SURAT RESMI KELURAHAN */}
      <ModalOfficialLetterPreview
        isOpen={isPrintLetterOpen}
        onClose={() => setIsPrintLetterOpen(false)}
        letter={printLetterTarget}
      />

      {/* MODAL 5: CETAK LEMBAR MONOGRAFI */}
      <ModalMonografiPrint
        isOpen={isPrintMonografiOpen}
        onClose={() => setIsPrintMonografiOpen(false)}
        item={activeDetail}
      />

      {/* MODAL 6: EDIT DATA MONOGRAFI APARATUR */}
      <ModalEditMonografi
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={editTargetItem || activeDetail}
        onSave={handleSaveMonografiEdit}
      />

      {/* MODAL 7: BUKA TAHUN MONOGRAFI BARU */}
      {isNewYearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
                  <CalendarPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Buka Periode Monografi Baru
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Sistem akan menyalin struktur indikator master
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewYearModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {newYearError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{newYearError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = Number(newYearInput);
                if (isNaN(val) || val < 2020 || val > 2050) {
                  setNewYearError('Tahun harus berupa angka valid antara 2020 - 2050.');
                  return;
                }
                if (availableYears.includes(val)) {
                  setNewYearError(`Periode tahun ${val} sudah ada dalam sistem.`);
                  return;
                }
                handleCreateNewYear(val);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Masukkan Angka Tahun Baru:
                </label>
                <input
                  type="number"
                  min={2020}
                  max={2050}
                  value={newYearInput}
                  onChange={(e) => setNewYearInput(parseInt(e.target.value) || 2026)}
                  className="w-full text-lg font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Seluruh modul (Wilayah Jaga I–V, Kependudukan, dsb) akan digandakan ke draf tahun baru.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewYearModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Buat Periode {newYearInput}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
