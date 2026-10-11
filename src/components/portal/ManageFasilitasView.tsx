'use client';

import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  Droplets,
  MapPin,
  ExternalLink,
  Layers,
  X,
  Sparkles,
} from 'lucide-react';
import { FasilitasItem, SanitasiStats } from '@/data/landingContentData';

interface ManageFasilitasViewProps {
  fasilitas: FasilitasItem[];
  sanitasi: SanitasiStats;
  onSaveFasilitas: (updatedFasilitas: FasilitasItem[]) => Promise<void>;
  onSaveSanitasi: (updatedSanitasi: SanitasiStats) => Promise<void>;
  showToast: (msg: string) => void;
}

export default function ManageFasilitasView({
  fasilitas,
  sanitasi,
  onSaveFasilitas,
  onSaveSanitasi,
  showToast,
}: ManageFasilitasViewProps) {
  const [activeTab, setActiveTab] = useState<'fasilitas' | 'sanitasi'>('fasilitas');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sanitasi form state
  const [sanitasiForm, setSanitasiForm] = useState<SanitasiStats>({ ...sanitasi });
  const [isSavingSanitasi, setIsSavingSanitasi] = useState(false);

  // Fasilitas modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingItem, setEditingItem] = useState<FasilitasItem>({
    id: '',
    name: '',
    category: 'pemerintahan',
    categoryLabel: 'Pemerintahan',
    categoryColor: 'bg-[#cce5ff] text-[#006194]',
    jaga: 'Jaga 1',
    alamat: '',
    deskripsi: '',
    status: 'Aktif Operasional',
    gmapsUrl: '',
  });

  const categoryMap: Record<string, { label: string; color: string }> = {
    pemerintahan: { label: 'Pemerintahan & Kelembagaan', color: 'bg-[#cce5ff] text-[#006194]' },
    ibadah: { label: 'Sarana Ibadah', color: 'bg-[#d3e4fe] text-[#004b73]' },
    kesehatan: { label: 'Kesehatan & Olahraga', color: 'bg-[#6cf8bb]/40 text-[#005236]' },
    pendidikan: { label: 'Pendidikan & Sosial', color: 'bg-[#ffeed9] text-[#9c4300]' },
    infrastruktur: { label: 'Energi, Infrastruktur & Niaga', color: 'bg-[#e2e7ff] text-[#004b73]' },
    sanitasi_air: { label: 'Sanitasi & Sumber Daya Air', color: 'bg-[#d0f0fd] text-[#006194]' },
  };

  const filteredFasilitas = fasilitas.filter((item) => {
    const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jaga.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingItem({
      id: `fasilitas-${Date.now().toString(36)}`,
      name: '',
      category: 'pemerintahan',
      categoryLabel: categoryMap.pemerintahan.label,
      categoryColor: categoryMap.pemerintahan.color,
      jaga: 'Jaga 1',
      alamat: '',
      deskripsi: '',
      status: 'Aktif Operasional',
      gmapsUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FasilitasItem) => {
    setModalMode('edit');
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus data fasilitas "${name}"? Perubahan akan langsung tersinkron ke landing page publik.`)) {
      return;
    }
    const updated = fasilitas.filter((f) => f.id !== id);
    await onSaveFasilitas(updated);
    showToast(`Fasilitas "${name}" berhasil dihapus.`);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem.name.trim()) {
      alert('Nama fasilitas wajib diisi.');
      return;
    }

    const itemToSave: FasilitasItem = {
      ...editingItem,
      categoryLabel: categoryMap[editingItem.category]?.label || 'Umum',
      categoryColor: categoryMap[editingItem.category]?.color || 'bg-slate-100 text-slate-700',
    };

    let updated: FasilitasItem[];
    if (modalMode === 'add') {
      updated = [itemToSave, ...fasilitas];
    } else {
      updated = fasilitas.map((f) => (f.id === itemToSave.id ? itemToSave : f));
    }

    await onSaveFasilitas(updated);
    setIsModalOpen(false);
    showToast(
      modalMode === 'add'
        ? `Fasilitas "${itemToSave.name}" berhasil ditambahkan ke landing page!`
        : `Pembaruan data "${itemToSave.name}" berhasil disimpan!`
    );
  };

  const handleSaveSanitasiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSanitasi(true);
    try {
      await onSaveSanitasi(sanitasiForm);
      showToast('Data Sarana Sanitasi & Sumber Daya Air berhasil diperbarui!');
    } catch (err: any) {
      showToast(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSavingSanitasi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Tab Switcher */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('fasilitas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'fasilitas'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Daftar Fasilitas Publik ({fasilitas.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sanitasi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'sanitasi'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Sarana Sanitasi &amp; Sumber Air (4 Metrik)</span>
          </button>
        </div>

        {activeTab === 'fasilitas' && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Fasilitas Baru</span>
          </button>
        )}
      </div>

      {/* TAB 1: FASILITAS PUBLIK */}
      {activeTab === 'fasilitas' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'pemerintahan', label: 'Pemerintahan' },
                { id: 'ibadah', label: 'Ibadah' },
                { id: 'kesehatan', label: 'Kesehatan' },
                { id: 'pendidikan', label: 'Pendidikan' },
                { id: 'infrastruktur', label: 'Energi & Niaga' },
                { id: 'sanitasi_air', label: 'Sanitasi & Air' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryFilter(c.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer shrink-0 ${
                    categoryFilter === c.id
                      ? 'bg-brand-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama fasilitas / jaga..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Table of Facilities */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama Fasilitas</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Jaga / Wilayah</th>
                  <th className="py-3 px-3">Alamat</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredFasilitas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                      Tidak ada fasilitas yang sesuai dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredFasilitas.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.deskripsi}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.categoryColor}`}>
                          {item.categoryLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                        {item.jaga}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 max-w-xs truncate">
                        {item.alamat || '-'}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-600 transition cursor-pointer"
                            title="Edit Fasilitas"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition cursor-pointer"
                            title="Hapus Fasilitas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SARANA SANITASI & AIR (4 Metrik) */}
      {activeTab === 'sanitasi' && (
        <form onSubmit={handleSaveSanitasiSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Form Metrik Sarana Sanitasi &amp; Sumber Daya Air
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nilai metrik ini ditampilkan langsung pada banner statistik sanitasi di landing page.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSavingSanitasi}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingSanitasi ? 'Menyimpan...' : 'Simpan Pembaruan'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Mata Air Alami (Titik)</label>
              <input
                type="text"
                value={sanitasiForm.mataAir}
                onChange={(e) => setSanitasiForm({ ...sanitasiForm, mataAir: e.target.value })}
                placeholder="Contoh: 14 Titik"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Sumur Pompa &amp; Gali Warga (Unit)</label>
              <input
                type="text"
                value={sanitasiForm.sumurWarga}
                onChange={(e) => setSanitasiForm({ ...sanitasiForm, sumurWarga: e.target.value })}
                placeholder="Contoh: 380 Unit"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Sambungan Jaringan PDAM (Rumah)</label>
              <input
                type="text"
                value={sanitasiForm.pdam}
                onChange={(e) => setSanitasiForm({ ...sanitasiForm, pdam: e.target.value })}
                placeholder="Contoh: 160 Rumah"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Panjang Saluran Drainase (Meter)</label>
              <input
                type="text"
                value={sanitasiForm.drainase}
                onChange={(e) => setSanitasiForm({ ...sanitasiForm, drainase: e.target.value })}
                placeholder="Contoh: 3.200 Meter"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Status ODF Bebas BAB Sembarangan</label>
              <input
                type="text"
                value={sanitasiForm.statusOdf}
                onChange={(e) => setSanitasiForm({ ...sanitasiForm, statusOdf: e.target.value })}
                placeholder="Contoh: 100% ODF Bebas Buang Air Besar Sembarangan"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Status Akses Air Bersih Layak</label>
              <input
                type="text"
                value={sanitasiForm.statusAir}
                onChange={(e) => setSanitasiForm({ ...sanitasiForm, statusAir: e.target.value })}
                placeholder="Contoh: 100% Akses Air Bersih Layak"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>
          </div>
        </form>
      )}

      {/* MODAL: TAMBAH / EDIT FASILITAS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {modalMode === 'add' ? 'Tambah Fasilitas Publik Baru' : 'Edit Data Fasilitas Publik'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Kolongan Satu, Tomohon Tengah</p>
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
                <label className="text-xs font-bold text-slate-700">Nama Fasilitas</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Contoh: GMIM Elohim, LPKA Kelas II, Puskesmas Pembantu..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Kategori</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as FasilitasItem['category'],
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold cursor-pointer"
                  >
                    <option value="pemerintahan">Pemerintahan &amp; Kelembagaan</option>
                    <option value="ibadah">Sarana Ibadah</option>
                    <option value="kesehatan">Kesehatan &amp; Olahraga</option>
                    <option value="pendidikan">Pendidikan &amp; Sosial</option>
                    <option value="infrastruktur">Energi, Infrastruktur &amp; Niaga</option>
                    <option value="sanitasi_air">Sanitasi &amp; Sumber Air</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Wilayah Jaga / Lokasi</label>
                  <input
                    type="text"
                    value={editingItem.jaga}
                    onChange={(e) => setEditingItem({ ...editingItem, jaga: e.target.value })}
                    placeholder="Contoh: Jaga 2, Koridor Jaga 1 s/d 5..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Alamat Lengkap</label>
                <input
                  type="text"
                  value={editingItem.alamat}
                  onChange={(e) => setEditingItem({ ...editingItem, alamat: e.target.value })}
                  placeholder="Contoh: Jl. Zanosui, Lingkungan II, Kolongan Satu"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Status Operasional</label>
                  <input
                    type="text"
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    placeholder="Contoh: Aktif Operasional, Permanen..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Link Google Maps (Opsional)</label>
                  <input
                    type="url"
                    value={editingItem.gmapsUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, gmapsUrl: e.target.value })}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={editingItem.deskripsi}
                  onChange={(e) => setEditingItem({ ...editingItem, deskripsi: e.target.value })}
                  placeholder="Tuliskan keterangan fungsi atau pelayanan fasilitas..."
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
                  <span>Simpan Fasilitas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
