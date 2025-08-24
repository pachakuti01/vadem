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

// Intercepte / et /login
export const config = {
  matcher: ["/", "/login"],
};

