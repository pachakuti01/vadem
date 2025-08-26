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

  const isFull     = variant === "full";
  const iconSize   = isFull ? 24 : 20;  // taille logo
  const iconCol    = isFull ? 56 : 48;  // colonne icône FIXE → aligne “Continuer”
  const gap        = isFull ? 12 : 10;
  const padX       = isFull ? 24 : 16;
  const buttonMaxW = isFull ? 560 : 420; // largeur max du bouton
  const contentW   = isFull ? 360 : 300; // largeur FIXE du groupe (icône+texte) → centre + aligne

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
          onClick={() => signIn(p.key)}
          disabled={loading !== null}
          aria-busy={loading === p.key}
          className={buttonClass}
          // 1) Le bouton est centré et a une largeur max homogène
          style={{
            maxWidth: buttonMaxW,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: padX,
            paddingRight: padX,
          }}
        >
          {/* 2) Wrapper centré de largeur FIXE + grid 2 colonnes */}
          <div
            style={{
              width: "100%",
              maxWidth: contentW,             // ← largeur commune → centrage identique
              display: "grid",
              gridTemplateColumns: `${iconCol}px auto`, // ← colonne icône FIXE
              columnGap: gap,
              alignItems: "center",
              justifyItems: "start",
            }}
          >
            <span style={{ display: "grid", placeItems: "center" }}>
              <Image src={p.icon} alt="" width={iconSize} height={iconSize} />
            </span>

            {/* 3) Texte à gauche → “Continuer” démarre au même x partout */}
            <span className="font-medium leading-none" style={{ textAlign: "left" }}>
              {loading === p.key ? "Connexion..." : p.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

