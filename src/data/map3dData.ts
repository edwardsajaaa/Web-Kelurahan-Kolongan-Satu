export interface MapPoiPoint {
  id: string;
  name: string;
  category: 'kantor' | 'ibadah' | 'pendidikan' | 'sejarah' | 'pos_jaga' | 'alam' | 'ekonomi';
  categoryLabel: string;
  categoryColor: string;
  iconName: string;
  coordinates: [number, number]; // [lng, lat]
  alamat: string;
  jaga: string;
  deskripsi: string;
  gmapsUrl: string;
}

// Batas Teritorial Resmi Kelurahan Kolongan Satu, Tomohon Tengah (GeoJSON Polygon)
// Koordinat terpusat pada koridor Jl. Zanosui & Jl. P.L. Kaunang (Bujur 124.826° - 124.836°, Lintang 1.308° - 1.318°)
export const KOLONGAN_SATU_BOUNDARY = {
  type: 'Feature' as const,
  properties: {
    name: 'Wilayah Administratif Kelurahan Kolongan Satu',
    kecamatan: 'Tomohon Tengah',
    kota: 'Tomohon',
    provinsi: 'Sulawesi Utara',
    luasWilayah: '48 Hektar',
    jumlahLingkungan: '5 Lingkungan (Jaga I - V)',
    pusatPemerintahan: 'Jl. Zanosui, Lingkungan II',
  },
  geometry: {
    type: 'Polygon' as const,
    coordinates: [
      [
        [124.8268, 1.3168], // Barat Laut - batas perbatasan Kamasi
        [124.8302, 1.3178], // Utara - batas kelurahan Kolongan induk
        [124.8336, 1.3172], // Timur Laut - akses Jl. P.L. Kaunang
        [124.8355, 1.3148], // Timur - perbatasan Paslaten Dua
        [124.8358, 1.3125], // Timur Tenggara - ujung timur Jl. Zanosui
        [124.8340, 1.3095], // Tenggara - arah batas Lansot / Talete Dua
        [124.8312, 1.3088], // Selatan - kawasan Lingkungan V
        [124.8280, 1.3098], // Barat Daya - batas lereng barat
        [124.8262, 1.3128], // Barat - perbatasan Kamasi
        [124.8268, 1.3168], // Menutup batas poligon
      ],
    ],
  },
};

// Titik-titik penting (POIs) otentik di wilayah Kelurahan Kolongan Satu
export const KOLONGAN_SATU_POIS: MapPoiPoint[] = [
  {
    id: 'kantor-kelurahan',
    name: 'Kantor Kelurahan Kolongan Satu',
    category: 'kantor',
    categoryLabel: 'Pusat Pemerintahan',
    categoryColor: '#006194',
    iconName: 'Building2',
    coordinates: [124.8329, 1.3136],
    alamat: 'Jl. Zanosui, Kolongan Satu, Tomohon Tengah (Plus Code: 8R7M+F5R)',
    jaga: 'Jaga 2 (Sentral Administrasi)',
    deskripsi: 'Pusat layanan administrasi kependudukan, registrasi surat dinas warga, dan koordinasi terpadu 5 Lingkungan.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kantor+Kelurahan+Kolongan+Satu+Tomohon',
  },
  {
    id: 'gmim-elohim',
    name: 'Gereja GMIM Elohim Kolongan Satu',
    category: 'ibadah',
    categoryLabel: 'Sarana Ibadah',
    categoryColor: '#0284c7',
    iconName: 'Church',
    coordinates: [124.8335, 1.3150],
    alamat: 'Jl. P.L. Kaunang / Zanosui, Kolongan Satu',
    jaga: 'Jaga 1 & 2',
    deskripsi: 'Pusat peribadatan utama jemaat GMIM dan kegiatan pembinaan rohani kemasyarakatan Kolongan Satu.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=GMIM+Elohim+Kolongan+Satu+Tomohon',
  },
  {
    id: 'gski-christianos',
    name: 'Gereja GSKI Christianos',
    category: 'ibadah',
    categoryLabel: 'Sarana Ibadah',
    categoryColor: '#0284c7',
    iconName: 'Church',
    coordinates: [124.8318, 1.3132],
    alamat: 'Jl. Zanosui, Kolongan Satu, Tomohon Tengah',
    jaga: 'Jaga 2',
    deskripsi: 'Tempat ibadah jemaat gereja dan persekutuan doa warga di koridor Jl. Zanosui.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=GSKI+Christianos+Kolongan+Satu+Tomohon',
  },
  {
    id: 'paud-christianos',
    name: 'PAUD Bilingual Christianos',
    category: 'pendidikan',
    categoryLabel: 'Pendidikan Anak Usia Dini',
    categoryColor: '#0d9488',
    iconName: 'GraduationCap',
    coordinates: [124.8315, 1.3134],
    alamat: 'Jl. Zanosui, Kolongan Satu',
    jaga: 'Jaga 2',
    deskripsi: 'Fasilitas pendidikan dini bilingual untuk pembinaan karakter anak-anak di Kelurahan Kolongan Satu.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=PAUD+Bilingual+Christianos+Kolongan+Satu+Tomohon',
  },
  {
    id: 'waruga-nimawanua',
    name: 'Situs Waruga Nimawanua (Cagar Budaya)',
    category: 'sejarah',
    categoryLabel: 'Cagar Budaya & Sejarah',
    categoryColor: '#854d0e',
    iconName: 'Landmark',
    coordinates: [124.8282, 1.3160],
    alamat: 'Kawasan Hulu Nimawanua, Kolongan Satu',
    jaga: 'Jaga 3',
    deskripsi: 'Peti batu kubur leluhur Minahasa abad ke-18 dan jejak pemukiman mula-mula Tombulu Nimawanua di wilayah Kolongan Satu.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kolongan+Satu+Tomohon',
  },
  {
    id: 'mata-air-alami',
    name: 'Konservasi Sumber Mata Air Bersih',
    category: 'alam',
    categoryLabel: 'Konservasi Air Swadaya',
    categoryColor: '#0891b2',
    iconName: 'Droplets',
    coordinates: [124.8290, 1.3122],
    alamat: 'Lembah Konservasi Swadaya Jaga 3',
    jaga: 'Jaga 3',
    deskripsi: 'Sumber mata air alami pegunungan yang dikelola secara swadaya oleh rukun warga untuk pasokan air bersih lestari.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kolongan+Satu+Tomohon',
  },
  {
    id: 'sentra-florikultura',
    name: 'Sentra Florikultura & Pertanian Bunga',
    category: 'ekonomi',
    categoryLabel: 'Sentra Pertanian & Bunga',
    categoryColor: '#16a34a',
    iconName: 'Flower2',
    coordinates: [124.8276, 1.3140],
    alamat: 'Kawasan Kebun Florikultura Jaga 4',
    jaga: 'Jaga 4',
    deskripsi: 'Kawasan perkebunan budidaya bunga potong dan tanaman hias khas Tomohon yang dikelola kelompok tani warga.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kolongan+Satu+Tomohon',
  },
  {
    id: 'pos-jaga-1',
    name: 'Pos Kamling Lingkungan I (Jaga 1)',
    category: 'pos_jaga',
    categoryLabel: 'Pos Keamanan Lingkungan',
    categoryColor: '#4f46e5',
    iconName: 'ShieldCheck',
    coordinates: [124.8345, 1.3142],
    alamat: 'Akses Koridor Utama Masuk Jaga 1',
    jaga: 'Jaga 1 (Pala Meky Turangan)',
    deskripsi: 'Pos ronda aktif pengawasan wilayah timur dan koordinasi linmas lingkungan I.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kolongan+Satu+Tomohon',
  },
  {
    id: 'pos-jaga-2',
    name: 'Pos Kamling Lingkungan II (Jaga 2)',
    category: 'pos_jaga',
    categoryLabel: 'Pos Keamanan Lingkungan',
    categoryColor: '#4f46e5',
    iconName: 'ShieldCheck',
    coordinates: [124.8327, 1.3134],
    alamat: 'Jl. Zanosui (Dekat Kantor Kelurahan)',
    jaga: 'Jaga 2 (Pala Devid Tasie)',
    deskripsi: 'Pos pantau ketertiban warga dan titik koordinasi wilayah pusat Jl. Zanosui.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kolongan+Satu+Tomohon',
  },
  {
    id: 'pos-jaga-3',
    name: 'Pos Linmas Lingkungan III (Jaga 3)',
    category: 'pos_jaga',
    categoryLabel: 'Pos Keamanan Lingkungan',
    categoryColor: '#4f46e5',
    iconName: 'ShieldCheck',
    coordinates: [124.8296, 1.3130],
    alamat: 'Kawasan Konservasi & Pemukiman Jaga 3',
    jaga: 'Jaga 3 (Pala Agustinus Sapanany)',
    deskripsi: 'Pos pantau kawasan kebun warga dan pengawasan sumber mata air bersih swadaya.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kolongan+Satu+Tomohon',
  },
  {
    id: 'pos-jaga-4',
    name: 'Pos Lingkungan IV (Jaga 4)',
    category: 'pos_jaga',
    categoryLabel: 'Pos Keamanan Lingkungan',
    categoryColor: '#4f46e5',
    iconName: 'ShieldCheck',
    coordinates: [124.8285, 1.3152],
    alamat: 'Sentra Pemukiman & Pertanian Jaga 4',
    jaga: 'Jaga 4 (Pala Petronella Pusung)',
    deskripsi: 'Pos koordinasi kebersihan lingkungan, kelompok tani warga, dan linmas Jaga 4.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kolongan+Satu+Tomohon',
  },
  {
    id: 'pos-jaga-5',
    name: 'Pos Pantau Lingkungan V (Jaga 5)',
    category: 'pos_jaga',
    categoryLabel: 'Pos Keamanan Lingkungan',
    categoryColor: '#4f46e5',
    iconName: 'ShieldCheck',
    coordinates: [124.8305, 1.3098],
    alamat: 'Perbatasan Selatan Jaga 5',
    jaga: 'Jaga 5 (Pala Vifi Timang)',
    deskripsi: 'Pos ronda ruang terbuka hijau dan pengawasan batas perbatasan wilayah selatan.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kolongan+Satu+Tomohon',
  },
];
