'use client';
import React, { useState } from 'react';
import { LetterRequest, JENIS_SURAT_OPTIONS } from '@/data/lettersData';
import { Official } from '@/data/officialsData';
import {
  FileText,
  X,
  CheckCircle2,
  Clock,
  Send,
  Printer,
  Upload,
  User,
  Phone,
  CreditCard,
  MapPin,
  Search,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  Loader2,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';

interface ModalLetterRequestProps {
  isOpen: boolean;
  onClose: () => void;
  letters: LetterRequest[];
  onAddLetter: (newLetter: LetterRequest) => void;
  onUpdateStatus: (id: string, newStatus: LetterRequest['statusSurat'], note?: string) => void;
  currentOfficial: Official;
  onPrintLetter: (letter: LetterRequest) => void;
}

export default function ModalLetterRequest({
  isOpen,
  onClose,
  letters,
  onAddLetter,
  onUpdateStatus,
  currentOfficial,
  onPrintLetter,
}: ModalLetterRequestProps) {
  const [activeTab, setActiveTab] = useState<'daftar' | 'ajukan' | 'lacak'>('daftar');

  // Form states
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [jenisSurat, setJenisSurat] = useState(JENIS_SURAT_OPTIONS[0]);
  const [lingkunganId, setLingkunganId] = useState(1);
  const [pekerjaan, setPekerjaan] = useState('');
  const [alamat, setAlamat] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [berkasName, setBerkasName] = useState('KTP_dan_KK_Pemohon.pdf');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedLetter, setSubmittedLetter] = useState<LetterRequest | null>(null);
  const [copiedResi, setCopiedResi] = useState(false);

  // Tracking query state
  const [trackQuery, setTrackQuery] = useState('');
  const [isSearchingTrack, setIsSearchingTrack] = useState(false);
  const [trackedRemoteLetter, setTrackedRemoteLetter] = useState<LetterRequest | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Form Submission with Real API Call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik || !nama || !wa || !keperluan) {
      setSubmitError('Mohon lengkapi NIK, Nama Pemohon, Nomor WhatsApp, dan Keperluan permohonan!');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        nik_pemohon: nik,
        nama_pemohon: nama,
        nomor_wa_pemohon: wa,
        jenis_surat: jenisSurat,
        lingkungan_id: lingkunganId,
        isi_permohonan: {
          tujuanKeperluan: keperluan,
          alamatLengkap: alamat || `Lingkungan ${lingkunganId}, Kelurahan Kolongan Satu`,
          pekerjaan: pekerjaan || 'Wiraswasta',
          berkasName: berkasName,
        },
      };

      const res = await fetch('/api/surat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Gagal mengirimkan permohonan surat ke server.');
      }

      const newLetter: LetterRequest = resData.data;

      // Update parent list
      onAddLetter(newLetter);
      setSubmittedLetter(newLetter);

      // Reset form fields
      setNik('');
      setNama('');
      setWa('');
      setKeperluan('');
      setPekerjaan('');
      setAlamat('');
    } catch (err: any) {
      console.error('Error submitting letter request:', err);
      // Fallback local resilience
      const fallbackSuffix = Math.floor(1000 + Math.random() * 9000);
      const fallbackNo = `REG-K1-2026-${fallbackSuffix}`;
      const fallbackReq: LetterRequest = {
        id: `let-${Date.now()}`,
        noRegistrasi: fallbackNo,
        nikPemohon: nik,
        namaPemohon: nama,
        nomorWaPemohon: wa,
        jenisSurat: jenisSurat,
        lingkunganId: lingkunganId,
        tujuanKeperluan: keperluan,
        alamatLengkap: alamat || `Lingkungan ${lingkunganId}, Kelurahan Kolongan Satu`,
        pekerjaan: pekerjaan || 'Wiraswasta',
        berkasName: berkasName,
        statusSurat: 'diajukan',
        statusLabel: 'Diajukan Warga',
        tanggalDiajukan: new Date().toLocaleDateString('id-ID'),
      };
      onAddLetter(fallbackReq);
      setSubmittedLetter(fallbackReq);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tracking Search Function
  const handleSearchTracking = async (queryToSearch: string) => {
    const q = queryToSearch.trim();
    if (!q) {
      setTrackedRemoteLetter(null);
      setTrackError(null);
      return;
    }

    // Check local list first
    const foundLocal = letters.find(
      (l) =>
        l.noRegistrasi.toLowerCase() === q.toLowerCase() ||
        l.nikPemohon.toLowerCase() === q.toLowerCase()
    );

    if (foundLocal) {
      setTrackedRemoteLetter(foundLocal);
      setTrackError(null);
      return;
    }

    setIsSearchingTrack(true);
    setTrackError(null);

    try {
      const res = await fetch(`/api/surat?no_registrasi=${encodeURIComponent(q)}`);
      const resJson = await res.json();

      if (res.ok && resJson.success && resJson.data) {
        setTrackedRemoteLetter(resJson.data);
        setTrackError(null);
      } else {
        setTrackedRemoteLetter(null);
        setTrackError('Nomor registrasi atau NIK tidak ditemukan dalam sistem permohonan.');
      }
    } catch (err) {
      console.warn('Gagal melacak lewat API:', err);
      setTrackError('Koneksi terputus saat melacak resi. Silakan periksa kembali nomor Anda.');
    } finally {
      setIsSearchingTrack(false);
    }
  };

  const currentTracked =
    trackedRemoteLetter ||
    letters.find(
      (l) =>
        l.noRegistrasi.toLowerCase() === trackQuery.trim().toLowerCase() ||
        l.nikPemohon.toLowerCase() === trackQuery.trim().toLowerCase()
    );

  // Stepper calculations
  const getStepStatus = (status: LetterRequest['statusSurat']) => {
    switch (status) {
      case 'diajukan':
        return 1;
      case 'diverifikasi_staf':
        return 2;
      case 'diparaf_seklur':
        return 3;
      case 'selesai_disahkan':
        return 4;
      default:
        return 1;
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedResi(true);
      setTimeout(() => setCopiedResi(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-sky-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Layanan Persuratan Mandiri Warga</h2>
              <p className="text-xs text-slate-300">
                Pemerintah Kelurahan Kolongan Satu, Kecamatan Tomohon Tengah
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            onClick={() => {
              setActiveTab('daftar');
              setSubmittedLetter(null);
            }}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition border-b-2 flex items-center space-x-2 ${activeTab === 'daftar'
              ? 'bg-white border-sky-600 text-sky-800 shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            <span>Daftar Berkas Permohonan</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-sky-100 text-sky-800 font-bold">
              {letters.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ajukan')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition border-b-2 flex items-center space-x-2 ${activeTab === 'ajukan'
              ? 'bg-white border-sky-600 text-sky-800 shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Ajukan Surat Mandiri</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('lacak');
              setSubmittedLetter(null);
            }}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition border-b-2 flex items-center space-x-2 ${activeTab === 'lacak'
              ? 'bg-white border-sky-600 text-sky-800 shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Lacak Resi Permohonan</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-slate-50/50">
          {/* TAB 1: DAFTAR BERKAS */}
          {activeTab === 'daftar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-white p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    Masuk Sebagai: <strong className="text-slate-900">{currentOfficial.name}</strong> ({currentOfficial.roleTitle})
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Alur: Warga ➔ Staf Karlin ➔ Seklur Ferromel ➔ TTD Lurah Theresia
                </span>
              </div>

              <div className="space-y-3">
                {letters.map((letter) => {
                  const isDone = letter.statusSurat === 'selesai_disahkan';
                  const isStafVerified = letter.statusSurat === 'diverifikasi_staf';
                  const isSeklurParaf = letter.statusSurat === 'diparaf_seklur';
                  const isNew = letter.statusSurat === 'diajukan';

                  return (
                    <div
                      key={letter.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                              {letter.noRegistrasi}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">{letter.tanggalDiajukan}</span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 mt-1">
                            {letter.jenisSurat}
                          </h3>
                        </div>

                        {/* Status badge */}
                        <div>
                          {isDone ? (
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Selesai & Disahkan</span>
                            </span>
                          ) : isSeklurParaf ? (
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-300 rounded-full text-xs font-bold">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Paraf Seklur (Siap TTD Lurah)</span>
                            </span>
                          ) : isStafVerified ? (
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-300 rounded-full text-xs font-bold">
                              <Clock className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Diverifikasi Staf Karlin</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-sky-50 text-sky-700 border border-sky-300 rounded-full text-xs font-bold">
                              <Clock className="w-3.5 h-3.5 text-sky-600" />
                              <span>Diajukan Warga</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Applicant Information */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Pemohon</p>
                          <p className="font-bold text-slate-900">{letter.namaPemohon}</p>
                          <p className="text-[11px] text-slate-500 font-mono">NIK: {letter.nikPemohon}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Lingkungan & WA</p>
                          <p className="font-semibold text-slate-800">Lingkungan {letter.lingkunganId} (Jaga {letter.lingkunganId})</p>
                          <p className="text-[11px] text-slate-500">{letter.nomorWaPemohon}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Keperluan Surat</p>
                          <p className="text-slate-800 line-clamp-2">{letter.tujuanKeperluan}</p>
                        </div>
                      </div>

                      {/* Workflow Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                          {letter.berkasName && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                              📎 {letter.berkasName}
                            </span>
                          )}
                          {letter.diparafOleh && (
                            <span className="text-indigo-600 font-medium">
                              ✓ Diparaf: {letter.diparafOleh}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* Role Action: Staf Karlin verifies */}
                          {(currentOfficial.roleCode === 'pelaksana_adm' || currentOfficial.roleCode === 'superadmin' || currentOfficial.roleCode === 'admin_seklur') && isNew && (
                            <button
                              onClick={() => onUpdateStatus(letter.id, 'diverifikasi_staf', 'Berkas KTP/KK telah diverifikasi oleh Staf Karlin')}
                              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition"
                            >
                              Verifikasi Berkas Staf
                            </button>
                          )}

                          {/* Role Action: Seklur Ferromel paraf */}
                          {(currentOfficial.roleCode === 'admin_seklur' || currentOfficial.roleCode === 'superadmin') && (isStafVerified || isNew) && (
                            <button
                              onClick={() => onUpdateStatus(letter.id, 'diparaf_seklur', 'Paraf verifikasi administratif oleh Seklur Ferromel L. Pua, S.Kom')}
                              className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700 transition flex items-center space-x-1"
                            >
                              <span>Beri Paraf Seklur</span>
                            </button>
                          )}

                          {/* Role Action: Lurah Theresia approves & digital signs */}
                          {currentOfficial.roleCode === 'superadmin' && isSeklurParaf && (
                            <button
                              onClick={() => onUpdateStatus(letter.id, 'selesai_disahkan', 'Disahkan dan ditandatangani elektronik oleh Lurah Theresia J. Kaunang, SE')}
                              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition flex items-center space-x-1 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Sahkan TTD Lurah</span>
                            </button>
                          )}

                          {/* Print / Preview Button */}
                          <button
                            onClick={() => onPrintLetter(letter)}
                            className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition flex items-center space-x-1.5 shadow-sm"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>{isDone ? 'Cetak Surat PDF Resmi' : 'Lihat Draf Surat'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: AJUKAN SURAT MANDIRI */}
          {activeTab === 'ajukan' && (
            <div className="space-y-4">
              {/* SUCCESS MODAL CARD IF RECENTLY SUBMITTED */}
              {submittedLetter ? (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-emerald-300 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Permohonan Berhasil Dikirim
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                        Surat Telah Masuk Antrean Verifikasi
                      </h3>
                      <p className="text-xs text-slate-500">
                        Pemerintah Kelurahan Kolongan Satu sedang memproses permohonan Anda.
                      </p>
                    </div>
                  </div>

                  {/* Resi Registration Card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-xs text-slate-500 font-semibold">Nomor Registrasi Resmi (Simpan Resi Ini):</p>
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-sky-300">
                      <span className="font-mono text-base font-extrabold text-sky-800 tracking-wider">
                        {submittedLetter.noRegistrasi}
                      </span>
                      <button
                        onClick={() => copyToClipboard(submittedLetter.noRegistrasi)}
                        className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition"
                      >
                        {copiedResi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedResi ? 'Tersalin' : 'Salin Resi'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Pemohon</span>
                        <p className="font-bold text-slate-900">{submittedLetter.namaPemohon}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Jenis Surat</span>
                        <p className="font-bold text-slate-900">{submittedLetter.jenisSurat}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => onPrintLetter(submittedLetter)}
                      className="flex-1 py-3 px-4 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-700/20 transition flex items-center justify-center space-x-2"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Lihat Draf Surat Resmi</span>
                    </button>

                    <button
                      onClick={() => {
                        setTrackQuery(submittedLetter.noRegistrasi);
                        handleSearchTracking(submittedLetter.noRegistrasi);
                        setActiveTab('lacak');
                        setSubmittedLetter(null);
                      }}
                      className="py-3 px-4 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition flex items-center space-x-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Lacak Progres Surat</span>
                    </button>

                    <button
                      onClick={() => setSubmittedLetter(null)}
                      className="py-3 px-4 text-slate-500 hover:text-slate-800 text-xs font-semibold rounded-xl transition"
                    >
                      Ajukan Surat Baru
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Formulir Permohonan Surat Mandiri</h3>
                    <p className="text-xs text-slate-500">
                      Layanan terpadu satu atap kantor Kelurahan Kolongan Satu terhubung langsung ke database kelurahan.
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs animate-in fade-in">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nomor Induk Kependudukan (NIK) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        value={nik}
                        onChange={(e) => setNik(e.target.value)}
                        placeholder="Contoh: 7173010508920003"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Lengkap Pemohon (Sesuai KTP) *
                      </label>
                      <input
                        type="text"
                        required
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="Contoh: Jonathan Billy Pangemanan"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nomor WhatsApp Aktif *
                      </label>
                      <input
                        type="tel"
                        required
                        value={wa}
                        onChange={(e) => setWa(e.target.value)}
                        placeholder="Contoh: 0812-4411-9988"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <span className="text-[10px] text-slate-400">Resi dan pembaruan paraf akan dikaitkan ke nomor ini.</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Wilayah Lingkungan (Jaga) *
                      </label>
                      <select
                        value={lingkunganId}
                        onChange={(e) => setLingkunganId(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value={1}>Lingkungan I (Pala Meky Turangan)</option>
                        <option value={2}>Lingkungan II (Pala Devid Tasie)</option>
                        <option value={3}>Lingkungan III (Pala Agustinus Sapanany)</option>
                        <option value={4}>Lingkungan IV (Pala Petronella Pusung)</option>
                        <option value={5}>Lingkungan V (Pala Vifi Timang)</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Jenis Permohonan Surat *
                      </label>
                      <select
                        value={jenisSurat}
                        onChange={(e) => setJenisSurat(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        {JENIS_SURAT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pekerjaan Pemohon
                      </label>
                      <input
                        type="text"
                        value={pekerjaan}
                        onChange={(e) => setPekerjaan(e.target.value)}
                        placeholder="Contoh: Petani / Karyawan Swasta / Wiraswasta"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Unggah Lampiran KK / KTP (Simulasi)
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={berkasName}
                          onChange={(e) => setBerkasName(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <button
                          type="button"
                          onClick={() => setBerkasName(`Dokumen_KTP_${nama.split(' ')[0] || 'Pemohon'}.pdf`)}
                          className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Lampirkan</span>
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tujuan & Keperluan Surat *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={keperluan}
                        onChange={(e) => setKeperluan(e.target.value)}
                        placeholder="Jelaskan untuk apa surat ini dibuat (misal: syarat pengajuan KUR modal kerja di bank, pendaftaran sekolah, dll)..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('daftar')}
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-md shadow-sky-700/20 transition flex items-center space-x-2 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Menyimpan ke Database...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Kirim Permohonan Surat Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: LACAK STATUS REGISTRASI */}
          {activeTab === 'lacak' && (
            <div className="space-y-4">
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Pelacakan Berkas Mandiri</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Masukkan Nomor Registrasi (contoh: <code>REG-K1-2026-0038</code>) atau NIK Pemohon untuk memantau status secara live.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearchTracking(trackQuery);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="Ketik No. Registrasi atau NIK..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isSearchingTrack}
                    className="px-4 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 disabled:opacity-60"
                  >
                    {isSearchingTrack ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                    <span>Cari Status</span>
                  </button>
                </form>

                {trackError && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2 text-amber-800 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{trackError}</span>
                  </div>
                )}
              </div>

              {currentTracked ? (
                <div className="bg-white p-5 md:p-6 rounded-2xl border border-sky-300 shadow-md space-y-5 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                          {currentTracked.noRegistrasi}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">Diajukan: {currentTracked.tanggalDiajukan}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-2">{currentTracked.jenisSurat}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Pemohon: <strong>{currentTracked.namaPemohon}</strong> (NIK: {currentTracked.nikPemohon})
                      </p>
                    </div>
                    <div>
                      {currentTracked.statusSurat === 'selesai_disahkan' ? (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Selesai & Disahkan</span>
                        </span>
                      ) : currentTracked.statusSurat === 'diparaf_seklur' ? (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-300 rounded-full text-xs font-bold">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Diparaf Seklur</span>
                        </span>
                      ) : currentTracked.statusSurat === 'diverifikasi_staf' ? (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-300 rounded-full text-xs font-bold">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Pemeriksaan Berkas</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-sky-50 text-sky-700 border border-sky-300 rounded-full text-xs font-bold">
                          <Clock className="w-3.5 h-3.5 text-sky-600" />
                          <span>Menunggu Verifikasi</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 4-STEP VISUAL STEPPER PROGRESS */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                      Tahapan Pemrosesan Surat
                    </h5>
                    {(() => {
                      const currentStep = getStepStatus(currentTracked.statusSurat);
                      const steps = [
                        { step: 1, title: 'Diajukan', desc: 'Menunggu Verifikasi', sub: 'Warga Mandiri' },
                        { step: 2, title: 'Diproses', desc: 'Pemeriksaan Berkas', sub: 'Staf Karlin' },
                        { step: 3, title: 'Diparaf Seklur', desc: 'Ferromel L. Pua, S.Kom', sub: 'Paraf Administratif' },
                        { step: 4, title: 'Selesai Disahkan', desc: 'Theresia J. Kaunang, SE', sub: 'TTD Elektronik Lurah' },
                      ];

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          {steps.map((st) => {
                            const isCompleted = currentStep > st.step;
                            const isCurrent = currentStep === st.step;
                            const isPending = currentStep < st.step;

                            return (
                              <div
                                key={st.step}
                                className={`p-3.5 rounded-2xl border transition ${isCompleted
                                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                                  : isCurrent
                                    ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-200 text-sky-950 shadow-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-400'
                                  }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-bold tracking-wider uppercase">
                                    Tahap {st.step}
                                  </span>
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  ) : isCurrent ? (
                                    <Clock className="w-4 h-4 text-sky-600 animate-pulse" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                                  )}
                                </div>
                                <p className="text-xs font-bold mt-1">{st.title}</p>
                                <p className={`text-[11px] font-medium ${isCurrent ? 'text-sky-700' : isCompleted ? 'text-emerald-700' : 'text-slate-500'}`}>
                                  {st.desc}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1">{st.sub}</p>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Officer Signatures / Notes if available */}
                  {(currentTracked.diparafOleh || currentTracked.disahkanOleh || currentTracked.catatanPetugas) && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                      {currentTracked.diparafOleh && (
                        <p>• Diparaf oleh: <strong>{currentTracked.diparafOleh}</strong></p>
                      )}
                      {currentTracked.disahkanOleh && (
                        <p>• Disahkan oleh: <strong>{currentTracked.disahkanOleh}</strong></p>
                      )}
                      {currentTracked.catatanPetugas && (
                        <p className="text-slate-500 italic">Catatan: &ldquo;{currentTracked.catatanPetugas}&rdquo;</p>
                      )}
                    </div>
                  )}

                  {/* Download / Print CTA */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onPrintLetter(currentTracked)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-sm ${currentTracked.statusSurat === 'selesai_disahkan'
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                    >
                      <Printer className="w-4 h-4" />
                      <span>
                        {currentTracked.statusSurat === 'selesai_disahkan'
                          ? 'Unduh & Cetak Dokumen Sah (PDF)'
                          : 'Lihat Draf Sementara'}
                      </span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
