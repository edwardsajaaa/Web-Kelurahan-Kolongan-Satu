import { NextRequest, NextResponse } from 'next/server';
import { fetchReports, submitReport, updateReportStatus } from '@/lib/supabase/service';

export async function GET() {
  try {
    const reports = await fetchReports();
    return NextResponse.json({ success: true, data: reports });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memuat laporan warga' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.namaWarga || !body.kontakWarga || !body.isiLaporan) {
      return NextResponse.json(
        { success: false, error: 'Nama Warga, Kontak, dan Isi Laporan wajib diisi.' },
        { status: 400 }
      );
    }

    const newReport = await submitReport({
      ticketNo: body.ticketNo || `LAPOR-KKT-${Math.floor(1000 + Math.random() * 9000)}`,
      namaWarga: body.namaWarga,
      kontakWarga: body.kontakWarga,
      lingkunganId: Number(body.lingkunganId) || 1,
      lingkunganName: body.lingkunganName || `Lingkungan ${body.lingkunganId || 1}`,
      klasifikasi: body.klasifikasi || 'Air Bersih',
      isiLaporan: body.isiLaporan,
      fotoBuktiUrl: body.fotoBuktiUrl,
      status: 'menunggu_tanggapan',
      statusLabel: 'Menunggu Tanggapan',
      dilaporkanPada: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });

    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengirim laporan warga' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, tanggapanPetugas } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID Laporan dan status wajib diberikan.' },
        { status: 400 }
      );
    }

    const updated = await updateReportStatus(id, status, tanggapanPetugas);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Laporan tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memperbarui status laporan' },
      { status: 500 }
    );
  }
}
