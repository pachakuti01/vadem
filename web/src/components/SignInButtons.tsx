"use client";

import { createClient } from "@/lib/supabase/client";

export default function SignInButtons() {
  const supabase = createClient();

  async function signInGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) alert(error.message);
  }

  return (
    <div className="grid gap-2 w-full max-w-xs">
      <button
        className="rounded-lg border px-4 py-2"
        onClick={signInGoogle}
      >
        Continuer avec Google
      </button>
    </div>
  );
}
