'use client';
import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Paperclip,
  MessageCircle,
  BookOpen,
  CheckSquare,
  FileSpreadsheet,
  BadgeCheck,
} from 'lucide-react';

export interface LetterRequirementGuide {
  id: string;
  nama: string;
  singkatan: string;
  deskripsi: string;
  persyaratan: string[];
  waktuPelayanan: string;
  biaya: string;
  keterangan: string;
}

export const KATALOG_SURAT_GUIDE: LetterRequirementGuide[] = [
  {
    id: 'sku',
    nama: 'Surat Keterangan Usaha (SKU)',
    singkatan: 'SKU',
    deskripsi: 'Keterangan resmi legalitas usaha mandiri / UMKM warga di wilayah Kelurahan Kolongan Satu untuk syarat perbankan, KUR modal usaha, atau legalitas.',
    persyaratan: [
      'Fotokopi KTP Pemohon (Warga Kolongan Satu / Lokasi Usaha)',
      'Fotokopi Kartu Keluarga (KK)',
      'Foto tempat / aktivitas usaha di lingkungan setempat',
      'Surat Pengantar dari Kepala Lingkungan (Pala)',
    ],
    waktuPelayanan: '1 Hari Kerja',
    biaya: 'Gratis (Rp 0)',
    keterangan: 'Wajib mencantumkan bidang usaha, alamat usaha, dan tahun mulai beroperasi.',
  },
  {
    id: 'domisili',
    nama: 'Surat Keterangan Domisili Warga',
    singkatan: 'Domisili',
    deskripsi: 'Keterangan tempat tinggal resmi bagi warga yang bertempat tinggal di Lingkungan I sampai V Kelurahan Kolongan Satu.',
    persyaratan: [
      'Fotokopi KTP Pemohon',
      'Fotokopi Kartu Keluarga (KK)',
      'Bukti tempat tinggal (bukti sewa / sertifikat / surat pengantar pemilik)',
      'Surat Pengantar dari Kepala Lingkungan (Pala)',
    ],
    waktuPelayanan: '1 Hari Kerja',
    biaya: 'Gratis (Rp 0)',
    keterangan: 'Digunakan untuk pembukaan rekening bank, syarat kerja, atau urusan kependudukan.',
  },
  {
    id: 'skck',
    nama: 'Surat Pengantar Catatan Kepolisian (SKCK)',
    singkatan: 'SKCK',
    deskripsi: 'Surat rekomendasi kelurahan sebagai syarat wajib penerbitan SKCK di Polsek Tomohon Tengah / Polres Tomohon.',
    persyaratan: [
      'Fotokopi KTP & Kartu Keluarga (KK)',
      'Fotokopi Akta Kelahiran',
      'Surat Pengantar dari Kepala Lingkungan (Pala)',
      'Pas foto 4x6 latar merah (3 lembar dibawa ke Polsek)',
    ],
    waktuPelayanan: '1 Hari Kerja',
    biaya: 'Gratis (Rp 0)',
    keterangan: 'Diperlukan untuk melamar pekerjaan, seleksi CPNS/BUMN, atau pendidikan kedinasan.',
  },
  {
    id: 'belum-menikah',
    nama: 'Surat Keterangan Belum Menikah',
    singkatan: 'Belum Menikah',
    deskripsi: 'Keterangan resmi status lajang / belum pernah menikah bagi warga yang hendak melangsungkan perkawinan atau syarat beasiswa.',
    persyaratan: [
      'Fotokopi KTP & Kartu Keluarga (KK) Pemohon',
      'Surat Pernyataan Belum Pernah Menikah bermaterai Rp 10.000',
      'Surat Pengantar dari Kepala Lingkungan (Pala)',
      'Fotokopi KTP 2 orang saksi warga setempat',
    ],
    waktuPelayanan: '1 Hari Kerja',
    biaya: 'Gratis (Rp 0)',
    keterangan: 'Syarat wajib pendaftaran nikah di KUA / Catatan Sipil serta pendaftaran beasiswa/tunjangan.',
  },
  {
    id: 'sktm',
    nama: 'Surat Keterangan Tidak Mampu (SKTM)',
    singkatan: 'SKTM',
    deskripsi: 'Keterangan kondisi sosial ekonomi keluarga prasejahtera untuk keperluan bantuan sosial, beasiswa KIP Kuliah, atau keringanan medis.',
    persyaratan: [
      'Fotokopi KTP & Kartu Keluarga (KK)',
      'Surat Pengantar Kepala Lingkungan (Pala) hasil verifikasi lapangan',
      'Foto kondisi tempat tinggal / rumah warga',
      'Surat pernyataan penghasilan keluarga bermaterai',
    ],
    waktuPelayanan: '1 Hari Kerja',
    biaya: 'Gratis (Rp 0)',
    keterangan: 'Diverifikasi langsung secara faktual oleh Kepala Lingkungan agar tepat sasaran.',
  },
  {
    id: 'kematian',
    nama: 'Surat Keterangan Kematian',
    singkatan: 'Kematian',
    deskripsi: 'Pencatatan resmi peristiwa kematian warga di wilayah Kelurahan Kolongan Satu.',
    persyaratan: [
      'Fotokopi KTP & KK Almarhum / Almarhumah',
      'Fotokopi KTP & KK Pelapor / Saksi Ahli Waris',
      'Surat Keterangan Medis RS / Puskesmas (bila ada)',
      'Surat Pengantar dari Kepala Lingkungan (Pala)',
    ],
    waktuPelayanan: 'Langsung Terbit (Prioritas)',
    biaya: 'Gratis (Rp 0)',
    keterangan: 'Dasar pengurusan Akta Kematian di Disdukcapil Tomohon dan klaim asuransi kematian.',
  },
  {
    id: 'kelahiran',
    nama: 'Surat Keterangan Kelahiran',
    singkatan: 'Kelahiran',
    deskripsi: 'Pencatatan peristiwa kelahiran anak di wilayah Kelurahan Kolongan Satu.',
    persyaratan: [
      'Fotokopi KTP Ayah & Ibu',
      'Fotokopi Kartu Keluarga & Buku Nikah / Akta Perkawinan',
      'Surat Keterangan Lahir dari Bidan / Rumah Sakit',
      'Surat Pengantar dari Kepala Lingkungan (Pala)',
    ],
    waktuPelayanan: '1 Hari Kerja',
    biaya: 'Gratis (Rp 0)',
    keterangan: 'Dasar pengurusan Akta Kelahiran anak di Disdukcapil Kota Tomohon.',
  },
  {
    id: 'penghasilan',
    nama: 'Surat Keterangan Penghasilan / Kerja',
    singkatan: 'Penghasilan',
    deskripsi: 'Keterangan taksiran pendapatan bagi pekerja mandiri, petani, atau wiraswasta yang tidak memiliki slip gaji formal.',
    persyaratan: [
      'Fotokopi KTP & Kartu Keluarga (KK)',
      'Surat Pernyataan Rincian Penghasilan Bermaterai Rp 10.000',
      'Surat Pengantar dari Kepala Lingkungan (Pala)',
    ],
    waktuPelayanan: '1 Hari Kerja',
    biaya: 'Gratis (Rp 0)',
    keterangan: 'Diperlukan untuk syarat pengajuan beasiswa anak, pendaftaran perguruan tinggi, atau kredit bank.',
  },
];

export const PALA_WHATSAPP_CONTACTS: Record<number, { nama: string; phone: string; label: string }> = {
  1: { nama: 'Meky Mario Turangan', phone: '0895-2917-5850', label: 'Kepala Lingkungan I (Jaga 1)' },
  2: { nama: 'Devid P.N. Tasie', phone: '0895-2917-5850', label: 'Kepala Lingkungan II (Jaga 2)' },
  3: { nama: 'Agustinus Sapanany', phone: '0895-2917-5850', label: 'Kepala Lingkungan III (Jaga 3)' },
  4: { nama: 'Petronella Pusung', phone: '0895-2917-5850', label: 'Kepala Lingkungan IV (Jaga 4)' },
  5: { nama: 'Vifi Timang', phone: '0895-2917-5850', label: 'Kepala Lingkungan V (Jaga 5)' },
};

export const KELURAHAN_PERSURATAN_WHATSAPP = {
  nama: 'Kantor Kelurahan Kolongan Satu (Layanan Persuratan)',
  phone: '0895-2917-5850',
  label: 'Kantor Kelurahan (Layanan Satu Atap)',
};

interface ModalLetterRequestProps {
  isOpen: boolean;
  onClose: () => void;
  letters: LetterRequest[];
  onAddLetter: (newLetter: LetterRequest) => void;
  onUpdateStatus: (id: string, newStatus: LetterRequest['statusSurat'], note?: string) => void;
  currentOfficial: Official;
  onPrintLetter: (letter: LetterRequest) => void;
  isPortalView?: boolean;
}

export default function ModalLetterRequest({
  isOpen,
  onClose,
  letters,
  onAddLetter,
  onUpdateStatus,
  currentOfficial,
  onPrintLetter,
  isPortalView = false,
}: ModalLetterRequestProps) {
  const [activeTab, setActiveTab] = useState<'daftar' | 'katalog' | 'ajukan' | 'lacak'>('daftar');
  const [portalFilter, setPortalFilter] = useState<'semua' | 'diajukan' | 'diverifikasi_staf' | 'diparaf_seklur' | 'selesai_disahkan'>('semua');

  useEffect(() => {
    if (isPortalView && activeTab !== 'daftar') {
      setActiveTab('daftar');
    }
  }, [isPortalView, activeTab]);

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

  // WhatsApp Target State (Kelurahan, Pala, atau Nomor Uji Coba Kustom)
  const [targetTujuan, setTargetTujuan] = useState<'kelurahan' | 'pala' | 'custom'>('kelurahan');
  const [customWaNumber, setCustomWaNumber] = useState('');
  const [lastWaUrl, setLastWaUrl] = useState('');
  const [lastTargetName, setLastTargetName] = useState('');

  // Uji coba nomor lain di layar sukses permohonan
  const [testOtherWaNumber, setTestOtherWaNumber] = useState('');

  // Dialog interaktif pengiriman WhatsApp (Kirim Status & Berkas PDF)
  const [waModal, setWaModal] = useState<{
    isOpen: boolean;
    letter: LetterRequest | null;
    type: 'status' | 'pdf';
    targetPhone: string;
    customPhone: string;
    useCustomPhone: boolean;
    copied: boolean;
  }>({
    isOpen: false,
    letter: null,
    type: 'status',
    targetPhone: '',
    customPhone: '',
    useCustomPhone: false,
    copied: false,
  });

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

  // Helper normalisasi nomor telepon ke 62xxxx
  const cleanPhoneTo62 = (phone: string) => {
    return phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
  };

  // Format WhatsApp Message Helper
  const getComposedWhatsAppMessage = (letter: {
    noRegistrasi: string;
    namaPemohon: string;
    nikPemohon: string;
    nomorWaPemohon: string;
    jenisSurat: string;
    lingkunganId: number;
    pekerjaan?: string;
    alamatLengkap?: string;
    tujuanKeperluan: string;
    berkasName?: string;
  }) => {
    const pala = PALA_WHATSAPP_CONTACTS[letter.lingkunganId] || PALA_WHATSAPP_CONTACTS[1];
    return `*PERMOHONAN SURAT MANDIRI WARGA*
*KELURAHAN KOLONGAN SATU, TOMOHON TENGAH*
----------------------------------------
*No. Registrasi :* ${letter.noRegistrasi}
*Tanggal        :* ${new Date().toLocaleDateString('id-ID')}

*DATA PEMOHON:*
*Nama Lengkap   :* ${letter.namaPemohon}
*NIK            :* ${letter.nikPemohon}
*No. WhatsApp   :* ${letter.nomorWaPemohon}
*Wilayah Jaga   :* Lingkungan ${letter.lingkunganId} (${pala.nama})
*Pekerjaan      :* ${letter.pekerjaan || 'Wiraswasta'}
*Alamat Lengkap :* ${letter.alamatLengkap || `Lingkungan ${letter.lingkunganId}, Kolongan Satu`}

*DETAIL PERMOHONAN:*
*Jenis Surat    :* ${letter.jenisSurat}
*Tujuan/Perlu   :* ${letter.tujuanKeperluan}
*Lampiran       :* ${letter.berkasName || 'KTP & KK'}

----------------------------------------
_Permohonan ini telah tercatat resmi di database sistem Kelurahan Kolongan Satu. Mohon bantuan Bapak/Ibu aparatur kelurahan untuk verifikasi berkas permohonan surat ini. Terima kasih._`;
  };

  // Format Pesan Pemberitahuan Status Pelayanan
  const getComposedStatusMessage = (letter: LetterRequest) => {
    let statusText = 'Diajukan Warga (Menunggu Verifikasi Berkas)';
    if (letter.statusSurat === 'diverifikasi_staf') {
      statusText = 'Diverifikasi Staf Pelayanan & Menunggu Paraf Seklur';
    } else if (letter.statusSurat === 'diparaf_seklur') {
      statusText = 'Telah Diparaf Seklur & Menunggu TTD Elektronik Lurah';
    } else if (letter.statusSurat === 'selesai_disahkan') {
      statusText = 'SELESAI & DISAHKAN LURAH (Siap Diambil / Diunduh)';
    }

    return `*PEMBERITAHUAN STATUS PELAYANAN SURAT*
*PEMERINTAH KELURAHAN KOLONGAN SATU*
----------------------------------------
Yth. Bpk/Ibu *${letter.namaPemohon}*,
Berikut status perkembangan berkas permohonan surat Anda di Kantor Kelurahan:

• *No. Registrasi :* ${letter.noRegistrasi}
• *Jenis Surat    :* ${letter.jenisSurat}
• *Tanggal Masuk  :* ${letter.tanggalDiajukan}
• *Status Terkini :* ${statusText}
${letter.catatanPetugas ? `• *Catatan Petugas:* ${letter.catatanPetugas}\n` : ''}
${
  letter.statusSurat === 'selesai_disahkan'
    ? 'Dokumen surat resmi Anda telah disahkan dan siap diambil di Kantor Kelurahan atau dicetak mandiri.'
    : 'Berkas Anda sedang diproses sesuai tahapan SOP pelayanan kelurahan.'
}

Terima kasih atas kerja samanya.
_Sekretariat Kelurahan Kolongan Satu, Tomohon Tengah_`;
  };

  // Format Pesan Penerbitan Dokumen PDF Resmi
  const getComposedPdfMessage = (letter: LetterRequest) => {
    return `*DOKUMEN SURAT RESMI TELAH TERBIT (FORMAT PDF)*
*PEMERINTAH KELURAHAN KOLONGAN SATU, TOMOHON TENGAH*
--------------------------------------------------
Yth. Bpk/Ibu *${letter.namaPemohon}*,

Permohonan surat keterangan Anda telah selesai diproses dan disahkan oleh Lurah Kolongan Satu. Dokumen resmi telah diterbitkan dalam format PDF resmi:

• *No. Registrasi :* ${letter.noRegistrasi}
• *Jenis Surat    :* ${letter.jenisSurat}
• *Tanggal Terbit :* ${letter.tanggalDiajukan}
• *Pengesahan     :* Lurah Theresia J. Kaunang, SE
• *Format Berkas  :* Dokumen Resmi PDF Ber-Kop & QR Code

Berikut dokumen resmi PDF permohonan surat Anda telah diterbitkan. Berkas PDF ini sah dan dapat disimpan/dicetak langsung untuk keperluan administrasi resmi Anda.

Terima kasih atas kerja samanya.
_Sekretariat Kantor Kelurahan Kolongan Satu, Tomohon Tengah_`;
  };

  // Handle Form Submission with Real API Call & WhatsApp Target Options
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik || !nama || !wa || !keperluan) {
      setSubmitError('Mohon lengkapi NIK, Nama Pemohon, Nomor WhatsApp, dan Keperluan permohonan!');
      return;
    }
    if (targetTujuan === 'custom' && !customWaNumber.trim()) {
      setSubmitError('Mohon masukkan nomor WhatsApp tujuan uji coba kustom!');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    let cleanPhone = '6289529175850';
    let targetLabel = KELURAHAN_PERSURATAN_WHATSAPP.nama;

    if (targetTujuan === 'custom') {
      cleanPhone = cleanPhoneTo62(customWaNumber);
      targetLabel = `Nomor Uji Coba (${customWaNumber})`;
    } else if (targetTujuan === 'pala') {
      const pala = PALA_WHATSAPP_CONTACTS[lingkunganId] || PALA_WHATSAPP_CONTACTS[1];
      cleanPhone = cleanPhoneTo62(pala.phone);
      targetLabel = pala.label;
    } else {
      cleanPhone = cleanPhoneTo62(KELURAHAN_PERSURATAN_WHATSAPP.phone);
      targetLabel = KELURAHAN_PERSURATAN_WHATSAPP.nama;
    }

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

      // Generate WhatsApp Link & Direct immediately
      const waMsg = getComposedWhatsAppMessage(newLetter);
      const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waMsg)}`;
      setLastWaUrl(waUrl);
      setLastTargetName(targetLabel);

      // Open WhatsApp in new window/tab
      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }

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

      const waMsg = getComposedWhatsAppMessage(fallbackReq);
      const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waMsg)}`;
      setLastWaUrl(waUrl);
      setLastTargetName(targetLabel);

      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Buka Modal Dialog Pengiriman WhatsApp (Kirim Status ke Pemohon / Coba Nomor Lain)
  const handleOpenSendStatusWaModal = (letter: LetterRequest) => {
    setWaModal({
      isOpen: true,
      letter,
      type: 'status',
      targetPhone: letter.nomorWaPemohon,
      customPhone: '',
      useCustomPhone: false,
      copied: false,
    });
  };

  // Buka Modal Dialog Pengiriman WhatsApp (Kirim PDF ke Pemohon / Coba Nomor Lain)
  const handleOpenSendPdfWaModal = (letter: LetterRequest) => {
    setWaModal({
      isOpen: true,
      letter,
      type: 'pdf',
      targetPhone: letter.nomorWaPemohon,
      customPhone: '',
      useCustomPhone: false,
      copied: false,
    });
  };

  // Eksekusi buka WhatsApp dari modal dialog pengiriman
  const handleExecuteDispatchWa = () => {
    if (!waModal.letter) return;
    const phoneToUse = waModal.useCustomPhone
      ? waModal.customPhone
      : (waModal.targetPhone || waModal.letter.nomorWaPemohon);
    const cleanPhone = cleanPhoneTo62(phoneToUse) || '6289529175850';

    const message =
      waModal.type === 'pdf'
        ? getComposedPdfMessage(waModal.letter)
        : getComposedStatusMessage(waModal.letter);

    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }
    setWaModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Helper untuk testing nomor lain pada saat surat baru diajukan
  const handleTestOtherPhoneOnSubmittedLetter = (phoneInput: string) => {
    if (!phoneInput.trim() || !submittedLetter) return;
    const clean = cleanPhoneTo62(phoneInput);
    const message = getComposedWhatsAppMessage(submittedLetter);
    const url = `https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(message)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#dae2fd]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#dae2fd] bg-gradient-to-r from-primary via-[#00527c] to-[#004266] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                {isPortalView ? 'Alur & Proses Penerbitan Dokumen Surat Resmi (PDF)' : 'Pusat Rekapitulasi & Pelayanan Persuratan'}
              </h2>
              <p className="text-xs text-sky-100 mt-0.5">
                {isPortalView
                  ? 'Verifikasi Berkas, Paraf Seklur, Pengesahan TTD Lurah & Pengiriman Berkas PDF Resmi'
                  : 'Pemerintah Kelurahan Kolongan Satu, Kecamatan Tomohon Tengah'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="p-3 bg-slate-50/90 border-b border-[#dae2fd] overflow-x-auto">
          {!isPortalView ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('daftar');
                  setSubmittedLetter(null);
                }}
                className={`px-4 py-2 font-bold text-xs rounded-xl transition flex items-center space-x-2 shrink-0 cursor-pointer ${
                  activeTab === 'daftar'
                    ? 'bg-white border border-[#dae2fd] text-primary shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Rekap &amp; Antrean Surat</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary font-bold">
                  {letters.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('katalog');
                  setSubmittedLetter(null);
                }}
                className={`px-4 py-2 font-bold text-xs rounded-xl transition flex items-center space-x-2 shrink-0 cursor-pointer ${
                  activeTab === 'katalog'
                    ? 'bg-white border border-[#dae2fd] text-primary shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>Katalog &amp; Syarat Berkas</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                  {KATALOG_SURAT_GUIDE.length} Jenis
                </span>
              </button>

              <button
                onClick={() => setActiveTab('ajukan')}
                className={`px-4 py-2 font-bold text-xs rounded-xl transition flex items-center space-x-2 shrink-0 cursor-pointer ${
                  activeTab === 'ajukan'
                    ? 'bg-white border border-[#dae2fd] text-primary shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Ajukan Surat Mandiri</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('lacak');
                  setSubmittedLetter(null);
                }}
                className={`px-4 py-2 font-bold text-xs rounded-xl transition flex items-center space-x-2 shrink-0 cursor-pointer ${
                  activeTab === 'lacak'
                    ? 'bg-white border border-[#dae2fd] text-primary shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>Lacak Resi Permohonan</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* PORTAL PIPELINE STAGES FILTER */}
              <button
                onClick={() => setPortalFilter('semua')}
                className={`px-3.5 py-2 font-bold text-xs rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                  portalFilter === 'semua'
                    ? 'bg-white border border-[#dae2fd] text-primary shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-primary" />
                <span>Semua Berkas</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  portalFilter === 'semua' ? 'bg-primary/10 text-primary' : 'bg-slate-200/80 text-slate-700'
                }`}>
                  {letters.length}
                </span>
              </button>

              <button
                onClick={() => setPortalFilter('diajukan')}
                className={`px-3.5 py-2 font-bold text-xs rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                  portalFilter === 'diajukan'
                    ? 'bg-white border border-amber-300 text-amber-900 shadow-xs ring-1 ring-amber-400/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>1. Menunggu Verifikasi Staf</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
                  {letters.filter((l) => l.statusSurat === 'diajukan').length}
                </span>
              </button>

              <button
                onClick={() => setPortalFilter('diverifikasi_staf')}
                className={`px-3.5 py-2 font-bold text-xs rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                  portalFilter === 'diverifikasi_staf'
                    ? 'bg-white border border-sky-300 text-primary shadow-xs ring-1 ring-primary/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                <span>2. Menunggu Paraf Seklur</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary font-bold">
                  {letters.filter((l) => l.statusSurat === 'diverifikasi_staf').length}
                </span>
              </button>

              <button
                onClick={() => setPortalFilter('diparaf_seklur')}
                className={`px-3.5 py-2 font-bold text-xs rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                  portalFilter === 'diparaf_seklur'
                    ? 'bg-white border border-sky-300 text-primary shadow-xs ring-1 ring-primary/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>3. Menunggu Pengesahan Lurah</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-sky-100 text-sky-800 font-bold">
                  {letters.filter((l) => l.statusSurat === 'diparaf_seklur').length}
                </span>
              </button>

              <button
                onClick={() => setPortalFilter('selesai_disahkan')}
                className={`px-3.5 py-2 font-bold text-xs rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                  portalFilter === 'selesai_disahkan'
                    ? 'bg-white border border-emerald-300 text-emerald-900 shadow-xs ring-1 ring-emerald-400/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>4. Selesai &amp; Terbit PDF</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                  {letters.filter((l) => l.statusSurat === 'selesai_disahkan').length}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#faf8ff]">
          {/* TAB 1: DAFTAR BERKAS */}
          {activeTab === 'daftar' && (
            <div className="space-y-4">
              {/* Rekap 4 Metrik Statistik Pelayanan Surat */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-[#dae2fd] shadow-xs hover:border-primary/40 transition-all">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Total Surat Masuk</span>
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1.5">{letters.length}</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Semua permohonan aktif</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#dae2fd] shadow-xs hover:border-amber-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">Menunggu Verifikasi</span>
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1.5">
                    {letters.filter((l) => l.statusSurat === 'diajukan').length}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Antrean staf kelurahan</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#dae2fd] shadow-xs hover:border-primary/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary">Proses / Paraf Seklur</span>
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <BadgeCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1.5">
                    {letters.filter((l) => l.statusSurat === 'diverifikasi_staf' || l.statusSurat === 'diparaf_seklur').length}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Verifikasi &amp; paraf Seklur</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#dae2fd] shadow-xs hover:border-emerald-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">Selesai &amp; Sah</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1.5">
                    {letters.filter((l) => l.statusSurat === 'selesai_disahkan').length}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Disahkan Lurah Theresia</p>
                </div>
              </div>

              {/* Status Session & Workflow Ribbon */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs bg-white p-3.5 rounded-2xl border border-[#dae2fd] shadow-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500">Masuk Sebagai: </span>
                    <strong className="text-slate-900">{currentOfficial.name}</strong>{' '}
                    <span className="text-slate-500 text-[11px]">({currentOfficial.roleTitle})</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-[#faf8ff] px-3 py-1.5 rounded-xl border border-[#dae2fd]/70">
                  <span className="font-semibold text-slate-700">Alur:</span>
                  <span className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-medium">Warga</span>
                  <span>&rarr;</span>
                  <span className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-medium">Staf Karlin</span>
                  <span>&rarr;</span>
                  <span className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-medium">Seklur Febronia</span>
                  <span>&rarr;</span>
                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-bold">TTD Lurah Theresia</span>
                </div>
              </div>

              <div className="space-y-3.5">
                {(() => {
                  const displayedLetters =
                    isPortalView && portalFilter !== 'semua'
                      ? letters.filter((l) => l.statusSurat === portalFilter)
                      : letters;

                  if (displayedLetters.length === 0) {
                    return (
                      <div className="bg-white rounded-2xl border border-dashed border-[#dae2fd] p-8 text-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 mx-auto flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-xs font-bold text-slate-700">Tidak ada surat dalam tahapan ini</p>
                        <p className="text-[11px] text-slate-400">
                          Semua permohonan telah selesai diproses atau berada di tahapan alur pelayanan lainnya.
                        </p>
                      </div>
                    );
                  }

                  return displayedLetters.map((letter) => {
                    const isDone = letter.statusSurat === 'selesai_disahkan';
                    const isStafVerified = letter.statusSurat === 'diverifikasi_staf';
                    const isSeklurParaf = letter.statusSurat === 'diparaf_seklur';
                    const isNew = letter.statusSurat === 'diajukan';

                    return (
                      <div
                        key={letter.id}
                        className="bg-white rounded-2xl border border-[#dae2fd] p-5 shadow-xs hover:border-primary/40 hover:shadow-sm transition-all space-y-3.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/20">
                                {letter.noRegistrasi}
                              </span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs text-slate-500">{letter.tanggalDiajukan}</span>
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                              {letter.jenisSurat}
                            </h3>
                          </div>

                          {/* Status badge */}
                          <div>
                            {isDone ? (
                              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Selesai &amp; Terbit PDF</span>
                              </span>
                            ) : isSeklurParaf ? (
                              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-sky-50 text-primary border border-primary/30 rounded-full text-xs font-bold">
                                <Clock className="w-3.5 h-3.5 text-primary" />
                                <span>Paraf Seklur (Siap TTD Lurah)</span>
                              </span>
                            ) : isStafVerified ? (
                              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-xs font-bold">
                                <Clock className="w-3.5 h-3.5 text-blue-600" />
                                <span>Diverifikasi Staf Karlin</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Diajukan Warga</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Visual Workflow Stepper for Issuing the Letter in Portal */}
                        {isPortalView && (
                          <div className="bg-[#faf8ff] rounded-2xl p-3.5 border border-[#dae2fd]">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-2.5">
                              <span className="flex items-center gap-1.5 text-slate-900">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                Alur &amp; Tahapan Penerbitan Dokumen Resmi:
                              </span>
                              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                                Output: Dokumen PDF Resmi
                              </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              {/* 1. Berkas Masuk */}
                              <div
                                className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                                  letter.statusSurat !== 'diajukan'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium'
                                    : 'bg-white border-amber-300 text-amber-950 font-bold ring-2 ring-amber-400/20 shadow-2xs'
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold shrink-0 ${
                                    letter.statusSurat !== 'diajukan'
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-amber-600 text-white'
                                  }`}
                                >
                                  1
                                </span>
                                <div>
                                  <p className="font-bold text-[11px] leading-tight">Berkas Masuk</p>
                                  <p className="text-[9px] text-slate-500">Diajukan warga</p>
                                </div>
                              </div>

                              {/* 2. Verifikasi Staf */}
                              <div
                                className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                                  letter.statusSurat === 'diparaf_seklur' ||
                                  letter.statusSurat === 'selesai_disahkan'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium'
                                    : letter.statusSurat === 'diverifikasi_staf'
                                    ? 'bg-white border-primary text-slate-900 font-bold ring-2 ring-primary/20 shadow-2xs'
                                    : 'bg-white/60 border-slate-200 text-slate-400'
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold shrink-0 ${
                                    letter.statusSurat === 'diparaf_seklur' ||
                                    letter.statusSurat === 'selesai_disahkan'
                                      ? 'bg-emerald-600 text-white'
                                      : letter.statusSurat === 'diverifikasi_staf'
                                      ? 'bg-primary text-white'
                                      : 'bg-slate-200 text-slate-500'
                                  }`}
                                >
                                  2
                                </span>
                                <div>
                                  <p className="font-bold text-[11px] leading-tight">Verifikasi Berkas</p>
                                  <p className="text-[9px] text-slate-500">
                                    {letter.diparafOleh || 'Staf Karlin'}
                                  </p>
                                </div>
                              </div>

                              {/* 3. Paraf Seklur */}
                              <div
                                className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                                  letter.statusSurat === 'selesai_disahkan'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium'
                                    : letter.statusSurat === 'diparaf_seklur'
                                    ? 'bg-white border-primary text-slate-900 font-bold ring-2 ring-primary/20 shadow-2xs'
                                    : 'bg-white/60 border-slate-200 text-slate-400'
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold shrink-0 ${
                                    letter.statusSurat === 'selesai_disahkan'
                                      ? 'bg-emerald-600 text-white'
                                      : letter.statusSurat === 'diparaf_seklur'
                                      ? 'bg-primary text-white'
                                      : 'bg-slate-200 text-slate-500'
                                  }`}
                                >
                                  3
                                </span>
                                <div>
                                  <p className="font-bold text-[11px] leading-tight">Paraf Seklur</p>
                                  <p className="text-[9px] text-slate-500">Seklur Febronia</p>
                                </div>
                              </div>

                              {/* 4. Pengesahan Lurah & Terbit PDF */}
                              <div
                                className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                                  letter.statusSurat === 'selesai_disahkan'
                                    ? 'bg-white border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-500/20 shadow-2xs'
                                    : 'bg-white/60 border-slate-200 text-slate-400'
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold shrink-0 ${
                                    letter.statusSurat === 'selesai_disahkan'
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-200 text-slate-500'
                                  }`}
                                >
                                  4
                                </span>
                                <div>
                                  <p className="font-bold text-[11px] leading-tight">TTD &amp; Terbit PDF</p>
                                  <p className="text-[9px] text-slate-500">Lurah Theresia</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Applicant Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#faf8ff] p-3.5 rounded-2xl border border-[#dae2fd]/70">
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                              <User className="w-3 h-3 text-primary" />
                              Pemohon
                            </p>
                            <p className="font-bold text-slate-900 text-sm">{letter.namaPemohon}</p>
                            <p className="text-[11px] text-slate-500 font-mono">NIK: {letter.nikPemohon}</p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-primary" />
                              Lingkungan &amp; WA
                            </p>
                            <p className="font-semibold text-slate-800">
                              Lingkungan {letter.lingkunganId} (Jaga {letter.lingkunganId})
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono">{letter.nomorWaPemohon}</p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                              <FileText className="w-3 h-3 text-primary" />
                              Keperluan Surat
                            </p>
                            <p className="text-slate-800 line-clamp-2 leading-relaxed">{letter.tujuanKeperluan}</p>
                          </div>
                        </div>

                        {/* Workflow Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                            {letter.berkasName && (
                              <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 border border-slate-200 flex items-center gap-1.5 font-medium">
                                <Paperclip className="w-3 h-3 text-slate-500" />
                                <span>{letter.berkasName}</span>
                              </span>
                            )}
                            {letter.diparafOleh && (
                              <span className="text-primary font-medium flex items-center gap-1 bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">
                                <CheckCircle2 className="w-3 h-3 text-primary" />
                                <span>Diparaf: {letter.diparafOleh}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Role Action: Staf Karlin verifies */}
                            {(currentOfficial.roleCode === 'pelaksana_adm' ||
                              currentOfficial.roleCode === 'superadmin' ||
                              currentOfficial.roleCode === 'admin_seklur') &&
                              isNew && (
                                <button
                                  onClick={() =>
                                    onUpdateStatus(
                                      letter.id,
                                      'diverifikasi_staf',
                                      'Berkas KTP/KK telah diverifikasi oleh Staf Karlin'
                                    )
                                  }
                                  className="px-3.5 py-2 bg-primary hover:bg-[#004d77] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                                >
                                  <BadgeCheck className="w-3.5 h-3.5" />
                                  <span>Verifikasi Berkas Staf</span>
                                </button>
                              )}

                            {/* Role Action: Seklur Febronia paraf */}
                            {(currentOfficial.roleCode === 'admin_seklur' ||
                              currentOfficial.roleCode === 'superadmin') &&
                              (isStafVerified || isNew) && (
                                <button
                                  onClick={() =>
                                    onUpdateStatus(
                                      letter.id,
                                      'diparaf_seklur',
                                      'Paraf verifikasi administratif oleh Seklur Febronia L. Pijoh, S.Kom'
                                    )
                                  }
                                  className="px-3.5 py-2 bg-primary hover:bg-[#004d77] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                                >
                                  <BadgeCheck className="w-3.5 h-3.5" />
                                  <span>Beri Paraf Seklur</span>
                                </button>
                              )}

                            {/* Role Action: Lurah Theresia approves & digital signs */}
                            {currentOfficial.roleCode === 'superadmin' && isSeklurParaf && (
                              <button
                                onClick={() =>
                                  onUpdateStatus(
                                    letter.id,
                                    'selesai_disahkan',
                                    'Disahkan dan ditandatangani elektronik oleh Lurah Theresia J. Kaunang, SE'
                                  )
                                }
                                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Sahkan &amp; Terbitkan PDF</span>
                              </button>
                            )}

                            {/* Pengiriman Surat via PDF Resmi */}
                            {isDone ? (
                              <>
                                <button
                                  onClick={() => handleOpenSendPdfWaModal(letter)}
                                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                                  title="Kirim notifikasi penerbitan berkas surat resmi PDF ke WhatsApp pemohon atau coba nomor lain"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Kirim Berkas PDF ke Pemohon</span>
                                </button>

                                <button
                                  onClick={() => onPrintLetter(letter)}
                                  className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                                  title="Cetak atau Unduh Dokumen Resmi Format PDF"
                                >
                                  <Printer className="w-3.5 h-3.5 text-sky-400" />
                                  <span>Unduh / Cetak Dokumen PDF</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleOpenSendStatusWaModal(letter)}
                                  className="px-3.5 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                                  title="Kirim perkembangan status surat ke nomor WhatsApp pemohon atau coba nomor lain"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Kirim Status ke WA</span>
                                </button>

                                <button
                                  onClick={() => onPrintLetter(letter)}
                                  className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
                                  title="Pratinjau draf surat sebelum pengesahan"
                                >
                                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Pratinjau Draf PDF</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* TAB 2: KATALOG & PERSYARATAN BERKAS RESMI */}
          {!isPortalView && activeTab === 'katalog' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    Standar Operasional Prosedur (SOP) & Persyaratan Surat Warga
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Daftar resmi kelengkapan berkas warga Kelurahan Kolongan Satu. Seluruh layanan persuratan 100% Bebas Biaya (Gratis).
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs shrink-0">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold">
                    Biaya: Rp 0 (Gratis)
                  </span>
                  <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg font-bold">
                    Waktu: 1 Hari Kerja
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {KATALOG_SURAT_GUIDE.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-sky-300 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide bg-sky-100 text-sky-800 rounded-full border border-sky-200">
                          {item.singkatan}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {item.biaya}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{item.nama}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.deskripsi}</p>

                      <div className="mt-3.5 pt-3 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CheckSquare className="w-3.5 h-3.5 text-sky-600" />
                          Syarat Dokumen Diperlukan:
                        </p>
                        <ul className="space-y-1.5">
                          {item.persyaratan.map((syarat, idx) => (
                            <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                              <span className="text-sky-500 font-bold">•</span>
                              <span>{syarat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {item.keterangan && (
                        <p className="mt-3 text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                          Catatan: {item.keterangan}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {item.waktuPelayanan}
                      </span>
                      <button
                        onClick={() => {
                          setJenisSurat(item.nama);
                          setActiveTab('ajukan');
                        }}
                        className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-2xs"
                      >
                        <span>Buat Surat Ini</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AJUKAN SURAT MANDIRI */}
          {!isPortalView && activeTab === 'ajukan' && (
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
                  <div className="flex flex-col gap-3 pt-2">
                    {lastWaUrl && (
                      <a
                        href={lastWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Kirim / Buka WhatsApp Resmi ({lastTargetName})</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </a>
                    )}

                    {/* Fitur Uji Coba Kirim ke Nomor WhatsApp Lainnya */}
                    <div className="p-3.5 bg-[#f0f9ff] rounded-2xl border border-[#bae6fd] space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-[#006194]" />
                        <span className="text-xs font-bold text-[#006194]">
                          Uji Coba Kirim ke Nomor WhatsApp Lainnya:
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Ingin menguji coba pengiriman pesan permohonan ini ke nomor WhatsApp Anda sendiri atau nomor lain?
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="tel"
                          value={testOtherWaNumber}
                          onChange={(e) => setTestOtherWaNumber(e.target.value)}
                          placeholder="Masukkan nomor WA (Contoh: 0812-4411-9988)..."
                          className="flex-1 bg-white border border-[#bae6fd] rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006194]"
                        />
                        <button
                          type="button"
                          onClick={() => handleTestOtherPhoneOnSubmittedLetter(testOtherWaNumber)}
                          disabled={!testOtherWaNumber.trim()}
                          className="px-4 py-2 bg-[#006194] hover:bg-[#004e77] text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Tes Kirim ke Nomor Ini</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
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
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Formulir Permohonan Surat Mandiri</h3>
                    <p className="text-xs text-slate-500">
                      Layanan terpadu satu atap kantor Kelurahan Kolongan Satu terhubung langsung ke database kelurahan dan WhatsApp petugas.
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

                    {/* Target WhatsApp Destination Selector */}
                    <div className="md:col-span-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                          <span>Pilih Nomor / Tujuan Pengiriman WhatsApp:</span>
                        </label>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Direct WhatsApp Aktif
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* Option 1: Kantor Kelurahan */}
                        <label
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                            targetTujuan === 'kelurahan'
                              ? 'bg-sky-50/80 border-sky-400 text-sky-950 font-semibold shadow-2xs ring-1 ring-sky-300'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="targetWa"
                            checked={targetTujuan === 'kelurahan'}
                            onChange={() => setTargetTujuan('kelurahan')}
                            className="mt-0.5 text-sky-600 focus:ring-sky-500"
                          />
                          <div className="leading-tight">
                            <span className="font-bold block text-slate-900">Kantor Kelurahan</span>
                            <span className="text-[11px] text-sky-700 font-mono font-medium block mt-0.5">{KELURAHAN_PERSURATAN_WHATSAPP.phone}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">Layanan Satu Atap</span>
                          </div>
                        </label>

                        {/* Option 2: Kepala Lingkungan */}
                        <label
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                            targetTujuan === 'pala'
                              ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 font-semibold shadow-2xs ring-1 ring-emerald-300'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="targetWa"
                            checked={targetTujuan === 'pala'}
                            onChange={() => setTargetTujuan('pala')}
                            className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div className="leading-tight">
                            <span className="font-bold block text-slate-900">{PALA_WHATSAPP_CONTACTS[lingkunganId]?.label || `Pala Jaga ${lingkunganId}`}</span>
                            <span className="text-[11px] text-emerald-700 font-mono font-medium block mt-0.5">{PALA_WHATSAPP_CONTACTS[lingkunganId]?.phone}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{PALA_WHATSAPP_CONTACTS[lingkunganId]?.nama}</span>
                          </div>
                        </label>

                        {/* Option 3: Uji Coba Nomor Lain */}
                        <label
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                            targetTujuan === 'custom'
                              ? 'bg-amber-50/80 border-amber-400 text-amber-950 font-semibold shadow-2xs ring-1 ring-amber-300'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="targetWa"
                            checked={targetTujuan === 'custom'}
                            onChange={() => setTargetTujuan('custom')}
                            className="mt-0.5 text-amber-600 focus:ring-amber-500"
                          />
                          <div className="leading-tight">
                            <span className="font-bold block text-slate-900">Uji Coba Nomor Lain</span>
                            <span className="text-[11px] text-amber-800 font-semibold block mt-0.5">Kirim ke Nomor Sendiri</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">Ketik nomor uji coba</span>
                          </div>
                        </label>
                      </div>

                      {/* Input Nomor Kustom jika memilih opsi 3 */}
                      {targetTujuan === 'custom' && (
                        <div className="p-3 bg-white rounded-xl border border-amber-300 animate-in fade-in space-y-1">
                          <label className="block text-xs font-bold text-amber-900">
                            Masukkan Nomor WhatsApp Tujuan Pengujian:
                          </label>
                          <input
                            type="tel"
                            required={targetTujuan === 'custom'}
                            value={customWaNumber}
                            onChange={(e) => setCustomWaNumber(e.target.value)}
                            placeholder="Contoh: 0812-4411-9988..."
                            className="w-full bg-slate-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <span className="text-[10px] text-slate-500 block">
                            Pesan permohonan surat akan dikirim ke nomor WhatsApp ini untuk tujuan testing simulasi.
                          </span>
                        </div>
                      )}

                      <p className="text-[11px] text-slate-500 leading-normal flex items-start gap-1.5 pt-0.5">
                        <span className="text-emerald-600 font-bold">ℹ</span>
                        <span>Saat menekan tombol kirim di bawah, permohonan akan otomatis tersimpan di sistem kelurahan dan jendela WhatsApp akan langsung terbuka dengan format surat yang siap dikirim.</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('daftar')}
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition flex items-center space-x-2 disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Menyimpan &amp; Menyiapkan WhatsApp...</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Kirim Permohonan Surat Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: LACAK STATUS REGISTRASI */}
          {!isPortalView && activeTab === 'lacak' && (
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
                        { step: 3, title: 'Diparaf Seklur', desc: 'Febronia L. Pijoh, S.Kom', sub: 'Paraf Administratif' },
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

      {/* MODAL DIALOG PENGIRIMAN WHATSAPP (Kirim Status / PDF dengan Pilihan Nomor Bebas) */}
      {waModal.isOpen && waModal.letter && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-[#dae2fd] animate-in zoom-in-95 duration-150">
            {/* Header Dialog */}
            <div className="p-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">
                    {waModal.type === 'pdf' ? 'Kirim Dokumen PDF Resmi via WhatsApp' : 'Kirim Status Progres Surat via WhatsApp'}
                  </h3>
                  <p className="text-[11px] text-emerald-100">
                    {waModal.letter.noRegistrasi} • {waModal.letter.namaPemohon}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWaModal((prev) => ({ ...prev, isOpen: false }))}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body Dialog */}
            <div className="p-5 space-y-4 text-xs">
              {/* Pilihan Nomor Tujuan */}
              <div className="space-y-2 bg-[#faf8ff] p-3.5 rounded-2xl border border-[#dae2fd]">
                <label className="block text-xs font-bold text-slate-800">
                  Pilih Nomor WhatsApp Tujuan:
                </label>

                {/* Option A: Nomor Pemohon Terdaftar */}
                <label
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                    !waModal.useCustomPhone
                      ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/15 shadow-2xs'
                      : 'bg-white/60 border-slate-200 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="waDispatchOption"
                    checked={!waModal.useCustomPhone}
                    onChange={() => setWaModal((prev) => ({ ...prev, useCustomPhone: false }))}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Nomor Pemohon Terdaftar
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-emerald-700 block mt-0.5">
                      {waModal.targetPhone || waModal.letter.nomorWaPemohon || '-'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Kirim langsung ke kontak warga yang terdaftar pada form permohonan.
                    </span>
                  </div>
                </label>

                {/* Option B: Uji Coba dengan Nomor Lain */}
                <label
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                    waModal.useCustomPhone
                      ? 'bg-white border-[#006194] ring-2 ring-[#006194]/15 shadow-2xs'
                      : 'bg-white/60 border-slate-200 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="waDispatchOption"
                    checked={waModal.useCustomPhone}
                    onChange={() => setWaModal((prev) => ({ ...prev, useCustomPhone: true }))}
                    className="mt-0.5 text-[#006194] focus:ring-[#006194]"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 block">
                      Uji Coba dengan Nomor WhatsApp Lain
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Gunakan nomor HP Anda sendiri atau nomor lain untuk mencoba pengiriman langsung dari web.
                    </span>
                  </div>
                </label>

                {/* Input Nomor Kustom */}
                {waModal.useCustomPhone && (
                  <div className="pt-2 animate-in fade-in space-y-1">
                    <input
                      type="tel"
                      value={waModal.customPhone}
                      onChange={(e) =>
                        setWaModal((prev) => ({ ...prev, customPhone: e.target.value }))
                      }
                      placeholder="Masukkan nomor WA (Contoh: 0812-4411-9988)..."
                      className="w-full bg-white border border-[#006194] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Pratinjau Pesan yang Akan Dikirim */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-[11px]">
                    Pratinjau Pesan Resmi:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const msg =
                        waModal.type === 'pdf'
                          ? getComposedPdfMessage(waModal.letter!)
                          : getComposedStatusMessage(waModal.letter!);
                      if (navigator?.clipboard) {
                        navigator.clipboard.writeText(msg);
                        setWaModal((prev) => ({ ...prev, copied: true }));
                        setTimeout(() => setWaModal((prev) => ({ ...prev, copied: false })), 2000);
                      }
                    }}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 cursor-pointer"
                  >
                    {waModal.copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{waModal.copied ? 'Tersalin' : 'Salin Teks'}</span>
                  </button>
                </div>
                <div className="bg-[#e7fce3] p-3 rounded-xl border border-[#bbf7a0] text-[#0f2a1d] max-h-36 overflow-y-auto whitespace-pre-line text-[11px] leading-relaxed">
                  {waModal.type === 'pdf'
                    ? getComposedPdfMessage(waModal.letter)
                    : getComposedStatusMessage(waModal.letter)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setWaModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDispatchWa}
                  disabled={waModal.useCustomPhone && !waModal.customPhone.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#006c49] hover:bg-[#005237] text-white shadow-md shadow-[#006c49]/20 transition flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Buka WhatsApp &amp; Kirim Sekarang</span>
                  <ExternalLink className="w-3 h-3 text-emerald-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
