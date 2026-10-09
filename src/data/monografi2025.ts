/**
 * MASTER DATA RESMI MONOGRAFI KELURAHAN KOLONGAN SATU TAHUN 2025
 * Pemutakhiran Semester Berjalan 2025, Kecamatan Tomohon Tengah, Kota Tomohon.
 */

export const DATA_MONOGRAFI_2025 = {
  tahun: 2025,
  wilayah: {
    nama: "Kelurahan Kolongan Satu",
    kecamatan: "Tomohon Tengah",
    kota: "Kota Tomohon",
    luas_total_ha: 208.25,
    koordinat: { bt: "124°50'20'' BT", lu: "1°19'20'' LU" },
    topografi: {
      ketinggian: "700 - 900 mdpl",
      suhu_rata_rata: "23°C",
      curah_hujan: "600 - 800 mm",
      karakter: "Dataran tinggi bergelombang subur"
    },
    tata_guna_lahan: {
      pemukiman_ha: 34.50,
      pertanian_perkebunan_ha: 9.50,
      pekarangan_ha: 4.00,
      sawah_ha: 5.00,
      tanah_kering_ha: 185.75,
      fasilitas_umum_ha: 7.50,
      rawa_ha: 0.50,
      lahan_tidur_ha: 0.05
    },
    batas: {
      utara: "Kelurahan Kolongan",
      timur: "Kelurahan Walian, Matani Tiga",
      selatan: "Kelurahan Lansot",
      barat: "Kelurahan Lansot"
    }
  },
  kependudukan: {
    total_jiwa: 1512,
    laki_laki: 730,
    perempuan: 782,
    total_kk: 1512,
    hak_pilih: 1245,
    kelompok_usia: {
      balita_0_6: 121,
      usia_sekolah_7_18: 247,
      produktif_18_56: 864,
      lansia_diatas_56: 280
    }
  },
  pendidikan: {
    belum_tk: { laki: 15, perempuan: 13 },
    sedang_tk: { laki: 19, perempuan: 18 },
    sedang_sekolah_7_18: { laki: 112, perempuan: 109 },
    tamat_sd: { laki: 35, perempuan: 35 },
    tamat_smp: { laki: 96, perempuan: 83 },
    tamat_sma: { laki: 190, perempuan: 231 },
    tamat_diploma: { d2: 13, d3: 36 },
    tamat_sarjana_s1: { laki: 76, perempuan: 99 },
    tamat_pascasarjana: { s2: 22, s3: 2 },
    tamat_slb: 1,
    rasio_guru_murid: [
      { jenjang: "TK", guru: 1, murid: 17 },
      { jenjang: "SD", guru: 11, murid: 138 },
      { jenjang: "SMP", guru: 4, murid: 60 },
      { jenjang: "SMA", guru: 8, murid: 49 }
    ]
  },
  keagamaan: {
    katolik: 921,
    protestan: 506,
    islam: 57,
    sarana_ibadah: [
      "Gedung Gereja GMIM Elohim",
      "Gedung Gereja GSJK",
      "Gedung Gereja Kristus A",
      "Gedung Gereja Kristianus"
    ]
  },
  ekonomi_dan_umkm: {
    sektor_dominan: ["Karyawan Swasta (184)", "Wiraswasta (123)", "PNS (85)", "Petani (32)", "Perawat (34)"],
    tempat_usaha: [
      "Fides Sport Club", "Monstera Cafe", "Apotik Wins Dental",
      "Etsuko Kitchen", "Taman Asri Edelweis", "Dealer Dilan Kaven",
      "Cataleya Florist", "AlfaMart", "Eugne Dessert and Pastry"
    ]
  },
  sarana_publik: {
    olahraga: "2 Lapangan Badminton, 2 Lapangan Bola Volly, 2 Lapangan Basket",
    kesehatan: "1 Puskesmas Pembantu, Gedung Posyandu, Praktek Dokter, Praktek Gigi",
    kebersihan: "Petugas Kebersihan Rutin Pemkot Tomohon"
  }
};

export const MONOGRAFI_2025 = DATA_MONOGRAFI_2025;
