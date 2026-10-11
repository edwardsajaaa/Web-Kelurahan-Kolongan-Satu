import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Security Gate: Protect all /portal routes except /portal/login
  const authCookie = request.cookies.get("kkt_portal_auth");
  const isValidAparatur =
    authCookie &&
    (authCookie.value === "lurah_authenticated" ||
      authCookie.value === "seklur_authenticated" ||
      authCookie.value === "aparatur_authenticated");

  if (pathname.startsWith("/portal") && pathname !== "/portal/login") {
    if (!isValidAparatur) {
      const loginUrl = new URL("/portal/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is already authenticated as aparatur and visits /portal/login, redirect to /portal
  if (pathname === "/portal/login") {
    if (isValidAparatur) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

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
