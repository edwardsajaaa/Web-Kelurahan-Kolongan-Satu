export interface KktMember {
  id: string;
  name: string;
  role: string;
  badge?: string;
  photoUrl: string;
}

export interface KktTeamConfig {
  angkatan: string;
  university: string;
  poskoLocation: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  pengurusPosko: KktMember[];
  bidangProgram: KktMember[];
}

export const KKT_TEAM_DATA: KktTeamConfig = {
  angkatan: 'KKT Angkatan 149',
  university: 'Universitas Sam Ratulangi (UNSRAT)',
  poskoLocation: 'Posko Kelurahan Kolongan Satu',
  kelurahan: 'Kelurahan Kolongan Satu',
  kecamatan: 'Kecamatan Tomohon Tengah',
  kota: 'Kota Tomohon',
  pengurusPosko: [
    {
      id: '',
      name: 'Sultan',
      role: 'Koordinator Posko',
      badge: 'Koorposko',
      photoUrl: '/images/team/sultan.png',
    },
    {
      id: 'brilliani-potalangi',
      name: 'Brilliani Potalangi',
      role: 'Sekretaris',
      badge: 'Sekretaris Posko',
      photoUrl: '/images/team/brilliani-potalangi.png',
    },
    {
      id: 'leily-runtuwene',
      name: 'Leily Runtuwene',
      role: 'Bendahara',
      badge: 'Bendahara Posko',
      photoUrl: '/images/team/leily-runtuwene.png',
    },
  ],
  bidangProgram: [
    {
      id: 'ronaldino-kaunang',
      name: 'Ronaldino Kaunang',
      role: 'Koordinator',
      badge: 'Koordinator Bidang',
      photoUrl: '/images/team/ronaldino-kaunang.png',
    },
    {
      id: 'mahyuni-d',
      name: 'Mahyuni D.',
      role: 'Anggota',
      badge: 'Anggota Bidang',
      photoUrl: '/images/team/mahyuni-d.png',
    },
    {
      id: 'michael-sigalingging',
      name: 'Michael H. Sigalingging',
      role: 'Anggota',
      badge: 'Anggota Bidang',
      photoUrl: '/images/team/michael-sigalingging.png',
    },
    {
      id: 'karin-lontoh',
      name: 'Karin F. Lontoh',
      role: 'Anggota',
      badge: 'Anggota Bidang',
      photoUrl: '/images/team/karin-lontoh.png',
    },
  ],
};
