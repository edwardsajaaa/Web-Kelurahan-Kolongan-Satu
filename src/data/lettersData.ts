export interface LetterRequest {
  id: string;
  noRegistrasi: string;
  nikPemohon: string;
  namaPemohon: string;
  nomorWaPemohon: string;
  jenisSurat: string;
  lingkunganId: number;
  tujuanKeperluan: string;
  alamatLengkap: string;
  pekerjaan: string;
  berkasLampiranUrl?: string;
  berkasName?: string;
  statusSurat: 'diajukan' | 'diverifikasi_staf' | 'diparaf_seklur' | 'selesai_disahkan' | 'ditolak';
  statusLabel: string;
  catatanPetugas?: string;
  diparafOleh?: string;
  disahkanOleh?: string;
  tanggalDiajukan: string;
  tanggalSelesai?: string;
}

export const INITIAL_LETTERS: LetterRequest[] = [
  {
    id: 'let-001',
    noRegistrasi: 'REG-KKT-2026-0038',
    nikPemohon: '7173010508920003',
    namaPemohon: 'Jonathan Billy Pangemanan',
    nomorWaPemohon: '0812-4411-9988',
    jenisSurat: 'Surat Keterangan Usaha (SKU)',
    lingkunganId: 3,
    tujuanKeperluan: 'Persyaratan Pengajuan KUR Mikro Usaha Perkebunan Bunga Krisan di Bank SulutGo',
    alamatLengkap: 'Jl. Lingkungan III, RT 02 / Lingk. 3, Kolongan Satu, Tomohon Tengah',
    pekerjaan: 'Wiraswasta / Petani Bunga',
    berkasName: 'KTP_dan_PBB_Billy.pdf',
    statusSurat: 'selesai_disahkan',
    statusLabel: 'Selesai & Disahkan Lurah',
    diparafOleh: 'Ferromel L. Pua, S.Kom (Seklur)',
    disahkanOleh: 'Theresia J. Kaunang, SE (Lurah)',
    catatanPetugas: 'Berkas lengkap dan sesuai verifikasi fisik lapangan Pala Jaga 3.',
    tanggalDiajukan: '26 Feb 2026 09:20 WITA',
    tanggalSelesai: '26 Feb 2026 14:10 WITA',
  },
  {
    id: 'let-002',
    noRegistrasi: 'REG-KKT-2026-0041',
    nikPemohon: '7173014210950002',
    namaPemohon: 'Prisilia Claudia Wenas',
    nomorWaPemohon: '0852-8877-2211',
    jenisSurat: 'Surat Keterangan Domisili Warga',
    lingkunganId: 1,
    tujuanKeperluan: 'Kelengkapan Berkas Pendaftaran Seleksi Calon Pegawai Negeri Sipil (CPNS)',
    alamatLengkap: 'Lingkungan I Kompleks Pertokoan Kolongan Satu, Kec. Tomohon Tengah',
    pekerjaan: 'Karyawan Swasta',
    berkasName: 'KartuKeluarga_Prisilia.pdf',
    statusSurat: 'diparaf_seklur',
    statusLabel: 'Menunggu Pengesahan TTD Lurah',
    diparafOleh: 'Ferromel L. Pua, S.Kom (Seklur)',
    catatanPetugas: 'Telah diparaf oleh Seklur, siap pengesahan akhir.',
    tanggalDiajukan: '01 Mar 2026 11:00 WITA',
  },
  {
    id: 'let-003',
    noRegistrasi: 'REG-KKT-2026-0042',
    nikPemohon: '7173011804880001',
    namaPemohon: 'Stenly Hendrik Posumah',
    nomorWaPemohon: '0813-7722-1100',
    jenisSurat: 'Surat Keterangan Tidak Mampu (SKTM)',
    lingkunganId: 4,
    tujuanKeperluan: 'Permohonan Bantuan Keringanan Biaya Kuliah Mahasiswa di Unsrat',
    alamatLengkap: 'Lingkungan IV, Kolongan Satu, Tomohon Tengah',
    pekerjaan: 'Buruh Harian Lepas',
    berkasName: 'SuratPengantar_Pala4.pdf',
    statusSurat: 'diverifikasi_staf',
    statusLabel: 'Diverifikasi Staf Pelaksana',
    catatanPetugas: 'Pemeriksaan berkas foto rumah dan rekomendasi Pala Jaga 4.',
    tanggalDiajukan: '02 Mar 2026 08:30 WITA',
  },
  {
    id: 'let-004',
    noRegistrasi: 'REG-KKT-2026-0045',
    nikPemohon: '7173016509990004',
    namaPemohon: 'Gabriella Meyta Walangitan',
    nomorWaPemohon: '0821-3344-5599',
    jenisSurat: 'Surat Pengantar Nikah (Model N1-N4)',
    lingkunganId: 2,
    tujuanKeperluan: 'Pencatatan Perkawinan di Kantor Urusan Agama / Catatan Sipil Tomohon',
    alamatLengkap: 'Lingkungan II Dekat Gereja GMIM Syalom, Kolongan Satu',
    pekerjaan: 'Guru Honorer',
    berkasName: 'KTP_KeduaMempelai_AktaLahir.pdf',
    statusSurat: 'diajukan',
    statusLabel: 'Baru Diajukan (Menunggu Review)',
    tanggalDiajukan: '02 Mar 2026 10:15 WITA',
  }
];

export const JENIS_SURAT_OPTIONS = [
  'Surat Keterangan Usaha (SKU)',
  'Surat Keterangan Domisili Warga',
  'Surat Keterangan Tidak Mampu (SKTM)',
  'Surat Pengantar Nikah (Model N1-N4)',
  'Surat Keterangan Kelahiran',
  'Surat Keterangan Kematian',
  'Surat Keterangan Bersih Diri / Catatan Baik Lingkungan',
  'Surat Izin Rekomendasi Keramaian / Acara Kedukaan / Sukacita'
];
