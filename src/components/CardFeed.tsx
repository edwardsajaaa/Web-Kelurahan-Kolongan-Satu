'use client';
import React, { useState } from 'react';
import { MonografiItem } from '@/data/monografiData';
import { Search, Filter, Calendar, CheckCircle2, Clock, FileEdit, ChevronRight, Layers } from 'lucide-react';

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

  return (
    <section className="w-full md:w-96 bg-slate-50 border-r border-slate-200/90 flex flex-col h-full overflow-hidden select-none">
      {/* Header Panel */}
      <div className="p-4 border-b border-slate-200/80 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Arsip Monografi</h2>
            <p className="text-[11px] text-slate-500">Papan Data Terverifikasi</p>
          </div>

          {/* Year Switcher Pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => onChangeYear(2024)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                selectedYear === 2024
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tahun 2024: Data Monografi Resmi Disahkan Lurah (Terkunci)"
            >
              2024 (Sah)
            </button>
            <button
              onClick={() => onChangeYear(2026)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                selectedYear === 2026
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tahun 2026: Draf Pemutakhiran Berjalan"
            >
              <span>2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mb-2.5">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Cari Jaga, ternak, air, sekolah..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onChangeSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600"
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
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition ${
                  isCatActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
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
          <div className="p-8 text-center text-slate-400">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-semibold text-slate-600">Tidak ada modul yang cocok</p>
            <p className="text-[11px] text-slate-400 mt-1">Coba ganti filter atau pilih tahun data lainnya</p>
            <button
              onClick={() => {
                onChangeCategory('all');
                onChangeSearch('');
              }}
              className="mt-3 px-3 py-1 bg-slate-200 text-slate-700 text-xs rounded-lg hover:bg-slate-300 font-medium"
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
                    ? 'bg-white border-slate-900 shadow-md shadow-slate-900/5 ring-1 ring-slate-900/5'
                    : 'bg-white/80 border-slate-200/70 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* Thumbnail Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white px-1 rounded bg-black/50 backdrop-blur-xs">
                    {item.year}
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-sky-700 tracking-wider uppercase truncate">
                        {item.category}
                      </span>
                      {item.statusTahapan === 'disahkan_lurah' ? (
                        <span className="inline-flex items-center text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60" title="Resmi Disahkan Lurah Kolongan Satu">
                          <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 text-emerald-600" />
                          Sah
                        </span>
                      ) : item.statusTahapan === 'diverifikasi_seklur' ? (
                        <span className="inline-flex items-center text-[9px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60" title="Diverifikasi Seklur">
                          <Clock className="w-2.5 h-2.5 mr-0.5 text-amber-600" />
                          Paraf Seklur
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[9px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200/60" title="Draf Masukan Pala/Kasie">
                          <FileEdit className="w-2.5 h-2.5 mr-0.5 text-sky-600" />
                          Draf
                        </span>
                      )}
                    </div>

                    <h3 className={`text-xs font-bold truncate mt-0.5 ${isSelected ? 'text-slate-900 font-extrabold' : 'text-slate-800'}`}>
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {item.statsValue}
                    </p>
                    <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition ${
                      isSelected ? 'text-slate-900 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                    }`} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-slate-200 bg-white/90 text-center">
        <p className="text-[10px] text-slate-500">
          Menampilkan <span className="font-bold text-slate-800">{filteredItems.length}</span> modul monografi aktif
        </p>
      </div>
    </section>
  );
}
