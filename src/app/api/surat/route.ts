import { NextRequest, NextResponse } from 'next/server';
import { fetchLetters, submitLetter, updateLetterStatus, findLetterByRegistration } from '@/lib/supabase/service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const query =
      searchParams.get('no_registrasi') ||
      searchParams.get('noRegistrasi') ||
      searchParams.get('q') ||
      searchParams.get('nik');

    if (query) {
      const letter = await findLetterByRegistration(query);
      if (!letter) {
        return NextResponse.json(
          { success: false, data: null, message: 'Nomor registrasi atau NIK tidak ditemukan.' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: letter });
    }

    const letters = await fetchLetters();
    return NextResponse.json({ success: true, data: letters });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memuat data surat' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const nik = body.nik_pemohon || body.nikPemohon;
    const nama = body.nama_pemohon || body.namaPemohon;
    const wa = body.nomor_wa_pemohon || body.nomorWaPemohon || '';
    const jenis = body.jenis_surat || body.jenisSurat;
    const lingkungan = Number(body.lingkungan_id || body.lingkunganId) || 1;
    const isi = body.isi_permohonan || {};

    if (!nik || !nama || !jenis) {
      return NextResponse.json(
        { success: false, error: 'NIK, Nama Pemohon, dan Jenis Surat wajib diisi.' },
        { status: 400 }
      );
    }

    const generatedReg =
      body.no_registrasi ||
      body.noRegistrasi ||
      `REG-K1-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLetter = await submitLetter({
      noRegistrasi: generatedReg,
      nikPemohon: nik,
      namaPemohon: nama,
      nomorWaPemohon: wa,
      jenisSurat: jenis,
      lingkunganId: lingkungan,
      tujuanKeperluan: body.tujuanKeperluan || isi.tujuanKeperluan || isi.keperluan || '',
      alamatLengkap:
        body.alamatLengkap ||
        isi.alamatLengkap ||
        `Lingkungan ${lingkungan}, Kelurahan Kolongan Satu`,
      pekerjaan: body.pekerjaan || isi.pekerjaan || 'Warga',
      berkasLampiranUrl: body.berkasLampiranUrl || body.berkas_lampiran_url,
      berkasName: body.berkasName || isi.berkasName || 'Lampiran_Dokumen.pdf',
      statusSurat: 'diajukan',
      statusLabel: 'Diajukan Warga',
      tanggalDiajukan: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });

    return NextResponse.json(
      {
        success: true,
        data: newLetter,
        no_registrasi: newLetter.noRegistrasi,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengajukan surat' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, statusSurat, catatanPetugas, officialName } = body;

    if (!id || !statusSurat) {
      return NextResponse.json(
        { success: false, error: 'ID Surat dan statusSurat wajib diberikan.' },
        { status: 400 }
      );
    }

    const updated = await updateLetterStatus(id, statusSurat, catatanPetugas, officialName);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Surat tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memperbarui status surat' },
      { status: 500 }
    );
  }
}
