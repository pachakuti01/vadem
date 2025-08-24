// src/app/auth/callback/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Types des OTP e-mail acceptés par Supabase
type EmailOtpType = "signup" | "magiclink" | "recovery" | "invite" | "email_change";

// Next 15 -> searchParams est asynchrone
type SP = Promise<{ code?: string; token_hash?: string; type?: EmailOtpType }>;

export default async function AuthCallback({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const supabase = createClient();

  if (sp.code) {
    await supabase.auth.exchangeCodeForSession(sp.code);
    redirect("/");
  }

  if (sp.token_hash && sp.type) {
    await supabase.auth.verifyOtp({ token_hash: sp.token_hash, type: sp.type });
    redirect("/");
  }

  // Aucun paramètre utile ? On retourne à l'accueil.
  redirect("/");
}
