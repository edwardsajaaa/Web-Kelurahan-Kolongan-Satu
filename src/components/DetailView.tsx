'use client';

import React, { useState, useEffect } from 'react';
import { MonografiItem } from '@/data/monografiData';
import { Official } from '@/data/officialsData';
import {
  MapPin,
  CheckCircle2,
  Clock,
  FileEdit,
  Download,
  BarChart3,
  PieChart,
  Send,
  Check,
  Award,
  Save,
  Loader2,
  Plus,
  Trash2,
  Eye,
  AlertCircle,
  Users,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface DetailViewProps {
  item: MonografiItem;
  currentOfficial: Official;
  onSaveItem?: (updatedItem: MonografiItem) => Promise<void> | void;
  onApproveItem?: (id: string) => void;
  onVerifySeklur?: (id: string) => void;
  onOpenLetterModal: () => void;
  onOpenReportModal: () => void;
  onOpenPrintPreview: (item: MonografiItem) => void;
  onTriggerWhatsApp: (item: MonografiItem) => void;
}

export default function DetailView({
  item,
  currentOfficial,
  onSaveItem,
  onApproveItem,
  onVerifySeklur,
  onOpenLetterModal,
  onOpenReportModal,
  onOpenPrintPreview,
  onTriggerWhatsApp,
}: DetailViewProps) {
  const isLurah = currentOfficial.roleCode === 'superadmin';
  const isSeklur = currentOfficial.roleCode === 'admin_seklur';

  // Mode: 'form' (Form Input Langsung) atau 'preview' (Pratinjau Grafik & Tampilan)
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Local form state initialized from selected item
  const [title, setTitle] = useState(item.title);
  const [year, setYear] = useState(item.year);
  const [palaName, setPalaName] = useState(item.palaName || '');
  const [kasieName, setKasieName] = useState(item.kasieName || '');

  // Demografi Metrics
  const [pria, setPria] = useState<number>(item.metrics.pria || 0);
  const [wanita, setWanita] = useState<number>(item.metrics.wanita || 0);
  const [totalWarga, setTotalWarga] = useState<number>(
    item.metrics.totalWarga || (item.metrics.pria || 0) + (item.metrics.wanita || 0)
  );
  const [kepalaKeluarga, setKepalaKeluarga] = useState<number>(item.metrics.kepalaKeluarga || 0);

  // Custom Metrics (Luas Lahan, Ternak, dsb)
  const [customMetrics, setCustomMetrics] = useState<{ label: string; value: string | number }[]>(
    item.metrics.customMetrics ? [...item.metrics.customMetrics] : []
  );

  const [description, setDescription] = useState(item.description);
  const [detailedNotesText, setDetailedNotesText] = useState(
    item.detailedNotes ? item.detailedNotes.join('\n') : ''
  );
  const [statusTahapan, setStatusTahapan] = useState<MonografiItem['statusTahapan']>(
    item.statusTahapan || 'draft'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Reset form whenever active item changes
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
    setSaveSuccessMsg(null);
  }, [item]);

  // Auto-calc Total Warga saat Pria / Wanita berubah
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

  // Custom Metric handlers
  const handleAddCustomMetric = () => {
    setCustomMetrics((prev) => [...prev, { label: 'Indikator Baru', value: '0' }]);
  };

  const handleCustomMetricChange = (index: number, field: 'label' | 'value', val: string) => {
    setCustomMetrics((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleRemoveCustomMetric = (index: number) => {
    setCustomMetrics((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit & Save directly
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!onSaveItem) return;

    setIsSaving(true);
    setSaveSuccessMsg(null);

    const notesArray = detailedNotesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedItem: MonografiItem = {
      ...item,
      title: title.trim() || item.title,
      year,
      palaName: palaName.trim() || undefined,
      kasieName: kasieName.trim() || item.kasieName,
      description: description.trim() || item.description,
      detailedNotes: notesArray.length > 0 ? notesArray : item.detailedNotes,
      statusTahapan,
      lastUpdated: `${new Date().toLocaleDateString('id-ID')} - Diperbarui via Portal Staf`,
      statsValue:
        totalWarga > 0
          ? `${totalWarga.toLocaleString('id-ID')} Jiwa • ${kepalaKeluarga.toLocaleString('id-ID')} KK`
          : customMetrics.length > 0
          ? `${customMetrics[0].value} ${customMetrics[0].label}`
          : item.statsValue,
      metrics: {
        ...item.metrics,
        pria: pria > 0 ? pria : undefined,
        wanita: wanita > 0 ? wanita : undefined,
        totalWarga: totalWarga > 0 ? totalWarga : undefined,
        kepalaKeluarga: kepalaKeluarga > 0 ? kepalaKeluarga : undefined,
        customMetrics: customMetrics.length > 0 ? customMetrics : undefined,
      },
    };

    try {
      await onSaveItem(updatedItem);
      setSaveSuccessMsg(`Data modul '${updatedItem.title}' berhasil disimpan & langsung tampil di Landing Page!`);
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const hasDemographyFields = item.metrics.totalWarga !== undefined || item.categoryKey === 'wilayah' || item.categoryKey === 'kependudukan';

  return (
    <main className="flex-1 bg-[#faf8ff] h-full overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between select-text">
      <div className="space-y-6 max-w-4xl mx-auto w-full pb-12">

        {/* 1. HEADER MODUL & AKSI UTAMA */}
        <div className="bg-white p-5 rounded-3xl border border-[#dae2fd] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#535f70] text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#006194] flex-shrink-0" />
              <span>Kecamatan Tomohon Tengah • Kelurahan Kolongan Satu</span>
              <span className="text-[#dae2fd]">•</span>
              <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#006194] font-bold text-[11px]">
                Tahun {item.year}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#131b2e] tracking-tight">
              {item.title}
            </h1>
            <p className="text-xs text-[#535f70]">
              Area input data resmi untuk ditampilkan langsung ke publik pada Landing Page.
            </p>
          </div>

          {/* Tab Switcher & Quick Save */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="inline-flex p-1 bg-[#f2f3ff] rounded-2xl border border-[#dae2fd]">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-[#006194] text-white shadow-xs'
                    : 'text-[#535f70] hover:text-[#131b2e]'
                }`}
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Formulir Input</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-[#006194] text-white shadow-xs'
                    : 'text-[#535f70] hover:text-[#131b2e]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau Grafik</span>
              </button>
            </div>

            <button
              onClick={() => handleSave()}
              disabled={isSaving}
              type="button"
              className="px-4 py-2 bg-[#006194] hover:bg-[#004f7a] disabled:bg-slate-400 text-white rounded-2xl text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan ke Landing Page</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="flex-1 font-semibold">{saveSuccessMsg}</div>
          </div>
        )}

        {/* 2. FORMULIR INPUT LANGSUNG (DEFAULT ACTIVE) */}
        {activeTab === 'form' ? (
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Bagian A: Data Pokok Angka (Demografi / Wilayah Jaga) */}
            <div className="bg-white p-6 rounded-3xl border border-[#dae2fd] shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#e2e7ff] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#e2e7ff] text-[#006194] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#131b2e]">
                      {hasDemographyFields ? 'Input Data Kependudukan & KK' : 'Indikator & Angka Kunci'}
                    </h3>
                    <p className="text-[11px] text-[#535f70]">
                      Nilai angka ini langsung mengalir ke kalkulasi grafik dan metrik landing page.
                    </p>
                  </div>
                </div>

                <span className="text-[11px] text-[#006194] bg-[#f2f3ff] px-2.5 py-1 rounded-full font-bold">
                  {statusTahapan === 'disahkan_lurah'
                    ? 'Disahkan Lurah'
                    : statusTahapan === 'diverifikasi_seklur'
                    ? 'Paraf Seklur'
                    : 'Draf Masukan'}
                </span>
              </div>

              {hasDemographyFields ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Penduduk */}
                  <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#e2e7ff] space-y-1">
                    <label className="text-[11px] font-bold text-[#535f70] block">
                      Total Penduduk (Jiwa)
                    </label>
                    <input
                      type="number"
                      value={totalWarga}
                      onChange={(e) => setTotalWarga(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-lg font-black text-[#131b2e] bg-white border border-[#dae2fd] rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#006194] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#71787e] block">Otomatis dihitung (Pria + Wanita)</span>
                  </div>

                  {/* Kepala Keluarga */}
                  <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#e2e7ff] space-y-1">
                    <label className="text-[11px] font-bold text-[#535f70] block">
                      Kepala Keluarga (KK)
                    </label>
                    <input
                      type="number"
                      value={kepalaKeluarga}
                      onChange={(e) => setKepalaKeluarga(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-lg font-black text-[#131b2e] bg-white border border-[#dae2fd] rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#006194] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#71787e] block">Buku Register Kepala Keluarga</span>
                  </div>

                  {/* Laki-Laki */}
                  <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#e2e7ff] space-y-1">
                    <label className="text-[11px] font-bold text-[#535f70] block">
                      Laki-Laki (Jiwa)
                    </label>
                    <input
                      type="number"
                      value={pria}
                      onChange={(e) => handlePriaChange(parseInt(e.target.value) || 0)}
                      className="w-full text-lg font-black text-[#006194] bg-white border border-[#dae2fd] rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#006194] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#71787e] block">Warga jenis kelamin pria</span>
                  </div>

                  {/* Perempuan */}
                  <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#e2e7ff] space-y-1">
                    <label className="text-[11px] font-bold text-[#535f70] block">
                      Perempuan (Jiwa)
                    </label>
                    <input
                      type="number"
                      value={wanita}
                      onChange={(e) => handleWanitaChange(parseInt(e.target.value) || 0)}
                      className="w-full text-lg font-black text-rose-600 bg-white border border-[#dae2fd] rounded-xl px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-[#71787e] block">Warga jenis kelamin perempuan</span>
                  </div>
                </div>
              ) : null}

              {/* Indikator Tambahan / Custom Metrics (Luas Lahan, Ternak, Air, Sarana) */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#006194]" />
                    <span>Rincian Indikator Variabel (Luas Lahan, Ternak, dsb):</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCustomMetric}
                    className="text-xs font-bold text-[#006194] hover:text-[#004f7a] bg-[#f2f3ff] hover:bg-[#e2e7ff] px-3 py-1.5 rounded-xl border border-[#dae2fd] flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Baris Indikator</span>
                  </button>
                </div>

                {customMetrics.length === 0 ? (
                  <p className="text-xs text-[#71787e] italic p-3 bg-[#faf8ff] rounded-2xl border border-dashed border-[#dae2fd]">
                    Belum ada baris indikator khusus. Klik tombol "Tambah Baris Indikator" di atas untuk menambahkan variabel seperti luas lahan, ternak, dsb.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {customMetrics.map((cm, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2.5 bg-[#faf8ff] rounded-2xl border border-[#e2e7ff]"
                      >
                        <input
                          type="text"
                          value={cm.label}
                          onChange={(e) => handleCustomMetricChange(idx, 'label', e.target.value)}
                          placeholder="Nama Variabel (misal: Sawah, Babi, Air PDAM)"
                          className="flex-1 text-xs font-semibold text-[#131b2e] bg-white border border-[#dae2fd] rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#006194] focus:outline-none"
                        />
                        <input
                          type="text"
                          value={cm.value}
                          onChange={(e) => handleCustomMetricChange(idx, 'value', e.target.value)}
                          placeholder="Nilai (misal: 34,50 Ha, 510 Ekor)"
                          className="w-36 sm:w-48 text-xs font-bold text-[#006194] bg-white border border-[#dae2fd] rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#006194] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomMetric(idx)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                          title="Hapus baris"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bagian B: Aparatur Penanggung Jawab Lapangan */}
            <div className="bg-white p-6 rounded-3xl border border-[#dae2fd] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#131b2e] border-b border-[#e2e7ff] pb-2">
                Aparatur &amp; Penanggung Jawab Data
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {item.categoryKey === 'wilayah' || item.palaName !== undefined ? (
                  <div>
                    <label className="text-xs font-bold text-[#3f4850] block mb-1">
                      Kepala Lingkungan (Pala)
                    </label>
                    <input
                      type="text"
                      value={palaName}
                      onChange={(e) => setPalaName(e.target.value)}
                      placeholder="Nama Kepala Lingkungan (Pala)"
                      className="w-full text-xs font-semibold text-[#131b2e] bg-[#faf8ff] border border-[#dae2fd] rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#006194] focus:outline-none"
                    />
                  </div>
                ) : null}

                <div>
                  <label className="text-xs font-bold text-[#3f4850] block mb-1">
                    Kasie / Penanggung Jawab Data Kelurahan
                  </label>
                  <input
                    type="text"
                    value={kasieName}
                    onChange={(e) => setKasieName(e.target.value)}
                    placeholder="Contoh: Djonny Maweikere, S.IP (Kasie Pem & Trantib)"
                    className="w-full text-xs font-semibold text-[#131b2e] bg-[#faf8ff] border border-[#dae2fd] rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#006194] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bagian C: Deskripsi & Catatan Lapangan */}
            <div className="bg-white p-6 rounded-3xl border border-[#dae2fd] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#131b2e] border-b border-[#e2e7ff] pb-2">
                Deskripsi &amp; Catatan Rinci Monografi
              </h3>

              <div>
                <label className="text-xs font-bold text-[#3f4850] block mb-1">
                  Ringkasan Narasi Profil
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tuliskan uraian ringkasan perkembangan data monografi..."
                  className="w-full text-xs text-[#131b2e] bg-[#faf8ff] border border-[#dae2fd] rounded-xl p-3 focus:ring-2 focus:ring-[#006194] focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#3f4850] block mb-1">
                  Poin-Poin Rincian Catatan Lapangan (Satu catatan per baris)
                </label>
                <textarea
                  rows={4}
                  value={detailedNotesText}
                  onChange={(e) => setDetailedNotesText(e.target.value)}
                  placeholder="Tuliskan catatan rinci per baris (akan otomatis dijadikan daftar poin)..."
                  className="w-full text-xs text-[#131b2e] bg-[#faf8ff] border border-[#dae2fd] rounded-xl p-3 focus:ring-2 focus:ring-[#006194] focus:outline-none leading-relaxed font-mono"
                />
              </div>
            </div>

            {/* Bagian D: Tahapan Validasi & Simpan */}
            <div className="bg-white p-6 rounded-3xl border border-[#dae2fd] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <ShieldCheck className="w-5 h-5 text-[#006194] shrink-0" />
                <div className="text-xs">
                  <label className="font-bold text-[#131b2e] block">Status Validasi:</label>
                  <select
                    value={statusTahapan}
                    onChange={(e) => setStatusTahapan(e.target.value as any)}
                    className="mt-1 text-xs font-bold text-[#006194] bg-[#f2f3ff] border border-[#dae2fd] rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
                  >
                    <option value="draft">Draf Masukan (Staf/Pala)</option>
                    <option value="diverifikasi_seklur">Diverifikasi &amp; Paraf Seklur</option>
                    <option value="disahkan_lurah">Disahkan &amp; Diterbitkan Lurah (Publik)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    // Reset to original
                    setTitle(item.title);
                    setPria(item.metrics.pria || 0);
                    setWanita(item.metrics.wanita || 0);
                    setTotalWarga(item.metrics.totalWarga || 0);
                    setKepalaKeluarga(item.metrics.kepalaKeluarga || 0);
                    setDescription(item.description);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#535f70] hover:text-[#131b2e] bg-[#f2f3ff] rounded-2xl transition cursor-pointer"
                >
                  Batal / Reset
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#006194] hover:bg-[#004f7a] disabled:bg-slate-400 text-white rounded-2xl text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Sistem...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan &amp; Publikasikan ke Landing Page</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        ) : (
          /* 3. PRATINJAU GRAFIK & TAMPILAN RESMI (TAB PREVIEW) */
          <div className="space-y-6">
            {/* Metrik Utama (4 Blok Angka) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {item.metrics.totalWarga ? (
                <>
                  <div className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs">
                    <p className="text-[10px] font-bold text-[#707881] uppercase tracking-wider">Total Penduduk</p>
                    <p className="text-2xl font-black text-[#131b2e] mt-1">
                      {item.metrics.totalWarga.toLocaleString()} <span className="text-xs font-semibold text-[#535f70]">Jiwa</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs">
                    <p className="text-[10px] font-bold text-[#707881] uppercase tracking-wider">Kepala Keluarga</p>
                    <p className="text-2xl font-black text-[#131b2e] mt-1">
                      {item.metrics.kepalaKeluarga?.toLocaleString()} <span className="text-xs font-semibold text-[#535f70]">KK</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs">
                    <p className="text-[10px] font-bold text-[#707881] uppercase tracking-wider">Laki-Laki</p>
                    <p className="text-2xl font-black text-[#006194] mt-1">
                      {item.metrics.pria?.toLocaleString()} <span className="text-xs font-semibold text-[#535f70]">Jiwa</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs">
                    <p className="text-[10px] font-bold text-[#707881] uppercase tracking-wider">Perempuan</p>
                    <p className="text-2xl font-black text-rose-600 mt-1">
                      {item.metrics.wanita?.toLocaleString()} <span className="text-xs font-semibold text-[#535f70]">Jiwa</span>
                    </p>
                  </div>
                </>
              ) : (
                item.metrics.customMetrics?.map((cm, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-[#dae2fd] shadow-xs">
                    <p className="text-[10px] font-bold text-[#707881] uppercase tracking-wider">{cm.label}</p>
                    <p className="text-xl font-black text-[#131b2e] mt-1">{cm.value}</p>
                  </div>
                ))
              )}
            </div>

            {/* Visual Interactive Charts */}
            {item.chartData && (
              <div className="p-5 rounded-2xl border border-[#dae2fd] bg-white shadow-xs space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-[#e2e7ff] pb-3">
                  <div className="p-2 bg-[#f2f3ff] text-[#006194] rounded-xl">
                    {item.chartData.type === 'donut' ? (
                      <PieChart className="w-4 h-4" />
                    ) : (
                      <BarChart3 className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#131b2e]">{item.chartData.title}</h4>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {item.chartData.items.map((chartItem, idx) => {
                    const maxValue = Math.max(...item.chartData!.items.map((i) => i.value));
                    const percentage = Math.round((chartItem.value / (maxValue || 1)) * 100);

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-[#3f4850]">{chartItem.label}</span>
                          <div className="space-x-1.5">
                            <span className="text-[#131b2e] font-bold">{chartItem.value.toLocaleString()}</span>
                            {chartItem.note && (
                              <span className="text-[11px] text-[#707881] font-normal">({chartItem.note})</span>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-[#f2f3ff] h-2.5 rounded-full overflow-hidden flex">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(percentage, 4)}%`,
                              backgroundColor: chartItem.color || '#006194',
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Deskripsi & Ringkasan */}
            <div className="bg-white p-5 rounded-2xl border border-[#dae2fd] shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#006194]">
                Ringkasan &amp; Profil Faktual
              </h3>
              <p className="text-sm text-[#3f4850] leading-relaxed font-normal">
                {item.description}
              </p>
              {item.detailedNotes && item.detailedNotes.length > 0 && (
                <ul className="pt-1 space-y-1.5">
                  {item.detailedNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start text-xs text-[#535f70] space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006194] mt-1.5 flex-shrink-0"></span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#dae2fd]">
              <div className="text-xs text-[#535f70]">
                Terakhir diperbarui: <strong>{item.lastUpdated}</strong>
              </div>
              <button
                onClick={() => onOpenPrintPreview(item)}
                className="px-3.5 py-1.5 bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#006194] rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Cetak Lembar Monografi</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
