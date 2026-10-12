import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get('kkt_portal_auth');
  const roleCookie = request.cookies.get('kkt_user_role');
  const nameCookie = request.cookies.get('kkt_user_name');
  const nipCookie = request.cookies.get('kkt_user_nip');
  const emailCookie = request.cookies.get('kkt_user_email');
  const userIdCookie = request.cookies.get('kkt_session_user_id');

  const isValid =
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

    return NextResponse.json({
      authenticated: true,
      user: {
        id: userIdCookie?.value || (isLurah ? 'lurah-theresia' : 'seklur-febronia'),
        name: userName,
        nip: userNip,
        email: userEmail,
        roleCode,
        roleTitle,
        jabatan,
        phone: isLurah ? '0813-4011-2233' : '0895-2917-5850',
        avatarText: userName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
      },
    });
  }

  return NextResponse.json({
    authenticated: false,
    user: null,
  });
}
