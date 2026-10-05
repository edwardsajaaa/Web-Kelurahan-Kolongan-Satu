/**
 * SINGLE SOURCE OF TRUTH (SSOT) - DATA RESMI MONOGRAFI KELURAHAN KOLONGAN SATU 2024
 * Disahkan secara berkala oleh Pemerintah Kelurahan Kolongan Satu,
 * Kecamatan Tomohon Tengah, Kota Tomohon, Provinsi Sulawesi Utara.
 */

export interface DemografiData {
  totalPenduduk: number;
  lakiLaki: number;
  perempuan: number;
  kepalaKeluarga: number;
}

export interface KelompokUsiaData {
  balita: number; // 0-6 tahun
  usiaSekolah: number; // 7-18 tahun
  produktif: {
    total: number; // 18-56 tahun
    bekerja: number;
    belumBekerja: number;
  };
  lansia: number; // >56 tahun
}

export interface GeografisData {
  luasTotalHa: number;
  pemukimanHa: number;
  pertanianHa: number;
  pekaranganHa: number;
  lahanTidurHa: number;
}

export interface BatasWilayahData {
  utara: string;
  selatan: string;
  timur: string;
  barat: string;
}

export interface PotensiData {
  ternak: {
    babi: number;
    sapi: number;
    unggas: number;
  };
  airSanitasi: {
    titikSumurSah: number;
    keterangan: string;
  };
}

export interface KeagamaanData {
  katolik: { jiwa: number; rumahIbadah: number };
  kristenProtestan: { jiwa: number; rumahIbadah: number };
  islam: { jiwa: number; rumahIbadah: number };
}

export interface JagaDetail {
  id: string;
  nomor: number;
  nama: string;
  populasi: number;
  kk: number;
  lakiLaki: number;
  perempuan: number;
  pala: string;
}

export interface MasterMonografi2024 {
  tahun: number;
  statusDokumen: 'Sah' | 'Draf';
  tanggalPengesahan: string;
  pejabatPengesah: {
    lurah: string;
    seklur: string;
  };
  demografi: DemografiData;
  kelompokUsia: KelompokUsiaData;
  geografis: GeografisData;
  batasWilayah: BatasWilayahData;
  potensi: PotensiData;
  keagamaan: KeagamaanData;
  jaga: JagaDetail[];
}

export const MONOGRAFI_2024: MasterMonografi2024 = {
  tahun: 2024,
  statusDokumen: 'Sah',
  tanggalPengesahan: '15 Maret 2024',
  pejabatPengesah: {
    lurah: 'Theresia J. Kaunang, SE',
    seklur: 'Ferromel L. Pua, S.Kom',
  },
  demografi: {
    totalPenduduk: 1484,
    lakiLaki: 725,
    perempuan: 759,
    kepalaKeluarga: 540,
  },
  kelompokUsia: {
    balita: 109,
    usiaSekolah: 222,
    produktif: {
      total: 876,
      bekerja: 494,
      belumBekerja: 382,
    },
    lansia: 277,
  },
  geografis: {
    luasTotalHa: 48.05,
    pemukimanHa: 34.50,
    pertanianHa: 9.50,
    pekaranganHa: 4.00,
    lahanTidurHa: 0.05,
  },
  batasWilayah: {
    utara: 'Kelurahan Kolongan',
    selatan: 'Kelurahan Kamasi',
    timur: 'Kelurahan Paslaten Tiga',
    barat: 'Kelurahan Kamasi',
  },
  potensi: {
    ternak: {
      babi: 340,
      sapi: 35,
      unggas: 1450,
    },
    airSanitasi: {
      titikSumurSah: 14,
      keterangan: '14 titik sumur pompa dan sumur gali terlindungi berizin sah',
    },
  },
  keagamaan: {
    katolik: { jiwa: 921, rumahIbadah: 5 },
    kristenProtestan: { jiwa: 504, rumahIbadah: 4 },
    islam: { jiwa: 49, rumahIbadah: 0 },
  },
  jaga: [
    {
      id: 'lingk-1',
      nomor: 1,
      nama: 'Lingkungan I (Jaga 1)',
      populasi: 310,
      kk: 105,
      lakiLaki: 152,
      perempuan: 158,
      pala: 'Meky Mario Turangan / Athanasius Ricky Trie',
    },
    {
      id: 'lingk-2',
      nomor: 2,
      nama: 'Lingkungan II (Jaga 2)',
      populasi: 285,
      kk: 108,
      lakiLaki: 139,
      perempuan: 146,
      pala: 'Devid P.N. Tasie / Antonius Kapojos',
    },
    {
      id: 'lingk-3',
      nomor: 3,
      nama: 'Lingkungan III (Jaga 3)',
      populasi: 295,
      kk: 112,
      lakiLaki: 144,
      perempuan: 151,
      pala: 'Agustinus Sapanany / Paulus Wuntuale',
    },
    {
      id: 'lingk-4',
      nomor: 4,
      nama: 'Lingkungan IV (Jaga 4)',
      populasi: 304,
      kk: 107,
      lakiLaki: 149,
      perempuan: 155,
      pala: 'Stenly Posumah / Djoni Kapele',
    },
    {
      id: 'lingk-5',
      nomor: 5,
      nama: 'Lingkungan V (Jaga 5)',
      populasi: 290,
      kk: 108,
      lakiLaki: 141,
      perempuan: 149,
      pala: 'Joutje Rumagit / Fredi Rumagit',
    },
  ],
};
