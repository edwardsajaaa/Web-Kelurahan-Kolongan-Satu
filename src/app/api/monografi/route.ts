import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  fetchMonografiItems,
  fetchAnnualSummaries,
  fetchAvailableYears,
  updateMonografiTahapan,
  updateMonografiContent,
  updateAnnualSummary,
  createNewYearMonografi,
  deleteYearMonografi,
} from '@/lib/supabase/service';

export async function GET(req: NextRequest) {
  try {
    const items = await fetchMonografiItems();
    const summaries = await fetchAnnualSummaries();
    const availableYears = await fetchAvailableYears();

    return NextResponse.json({
      success: true,
      data: items,
      summaries,
      availableYears,
    });
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
    const { id, year, ...updatedFields } = body;

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

    const summaries = await fetchAnnualSummaries();

    // Revalidate public consumer routes and portal
    try {
      revalidatePath('/');
      revalidatePath('/monografi');
      revalidatePath('/portal');
    } catch (e) {
      // Ignore during development or dynamic execution
    }

    return NextResponse.json({
      success: true,
      data: updated,
      summaries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memperbarui rincian data monografi' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, newYear, sourceYear } = body;

    if (action === 'create_year') {
      const yearToCreate = Number(newYear);
      if (!yearToCreate || yearToCreate < 2000 || yearToCreate > 2100) {
        return NextResponse.json(
          { success: false, error: 'Tahun baru tidak valid.' },
          { status: 400 }
        );
      }

      const created = await createNewYearMonografi(yearToCreate, sourceYear ? Number(sourceYear) : 2025);
      const items = await fetchMonografiItems();
      const summaries = await fetchAnnualSummaries();
      const availableYears = await fetchAvailableYears();

      try {
        revalidatePath('/');
        revalidatePath('/monografi');
        revalidatePath('/portal');
      } catch (e) {}

      return NextResponse.json({
        success: true,
        data: items,
        summaries,
        availableYears,
        created,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Aksi tidak didukung.' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memproses permintaan' },
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

    const summaries = await fetchAnnualSummaries();

    try {
      revalidatePath('/');
      revalidatePath('/monografi');
      revalidatePath('/portal');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      data: updated,
      summaries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengesahkan data monografi' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get('year');
    const year = Number(yearParam);

    if (!year || isNaN(year)) {
      return NextResponse.json(
        { success: false, error: 'Parameter tahun tidak valid.' },
        { status: 400 }
      );
    }

    await deleteYearMonografi(year);
    const items = await fetchMonografiItems();
    const summaries = await fetchAnnualSummaries();
    const availableYears = await fetchAvailableYears();

    try {
      revalidatePath('/');
      revalidatePath('/monografi');
      revalidatePath('/portal');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `Periode monografi tahun ${year} berhasil dihapus dari sistem.`,
      availableYears,
      data: items,
      summaries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menghapus periode monografi' },
      { status: 400 }
    );
  }
}
