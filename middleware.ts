import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "regiis_session";

/** Protège /admin/* (hors page de connexion). La vérification fine des rôles se fait côté page. */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;

  if (token && secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      return NextResponse.next();
    } catch {
      // jeton expiré ou invalide → on redirige vers la connexion
    }
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
  const res = NextResponse.redirect(url);
  if (token) res.cookies.delete(COOKIE);
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
