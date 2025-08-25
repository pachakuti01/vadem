"use client";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const supabase = createClient();
  async function signOut() {
    await supabase.auth.signOut();
    location.href = "/"; // retour vers la home
  }
  return (
    <button
      onClick={signOut}
      style={{ padding:"6px 10px", border:"1px solid #e5e7eb", borderRadius:8 }}
    >
      Se déconnecter
    </button>
  );
}
