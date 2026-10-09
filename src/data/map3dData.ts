export interface MapPoiPoint {
  id: string;
  name: string;
  category: 'kantor' | 'ibadah' | 'pemerintahan' | 'fasilitas' | 'jalan' | 'niaga' | 'sejarah' | 'pos_jaga';
  categoryLabel: string;
  categoryColor: string;
  iconName: string;
  coordinates: [number, number]; // [lng, lat]
  alamat: string;
  jaga: string;
  deskripsi: string;
  gmapsUrl: string;
}

export interface NamedStreet {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number][];
}

// Batas Wilayah Kolongan Satu Persis Sesuai Garis Putus-Putus Merah-Putih Pada Citra Satelit Peta
// Mencakup koridor Jl. Sreko (Barat), Jl. Slanag & lereng bawah RS Gunung Maria (Utara),
// Jl. P.L. Kaunang / Jl. Mitos & sisi barat Jl. Raya Tomohon / SPBU (Timur),
// hingga kawasan Pertamina Geothermal Area Lahendong & Secret 7 (Selatan).
export const KOLONGAN_SATU_BOUNDARY = {
  type: 'Feature' as const,
  properties: {
    name: 'Batas Teritorial Resmi Kelurahan Kolongan Satu',
    kecamatan: 'Tomohon Tengah',
    kota: 'Tomohon',
    provinsi: 'Sulawesi Utara',
    luasWilayah: '48 Hektar (5 Lingkungan / Jaga)',
    deskripsiBatas: 'Sesuai delineasi resmi citra geospasial: Utara (RS Gunung Maria / Jl. Tasik), Timur (Jl. P.L. Kaunang, Jl. Mitos, SPBU), Selatan (Pertamina Geothermal Lahendong), Barat (Jl. Sreko & Kantor Walikota).',
  },
  geometry: {
    type: 'Polygon' as const,
    coordinates: [
      [
        // 1. Batas Utara: di bawah RS Gunung Maria
        [124.8336, 1.3204],
        [124.8350, 1.3206],
        [124.8362, 1.3201],
        [124.8368, 1.3195], // Pojok Timur Laut (dekat Jl. Tasik)

        // 2. Batas Timur: menyusuri sisi timur Jl. P.L. Kaunang & Jl. Mitos
        [124.8364, 1.3180],
        [124.8358, 1.3164],
        [124.8354, 1.3148], // Barat Cool Supermarket & timur Jl. Mitos
        [124.8350, 1.3130], // Barat Superstar Family Spa
        [124.8346, 1.3110], // Menuju area SPBU Pertamina

        // 3. Batas Tenggara: mencakup SPBU Pertamina 74.953.13
        [124.8340, 1.3090],
        [124.8335, 1.3075],
        [124.8322, 1.3058],
        [124.8312, 1.3045],

        // 4. Batas Selatan: lekukan sempit mencakup Pertamina Geothermal Area Lahendong & Secret 7
        [124.8306, 1.3032],
        [124.8296, 1.3018], // Titik paling selatan
        [124.8288, 1.3025],
        [124.8285, 1.3048],
        [124.8280, 1.3075],

        // 5. Batas Barat Daya: dekat Curated Coffee Space
        [124.8272, 1.3095],

        // 6. Batas Barat: lurus menyusuri sepanjang Jl. Sreko (mencakup Kantor Walikota di sisi dalam)
        [124.8262, 1.3115],
        [124.8258, 1.3132], // Barat Kantor Walikota Tomohon
        [124.8256, 1.3155],
        [124.8258, 1.3178], // Pojok Barat Laut (ujung utara Jl. Sreko)

        // 7. Batas Barat Laut ke Utara: menyusuri utara Jl. Slanag, lalu berbelok naik
        [124.8270, 1.3180],
        [124.8295, 1.3182], // Di atas Jl. Slanag
        [124.8298, 1.3195], // Lekukan vertikal ke utara
        [124.8315, 1.3200], // Menuju bawah RS Gunung Maria

        // Menutup Poligon
        [124.8336, 1.3204],
      ],
    ],
  },
};

// Koridor Jalan Utama Kolongan Satu yang Tercantum Jelas Pada Peta
export const KOLONGAN_SATU_ROADS: NamedStreet[] = [
  {
    id: 'jl-zanosui',
    name: 'Jl. Zanosui',
    description: 'Koridor utama timur-barat penghubung pemukiman tengah dan kantor kelurahan',
    coordinates: [
      [124.8275, 1.3140],
      [124.8295, 1.3141],
      [124.8315, 1.3142],
      [124.8333, 1.3146], // Titik biru persimpangan
      [124.8350, 1.3148],
    ],
  },
  {
    id: 'jl-kaunang',
    name: 'Jl. P.L. Kaunang',
    description: 'Akses utama timur laut menuju GMIM Elohim dan koridor Paslaten',
    coordinates: [
      [124.8333, 1.3146],
      [124.8340, 1.3160],
      [124.8348, 1.3175],
      [124.8355, 1.3188],
      [124.8360, 1.3195],
    ],
  },
  {
    id: 'jl-mitos',
    name: 'Jl. Mitos',
    description: 'Jalan penghubung pemukiman warga di sebelah timur Jl. Zanosui',
    coordinates: [
      [124.8333, 1.3146],
      [124.8342, 1.3150],
      [124.8348, 1.3155],
    ],
  },
  {
    id: 'jl-wariki',
    name: 'Jl. Wariki, Wariki 1 & Wariki 2',
    description: 'Jaringan jalan lingkungan di bagian tengah dan selatan wilayah',
    coordinates: [
      [124.8305, 1.3141],
      [124.8302, 1.3130],
      [124.8298, 1.3120],
      [124.8305, 1.3105],
      [124.8308, 1.3090],
    ],
  },
  {
    id: 'jl-slanag',
    name: 'Jl. Slanag',
    description: 'Akses pemukiman utara Kantor Walikota Tomohon',
    coordinates: [
      [124.8278, 1.3145],
      [124.8280, 1.3160],
      [124.8282, 1.3172],
    ],
  },
  {
    id: 'jl-sreko',
    name: 'Jl. Sreko',
    description: 'Jalan batas barat memanjang dari utara ke selatan',
    coordinates: [
      [124.8258, 1.3175],
      [124.8257, 1.3155],
      [124.8258, 1.3135],
      [124.8262, 1.3115],
      [124.8270, 1.3095],
    ],
  },
];

// Titik-titik penting (POIs) persis sesuai peta citra satelit yang diberikan
export const KOLONGAN_SATU_POIS: MapPoiPoint[] = [
  {
    id: 'kantor-kelurahan',
    name: 'Kantor Kelurahan Kolongan Satu',
    category: 'kantor',
    categoryLabel: 'Pusat Pemerintahan',
    categoryColor: '#006194',
    iconName: 'Building2',
    coordinates: [124.8328, 1.3139],
    alamat: 'Tepi Jalan Utama Jl. Zanosui (Depan Persimpangan), Kolongan Satu',
    jaga: 'Jaga 2 (Sentral Administrasi)',
    deskripsi: 'Pusat layanan administrasi kependudukan dan surat-menyurat dinas warga Kelurahan Kolongan Satu.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kantor+Kelurahan+Kolongan+Satu+Tomohon',
  },
  {
    id: 'kantor-walikota',
    name: 'Kantor Walikota Tomohon',
    category: 'pemerintahan',
    categoryLabel: 'Pusat Pemerintahan Kota',
    categoryColor: '#0284c7',
    iconName: 'Landmark',
    coordinates: [124.8277, 1.3140],
    alamat: 'Kawasan Jl. Slanag / Sreko, Kolongan Satu',
    jaga: 'Jaga 4 (Sisi Barat)',
    deskripsi: 'Pusat pemerintahan Kota Tomohon yang berada di sisi barat batas wilayah Kolongan Satu.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kantor+Walikota+Tomohon',
  },
  {
    id: 'gmim-elohim',
    name: 'Gereja GMIM Elohim Kolongan Satu',
    category: 'ibadah',
    categoryLabel: 'Sarana Ibadah',
    categoryColor: '#0284c7',
    iconName: 'Church',
    coordinates: [124.8342, 1.3175],
    alamat: 'Jl. P.L. Kaunang, Kolongan Satu',
    jaga: 'Jaga 1',
    deskripsi: 'Pusat peribadatan jemaat GMIM dan kegiatan pembinaan rohani warga di koridor Jl. P.L. Kaunang.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=GMIM+Elohim+Kolongan+Satu+Tomohon',
  },
  {
    id: 'spbu-pertamina',
    name: 'SPBU Pertamina 74.953.13',
    category: 'fasilitas',
    categoryLabel: 'Fasilitas Pengisian Bahan Bakar',
    categoryColor: '#d97706',
    iconName: 'Fuel',
    coordinates: [124.8338, 1.3088],
    alamat: 'Batas Tenggara Wilayah Kolongan Satu',
    jaga: 'Jaga 5 & Perbatasan',
    deskripsi: 'Stasiun Pengisian Bahan Bakar Umum yang berada di koridor tenggara batas wilayah kelurahan.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=SPBU+74.953.13+Tomohon',
  },
  {
    id: 'geothermal-lahendong',
    name: 'Pertamina Geothermal - Area Lahendong',
    category: 'fasilitas',
    categoryLabel: 'Kawasan Energi Bersih',
    categoryColor: '#16a34a',
    iconName: 'Zap',
    coordinates: [124.8296, 1.3032],
    alamat: 'Ujung Selatan Wilayah Kolongan Satu (Dekat Secret 7)',
    jaga: 'Jaga 5 (Selatan)',
    deskripsi: 'Fasilitas pembangkit dan pemanfaatan energi panas bumi terbarukan di bagian selatan wilayah.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pertamina+Geothermal+Energy+Lahendong+Tomohon',
  },
  {
    id: 'curated-coffee',
    name: 'Curated Coffee Space',
    category: 'niaga',
    categoryLabel: 'Titik Niaga & Kuliner',
    categoryColor: '#b45309',
    iconName: 'Coffee',
    coordinates: [124.8270, 1.3096],
    alamat: 'Jl. Sreko / Timomor, Sisi Barat Daya',
    jaga: 'Jaga 4 (Barat)',
    deskripsi: 'Sentra usaha kuliner kopi dan ruang interaksi anak muda di koridor batas Jl. Sreko.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Curated+Coffee+Space+Tomohon',
  },
  {
    id: 'rs-gunung-maria',
    name: 'Area Batas RS Gunung Maria',
    category: 'fasilitas',
    categoryLabel: 'Batas Utara / Layanan Medis',
    categoryColor: '#e11d48',
    iconName: 'HeartPulse',
    coordinates: [124.8348, 1.3208],
    alamat: 'Batas Utara Wilayah (Akses Jl. Tasik)',
    jaga: 'Batas Utara Teritorial',
    deskripsi: 'Batas utara teritorial kelurahan yang berbatasan dengan kompleks Rumah Sakit Gunung Maria.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Gunung+Maria+Hospital+Tomohon',
  },
  {
    id: 'pos-jaga-1',
    name: 'Pos Lingkungan I (Jaga 1 - Jl. P.L. Kaunang)',
    category: 'pos_jaga',
    categoryLabel: 'Pos Keamanan Lingkungan',
    categoryColor: '#4f46e5',
    iconName: 'ShieldCheck',
    coordinates: [124.8345, 1.3160],
    alamat: 'Koridor Jl. P.L. Kaunang & Jl. Mitos',
    jaga: 'Jaga 1 (Pala Meky Turangan)',
    deskripsi: 'Pos keamanan dan koordinasi warga lingkungan I di gerbang timur laut wilayah.',
    gmapsUrl: 'https://www.google.com/maps?q=1.3160,124.8345',
  },
  {
    id: 'pos-jaga-2',
    name: 'Pos Lingkungan II (Jaga 2)',
    category: 'pos_jaga',
    categoryLabel: 'Pos Keamanan Lingkungan',
    categoryColor: '#4f46e5',
    iconName: 'ShieldCheck',
    coordinates: [124.8305, 1.3140],
    alamat: 'Jl. Zanosui Sektor Barat, Kolongan Satu',
    jaga: 'Jaga 2 (Pala Devid Tasie)',
    deskripsi: 'Pos pantau ketertiban warga pemukiman barat koridor Jl. Zanosui.',
    gmapsUrl: 'https://www.google.com/maps?q=1.3140,124.8305',
  },
  {
    id: 'pos-jaga-3',
    name: 'Pos Lingkungan III (Jaga 3 - Jl. Wariki)',
    category: 'pos_jaga',
    categoryLabel: 'Pos Keamanan Lingkungan',
    categoryColor: '#4f46e5',
    iconName: 'ShieldCheck',
    coordinates: [124.8298, 1.3125],
    alamat: 'Jl. Wariki, Kawasan Pemukiman Tengah',
    jaga: 'Jaga 3 (Pala Agustinus Sapanany)',
    deskripsi: 'Pos ronda aktif pengawasan kawasan Jl. Wariki 1 & Wariki 2 serta mata air swadaya.',
    gmapsUrl: 'https://www.google.com/maps?q=1.3125,124.8298',
  },
  {
    id: 'pos-jaga-4',
    name: 'Pos Lingkungan IV (Jaga 4 - Jl. Sreko)',
    category: 'pos_jaga',
    categoryLabel: 'Pos Keamanan Lingkungan',
    categoryColor: '#4f46e5',
    iconName: 'ShieldCheck',
    coordinates: [124.8265, 1.3135],
    alamat: 'Koridor Jl. Sreko / Jl. Slanag',
    jaga: 'Jaga 4 (Pala Petronella Pusung)',
    deskripsi: 'Pos pantau perbatasan barat dan koordinasi keamanan sekitar Kantor Walikota.',
    gmapsUrl: 'https://www.google.com/maps?q=1.3135,124.8265',
  },
  {
    id: 'pos-jaga-5',
    name: 'Pos Lingkungan V (Jaga 5 - Kawasan Selatan)',
    category: 'pos_jaga',
    categoryLabel: 'Pos Keamanan Lingkungan',
    categoryColor: '#4f46e5',
    iconName: 'ShieldCheck',
    coordinates: [124.8305, 1.3060],
    alamat: 'Akses Selatan Menuju Lahendong',
    jaga: 'Jaga 5 (Pala Vifi Timang)',
    deskripsi: 'Pos pengawasan koridor selatan, ruang terbuka hijau, dan jalur Pertamina Geothermal.',
    gmapsUrl: 'https://www.google.com/maps?q=1.3060,124.8305',
  },
];
