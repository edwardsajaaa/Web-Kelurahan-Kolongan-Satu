import { NextRequest, NextResponse } from 'next/server';

// Sekretaris Kelurahan official credentials
const SEKLU_VALID_IDENTIFIERS = [
  '19780203 200501 1 012',
  '197802032005011012',
  'seklur',
  'sekretaris',
  'ferromel.pua',
  'ferromel',
  'seklur.kolongansatu',
];

// Valid passwords / security PINs for Sekretaris Kelurahan
const VALID_PASSWORDS = [
  'seklur123',
  'SeklurKKT2026!',
  'kolongansatu',
  '19780203',
  'adminseklur',
];

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

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check if the identifier belongs to Sekretaris Kelurahan
    const isSeklurIdentifier = SEKLU_VALID_IDENTIFIERS.some(
      (id) => id.toLowerCase() === cleanIdentifier || id.replace(/\s+/g, '') === cleanIdentifier.replace(/\s+/g, '')
    );

    if (!isSeklurIdentifier) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Akses Ditolak: Hak akses portal dibatasi khusus untuk Sekretaris Kelurahan (Ferromel L. Pua, S.Kom). Identitas pengguna tidak dikenali sebagai Sekretaris Kelurahan.',
        },
        { status: 403 }
      );
    }

    // Check password
    const isPasswordValid = VALID_PASSWORDS.includes(cleanPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Kata Sandi atau PIN Keamanan salah. Silakan periksa kembali.',
        },
        { status: 401 }
      );
    }

    // Valid Seklur login
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil. Selamat datang, Sekretaris Kelurahan!',
      user: {
        id: 'seklur-1',
        name: 'Ferromel L. Pua, S.Kom',
        roleCode: 'admin_seklur',
        roleTitle: 'Sekretaris Kelurahan (Admin Utama)',
        nip: '19780203 200501 1 012',
        phone: '0813-5566-7788',
      },
    });

    // Set secure auth cookies
    const cookieAge = 60 * 60 * 24 * 7; // 7 days
    response.cookies.set('kkt_portal_auth', 'seklur_authenticated', {
      path: '/',
      maxAge: cookieAge,
      sameSite: 'lax',
      httpOnly: false, // Accessible by client and middleware
    });

    response.cookies.set('kkt_user_role', 'admin_seklur', {
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
