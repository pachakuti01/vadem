// src/components/SignInButtons.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "apple" | "facebook" | "azure";
type Variant = "full" | "compact";

interface SignInButtonsProps {
  variant?: Variant;
}

export default function SignInButtons({ variant = "full" }: SignInButtonsProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState<Provider | null>(null);

  async function signIn(provider: Provider) {
    try {
      setLoading(provider);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Connexion indisponible pour le moment";
      alert(message);
      setLoading(null);
    }
  }

  const isFull   = variant === "full";
  const iconSize = isFull ? 24 : 20;  // taille visuelle des logos
  const iconCol  = isFull ? 56 : 48;  // largeur FIXE de la colonne icône → aligne “Continuer”
  const padX     = isFull ? 24 : 16;
  const gap      = isFull ? 12 : 10;

  const buttonClass =
    (isFull ? "h-14 text-lg" : "h-10 text-sm") +
    " w-full rounded-xl border hover:bg-gray-50 disabled:opacity-60";

  const providers: Array<{ key: Provider; label: string; icon: string }> = [
    { key: "google",   label: "Continuer avec Google",    icon: "/brands/logo_google.svg" },
    { key: "apple",    label: "Continuer avec Apple",     icon: "/brands/logo_apple.svg" },
    { key: "facebook", label: "Continuer avec Facebook",  icon: "/brands/logo_facebook.svg" },
    { key: "azure",    label: "Continuer avec Microsoft", icon: "/brands/logo_microsoft.svg" },
  ];

  return (
    <div className={isFull ? "grid gap-4" : "grid w-full max-w-xs gap-2"}>
      {providers.map((p) => (
        <button
          key={p.key}
          type="button"
          className={buttonClass}
          onClick={() => signIn(p.key)}
          disabled={loading !== null}
          aria-busy={loading === p.key}
          style={{
            display: "grid",
            gridTemplateColumns: `${iconCol}px 1fr`, // icône FIXE + texte FLEX → même x pour “Continuer”
            alignItems: "center",
            columnGap: gap,
            paddingLeft: padX,
            paddingRight: padX,
            // pas de justifyContent: center → on garde le texte aligné à gauche
          }}
        >
          {/* Colonne icône (centrée dans sa cellule) */}
          <span style={{ display: "grid", placeItems: "center" }}>
            <Image src={p.icon} alt="" width={iconSize} height={iconSize} />
          </span>

          {/* Colonne texte (alignée à gauche) → “Continuer” sur la même verticale */}
          <span className="font-medium leading-none" style={{ textAlign: "left" }}>
            {loading === p.key ? "Connexion..." : p.label}
          </span>
        </button>
      ))}
    </div>
  );
}
