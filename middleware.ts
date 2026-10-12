import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // English pages: tell the root layout to write <html lang="en">
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const headers = new Headers(request.headers);
    headers.set("x-pm-locale", "en");
    return NextResponse.next({ request: { headers } });
  }
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Supabase not configured yet (NEXT_PUBLIC_SUPABASE_ANON_KEY missing) —
  // fail safe to the login page with a hint, instead of crashing.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (pathname === "/admin/login") return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("config", "missing");
    return NextResponse.redirect(url);
  }

  const { response, user } = await updateSession(request);
  const isLogin = pathname === "/admin/login";

  if (!user && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  if (user && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/en", "/en/:path*"],
};
