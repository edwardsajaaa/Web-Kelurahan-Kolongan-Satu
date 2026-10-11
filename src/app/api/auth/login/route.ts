import { NextRequest, NextResponse } from 'next/server';
import { authenticateAparatur } from '@/lib/supabase/service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'NIP/ID Pengguna dan Kata Sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Verify through Supabase service with database + secure aparatur store
    const authResult = await authenticateAparatur(identifier, password, clientIp);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.message,
        },
        { status: 401 }
      );
    }

    const user = authResult.user;
    const authCookieValue =
      user.roleCode === 'superadmin' ? 'lurah_authenticated' : 'seklur_authenticated';

    const response = NextResponse.json({
      success: true,
      message: authResult.message,
      user,
    });

    // Set secure authentication cookies (7 days duration)
    const cookieAge = 60 * 60 * 24 * 7;

    response.cookies.set('kkt_portal_auth', authCookieValue, {
      path: '/',
      maxAge: cookieAge,
      sameSite: 'lax',
      httpOnly: false,
    });

    response.cookies.set('kkt_user_role', user.roleCode, {
      path: '/',
      maxAge: cookieAge,
      sameSite: 'lax',
      httpOnly: false,
    });

    response.cookies.set('kkt_user_name', user.name, {
      path: '/',
      maxAge: cookieAge,
      sameSite: 'lax',
      httpOnly: false,
    });

    response.cookies.set('kkt_user_nip', user.nip, {
      path: '/',
      maxAge: cookieAge,
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Terjadi kesalahan server: ${error.message}` },
      { status: 500 }
    );
  }
}
