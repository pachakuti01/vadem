// dans LoginForm.tsx (client)
import { useSearchParams } from "next/navigation";
const sp = useSearchParams();
const urlErr = sp.get("error");
// ...
{(err || urlErr) && (
  <div style={{ color:"#991b1b", background:"#fef2f2", border:"1px solid #fecaca",
                padding:10, borderRadius:8, marginBottom:12 }}>
    {err || "Échec de l’authentification. Réessaie."}
  </div>
)}


"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const supabase = createClient();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) setErr(error.message);
    else setSent(true);

    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 440, padding: 24, borderRadius: 12, border: "1px solid #e5e7eb" }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Se connecter</h1>
        <p style={{ color: "#6b7280", marginBottom: 16 }}>
          Entrez votre e-mail pour recevoir un lien magique de connexion.
        </p>

        {sent ? (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", color: "#14532d", padding: 12, borderRadius: 8 }}>
            📧 Lien envoyé. Consultez votre e-mail.
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <label htmlFor="email" style={{ display: "block", fontSize: 14, marginBottom: 6 }}>
              Adresse e-mail
            </label>
            <input
              id="email" type="email" required value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              placeholder="vous@exemple.com"
              style={{ width:"100%", padding:"12px 14px", borderRadius:8, border:"1px solid #e5e7eb", marginBottom:12 }}
            />
            {err && (
              <div style={{ color:"#991b1b", background:"#fef2f2", border:"1px solid #fecaca", padding:10, borderRadius:8, marginBottom:12 }}>
                {err}
              </div>
            )}
            <button
              type="submit" disabled={loading || !email}
              style={{ width:"100%", padding:"12px 14px", borderRadius:8, background: loading?"#9ca3af":"#111827", color:"white", fontWeight:600, cursor: loading?"not-allowed":"pointer" }}
            >
              {loading ? "Envoi en cours…" : "Recevoir un lien magique"}
            </button>
          </form>
        )}

        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12 }}>
          Vous recevrez un e-mail envoyé par Supabase.
        </p>
      </div>
    </main>
  );
}
