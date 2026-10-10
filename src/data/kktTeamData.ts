export interface KktMember {
  id: string;
  name: string;
  role: string;
  badge?: string;
  photoUrl: string;
}

export interface SupervisorPerson {
  role: string;
  badge: string;
  name: string;
  title: string;
  institution: string;
}

export interface KktTeamConfig {
  angkatan: string;
  university: string;
  poskoLocation: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  stats: {
    totalAnggota: number;
    totalBidang: number;
    angkatanNumber: string;
    detailAnggota: string;
    daftarBidang: string;
  };
  supervisors: {
    dosenPembimbing: SupervisorPerson;
    dosenPengawas: SupervisorPerson;
    koordinatorP3KKNT: SupervisorPerson;
  };
  pengurusPosko: KktMember[];
  bidangProgram: KktMember[];
  bidangHumas: KktMember[];
  bidangPublikasi: KktMember[];
  bidangPelaporan: KktMember[];
}

export const KKT_TEAM_DATA: KktTeamConfig = {
  angkatan: 'KKT Angkatan 149',
  university: 'Universitas Sam Ratulangi (UNSRAT)',
  poskoLocation: 'Posko Kelurahan Kolongan Satu',
  kelurahan: 'Kelurahan Kolongan Satu',
  kecamatan: 'Kecamatan Tomohon Tengah',
  kota: 'Kota Tomohon',
  stats: {
    totalAnggota: 14,
    totalBidang: 4,
    angkatanNumber: '149',
    detailAnggota: '3 Pengurus Inti • 11 Anggota Bidang',
    daftarBidang: 'Program, Humas, Publikasi & Pelaporan',
  },
  supervisors: {
    dosenPembimbing: {
      role: 'Dosen Pembimbing Lapangan (DPL)',
      badge: 'DPL Posko',
      name: 'Dr. dr. Aaltje E. Manampiring, M.Kes',
      title: 'Dosen Pembimbing Lapangan Posko Kolongan Satu',
      institution: 'Universitas Sam Ratulangi (UNSRAT)',
    },
    dosenPengawas: {
      role: 'Dosen Pengawas Lapangan',
      badge: 'Pengawas Wilayah',
      name: 'Dr. Ir. Stevanus P. Pangemanan, M.Si',
      title: 'Dosen Pengawas KKT Wilayah Kecamatan Tomohon Tengah',
      institution: 'Universitas Sam Ratulangi (UNSRAT)',
    },
    koordinatorP3KKNT: {
      role: 'Koordinator P3KKNT UNSRAT',
      badge: 'Koordinator P3KKNT',
      name: 'Dr. Ir. Rignolda Djamaluddin, M.Sc.',
      title: 'Pusat Pengelolaan & Pengembangan KKN Terpadu (P3KKNT)',
      institution: 'LPPM Universitas Sam Ratulangi',
    },
  },
  pengurusPosko: [
    {
      id: 'levandro-eldrico-lumi',
      name: 'Levandro Eldrico Lumi',
      role: 'Koordinator Posko',
      badge: 'Koorposko',
      photoUrl: '/images/team/levandro-eldricalumi.png',
    },
    {
      id: 'hivi-yaloca-br-tarigan',
      name: 'Hivi Yaloca Br Tarigan',
      role: 'Sekretaris',
      badge: 'Sekretaris Posko',
      photoUrl: '/images/team/hivi-yaloca.png',
    },
    {
      id: 'alvrillia-fransiska-sinjal',
      name: 'Alvrillia Fransiska Sinjal',
      role: 'Bendahara',
      badge: 'Bendahara Posko',
      photoUrl: '/images/team/alvrillia-fransiska.png',
    },
  ],
  bidangProgram: [
    {
      id: 'imelda-wawointana',
      name: 'Imelda Wawointana',
      role: 'Koordinator',
      badge: 'Koordinator Bidang',
      photoUrl: '/images/team/imelda-wawointana.png',
    },
    {
      id: 'astria-dhea-slarmanat',
      name: 'Astria Dhea Slarmanat',
      role: 'Anggota',
      badge: 'Anggota Bidang',
      photoUrl: '/images/team/astria-dhea-slarmanat.png',
    },
    {
      id: 'shallomitha-korua',
      name: 'Shallomitha Korua',
      role: 'Anggota',
      badge: 'Anggota Bidang',
      photoUrl: '/images/team/shallomitha-korua.png',
    },
  ],
  bidangHumas: [
    {
      id: 'krisindah-natalia-pamondolang',
      name: 'Krisindah Natalia Pamondolang',
      role: 'Koordinator',
      badge: 'Koordinator Divisi',
      photoUrl: '/images/team/krisindah-pamondolang.png',
    },
    {
      id: 'cindi-valerina-kembuan',
      name: 'Cindi Valerina Kembuan',
      role: 'Anggota',
      badge: 'Anggota Bidang',
      photoUrl: '/images/team/cindi-kembuan.png',
    },
    {
      id: 'morientes-cannavaro-pakasi',
      name: 'Morientes Cannavaro Pakasi',
      role: 'Anggota',
      badge: 'Anggota Bidang',
      photoUrl: '/images/team/morientes-pakasi.png',
    },
  ],
  bidangPublikasi: [
    {
      id: 'edward-benedict',
      name: 'Edward Benedict',
      role: 'Koordinator',
      badge: 'Koordinator Divisi',
      photoUrl: '/images/team/edward-benedict.png',
    },
    {
      id: 'angela-ferdiane-esra-malonda',
      name: 'Angela Ferdiane Esra Malonda',
      role: 'Anggota',
      badge: 'Anggota Bidang',
      photoUrl: '/images/team/angela-malonda.png',
    },
    {
      id: 'felita-trizein-rapa',
      name: 'Felita Trizein Rapa',
      role: 'Anggota',
      badge: 'Anggota Bidang',
      photoUrl: '/images/team/felita-rapa.png',
    },
  ],
  bidangPelaporan: [
    {
      id: 'israel-leonil-sengkey',
      name: 'Israel Leonil Sengkey',
      role: 'Koordinator',
      badge: 'Koordinator Divisi',
      photoUrl: '/images/team/israel-sengkey.png',
    },
    {
      id: 'riqelme-hosea-joyersi-rori',
      name: 'Riqelme Hosea Joyersi Rori',
      role: 'Anggota',
      badge: 'Anggota Bidang',
      photoUrl: '/images/team/riqelme-rori.png',
    },
  ],
};
