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
};
