'use client';
import React, { useState, useEffect } from 'react';
import { MonografiItem } from '@/data/monografiData';
import {
  FileEdit,
  X,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Users,
  MapPin,
  FileText
} from 'lucide-react';

interface ModalEditMonografiProps {
  isOpen: boolean;
  onClose: () => void;
  item: MonografiItem;
  onSave: (updatedItem: MonografiItem) => Promise<void> | void;
}

export default function ModalEditMonografi({
  isOpen,
  onClose,
  item,
  onSave,
}: ModalEditMonografiProps) {
  // Form states
  const [title, setTitle] = useState(item.title);
  const [year, setYear] = useState(item.year);
  const [palaName, setPalaName] = useState(item.palaName || '');
  const [kasieName, setKasieName] = useState(item.kasieName || '');
  const [totalWarga, setTotalWarga] = useState<number>(item.metrics.totalWarga || 0);
  const [kepalaKeluarga, setKepalaKeluarga] = useState<number>(item.metrics.kepalaKeluarga || 0);
  const [pria, setPria] = useState<number>(item.metrics.pria || 0);
  const [wanita, setWanita] = useState<number>(item.metrics.wanita || 0);
  const [description, setDescription] = useState(item.description);
  const [detailedNotesText, setDetailedNotesText] = useState(
    item.detailedNotes ? item.detailedNotes.join('\n') : ''
  );
  const [resetToDraft, setResetToDraft] = useState(true);

  // Status states
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state when item changes
  useEffect(() => {
    setTitle(item.title);
    setYear(item.year);
    setPalaName(item.palaName || '');
    setKasieName(item.kasieName || '');
    setTotalWarga(item.metrics.totalWarga || 0);
    setKepalaKeluarga(item.metrics.kepalaKeluarga || 0);
    setPria(item.metrics.pria || 0);
    setWanita(item.metrics.wanita || 0);
    setDescription(item.description);
    setDetailedNotesText(item.detailedNotes ? item.detailedNotes.join('\n') : '');
    setResetToDraft(true);
    setErrorMsg(null);
  }, [item]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    try {
      const splitNotes = detailedNotesText
        .split('\n')
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      const updated: MonografiItem = {
        ...item,
        title,
        year: Number(year),
        palaName: palaName || undefined,
        kasieName,
        description,
        detailedNotes: splitNotes,
        statusTahapan: resetToDraft ? 'draft' : item.statusTahapan,
        badgeLabel: resetToDraft ? 'Draf Masukan (Menunggu Verifikasi)' : item.badgeLabel,
        statsValue: totalWarga > 0 ? `${totalWarga.toLocaleString()} Jiwa • ${kepalaKeluarga} KK` : item.statsValue,
        metrics: {
          ...item.metrics,
          totalWarga: Number(totalWarga),
          kepalaKeluarga: Number(kepalaKeluarga),
          pria: Number(pria),
          wanita: Number(wanita),
        },
        lastUpdated: `${new Date().toLocaleDateString('id-ID')} - Pembaruan Operator`,
      };

      await onSave(updated);
      onClose();
    } catch (err: any) {
      console.error('Error saving monografi item:', err);
      setErrorMsg(err.message || 'Gagal menyimpan perubahan monografi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#dae2fd]">
        {/* Header */}
        <div className="p-5 border-b border-[#dae2fd] bg-gradient-to-r from-primary to-[#004d77] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Edit Data Monografi</h2>
              <p className="text-xs text-sky-100">
                Pembaruan data faktual modul: <strong>{item.title}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 bg-[#faf8ff]">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. INFORMASI POKOK */}
          <div className="bg-white p-5 rounded-2xl border border-[#dae2fd] shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Identitas & Pejabat Penanggung Jawab</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">
                  Nama Modul / Wilayah *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">
                  Tahun Data Monografi *
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                >
                  <option value={2024}>Tahun 2024 (Data Faktual)</option>
                  <option value={2026}>Tahun 2026 (Berjalan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">
                  Kepala Lingkungan (Pala)
                </label>
                <input
                  type="text"
                  value={palaName}
                  onChange={(e) => setPalaName(e.target.value)}
                  placeholder="Contoh: Meky Mario Turangan / Ricky Trie"
                  className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">
                  Penanggung Jawab (Kasie) *
                </label>
                <input
                  type="text"
                  required
                  value={kasieName}
                  onChange={(e) => setKasieName(e.target.value)}
                  placeholder="Contoh: Djonny Maweikere, S.IP"
                  className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* 2. STATISTIK KEPENDUDUKAN & ANGKATAN */}
          <div className="bg-white p-5 rounded-2xl border border-[#dae2fd] shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Statistik Kependudukan Faktual</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#535f70] mb-1">
                  Total Penduduk (Jiwa)
                </label>
                <input
                  type="number"
                  min={0}
                  value={totalWarga}
                  onChange={(e) => setTotalWarga(Number(e.target.value))}
                  className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-sm font-black text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#535f70] mb-1">
                  Kepala Keluarga (KK)
                </label>
                <input
                  type="number"
                  min={0}
                  value={kepalaKeluarga}
                  onChange={(e) => setKepalaKeluarga(Number(e.target.value))}
                  className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-sm font-black text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#535f70] mb-1">
                  Laki-Laki (Jiwa)
                </label>
                <input
                  type="number"
                  min={0}
                  value={pria}
                  onChange={(e) => setPria(Number(e.target.value))}
                  className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-sm font-black text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#535f70] mb-1">
                  Perempuan (Jiwa)
                </label>
                <input
                  type="number"
                  min={0}
                  value={wanita}
                  onChange={(e) => setWanita(Number(e.target.value))}
                  className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-sm font-black text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>
            </div>
            <p className="text-[10px] text-[#707881]">
              * Angka statistik ini akan otomatis diperbarui pada papan feed portal dan kartu detail.
            </p>
          </div>

          {/* 3. DESKRIPSI & RINGKASAN PROFIL */}
          <div className="bg-white p-5 rounded-2xl border border-[#dae2fd] shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Ringkasan & Catatan Lapangan</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#131b2e] mb-1">
                Ringkasan & Profil Wilayah *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl p-3 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                placeholder="Uraikan karakteristik pemukiman, aktivitas ekonomi, dan kondisi lapangan..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#131b2e] mb-1">
                Poin-Poin Penting / Batas Wilayah (Satu poin per baris)
              </label>
              <textarea
                rows={4}
                value={detailedNotesText}
                onChange={(e) => setDetailedNotesText(e.target.value)}
                className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl p-3 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary font-mono leading-relaxed"
                placeholder="Batas Wilayah: Sebelah Timur berbatasan dengan...&#10;Kondisi Pos Kamling aktif...&#10;Fasilitas air bersih menjangkau 100% warga..."
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
              <input
                type="checkbox"
                id="resetDraft"
                checked={resetToDraft}
                onChange={(e) => setResetToDraft(e.target.checked)}
                className="rounded border-[#dae2fd] text-primary focus:ring-primary"
              />
              <label htmlFor="resetDraft" className="text-xs text-[#3f4850] font-medium cursor-pointer">
                Reset status modul ke <strong>Draf Masukan</strong> untuk diverifikasi Seklur & disahkan Lurah.
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-[#dae2fd]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#535f70] hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-[#004d77] text-white shadow-md shadow-primary/20 transition flex items-center space-x-2 disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan ke Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan Data</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
