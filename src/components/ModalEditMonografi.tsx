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
  Plus,
  Trash2,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ModalEditMonografiProps {
  isOpen: boolean;
  onClose: () => void;
  item: MonografiItem;
  availableYears?: number[];
  onSave: (updatedItem: MonografiItem) => Promise<void> | void;
}

export default function ModalEditMonografi({
  isOpen,
  onClose,
  item,
  availableYears = [2024, 2025],
  onSave,
}: ModalEditMonografiProps) {
  // Form states
  const [title, setTitle] = useState(item.title);
  const [year, setYear] = useState(item.year);
  const [palaName, setPalaName] = useState(item.palaName || '');
  const [kasieName, setKasieName] = useState(item.kasieName || '');
  
  // Demografi & Gender auto-calc
  const [pria, setPria] = useState<number>(item.metrics.pria || 0);
  const [wanita, setWanita] = useState<number>(item.metrics.wanita || 0);
  const [totalWarga, setTotalWarga] = useState<number>(
    item.metrics.totalWarga || (item.metrics.pria || 0) + (item.metrics.wanita || 0)
  );
  const [kepalaKeluarga, setKepalaKeluarga] = useState<number>(item.metrics.kepalaKeluarga || 0);

  // Custom metrics for specific modules (Lahan, Ternak, dsb)
  const [customMetrics, setCustomMetrics] = useState<
    { label: string; value: string | number }[]
  >(item.metrics.customMetrics || []);

  const [description, setDescription] = useState(item.description);
  const [detailedNotesText, setDetailedNotesText] = useState(
    item.detailedNotes ? item.detailedNotes.join('\n') : ''
  );
  const [statusTahapan, setStatusTahapan] = useState<MonografiItem['statusTahapan']>(
    item.statusTahapan || 'draft'
  );

  // Status states
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state when item changes
  useEffect(() => {
    setTitle(item.title);
    setYear(item.year);
    setPalaName(item.palaName || '');
    setKasieName(item.kasieName || '');
    
    const initialPria = item.metrics.pria || 0;
    const initialWanita = item.metrics.wanita || 0;
    setPria(initialPria);
    setWanita(initialWanita);
    setTotalWarga(item.metrics.totalWarga || initialPria + initialWanita);
    setKepalaKeluarga(item.metrics.kepalaKeluarga || 0);

    setCustomMetrics(item.metrics.customMetrics ? [...item.metrics.customMetrics] : []);
    setDescription(item.description);
    setDetailedNotesText(item.detailedNotes ? item.detailedNotes.join('\n') : '');
    setStatusTahapan(item.statusTahapan || 'draft');
    setErrorMsg(null);
  }, [item]);

  // Auto-calculate Total Jiwa when Pria or Wanita changes
  const handlePriaChange = (val: number) => {
    const p = Math.max(0, val);
    setPria(p);
    setTotalWarga(p + wanita);
  };

  const handleWanitaChange = (val: number) => {
    const w = Math.max(0, val);
    setWanita(w);
    setTotalWarga(pria + w);
  };

  const handleAddCustomMetric = () => {
    setCustomMetrics((prev) => [...prev, { label: 'Indikator Baru', value: '0' }]);
  };

  const handleUpdateCustomMetric = (index: number, field: 'label' | 'value', val: string) => {
    setCustomMetrics((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleRemoveCustomMetric = (index: number) => {
    setCustomMetrics((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    try {
      // Basic validation
      if (!title.trim()) {
        throw new Error('Nama modul wajib diisi.');
      }

      const splitNotes = detailedNotesText
        .split('\n')
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      const calculatedTotal = pria + wanita > 0 ? pria + wanita : totalWarga;

      const updated: MonografiItem = {
        ...item,
        title: title.trim(),
        year: Number(year),
        palaName: palaName.trim() || undefined,
        kasieName: kasieName.trim() || 'Aparatur Kelurahan',
        description: description.trim(),
        detailedNotes: splitNotes,
        statusTahapan: statusTahapan,
        badgeLabel:
          statusTahapan === 'disahkan_lurah'
            ? 'Disahkan Lurah (Publikasi Sah)'
            : statusTahapan === 'diverifikasi_seklur'
            ? 'Diverifikasi Seklur'
            : 'Draf Masukan (Menunggu Verifikasi)',
        statsValue:
          calculatedTotal > 0
            ? `${calculatedTotal.toLocaleString('id-ID')} Jiwa • ${kepalaKeluarga} KK`
            : item.statsValue,
        metrics: {
          ...item.metrics,
          totalWarga: calculatedTotal,
          kepalaKeluarga: Number(kepalaKeluarga),
          pria: Number(pria),
          wanita: Number(wanita),
          customMetrics: customMetrics.length > 0 ? customMetrics : undefined,
        },
        lastUpdated: `${new Date().toLocaleDateString('id-ID')} - Pembaruan Operator CMS`,
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

  // Determine if module has demography aspect
  const hasDemography =
    item.categoryKey === 'wilayah' ||
    item.categoryKey === 'kependudukan' ||
    totalWarga > 0 ||
    pria > 0 ||
    wanita > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[94vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#dae2fd]">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-[#dae2fd] bg-gradient-to-r from-primary to-[#004d77] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Input &amp; Edit Data Monografi</h2>
              <p className="text-xs text-sky-100">
                Pembaruan data faktual: <strong>{item.title}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#faf8ff]">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. IDENTITAS & PEJABAT */}
          <div className="bg-white p-5 rounded-2xl border border-[#dae2fd] shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Identitas Modul &amp; Penanggung Jawab</span>
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
                  Tahun Periode Monografi *
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      Tahun {yr} {yr === 2024 ? '(Arsip Faktual)' : yr === 2025 ? '(Terbaru)' : '(Periode Baru)'}
                    </option>
                  ))}
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
                  placeholder="Contoh: Jilly Turambi / Robert Goni"
                  className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">
                  Penanggung Jawab (Kasie / Staf) *
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

          {/* 2. STATISTIK KEPENDUDUKAN (JIKA RELEVAN) */}
          {hasDemography && (
            <div className="bg-white p-5 rounded-2xl border border-[#dae2fd] shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>Demografi &amp; Gender (Validasi Otomatis)</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006c49] bg-[#6cf8bb]/30 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  <span>Otomatis: Total = Pria + Wanita</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#535f70] mb-1">
                    Laki-Laki (Jiwa)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={pria}
                    onChange={(e) => handlePriaChange(Number(e.target.value))}
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
                    onChange={(e) => handleWanitaChange(Number(e.target.value))}
                    className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-sm font-black text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#006194] mb-1">
                    Total Penduduk (Jiwa) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={totalWarga}
                    onChange={(e) => setTotalWarga(Number(e.target.value))}
                    className="w-full bg-[#cce5ff]/50 border border-[#006194]/40 rounded-xl px-3 py-2 text-sm font-black text-[#006194] focus:outline-none focus:ring-2 focus:ring-primary font-mono"
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
              </div>
            </div>
          )}

          {/* 3. INDIKATOR KHUSUS / METRIK TAMBAHAN (LAHAN, TERNAK, FASILITAS, DLL) */}
          <div className="bg-white p-5 rounded-2xl border border-[#dae2fd] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Indikator Khusus / Lapangan ({customMetrics.length})</span>
              </div>
              <button
                type="button"
                onClick={handleAddCustomMetric}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#f2f3ff] hover:bg-[#e2e7ff] text-primary text-xs font-bold rounded-full transition cursor-pointer border border-[#dae2fd]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Indikator</span>
              </button>
            </div>

            {customMetrics.length === 0 ? (
              <p className="text-xs text-[#707881] italic">
                Belum ada indikator tambahan khusus. Klik &quot;Tambah Indikator&quot; jika ingin mencatat variabel seperti luas lahan, jumlah ternak, atau sarana umum.
              </p>
            ) : (
              <div className="space-y-2.5">
                {customMetrics.map((cm, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#faf8ff] p-2.5 rounded-xl border border-[#dae2fd]">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Nama Indikator (misal: Luas Pemukiman)"
                        value={cm.label}
                        onChange={(e) => handleUpdateCustomMetric(idx, 'label', e.target.value)}
                        className="w-full bg-white border border-[#dae2fd] rounded-lg px-2.5 py-1 text-xs text-[#131b2e] font-semibold"
                      />
                    </div>
                    <div className="w-36">
                      <input
                        type="text"
                        placeholder="Nilai (misal: 34.50 Ha)"
                        value={cm.value}
                        onChange={(e) => handleUpdateCustomMetric(idx, 'value', e.target.value)}
                        className="w-full bg-white border border-[#dae2fd] rounded-lg px-2.5 py-1 text-xs text-[#131b2e] font-mono font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomMetric(idx)}
                      className="p-1 text-rose-500 hover:text-rose-700 transition"
                      title="Hapus indikator"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. NARASI & CATATAN LAPANGAN */}
          <div className="bg-white p-5 rounded-2xl border border-[#dae2fd] shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
              Deskripsi Profil &amp; Catatan Register Lapangan
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#131b2e] mb-1">
                Uraian Ringkasan
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan gambaran umum dan kondisi wilayah/modul ini..."
                className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl p-3 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#131b2e] mb-1">
                Poin Rincian Catatan Lapangan (Satu catatan per baris)
              </label>
              <textarea
                rows={3}
                value={detailedNotesText}
                onChange={(e) => setDetailedNotesText(e.target.value)}
                placeholder="Tulis setiap poin catatan pada baris baru..."
                className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl p-3 text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed font-mono"
              />
            </div>
          </div>

          {/* 5. STATUS TAHAPAN PENGESAHAN */}
          <div className="bg-white p-5 rounded-2xl border border-[#dae2fd] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-bold text-[#131b2e]">
                Status Validasi Data
              </label>
              <p className="text-[11px] text-[#535f70]">
                Tentukan tahapan validasi dokumen pemerintahan
              </p>
            </div>

            <select
              value={statusTahapan}
              onChange={(e) => setStatusTahapan(e.target.value as any)}
              className="bg-[#f2f3ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-xs font-bold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="draft">Draf Masukan (Menunggu Verifikasi)</option>
              <option value="diverifikasi_seklur">Diverifikasi Seklur</option>
              <option value="disahkan_lurah">Disahkan Lurah (Publikasi Sah)</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-full border border-[#dae2fd] bg-white text-[#535f70] hover:text-[#131b2e] hover:bg-[#f2f3ff] text-xs font-bold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-primary hover:bg-[#004d77] text-white text-xs font-bold shadow-md transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan Perubahan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Data Monografi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
