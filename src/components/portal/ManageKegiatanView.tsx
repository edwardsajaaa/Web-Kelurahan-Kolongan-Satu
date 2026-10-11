'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { ActivitySlide } from '@/data/landingContentData';

interface ManageKegiatanViewProps {
  kegiatan: ActivitySlide[];
  onSaveKegiatan: (updated: ActivitySlide[]) => Promise<void>;
  showToast: (msg: string) => void;
}

export default function ManageKegiatanView({
  kegiatan,
  onSaveKegiatan,
  showToast,
}: ManageKegiatanViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingSlide, setEditingSlide] = useState<ActivitySlide>({
    id: '',
    title: '',
    subtitle: '',
    category: '',
    badge: '',
    imageUrl: '',
    alt: '',
  });

  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingSlide({
      id: `slide-${Date.now().toString(36)}`,
      title: '',
      subtitle: '',
      category: 'Pemerintahan & Pelayanan Warga',
      badge: 'Agenda Kelurahan',
      imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1920&q=80',
      alt: 'Dokumentasi Kegiatan Kelurahan Kolongan Satu',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: ActivitySlide) => {
    setModalMode('edit');
    setEditingSlide({ ...slide });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus slide kegiatan "${title}"?`)) return;
    const updated = kegiatan.filter((k) => k.id !== id);
    await onSaveKegiatan(updated);
    showToast(`Slide kegiatan "${title}" berhasil dihapus.`);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide.title.trim()) {
      alert('Judul kegiatan wajib diisi.');
      return;
    }

    let updated: ActivitySlide[];
    if (modalMode === 'add') {
      updated = [editingSlide, ...kegiatan];
    } else {
      updated = kegiatan.map((k) => (k.id === editingSlide.id ? editingSlide : k));
    }

    await onSaveKegiatan(updated);
    setIsModalOpen(false);
    showToast(
      modalMode === 'add'
        ? `Dokumentasi kegiatan baru berhasil ditambahkan!`
        : `Pembaruan kegiatan "${editingSlide.title}" berhasil disimpan!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Dokumentasi &amp; Berita Kegiatan Slider ({kegiatan.length} Slide)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Slide ini berputar otomatis pada spanduk kegiatan utama di halaman depan (landing page).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Slide Kegiatan</span>
        </button>
      </div>

      {/* Grid of Slide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {kegiatan.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              <div className="h-44 w-full relative bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.alt || item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                    {item.badge}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[11px] font-bold text-brand-600 block">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">ID: {item.id}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-600 transition cursor-pointer"
                  title="Edit Slide"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition cursor-pointer"
                  title="Hapus Slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Slide */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {modalMode === 'add' ? 'Tambah Slide Dokumentasi' : 'Edit Slide Kegiatan'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Spanduk Interaktif Landing Page</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Judul Kegiatan</label>
                <input
                  type="text"
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  placeholder="Contoh: Musrenbang Kelurahan, Gotong Royong Kebersihan..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Kategori</label>
                  <input
                    type="text"
                    value={editingSlide.category}
                    onChange={(e) => setEditingSlide({ ...editingSlide, category: e.target.value })}
                    placeholder="Pemerintahan, Lingkungan Hidup, dsb."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Badge Label</label>
                  <input
                    type="text"
                    value={editingSlide.badge}
                    onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                    placeholder="Agenda Tahunan, Kegiatan Swadaya..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">URL Gambar Dokumentasi</label>
                <input
                  type="url"
                  value={editingSlide.imageUrl}
                  onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... atau link foto"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Ringkasan / Subjudul Kegiatan</label>
                <textarea
                  rows={3}
                  value={editingSlide.subtitle}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  placeholder="Keterangan singkat mengenai jalannya acara / program kerja..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 leading-relaxed"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Slide</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
