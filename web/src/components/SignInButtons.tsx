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
      const message =
        e instanceof Error ? e.message : "Connexion indisponible pour le moment";
      alert(message);
      setLoading(null);
    }
  }

  const isFull = variant === "full";
  const buttonClass = isFull
    ? "relative h-14 w-full rounded-xl border hover:bg-gray-50 disabled:opacity-60 text-lg"
    : "relative h-10 w-full rounded-xl border hover:bg-gray-50 disabled:opacity-60 text-sm";

  const providers: Array<{ key: Provider; label: string; icon: string }> = [
    { key: "google", label: "Continuer avec Google", icon: "/brands/logo_google.svg" },
    { key: "apple", label: "Continuer avec Apple", icon: "/brands/logo_apple.svg" },
    { key: "facebook", label: "Continuer avec Facebook", icon: "/brands/logo_facebook.svg" },
    { key: "azure", label: "Continuer avec Microsoft", icon: "/brands/logo_microsoft.svg" },
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: isFull ? "24px" : "16px",
            paddingRight: isFull ? "24px" : "16px",
          }}
        >
          {/* Contenu centré avec flex */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Image
              src={p.icon}
              alt=""
              width={24}
              height={24}
              className="shrink-0"
              priority={false}
            />
            <span
              className="font-medium leading-none"
              style={{
                minWidth: "200px", // Largeur fixe pour aligner les mots "Continuer"
                textAlign: "left",
              }}
            >
              {loading === p.key ? "Connexion..." : p.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
