import { NextRequest, NextResponse } from 'next/server';
import {
  fetchMonografiItems,
  updateMonografiTahapan,
  updateMonografiContent,
} from '@/lib/supabase/service';

export async function GET() {
  try {
    const items = await fetchMonografiItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memuat data monografi' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updatedFields } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID Monografi wajib diberikan.' },
        { status: 400 }
      );
    }

    const updated = await updateMonografiContent(id, updatedFields);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Modul monografi tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memperbarui rincian data monografi' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, statusTahapan, officialName } = body;

    if (!id || !statusTahapan) {
      return NextResponse.json(
        { success: false, error: 'ID Monografi dan statusTahapan wajib diberikan.' },
        { status: 400 }
      );
    }

    const updated = await updateMonografiTahapan(id, statusTahapan, officialName || 'Aparatur Kelurahan');

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Modul monografi tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengesahkan data monografi' },
      { status: 500 }
    );
  }
}
