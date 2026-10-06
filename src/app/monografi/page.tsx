'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MONOGRAFI_STITCH_HTML } from '@/data/monografiStitchHtml';
import { MONOGRAFI_ITEMS, MonografiItem } from '@/data/monografiData';
import { Activity, ShieldCheck } from 'lucide-react';

export default function MonografiPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveItems, setLiveItems] = useState<MonografiItem[]>(MONOGRAFI_ITEMS);

  useEffect(() => {
    async function loadLiveMonografi() {
      try {
        const res = await fetch('/api/monografi');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setLiveItems(json.data);
          }
        }
      } catch (err) {
        console.warn('Gagal memuat live monografi:', err);
      }
    }
    loadLiveMonografi();
  }, []);

  useEffect(() => {
    // Setup global window functions for interactive filter tabs & search from Stitch design
    (window as any).filterSection = function (sectionId: string) {
      const buttons = document.querySelectorAll('#nav-filter-tabs .tab-btn');
      buttons.forEach((btn: any) => {
        btn.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
        btn.classList.add('bg-surface-container-low', 'text-on-surface-variant');
      });

      if ((window as any).event && (window as any).event.currentTarget) {
        const activeBtn = (window as any).event.currentTarget;
        activeBtn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
        activeBtn.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
      }

      const sections = document.querySelectorAll('.searchable-section');
      if (sectionId === 'all') {
        sections.forEach((sec: any) => (sec.style.display = 'block'));
      } else {
        sections.forEach((sec: any) => {
          if (sec.id === sectionId) {
            sec.style.display = 'block';
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            sec.style.display = 'none';
          }
        });
      }
    };

    (window as any).handleSearch = function (query: string) {
      const q = query.toLowerCase().trim();
      const sections = document.querySelectorAll('.searchable-section');
      if (!q) {
        sections.forEach((sec: any) => (sec.style.display = 'block'));
        return;
      }
      sections.forEach((sec: any) => {
        const text = sec.innerText.toLowerCase();
        if (text.includes(q)) {
          sec.style.display = 'block';
        } else {
          sec.style.display = 'none';
        }
      });
    };

    return () => {
      try {
        (window as any).filterSection = undefined;
        (window as any).handleSearch = undefined;
      } catch {
        // safe fallback
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] font-sans antialiased selection:bg-[#006194] selection:text-white flex flex-col justify-between">
      {/* ============================================================ */}
      {/* 1. HEADER & NAVBAR (Fluid Responsive)                        */}
      {/* ============================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/92 backdrop-blur-xl border-b border-[#e2e7ff]/80 shadow-[0_1px_12px_rgba(0,0,0,0.04)] transition-all">
        <div className="h-20 2xl:h-24 w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 2xl:gap-4 group">
            <div className="p-1 2xl:p-1.5 bg-[#f2f3ff] rounded-full shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <img
                alt="Lambang Kolongan Satu"
                className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmHZWdfGwGmtKd7WQmqYAolpSTVfdzZ9o_PS86bfdJVmhgEbRRth-v4rnoCOXBuQ4rQllgVR5nednaoxhTKE3HaZrfgKH07dp48WXlGpdCkPwVw7t1SLyV-UQxj_n3EiZqaWXZItQiD2p_vqtKi_xSE74TrV0f1V-Azvr4pEqGb2SCR7zqAIzDYHRNzTburxA3gDsFwOEtNColVLoZ5UF1Xy0WSKOkbAkPEIA04HcG2N0n-qDAhHKdo7iOJD-lul2L9S0"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-[17px] 2xl:text-xl text-[#131b2e] tracking-tight leading-tight">
                Kolongan Satu
              </span>
              <span className="text-[12px] 2xl:text-sm text-[#3f4850] font-medium tracking-wide">
                Kota Tomohon
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 2xl:gap-12">
            <Link
              href="/"
              className="text-[14px] 2xl:text-[16px] text-[#3f4850] hover:text-[#006194] font-medium transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/#sejarah-wilayah"
              className="text-[14px] 2xl:text-[16px] text-[#3f4850] hover:text-[#006194] font-medium transition-colors"
            >
              Profil &amp; Sejarah
            </Link>
            <Link
              href="/monografi"
              className="text-[14px] 2xl:text-[16px] text-[#006194] font-semibold transition-colors hover:text-[#007bb9]"
            >
              Monografi
            </Link>
            <Link
              href="/#layanan-cepat"
              className="text-[14px] 2xl:text-[16px] text-[#3f4850] hover:text-[#006194] font-medium transition-colors"
            >
              Layanan Publik
            </Link>
          </nav>

          {/* Right Action: Unduh PDF & Masuk Portal */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-[13px] 2xl:text-[14px] font-semibold text-white bg-[#006194] hover:bg-[#007bb9] px-4 2xl:px-6 py-2.5 2xl:py-3 rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">picture_as_pdf</span>
              <span className="hidden sm:inline">Cetak / Unduh PDF</span>
            </button>

            <Link
              href="/portal"
              className="inline-flex items-center gap-1.5 2xl:gap-2 text-[14px] 2xl:text-[15px] font-semibold text-[#006194] bg-white hover:bg-[#e2e7ff] border border-[#e2e7ff] px-4 2xl:px-5 py-2.5 2xl:py-3 rounded-full shadow-xs hover:shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[17px] 2xl:text-[20px]">login</span>
              <span>Portal</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#3f4850] hover:bg-[#f2f3ff]"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#e2e7ff] px-6 py-4 flex flex-col gap-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] text-[#3f4850] font-medium py-1.5"
            >
              Beranda
            </Link>
            <Link
              href="/monografi"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] text-[#006194] font-semibold py-1.5"
            >
              Monografi
            </Link>
            <Link
              href="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] text-[#3f4850] font-medium py-1.5"
            >
              Portal Aparatur
            </Link>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* LIVE MONOGRAFI DATA SYNC BANNER (KONEKSI REALTIME KE PORTAL) */}
      {/* ============================================================ */}
      {(() => {
        const jagaItems = liveItems.filter((i) => i.categoryKey === 'wilayah');
        const totalJiwa = jagaItems.reduce((acc, curr) => acc + (curr.metrics.totalWarga || 0), 0);
        const totalKK = jagaItems.reduce((acc, curr) => acc + (curr.metrics.kepalaKeluarga || 0), 0);

        return (
          <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#dae2fd] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#131b2e]">Data Register Faktual (Terkoneksi Portal Admin)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#006c49] border border-[#6cf8bb]/60">
                      Live Database
                    </span>
                  </div>
                  <p className="text-[11px] text-[#535f70] mt-0.5">
                    Total Wilayah 5 Jaga: <strong className="text-[#131b2e]">{totalJiwa > 0 ? totalJiwa.toLocaleString() : '1.484'} Jiwa</strong> • <strong className="text-[#131b2e]">{totalKK > 0 ? totalKK.toLocaleString() : '540'} KK</strong> • Bersumber langsung dari buku register kelurahan.
                  </p>
                </div>
              </div>

              {/* Status 5 Jaga Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs w-full lg:w-auto">
                {jagaItems.map((j) => (
                  <div
                    key={j.id}
                    className="px-2.5 py-1 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] text-[#131b2e] flex items-center gap-1.5 text-[11px]"
                    title={`${j.title}: ${j.description}`}
                  >
                    <span className="font-bold text-primary">{j.title.replace('Lingkungan ', 'Jaga ')}:</span>
                    <span className="font-mono font-bold text-[#131b2e]">{j.metrics.totalWarga || 0}</span>
                    <span className="text-[10px] text-[#535f70]">({j.metrics.kepalaKeluarga || 0} KK)</span>
                    {j.statusTahapan === 'disahkan_lurah' ? (
                      <span className="w-2 h-2 rounded-full bg-[#006c49]" title="Disahkan Lurah" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-500" title="Draf Masukan" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ============================================================ */}
      {/* MAIN CONTENT (Imported from Stitch Design Screen)            */}
      {/* ============================================================ */}
      <div
        className="w-full flex-1"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: MONOGRAFI_STITCH_HTML }}
      />

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="w-full bg-[#f2f3ff] text-[#3f4850] pt-12 2xl:pt-16 pb-8 2xl:pb-12 border-t border-[#dae2fd] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="w-full max-w-7xl xl:max-w-[85rem] 2xl:max-w-[96rem] 3xl:max-w-[107.5rem] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 2xl:gap-12 mb-10 2xl:mb-14">
            <div className="flex flex-col gap-2.5 2xl:gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 2xl:h-8 bg-[#006194] rounded-full" />
                <h4 className="text-lg 2xl:text-2xl text-[#131b2e] font-bold">Kolongan Satu</h4>
              </div>
              <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] leading-relaxed">
                Pemerintah Kelurahan Kolongan Satu, pusat administrasi dan keterbukaan data monografi kependudukan, wilayah, dan pelayanan masyarakat terpadu Kota Tomohon.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 2xl:gap-4">
              <h5 className="text-base 2xl:text-xl text-[#131b2e] font-bold">Jam Pelayanan</h5>
              <ul className="space-y-1.5 2xl:space-y-2 text-xs sm:text-sm 2xl:text-base text-[#3f4850]">
                <li>Senin - Kamis: 08.00 - 16.00 WITA</li>
                <li>Jumat: 08.00 - 15.30 WITA</li>
                <li>Sabtu &amp; Minggu: Tutup (Layanan Daring Aktif)</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2.5 2xl:gap-4">
              <h5 className="text-base 2xl:text-xl text-[#131b2e] font-bold">Tautan Cepat</h5>
              <nav className="flex flex-col space-y-1.5 2xl:space-y-2 text-xs sm:text-sm 2xl:text-base">
                <Link href="/" className="text-[#3f4850] hover:text-[#006194] transition-colors">
                  Beranda Portal
                </Link>
                <Link href="/monografi" className="text-[#3f4850] hover:text-[#006194] transition-colors">
                  Monografi Wilayah Terpadu
                </Link>
                <Link href="/portal" className="text-[#3f4850] hover:text-[#006194] transition-colors">
                  Peta Lingkungan (Jaga I - V)
                </Link>
              </nav>
            </div>

            <div className="flex flex-col gap-2.5 2xl:gap-4">
              <h5 className="text-base 2xl:text-xl text-[#131b2e] font-bold">Kontak Kantor</h5>
              <p className="text-xs sm:text-sm 2xl:text-base text-[#3f4850] leading-relaxed">
                Jl. Kolongan Raya, Kecamatan Tomohon Tengah, Kota Tomohon, Sulawesi Utara 95438
              </p>
              <p className="text-xs sm:text-sm 2xl:text-base text-[#006194] font-medium">
                Surel: kel.kolongansatu@tomohon.go.id
              </p>
            </div>
          </div>

          <div className="pt-4 2xl:pt-6 border-t border-[#dae2fd] flex flex-col md:flex-row items-center justify-between gap-3 text-xs 2xl:text-sm text-[#3f4850]">
            <p>© 2024 Pemerintah Kelurahan Kolongan Satu, Kota Tomohon. Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-[#006194] transition-colors">
                Kebijakan Privasi
              </Link>
              <span>•</span>
              <Link href="/" className="hover:text-[#006194] transition-colors">
                Ketentuan Layanan
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
