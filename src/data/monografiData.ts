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
    id: 'kependudukan-2025',
    year: 2025,
    title: 'Rekapitulasi Kependudukan & Teritorial (2025)',
    category: 'Kependudukan',
    categoryKey: 'kependudukan',
    statsLabel: 'Agregat Penduduk 2025',
    statsValue: '1.512 Jiwa • 550 KK',
    badgeLabel: 'Data Mutakhir 2025',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=900&auto=format&fit=crop&q=80',
    kasieName: 'Djonny Maweikere, S.IP (Kasie Pem & Trantib)',
    description: 'Data resmi Monografi Kelurahan Kolongan Satu Tahun 2025. Total penduduk mencapai 1.512 jiwa dengan hak pilih 1.245 jiwa dan luas wilayah administratif mencapai 208,25 Hektar.',
    detailedNotes: [
      'Batas Wilayah 2025: Utara (Kelurahan Kolongan), Timur (Kelurahan Walian, Matani Tiga), Selatan (Kelurahan Lansot), Barat (Kelurahan Lansot).',
      'Luas Wilayah Total: 208,25 Ha (Tanah Kering 185,75 Ha, Pemukiman 34,50 Ha, Pertanian/Perkebunan 9,50 Ha, Fasilitas Umum 7,50 Ha, Sawah 5,00 Ha, Pekarangan 4,00 Ha, Rawa 0,50 Ha, Lahan Tidur 0,05 Ha).',
      'Kelompok Usia: Balita (0-6 thn) 121 jiwa, Usia Sekolah (7-18 thn) 247 jiwa, Produktif (18-56 thn) 864 jiwa, Lansia (>56 thn) 280 jiwa.',
      'Karakteristik Geografis: Ketinggian 700 - 900 mdpl, suhu rata-rata 23°C, curah hujan 600 - 800 mm, dataran tinggi bergelombang subur.'
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '10 Januari 2025 - 08:30 WITA',
    metrics: {
      totalWarga: 1512,
      kepalaKeluarga: 550,
      pria: 730,
      wanita: 782,
      customMetrics: [
        { label: 'Hak Pilih Pemilu', value: '1.245 Jiwa', color: 'indigo' },
        { label: 'Luas Total Wilayah', value: '208,25 Ha', color: 'emerald' },
        { label: 'Suhu Rata-rata', value: '23°C', color: 'sky' },
        { label: 'Topografi Wilayah', value: '700-900 mdpl', color: 'purple' },
      ]
    },
    chartData: {
      type: 'bar',
      title: 'Distribusi Kelompok Usia Penduduk 2025',
      items: [
        { label: 'Balita (0-6 thn)', value: 121, color: '#38bdf8' },
        { label: 'Sekolah (7-18 thn)', value: 247, color: '#0284c7' },
        { label: 'Produktif (18-56 thn)', value: 864, color: '#0369a1' },
        { label: 'Lansia (>56 thn)', value: 280, color: '#0c4a6e' },
      ]
    },
    tableData: {
      headers: ['Parameter Wilayah & Demografi', 'Nilai / Kuantitas', 'Satuan', 'Keterangan'],
      rows: [
        ['Total Penduduk 2025', '1.512', 'Jiwa', '730 Laki-laki, 782 Perempuan'],
        ['Kepala Keluarga (KK)', '550', 'KK', 'Tercatat register dukcapil'],
        ['Hak Pilih Pemilu', '1.245', 'Jiwa', 'Warga usia 17 tahun ke atas / menikah'],
        ['Luas Wilayah Total', '208,25', 'Hektar', 'Kecamatan Tomohon Tengah'],
        ['Tanah Kering', '185,75', 'Hektar', 'Potensi pengembangan dan kebun'],
        ['Pemukiman Warga', '34,50', 'Hektar', 'Kawasan hunian 5 Jaga'],
      ]
    }
  }
];
