'use client';

import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ExternalLink,
  Sparkles,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Loader2,
  RefreshCw,
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
  const [imageInputMode, setImageInputMode] = useState<'file' | 'url'>('file');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    setImageInputMode('file');
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
    setImageInputMode(slide.imageUrl.startsWith('data:') ? 'file' : 'url');
    setEditingSlide({ ...slide });
    setIsModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Mohon pilih file bertipe gambar (JPG, PNG, atau WebP).');
      return;
    }

    setIsProcessingImage(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Kompresi otomatis resolusi maksimal 1600px full HD banner
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setEditingSlide((prev) => ({
              ...prev,
              imageUrl: dataUrl,
              alt: prev.alt || file.name.replace(/\.[^/.]+$/, ''),
            }));
            showToast(`Foto "${file.name}" berhasil dimuat!`);
          }
        } catch (err) {
          console.error('Gagal mengompresi gambar:', err);
          showToast('Gagal memproses gambar. Silakan coba file lain.');
        } finally {
          setIsProcessingImage(false);
        }
      };
      img.onerror = () => {
        setIsProcessingImage(false);
        showToast('Format gambar tidak dapat dibaca.');
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setIsProcessingImage(false);
      showToast('Gagal membaca file gambar.');
    };
    reader.readAsDataURL(file);

    e.target.value = '';
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
    if (!editingSlide.imageUrl.trim()) {
      alert('Foto dokumentasi kegiatan wajib diunggah atau diisi URL-nya.');
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-brand-600" />
                    <span>Gambar Dokumentasi Kegiatan *</span>
                  </label>

                  {/* Mode Selector: Unggah File vs Tautan URL */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold border border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('file')}
                      className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                        imageInputMode === 'file'
                          ? 'bg-white text-brand-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Unggah File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                        imageInputMode === 'url'
                          ? 'bg-white text-brand-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Tautan URL</span>
                    </button>
                  </div>
                </div>

                {imageInputMode === 'file' ? (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      onChange={handleFileSelect}
                    />

                    <div
                      onClick={() => !isProcessingImage && fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        isProcessingImage
                          ? 'bg-brand-50/50 border-brand-300 pointer-events-none'
                          : 'border-slate-300 hover:border-brand-500 bg-slate-50 hover:bg-brand-50/20'
                      }`}
                    >
                      {isProcessingImage ? (
                        <>
                          <Loader2 className="w-6 h-6 text-brand-600 animate-spin" />
                          <p className="text-xs font-bold text-brand-700">Mengoptimalkan gambar...</p>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-brand-600">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              Klik di sini untuk memilih foto dari perangkat Anda
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Format PNG, JPG, JPEG, atau WebP (Kompresi otomatis)
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold border border-brand-200/80">
                            Pilih Foto dari Komputer / HP
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <input
                      type="url"
                      value={editingSlide.imageUrl}
                      onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... atau tautan web foto"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
                    />
                    <p className="text-[11px] text-slate-400">
                      Gunakan tautan URL gambar eksternal yang dapat diakses publik.
                    </p>
                  </div>
                )}

                {/* Pratinjau Foto Langsung */}
                {editingSlide.imageUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 mt-2 shadow-xs">
                    <div className="h-36 w-full relative">
                      <img
                        src={editingSlide.imageUrl}
                        alt={editingSlide.alt || 'Pratinjau Slide'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end justify-between p-3 text-white">
                        <span className="text-[11px] font-bold flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Foto Siap Ditampilkan</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          {imageInputMode === 'file' && (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-[11px] bg-white/20 hover:bg-white/30 text-white font-semibold px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Ganti File</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setEditingSlide({ ...editingSlide, imageUrl: '' })}
                            className="text-[11px] bg-rose-600/90 hover:bg-rose-700 text-white font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
