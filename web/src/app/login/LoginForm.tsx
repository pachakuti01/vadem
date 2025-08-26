// src/app/login/LoginForm.tsx
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const sp = useSearchParams();
  const urlErr = sp.get("error"); // string | null

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const supabase = createClient();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) throw error;
      setSent(true);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Échec de l’authentification";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 440, padding: 24, borderRadius: 12, border: "1px solid #e5e7eb" }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Se connecter</h1>
        <p style={{ color: "#6b7280", marginBottom: 16 }}>
          Entrez votre e-mail pour recevoir un lien magique.
        </p>

        {sent ? (
          <div
            role="status"
            aria-live="polite"
            style={{ background: "#f0fdf4", border: "1px solid #86efac", color: "#14532d", padding: 12, borderRadius: 8 }}
          >
            📧 Lien envoyé. Consultez votre e-mail.
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="email" style={{ display: "block", fontSize: 14, marginBottom: 6 }}>
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={onEmailChange}
              placeholder="vous@exemple.com"
              autoComplete="email"
              inputMode="email"
              aria-invalid={Boolean(err || urlErr)}
              aria-describedby={err || urlErr ? "login-error" : undefined}
              autoFocus
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                marginBottom: 12
              }}
            />

            {(err || urlErr) && (
              <div
                id="login-error"
                role="alert"
                style={{
                  color: "#991b1b",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 12
                }}
              >
                {err || "Échec de l’authentification. Réessaie."}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              aria-busy={loading}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                background: loading ? "#9ca3af" : "#111827",
                color: "white",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Envoi en cours…" : "Recevoir un lien magique"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
