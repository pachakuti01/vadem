// src/components/LogoutButton.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const onLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Rafraîchit l'App Router pour refléter la session supprimée
      router.refresh(); // (tu peux remplacer par router.push("/login") si tu veux rediriger)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Déconnexion impossible";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      aria-busy={loading}
      className="rounded-lg border px-3 py-1.5 disabled:opacity-60"
    >
      {loading ? "…" : "Se déconnecter"}
    </button>
  );
}
