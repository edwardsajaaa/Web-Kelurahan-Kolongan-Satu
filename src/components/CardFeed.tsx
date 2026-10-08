'use client';
import React from 'react';
import { MonografiItem } from '@/data/monografiData';
import { Search, Filter, CheckCircle2, Clock, FileEdit, ChevronRight } from 'lucide-react';

interface CardFeedProps {
  items: MonografiItem[];
  selectedId: string;
  onSelectItem: (id: string) => void;
  selectedYear: number;
  onChangeYear: (year: number) => void;
  selectedCategory: string;
  onChangeCategory: (cat: string) => void;
  searchQuery: string;
  onChangeSearch: (query: string) => void;
  availableYears?: number[];
  onCreateYear?: (newYear: number) => void;
}

export const CATEGORY_OPTIONS = [
  { key: 'all', label: 'Semua Modul' },
  { key: 'wilayah', label: 'Wilayah Jaga' },
  { key: 'kependudukan', label: 'Kependudukan' },
  { key: 'pendidikan', label: 'Pendidikan' },
  { key: 'ekonomi', label: 'Ekonomi' },
  { key: 'peternakan', label: 'Peternakan' },
  { key: 'lingkungan', label: 'Air & Sanitasi' },
  { key: 'transparansi', label: 'Transparansi' },
];

export default function CardFeed({
  items,
  selectedId,
  onSelectItem,
  selectedYear,
  onChangeYear,
  selectedCategory,
  onChangeCategory,
  searchQuery,
  onChangeSearch,
  availableYears = [2024, 2025],
  onCreateYear,
}: CardFeedProps) {
  // Filter logic
  const filteredItems = items.filter((item) => {
    const matchYear = item.year === selectedYear;
    const matchCategory = selectedCategory === 'all' || item.categoryKey === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.statsValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.palaName && item.palaName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchYear && matchCategory && matchSearch;
  });

  const handleAddNewYearClick = () => {
    const maxYear = Math.max(...availableYears, 2025);
    const suggested = maxYear + 1;
    const input = window.prompt(`Masukkan tahun periode baru untuk disalin dari ${maxYear}:`, String(suggested));
    if (input) {
      const parsed = parseInt(input.trim(), 10);
      if (!isNaN(parsed) && parsed >= 2020 && parsed <= 2050) {
        if (availableYears.includes(parsed)) {
          alert(`Tahun ${parsed} sudah ada dalam daftar arsip.`);
          onChangeYear(parsed);
          return;
        }
        if (onCreateYear) {
          onCreateYear(parsed);
        }
      } else {
        alert('Tahun tidak valid. Harap masukkan angka tahun antara 2020 - 2050.');
      }
    }
  };

  return (
    <section className="w-full md:w-88 lg:w-96 bg-[#faf8ff] border-r border-[#dae2fd] flex flex-col h-full overflow-hidden select-none">
      {/* Header Panel */}
      <div className="p-4 border-b border-[#e2e7ff] bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-extrabold text-[#131b2e] leading-tight">Arsip Monografi</h2>
          </div>

          {/* Dynamic Year Switcher Pills & [+ Tahun Baru] */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <div className="flex items-center bg-[#f2f3ff] p-0.5 rounded-xl border border-[#dae2fd]">
              {availableYears.map((yr) => {
                const isSelected = selectedYear === yr;
                const isLatest = yr === Math.max(...availableYears);
                const isArchive = yr < Math.max(...availableYears);
                let label = `${yr}`;
                if (isLatest) label = `${yr} (Terbaru)`;
                else if (isArchive) label = `${yr} (Arsip)`;

                return (
                  <button
                    key={yr}
                    onClick={() => onChangeYear(yr)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-[#535f70] hover:text-[#131b2e]'
                    }`}
                  >
                    <span>{label}</span>
                    {isLatest && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#6cf8bb]' : 'bg-[#006c49]'}`}></span>}
                  </button>
                );
              })}
            </div>

            {/* [+ Tahun Baru] Button */}
            <button
              onClick={handleAddNewYearClick}
              type="button"
              className="px-2 py-1 rounded-lg text-[11px] font-bold text-primary bg-[#e2e7ff] hover:bg-[#d4deff] border border-[#dae2fd] transition flex items-center gap-1 shadow-xs cursor-pointer"
              title="Buka periode monografi tahun baru (salin draf dari tahun terakhir)"
            >
              <span>+ Tahun Baru</span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mb-2.5">
          <Search className="w-3.5 h-3.5 text-[#707881] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Cari Jaga, kependudukan, ternak..."
            className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#131b2e] placeholder-[#707881] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
          {searchQuery && (
            <button
              onClick={() => onChangeSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#707881] hover:text-[#131b2e]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Filter Horizontal Scroll */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {CATEGORY_OPTIONS.map((cat) => {
            const isCatActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => onChangeCategory(cat.key)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-semibold transition ${
                  isCatActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-[#f2f3ff] text-[#3f4850] hover:bg-[#e2e7ff] hover:text-primary'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Card List Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-[#707881]">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#006194]" />
            <p className="text-xs font-bold text-[#131b2e]">Tidak ada modul yang cocok</p>
            <p className="text-[11px] text-[#535f70] mt-1">Coba gunakan kata kunci lain atau reset filter</p>
            <button
              onClick={() => {
                onChangeCategory('all');
                onChangeSearch('');
              }}
              className="mt-3 px-3 py-1 bg-[#f2f3ff] text-primary border border-[#dae2fd] text-xs rounded-xl hover:bg-[#e2e7ff] font-bold transition"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isSelected = item.id === selectedId;

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item.id)}
                className={`p-3 rounded-2xl cursor-pointer border transition-all duration-200 flex space-x-3 relative group ${
                  isSelected
                    ? 'bg-white border-2 border-primary shadow-sm ring-2 ring-primary/10'
                    : 'bg-white border-[#e2e7ff] hover:border-[#dae2fd] hover:shadow-xs'
                }`}
              >
                {/* Thumbnail Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#f2f3ff] relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white px-1 rounded bg-black/60 backdrop-blur-xs">
                    {item.year}
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-primary tracking-wider uppercase truncate">
                        {item.category}
                      </span>
                      {item.statusTahapan === 'disahkan_lurah' ? (
                        <span className="inline-flex items-center text-[9px] font-bold text-[#006c49] bg-[#6cf8bb]/20 px-1.5 py-0.5 rounded-full border border-[#6cf8bb]/50">
                          <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 text-[#006c49]" />
                          Sah
                        </span>
                      ) : item.statusTahapan === 'diverifikasi_seklur' ? (
                        <span className="inline-flex items-center text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-2.5 h-2.5 mr-0.5 text-amber-700" />
                          Paraf Seklur
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[9px] font-bold text-primary bg-[#e2e7ff] px-1.5 py-0.5 rounded-full border border-[#dae2fd]">
                          <FileEdit className="w-2.5 h-2.5 mr-0.5 text-primary" />
                          Draf
                        </span>
                      )}
                    </div>

                    <h3 className={`text-xs font-bold truncate mt-0.5 ${isSelected ? 'text-[#131b2e] font-extrabold' : 'text-[#3f4850]'}`}>
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-[11px] text-[#535f70] font-medium truncate">
                      {item.statsValue}
                    </p>
                    <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition ${
                      isSelected ? 'text-primary translate-x-0.5' : 'text-[#bfc7d2] group-hover:text-primary'
                    }`} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-[#dae2fd] bg-white text-center">
        <p className="text-[10px] text-[#535f70]">
          Total <span className="font-bold text-[#131b2e]">{filteredItems.length}</span> modul monografi aktif
        </p>
      </div>
    </section>
  );
}
