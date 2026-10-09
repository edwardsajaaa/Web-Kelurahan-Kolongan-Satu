import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get('kkt_portal_auth');
  const roleCookie = request.cookies.get('kkt_user_role');

  if (authCookie && authCookie.value === 'seklur_authenticated') {
    return NextResponse.json({
      authenticated: true,
      user: {
        id: 'seklur-1',
        name: 'Ferromel L. Pua, S.Kom',
        roleCode: roleCookie?.value || 'admin_seklur',
        roleTitle: 'Sekretaris Kelurahan (Admin Utama)',
        nip: '19780203 200501 1 012',
        phone: '0813-5566-7788',
      },
    });
  }

  return NextResponse.json({
    authenticated: false,
    user: null,
  });
}
