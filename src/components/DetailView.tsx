'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  ShieldCheck,
  Save,
  Loader2,
  Plus,
  Trash2,
  Eye,
  AlertCircle,
  Users,
  Sparkles,
  RotateCcw,
  CheckCheck,
  Lock,
} from 'lucide-react';

interface DetailViewProps {
  item: MonografiItem;
  currentOfficial: Official;
  onSaveItem?: (updatedItem: MonografiItem) => Promise<void> | void;
  onApproveItem?: (id: string) => void;
  onVerifySeklur?: (id: string) => void;
  onOpenLetterModal?: () => void;
  onOpenReportModal?: () => void;
  onOpenPrintPreview?: (item: MonografiItem) => void;
  onTriggerWhatsApp?: (item: MonografiItem) => void;
}

// Helper memisahkan angka/nilai dan satuan agar pengguna hanya perlu mengedit nilai tanpa perlu repot mengetik/mengubah satuan
function parseValueAndUnit(raw: string | number, label?: string): { numberVal: string; unitVal: string } {
  const str = String(raw ?? '').trim();

  // Pattern seperti "23°C" atau "23 °C"
  const degMatch = str.match(/^([\d.,\-–—\s]+)\s*(°C|C)$/i);
  if (degMatch) {
    return { numberVal: degMatch[1].trim(), unitVal: '°C' };
  }

  // Pattern seperti "1.245 Jiwa", "208,25 Ha", "700–900 mdpl", "16 KK", "14 Titik", "1 Unit Aktif"
  const match = str.match(/^([\d.,\-–—\s]+)\s+([A-Za-z°%][A-Za-z0-9°%/.\s]*)$/);
  if (match) {
    return { numberVal: match[1].trim(), unitVal: match[2].trim() };
  }

  // Fallback deteksi satuan otomatis dari nama parameter
  const detectUnit = (lbl?: string) => {
    if (!lbl) return '';
    const l = lbl.toLowerCase();
    if (l.includes('pemilu') || l.includes('dpt') || l.includes('jiwa') || l.includes('penduduk') || l.includes('warga')) return 'Jiwa';
    if (l.includes('luas') || l.includes('wilayah') || l.includes('lahan')) return 'Ha';
    if (l.includes('suhu') || l.includes('temperatur')) return '°C';
    if (l.includes('topografi') || l.includes('ketinggian') || l.includes('elevasi')) return 'mdpl';
    if (l.includes('mata air') || l.includes('sumber air')) return 'Titik';
    if (l.includes('pkh') || l.includes('bansos') || l.includes('keluarga')) return 'KK';
    if (l.includes('pos') || l.includes('sarana')) return 'Unit';
    return '';
  };

  const detected = detectUnit(label);

  // Jika input hanya berisi angka/karakter angka saja tanpa satuan (misal user baru ketik "1245")
  if (/^[\d.,\-–—\s]+$/.test(str)) {
    return { numberVal: str.trim(), unitVal: detected };
  }

  return { numberVal: str, unitVal: detected };
}

export default function DetailView({
  item,
  currentOfficial,
  onSaveItem,
  onApproveItem,
  onVerifySeklur,
  onOpenPrintPreview,
  onTriggerWhatsApp,
}: DetailViewProps) {
  const isLurah = currentOfficial.roleCode === 'superadmin';
  const isSeklur = currentOfficial.roleCode === 'admin_seklur';

  // Mode: 'form' (Formulir Input) atau 'preview' (Pratinjau Grafik)
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Form local state
  const [title, setTitle] = useState(item.title);
  const [year, setYear] = useState(item.year);
  const [palaName, setPalaName] = useState(item.palaName || '');
  const [kasieName, setKasieName] = useState(item.kasieName || '');

  // Demography Core Numbers
  const [pria, setPria] = useState<number>(item.metrics?.pria || 0);
  const [wanita, setWanita] = useState<number>(item.metrics?.wanita || 0);
  const [kepalaKeluarga, setKepalaKeluarga] = useState<number>(item.metrics?.kepalaKeluarga || 0);

  // Dynamic Variable Indicators
  const [customMetrics, setCustomMetrics] = useState<
    { label: string; value: string | number; note?: string }[]
  >([]);

  // Narration & Field Notes
  const [description, setDescription] = useState(item.description);
  const [detailedNotesText, setDetailedNotesText] = useState(
    item.detailedNotes ? item.detailedNotes.join('\n') : ''
  );
  const [statusTahapan, setStatusTahapan] = useState<MonografiItem['statusTahapan']>(
    item.statusTahapan || 'draft'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Auto-calculated Total Penduduk
  const totalWarga = useMemo(() => {
    return pria + wanita;
  }, [pria, wanita]);

  // Percentage Calculations
  const priaPct = useMemo(() => {
    if (totalWarga <= 0) return '0%';
    return `${((pria / totalWarga) * 100).toFixed(2).replace('.', ',')}%`;
  }, [pria, totalWarga]);

  const wanitaPct = useMemo(() => {
    if (totalWarga <= 0) return '0%';
    return `${((wanita / totalWarga) * 100).toFixed(2).replace('.', ',')}%`;
  }, [wanita, totalWarga]);

  // Reset form whenever active item changes
  useEffect(() => {
    setTitle(item.title);
    setYear(item.year);
    setPalaName(item.palaName || '');
    setKasieName(item.kasieName || '');

    const initialPria = item.metrics?.pria ?? 0;
    const initialWanita = item.metrics?.wanita ?? 0;
    setPria(initialPria);
    setWanita(initialWanita);
    setKepalaKeluarga(item.metrics?.kepalaKeluarga ?? 0);

    // Default indicators matching Stitch if empty
    if (item.metrics?.customMetrics && item.metrics.customMetrics.length > 0) {
      setCustomMetrics(item.metrics.customMetrics.map((c) => ({ ...c })));
    } else if (item.id.includes('kependudukan') || item.categoryKey === 'kependudukan') {
      setCustomMetrics([
        { label: 'Hak Pilih Pemilu (DPT)', value: '1.245 Jiwa', note: 'Pemilih tetap aktif terdaftar di PPS' },
        { label: 'Luas Total Wilayah', value: '208,25 Ha', note: 'Cakupan teritorial Kelurahan Kolongan Satu' },
        { label: 'Suhu Udara Rata-rata', value: '23°C', note: 'Kondisi klimatologi perbukitan Tomohon' },
        { label: 'Topografi Wilayah', value: '700–900 mdpl', note: 'Ketinggian wilayah dari permukaan laut' },
        { label: 'Sumber Air Baku / Mata Air Alami', value: '14 Titik', note: 'Titik sumber air bersih aktif lingkungan' },
      ]);
    } else {
      setCustomMetrics([]);
    }

    setDescription(item.description);
    setDetailedNotesText(item.detailedNotes ? item.detailedNotes.join('\n') : '');
    setStatusTahapan(item.statusTahapan || 'draft');
    setSaveSuccessMsg(null);
  }, [item]);

  // Add new indicator row
  const handleAddCustomMetric = () => {
    setCustomMetrics((prev) => [
      ...prev,
      { label: 'Indikator Baru', value: '0', note: 'Keterangan parameter' },
    ]);
  };

  const handleCustomMetricChange = (
    index: number,
    field: 'label' | 'value' | 'note',
    val: string
  ) => {
    setCustomMetrics((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleRemoveCustomMetric = (index: number) => {
    setCustomMetrics((prev) => prev.filter((_, i) => i !== index));
  };

  // Save handler (Simpan Draf or Simpan & Sinkronisasi)
  const handleSave = async (isDraft: boolean = false) => {
    if (!onSaveItem) return;

    setIsSaving(true);
    setSaveSuccessMsg(null);

    const notesArray = detailedNotesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newStatus = isDraft
      ? 'draft'
      : statusTahapan === 'draft'
      ? 'diverifikasi_seklur'
      : statusTahapan;

    const updatedItem: MonografiItem = {
      ...item,
      title: title.trim() || item.title,
      year,
      palaName: palaName.trim() || undefined,
      kasieName: kasieName.trim() || item.kasieName,
      description: description.trim() || item.description,
      detailedNotes: notesArray.length > 0 ? notesArray : item.detailedNotes,
      statusTahapan: newStatus,
      lastUpdated: `${new Date().toLocaleDateString('id-ID')} - Pembaruan Portal e-Monografi`,
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
      setStatusTahapan(newStatus);
      setSaveSuccessMsg(
        isDraft
          ? `Draf data "${updatedItem.title}" berhasil disimpan secara lokal!`
          : `Data "${updatedItem.title}" berhasil disimpan & disinkronkan ke Landing Page Publik!`
      );
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Chapter mapping helper
  const chapterLabel = useMemo(() => {
    if (item.categoryKey === 'wilayah') return 'BAB II : TERITORIAL & KEWILAYAHAN JAGA';
    if (item.categoryKey === 'kependudukan') return 'BAB I : POKOK PEMERINTAHAN & DEMOGRAFI';
    if (item.categoryKey === 'pendidikan') return 'BAB III : PENDIDIKAN & SUMBER DAYA MANUSIA';
    if (item.categoryKey === 'ekonomi') return 'BAB IV : PEREKONOMIAN, UMKM & MATA PENCAHARIAN';
    if (item.categoryKey === 'lingkungan') return 'BAB V : SARANA SANITASI & FASILITAS PUBLIK';
    return 'BAB VI : TRANSPARANSI & LAPORAN KEUANGAN';
  }, [item.categoryKey]);

  return (
    <section
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
      data-purpose="active-data-form"
    >
      {/* 1. Header Banner with Status & Publishing Actions */}
      <div className="px-6 sm:px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-sky-50/70 via-white to-white flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-brand-100 text-brand-800 tracking-wide uppercase">
              {chapterLabel}
            </span>

            {statusTahapan === 'disahkan_lurah' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                Terverifikasi Sah (Lurah)
              </span>
            ) : statusTahapan === 'diverifikasi_seklur' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-brand-700 text-xs font-semibold border border-brand-200">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                Diverifikasi Seklur
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Draf Masukan
              </span>
            )}

            <span className="text-xs text-slate-400">
              Pembaruan terakhir: {item.lastUpdated || '24 Mar 2025, 14:20 WITA'}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {item.title}
          </h3>
        </div>

        {/* Top Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'form' ? 'preview' : 'form')}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-brand-50 border-brand-300 text-brand-700 font-bold'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            {activeTab === 'preview' ? (
              <>
                <FileEdit className="w-4 h-4 text-brand-600" />
                <span>Kembali ke Formulir</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-slate-500" />
                <span>Pratinjau Grafik</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Simpan Draf</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white font-bold text-xs flex items-center gap-2 shadow-xs shadow-brand-500/20 transition-all active:scale-98 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyinkronkan...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Publikasikan ke Landing Page</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessMsg && (
        <div className="mx-6 sm:mx-8 mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1 font-semibold">{saveSuccessMsg}</div>
        </div>
      )}

      {/* 2. TAB CONTENT: FORMULIR INPUT (STITCH LAYOUT) */}
      {activeTab === 'form' ? (
        <form
          className="p-6 sm:p-8 space-y-8"
          data-purpose="main-monography-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave(false);
          }}
        >
          {/* SECTION 1: Core Population Metric Cards (4-Column Grid) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>I. Indikator Kunci Demografi</span>
                  <span className="text-xs font-normal text-slate-500">
                    (Buku Induk Kependudukan {year})
                  </span>
                </h4>
              </div>
              <span className="text-xs text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md font-semibold">
                Kalkulasi Otomatis Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Total Penduduk Card (Auto-Calculated Readonly) */}
              <div className="bg-gradient-to-b from-white to-sky-50/40 rounded-2xl border-2 border-brand-200/80 p-5 shadow-xs relative flex flex-col justify-between transition-all">
                <div className="flex items-center justify-between">
                  <label
                    className="text-xs font-bold text-slate-700 uppercase tracking-wide cursor-default"
                    htmlFor="total-penduduk"
                  >
                    Total Penduduk
                  </label>
                  <span className="p-1.5 rounded-lg bg-sky-100/70 text-sky-700">
                    <Users className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <input
                      className="w-full text-3xl font-extrabold text-slate-900 tracking-tight bg-transparent border-0 p-0 focus:ring-0 cursor-default"
                      id="total-penduduk"
                      name="total_penduduk"
                      readOnly
                      type="number"
                      value={totalWarga}
                    />
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      Jiwa
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400">
                    <span>Otomatis (Laki-laki + Perempuan)</span>
                  </div>
                </div>
              </div>

              {/* Kepala Keluarga (KK) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <label
                    className="text-xs font-bold text-slate-600 uppercase tracking-wide cursor-pointer"
                    htmlFor="total-kk"
                  >
                    Kepala Keluarga (KK)
                  </label>
                  <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                    <Users className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2 border-b border-slate-200 focus-within:border-brand-500 pb-1">
                    <input
                      className="w-full text-3xl font-extrabold text-slate-900 tracking-tight bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                      id="total-kk"
                      name="total_kk"
                      type="number"
                      value={kepalaKeluarga}
                      onChange={(e) =>
                        setKepalaKeluarga(Math.max(0, parseInt(e.target.value) || 0))
                      }
                    />
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      KK
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Register KK {year}
                  </p>
                </div>
              </div>

              {/* Laki-Laki */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <label
                    className="text-xs font-bold text-blue-700 uppercase tracking-wide cursor-pointer"
                    htmlFor="total-pria"
                  >
                    Laki-Laki
                  </label>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                    {priaPct}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2 border-b border-blue-200 focus-within:border-brand-500 pb-1">
                    <input
                      className="w-full text-3xl font-extrabold text-blue-900 tracking-tight bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                      id="total-pria"
                      name="total_pria"
                      type="number"
                      value={pria}
                      onChange={(e) => setPria(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      Jiwa
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Warga laki-laki
                  </p>
                </div>
              </div>

              {/* Perempuan */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <label
                    className="text-xs font-bold text-rose-600 uppercase tracking-wide cursor-pointer"
                    htmlFor="total-wanita"
                  >
                    Perempuan
                  </label>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700">
                    {wanitaPct}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2 border-b border-rose-200 focus-within:border-brand-500 pb-1">
                    <input
                      className="w-full text-3xl font-extrabold text-rose-600 tracking-tight bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                      id="total-wanita"
                      name="total_wanita"
                      type="number"
                      value={wanita}
                      onChange={(e) =>
                        setWanita(Math.max(0, parseInt(e.target.value) || 0))
                      }
                    />
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      Jiwa
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Warga perempuan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Dynamic Variable Indicators Table */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                  II. Indikator Tambahan
                </h4>
                <p className="text-xs text-slate-500">
                  Parameter wilayah dan sarana
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddCustomMetric}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors border border-brand-200/80 cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4 text-brand-600" />
                <span>Tambah Baris Indikator</span>
              </button>
            </div>

            {/* Dynamic List Container */}
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
              {customMetrics.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 italic">
                  Belum ada baris indikator variabel khusus. Klik tombol &quot;Tambah Baris Indikator&quot; di atas.
                </div>
              ) : (
                <>
                  <div className="hidden sm:flex items-center justify-between px-6 py-2.5 bg-slate-100/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Nama Parameter &amp; Keterangan</span>
                    <span className="pr-12">Nilai &amp; Satuan</span>
                  </div>
                  <div className="divide-y divide-slate-200/70">
                    {customMetrics.map((metric, idx) => {
                      const { numberVal, unitVal } = parseValueAndUnit(metric.value, metric.label);
                      return (
                        <div
                          key={idx}
                          className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white transition-colors"
                        >
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 font-extrabold text-xs flex items-center justify-center shrink-0 border border-sky-200/80 shadow-2xs">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <div className="flex-1 min-w-0 space-y-1">
                              <input
                                type="text"
                                value={metric.label}
                                onChange={(e) =>
                                  handleCustomMetricChange(idx, 'label', e.target.value)
                                }
                                placeholder="Nama Indikator / Variabel..."
                                className="w-full text-xs font-bold text-slate-900 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-brand-500 rounded-lg px-2 py-1 transition focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder:text-slate-400"
                              />
                              <input
                                type="text"
                                value={metric.note || ''}
                                onChange={(e) =>
                                  handleCustomMetricChange(idx, 'note', e.target.value)
                                }
                                placeholder="Keterangan singkat parameter..."
                                className="w-full text-[11px] text-slate-500 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-brand-500 rounded-lg px-2 py-0.5 transition focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder:text-slate-400"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2.5 shrink-0">
                            <div className="flex items-center w-full sm:w-60 bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden shadow-2xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition">
                              <input
                                className="w-full text-right font-bold text-xs text-slate-900 px-3.5 py-2 bg-transparent focus:outline-none placeholder:text-slate-400 font-mono sm:font-sans"
                                type="text"
                                value={numberVal}
                                onChange={(e) => {
                                  const newNum = e.target.value;
                                  if (!newNum) {
                                    handleCustomMetricChange(idx, 'value', '');
                                    return;
                                  }
                                  const combined = unitVal
                                    ? unitVal === '°C'
                                      ? `${newNum}${unitVal}`
                                      : `${newNum} ${unitVal}`.trim()
                                    : newNum;
                                  handleCustomMetricChange(idx, 'value', combined);
                                }}
                                placeholder="0"
                              />
                              {unitVal && (
                                <span
                                  className="bg-slate-100/90 border-l border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 select-none shrink-0 min-w-[56px] text-center"
                                  title="Satuan tetap (tidak perlu diubah)"
                                >
                                  {unitVal}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomMetric(idx)}
                              className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100 cursor-pointer shrink-0"
                              title="Hapus Indikator"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SECTION 3: Legal Verification & Administrative Sign-off Footer */}
          <div
            className="bg-gradient-to-r from-slate-50 via-sky-50/30 to-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6"
            data-purpose="verification-sign-off"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-brand-600 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Otoritas Validasi Kelurahan
                </span>
                <h5 className="text-sm font-bold text-slate-900">
                  Theresia J. Kaunang, SE
                </h5>
                <p className="text-xs text-slate-600">
                  Lurah Kolongan Satu • NIP. 19780203 200902 2 002
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-emerald-700 font-bold block">
                  Status Tanda Tangan Elektronik
                </span>
                <span className="text-[10px] text-slate-500">
                  Tersertifikasi Balai Sertifikasi Elektronik (BSrE)
                </span>
              </div>

              {isLurah ? (
                /* HANYA LURAH YANG MEMILIKI OTORITAS PENGESAHAN */
                statusTahapan === 'disahkan_lurah' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (onApproveItem) onApproveItem(item.id);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-emerald-300 hover:border-emerald-500 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    title="Klik untuk memperbarui / sahkan kembali data ini"
                  >
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span>Disahkan Lurah (Sah)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onApproveItem) onApproveItem(item.id);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-4 h-4 text-white" />
                    <span>Sahkan Data (Lurah)</span>
                  </button>
                )
              ) : (
                /* SEKRETARIS & STAF TIDAK MEMILIKI AKSES INI */
                statusTahapan === 'disahkan_lurah' ? (
                  <div
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-50 border border-emerald-200 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs select-none"
                    title="Data telah disahkan secara resmi oleh Lurah Theresia J. Kaunang, SE. Sekretaris tidak memiliki hak akses mengubah pengesahan."
                  >
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">Disahkan Lurah (Sah)</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <div
                      className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 select-none"
                      title="Otoritas pengesahan data monografi mutlak berada pada Lurah Theresia J. Kaunang, SE"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Khusus Otoritas Lurah</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onTriggerWhatsApp) {
                          onTriggerWhatsApp(item);
                        } else if (onVerifySeklur) {
                          onVerifySeklur(item.id);
                        }
                      }}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      title="Kirim notifikasi draf permohonan pengesahan ke WhatsApp Lurah Theresia"
                    >
                      <Send className="w-3.5 h-3.5 text-brand-600" />
                      <span>Kirim ke WhatsApp Lurah</span>
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          {/* SECTION 4: Field Apparatus & Notes */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Aparatur &amp; Catatan Lapangan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {item.categoryKey === 'wilayah' || item.palaName ? (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Kepala Lingkungan (Pala)
                  </label>
                  <input
                    type="text"
                    value={palaName}
                    onChange={(e) => setPalaName(e.target.value)}
                    placeholder="Nama Pala..."
                    className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              ) : null}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Kasie / Staf Verifikator
                </label>
                <input
                  type="text"
                  value={kasieName}
                  onChange={(e) => setKasieName(e.target.value)}
                  placeholder="Contoh: Djonny Maweikere, S.IP"
                  className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Catatan Rinci / Poin Lapangan (Satu poin per baris)
              </label>
              <textarea
                rows={3}
                value={detailedNotesText}
                onChange={(e) => setDetailedNotesText(e.target.value)}
                placeholder="Poin-poin fakta lapangan..."
                className="w-full text-xs text-slate-900 bg-white border border-slate-200 rounded-xl p-3 focus:ring-1 focus:ring-brand-500 focus:outline-none leading-relaxed font-mono"
              />
            </div>
          </div>

          {/* SECTION 5: Bottom Floating / Sticky Action Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              Tercatat pada audit log sistem.
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => {
                  setTitle(item.title);
                  setPria(item.metrics?.pria || 0);
                  setWanita(item.metrics?.wanita || 0);
                  setKepalaKeluarga(item.metrics?.kepalaKeluarga || 0);
                  setDescription(item.description);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal Perubahan
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white font-bold text-xs shadow-xs shadow-brand-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan &amp; Sinkronisasi...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan &amp; Sinkronisasi Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* 3. TAB CONTENT: PRATINJAU GRAFIK & TAMPILAN RESMI */
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Metrics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Total Penduduk
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {totalWarga.toLocaleString('id-ID')}{' '}
                <span className="text-xs font-semibold text-slate-500">Jiwa</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Kepala Keluarga
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {kepalaKeluarga.toLocaleString('id-ID')}{' '}
                <span className="text-xs font-semibold text-slate-500">KK</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                Laki-Laki ({priaPct})
              </p>
              <p className="text-2xl font-black text-blue-900 mt-1">
                {pria.toLocaleString('id-ID')}{' '}
                <span className="text-xs font-semibold text-slate-500">Jiwa</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                Perempuan ({wanitaPct})
              </p>
              <p className="text-2xl font-black text-rose-600 mt-1">
                {wanita.toLocaleString('id-ID')}{' '}
                <span className="text-xs font-semibold text-slate-500">Jiwa</span>
              </p>
            </div>
          </div>

          {/* Interactive Chart */}
          {item.chartData && (
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
                  {item.chartData.type === 'donut' ? (
                    <PieChart className="w-4 h-4" />
                  ) : (
                    <BarChart3 className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {item.chartData.title}
                  </h4>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {item.chartData.items.map((chartItem, idx) => {
                  const maxValue = Math.max(
                    ...item.chartData!.items.map((i) => i.value)
                  );
                  const percentage = Math.round(
                    (chartItem.value / (maxValue || 1)) * 100
                  );

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{chartItem.label}</span>
                        <div className="space-x-1.5">
                          <span className="text-slate-900 font-bold">
                            {chartItem.value.toLocaleString('id-ID')}
                          </span>
                          {chartItem.note && (
                            <span className="text-[11px] text-slate-400 font-normal">
                              ({chartItem.note})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(percentage, 5)}%`,
                            backgroundColor: chartItem.color || '#0284c7',
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Print preview & Download action */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500">
              Format lembar monografi resmi siap cetak untuk pelaporan ke Kecamatan Tomohon Tengah.
            </span>
            {onOpenPrintPreview && (
              <button
                type="button"
                onClick={() => onOpenPrintPreview(item)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-brand-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Cetak Lembar Monografi</span>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
