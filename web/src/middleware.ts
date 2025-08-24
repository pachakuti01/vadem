import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Ne surtout pas intercepter la route de callback elle-même
  if (url.pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  // Si un lien Supabase arrive ailleurs, on le route vers /auth/callback
  if (url.searchParams.has("code") || url.searchParams.has("token_hash")) {
    url.pathname = "/auth/callback";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Matcher large, mais on laissera /auth/callback passer grâce au guard ci-dessus
export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};
