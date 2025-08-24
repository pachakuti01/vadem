import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Next 15 => searchParams est asynchrone
type SP = Promise<{ code?: string; token_hash?: string; type?: string }>;

export default async function AuthCallback({
  searchParams,
}: { searchParams: SP }) {
  const sp = await searchParams;
  const supabase = createClient();

  if (sp.code) {
    await supabase.auth.exchangeCodeForSession(sp.code);
  } else if (sp.token_hash && sp.type) {
    await supabase.auth.verifyOtp({
      token_hash: sp.token_hash,
      // types possibles: 'signup' | 'magiclink' | 'recovery' | 'invite' | 'email_change'
      type: sp.type as any,
    });
  }

  redirect("/"); // retour à la home (change si tu veux)
}
