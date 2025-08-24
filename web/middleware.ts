import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  // rattrape tous les liens Supabase
  if (url.searchParams.has("code") || url.searchParams.has("token_hash")) {
    url.pathname = "/auth/callback";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"], // où intercepter
};
