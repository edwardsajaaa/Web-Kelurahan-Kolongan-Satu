import { supabase, isSupabaseConfigured } from './client';
import { createServerClient, isServerSupabaseConfigured } from './server';
import { LetterRequest, INITIAL_LETTERS } from '@/data/lettersData';
import { CitizenReport, INITIAL_REPORTS } from '@/data/reportsData';
import { MONOGRAFI_ITEMS, MonografiItem } from '@/data/monografiData';
import {
  FasilitasItem,
  SanitasiStats,
  AparaturData,
  ActivitySlide,
  KontakInfo,
  LandingContentPayload,
  INITIAL_FASILITAS,
  INITIAL_SANITASI_STATS,
  INITIAL_APARATUR_DATA,
  INITIAL_ACTIVITY_SLIDES,
  INITIAL_KONTAK_INFO,
} from '@/data/landingContentData';

// In-memory fallback stores for local/offline resilience
let inMemoryLetters: LetterRequest[] = [...INITIAL_LETTERS];
let inMemoryReports: CitizenReport[] = [...INITIAL_REPORTS];
let inMemoryMonografi: MonografiItem[] = [...MONOGRAFI_ITEMS];
let inMemoryLandingContent: LandingContentPayload = {
  fasilitas: [...INITIAL_FASILITAS],
  sanitasi: { ...INITIAL_SANITASI_STATS },
  aparatur: JSON.parse(JSON.stringify(INITIAL_APARATUR_DATA)),
  kegiatan: [...INITIAL_ACTIVITY_SLIDES],
  kontak: { ...INITIAL_KONTAK_INFO },
};

// ==========================================
// 1. LAYANAN SURAT (LETTERS)
// ==========================================

export async function fetchLetters(): Promise<LetterRequest[]> {
  if (isServerSupabaseConfigured) {
    try {
      const serverClient = createServerClient();
      const { data, error } = await (serverClient as any)
        .from('layanan_surat')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return (data as any[]).map((item) => {
          const isi = (item.isi_permohonan as any) || {};
          return {
            id: item.id,
            noRegistrasi: item.no_registrasi,
            nikPemohon: item.nik_pemohon,
            namaPemohon: item.nama_pemohon,
            nomorWaPemohon: item.nomor_wa_pemohon,
            jenisSurat: item.jenis_surat,
            lingkunganId: isi.lingkunganId || 1,
            tujuanKeperluan: isi.keperluan || isi.tujuanKeperluan || '',
            alamatLengkap: isi.alamatLengkap || `Lingkungan ${isi.lingkunganId || 1}, Kolongan Satu`,
            pekerjaan: isi.pekerjaan || 'Warga',
            berkasLampiranUrl: item.berkas_lampiran_url || undefined,
            berkasName: isi.berkasName || 'Lampiran.pdf',
            statusSurat: item.status_surat as LetterRequest['statusSurat'],
            statusLabel:
              item.status_surat === 'selesai_disahkan'
                ? 'Selesai & Disahkan Lurah'
                : item.status_surat === 'diparaf_seklur'
                ? 'Diparaf Seklur Febronia'
                : item.status_surat === 'diverifikasi_staf'
                ? 'Diverifikasi Staf Karlin'
                : 'Diajukan Warga',
            catatanPetugas: (item as any).catatan_petugas || undefined,
            diparafOleh: (item as any).diparaf_oleh || undefined,
            disahkanOleh: (item as any).disahkan_oleh || undefined,
            tanggalDiajukan: new Date(item.created_at).toLocaleDateString('id-ID'),
            tanggalSelesai: item.status_surat === 'selesai_disahkan' ? new Date((item as any).updated_at || item.created_at).toLocaleDateString('id-ID') : undefined,
          };
        });
      }
    } catch (err) {
      console.warn('[Supabase] Failed to fetch letters, falling back to memory store:', err);
    }
  }

  return inMemoryLetters;
}

export async function submitLetter(letter: Omit<LetterRequest, 'id'>): Promise<LetterRequest> {
  const newId = `let-${Date.now().toString(36)}`;
  const fullLetter: LetterRequest = {
    ...letter,
    id: newId,
  };

  if (isServerSupabaseConfigured) {
    try {
      const serverClient = createServerClient();
      const { data, error } = await (serverClient as any)
        .from('layanan_surat')
        .insert({
          no_registrasi: letter.noRegistrasi,
          nik_pemohon: letter.nikPemohon,
          nama_pemohon: letter.namaPemohon,
          nomor_wa_pemohon: letter.nomorWaPemohon,
          jenis_surat: letter.jenisSurat,
          isi_permohonan: {
            lingkunganId: letter.lingkunganId,
            keperluan: letter.tujuanKeperluan,
            alamatLengkap: letter.alamatLengkap,
            pekerjaan: letter.pekerjaan,
            berkasName: letter.berkasName,
          },
          berkas_lampiran_url: letter.berkasLampiranUrl || null,
          status_surat: letter.statusSurat || 'diajukan',
        })
        .select()
        .single();

      if (!error && data) {
        fullLetter.id = (data as any).id;
      }
    } catch (err) {
      console.warn('[Supabase] Failed to insert letter, saving in memory:', err);
    }
  }

  inMemoryLetters = [fullLetter, ...inMemoryLetters];
  return fullLetter;
}

export async function updateLetterStatus(
  id: string,
  newStatus: LetterRequest['statusSurat'],
  note?: string,
  officialName?: string
): Promise<LetterRequest | null> {
  let updatedLetter: LetterRequest | null = null;

  if (isServerSupabaseConfigured) {
    try {
      const serverClient = createServerClient();
      const updatePayload: any = {
        status_surat: newStatus,
        updated_at: new Date().toISOString(),
      };
      if (note) updatePayload.catatan_petugas = note;
      if (newStatus === 'diparaf_seklur') updatePayload.diparaf_oleh = officialName || 'Febronia L. Pijoh, S.Kom';
      if (newStatus === 'selesai_disahkan') updatePayload.disahkan_oleh = officialName || 'Theresia J. Kaunang, SE';

      await (serverClient as any)
        .from('layanan_surat')
        .update(updatePayload)
        .eq('id', id);
    } catch (err) {
      console.warn('[Supabase] Failed to update letter in DB:', err);
    }
  }

  inMemoryLetters = inMemoryLetters.map((l) => {
    if (l.id === id || l.noRegistrasi === id) {
      updatedLetter = {
        ...l,
        statusSurat: newStatus,
        statusLabel:
          newStatus === 'selesai_disahkan'
            ? 'Selesai & Disahkan Lurah'
            : newStatus === 'diparaf_seklur'
            ? 'Diparaf Seklur Febronia'
            : newStatus === 'diverifikasi_staf'
            ? 'Diverifikasi Staf Karlin'
            : 'Ditolak',
        catatanPetugas: note || l.catatanPetugas,
        diparafOleh: newStatus === 'diparaf_seklur' ? officialName || 'Febronia L. Pijoh, S.Kom (Seklur)' : l.diparafOleh,
        disahkanOleh: newStatus === 'selesai_disahkan' ? officialName || 'Theresia J. Kaunang, SE (Lurah)' : l.disahkanOleh,
        tanggalSelesai: newStatus === 'selesai_disahkan' ? new Date().toLocaleString('id-ID') : l.tanggalSelesai,
      };
      return updatedLetter;
    }
    return l;
  });

  return updatedLetter;
}

export async function findLetterByRegistration(query: string): Promise<LetterRequest | null> {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  if (isServerSupabaseConfigured) {
    try {
      const serverClient = createServerClient();
      const { data, error } = await (serverClient as any)
        .from('layanan_surat')
        .select('*')
        .or(`no_registrasi.ilike.%${clean}%,nik_pemohon.ilike.%${clean}%`)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const isi = (data.isi_permohonan as any) || {};
        return {
          id: data.id,
          noRegistrasi: data.no_registrasi,
          nikPemohon: data.nik_pemohon,
          namaPemohon: data.nama_pemohon,
          nomorWaPemohon: data.nomor_wa_pemohon,
          jenisSurat: data.jenis_surat,
          lingkunganId: isi.lingkunganId || 1,
          tujuanKeperluan: isi.keperluan || isi.tujuanKeperluan || '',
          alamatLengkap: isi.alamatLengkap || `Lingkungan ${isi.lingkunganId || 1}, Kolongan Satu`,
          pekerjaan: isi.pekerjaan || 'Warga',
          berkasLampiranUrl: data.berkas_lampiran_url || undefined,
          berkasName: isi.berkasName || 'Lampiran.pdf',
          statusSurat: data.status_surat as LetterRequest['statusSurat'],
          statusLabel:
            data.status_surat === 'selesai_disahkan'
              ? 'Selesai & Disahkan Lurah'
              : data.status_surat === 'diparaf_seklur'
              ? 'Diparaf Seklur Febronia'
              : data.status_surat === 'diverifikasi_staf'
              ? 'Diverifikasi Staf Karlin'
              : 'Diajukan Warga',
          catatanPetugas: data.catatan_petugas || undefined,
          diparafOleh: data.diparaf_oleh || undefined,
          disahkanOleh: data.disahkan_oleh || undefined,
          tanggalDiajukan: new Date(data.created_at).toLocaleDateString('id-ID'),
          tanggalSelesai: data.status_surat === 'selesai_disahkan' ? new Date(data.updated_at || data.created_at).toLocaleDateString('id-ID') : undefined,
        };
      }
    } catch (err) {
      console.warn('[Supabase] Gagal mencari surat di database, mencari di memori lokal:', err);
    }
  }

  const found = inMemoryLetters.find(
    (l) =>
      l.noRegistrasi.toLowerCase().includes(clean) ||
      l.nikPemohon.toLowerCase().includes(clean) ||
      l.id.toLowerCase() === clean
  );
  return found || null;
}

// ==========================================
// 2. LAPORAN WARGA (REPORTS)
// ==========================================

export async function fetchReports(): Promise<CitizenReport[]> {
  if (isServerSupabaseConfigured) {
    try {
      const serverClient = createServerClient();
      const { data, error } = await (serverClient as any)
        .from('laporan_warga')
        .select('*')
        .order('dilaporkan_pada', { ascending: false });

      if (!error && data && data.length > 0) {
        return (data as any[]).map((item) => ({
          id: item.id,
          ticketNo: item.ticket_no || `LAP-${item.id.slice(0, 8)}`,
          namaWarga: item.nama_warga,
          kontakWarga: item.kontak_warga,
          lingkunganId: item.lingkungan_id,
          lingkunganName: `Lingkungan ${item.lingkungan_id}`,
          klasifikasi: item.klasifikasi as CitizenReport['klasifikasi'],
          isiLaporan: item.isi_laporan,
          fotoBuktiUrl: item.foto_bukti_url || undefined,
          status: item.status,
          statusLabel:
            item.status === 'selesai'
              ? 'Selesai'
              : item.status === 'dalam_tindakan'
              ? 'Sedang Dalam Tindakan'
              : 'Menunggu Tanggapan',
          tanggapanPetugas: item.tanggapan_petugas || undefined,
          dilaporkanPada: new Date(item.dilaporkan_pada).toLocaleDateString('id-ID'),
          diselesaikanPada: item.diselesaikan_pada ? new Date(item.diselesaikan_pada).toLocaleDateString('id-ID') : undefined,
        }));
      }
    } catch (err) {
      console.warn('[Supabase] Failed to fetch reports, using memory store:', err);
    }
  }

  return inMemoryReports;
}

export async function submitReport(report: Omit<CitizenReport, 'id'>): Promise<CitizenReport> {
  const newId = `rep-${Date.now().toString(36)}`;
  const fullReport: CitizenReport = {
    ...report,
    id: newId,
  };

  if (isServerSupabaseConfigured) {
    try {
      const serverClient = createServerClient();
      const { data, error } = await (serverClient as any)
        .from('laporan_warga')
        .insert({
          ticket_no: report.ticketNo,
          nama_warga: report.namaWarga,
          kontak_warga: report.kontakWarga,
          lingkungan_id: report.lingkunganId,
          klasifikasi: report.klasifikasi,
          isi_laporan: report.isiLaporan,
          foto_bukti_url: report.fotoBuktiUrl || null,
          status: report.status || 'menunggu_tanggapan',
        })
        .select()
        .single();

      if (!error && data) {
        fullReport.id = (data as any).id;
      }
    } catch (err) {
      console.warn('[Supabase] Failed to insert report, saving in memory:', err);
    }
  }

  inMemoryReports = [fullReport, ...inMemoryReports];
  return fullReport;
}

export async function updateReportStatus(
  id: string,
  newStatus: CitizenReport['status'],
  responseNote?: string
): Promise<CitizenReport | null> {
  let updatedReport: CitizenReport | null = null;

  if (isServerSupabaseConfigured) {
    try {
      const serverClient = createServerClient();
      const payload: any = {
        status: newStatus,
      };
      if (responseNote) payload.tanggapan_petugas = responseNote;
      if (newStatus === 'selesai') payload.diselesaikan_pada = new Date().toISOString();

      await (serverClient as any)
        .from('laporan_warga')
        .update(payload)
        .eq('id', id);
    } catch (err) {
      console.warn('[Supabase] Failed to update report status:', err);
    }
  }

  inMemoryReports = inMemoryReports.map((r) => {
    if (r.id === id || r.ticketNo === id) {
      updatedReport = {
        ...r,
        status: newStatus,
        statusLabel: newStatus === 'selesai' ? 'Selesai' : newStatus === 'dalam_tindakan' ? 'Sedang Dalam Tindakan' : 'Menunggu Tanggapan',
        tanggapanPetugas: responseNote || r.tanggapanPetugas,
        diselesaikanPada: newStatus === 'selesai' ? new Date().toLocaleString('id-ID') : r.diselesaikanPada,
      };
      return updatedReport;
    }
    return r;
  });

  return updatedReport;
}

// ==========================================
// 3. MONOGRAFI REKAP & PENGESAHAN (DYNAMIC STORE & ANNUAL SUMMARIES)
// ==========================================

export interface AnnualMonografiSummary {
  tahun: number;
  totalJiwa: number;
  totalKK: number;
  lakiLaki: number;
  perempuan: number;
  luasTotalHa: number;
  hakPilih?: number;
  keagamaan: {
    katolik: number;
    protestan: number;
    islam: number;
  };
  kelompokUsia: {
    balita: number;
    usiaSekolah: number;
    produktif: number;
    lansia: number;
  };
  tataGunaLahan: {
    pemukimanHa: number;
    pertanianHa: number;
    tanahKeringHa?: number;
    pekaranganHa?: number;
    fasumHa?: number;
    totalHa: number;
  };
  jagaList: {
    id: string;
    nama: string;
    kk: number;
    lakiLaki: number;
    perempuan: number;
    populasi: number;
    pala: string;
  }[];
  statusTahapan: 'disahkan_lurah' | 'diverifikasi_seklur' | 'draft';
  lastUpdated: string;
}

let inMemorySummaries: Record<number, AnnualMonografiSummary> = {
  2024: {
    tahun: 2024,
    totalJiwa: 1484,
    totalKK: 540,
    lakiLaki: 725,
    perempuan: 759,
    luasTotalHa: 48.05,
    keagamaan: {
      katolik: 931,
      protestan: 504,
      islam: 49,
    },
    kelompokUsia: {
      balita: 109,
      usiaSekolah: 222,
      produktif: 876,
      lansia: 277,
    },
    tataGunaLahan: {
      pemukimanHa: 34.50,
      pertanianHa: 9.50,
      pekaranganHa: 4.05,
      totalHa: 48.05,
    },
    jagaList: [
      { id: 'jaga-1', nama: 'Lingkungan I (Jaga 1)', kk: 105, lakiLaki: 150, perempuan: 160, populasi: 310, pala: 'Jilly Turambi' },
      { id: 'jaga-2', nama: 'Lingkungan II (Jaga 2)', kk: 108, lakiLaki: 140, perempuan: 145, populasi: 285, pala: 'Robert Goni' },
      { id: 'jaga-3', nama: 'Lingkungan III (Jaga 3)', kk: 112, lakiLaki: 145, perempuan: 150, populasi: 295, pala: 'Meidy Supit' },
      { id: 'jaga-4', nama: 'Lingkungan IV (Jaga 4)', kk: 107, lakiLaki: 148, perempuan: 156, populasi: 304, pala: 'Frits Pangalila' },
      { id: 'jaga-5', nama: 'Lingkungan V (Jaga 5)', kk: 108, lakiLaki: 142, perempuan: 148, populasi: 290, pala: 'Steven Wowor' },
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '15 Maret 2024 - Pengesahan Buku Induk Faktual',
  },
  2025: {
    tahun: 2025,
    totalJiwa: 1512,
    totalKK: 550,
    lakiLaki: 730,
    perempuan: 782,
    luasTotalHa: 208.25,
    hakPilih: 1245,
    keagamaan: {
      katolik: 948,
      protestan: 512,
      islam: 52,
    },
    kelompokUsia: {
      balita: 121,
      usiaSekolah: 247,
      produktif: 864,
      lansia: 280,
    },
    tataGunaLahan: {
      pemukimanHa: 34.50,
      pertanianHa: 9.50,
      tanahKeringHa: 185.75,
      pekaranganHa: 4.00,
      fasumHa: 12.50,
      totalHa: 208.25,
    },
    jagaList: [
      { id: 'jaga-1', nama: 'Lingkungan I (Jaga 1)', kk: 107, lakiLaki: 153, perempuan: 162, populasi: 315, pala: 'Jilly Turambi' },
      { id: 'jaga-2', nama: 'Lingkungan II (Jaga 2)', kk: 110, lakiLaki: 141, perempuan: 151, populasi: 292, pala: 'Robert Goni' },
      { id: 'jaga-3', nama: 'Lingkungan III (Jaga 3)', kk: 114, lakiLaki: 145, perempuan: 156, populasi: 301, pala: 'Meidy Supit' },
      { id: 'jaga-4', nama: 'Lingkungan IV (Jaga 4)', kk: 109, lakiLaki: 149, perempuan: 159, populasi: 308, pala: 'Frits Pangalila' },
      { id: 'jaga-5', nama: 'Lingkungan V (Jaga 5)', kk: 110, lakiLaki: 142, perempuan: 154, populasi: 296, pala: 'Steven Wowor' },
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '10 Februari 2025 - Pemutakhiran Semester Faktual',
  },
};

export async function fetchMonografiItems(): Promise<MonografiItem[]> {
  if (isServerSupabaseConfigured) {
    try {
      const serverClient = createServerClient();
      const { data, error } = await (serverClient as any)
        .from('monografi_rekap')
        .select('*')
        .order('tahun', { ascending: false });

      if (!error && data && data.length > 0) {
        const seenIds = new Set<string>();
        const dbItems: MonografiItem[] = [];
        for (const row of data) {
          const rincian = row.rincian_data || {};
          const itemId = rincian.id || row.id;
          if (itemId && !seenIds.has(itemId)) {
            seenIds.add(itemId);
            dbItems.push({
              ...rincian,
              id: itemId,
              year: row.tahun || rincian.year,
              statusTahapan: row.status_tahapan || rincian.statusTahapan,
              lastUpdated: row.updated_at
                ? `${new Date(row.updated_at).toLocaleDateString('id-ID')} - Database Supabase`
                : rincian.lastUpdated,
            });
          }
        }

        inMemoryMonografi = dbItems;
        const availableYears = Array.from(new Set(dbItems.map((it) => it.year)));
        availableYears.forEach((yr) => syncSummaryFromItems(yr));
        return dbItems;
      }
    } catch (err) {
      console.warn('[Supabase] Gagal mengambil monografi dari database, menggunakan data memori:', err);
    }
  }

  return inMemoryMonografi;
}

export async function fetchAnnualSummaries(): Promise<Record<number, AnnualMonografiSummary>> {
  return inMemorySummaries;
}

export async function fetchAvailableYears(): Promise<number[]> {
  const years = Object.keys(inMemorySummaries).map(Number).sort((a, b) => a - b);
  return years;
}

function syncSummaryFromItems(year: number) {
  const summary = inMemorySummaries[year];
  if (!summary) return;

  const yearItems = inMemoryMonografi.filter((m) => m.year === year);
  
  // Update Jaga List if individual jaga items exist
  const jagaItems = yearItems.filter((m) => m.categoryKey === 'wilayah' && m.id.includes('lingk-'));
  if (jagaItems.length > 0) {
    summary.jagaList = summary.jagaList.map((j) => {
      const match = jagaItems.find((ji) => ji.title.toLowerCase().includes(j.nama.toLowerCase().replace('lingkungan ', '').slice(0, 4)) || ji.id.endsWith(j.id.replace('jaga-', '')));
      if (match) {
        return {
          ...j,
          kk: match.metrics?.kepalaKeluarga || j.kk,
          lakiLaki: match.metrics?.pria || j.lakiLaki,
          perempuan: match.metrics?.wanita || j.perempuan,
          populasi: match.metrics?.totalWarga || j.populasi,
          pala: match.palaName || j.pala,
        };
      }
      return j;
    });

    // Recalculate totals from jaga
    const totalJiwaFromJaga = summary.jagaList.reduce((acc, curr) => acc + curr.populasi, 0);
    const totalPriaFromJaga = summary.jagaList.reduce((acc, curr) => acc + curr.lakiLaki, 0);
    const totalWanitaFromJaga = summary.jagaList.reduce((acc, curr) => acc + curr.perempuan, 0);
    const totalKKFromJaga = summary.jagaList.reduce((acc, curr) => acc + curr.kk, 0);

    if (totalJiwaFromJaga > 0) {
      summary.totalJiwa = totalJiwaFromJaga;
      summary.lakiLaki = totalPriaFromJaga;
      summary.perempuan = totalWanitaFromJaga;
      summary.totalKK = totalKKFromJaga;
    }
  }

  // Check general kependudukan item
  const generalKependudukan = yearItems.find((m) => m.id.startsWith('kependudukan-'));
  if (generalKependudukan && generalKependudukan.metrics?.totalWarga) {
    summary.totalJiwa = generalKependudukan.metrics.totalWarga;
    if (generalKependudukan.metrics.kepalaKeluarga) summary.totalKK = generalKependudukan.metrics.kepalaKeluarga;
    if (generalKependudukan.metrics.pria) summary.lakiLaki = generalKependudukan.metrics.pria;
    if (generalKependudukan.metrics.wanita) summary.perempuan = generalKependudukan.metrics.wanita;
  }
}

export async function updateMonografiTahapan(
  id: string,
  newTahapan: MonografiItem['statusTahapan'],
  officialName: string
): Promise<MonografiItem | null> {
  let updatedItem: MonografiItem | null = null;

  inMemoryMonografi = inMemoryMonografi.map((m) => {
    if (m.id === id) {
      updatedItem = {
        ...m,
        statusTahapan: newTahapan,
        badgeLabel:
          newTahapan === 'disahkan_lurah'
            ? 'Disahkan Lurah (Publikasi Sah)'
            : newTahapan === 'diverifikasi_seklur'
            ? 'Diverifikasi Seklur'
            : 'Draf Masukan (Menunggu Verifikasi)',
        lastUpdated: `${new Date().toLocaleDateString('id-ID')} - ${officialName}`,
      };
      return updatedItem;
    }
    return m;
  });

  if (updatedItem) {
    const yr = (updatedItem as MonografiItem).year;
    if (inMemorySummaries[yr]) {
      inMemorySummaries[yr].statusTahapan = newTahapan;
      inMemorySummaries[yr].lastUpdated = `${new Date().toLocaleDateString('id-ID')} - Disahkan ${officialName}`;
    }

    if (isServerSupabaseConfigured) {
      try {
        const serverClient = createServerClient();
        await (serverClient as any)
          .from('monografi_rekap')
          .update({
            rincian_data: updatedItem,
            status_tahapan: newTahapan,
            updated_at: new Date().toISOString(),
          })
          .filter('rincian_data->>id', 'eq', id);
      } catch (err) {
        console.warn('[Supabase] Gagal menyimpan update tahapan monografi ke DB:', err);
      }
    }
  }

  return updatedItem;
}

export async function updateMonografiContent(
  id: string,
  updatedData: Partial<MonografiItem>
): Promise<MonografiItem | null> {
  let updatedItem: MonografiItem | null = null;

  inMemoryMonografi = inMemoryMonografi.map((m) => {
    if (m.id === id) {
      updatedItem = {
        ...m,
        ...updatedData,
        id: m.id,
        statusTahapan: updatedData.statusTahapan || 'draft',
        badgeLabel:
          updatedData.statusTahapan === 'disahkan_lurah'
            ? 'Disahkan Lurah (Publikasi Sah)'
            : updatedData.statusTahapan === 'diverifikasi_seklur'
            ? 'Diverifikasi Seklur'
            : 'Draf Masukan (Menunggu Verifikasi)',
        lastUpdated: `${new Date().toLocaleDateString('id-ID')} - Pembaruan Operator`,
      };
      return updatedItem;
    }
    return m;
  });

  if (updatedItem) {
    syncSummaryFromItems((updatedItem as MonografiItem).year);

    if (isServerSupabaseConfigured) {
      try {
        const serverClient = createServerClient();
        await (serverClient as any)
          .from('monografi_rekap')
          .update({
            rincian_data: updatedItem,
            status_tahapan: (updatedItem as MonografiItem).statusTahapan,
            updated_at: new Date().toISOString(),
          })
          .filter('rincian_data->>id', 'eq', id);
      } catch (err) {
        console.warn('[Supabase] Gagal menyimpan konten monografi ke DB:', err);
      }
    }
  }

  return updatedItem;
}

export async function updateAnnualSummary(
  year: number,
  patch: Partial<AnnualMonografiSummary>
): Promise<AnnualMonografiSummary | null> {
  if (!inMemorySummaries[year]) {
    return null;
  }

  inMemorySummaries[year] = {
    ...inMemorySummaries[year],
    ...patch,
    tahun: year,
    lastUpdated: `${new Date().toLocaleDateString('id-ID')} - Pembaruan CMS`,
  };

  return inMemorySummaries[year];
}

export async function createNewYearMonografi(
  newYear: number,
  sourceYear = 2025
): Promise<{ newYear: number; items: MonografiItem[]; summary: AnnualMonografiSummary }> {
  // Check if year already exists
  if (!inMemorySummaries[newYear]) {
    const baseSummary = inMemorySummaries[sourceYear] || inMemorySummaries[2025];
    inMemorySummaries[newYear] = {
      ...JSON.parse(JSON.stringify(baseSummary)),
      tahun: newYear,
      statusTahapan: 'draft',
      lastUpdated: `${new Date().toLocaleDateString('id-ID')} - Inisialisasi Periode Baru`,
    };
  }

  // Clone items from source year with new IDs
  const sourceItems = inMemoryMonografi.filter((m) => m.year === sourceYear);
  const clonedItems: MonografiItem[] = sourceItems.map((item) => ({
    ...JSON.parse(JSON.stringify(item)),
    id: `${item.id.replace(new RegExp(`-${sourceYear}$`), '')}-${newYear}`,
    year: newYear,
    title: item.title.includes(String(sourceYear))
      ? item.title.replace(String(sourceYear), String(newYear))
      : `${item.title} (${newYear})`,
    statusTahapan: 'draft',
    badgeLabel: 'Draf Masukan (Menunggu Verifikasi)',
    lastUpdated: `${new Date().toLocaleDateString('id-ID')} - Salinan Draf Awal`,
  }));

  // Append cloned items
  inMemoryMonografi = [
    ...inMemoryMonografi.filter((m) => m.year !== newYear),
    ...clonedItems,
  ];

  if (isServerSupabaseConfigured) {
    try {
      const serverClient = createServerClient();
      await (serverClient as any).from('periode_tahun').upsert({ tahun: newYear, status_terkunci: false });
      const insertRows = clonedItems.map((item) => ({
        tahun: newYear,
        kategori: item.categoryKey || 'kependudukan',
        rincian_data: item,
        status_tahapan: 'draft',
      }));
      await (serverClient as any).from('monografi_rekap').insert(insertRows);
    } catch (e) {
      console.warn('[Supabase] Gagal menyimpan periode baru ke DB:', e);
    }
  }

  return {
    newYear,
    items: clonedItems,
    summary: inMemorySummaries[newYear],
  };
}

export async function deleteYearMonografi(year: number): Promise<boolean> {
  if (year === 2024 || year === 2025) {
    throw new Error('Tahun arsip baku 2024 dan 2025 adalah data pokok yang dilindungi dan tidak dapat dihapus.');
  }

  delete inMemorySummaries[year];
  inMemoryMonografi = inMemoryMonografi.filter((m) => m.year !== year);

  if (isServerSupabaseConfigured) {
    try {
      const serverClient = createServerClient();
      await (serverClient as any).from('monografi_rekap').delete().eq('tahun', year);
      await (serverClient as any).from('periode_tahun').delete().eq('tahun', year);
    } catch (e) {
      console.warn('[Supabase] Gagal menghapus periode dari DB:', e);
    }
  }

  return true;
}

// ==========================================
// 4. APARATUR KELURAHAN AUTH & SECURITY (LURAH & SEKRETARIS)
// ==========================================

export interface AparaturUser {
  id: string;
  name: string;
  nip: string;
  roleCode: 'superadmin' | 'admin_seklur';
  roleTitle: string;
  phone: string;
  avatarText: string;
  jabatan: string;
}

export const INITIAL_APARATUR_ACCOUNTS = [
  {
    id: 'lurah-1',
    name: 'Theresia J. Kaunang, SE',
    nip: '19731206 200312 2 007',
    roleCode: 'superadmin' as const,
    roleTitle: 'Lurah (Superadmin)',
    jabatan: 'Lurah Kolongan Satu',
    phone: '0812-4455-8891',
    avatarText: 'TK',
    validIdentifiers: [
      '19731206 200312 2 007',
      '197312062003122007',
      'lurah',
      'lurah.kolongansatu',
      'theresia.kaunang',
      'theresia',
      'kaunang',
    ],
    validPasswords: [
      'lurah123',
      'LurahKKT2026!',
      'kolongansatu',
      '19731206',
    ],
  },
  {
    id: 'seklur-1',
    name: 'Febronia L. Pijoh, S.Kom',
    nip: '19780203 200902 2 002',
    roleCode: 'admin_seklur' as const,
    roleTitle: 'Sekretaris Kelurahan (Admin Utama)',
    jabatan: 'Sekretaris Kelurahan',
    phone: '0813-5566-7788',
    avatarText: 'FP',
    validIdentifiers: [
      '19780203 200902 2 002',
      '197802032009022002',
      '19780203 200501 1 012',
      '197802032005011012',
      'seklur',
      'sekretaris',
      'seklur.kolongansatu',
      'febronia.pijoh',
      'febronia',
      'pijoh',
    ],
    validPasswords: [
      'seklur123',
      'SeklurKKT2026!',
      'kolongansatu',
      '19780203',
      'adminseklur',
    ],
  },
];

export async function authenticateAparatur(
  identifier: string,
  passwordInput: string,
  clientIp?: string
): Promise<{ success: boolean; message: string; user?: AparaturUser }> {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPwd = passwordInput.trim();

  // Try checking in Supabase database first if configured
  if (isServerSupabaseConfigured) {
    try {
      const serverClient = createServerClient();
      const { data: dbUsers, error } = await (serverClient as any)
        .from('aparatur_users')
        .select('*');

      if (!error && dbUsers && dbUsers.length > 0) {
        const found = dbUsers.find(
          (u: any) =>
            (u.nip && u.nip.toLowerCase().replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')) ||
            (u.username && u.username.toLowerCase() === cleanId) ||
            (u.email && u.email.toLowerCase() === cleanId)
        );

        if (found) {
          // Check role: only Lurah and Seklur allowed
          if (found.role_code !== 'superadmin' && found.role_code !== 'admin_seklur') {
            return {
              success: false,
              message: 'Akses Ditolak: Hanya Aparatur Kelurahan (Lurah & Sekretaris Kelurahan) yang memiliki hak akses portal.',
            };
          }

          if (found.password === cleanPwd || found.password_hash === cleanPwd) {
            // Update last login
            await (serverClient as any)
              .from('aparatur_users')
              .update({ last_login_at: new Date().toISOString() })
              .eq('id', found.id);

            // Audit log
            await (serverClient as any)
              .from('audit_logs')
              .insert({
                aksi: 'LOGIN_PORTAL_SUCCESS',
                skema_tabel: 'aparatur_users',
                rekaman_perubahan: { nip: found.nip, nama: found.nama_lengkap, role: found.role_code, ip: clientIp },
              });

            return {
              success: true,
              message: `Login berhasil. Selamat datang, ${found.nama_lengkap}!`,
              user: {
                id: found.id,
                name: found.nama_lengkap,
                nip: found.nip,
                roleCode: found.role_code,
                roleTitle: found.role_code === 'superadmin' ? 'Lurah (Superadmin)' : 'Sekretaris Kelurahan (Admin Utama)',
                jabatan: found.jabatan || (found.role_code === 'superadmin' ? 'Lurah Kolongan Satu' : 'Sekretaris Kelurahan'),
                phone: found.nomor_wa || '0813-5566-7788',
                avatarText: found.nama_lengkap.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
              },
            };
          } else {
            return {
              success: false,
              message: 'Kata Sandi atau PIN Keamanan salah. Silakan periksa kembali.',
            };
          }
        }
      }
    } catch (e) {
      console.warn('[Supabase] Auth database query error, fallback to secure seed:', e);
    }
  }

  // Fallback to verified aparatur accounts
  const matchedAccount = INITIAL_APARATUR_ACCOUNTS.find((acc) =>
    acc.validIdentifiers.some(
      (id) =>
        id.toLowerCase() === cleanId ||
        id.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')
    )
  );

  if (!matchedAccount) {
    return {
      success: false,
      message:
        'Akses Ditolak: Hak akses portal dibatasi khusus untuk Aparatur Kelurahan (Lurah & Sekretaris Kelurahan). Identitas tidak terdaftar.',
    };
  }

  const isPasswordValid = matchedAccount.validPasswords.includes(cleanPwd);
  if (!isPasswordValid) {
    return {
      success: false,
      message: 'Kata Sandi atau PIN Keamanan salah. Silakan periksa kembali.',
    };
  }

  // Log in Supabase audit_logs if available
  if (isServerSupabaseConfigured) {
    try {
      const serverClient = createServerClient();
      await (serverClient as any).from('audit_logs').insert({
        aksi: 'LOGIN_PORTAL_SUCCESS',
        skema_tabel: 'aparatur_users',
        rekaman_perubahan: {
          nip: matchedAccount.nip,
          nama: matchedAccount.name,
          role: matchedAccount.roleCode,
          ip: clientIp,
        },
      });
    } catch (e) {
      // ignore
    }
  }

  return {
    success: true,
    message: `Login berhasil. Selamat datang, ${matchedAccount.name}!`,
    user: {
      id: matchedAccount.id,
      name: matchedAccount.name,
      nip: matchedAccount.nip,
      roleCode: matchedAccount.roleCode,
      roleTitle: matchedAccount.roleTitle,
      jabatan: matchedAccount.jabatan,
      phone: matchedAccount.phone,
      avatarText: matchedAccount.avatarText,
    },
  };
}

// ==========================================
// 6. LANDING PAGE CONTENT MANAGEMENT (FASILITAS, APARATUR, SANITASI, KEGIATAN, KONTAK)
// ==========================================

export async function fetchLandingContent(): Promise<LandingContentPayload> {
  if (isServerSupabaseConfigured) {
    try {
      const serverClient = createServerClient();
      const { data, error } = await (serverClient as any)
        .from('monografi_rekap')
        .select('*')
        .eq('kategori', 'landing_content')
        .limit(1)
        .maybeSingle();

      if (!error && data && data.rincian_data) {
        const remote = data.rincian_data as Partial<LandingContentPayload>;
        inMemoryLandingContent = {
          fasilitas: remote.fasilitas && Array.isArray(remote.fasilitas) ? remote.fasilitas : inMemoryLandingContent.fasilitas,
          sanitasi: remote.sanitasi ? { ...inMemoryLandingContent.sanitasi, ...remote.sanitasi } : inMemoryLandingContent.sanitasi,
          aparatur: remote.aparatur ? { ...inMemoryLandingContent.aparatur, ...remote.aparatur } : inMemoryLandingContent.aparatur,
          kegiatan: remote.kegiatan && Array.isArray(remote.kegiatan) ? remote.kegiatan : inMemoryLandingContent.kegiatan,
          kontak: remote.kontak ? { ...inMemoryLandingContent.kontak, ...remote.kontak } : inMemoryLandingContent.kontak,
        };
      }
    } catch (err) {
      console.warn('[Supabase] Failed to fetch landing content from DB, using memory:', err);
    }
  }

  return inMemoryLandingContent;
}

export async function updateLandingContentSection<K extends keyof LandingContentPayload>(
  section: K,
  sectionData: LandingContentPayload[K]
): Promise<LandingContentPayload> {
  if (isServerSupabaseConfigured) {
    try {
      const serverClient = createServerClient();
      const { data: existing } = await (serverClient as any)
        .from('monografi_rekap')
        .select('*')
        .eq('kategori', 'landing_content')
        .limit(1)
        .maybeSingle();

      if (existing && existing.rincian_data) {
        const remote = existing.rincian_data as Partial<LandingContentPayload>;
        inMemoryLandingContent = {
          ...inMemoryLandingContent,
          ...remote,
        };
      }

      inMemoryLandingContent[section] = sectionData;

      if (existing && existing.id) {
        await (serverClient as any)
          .from('monografi_rekap')
          .update({
            rincian_data: inMemoryLandingContent,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await (serverClient as any)
          .from('monografi_rekap')
          .insert({
            tahun: 2025,
            kategori: 'landing_content',
            status_tahapan: 'disahkan_lurah',
            rincian_data: inMemoryLandingContent,
          });
      }
    } catch (err) {
      console.warn('[Supabase] Failed to persist landing content section:', err);
      inMemoryLandingContent[section] = sectionData;
    }
  } else {
    inMemoryLandingContent[section] = sectionData;
  }

  return inMemoryLandingContent;
}

