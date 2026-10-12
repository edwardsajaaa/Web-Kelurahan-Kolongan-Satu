import { NextRequest, NextResponse } from 'next/server';
import { resetAparaturPassword } from '@/lib/supabase/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, phoneVerification, newPassword } = body;

    if (!identifier || !phoneVerification || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'NIP/Email, nomor WhatsApp terdaftar, dan kata sandi baru wajib diisi.' },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const userAgent = request.headers.get('user-agent') || 'Browser Client';

    const result = await resetAparaturPassword(
      identifier,
      phoneVerification,
      newPassword,
      clientIp,
      userAgent
    );

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Terjadi kesalahan server saat pemulihan: ${error.message}` },
      { status: 500 }
    );
  }
}
