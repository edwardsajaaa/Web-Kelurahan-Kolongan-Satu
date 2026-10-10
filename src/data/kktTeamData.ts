export interface KktMember {
  id: string;
  name: string;
  role: string;
  nim?: string;
  major: string;
  faculty: string;
  photoUrl?: string;
  responsibilities: string[];
  contact?: {
    email?: string;
    instagram?: string;
  };
}

export interface KktDivision {
  id: string;
  title: string;
  badge: string;
  focus: string;
  iconName: string; // Lucide icon identifier
  colorTheme: string;
  coordinator: KktMember;
  members: KktMember[];
}

export interface KktTeamConfig {
  angkatan: string;
  university: string;
  poskoLocation: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  periode: string;
  dpl: {
    name: string;
    nip?: string;
    role: string;
  };
  leader: KktMember;
  coreExecutive: {
    secretary: KktMember;
    treasurer: KktMember;
  };
  divisions: KktDivision[];
}

export const KKT_TEAM_DATA: KktTeamConfig = {
  angkatan: 'KKT Angkatan 149',
  university: 'Universitas Sam Ratulangi (UNSRAT)',
  poskoLocation: 'Posko Kelurahan Kolongan Satu',
  kelurahan: 'Kelurahan Kolongan Satu',
  kecamatan: 'Kecamatan Tomohon Tengah',
  kota: 'Kota Tomohon',
  periode: 'Tahun 2024 / 2025',
  dpl: {
    name: 'Dosen Pembimbing Lapangan (DPL)',
    nip: 'NIP. 198XXXXXXXXXXXXXXX',
    role: 'Pembimbing & Supervisor Akademik KKT',
  },
  leader: {
    id: 'lead-1',
    name: 'Koordinator Posko (Ketua Tim)',
    role: 'Koordinator Posko (Koorposko)',
    nim: 'NIM. 210XXXXXXXXX',
    major: 'Teknik Informatika / Ilmu Komputer',
    faculty: 'Fakultas Teknik',
    responsibilities: [
      'Memimpin dan mengoordinasikan seluruh perumusan serta eksekusi program kerja KKT.',
      'Menjalin kemitraan dan koordinasi strategis dengan Pemerintah Kelurahan & Kepala Lingkungan (Pala 1–5).',
      'Memastikan monitoring, evaluasi, serta ketercapaian luaran program kerja digitalisasi kelurahan.',
    ],
    contact: {
      email: 'koorposko@kkt.unsrat.ac.id',
    },
  },
  coreExecutive: {
    secretary: {
      id: 'sec-1',
      name: 'Sekretaris Posko',
      role: 'Sekretaris Posko',
      nim: 'NIM. 210XXXXXXXXX',
      major: 'Ilmu Administrasi Publik',
      faculty: 'Fakultas Ilmu Sosial & Politik',
      responsibilities: [
        'Penyusunan administrasi persuratan resmi, notulensi rapat, dan arsip digital posko.',
        'Penyusunan Laporan Pertanggungjawaban (LPJ) KKT & buku panduan operasional.',
        'Manajemen arsip dokumen kerja sama posko dengan perangkat kelurahan.',
      ],
      contact: {
        email: 'sekretaris@kkt.unsrat.ac.id',
      },
    },
    treasurer: {
      id: 'tre-1',
      name: 'Bendahara Posko',
      role: 'Bendahara Posko',
      nim: 'NIM. 210XXXXXXXXX',
      major: 'Akuntansi / Manajemen Keuangan',
      faculty: 'Fakultas Ekonomi & Bisnis',
      responsibilities: [
        'Pengelolaan anggaran operasional posko & alokasi dana program kerja.',
        'Pencatatan pembukuan kas harian dan bukti transaksi secara transparan.',
        'Penyusunan rekapitulasi laporan pertanggungjawaban keuangan posko.',
      ],
      contact: {
        email: 'bendahara@kkt.unsrat.ac.id',
      },
    },
  },
  divisions: [
    {
      id: 'div-digitalisasi',
      title: 'Bidang Digitalisasi & Sistem Informasi',
      badge: 'Teknologi & Web',
      focus: 'Pengembangan Website Resmi Portal Monografi Digital, Peta Interaktif 3D Wilayah, dan Otomatisasi Administrasi Pelayanan Warga.',
      iconName: 'Laptop',
      colorTheme: 'from-blue-500/10 to-indigo-500/10 text-[#006194] border-blue-200',
      coordinator: {
        id: 'div-coord-1',
        name: 'Koordinator Bidang Digitalisasi',
        role: 'Koordinator Bidang',
        nim: 'NIM. 210XXXXXXXXX',
        major: 'Sistem Informasi / Informatika',
        faculty: 'Fakultas Teknik',
        responsibilities: [
          'Arsitektur sistem web portal & database Supabase kelurahan.',
          'Integrasi peta 3D MapLibre & data spasial 5 Jaga.',
        ],
      },
      members: [
        {
          id: 'div-mem-1a',
          name: 'Anggota Divisi IT 1',
          role: 'Frontend & UI/UX',
          major: 'Teknik Informatika',
          faculty: 'Fakultas Teknik',
          responsibilities: ['Desain antarmuka & responsivitas portal.'],
        },
        {
          id: 'div-mem-1b',
          name: 'Anggota Divisi IT 2',
          role: 'Data Analyst & Backend',
          major: 'Sistem Informasi',
          faculty: 'Fakultas Teknik',
          responsibilities: ['Integrasi API & sinkronisasi data kependudukan.'],
        },
      ],
    },
    {
      id: 'div-monografi',
      title: 'Bidang Monografi & Pemetaan Wilayah',
      badge: 'Data & Geospasial',
      focus: 'Verifikasi faktual data papan monografi 5 Lingkungan (Jaga), pemutakhiran agregat demografi, dan penataan batas teritorial.',
      iconName: 'MapPin',
      colorTheme: 'from-emerald-500/10 to-teal-500/10 text-[#006c49] border-emerald-200',
      coordinator: {
        id: 'div-coord-2',
        name: 'Koordinator Bidang Pemetaan',
        role: 'Koordinator Bidang',
        nim: 'NIM. 210XXXXXXXXX',
        major: 'Perencanaan Wilayah & Kota',
        faculty: 'Fakultas Teknik',
        responsibilities: [
          'Pengumpulan & verifikasi data agregat demografi faktual kelurahan.',
          'Pemetaan koordinat fasilitas umum, rumah ibadah, dan batas wilayah.',
        ],
      },
      members: [
        {
          id: 'div-mem-2a',
          name: 'Anggota Divisi Pemetaan 1',
          role: 'Surveyor Lapangan Jaga 1–3',
          major: 'Geografi / PWK',
          faculty: 'Fakultas Teknik',
          responsibilities: ['Sensus lapangan & wawancara Kepala Lingkungan.'],
        },
        {
          id: 'div-mem-2b',
          name: 'Anggota Divisi Pemetaan 2',
          role: 'Surveyor Lapangan Jaga 4–5',
          major: 'Statistika / Sosiologi',
          faculty: 'Fakultas MIPA',
          responsibilities: ['Kompilasi lembar monografi & rekap kependudukan.'],
        },
      ],
    },
    {
      id: 'div-humas',
      title: 'Bidang Hubungan Masyarakat & Pengabdian',
      badge: 'Sosial & Edukasi',
      focus: 'Sosialisasi program kemasyarakatan, pendampingan posyandu, gotong royong Mapalus warga, dan fasilitasi aspirasi masyarakat.',
      iconName: 'HeartHandshake',
      colorTheme: 'from-amber-500/10 to-orange-500/10 text-[#b84e00] border-amber-200',
      coordinator: {
        id: 'div-coord-3',
        name: 'Koordinator Bidang Humas',
        role: 'Koordinator Bidang',
        nim: 'NIM. 210XXXXXXXXX',
        major: 'Ilmu Komunikasi',
        faculty: 'Fakultas Ilmu Sosial & Politik',
        responsibilities: [
          'Komunikasi harian dengan tokoh agama, tokoh adat, dan perangkat kelurahan.',
          'Koordinasi kegiatan sosial, mapalus, dan sosialisasi portal warga.',
        ],
      },
      members: [
        {
          id: 'div-mem-3a',
          name: 'Anggota Divisi Humas 1',
          role: 'Fasilitator Komunitas',
          major: 'Ilmu Komunikasi',
          faculty: 'FISIP',
          responsibilities: ['Fasilitator posyandu & kegiatan kepemudaan.'],
        },
        {
          id: 'div-mem-3b',
          name: 'Anggota Divisi Humas 2',
          role: 'Pendamping Warga',
          major: 'Pendidikan / Hukum',
          faculty: 'Fakultas Hukum',
          responsibilities: ['Penyuluhan pelayanan surat & aduan publik.'],
        },
      ],
    },
    {
      id: 'div-publikasi',
      title: 'Bidang Publikasi & Dokumentasi',
      badge: 'Media & Kreatif',
      focus: 'Dokumentasi visual kegiatan harian, produksi konten media sosial edukasi, fotografi arsip cagar budaya, dan publikasi digital.',
      iconName: 'Camera',
      colorTheme: 'from-purple-500/10 to-pink-500/10 text-[#673ab7] border-purple-200',
      coordinator: {
        id: 'div-coord-4',
        name: 'Koordinator Bidang Publikasi',
        role: 'Koordinator Bidang',
        nim: 'NIM. 210XXXXXXXXX',
        major: 'Desain Komunikasi Visual / Sastra',
        faculty: 'Fakultas Ilmu Budaya',
        responsibilities: [
          'Pengelolaan media publikasi dan siaran informasi kegiatan KKT.',
          'Dokumentasi foto & video cagar budaya Nimawanua & kegiatan warga.',
        ],
      },
      members: [
        {
          id: 'div-mem-4a',
          name: 'Anggota Divisi Publikasi 1',
          role: 'Fotografer & Videografer',
          major: 'DKV / Arsitektur',
          faculty: 'Fakultas Teknik',
          responsibilities: ['Produksi materi visual & arsip dokumentasi posko.'],
        },
        {
          id: 'div-mem-4b',
          name: 'Anggota Divisi Publikasi 2',
          role: 'Content Creator & Copywriter',
          major: 'Sastra Inggris / Komunikasi',
          faculty: 'FIB',
          responsibilities: ['Penulisan rilis berita kegiatan posko & infografis.'],
        },
      ],
    },
  ],
};
