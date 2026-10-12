import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Sesi portal telah ditutup dengan aman.',
  });

  const cookiesToClear = [
    'kkt_portal_auth',
    'kkt_session_user_id',
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
