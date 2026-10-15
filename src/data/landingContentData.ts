// src/data/landingContentData.ts
// Centralized data types and default datasets for dynamic landing page content

export interface FasilitasItem {
  id: string;
  name: string;
  category: 'pemerintahan' | 'ibadah' | 'kesehatan' | 'pendidikan' | 'infrastruktur' | 'sanitasi_air';
  categoryLabel: string;
  categoryColor: string;
  jaga: string;
  alamat: string;
  deskripsi: string;
  status: string;
  gmapsUrl?: string;
}

export interface SanitasiStats {
  mataAir: string;
  sumurWarga: string;
  pdam: string;
  drainase: string;
  statusOdf: string;
  statusAir: string;
}

export interface AparaturData {
  lurah: {
    nama: string;
    nip: string;
    jabatan: string;
    phone: string;
    deskripsi?: string;
  };
  seklur: {
    nama: string;
    nip: string;
    jabatan: string;
    phone: string;
    deskripsi?: string;
  };
  pelaksana: {
    nama: string;
    nip: string;
    jabatan: string;
    phone: string;
  };
  kasie: Array<{
    id: string;
    badge: string;
    name: string;
    nip: string;
    pembantu: string;
    phone: string;
  }>;
  lingkungan: Array<{
    lingkungan: string;
    pala: string;
    mevrouw: string;
    phone?: string;
  }>;
}

export interface ActivitySlide {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  imageUrl: string;
  alt: string;
}

export interface KontakInfo {
  hotlineWa: string;
  alamatKantor: string;
  email: string;
  jamSeninKamis: string;
  jamJumat: string;
  jamWeekend: string;
}

export interface LandingContentPayload {
  fasilitas: FasilitasItem[];
  sanitasi: SanitasiStats;
  aparatur: AparaturData;
  kegiatan: ActivitySlide[];
  kontak: KontakInfo;
}

export const INITIAL_FASILITAS: FasilitasItem[] = [
  // 1. Pemerintahan & Kelembagaan
  {
    id: 'kantor-kelurahan',
    name: 'Kantor Kelurahan Kolongan Satu',
    category: 'pemerintahan',
    categoryLabel: 'Pusat Pemerintahan',
    categoryColor: 'bg-[#cce5ff] text-[#006194]',
    jaga: 'Jaga 2 (Sentral Administrasi)',
    alamat: 'Jl. Zanosui, Kelurahan Kolongan Satu',
    deskripsi: 'Pusat layanan administrasi kependudukan, pengurusan persuratan dinas, dan koordinasi aparatur 5 Jaga.',
    status: 'Permanen / Sangat Baik',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kantor+Kelurahan+Kolongan+Satu+Tomohon',
  },
  {
    id: 'lpka-tomohon',
    name: 'LPKA Kelas II Tomohon',
    category: 'pemerintahan',
    categoryLabel: 'Lembaga Pemasyarakatan Khusus Anak',
    categoryColor: 'bg-[#cce5ff] text-[#006194]',
    jaga: 'Jaga 1 & 2',
    alamat: 'Jl. Kolongan Satu (Sebelah Lapas Perempuan)',
    deskripsi: 'Lembaga Pembinaan Khusus Anak di bawah naungan Kementerian Hukum dan HAM RI.',
    status: 'Aktif Operasional',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=LPKA+Kelas+II+Tomohon',
  },
  {
    id: 'lapas-perempuan',
    name: 'Lapas Perempuan Kelas IIB Manado',
    category: 'pemerintahan',
    categoryLabel: 'Lapas Perempuan',
    categoryColor: 'bg-[#cce5ff] text-[#006194]',
    jaga: 'Jaga 2 (Wanua Atas)',
    alamat: 'Jl. Wanua Atas, Kolongan Satu',
    deskripsi: 'Lembaga Pemasyarakatan Perempuan Kelas IIB Manado yang berlokasi resmi di wilayah Kelurahan Kolongan Satu.',
    status: 'Aktif Operasional',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lapas+Perempuan+Kelas+IIB+Manado+Tomohon',
  },
  {
    id: 'kantor-walikota',
    name: 'Kawasan Kantor Walikota Tomohon',
    category: 'pemerintahan',
    categoryLabel: 'Pusat Pemerintahan Kota',
    categoryColor: 'bg-[#cce5ff] text-[#006194]',
    jaga: 'Jaga 4 (Sisi Barat)',
    alamat: 'Kawasan Jl. Sreko / Jl. Slanag',
    deskripsi: 'Kompleks pusat pemerintahan Kota Tomohon yang berbatasan langsung dengan koridor barat kelurahan.',
    status: 'Pusat Pemerintahan',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kantor+Walikota+Tomohon',
  },

  // 2. Sarana Ibadah
  {
    id: 'gmim-elohim',
    name: 'GMIM Elohim Kolongan 1',
    category: 'ibadah',
    categoryLabel: 'Gereja Protestan (GMIM)',
    categoryColor: 'bg-[#d3e4fe] text-[#004b73]',
    jaga: 'Jaga 2 & 3',
    alamat: 'Jl. Zanosui (Seberang WINS Dental)',
    deskripsi: 'Gedung gereja GMIM Elohim sebagai pusat peribadatan jemaat protestan terbesar di kelurahan.',
    status: 'Pelayanan Aktif',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=GMIM+Elohim+Kolongan+1+Tomohon',
  },
  {
    id: 'aula-st-petrus',
    name: 'Aula St. Petrus & Stasi Katolik',
    category: 'ibadah',
    categoryLabel: 'Sarana Ibadah & Gedung Serbaguna',
    categoryColor: 'bg-[#d3e4fe] text-[#004b73]',
    jaga: 'Jaga 1',
    alamat: 'Jl. P.L. Kaunang, Kolongan Satu',
    deskripsi: 'Gedung pertemuan dan stasi peribadatan jemaat Katolik untuk pembinaan rohani dan kemasyarakatan.',
    status: 'Pelayanan Aktif',
    gmapsUrl: 'https://www.google.com/maps?q=1.3178446908697126,124.8356077027369',
  },
  {
    id: 'christianos-edelweiss',
    name: 'Christianos Tomohon',
    category: 'ibadah',
    categoryLabel: 'Sarana Peribadatan Jemaat',
    categoryColor: 'bg-[#d3e4fe] text-[#004b73]',
    jaga: 'Jaga 1 (Edelweiss)',
    alamat: 'Kawasan Edelweiss, Koridor Timur Laut',
    deskripsi: 'Gedung peribadatan dan persekutuan komunitas kristiani di koridor timur laut kelurahan.',
    status: 'Pelayanan Aktif',
    gmapsUrl: 'https://www.google.com/maps?q=1.318251254526585,124.83430548951661',
  },

  // 3. Kesehatan & Olahraga
  {
    id: 'wins-dental',
    name: 'Klinik WINS Dental',
    category: 'kesehatan',
    categoryLabel: 'Layanan Kesehatan Gigi',
    categoryColor: 'bg-[#6cf8bb]/40 text-[#005236]',
    jaga: 'Jaga 2',
    alamat: 'Jl. Zanosui (Depan GMIM Elohim)',
    deskripsi: 'Klinik praktek perawatan dan estetika kesehatan gigi modern untuk warga Kolongan Satu dan sekitarnya.',
    status: 'Buka Setiap Hari Kerja',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=WINS+dental+Tomohon',
  },
  {
    id: 'pustu-kolongan',
    name: 'Puskesmas Pembantu (Pustu)',
    category: 'kesehatan',
    categoryLabel: 'Fasilitas Kesehatan Tingkat Pertama',
    categoryColor: 'bg-[#6cf8bb]/40 text-[#005236]',
    jaga: 'Jaga 2',
    alamat: 'Kompleks Pemukiman Kolongan Satu',
    deskripsi: 'Layanan pertolongan pertama, imunisasi, rawat jalan dasar, dan penyuluhan kesehatan warga.',
    status: 'Tersedia / Rutin',
  },
  {
    id: 'posyandu-terpadu',
    name: 'Posyandu Mandiri Balita & Lansia (2 Unit)',
    category: 'kesehatan',
    categoryLabel: 'Kesehatan Masyarakat',
    categoryColor: 'bg-[#6cf8bb]/40 text-[#005236]',
    jaga: 'Tersebar di 5 Lingkungan',
    alamat: 'Pos Pelayanan Terpadu Lingkungan',
    deskripsi: 'Pemeriksaan tensi rutin lansia, pemantauan kurva nutrisi anak, penimbangan balita, dan vitamin.',
    status: 'Jadwal Bulanan Teratur',
  },

  // 4. Pendidikan & Sosial
  {
    id: 'slb-kolongan',
    name: 'SLB (Sekolah Luar Biasa) Kolongan',
    category: 'pendidikan',
    categoryLabel: 'Pendidikan Inklusif Khusus',
    categoryColor: 'bg-[#ffeed9] text-[#9c4300]',
    jaga: 'Jaga 1',
    alamat: 'Kawasan Pendidikan Khusus, Kolongan Satu',
    deskripsi: 'Sekolah Luar Biasa untuk pembinaan, bimbingan, dan pembelajaran akademik anak berkebutuhan khusus.',
    status: 'Berjalan Aktif',
    gmapsUrl: 'https://www.google.com/maps?q=1.31817340191659,124.83542167227685',
  },
  {
    id: 'panti-asuhan-tuna-grahita',
    name: 'Panti Asuhan Tuna Grahita',
    category: 'pendidikan',
    categoryLabel: 'Layanan Sosial & Asuhan',
    categoryColor: 'bg-[#ffeed9] text-[#9c4300]',
    jaga: 'Jaga 1',
    alamat: 'Kawasan Pelayanan Sosial Kolongan Satu',
    deskripsi: 'Panti asuhan dan tempat bimbingan sosial mandiri bagi penyandang tuna grahita dengan penuh kasih sayang.',
    status: 'Pelayanan Sosial Terbuka',
    gmapsUrl: 'https://www.google.com/maps?q=1.318664254262629,124.83538978661507',
  },

  // 5. Energi, Infrastruktur & Niaga
  {
    id: 'geothermal-lahendong',
    name: 'Pertamina Geothermal Energy (Area Lahendong)',
    category: 'infrastruktur',
    categoryLabel: 'Energi Terbarukan Panas Bumi',
    categoryColor: 'bg-[#e2e7ff] text-[#004b73]',
    jaga: 'Jaga 5 (Ujung Selatan)',
    alamat: 'Kawasan Panas Bumi Lahendong, Kolongan Satu',
    deskripsi: 'Fasilitas strategis pemanfaatan energi ramah lingkungan panas bumi (geothermal) untuk ketahanan listrik regional.',
    status: 'Objek Vital Nasional',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pertamina+Geothermal+Energy+Lahendong+Tomohon',
  },
  {
    id: 'spbu-pertamina',
    name: 'SPBU Pertamina 74.953.13',
    category: 'infrastruktur',
    categoryLabel: 'Stasiun Pengisian Bahan Bakar',
    categoryColor: 'bg-[#e2e7ff] text-[#004b73]',
    jaga: 'Jaga 5 (Tenggara)',
    alamat: 'Batas Tenggara Wilayah Kolongan Satu',
    deskripsi: 'Stasiun pengisian bahan bakar resmi untuk melayani mobilitas kendaraan warga dan pelintas jalan raya.',
    status: 'Operasional 24 Jam',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=SPBU+74.953.13+Tomohon',
  },
  {
    id: 'renao-bakeshop',
    name: 'Renao Bakeshop & Eatery',
    category: 'infrastruktur',
    categoryLabel: 'Sentra Kuliner & Bakery',
    categoryColor: 'bg-[#e2e7ff] text-[#004b73]',
    jaga: 'Jaga 4 (Dekat Kantor Walikota)',
    alamat: 'Jl. Zanosui / Jl. Sreko, Kolongan Satu',
    deskripsi: 'Usaha kuliner roti modern dan tempat pertemuan warga di sudut barat koridor Jl. Zanosui.',
    status: 'Buka Setiap Hari',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Renao+Bakeshop+Tomohon',
  },

  // 6. Sanitasi Lingkungan & Sumber Daya Air
  {
    id: 'mata-air-alami',
    name: '14 Titik Mata Air Alami Vulkanik',
    category: 'sanitasi_air',
    categoryLabel: 'Sumber Daya Air Alami',
    categoryColor: 'bg-[#d0f0fd] text-[#006194]',
    jaga: 'Tersebar di Jaga 1 s/d 5',
    alamat: 'Koridor lereng & resapan alami Kolongan Satu',
    deskripsi: 'Sebaran 14 titik mata air vulkanik alami dengan debit stabil dan jernih yang menjadi sumber vital air bersih warga.',
    status: 'Debit Terjaga & Terawat',
  },
  {
    id: 'sumur-pompa-mandiri',
    name: '380 Unit Sumur Pompa & Gali Mandiri',
    category: 'sanitasi_air',
    categoryLabel: 'Air Bersih Rumah Tangga',
    categoryColor: 'bg-[#d0f0fd] text-[#006194]',
    jaga: 'Wilayah Lingkungan I – V',
    alamat: 'Area pemukiman 5 Lingkungan Jaga',
    deskripsi: 'Sumur pompa dan sumur gali keluarga yang dirawat berkala dengan kualitas air tanah higienis dan tidak berbau.',
    status: '380 Unit Berfungsi Normal',
  },
  {
    id: 'jaringan-pdam',
    name: 'Jaringan Perpipaan Air PDAM (160 Rumah)',
    category: 'sanitasi_air',
    categoryLabel: 'Infrastruktur Air Bersih',
    categoryColor: 'bg-[#d0f0fd] text-[#006194]',
    jaga: 'Jaga 1, 2, 3, 4, 5',
    alamat: 'Jaringan pipa transmisi PDAM Kota Tomohon',
    deskripsi: 'Suplai air bersih terdistribusi ke 160 sambungan rumah melalui kemitraan PDAM Tomohon dan PAM Kelurahan.',
    status: 'Distribusi Lancar',
  },
  {
    id: 'sanitasi-odf-paripurna',
    name: 'Pengawasan Sanitasi & Jamban Sehat',
    category: 'sanitasi_air',
    categoryLabel: 'Sanitasi Pemukiman',
    categoryColor: 'bg-[#6cf8bb]/40 text-[#005236]',
    jaga: 'Wilayah Lingkungan I s/d V',
    alamat: 'Seluruh Wilayah Kelurahan Kolongan Satu',
    deskripsi: 'Program pemeliharaan sarana sanitasi warga melalui pengawasan jamban keluarga sehat dan pembuangan limbah domestik terpadu.',
    status: 'Terkelola / Berkelanjutan',
  },
  {
    id: 'drainase-dan-sungai',
    name: 'Saluran Drainase 3.200 M & Aliran Sungai',
    category: 'sanitasi_air',
    categoryLabel: 'Drainase & Pengendali Banjir',
    categoryColor: 'bg-[#d0f0fd] text-[#006194]',
    jaga: 'Koridor Utama 5 Jaga',
    alamat: 'Sepanjang jalan penghubung & batas alam',
    deskripsi: 'Jaringan saluran drainase permanen sepanjang 3,2 km terhubung dengan aliran sungai alami sebagai resapan dan pencegah genangan air.',
    status: 'Kondisi Baik & Terawat',
  },
];

export const INITIAL_SANITASI_STATS: SanitasiStats = {
  mataAir: '14 Titik',
  sumurWarga: '380 Unit',
  pdam: '160 Rumah',
  drainase: '3.200 Meter',
  statusOdf: '100% ODF Bebas Buang Air Besar Sembarangan',
  statusAir: '100% Akses Air Bersih Layak',
};

export const INITIAL_APARATUR_DATA: AparaturData = {
  lurah: {
    nama: 'THERESIA J. KAUNANG, SE',
    nip: '19731206 200312 2 007',
    jabatan: 'Lurah Kolongan Satu',
    phone: '0812-4455-8891',
    deskripsi: 'Pimpinan Utama Wilayah Kelurahan Kolongan Satu',
  },
  seklur: {
    nama: 'FEBRONIA L. PIJOH, S.Kom',
    nip: '19780203 200902 2 002',
    jabatan: 'Sekretaris Kelurahan',
    phone: '0813-5566-7788',
    deskripsi: 'Verifikator Administrasi & Tata Kelola Kepegawaian',
  },
  pelaksana: {
    nama: 'KARLIN S. PIETER',
    nip: '19710830 201102 2 001',
    jabatan: 'Pelaksana Administrasi',
    phone: '0852-9988-1234',
  },
  kasie: [
    {
      id: 'kasie-pem',
      badge: 'KASIE. PEMERINTAHAN DAN TRANTIB',
      name: 'DJONNY MAWEIKERE, S.IP',
      nip: '19700616 200801 1 027',
      pembantu: 'Pembantu Kasie. Pemerintahan dan Trantib',
      phone: '0821-8877-3344',
    },
    {
      id: 'kasie-kesra',
      badge: 'KASIE. KESRA',
      name: 'ENGLIN LIMI TUMIWA, S.IP',
      nip: '19900318 201102 2 001',
      pembantu: 'Pembantu Kasie. Kesra',
      phone: '0812-9911-2233',
    },
    {
      id: 'kasie-bang',
      badge: 'KASIE. PEMBANGUNAN',
      name: 'RAYNOLD MATINDAS, SE',
      nip: '19821105 201102 1 001',
      pembantu: 'Pembantu Kasie. Pembangunan',
      phone: '0853-4433-2211',
    },
  ],
  lingkungan: [
    {
      lingkungan: 'LINGKUNGAN I',
      pala: 'MEKY MARIO TURANGAN',
      mevrouw: 'ATHANASIUS RICKY RONNY TIRIE',
      phone: '0822-9237-9090',
    },
    {
      lingkungan: 'LINGKUNGAN II',
      pala: 'DEVID PIYOH HERMANUS TASIK',
      mevrouw: 'ANTONIUS KAPOJOS',
      phone: '0853-9947-8057',
    },
    {
      lingkungan: 'LINGKUNGAN III',
      pala: 'AGUSTINUS JOSEPH KAPARANG',
      mevrouw: 'PAULUS BENEDIKTUS MONTOLALU',
      phone: '0821-8731-9388',
    },
    {
      lingkungan: 'LINGKUNGAN IV',
      pala: 'NOFEMBLY SERVASIUS PUSUNG',
      mevrouw: 'JEFRY MAWEIKERE',
      phone: '0852-5633-0178',
    },
    {
      lingkungan: 'LINGKUNGAN V',
      pala: 'BOY WELLY TURAMBI',
      mevrouw: 'MEILHI MIDDY NELSON MUAJA',
      phone: '0852-9871-0897',
    },
  ],
};

export const INITIAL_ACTIVITY_SLIDES: ActivitySlide[] = [
  {
    id: 'slide-1',
    title: 'Musyawarah Perencanaan Pembangunan (Musrenbang) Kelurahan',
    subtitle: 'Forum rembuk bersama aparat kelurahan, kepala lingkungan, dan tokoh masyarakat untuk menetapkan program prioritas.',
    category: 'Pemerintahan & Partisipasi Warga',
    badge: 'Agenda Tahunan Kelurahan',
    imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1920&q=80',
    alt: 'Dokumentasi Musrenbang Kelurahan Kolongan Satu',
  },
  {
    id: 'slide-2',
    title: 'Aksi Gotong Royong & Kerja Bakti Kebersihan Lingkungan',
    subtitle: 'Kerja bakti terpadu pembersihan drainase, sanitasi lorong, dan penataan lingkungan asri bersama warga 5 Jaga.',
    category: 'Lingkungan Hidup & Kebersihan',
    badge: 'Kegiatan Swadaya Warga',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1920&q=80',
    alt: 'Dokumentasi Gotong Royong Kebersihan Lingkungan Kolongan Satu',
  },
  {
    id: 'slide-3',
    title: 'Pelayanan Kesehatan Posyandu Terpadu Balita & Lansia',
    subtitle: 'Pemeriksaan kesehatan berkala, imunisasi rutin balita, penimbangan nutrisi, dan pengecekan tensi lansia.',
    category: 'Kesehatan & Kesejahteraan',
    badge: 'Layanan Terpadu Bulanan',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80',
    alt: 'Dokumentasi Layanan Posyandu Kolongan Satu',
  },
  {
    id: 'slide-4',
    title: 'Sosialisasi Digitalisasi Monografi & Pemetaan Potensi Wilayah',
    subtitle: 'Pendataan statistik mutakhir, pemetaan demografi digital, dan sosialisasi portal data terbuka kelurahan.',
    category: 'Inovasi & Digitalisasi Portal',
    badge: 'Pengembangan Berkelanjutan',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=80',
    alt: 'Dokumentasi Sosialisasi Digitalisasi Monografi',
  },
  {
    id: 'slide-5',
    title: 'Penyaluran Bantuan Pangan & Penguatan Ekonomi Masyarakat',
    subtitle: 'Distribusi bantuan langsung bagi keluarga penerima manfaat dan pendampingan kelompok usaha mandiri.',
    category: 'Sosial & Pemberdayaan Warga',
    badge: 'Program Kesejahteraan Sosial',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1920&q=80',
    alt: 'Dokumentasi Penyaluran Bantuan Sosial Kolongan Satu',
  },
];

export const INITIAL_KONTAK_INFO: KontakInfo = {
  hotlineWa: '0895-2917-5850',
  alamatKantor: 'Jl. Zanosui, Lingkungan II, Kelurahan Kolongan Satu, Tomohon Tengah, Kota Tomohon, Sulawesi Utara 95438',
  email: 'kel.kolongansatu@tomohon.go.id',
  jamSeninKamis: 'Senin - Kamis: 08.00 - 16.00 WITA',
  jamJumat: 'Jumat: 08.00 - 15.30 WITA',
  jamWeekend: 'Sabtu & Minggu: Tutup (Layanan Daring Aktif 24 Jam)',
};
