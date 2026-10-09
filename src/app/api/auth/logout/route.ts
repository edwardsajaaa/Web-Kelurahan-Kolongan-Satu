import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Sesi portal telah ditutup dengan aman.',
  });

  // Clear authentication cookies
  response.cookies.set('kkt_portal_auth', '', {
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });

  response.cookies.set('kkt_user_role', '', {
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });

  return response;
}
