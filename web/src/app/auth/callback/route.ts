import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type EmailOtpType = "signup" | "magiclink" | "recovery" | "invite" | "email_change";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  const supabase = createClient();

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    } else if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({ token_hash, type });
      if (error) throw error;
    } else {
      // aucun param connu -> retourne vers /login avec message
      return NextResponse.redirect(new URL("/login?error=missing_params", req.url));
    }

    return NextResponse.redirect(new URL("/", req.url));
  } catch (err) {
    // on log minimalement (tu peux brancher Sentry si besoin)
    console.error("[/auth/callback] ", err);
    return NextResponse.redirect(new URL("/login?error=auth_failed", req.url));
  }
}
