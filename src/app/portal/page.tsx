'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MONOGRAFI_ITEMS, MonografiItem } from '@/data/monografiData';
import { MONOGRAFI_2024 } from '@/data/monografi2024';
import { OFFICIALS, Official } from '@/data/officialsData';
import { INITIAL_LETTERS, LetterRequest } from '@/data/lettersData';
import { INITIAL_REPORTS, CitizenReport } from '@/data/reportsData';

import Sidebar from '@/components/Sidebar';
import CardFeed from '@/components/CardFeed';
import DetailView from '@/components/DetailView';
import ModalLetterRequest from '@/components/ModalLetterRequest';
import ModalCitizenReport from '@/components/ModalCitizenReport';
import ModalWhatsAppSimulator from '@/components/ModalWhatsAppSimulator';
import ModalOfficialLetterPreview from '@/components/ModalOfficialLetterPreview';
import ModalMonografiPrint from '@/components/ModalMonografiPrint';
import ModalSqlSchema from '@/components/ModalSqlSchema';

import { Menu, X, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function PortalPage() {
  // Master data states
  const [monografiList, setMonografiList] = useState<MonografiItem[]>(MONOGRAFI_ITEMS);
  const [selectedId, setSelectedId] = useState<string>('lingk-3');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Role & User state (Default: Theresia J. Kaunang, SE - Lurah)
  const [currentOfficial, setCurrentOfficial] = useState<Official>(OFFICIALS[0]);

  // Citizen letters and incident reports states
  const [letters, setLetters] = useState<LetterRequest[]>(INITIAL_LETTERS);
  const [reports, setReports] = useState<CitizenReport[]>(INITIAL_REPORTS);

  // Active navigation tab
  const [activeNav, setActiveNav] = useState<string>('monografi');

  // Modals state
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isPrintLetterOpen, setIsPrintLetterOpen] = useState(false);
  const [isPrintMonografiOpen, setIsPrintMonografiOpen] = useState(false);

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
  const activeDetail = monografiList.find((c) => c.id === selectedId) || monografiList[0];

  // Initial fetch from backend APIs
  React.useEffect(() => {
    async function loadBackendData() {
      try {
        const [resLetters, resReports] = await Promise.all([
          fetch('/api/surat'),
          fetch('/api/lapor'),
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
      } catch (err) {
        console.warn('Menggunakan data awal lokal:', err);
      }
    }

    loadBackendData();
  }, []);

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

    showToast(`Data "${itemTitle}" berhasil disahkan secara digital oleh Lurah Theresia J. Kaunang, SE dan resmi diterbitkan ke publik!`);

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
      console.warn('Gagal sinkronisasi pengesahan monografi ke API, mengembalikan status:', e);
      // Rollback on error
      setMonografiList(previousList);
      showToast(`Peringatan: Gagal sinkronisasi pengesahan ke server (${e.message || 'Koneksi error'}). Status dikembalikan.`);
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
              lastUpdated: `${new Date().toLocaleDateString('id-ID')} - Paraf Seklur Ferromel L. Pua`,
            }
          : item
      )
    );

    showToast(`Data "${itemTitle}" telah diverifikasi administratif oleh Seklur Ferromel L. Pua, S.Kom!`);

    try {
      const res = await fetch('/api/monografi', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: itemId,
          statusTahapan: 'diverifikasi_seklur',
          officialName: 'Seklur Ferromel L. Pua, S.Kom',
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menyimpan paraf verifikasi ke server.');
      }
    } catch (e: any) {
      console.warn('Gagal verifikasi monografi ke API, mengembalikan status:', e);
      // Rollback on error
      setMonografiList(previousList);
      showToast(`Peringatan: Gagal sinkronisasi verifikasi ke server (${e.message || 'Koneksi error'}). Status dikembalikan.`);
    }
  };

  const handleUpdateLetterStatus = async (id: string, newStatus: LetterRequest['statusSurat'], note?: string) => {
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
                  ? 'Diparaf Seklur Ferromel'
                  : newStatus === 'selesai_disahkan'
                  ? 'Selesai & Disahkan Lurah'
                  : 'Ditolak',
              catatanPetugas: note || l.catatanPetugas,
              diparafOleh: newStatus === 'diparaf_seklur' ? 'Ferromel L. Pua, S.Kom (Seklur)' : l.diparafOleh,
              disahkanOleh: newStatus === 'selesai_disahkan' ? 'Theresia J. Kaunang, SE (Lurah)' : l.disahkanOleh,
              tanggalSelesai: newStatus === 'selesai_disahkan' ? new Date().toLocaleString('id-ID') : l.tanggalSelesai,
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

    showToast(`Status permohonan surat berhasil diperbarui ke: ${newStatus.replace('_', ' ').toUpperCase()}`);
  };

  const handleAddLetter = (newLetter: LetterRequest) => {
    setLetters((prev) => {
      const exists = prev.some((l) => l.noRegistrasi === newLetter.noRegistrasi || l.id === newLetter.id);
      if (exists) return prev.map((l) => (l.noRegistrasi === newLetter.noRegistrasi ? newLetter : l));
      return [newLetter, ...prev];
    });
    showToast(`Permohonan surat berhasil diajukan dengan nomor ${newLetter.noRegistrasi}`);
  };

  const handleAddReport = (newReport: CitizenReport) => {
    setReports((prev) => {
      const exists = prev.some((r) => r.ticketNo === newReport.ticketNo || r.id === newReport.id);
      if (exists) return prev.map((r) => (r.ticketNo === newReport.ticketNo ? newReport : r));
      return [newReport, ...prev];
    });
    showToast(`Laporan aduan #${newReport.ticketNo} berhasil dicatat.`);
  };

  const handleUpdateReportStatus = async (id: string, newStatus: CitizenReport['status'], tanggapan?: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: newStatus,
              statusLabel: newStatus === 'dalam_tindakan' ? 'Sedang Dalam Tindakan' : 'Selesai',
              tanggapanPetugas: tanggapan || r.tanggapanPetugas,
              diselesaikanPada: newStatus === 'selesai' ? new Date().toLocaleString('id-ID') : r.diselesaikanPada,
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
      setSelectedId('lingk-1');
    } else if (navId === 'kependudukan') {
      setSelectedCategory('kependudukan');
      setSelectedId('kependudukan-total');
    } else if (navId === 'pendidikan') {
      setSelectedCategory('pendidikan');
      setSelectedId('pendidikan-sosial');
    } else if (navId === 'peternakan') {
      setSelectedCategory('peternakan');
      setSelectedId('ternak');
    } else if (navId === 'lingkungan') {
      setSelectedCategory('lingkungan');
      setSelectedId('air-sanitasi');
    } else if (navId === 'transparansi') {
      setSelectedCategory('transparansi');
      setSelectedId('transparansi-apbd');
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#faf8ff] font-sans text-[#131b2e] antialiased overflow-hidden flex-col md:flex-row">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[9999] bg-white text-[#131b2e] px-4 py-3 rounded-2xl shadow-xl border border-[#dae2fd] flex items-center space-x-3 animate-in slide-in-from-top-4 duration-300 max-w-md">
          <div className="w-8 h-8 rounded-xl bg-[#6cf8bb]/20 text-[#006c49] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs leading-relaxed">
            <p className="font-bold text-primary">Pemberitahuan Sistem</p>
            <p className="text-[#3f4850] mt-0.5">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#707881] hover:text-[#131b2e] text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Mobile Bar */}
      <div className="md:hidden flex items-center justify-between p-3 bg-white border-b border-[#dae2fd] z-30">
        <div className="flex items-center space-x-2">
          <Link href="/" className="p-1 text-[#535f70] hover:text-[#131b2e]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-8 w-8 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-xs">
            K1
          </div>
          <div>
            <h1 className="text-xs font-bold text-[#131b2e] leading-tight">PORTAL KOLONGAN SATU</h1>
            <p className="text-[10px] text-[#535f70]">Tomohon Tengah, Kota Tomohon</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsWhatsAppOpen(true)}
            className="p-2 bg-[#f2f3ff] text-primary rounded-xl text-xs font-semibold"
            title="Simulasi WhatsApp"
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 bg-[#f2f3ff] text-[#131b2e] rounded-xl"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 1. KOLOM KIRI: SIDEBAR NAVIGASI */}
      <div className={`${isMobileSidebarOpen ? 'block fixed inset-0 z-40 md:relative' : 'hidden md:flex'} h-full flex-col`}>
        <div className="hidden md:flex items-center justify-between px-4 py-2.5 bg-white text-xs text-[#535f70] border-b border-[#dae2fd]">
          <Link href="/" className="inline-flex items-center gap-1.5 text-primary font-bold hover:text-[#004d77] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
        <Sidebar
          currentOfficial={currentOfficial}
          onSelectOfficial={(off) => {
            setCurrentOfficial(off);
            showToast(`Peran pengguna aktif: ${off.name} (${off.roleTitle})`);
          }}
          activeNav={activeNav}
          onSelectNav={handleNavSelect}
          pendingLettersCount={letters.filter((l) => l.statusSurat !== 'selesai_disahkan').length}
          activeReportsCount={reports.filter((r) => r.status !== 'selesai').length}
          onOpenWhatsAppSimulator={() => setIsWhatsAppOpen(true)}
          onOpenSqlModal={() => setIsSqlModalOpen(true)}
        />
      </div>

      {/* 2. KOLOM TENGAH: DAFTAR KARTU (CARD LIST) */}
      <CardFeed
        items={monografiList}
        selectedId={selectedId}
        onSelectItem={(id) => {
          setSelectedId(id);
          const found = monografiList.find((m) => m.id === id);
          if (found) {
            setSelectedYear(found.year);
          }
        }}
        selectedYear={selectedYear}
        onChangeYear={(yr) => setSelectedYear(yr)}
        selectedCategory={selectedCategory}
        onChangeCategory={(cat) => setSelectedCategory(cat)}
        searchQuery={searchQuery}
        onChangeSearch={(q) => setSearchQuery(q)}
      />

      {/* 3. KOLOM KANAN: DETAIL DATA & GRAFIK (MASTER-DETAIL VIEW) */}
      <DetailView
        item={activeDetail}
        currentOfficial={currentOfficial}
        onApproveItem={handleApproveByLurah}
        onVerifySeklur={handleVerifyBySeklur}
        onOpenLetterModal={() => setIsLetterModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenPrintPreview={(item) => setIsPrintMonografiOpen(true)}
        onTriggerWhatsApp={() => setIsWhatsAppOpen(true)}
      />

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

      {/* MODAL 6: SKEMA SQL DATABASE SUPABASE */}
      <ModalSqlSchema
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />
    </div>
  );
}
