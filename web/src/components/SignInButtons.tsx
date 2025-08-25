"use client";

import { createClient } from "@/lib/supabase/client";

export default function SignInButtons() {
  const supabase = createClient();

  async function signIn(provider: "google") {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) alert(error.message);
  }

  return (
    <div style={{ display:"grid", gap: 8, maxWidth: 360 }}>
      <button onClick={() => signIn("google")}>Continuer avec Google</button>
      {/* bonus : autres connecteurs étudiants */}
    </div>
  );
}
