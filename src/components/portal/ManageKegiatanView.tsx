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
  Star,
  Layers,
  Sliders,
  MoveVertical,
  Maximize2,
  Eye,
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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [editingSlide, setEditingSlide] = useState<ActivitySlide>({
    id: '',
    title: '',
    subtitle: '',
    category: '',
    badge: '',
    imageUrl: '',
    images: [],
    imagePosition: 'center',
    imagePositions: {},
    imageFit: 'cover',
    alt: '',
  });

  const handleOpenAdd = () => {
    setModalMode('add');
    setImageInputMode('file');
    setUrlInput('');
    setSelectedPhotoIndex(0);
    setEditingSlide({
      id: `slide-${Date.now().toString(36)}`,
      title: '',
      subtitle: '',
      category: 'Pemerintahan & Pelayanan Warga',
      badge: 'Agenda Kelurahan',
      imageUrl: '',
      images: [],
      imagePosition: 'center',
      imagePositions: {},
      imageFit: 'cover',
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
    setSelectedPhotoIndex(0);
    setEditingSlide({
      ...slide,
      imageUrl: slide.imageUrl || existingImages[0] || '',
      images: existingImages,
      imagePosition: slide.imagePosition || 'center',
      imagePositions: slide.imagePositions || {},
      imageFit: slide.imageFit || 'cover',
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
    setSelectedPhotoIndex(0);
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
    setSelectedPhotoIndex((prev) => Math.max(0, prev - 1));
  };

  // Hapus semua foto
  const handleClearAllPhotos = () => {
    setEditingSlide((prev) => ({
      ...prev,
      images: [],
      imageUrl: '',
      imagePositions: {},
    }));
    setSelectedPhotoIndex(0);
  };

  // Posisi vertikal fokus per foto dalam persen (0% s/d 100%)
  const getPhotoPositionPercent = (idx: number): number => {
    const pos = editingSlide.imagePositions?.[idx] || editingSlide.imagePosition || 'center';
    if (pos === 'top' || pos === 'center 0%') return 0;
    if (pos === 'bottom' || pos === 'center 100%') return 100;
    if (pos === 'center' || pos === 'center center' || pos === 'center 50%') return 50;
    const match = pos.match(/(\d+)%/);
    if (match) return parseInt(match[1], 10);
    return 50;
  };

  const handlePositionChange = (percent: number) => {
    const posString = `center ${percent}%`;
    setEditingSlide((prev) => ({
      ...prev,
      imagePosition: posString,
      imagePositions: {
        ...(prev.imagePositions || {}),
        [selectedPhotoIndex]: posString,
      },
    }));
  };

  const handleFitChange = (fit: 'cover' | 'contain') => {
    setEditingSlide((prev) => ({
      ...prev,
      imageFit: fit,
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
      imagePosition: editingSlide.imagePosition || `center ${getPhotoPositionPercent(0)}%`,
      imagePositions: editingSlide.imagePositions || {},
      imageFit: editingSlide.imageFit || 'cover',
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

  const currentActivePhotoUrl =
    activeImageList[selectedPhotoIndex] || activeImageList[0] || '';
  const currentPhotoPercent = getPhotoPositionPercent(selectedPhotoIndex);
  const currentFit = editingSlide.imageFit || 'cover';

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
            Mendukung multi-foto dan penyesuaian sudut/posisi foto secara manual agar wajah dan orang tidak terpotong di banner depan.
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

          const cardPos = item.imagePosition || 'center';

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 w-full relative bg-slate-900 overflow-hidden">
                  <img
                    src={item.imageUrl || itemImages[0]}
                    alt={item.alt || item.title}
                    style={{ objectPosition: cardPos }}
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

                  {item.imagePosition && item.imagePosition !== 'center' && (
                    <div className="absolute bottom-2 right-2">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                        <MoveVertical className="w-2.5 h-2.5 text-brand-300" />
                        <span>{item.imagePosition}</span>
                      </span>
                    </div>
                  )}
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
                    title="Edit Slide & Atur Posisi Foto"
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

      {/* Modal Add / Edit Slide (Multi-Photo & Manual Position Tuning) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden max-h-[94vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {modalMode === 'add' ? 'Tambah Kegiatan Dokumentasi' : 'Edit Kegiatan Dokumentasi'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Unggah banyak foto dan sesuaikan sudut/posisi tampilan secara manual</p>
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

            <form onSubmit={handleSaveModal} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Judul Kegiatan</label>
                <input
                  type="text"
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  placeholder="Contoh: Pentahbisan & Peresmian Gereja GMIM Elohim..."
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
                    placeholder="KEAGAMAAN, Pemerintahan, dsb."
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
                    placeholder="Kegiatan Peresmian Gedung, dsb."
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
                  <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Daftar Foto Dokumentasi ({activeImageList.length} Foto)</span>
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

                    {/* Thumbnail Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-52 overflow-y-auto pr-1">
                      {activeImageList.map((imgUrl, idx) => {
                        const isSelected = idx === selectedPhotoIndex;
                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedPhotoIndex(idx)}
                            className={`relative rounded-xl overflow-hidden border-2 bg-slate-900 group shadow-2xs cursor-pointer transition-all ${
                              isSelected
                                ? 'border-brand-500 ring-2 ring-brand-300 scale-[1.02]'
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

                              {/* Top Badges */}
                              <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
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

                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5">
                                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500 text-white shadow-xs flex items-center gap-0.5">
                                    <Eye className="w-2.5 h-2.5" />
                                    <span>Dipilih</span>
                                  </span>
                                </div>
                              )}

                              {/* Bottom Controls */}
                              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-white">
                                {idx !== 0 ? (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSetAsCover(idx);
                                    }}
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemovePhoto(idx);
                                  }}
                                  className="text-[9px] bg-rose-600/80 hover:bg-rose-700 px-1.5 py-0.5 rounded text-white font-semibold transition cursor-pointer"
                                  title="Hapus foto ini"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[10px] text-slate-500">
                      * Klik pada foto di atas untuk memilih foto yang ingin Anda sesuaikan posisi sudut atau tampilannya di bawah ini.
                    </p>

                    {/* ======================================================== */}
                    {/* PANEL PENYESUAIAN POSISI & SUDUT TAMPILAN FOTO SECARA MANUAL */}
                    {/* ======================================================== */}
                    {currentActivePhotoUrl && (
                      <div className="mt-3 pt-3 border-t border-slate-200/90 space-y-3 bg-white p-3.5 rounded-xl border">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Sliders className="w-4 h-4 text-brand-600" />
                            <span>Sesuaikan Posisi Foto #{selectedPhotoIndex + 1} {selectedPhotoIndex === 0 ? '(Sampul)' : ''}</span>
                          </label>

                          <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                            {currentFit === 'contain'
                              ? 'Mode Foto Utuh (Tanpa Potong)'
                              : `Posisi: ${currentPhotoPercent}% ${
                                  currentPhotoPercent >= 75
                                    ? '(Fokus Bawah / Orang)'
                                    : currentPhotoPercent <= 25
                                    ? '(Fokus Atas)'
                                    : '(Fokus Tengah)'
                                }`}
                          </span>
                        </div>

                        {/* Quick Presets Buttons */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              handleFitChange('cover');
                              handlePositionChange(85);
                            }}
                            className={`px-2.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                              currentFit !== 'contain' && currentPhotoPercent >= 75
                                ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span>👥 Fokus Orang (Bawah)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleFitChange('cover');
                              handlePositionChange(50);
                            }}
                            className={`px-2.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                              currentFit !== 'contain' && currentPhotoPercent > 25 && currentPhotoPercent < 75
                                ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span>🔘 Fokus Tengah</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleFitChange('cover');
                              handlePositionChange(15);
                            }}
                            className={`px-2.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                              currentFit !== 'contain' && currentPhotoPercent <= 25
                                ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span>⬆️ Fokus Atas</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleFitChange(currentFit === 'contain' ? 'cover' : 'contain')}
                            className={`px-2.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                              currentFit === 'contain'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                            title="Tampilkan seluruh foto tanpa terpotong sama sekali"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Tampilkan Utuh</span>
                          </button>
                        </div>

                        {/* Slider Vertikal Manual */}
                        {currentFit !== 'contain' && (
                          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <div className="flex justify-between items-center text-[10px] text-slate-600 font-semibold">
                              <span>⬆️ Atas (0%)</span>
                              <span className="text-brand-600 font-bold">Geser Manual: {currentPhotoPercent}%</span>
                              <span>⬇️ Bawah (100%)</span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              step={5}
                              value={currentPhotoPercent}
                              onChange={(e) => handlePositionChange(Number(e.target.value))}
                              className="w-full accent-brand-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                            />
                            <p className="text-[10px] text-slate-400 text-center">
                              💡 Geser ke arah kanan (80% - 100%) jika orang/warga berdiri di barisan bawah foto.
                            </p>
                          </div>
                        )}

                        {/* Live Banner Preview Box */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <Eye className="w-3 h-3 text-brand-600" />
                            <span>Pratinjau Hasil di Banner Depan:</span>
                          </span>

                          <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-slate-950 aspect-[2.1/1] w-full">
                            {currentFit === 'contain' ? (
                              <div className="relative w-full h-full flex items-center justify-center bg-black/90 overflow-hidden">
                                <img
                                  src={currentActivePhotoUrl}
                                  alt=""
                                  className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-40 scale-125"
                                />
                                <img
                                  src={currentActivePhotoUrl}
                                  alt=""
                                  className="relative z-1 max-w-full max-h-full object-contain"
                                />
                              </div>
                            ) : (
                              <img
                                src={currentActivePhotoUrl}
                                alt=""
                                style={{ objectPosition: `center ${currentPhotoPercent}%` }}
                                className="w-full h-full object-cover transition-all duration-200"
                              />
                            )}

                            {/* Banner Gradient Simulation Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-between p-3.5 pointer-events-none">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs border border-white/10">
                                  Pratinjau Banner Web
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-600 text-white shadow-xs">
                                  Foto #{selectedPhotoIndex + 1}
                                </span>
                              </div>
                              <div className="text-white">
                                <p className="text-xs font-bold drop-shadow-sm line-clamp-1">
                                  {editingSlide.title || 'Judul Kegiatan'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-1">
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
