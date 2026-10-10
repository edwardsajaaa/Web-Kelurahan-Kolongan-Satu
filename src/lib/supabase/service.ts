import { supabase, isSupabaseConfigured } from './client';
import { createServerClient, isServerSupabaseConfigured } from './server';
import { LetterRequest, INITIAL_LETTERS } from '@/data/lettersData';
import { CitizenReport, INITIAL_REPORTS } from '@/data/reportsData';
import { MONOGRAFI_ITEMS, MonografiItem } from '@/data/monografiData';

// In-memory fallback stores for local/offline resilience
let inMemoryLetters: LetterRequest[] = [...INITIAL_LETTERS];
let inMemoryReports: CitizenReport[] = [...INITIAL_REPORTS];
let inMemoryMonografi: MonografiItem[] = [...MONOGRAFI_ITEMS];

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
                ? 'Diparaf Seklur Ferromel'
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
      if (newStatus === 'diparaf_seklur') updatePayload.diparaf_oleh = officialName || 'Ferromel L. Pua, S.Kom';
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
            ? 'Diparaf Seklur Ferromel'
            : newStatus === 'diverifikasi_staf'
            ? 'Diverifikasi Staf Karlin'
            : 'Ditolak',
        catatanPetugas: note || l.catatanPetugas,
        diparafOleh: newStatus === 'diparaf_seklur' ? officialName || 'Ferromel L. Pua, S.Kom (Seklur)' : l.diparafOleh,
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
              ? 'Diparaf Seklur Ferromel'
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
    totalKK: 1512,
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
      { id: 'jaga-1', nama: 'Lingkungan I (Jaga 1)', kk: 315, lakiLaki: 153, perempuan: 162, populasi: 315, pala: 'Jilly Turambi' },
      { id: 'jaga-2', nama: 'Lingkungan II (Jaga 2)', kk: 292, lakiLaki: 141, perempuan: 151, populasi: 292, pala: 'Robert Goni' },
      { id: 'jaga-3', nama: 'Lingkungan III (Jaga 3)', kk: 301, lakiLaki: 145, perempuan: 156, populasi: 301, pala: 'Meidy Supit' },
      { id: 'jaga-4', nama: 'Lingkungan IV (Jaga 4)', kk: 308, lakiLaki: 149, perempuan: 159, populasi: 308, pala: 'Frits Pangalila' },
      { id: 'jaga-5', nama: 'Lingkungan V (Jaga 5)', kk: 296, lakiLaki: 142, perempuan: 154, populasi: 296, pala: 'Steven Wowor' },
    ],
    statusTahapan: 'disahkan_lurah',
    lastUpdated: '10 Februari 2025 - Pemutakhiran Semester Faktual',
  },
};

export async function fetchMonografiItems(): Promise<MonografiItem[]> {
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
          kk: match.metrics.kepalaKeluarga || j.kk,
          lakiLaki: match.metrics.pria || j.lakiLaki,
          perempuan: match.metrics.wanita || j.perempuan,
          populasi: match.metrics.totalWarga || j.populasi,
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
  if (generalKependudukan && generalKependudukan.metrics.totalWarga) {
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
  return true;
}

