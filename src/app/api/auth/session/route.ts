import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_APARATUR_ACCOUNTS } from '@/lib/supabase/service';

export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get('kkt_portal_auth');
  const roleCookie = request.cookies.get('kkt_user_role');

  if (authCookie) {
    if (authCookie.value === 'lurah_authenticated' || roleCookie?.value === 'superadmin') {
      const lurahAcc = INITIAL_APARATUR_ACCOUNTS[0];
      return NextResponse.json({
        authenticated: true,
        user: {
          id: lurahAcc.id,
          name: lurahAcc.name,
          roleCode: lurahAcc.roleCode,
          roleTitle: lurahAcc.roleTitle,
          jabatan: lurahAcc.jabatan,
          nip: lurahAcc.nip,
          phone: lurahAcc.phone,
          avatarText: lurahAcc.avatarText,
        },
      });
    }

    if (authCookie.value === 'seklur_authenticated' || roleCookie?.value === 'admin_seklur') {
      const seklurAcc = INITIAL_APARATUR_ACCOUNTS[1];
      return NextResponse.json({
        authenticated: true,
        user: {
          id: seklurAcc.id,
          name: seklurAcc.name,
          roleCode: seklurAcc.roleCode,
          roleTitle: seklurAcc.roleTitle,
          jabatan: seklurAcc.jabatan,
          nip: seklurAcc.nip,
          phone: seklurAcc.phone,
          avatarText: seklurAcc.avatarText,
        },
      });
    }
  }

  return NextResponse.json({
    authenticated: false,
    user: null,
  });
}
