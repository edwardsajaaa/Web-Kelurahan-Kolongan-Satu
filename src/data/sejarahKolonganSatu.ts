// src/data/sejarahKolonganSatu.ts

export interface WarisanSejarah {
  id: string;
  judul: string;
  subjudul: string;
  periode: string;
  deskripsi: string;
  lokasi: string;
  tag: string;
}

export interface TokohSejarah {
  nama: string;
  gelarPeran: string;
  era: string;
  keterangan: string;
  jejakWilayah: string;
}

export const DATA_SEJARAH_KOLONGAN_SATU = {
  ringkasan: {
    namaKuno: "Nimawanua (Negeri Tua Tomohon)",
    toponimi: "Pemekaran wilayah dari induk Kolongan, berakar dari permukiman purba Tombulu di dataran tinggi kaki Gunung Lokon.",
    karakteristik: "Pusat peradaban awal, pasar barter pertama, dan tanah peristirahatan para Tonaas Minahasa."
  },
  garisWaktu: [
    {
      tahun: "Abad ke-18 – 1840",
      peristiwa: "Pusat Nimawanua & Permukiman Para Tonaas",
      detail: "Wilayah Kolongan 1 menjadi pusat negeri tua (Nimawanua) di mana para Dotu dan Tonaas suku Tombulu bermukim dan dimakamkan dalam peti batu Waruga."
    },
    {
      tahun: "Era Pra-Kolonial s/d 1913",
      peristiwa: "Titik Pasar Barter Pertama Tomohon",
      detail: "Pasar tradisional pertama di Tomohon lahir di kawasan Nimawanua di bawah naungan pohon damar raksasa sebelum sistem perdagangan modern dipindahkan."
    },
    {
      tahun: "8 Februari 1845",
      peristiwa: "Peristiwa Gempa Bumi Nimawanua",
      detail: "Gempa bumi dahsyat memicu penataan kembali permukiman warga ke arah wilayah-wilayah sekitarnya seperti Talete, Kamasi, dan Matani."
    },
    {
      tahun: "Tahun 1960-an",
      peristiwa: "Penebangan Pohon Damar Bersejarah",
      detail: "Pohon damar raksasa yang menjadi penanda pasar purba akhirnya ditebang seiring perkembangan tata ruang pemukiman modern."
    }
  ],
  tokohLeluhur: [
    {
      nama: "Dotu Tololiu Tua (Mangangantung)",
      gelarPeran: "Pemimpin Besar Adat Suku Tombulu",
      era: "Awal Berdirinya Nimawanua",
      keterangan: "Tonaas pemersatu yang memimpin perpindahan awal dan pemukiman masyarakat di kawasan kota tua Tomohon (Nimawanua / Kolongan Satu).",
      jejakWilayah: "Tugu peringatan kepemimpinan adat di perbatasan Tomohon."
    },
    {
      nama: "Dotu Reko",
      gelarPeran: "Perintis Pemukiman Selatan Kolongan Satu",
      era: "Abad ke-19",
      keterangan: "Putra dari Dotu Tololiu Tua yang memimpin perluasan permukiman ke sisi selatan wilayah.",
      jejakWilayah: "Toponimi Kawasan Reko di bagian selatan Kelurahan Kolongan Satu."
    },
    {
      nama: "Tololiu Palar (Wafat 1875)",
      gelarPeran: "Hukum Tua Matani Pertama / Tokoh Distrik",
      era: "Pertengahan Abad ke-19",
      keterangan: "Tokoh berpengaruh era transisi pemerintahan kolonial yang pusara makam waruga aslinya berada di sekitar tanah Nimawanua.",
      jejakWilayah: "Kompleks Waruga bersejarah Tomohon."
    }
  ],
  situsCagarBudaya: [
    {
      id: "waruga-nimawanua",
      judul: "Situs 7 Waruga Nimawanua",
      subjudul: "Makam Megalitikum Pemimpin Minahasa",
      periode: "Abad ke-19 (Tercatat 1840)",
      deskripsi: "Makam megalitikum berisi 7 peti batu relief khas Tombulu, bukti peradaban tertua para pemimpin dan tonaas Minahasa.",
      lokasi: "Kawasan Fajar Harapan & Makam Susteran",
      tag: "Cagar Budaya Resmi"
    },
    {
      id: "pasar-damar",
      judul: "Titik Pasar Pertama & Pohon Damar",
      subjudul: "Pusat Niaga Purba Tomohon",
      periode: "Pra-Kemerdekaan s/d 1960",
      deskripsi: "Pusat niaga dan barter purba pertama Tomohon, tempat bertemunya petani lereng Lokon dan Mahawu di bawah pohon damar bersejarah.",
      lokasi: "Jalan Raya Utama Kolongan Satu",
      tag: "Titik Sejarah Budaya"
    },
    {
      id: "misi-jmj",
      judul: "Misi Sosial & Makam Susteran JMJ",
      subjudul: "Pionir Pendidikan Inklusi",
      periode: "Awal Abad ke-20",
      deskripsi: "Jejak karya kemanusiaan susteran JMJ dan perintis sekolah inklusi tuna netra pertama di Tomohon.",
      lokasi: "Kompleks Persekolahan Katolik",
      tag: "Pelayanan Sosial"
    }
  ],
  referensiValid: [
    {
      penulis: "Adrianus Kojongian",
      judul: "Pasar Tomohon April 1913 (Catatan Sejarah Pasar Pertama di Nimawanua Kolongan 1)",
      tahun: "2013",
      url: "http://adrianuskojongian.blogspot.com/2013/05/pasar-tomohon-april-1911.html"
    },
    {
      penulis: "Dinas Pariwisata dan Kebudayaan Kota Tomohon",
      judul: "Inventaris Benda Cagar Budaya: Waruga Nimawanua Kolongan",
      tahun: "Registrasi Resmi",
      url: "https://tomohon.info/travel/waruga-nimawanua-kolongan/"
    },
    {
      penulis: "Adrianus Kojongian",
      judul: "Tomohon, Kota Tua Tanah Minahasa",
      tahun: "2016",
      url: "http://adrianuskojongian.blogspot.com/2016/12/tomohon-kota-tua-tanah-minahasa.html"
    }
  ]
};
