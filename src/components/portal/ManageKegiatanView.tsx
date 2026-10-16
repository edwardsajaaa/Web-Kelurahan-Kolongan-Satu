'use client';

import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Star,
  Layers,
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
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [editingSlide, setEditingSlide] = useState<ActivitySlide>({
    id: '',
    title: '',
    subtitle: '',
    category: '',
    badge: '',
    imageUrl: '',
    images: [],
    alt: '',
  });

  const handleOpenAdd = () => {
    setModalMode('add');
    setImageInputMode('file');
    setUrlInput('');
    setEditingSlide({
      id: `slide-${Date.now().toString(36)}`,
      title: '',
      subtitle: '',
      category: 'Pemerintahan & Pelayanan Warga',
      badge: 'Agenda Kelurahan',
      imageUrl: '',
      images: [],
      alt: 'Dokumentasi Kegiatan Kelurahan Kolongan Satu',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: ActivitySlide) => {
    setModalMode('edit');
    const existingImages =
      slide.images && slide.images.length > 0
        ? [...slide.images]
        : slide.imageUrl
        ? [slide.imageUrl]
        : [];

    setImageInputMode(existingImages.some((img) => img.startsWith('data:')) ? 'file' : 'url');
    setUrlInput('');
    setEditingSlide({
      ...slide,
      imageUrl: slide.imageUrl || existingImages[0] || '',
      images: existingImages,
    });
    setIsModalOpen(true);
  };

  // Helper untuk kompresi file gambar menjadi dataUrl via Canvas
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
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
            if (!ctx) {
              reject(new Error('Canvas context tidak tersedia'));
              return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error('Format gambar tidak terbaca'));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
      reader.readAsDataURL(file);
    });
  };

  // Handle upload satu atau banyak file foto sekaligus
  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      showToast('Mohon pilih file bertipe gambar (JPG, PNG, atau WebP).');
      return;
    }

    setIsProcessingImage(true);
    try {
      const newUrls: string[] = [];
      for (const file of validFiles) {
        const dataUrl = await compressImageFile(file);
        newUrls.push(dataUrl);
      }

      setEditingSlide((prev) => {
        const currentList =
          prev.images && prev.images.length > 0
            ? prev.images
            : prev.imageUrl
            ? [prev.imageUrl]
            : [];
        const combined = [...currentList, ...newUrls];
        return {
          ...prev,
          imageUrl: combined[0] || '',
          images: combined,
          alt: prev.alt || validFiles[0]?.name.replace(/\.[^/.]+$/, ''),
        };
      });

      showToast(`Berhasil menambahkan ${validFiles.length} foto dokumentasi!`);
    } catch (err) {
      console.error('Gagal mengompresi gambar:', err);
      showToast('Sebagian foto gagal diproses. Silakan coba file lain.');
    } finally {
      setIsProcessingImage(false);
      e.target.value = '';
    }
  };

  // Tambah tautan URL
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    setEditingSlide((prev) => {
      const currentList =
        prev.images && prev.images.length > 0
          ? prev.images
          : prev.imageUrl
          ? [prev.imageUrl]
          : [];
      const combined = [...currentList, urlInput.trim()];
      return {
        ...prev,
        imageUrl: combined[0] || '',
        images: combined,
      };
    });
    setUrlInput('');
    showToast('Tautan foto berhasil ditambahkan ke daftar!');
  };

  // Jadikan foto tertentu sebagai foto sampul utama (posisi pertama)
  const handleSetAsCover = (index: number) => {
    setEditingSlide((prev) => {
      const list = [...(prev.images || (prev.imageUrl ? [prev.imageUrl] : []))];
      if (index <= 0 || index >= list.length) return prev;
      const [chosen] = list.splice(index, 1);
      list.unshift(chosen);
      return {
        ...prev,
        images: list,
        imageUrl: list[0],
      };
    });
    showToast('Foto sampul utama berhasil diperbarui!');
  };

  // Hapus satu foto dari daftar
  const handleRemovePhoto = (index: number) => {
    setEditingSlide((prev) => {
      const list = [...(prev.images || (prev.imageUrl ? [prev.imageUrl] : []))];
      list.splice(index, 1);
      return {
        ...prev,
        images: list,
        imageUrl: list[0] || '',
      };
    });
  };

  // Hapus semua foto
  const handleClearAllPhotos = () => {
    setEditingSlide((prev) => ({
      ...prev,
      images: [],
      imageUrl: '',
    }));
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

    const currentImages =
      editingSlide.images && editingSlide.images.length > 0
        ? editingSlide.images
        : editingSlide.imageUrl
        ? [editingSlide.imageUrl]
        : [];

    if (currentImages.length === 0) {
      alert('Foto dokumentasi kegiatan wajib diunggah (minimal 1 foto).');
      return;
    }

    const finalSlide: ActivitySlide = {
      ...editingSlide,
      imageUrl: currentImages[0],
      images: currentImages,
    };

    let updated: ActivitySlide[];
    if (modalMode === 'add') {
      updated = [finalSlide, ...kegiatan];
    } else {
      updated = kegiatan.map((k) => (k.id === finalSlide.id ? finalSlide : k));
    }

    await onSaveKegiatan(updated);
    setIsModalOpen(false);
    showToast(
      modalMode === 'add'
        ? `Dokumentasi kegiatan baru (${currentImages.length} foto) berhasil ditambahkan!`
        : `Pembaruan kegiatan "${finalSlide.title}" (${currentImages.length} foto) berhasil disimpan!`
    );
  };

  const activeImageList =
    editingSlide.images && editingSlide.images.length > 0
      ? editingSlide.images
      : editingSlide.imageUrl
      ? [editingSlide.imageUrl]
      : [];

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
              Dokumentasi &amp; Berita Kegiatan Slider ({kegiatan.length} Kegiatan)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Setiap kegiatan kini dapat memuat banyak foto dokumentasi sekaligus yang ditampilkan secara bergantian di landing page.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Kegiatan Baru</span>
        </button>
      </div>

      {/* Grid of Slide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {kegiatan.map((item) => {
          const itemImages =
            item.images && item.images.length > 0
              ? item.images
              : item.imageUrl
              ? [item.imageUrl]
              : [];

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 w-full relative bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl || itemImages[0]}
                    alt={item.alt || item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                      {item.badge}
                    </span>
                    {itemImages.length > 1 && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-600 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                        <ImageIcon className="w-3 h-3" />
                        <span>{itemImages.length} Foto</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Strip Pratinjau Foto Banyak jika ada */}
                {itemImages.length > 1 && (
                  <div className="px-4 pt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
                    {itemImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative w-12 h-9 rounded-lg overflow-hidden border shrink-0 ${
                          idx === 0 ? 'border-brand-500 ring-1 ring-brand-300' : 'border-slate-200'
                        }`}
                        title={idx === 0 ? 'Foto Sampul Utama' : `Foto #${idx + 1}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <div className="absolute bottom-0 inset-x-0 bg-brand-600/90 text-white text-[8px] font-bold text-center leading-tight">
                            Sampul
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

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
          );
        })}
      </div>

      {/* Modal Add / Edit Slide (Multi-Photo Support) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {modalMode === 'add' ? 'Tambah Kegiatan Dokumentasi' : 'Edit Kegiatan Dokumentasi'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Mendukung unggah lebih dari 1 foto dokumentasi</p>
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

              {/* SECTION: FOTO DOKUMENTASI (MULTI-IMAGE SUPPORT) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-600" />
                    <span>Foto Dokumentasi Kegiatan ({activeImageList.length} Foto) *</span>
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
                      multiple
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      onChange={handleFilesSelect}
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
                          <p className="text-xs font-bold text-brand-700">Mengoptimalkan dan mengompresi foto...</p>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-brand-600">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              Klik di sini untuk memilih foto (bisa pilih banyak sekaligus)
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Format PNG, JPG, JPEG, WebP • Tahan tombol <kbd className="px-1 py-0.5 bg-slate-200 rounded text-[10px]">Ctrl</kbd> / <kbd className="px-1 py-0.5 bg-slate-200 rounded text-[10px]">Shift</kbd> untuk memilih lebih dari 1
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold border border-brand-200/80">
                            + Pilih Foto dari Komputer / HP
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Tempel tautan URL foto: https://images.unsplash.com/..."
                        className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddUrl}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition shrink-0 cursor-pointer"
                      >
                        + Tambah
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Anda dapat memasukkan lebih dari satu URL foto untuk kegiatan ini.
                    </p>
                  </div>
                )}

                {/* DAFTAR FOTO TERUNGGAH (GALLERY GRID) */}
                {activeImageList.length > 0 && (
                  <div className="space-y-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Daftar Foto Dokumentasi ({activeImageList.length} Foto Siap Tampil)</span>
                      </span>

                      <div className="flex items-center gap-2">
                        {imageInputMode === 'file' && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Foto</span>
                          </button>
                        )}
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={handleClearAllPhotos}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                        >
                          Hapus Semua
                        </button>
                      </div>
                    </div>

                    {/* Thumbnail Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {activeImageList.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden border-2 bg-slate-900 group shadow-2xs ${
                            idx === 0
                              ? 'border-brand-500 ring-2 ring-brand-200'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <div className="h-28 w-full relative">
                            <img
                              src={imgUrl}
                              alt={`Foto ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                            {/* Badge Posisi */}
                            <div className="absolute top-1.5 left-1.5">
                              {idx === 0 ? (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-brand-600 text-white shadow-xs flex items-center gap-0.5">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  <span>Sampul</span>
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                                  #{idx + 1}
                                </span>
                              )}
                            </div>

                            {/* Tombol Aksi */}
                            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-white">
                              {idx !== 0 ? (
                                <button
                                  type="button"
                                  onClick={() => handleSetAsCover(idx)}
                                  className="text-[9px] bg-white/20 hover:bg-brand-600 px-1.5 py-0.5 rounded text-white font-semibold transition cursor-pointer"
                                  title="Jadikan sebagai foto sampul utama"
                                >
                                  Jadikan Sampul
                                </button>
                              ) : (
                                <span className="text-[9px] text-emerald-400 font-bold">Foto Utama</span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(idx)}
                                className="text-[9px] bg-rose-600/80 hover:bg-rose-700 px-1.5 py-0.5 rounded text-white font-semibold transition cursor-pointer"
                                title="Hapus foto ini"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 italic">
                      * Foto bertanda <strong>Sampul</strong> akan tampil sebagai sampul utama kegiatan. Klik &quot;Jadikan Sampul&quot; pada foto lain untuk memindahkannya ke posisi pertama.
                    </p>
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
                  disabled={isProcessingImage}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Kegiatan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
