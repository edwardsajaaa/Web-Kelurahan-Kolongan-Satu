import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get('kkt_portal_auth');
  const roleCookie = request.cookies.get('kkt_user_role');
  const nameCookie = request.cookies.get('kkt_user_name');
  const nipCookie = request.cookies.get('kkt_user_nip');
  const emailCookie = request.cookies.get('kkt_user_email');
  const userIdCookie = request.cookies.get('kkt_session_user_id');
  const sessionCreatedAtCookie = request.cookies.get('kkt_session_created_at');
  const sessionLastActiveCookie = request.cookies.get('kkt_session_last_active');

  const now = Date.now();
  const MAX_SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 jam batas maksimal sesi
  const MAX_IDLE_TIMEOUT = 15 * 60 * 1000; // 15 menit batas tidak aktif

  let isExpired = false;
  let expireReason = '';

  if (sessionCreatedAtCookie) {
    const createdAt = parseInt(sessionCreatedAtCookie.value, 10);
    if (!isNaN(createdAt) && now - createdAt > MAX_SESSION_DURATION) {
      isExpired = true;
      expireReason = 'Waktu sesi maksimal (2 jam) telah berakhir.';
    }
  }

  if (sessionLastActiveCookie && !isExpired) {
    const lastActive = parseInt(sessionLastActiveCookie.value, 10);
    if (!isNaN(lastActive) && now - lastActive > MAX_IDLE_TIMEOUT) {
      isExpired = true;
      expireReason = 'Sesi berakhir karena tidak ada aktivitas selama 15 menit.';
    }
  }

  const isValid =
    !isExpired &&
    authCookie &&
    (authCookie.value === 'lurah_authenticated' ||
      authCookie.value === 'seklur_authenticated' ||
      authCookie.value === 'aparatur_authenticated');

  if (isValid) {
    const isLurah =
      authCookie.value === 'lurah_authenticated' || roleCookie?.value === 'superadmin';

    const defaultName = isLurah ? 'Theresia J. Kaunang, SE' : 'Febronia L. Pijoh, S.Kom';
    const defaultNip = isLurah ? '19731206 200312 2 007' : '19780203 200902 2 002';
    const defaultEmail = isLurah
      ? 'lurah@kolongansatu.tomohon.go.id'
      : 'seklur@kolongansatu.tomohon.go.id';

    const userName = nameCookie?.value ? decodeURIComponent(nameCookie.value) : defaultName;
    const userNip = nipCookie?.value ? decodeURIComponent(nipCookie.value) : defaultNip;
    const userEmail = emailCookie?.value ? decodeURIComponent(emailCookie.value) : defaultEmail;
    const roleCode = isLurah ? 'superadmin' : 'admin_seklur';
    const roleTitle = isLurah ? 'Lurah (Superadmin)' : 'Sekretaris Kelurahan (Admin Utama)';
    const jabatan = isLurah ? 'Lurah Kolongan Satu' : 'Sekretaris Kelurahan';

    const response = NextResponse.json({
      authenticated: true,
      user: {
        id: userIdCookie?.value || (isLurah ? 'lurah-theresia' : 'seklur-febronia'),
        name: userName,
        nip: userNip,
        email: userEmail,
        roleCode,
        roleTitle,
        jabatan,
        phone: isLurah ? '0813-5622-8807' : '0812-9537-0427',
        avatarText: userName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
      },
    });

    // Refresh timestamp keaktifan sesi (heartbeat)
    response.cookies.set('kkt_session_last_active', String(now), {
      path: '/',
      maxAge: 7200,
      sameSite: 'lax',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  }

  // Jika tidak valid atau sudah kedaluwarsa, bersihkan seluruh cookie sesi
  const response = NextResponse.json({
    authenticated: false,
    user: null,
    reason: expireReason || 'Perangkat belum terautentikasi.',
  });

  const cookiesToClear = [
    'kkt_portal_auth',
    'kkt_session_user_id',
    'kkt_session_token',
    'kkt_session_created_at',
    'kkt_session_last_active',
    'kkt_user_role',
    'kkt_user_name',
    'kkt_user_nip',
    'kkt_user_email',
  ];

  cookiesToClear.forEach((name) => {
    response.cookies.set(name, '', {
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
    });
  });

  return response;
}
