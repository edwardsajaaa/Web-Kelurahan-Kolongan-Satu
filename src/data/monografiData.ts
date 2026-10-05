export interface MonografiItem {
  id: string;
  year: number;
  title: string;
  category: 'Wilayah Jaga' | 'Kependudukan' | 'Pendidikan & Sosial' | 'Potensi Ekonomi' | 'Peternakan' | 'Lingkungan Hidup' | 'Transparansi Dana';
  categoryKey: 'wilayah' | 'kependudukan' | 'pendidikan' | 'ekonomi' | 'peternakan' | 'lingkungan' | 'transparansi';
  statsLabel: string;
  statsValue: string;
  badgeLabel: string;
  image: string;
  palaName?: string;
  kasieName: string;
  description: string;
  detailedNotes: string[];
  statusTahapan: 'disahkan_lurah' | 'diverifikasi_seklur' | 'draft';
  lastUpdated: string;
  metrics: {
    totalWarga?: number;
    kepalaKeluarga?: number;
    pria?: number;
    wanita?: number;
    customMetrics?: { label: string; value: string | number; change?: string; color?: string }[];
  };
  chartData?: {
    type: 'bar' | 'donut' | 'progress';
    title: string;
    items: { label: string; value: number; color?: string; note?: string }[];
  };
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
}

export const MONOGRAFI_ITEMS: MonografiItem[] = [
  {
    id: 'lingk-1',
    year: 2024,
    title: 'Lingkungan I (Jaga 1)',
    category: 'Wilayah Jaga',
    categoryKey: 'wilayah',
    statsLabel: 'Populasi Warga',
    statsValue: '310 Jiwa • 105 KK',
    badgeLabel: 'Pintu Gerbang Timur',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&auto=format&fit=crop&q=80',
    palaName: 'Meky Mario Turangan / Athanasius Ricky Trie',
    kasieName: 'Djonny Maweikere, S.IP (Kasie Pem & Trantib)',
    description: 'Wilayah pemukiman bagian timur yang berbatasan langsung dengan jalur utama kelurahan. Menjadi pusat aktivitas ekonomi warung kelontong, usaha kuliner kue basah khas Minahasa, dan lintasan transportasi publik.',
    detailedNotes: [
      'Batas Wilayah: Sebelah Timur berbatasan langsung dengan Kelurahan Matani I.',
      'Memiliki 1 Pos Ronda Utama dengan 3 anggota Hansip / Linmas giliran jaga malam.',
      'Tingkat kepadatan penduduk tergolong sedang dengan penataan pekarangan asri.',
      'Seluruh 105 Kepala Keluarga telah terhubung dengan meteran air bersih dan listrik 24 jam.'
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '15 Maret 2024 - 10:30 WITA',
    metrics: {
      totalWarga: 310,
      kepalaKeluarga: 105,
      pria: 152,
      wanita: 158,
      customMetrics: [
        { label: 'Rasio Gender L/P', value: '49% : 51%', color: 'sky' },
        { label: 'Pos Kamling', value: '1 Unit Aktif', color: 'emerald' },
        { label: 'Penerima PKH/Bansos', value: '16 KK', color: 'amber' },
        { label: 'Luas Pemukiman', value: '16.8 Ha', color: 'purple' },
      ]
    },
    chartData: {
      type: 'bar',
      title: 'Distribusi Rentang Usia Warga Lingkungan I',
      items: [
        { label: 'Balita (0-4)', value: 24, color: '#38bdf8' },
        { label: 'Usia Sekolah (5-18)', value: 68, color: '#0284c7' },
        { label: 'Produktif (19-59)', value: 178, color: '#0369a1' },
        { label: 'Lansia (60+)', value: 40, color: '#0c4a6e' },
      ]
    },
    tableData: {
      headers: ['Indikator', 'Jumlah', 'Satuan', 'Keterangan'],
      rows: [
        ['Jumlah Jiwa Laki-laki', 152, 'Jiwa', 'Warga terdaftar sah'],
        ['Jumlah Jiwa Perempuan', 158, 'Jiwa', 'Warga terdaftar sah'],
        ['Jumlah Kepala Keluarga (KK)', 105, 'KK', 'Buku Register Induk'],
        ['Kepadatan Pemukiman', 18.4, 'Jiwa/Ha', 'Zona perumahan tertata'],
        ['Kepemilikan Jamban Sehat', 105, 'Rumah', '100% ODF Mandiri'],
      ]
    }
  },
  {
    id: 'lingk-2',
    year: 2024,
    title: 'Lingkungan II (Jaga 2)',
    category: 'Wilayah Jaga',
    categoryKey: 'wilayah',
    statsLabel: 'Populasi Warga',
    statsValue: '285 Jiwa • 108 KK',
    badgeLabel: 'Sentra Kantor & Ibadah',
    image: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=900&auto=format&fit=crop&q=80',
    palaName: 'Devid P.N. Tasie / Antonius Kapojos',
    kasieName: 'Djonny Maweikere, S.IP (Kasie Pem & Trantib)',
    description: 'Kawasan jantung administrasi dan fasilitas sosial Kelurahan Kolongan Satu. Berdekatan dengan kompleks Kantor Kelurahan, gedung ibadah GMIM Syalom, dan fasilitas Posyandu Melati.',
    detailedNotes: [
      'Titik pusat kegiatan kemasyarakatan, pertemuan bulanan perangkat jaga, dan PKK.',
      'Sistem drainase tersier telah dibetonisasi sepanjang 680 meter dari dana kelurahan.',
      'Rasio kepemilikan dokumen adminduk (KTP-el & KIA) mencapai 99,2%.'
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '15 Maret 2024 - 10:30 WITA',
    metrics: {
      totalWarga: 285,
      kepalaKeluarga: 108,
      pria: 139,
      wanita: 146,
      customMetrics: [
        { label: 'Gedung Ibadah', value: '2 Gereja', color: 'purple' },
        { label: 'Posyandu Terpadu', value: '1 Unit (Melati)', color: 'emerald' },
        { label: 'Kepatuhan Pajak PBB', value: '96.5%', color: 'sky' },
        { label: 'Akses Drainase Baik', value: '95%', color: 'indigo' },
      ]
    },
    chartData: {
      type: 'bar',
      title: 'Distribusi Rentang Usia Warga Lingkungan II',
      items: [
        { label: 'Balita (0-4)', value: 19, color: '#38bdf8' },
        { label: 'Usia Sekolah (5-18)', value: 59, color: '#0284c7' },
        { label: 'Produktif (19-59)', value: 168, color: '#0369a1' },
        { label: 'Lansia (60+)', value: 39, color: '#0c4a6e' },
      ]
    },
    tableData: {
      headers: ['Indikator', 'Jumlah', 'Satuan', 'Keterangan'],
      rows: [
        ['Jumlah Jiwa Laki-laki', 139, 'Jiwa', 'Pencatatan register sipil'],
        ['Jumlah Jiwa Perempuan', 146, 'Jiwa', 'Pencatatan register sipil'],
        ['Jumlah KK', 108, 'KK', 'Rata-rata 2.6 jiwa/KK'],
        ['Jumlah Fasilitas Umum', 4, 'Unit', 'Kantor, Balai, 2 Gereja'],
        ['Kondisi Jalan Lingkungan', '100% Aspal/Paving', '-', 'Kondisi mantap'],
      ]
    }
  },
  {
    id: 'lingk-3',
    year: 2024,
    title: 'Lingkungan III (Jaga 3)',
    category: 'Wilayah Jaga',
    categoryKey: 'wilayah',
    statsLabel: 'Populasi Warga',
    statsValue: '295 Jiwa • 112 KK',
    badgeLabel: 'Konservasi Mata Air & Kebun',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&auto=format&fit=crop&q=80',
    palaName: 'Agustinus Sapanany / Paulus Wuntuale',
    kasieName: 'Mathilda Mantow, SE (Kasie Pembangunan)',
    description: 'Pusat aktivitas perkebunan warga, budidaya tanaman hias khas Kota Tomohon, dan lokasi zona konservasi 6 titik sumber mata air alami pegunungan yang mengalirkan debit jernih sepanjang musim.',
    detailedNotes: [
      'Menjadi tumpuan cadangan air minum bersih alami bagi warga kelurahan sekitar.',
      'Komoditas perkebunan utama: sayuran organik, tanaman hias krisan, dan jagung manis.',
      'Kelompok tani "Mapalus Makmur" aktif beranggotakan 32 petani lokal.'
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '16 Maret 2024 - 14:15 WITA',
    metrics: {
      totalWarga: 295,
      kepalaKeluarga: 112,
      pria: 144,
      wanita: 151,
      customMetrics: [
        { label: 'Titik Mata Air', value: '6 Titik Alami', color: 'sky' },
        { label: 'Kelompok Tani', value: '2 Kelompok', color: 'emerald' },
        { label: 'Luas Lahan Tani', value: '28.5 Ha', color: 'amber' },
        { label: 'Debit Rata-rata Air', value: '22 L/detik', color: 'blue' },
      ]
    },
    chartData: {
      type: 'donut',
      title: 'Pemanfaatan Lahan Wilayah Lingkungan III',
      items: [
        { label: 'Perkebunan Sayur & Bunga', value: 45, color: '#10b981', note: '12.8 Ha' },
        { label: 'Zona Konservasi Air', value: 25, color: '#0ea5e9', note: '7.1 Ha' },
        { label: 'Pemukiman Warga', value: 22, color: '#f59e0b', note: '6.2 Ha' },
        { label: 'Fasilitas & Jalan', value: 8, color: '#64748b', note: '2.4 Ha' },
      ]
    },
    tableData: {
      headers: ['Indikator', 'Jumlah', 'Satuan', 'Keterangan'],
      rows: [
        ['Jumlah Warga', 295, 'Jiwa', 'Laki-laki 144, Perempuan 151'],
        ['Kepala Keluarga', 112, 'KK', 'Mayoritas petani & pekebun'],
        ['Produksi Sayuran Bulanan', 14.5, 'Ton', 'Dipasok ke Pasar Beriman Tomohon'],
        ['Titik Tangkapan Air Bersih', 6, 'Lokasi', 'Perlindungan swadaya desa'],
        ['Keluarga Prasejahtera', 14, 'KK', 'Masuk program pendampingan Kesra'],
      ]
    }
  },
  {
    id: 'lingk-4',
    year: 2024,
    title: 'Lingkungan IV (Jaga 4)',
    category: 'Wilayah Jaga',
    categoryKey: 'wilayah',
    statsLabel: 'Populasi Warga',
    statsValue: '304 Jiwa • 107 KK',
    badgeLabel: 'Sentra Peternakan & Pengrajin',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&auto=format&fit=crop&q=80',
    palaName: 'Petronella Pusung / Jerry Maweike',
    kasieName: 'Mathilda Mantow, SE (Kasie Pembangunan)',
    description: 'Wilayah sentra peternakan rakyat mandiri terpadu dan komunitas pengrajin pertukangan kayu/batu. Terdapat pengolahan pupuk organik dari kotoran ternak yang meminimalisir pencemaran bau.',
    detailedNotes: [
      'Menampung konsentrasi ternak babi rakyat sebanyak 180 ekor dalam kandang higienis bersekat.',
      'Sinergi peternak dan Kasie Pembangunan dalam program vaksinasi teratur.',
      'Memiliki pos ronda terpadu yang berdampingan dengan sanggar kesenian Kolintang.'
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '16 Maret 2024 - 15:40 WITA',
    metrics: {
      totalWarga: 304,
      kepalaKeluarga: 107,
      pria: 149,
      wanita: 155,
      customMetrics: [
        { label: 'Populasi Babi', value: '180 Ekor', color: 'rose' },
        { label: 'Keluarga Peternak', value: '26 KK', color: 'amber' },
        { label: 'Pengrajin Kayu/Batu', value: '38 Jiwa', color: 'indigo' },
        { label: 'Instalasi Biogas Mini', value: '3 Unit', color: 'emerald' },
      ]
    },
    chartData: {
      type: 'bar',
      title: 'Distribusi Mata Pencaharian Jaga 4',
      items: [
        { label: 'Peternak Mandiri', value: 36, color: '#f43f5e' },
        { label: 'Tukang Kayu/Batu', value: 38, color: '#8b5cf6' },
        { label: 'Petani Sayur', value: 42, color: '#10b981' },
        { label: 'Karyawan/PNS', value: 28, color: '#0284c7' },
      ]
    },
    tableData: {
      headers: ['Indikator', 'Jumlah', 'Satuan', 'Keterangan'],
      rows: [
        ['Jumlah Jiwa', 304, 'Jiwa', 'L: 149, P: 155'],
        ['Kepala Keluarga', 107, 'KK', 'Register 2024'],
        ['Kandang Ternak Terverifikasi', 24, 'Lokasi', 'Memenuhi jarak sanitasi'],
        ['Pos Kamling Jaga 4', 1, 'Unit', 'Petugas jaga 4 orang/malam'],
      ]
    }
  },
  {
    id: 'lingk-5',
    year: 2024,
    title: 'Lingkungan V (Jaga 5)',
    category: 'Wilayah Jaga',
    categoryKey: 'wilayah',
    statsLabel: 'Populasi Warga',
    statsValue: '290 Jiwa • 108 KK',
    badgeLabel: 'Lereng Asri & Batas Barat',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop&q=80',
    palaName: 'Vifi Timang / Hein Wilson Woh',
    kasieName: 'Djonny Maweikere, S.IP (Kasie Pem & Trantib)',
    description: 'Kawasan lereng pegunungan asri yang berbatasan langsung dengan Kelurahan Kamasi di sebelah barat. Memiliki pemandangan asri, pepohonan rindang, serta menjadi pelopor bank sampah mandiri.',
    detailedNotes: [
      'Batas Barat berbatasan dengan Kelurahan Kamasi, terhubung dengan jalan lingkar desa.',
      'Bank Sampah "Mapalus Bersih" telah mengumpulkan dan mendaur ulang 1,8 ton anorganik/tahun.',
      'Sistem peringatan dini kerawanan longsor lereng terpantau aman dengan terasering bambu.'
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '17 Maret 2024 - 09:00 WITA',
    metrics: {
      totalWarga: 290,
      kepalaKeluarga: 108,
      pria: 141,
      wanita: 149,
      customMetrics: [
        { label: 'Nasabah Bank Sampah', value: '74 KK', color: 'emerald' },
        { label: 'Ruang Terbuka Hijau', value: '4.2 Ha', color: 'teal' },
        { label: 'Jalur Terasering', value: '1.200 M', color: 'amber' },
        { label: 'Lampu Jalan Solar Cell', value: '8 Titik', color: 'sky' },
      ]
    },
    chartData: {
      type: 'bar',
      title: 'Distribusi Rentang Usia Warga Lingkungan V',
      items: [
        { label: 'Balita (0-4)', value: 20, color: '#38bdf8' },
        { label: 'Usia Sekolah (5-18)', value: 62, color: '#0284c7' },
        { label: 'Produktif (19-59)', value: 169, color: '#0369a1' },
        { label: 'Lansia (60+)', value: 39, color: '#0c4a6e' },
      ]
    },
    tableData: {
      headers: ['Indikator', 'Jumlah', 'Satuan', 'Keterangan'],
      rows: [
        ['Jumlah Jiwa', 290, 'Jiwa', 'L: 141, P: 149'],
        ['Kepala Keluarga', 108, 'KK', 'Status aktif'],
        ['Koleksi Sampah Terpilah', 150, 'Kg/bulan', 'Dikelola TPS3R Jaga 5'],
        ['Penerangan Tenaga Surya', 8, 'Titik', 'Pengadaan APB-Kel 2024'],
      ]
    }
  },
  {
    id: 'kependudukan-total',
    year: 2024,
    title: 'Rekapitulasi Kependudukan & Teritorial',
    category: 'Kependudukan',
    categoryKey: 'kependudukan',
    statsLabel: 'Agregat Penduduk',
    statsValue: '1.484 Jiwa • 540 KK',
    badgeLabel: 'Master Monografi 2024',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=900&auto=format&fit=crop&q=80',
    kasieName: 'Djonny Maweikere, S.IP (Kasie Pem & Trantib)',
    description: 'Data agregat resmi papan monografi fisik Kelurahan Kolongan Satu Tahun 2024 yang memuat 1.484 jiwa, 540 Kepala Keluarga, persebaran 5 Lingkungan Jaga, batas teritorial, dan sistem keamanan kelurahan.',
    detailedNotes: [
      'Batas Wilayah: Utara (Kelurahan Kolongan), Selatan (Kelurahan Kamasi), Timur (Kelurahan Paslaten Tiga), Barat (Kelurahan Kamasi).',
      'Total luas wilayah administrasi 48,05 Hektar (Pemukiman 34,50 Ha, Pertanian 9,50 Ha, Pekarangan 4,00 Ha, Lahan Tidur 0,05 Ha).',
      'Sistem keamanan jaga malam melibatkan 15 personel satuan Linmas/Hansip resmi dengan SK Kelurahan.',
      'Pertumbuhan penduduk alami tahun 2024 stabil di angka 1.2% per tahun.'
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '18 Maret 2024 - 11:00 WITA',
    metrics: {
      totalWarga: 1484,
      kepalaKeluarga: 540,
      pria: 725,
      wanita: 759,
      customMetrics: [
        { label: 'Lingkungan (Jaga)', value: '5 Wilayah', color: 'sky' },
        { label: 'Anggota Satuan Linmas', value: '15 Personel', color: 'emerald' },
        { label: 'Pos Ronda Aktif', value: '5 Unit', color: 'blue' },
        { label: 'Luas Wilayah Total', value: '48.05 Ha', color: 'purple' },
      ]
    },
    chartData: {
      type: 'bar',
      title: 'Perbandingan Populasi Tiap Lingkungan (Jaga I - V)',
      items: [
        { label: 'Lingkungan I', value: 310, color: '#0284c7', note: '105 KK' },
        { label: 'Lingkungan II', value: 285, color: '#0369a1', note: '108 KK' },
        { label: 'Lingkungan III', value: 295, color: '#0ea5e9', note: '112 KK' },
        { label: 'Lingkungan IV', value: 304, color: '#38bdf8', note: '107 KK' },
        { label: 'Lingkungan V', value: 290, color: '#7dd3fc', note: '108 KK' },
      ]
    },
    tableData: {
      headers: ['Lingkungan / Jaga', 'Kepala & Wakil Lingkungan', 'Jiwa', 'KK', 'Laki-laki', 'Perempuan'],
      rows: [
        ['Lingkungan I', 'Meky M. Turangan / Athanasius Ricky Trie', 310, 105, 152, 158],
        ['Lingkungan II', 'Devid P.N. Tasie / Antonius Kapojos', 285, 108, 139, 146],
        ['Lingkungan III', 'Agustinus Sapanany / Paulus Wuntuale', 295, 112, 144, 151],
        ['Lingkungan IV', 'Petronella Pusung / Jerry Maweike', 304, 107, 149, 155],
        ['Lingkungan V', 'Vifi Timang / Hein Wilson Woh', 290, 108, 141, 149],
        ['TOTAL KELURAHAN', 'Kelurahan Kolongan Satu, Tomohon Tengah', 1484, 540, 725, 759],
      ]
    }
  },
  {
    id: 'pendidikan-sosial',
    year: 2024,
    title: 'Distribusi Pendidikan & Kesejahteraan Sosial',
    category: 'Pendidikan & Sosial',
    categoryKey: 'pendidikan',
    statsLabel: 'Jenjang Pendidikan',
    statsValue: 'SLTA (520) • Sarjana S1 (138)',
    badgeLabel: 'SDM Unggul & Inklusif',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&auto=format&fit=crop&q=80',
    kasieName: 'Englin Lini Towoli, S.IP (Kasie Kesra)',
    description: 'Klasifikasi tingkat pendidikan formal seluruh warga mulai dari usia balita hingga perguruan tinggi strata dua (S2), pemetaan kesejahteraan warga penyandang disabilitas, serta sarana ibadah dan pos kesehatan.',
    detailedNotes: [
      'Lulusan jenjang SLTA mendominasi dengan 520 jiwa, disusul Sarjana S1 sebanyak 138 jiwa dan S2 12 jiwa.',
      'Warga penyandang disabilitas (Tuna Netra: 3, Tuna Rungu: 4, Tuna Wicara: 2, Lumpuh: 6) mendapatkan pendampingan berkala dari Kasie Kesra dan Dinsos Tomohon.',
      'Sarana ibadah aktif: 3 Gereja GMIM (Syalom, Sion, Baitani), 1 Gereja Katolik St. Antonius, dan 1 Masjid seputar area perbatasan.',
      'Layanan kesehatan: 2 Posyandu Balita & Lansia dan 1 Puskesmas Pembantu (Pustu).'
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '18 Maret 2024 - 13:45 WITA',
    metrics: {
      totalWarga: 1484,
      kepalaKeluarga: 540,
      customMetrics: [
        { label: 'Lulusan SLTA/SMK', value: '520 Jiwa', color: 'sky' },
        { label: 'Sarjana S1 & S2', value: '150 Jiwa', color: 'indigo' },
        { label: 'Disabilitas Terdata', value: '15 Warga', color: 'amber' },
        { label: 'Penerima Bansos/PKH', value: '82 KK', color: 'emerald' },
      ]
    },
    chartData: {
      type: 'bar',
      title: 'Tingkat Pendidikan Formal Warga Kolongan Satu',
      items: [
        { label: 'Belum Sekolah', value: 95, color: '#94a3b8' },
        { label: 'TK / PAUD', value: 110, color: '#38bdf8' },
        { label: 'SD / Sederajat', value: 320, color: '#0284c7' },
        { label: 'SLTP / SMP', value: 280, color: '#0369a1' },
        { label: 'SLTA / SMA / SMK', value: 520, color: '#075985' },
        { label: 'Diploma / Akademi', value: 41, color: '#6366f1' },
        { label: 'Strata 1 (S1)', value: 138, color: '#8b5cf6' },
        { label: 'Strata 2 (S2)', value: 12, color: '#a855f7' },
        { label: 'Sekolah Luar Biasa (SLB)', value: 8, color: '#ec4899' },
      ]
    },
    tableData: {
      headers: ['Kategori Sosial & Pendidikan', 'Rincian / Spesifikasi', 'Jumlah', 'Satuan'],
      rows: [
        ['Pendidikan Tinggi (D3/S1/S2)', 'Alumni universitas negeri/swasta terakreditasi', 191, 'Jiwa'],
        ['Penyandang Disabilitas Netra', 'Tuna Netra (Mendapat tongkat & pendampingan)', 3, 'Jiwa'],
        ['Penyandang Disabilitas Rungu', 'Tuna Rungu / Alat bantu dengar', 4, 'Jiwa'],
        ['Penyandang Disabilitas Wicara', 'Tuna Wicara', 2, 'Jiwa'],
        ['Penyandang Disabilitas Fisik', 'Lumpuh / Kursi roda', 6, 'Jiwa'],
        ['Penerima Program PKH & BPNT', 'Keluarga Penerima Manfaat resmi', 82, 'KK'],
        ['Sarana Keagamaan', '3 Gereja GMIM, 1 Gereja Katolik, 1 Musholla', 5, 'Unit'],
      ]
    }
  },
  {
    id: 'ekonomi-pekerjaan',
    year: 2024,
    title: 'Struktur Lapangan Kerja & Ekonomi Warga',
    category: 'Potensi Ekonomi',
    categoryKey: 'ekonomi',
    statsLabel: 'Mata Pencaharian Utama',
    statsValue: 'Petani (340) • Swasta (315)',
    badgeLabel: 'Ekonomi Kerakyatan Produktif',
    image: 'https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?w=900&auto=format&fit=crop&q=80',
    kasieName: 'Mathilda Mantow, SE (Kasie Pembangunan)',
    description: 'Sebaran profesi dan sektor usaha masyarakat Kolongan Satu. Struktur ekonomi bertumpu pada kolaborasi sektor agraris (petani hortikultura/bunga), tenaga kerja terampil swasta, ASN, serta sektor jasa transportasi.',
    detailedNotes: [
      'Sektor Pertanian & Pekebun menjadi tulang punggung dengan 340 pelaku utama.',
      'Sektor Karyawan Swasta bertumbuh pesat dengan 315 warga yang bekerja di kawasan pusat niaga Tomohon dan Manado.',
      'Pertukangan Kayu & Batu (145 jiwa) mempertahankan tradisi keahlian arsitektur rumah panggung Minahasa dan konstruksi modern.'
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '17 Maret 2024 - 16:10 WITA',
    metrics: {
      totalWarga: 1484,
      kepalaKeluarga: 540,
      customMetrics: [
        { label: 'Petani & Pekebun', value: '340 Jiwa', color: 'emerald' },
        { label: 'Karyawan Swasta', value: '315 Jiwa', color: 'sky' },
        { label: 'Buruh Bangunan/Harian', value: '210 Jiwa', color: 'amber' },
        { label: 'PNS / ASN / TNI / Polri', value: '125 Jiwa', color: 'indigo' },
      ]
    },
    chartData: {
      type: 'donut',
      title: 'Distribusi Profesi Mata Pencaharian Warga',
      items: [
        { label: 'Petani / Pekebun', value: 340, color: '#10b981', note: '24.1%' },
        { label: 'Karyawan Swasta', value: 315, color: '#0284c7', note: '22.3%' },
        { label: 'Buruh Harian Lepas', value: 210, color: '#f59e0b', note: '14.9%' },
        { label: 'Pedagang & UMKM', value: 180, color: '#8b5cf6', note: '12.8%' },
        { label: 'Tukang Kayu / Batu', value: 145, color: '#ec4899', note: '10.3%' },
        { label: 'PNS / ASN / TNI / Polri', value: 125, color: '#3b82f6', note: '8.9%' },
        { label: 'Sopir / Jasa Transportasi', value: 95, color: '#64748b', note: '6.7%' },
      ]
    },
    tableData: {
      headers: ['Sektor Pekerjaan', 'Jumlah Pelaku', 'Persentase', 'Keterangan'],
      rows: [
        ['Petani & Pekebun Sayur/Bunga', 340, '24.1%', 'Lahan Jaga 3, 4, dan perkebunan luar'],
        ['Karyawan Swasta', 315, '22.3%', 'Pusat Kota Tomohon & Manado'],
        ['Buruh Bangunan & Harian', 210, '14.9%', 'Proyek konstruksi kawasan Tomohon'],
        ['Pedagang & Pengusaha UMKM', 180, '12.8%', 'Pasar Beriman & warung kelontong'],
        ['Tukang Kayu & Bangunan', 145, '10.3%', 'Tenaga terampil mebel & hunian'],
        ['Aparatur Sipil Negara (PNS/TNI/Polri)', 125, '8.9%', 'Pegawai Pemkot Tomohon & instansi'],
        ['Sopir Angkot & Ekspedisi', 95, '6.7%', 'Angkutan rute Tomohon-Manado'],
      ]
    }
  },
  {
    id: 'ternak',
    year: 2024,
    title: 'Sektor Peternakan Terpadu',
    category: 'Peternakan',
    categoryKey: 'peternakan',
    statsLabel: 'Populasi Hewan Ternak',
    statsValue: 'Babi: 340 • Sapi: 35 • Unggas: 1.450',
    badgeLabel: 'Komoditas Unggulan Rakyat',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=900&auto=format&fit=crop&q=80',
    kasieName: 'Mathilda Mantow, SE (Kasie Pembangunan)',
    description: 'Komoditas peternakan rakyat meliputi babi, sapi potong/perah, serta 1.450 ekor unggas (ayam kampung & itik) yang dikelola oleh 48 keluarga peternak mandiri dengan penerapan standar sanitasi lingkungan kelurahan.',
    detailedNotes: [
      'Peternakan babi rakyat berjumlah 340 ekor tersebar dominan di Lingkungan IV (180 ekor) dan Lingkungan III (90 ekor).',
      'Peternakan sapi berjumlah 35 ekor difokuskan pada penggemukan dan pemanfaatan pakan rumput gajah lereng bukit.',
      'Populasi unggas 1.450 ekor menyuplai kebutuhan telur kampung dan daging segar untuk rumah makan di Kota Tomohon.',
      'Dukungan Dinas Pertanian & Peternakan Kota Tomohon dalam pencegahan penyakit ASF dan vaksinasi ternak berkala.'
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '18 Maret 2024 - 15:00 WITA',
    metrics: {
      customMetrics: [
        { label: 'Populasi Babi', value: '340 Ekor', color: 'rose' },
        { label: 'Populasi Sapi', value: '35 Ekor', color: 'amber' },
        { label: 'Populasi Unggas', value: '1.450 Ekor', color: 'sky' },
        { label: 'Keluarga Peternak', value: '48 KK', color: 'emerald' },
      ]
    },
    chartData: {
      type: 'donut',
      title: 'Proporsi Populasi Komoditas Peternakan Warga',
      items: [
        { label: 'Unggas (Ayam & Itik)', value: 1450, color: '#38bdf8', note: '79.5% Komoditas' },
        { label: 'Ternak Babi', value: 340, color: '#f43f5e', note: '18.6% Komoditas' },
        { label: 'Ternak Sapi', value: 35, color: '#f59e0b', note: '1.9% Komoditas' },
      ]
    },
    tableData: {
      headers: ['Jenis Ternak', 'Populasi (Ekor)', 'Sebaran Jaga Dominan', 'Jumlah Pemilik (KK)', 'Status Vaksinasi'],
      rows: [
        ['Ternak Babi', 340, 'Jaga IV (180 ekor), Jaga III (90 ekor)', 28, '100% Tervaksinasi'],
        ['Ternak Sapi', 35, 'Jaga III (20 ekor), Jaga V (15 ekor)', 6, 'Sehat & Bebas PMK'],
        ['Ayam Kampung & Itik', 1450, 'Jaga I s/d Jaga V merata', 48, 'Bebas Flu Burung'],
      ]
    }
  },
  {
    id: 'air-sanitasi',
    year: 2024,
    title: 'Sumber Daya Air & Sanitasi Lingkungan',
    category: 'Lingkungan Hidup',
    categoryKey: 'lingkungan',
    statsLabel: 'Fasilitas Air & Sanitasi',
    statsValue: 'Sungai & 14 Titik Mata Air',
    badgeLabel: 'Kelestarian Ekosistem Hijau',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&auto=format&fit=crop&q=80',
    kasieName: 'Mathilda Mantow, SE (Kasie Pembangunan)',
    description: 'Sumber air bersih dari mata air perbukitan alami, aliran DAS Sungai Tounelet, debit air stabil, kelayakan sanitasi pemukiman, saluran drainase terpadu 3.200 meter, dan bank sampah mandiri.',
    detailedNotes: [
      'Aliran DAS Sungai Tounelet melintasi kelurahan dengan kondisi bantaran yang tertata rapi dan bebas sampah padat.',
      '14 titik mata air alami pegunungan memiliki debit gabungan 45 liter/detik dengan kualitas jernih layak konsumsi.',
      'Sebanyak 380 rumah memakai sumur bor/pompa air tanah dan 160 rumah tersambung jaringan PDAM Kota Tomohon.',
      'Program ODF (Open Defecation Free) 100%: Seluruh 540 keluarga telah memiliki jamban leher angsa dan septic tank kedap air.'
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '19 Maret 2024 - 11:20 WITA',
    metrics: {
      customMetrics: [
        { label: 'Titik Mata Air Alami', value: '14 Titik', color: 'sky' },
        { label: 'Sumur Pompa Warga', value: '380 Unit', color: 'blue' },
        { label: 'Sambungan PDAM', value: '160 Rumah', color: 'indigo' },
        { label: 'Saluran Drainase', value: '3.200 Meter', color: 'emerald' },
      ]
    },
    chartData: {
      type: 'donut',
      title: 'Distribusi Sumber Akses Air Bersih Rumah Tangga',
      items: [
        { label: 'Sumur Bor / Pompa Mandiri', value: 380, color: '#0284c7', note: '70.4% Rumah' },
        { label: 'Jaringan Resmi PDAM', value: 160, color: '#38bdf8', note: '29.6% Rumah' },
      ]
    },
    tableData: {
      headers: ['Komponen Sanitasi & Air', 'Kuantitas', 'Kondisi Fisik', 'Keterangan'],
      rows: [
        ['Mata Air Alami', 14, 'Debit 45 L/detik', 'Terjaga di Jaga 3 & Jaga 5'],
        ['Saluran Drainase Primer/Sekunder', '3.200 meter', '92% Pasangan Batu/Beton', 'Bebas genangan banjir'],
        ['Bank Sampah "Mapalus Bersih"', '1 Unit Aktif', 'Operasional tiap Sabtu', 'Pengurangan sampah 15%'],
        ['Jamban Sehat & Septic Tank', '540 Keluarga', '100% Memenuhi Standar', 'Sertifikat Kelurahan ODF'],
      ]
    }
  },
  {
    id: 'transparansi-apbd',
    year: 2024,
    title: 'Transparansi Realisasi Dana Kelurahan (APB-Kel)',
    category: 'Transparansi Dana',
    categoryKey: 'transparansi',
    statsLabel: 'Realisasi Anggaran',
    statsValue: 'Rp 450.000.000 (92.4%)',
    badgeLabel: 'Akuntabel & Terbuka',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80',
    kasieName: 'Karlin S. Poter (Pelaksana Adm & Keuangan)',
    description: 'Publikasi transparansi pertanggungjawaban penggunaan dana kelurahan APBD Kota Tomohon Tahun Anggaran 2024 untuk pos pembangunan fisik sarana prasarana, pos pemberdayaan ekonomi masyarakat, dan pos operasional Linmas.',
    detailedNotes: [
      'Alokasi Total Dana Kelurahan TA 2024: Rp 450.000.000 dengan serapan 92.4% (Rp 415.800.000).',
      'Pembangunan Sarana Prasarana (Rp 245.000.000): Meliputi perbaikan drainase Jaga 2 & 4, pengaspalan rabat jalan Jaga 3, dan lampu jalan solar cell Jaga 1-5.',
      'Pemberdayaan Masyarakat (Rp 125.000.000): Pelatihan olahan makanan ringan, bantuan bibit cabai, dan workshop digital marketing UMKM.',
      'Operasional & Kelembagaan (Rp 80.000.000): Honorarium operasional Linmas, pos ronda, dan operasional posyandu balita/lansia.'
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '20 Desember 2024 - 17:00 WITA',
    metrics: {
      customMetrics: [
        { label: 'Pagu Anggaran', value: 'Rp 450 Jt', color: 'sky' },
        { label: 'Realisasi Serapan', value: 'Rp 415.8 Jt', color: 'emerald' },
        { label: 'Persentase Serapan', value: '92.4%', color: 'blue' },
        { label: 'Status Audit', value: 'WTP BPKP', color: 'purple' },
      ]
    },
    chartData: {
      type: 'bar',
      title: 'Alokasi Penggunaan Dana Kelurahan TA 2024',
      items: [
        { label: 'Sarana Prasarana Fisik', value: 245, color: '#0284c7', note: 'Rp 245.000.000 (54.4%)' },
        { label: 'Pemberdayaan Warga', value: 125, color: '#10b981', note: 'Rp 125.000.000 (27.8%)' },
        { label: 'Operasional Linmas & Posyandu', value: 80, color: '#f59e0b', note: 'Rp 80.000.000 (17.8%)' },
      ]
    },
    tableData: {
      headers: ['Program & Kegiatan', 'Anggaran (Rp)', 'Realisasi (Rp)', 'Capaian Fisik', 'Keterangan'],
      rows: [
        ['Rabat Beton Drainase Jaga 2 & 4', '140.000.000', '138.500.000', '100%', 'Tuntas diserahkan'],
        ['Pengadaan PJU Tenaga Surya 20 Titik', '105.000.000', '103.200.000', '100%', 'Terpasang di 5 Jaga'],
        ['Pelatihan Wirausaha Olahan & KUBE', '65.000.000', '61.400.000', '100%', 'Diikuti 45 ibu-ibu PKK'],
        ['Bantuan Bibit Hortikultura & Pupuk', '60.000.000', '58.200.000', '100%', 'Diterima Poktan Jaga 3'],
        ['Honor Satuan Linmas & Poskamling', '45.000.000', '45.000.000', '100%', '15 Personel x 12 Bulan'],
        ['Dukungan PMT Posyandu Balita/Lansia', '35.000.000', '34.500.000', '100%', 'Setiap bulan terjadwal'],
      ]
    }
  },
  {
    id: 'lingk-3-draft-2026',
    year: 2026,
    title: 'Pemutakhiran Lapangan Jaga 3 (2026)',
    category: 'Wilayah Jaga',
    categoryKey: 'wilayah',
    statsLabel: 'Draf Mutasi Penduduk',
    statsValue: '302 Jiwa (+7 Jiwa)',
    badgeLabel: 'Draf Baru Menunggu Pengesahan',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&auto=format&fit=crop&q=80',
    palaName: 'Agustinus Sapanany / Paulus Wuntuale',
    kasieName: 'Djonny Maweikere, S.IP (Kasie Pem & Trantib)',
    description: 'Draf pemutakhiran tahun berjalan 2026 yang diinput oleh Kepala Lingkungan III via HP. Mencatat adanya 4 kelahiran baru, 2 warga pindah masuk, dan 1 kematian warga lanjut usia.',
    detailedNotes: [
      'Input dilaporkan oleh Pala Jaga 3 Agustinus Sapanany tanggal 14 Februari 2026.',
      'Telah direview teknis oleh Kasie Pemerintahan Djonny Maweikere, S.IP pada 28 Februari 2026.',
      'Telah diverifikasi administratif oleh Sekretaris Kelurahan Ferromel L. Pua, S.Kom pada 02 Maret 2026.',
      'Menunggu ketukan pengesahan digital (TTD Elektronik) dari Ibu Lurah Theresia J. Kaunang, SE.'
    ],
    statusTahapan: 'diverifikasi_seklur',
    lastUpdated: '02 Maret 2026 - 09:15 WITA',
    metrics: {
      totalWarga: 302,
      kepalaKeluarga: 114,
      pria: 147,
      wanita: 155,
      customMetrics: [
        { label: 'Kelahiran Baru', value: '+4 Bayi', color: 'emerald' },
        { label: 'Warga Masuk', value: '+3 Jiwa', color: 'sky' },
        { label: 'Warga Wafat', value: '-1 Jiwa', color: 'rose' },
        { label: 'Status Verifikasi', value: 'Paraf Seklur OK', color: 'amber' },
      ]
    },
    chartData: {
      type: 'bar',
      title: 'Dinamika Mutasi Kependudukan Jaga 3 (2026)',
      items: [
        { label: 'Kelahiran Baru', value: 4, color: '#10b981' },
        { label: 'Pindah Masuk', value: 3, color: '#0284c7' },
        { label: 'Pindah Keluar', value: 2, color: '#f59e0b' },
        { label: 'Kematian', value: 1, color: '#f43f5e' },
      ]
    },
    tableData: {
      headers: ['Komponen Mutasi', 'Perubahan', 'Tanggal Catat', 'Pemeriksa'],
      rows: [
        ['Kelahiran Balita Laki-laki', '+2 Jiwa', '12 Jan 2026', 'Pala Agustinus'],
        ['Kelahiran Balita Perempuan', '+2 Jiwa', '04 Feb 2026', 'Pala Agustinus'],
        ['Keluarga Baru Pindah Masuk', '+1 KK (3 Jiwa)', '20 Jan 2026', 'Kasie Pem Djonny'],
        ['Warga Lansia Berpulang', '-1 Jiwa', '08 Feb 2026', 'Seklur Ferromel'],
      ]
    }
  }
];
