// src/app/auth/callback/route.ts (version complète)
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type EmailOtpType = "signup" | "magiclink" | "recovery" | "invite" | "email_change";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  const supabase = createClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  } else if (token_hash && type) {
    await supabase.auth.verifyOtp({ token_hash, type });
  }

  return NextResponse.redirect(new URL("/", req.url));
}
