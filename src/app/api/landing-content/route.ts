import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { fetchLandingContent, updateLandingContentSection } from '@/lib/supabase/service';
import { LandingContentPayload } from '@/data/landingContentData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await fetchLandingContent();
    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memuat konten landing page' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { section, data } = body as {
      section: keyof LandingContentPayload;
      data: any;
    };

    if (!section || !data) {
      return NextResponse.json(
        { success: false, error: 'Parameter section dan data wajib disertakan.' },
        { status: 400 }
      );
    }

    const updated = await updateLandingContentSection(section, data);

    try {
      revalidatePath('/');
      revalidatePath('/portal');
    } catch (e) {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: `Konten bagian ${section} berhasil diperbarui.`,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal menyimpan perubahan konten landing page' },
      { status: 500 }
    );
  }
}
