import { NextRequest, NextResponse } from 'next/server';
import { fetchLetters, submitLetter, updateLetterStatus } from '@/lib/supabase/service';

export async function GET() {
  try {
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

    if (!body.nikPemohon || !body.namaPemohon || !body.jenisSurat) {
      return NextResponse.json(
        { success: false, error: 'NIK, Nama Pemohon, dan Jenis Surat wajib diisi.' },
        { status: 400 }
      );
    }

    const newLetter = await submitLetter({
      noRegistrasi: body.noRegistrasi || `REG-KKT-${Date.now().toString().slice(-4)}`,
      nikPemohon: body.nikPemohon,
      namaPemohon: body.namaPemohon,
      nomorWaPemohon: body.nomorWaPemohon || '',
      jenisSurat: body.jenisSurat,
      lingkunganId: Number(body.lingkunganId) || 1,
      tujuanKeperluan: body.tujuanKeperluan || '',
      alamatLengkap: body.alamatLengkap || `Lingkungan ${body.lingkunganId || 1}, Kolongan Satu`,
      pekerjaan: body.pekerjaan || 'Warga',
      berkasLampiranUrl: body.berkasLampiranUrl,
      berkasName: body.berkasName || 'Lampiran_Dokumen.pdf',
      statusSurat: 'diajukan',
      statusLabel: 'Diajukan Warga',
      tanggalDiajukan: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });

    return NextResponse.json({ success: true, data: newLetter }, { status: 201 });
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
