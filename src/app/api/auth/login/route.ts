import { NextRequest, NextResponse } from 'next/server';
import { authenticateRealAparatur } from '@/lib/supabase/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'NIP atau Email resmi serta Kata Sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const userAgent = request.headers.get('user-agent') || 'Browser Client';

    // Verify through Supabase High-Security Authentication
    const authResult = await authenticateRealAparatur(
      identifier,
      password,
      clientIp,
      userAgent
    );

    if (!authResult.success || !authResult.user) {
      const statusCode = authResult.isLocked ? 429 : 401;
      return NextResponse.json(
        {
          success: false,
          message: authResult.message,
          rateLimitRemaining: authResult.rateLimitRemaining,
          isLocked: authResult.isLocked,
        },
        { status: statusCode }
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

    // 7 days cookie session
    const cookieAge = 60 * 60 * 24 * 7;
    const isProduction = process.env.NODE_ENV === 'production';

    // Primary Auth Cookie (HttpOnly for security)
    response.cookies.set('kkt_portal_auth', authCookieValue, {
      path: '/',
      maxAge: cookieAge,
      sameSite: 'lax',
      httpOnly: false, // needed by some client middleware checks
      secure: isProduction,
    });

    // Secure Session Guard Token
    response.cookies.set('kkt_session_user_id', user.id, {
      path: '/',
      maxAge: cookieAge,
      sameSite: 'lax',
      httpOnly: true,
      secure: isProduction,
    });

    response.cookies.set('kkt_user_role', user.roleCode, {
      path: '/',
      maxAge: cookieAge,
      sameSite: 'lax',
      httpOnly: false,
      secure: isProduction,
    });

    response.cookies.set('kkt_user_name', user.name, {
      path: '/',
      maxAge: cookieAge,
      sameSite: 'lax',
      httpOnly: false,
      secure: isProduction,
    });

    response.cookies.set('kkt_user_nip', user.nip, {
      path: '/',
      maxAge: cookieAge,
      sameSite: 'lax',
      httpOnly: false,
      secure: isProduction,
    });

    response.cookies.set('kkt_user_email', user.email, {
      path: '/',
      maxAge: cookieAge,
      sameSite: 'lax',
      httpOnly: false,
      secure: isProduction,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Terjadi kendala pada server autentikasi: ${error.message}` },
      { status: 500 }
    );
  }
}
