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
// 3. MONOGRAFI REKAP & PENGESAHAN
// ==========================================

export async function fetchMonografiItems(): Promise<MonografiItem[]> {
  return inMemoryMonografi;
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
            : 'Draf Masukan',
        lastUpdated: `${new Date().toLocaleDateString('id-ID')} - ${officialName}`,
      };
      return updatedItem;
    }
    return m;
  });

  return updatedItem;
}
