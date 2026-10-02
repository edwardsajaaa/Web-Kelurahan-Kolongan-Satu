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
  Check
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

  // Tracking query state
  const [trackQuery, setTrackQuery] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik || !nama || !wa || !keperluan) {
      alert('Mohon lengkapi NIK, Nama, Nomor WA, dan Keperluan permohonan!');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedNo = `REG-KKT-2026-${randomSuffix}`;

    const newReq: LetterRequest = {
      id: `let-${Date.now()}`,
      noRegistrasi: generatedNo,
      nikPemohon: nik,
      namaPemohon: nama,
      nomorWaPemohon: wa,
      jenisSurat: jenisSurat,
      lingkunganId: lingkunganId,
      tujuanKeperluan: keperluan,
      alamatLengkap: alamat || `Lingkungan ${lingkunganId}, Kolongan Satu`,
      pekerjaan: pekerjaan || 'Wiraswasta',
      berkasName: berkasName,
      statusSurat: 'diajukan',
      statusLabel: 'Baru Diajukan',
      tanggalDiajukan: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WITA',
    };

    onAddLetter(newReq);
    setActiveTab('daftar');
    alert(`Permohonan surat berhasil dikirim!\nNomor Registrasi Anda: ${generatedNo}\nResi pelacakan telah diteruskan ke server.`);
  };

  const trackedLetter = letters.find(
    (l) => l.noRegistrasi.toLowerCase() === trackQuery.trim().toLowerCase() || l.nikPemohon === trackQuery.trim()
  );

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
            onClick={() => setActiveTab('daftar')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'daftar'
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
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'ajukan'
                ? 'bg-white border-sky-600 text-sky-800 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Ajukan Surat Mandiri</span>
          </button>

          <button
            onClick={() => setActiveTab('lacak')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'lacak'
                ? 'bg-white border-sky-600 text-sky-800 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Lacak Status Registrasi</span>
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
                              <span>Baru Diajukan</span>
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

                          {/* Print / Download Button */}
                          {isDone && (
                            <button
                              onClick={() => onPrintLetter(letter)}
                              className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition flex items-center space-x-1.5 shadow-sm"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Cetak Surat PDF Resmi</span>
                            </button>
                          )}
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
            <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Formulir Permohonan Surat Mandiri</h3>
                <p className="text-xs text-slate-500">
                  Layanan terpadu satu atap kantor Kelurahan Kolongan Satu
                </p>
              </div>

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
                  <span className="text-[10px] text-slate-400">Resi dan link PDF surat akan dikirimkan otomatis ke nomor ini.</span>
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-md shadow-sky-700/20 transition flex items-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Permohonan Surat Sekarang</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: LACAK STATUS REGISTRASI */}
          {activeTab === 'lacak' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Pelacakan Berkas Mandiri</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Masukkan Nomor Registrasi (contoh: <code>REG-KKT-2026-0038</code>) atau NIK Pemohon
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="Ketik No. Registrasi atau NIK..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>

              {trackedLetter ? (
                <div className="bg-white p-5 rounded-2xl border border-sky-300 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                        {trackedLetter.noRegistrasi}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-2">{trackedLetter.jenisSurat}</h4>
                    </div>
                    <div>
                      {trackedLetter.statusSurat === 'selesai_disahkan' ? (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Selesai & Sah</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-300 rounded-full text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Sedang Diproses</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Flow Steps Indicator */}
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                      <p className="text-[10px] font-bold text-emerald-800">1. Diajukan</p>
                      <p className="text-[9px] text-emerald-600 mt-0.5">Warga Mandiri</p>
                    </div>
                    <div className={`p-2.5 rounded-xl border text-center ${
                      ['diverifikasi_staf', 'diparaf_seklur', 'selesai_disahkan'].includes(trackedLetter.statusSurat)
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      <p className="text-[10px] font-bold">2. Verifikasi</p>
                      <p className="text-[9px]">Staf Karlin</p>
                    </div>
                    <div className={`p-2.5 rounded-xl border text-center ${
                      ['diparaf_seklur', 'selesai_disahkan'].includes(trackedLetter.statusSurat)
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      <p className="text-[10px] font-bold">3. Paraf</p>
                      <p className="text-[9px]">Seklur Ferromel</p>
                    </div>
                    <div className={`p-2.5 rounded-xl border text-center ${
                      trackedLetter.statusSurat === 'selesai_disahkan'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      <p className="text-[10px] font-bold">4. Pengesahan</p>
                      <p className="text-[9px]">TTD Lurah Theresia</p>
                    </div>
                  </div>

                  {trackedLetter.statusSurat === 'selesai_disahkan' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onPrintLetter(trackedLetter)}
                        className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition flex items-center space-x-2"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Unduh Dokumen Surat Resmi (PDF)</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                trackQuery && (
                  <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                    <p className="text-xs font-semibold text-slate-600">Nomor registrasi tidak ditemukan</p>
                    <p className="text-[11px] text-slate-400 mt-1">Periksa kembali penulisan nomor registrasi atau NIK Anda.</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
