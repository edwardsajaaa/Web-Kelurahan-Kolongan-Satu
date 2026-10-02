export interface CitizenReport {
  id: string;
  ticketNo: string;
  namaWarga: string;
  kontakWarga: string;
  lingkunganId: number;
  lingkunganName: string;
  klasifikasi: 'Air Bersih' | 'Drainase' | 'Lampu Jalan' | 'Sampah' | 'Keamanan & Trantib';
  isiLaporan: string;
  fotoBuktiUrl?: string;
  status: 'menunggu_tanggapan' | 'dalam_tindakan' | 'selesai';
  statusLabel: string;
  disposisiKepada?: string;
  tanggapanPetugas?: string;
  dilaporkanPada: string;
  diselesaikanPada?: string;
}

export const INITIAL_REPORTS: CitizenReport[] = [
  {
    id: 'rep-01',
    ticketNo: 'LAPOR-KKT-8801',
    namaWarga: 'Franky Runtuwene',
    kontakWarga: '0812-4433-2211',
    lingkunganId: 3,
    lingkunganName: 'Lingkungan III',
    klasifikasi: 'Air Bersih',
    isiLaporan: 'Pipa distribusi swadaya dari mata air alami titik 2 sedikit tersumbat endapan pasir pasca hujan deras semalam.',
    fotoBuktiUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?w=600&auto=format&fit=crop&q=80',
    status: 'dalam_tindakan',
    statusLabel: 'Sedang Dalam Tindakan',
    disposisiKepada: 'Kasie Pembangunan (Mathilda Mantow) & Pala Agustinus Sapanany',
    tanggapanPetugas: 'Tim Linmas bersama warga kerja bakti pembersihan saringan tangkapan mata air.',
    dilaporkanPada: '01 Mar 2026 07:15 WITA'
  },
  {
    id: 'rep-02',
    ticketNo: 'LAPOR-KKT-8802',
    namaWarga: 'Meike Supit',
    kontakWarga: '0813-5599-4400',
    lingkunganId: 5,
    lingkunganName: 'Lingkungan V',
    klasifikasi: 'Lampu Jalan',
    isiLaporan: 'Lampu penerangan jalan solar cell di tikungan perbatasan Kamasi padam sensor otomatisnya sejak dua malam.',
    fotoBuktiUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?w=600&auto=format&fit=crop&q=80',
    status: 'selesai',
    statusLabel: 'Selesai Diperbaiki',
    disposisiKepada: 'Pelaksana Karlin S. Poter & Pala Vifi Timang',
    tanggapanPetugas: 'Aki solar cell telah diganti unit cadangan dari inventaris pengadaan kelurahan.',
    dilaporkanPada: '27 Feb 2026 19:40 WITA',
    diselesaikanPada: '28 Feb 2026 11:00 WITA'
  },
  {
    id: 'rep-03',
    ticketNo: 'LAPOR-KKT-8803',
    namaWarga: 'Ridel Mandagi',
    kontakWarga: '0852-6633-8822',
    lingkunganId: 2,
    lingkunganName: 'Lingkungan II',
    klasifikasi: 'Drainase',
    isiLaporan: 'Ada ranting pohon tumbang menyumbat got samping gedung serbaguna, dikhawatirkan air meluap ke badan jalan.',
    status: 'menunggu_tanggapan',
    statusLabel: 'Menunggu Disposisi',
    dilaporkanPada: '02 Mar 2026 09:45 WITA'
  }
];
