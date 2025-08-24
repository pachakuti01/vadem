// web/src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  if (url.searchParams.has("code") || url.searchParams.has("token_hash")) {
    url.pathname = "/auth/callback";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// matcher large: toutes les routes (hors _next, assets, favicon)
export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};
