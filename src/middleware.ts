import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Security Gate: Protect all /portal routes except /portal/login
  const authCookie = request.cookies.get("kkt_portal_auth");
  const sessionCreatedAt = request.cookies.get("kkt_session_created_at");
  const sessionLastActive = request.cookies.get("kkt_session_last_active");

  const now = Date.now();
  const MAX_SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 jam batas maksimal sesi
  const MAX_IDLE_TIMEOUT = 60 * 60 * 1000; // 1 jam batas tidak aktif

  let isExpired = false;
  if (sessionCreatedAt) {
    const createdAt = parseInt(sessionCreatedAt.value, 10);
    if (!isNaN(createdAt) && now - createdAt > MAX_SESSION_DURATION) {
      isExpired = true;
    }
  }
  if (sessionLastActive && !isExpired) {
    const lastActive = parseInt(sessionLastActive.value, 10);
    if (!isNaN(lastActive) && now - lastActive > MAX_IDLE_TIMEOUT) {
      isExpired = true;
    }
  }

  const isValidAparatur =
    !isExpired &&
    authCookie &&
    (authCookie.value === "lurah_authenticated" ||
      authCookie.value === "seklur_authenticated" ||
      authCookie.value === "aparatur_authenticated");

  // Proteksi rute portal - wajib login jika sesi habis atau belum login
  if (pathname.startsWith("/portal") && pathname !== "/portal/login") {
    if (!isValidAparatur) {
      const loginUrl = new URL("/portal/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      if (isExpired) {
        loginUrl.searchParams.set("expired", "idle");
      }
      const response = NextResponse.redirect(loginUrl);

      // Bersihkan sisa cookies yang telah kedaluwarsa
      const cookiesToClear = [
        "kkt_portal_auth",
        "kkt_session_user_id",
        "kkt_session_token",
        "kkt_session_created_at",
        "kkt_session_last_active",
        "kkt_user_role",
        "kkt_user_name",
        "kkt_user_nip",
        "kkt_user_email",
      ];
      cookiesToClear.forEach((name) => {
        response.cookies.delete(name);
      });

      return response;
    }
  }

  // CATATAN KEAMANAN: Halaman /portal/login TIDAK dialihkan otomatis ke /portal
  // agar setiap perangkat/aparatur dapat melakukan autentikasi ulang secara tegas.

  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
