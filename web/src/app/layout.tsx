// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image"; // ⬅️ ajouté
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// --- Metadata (favicon + PWA) ---
export const metadata: Metadata = {
  title: {
    default: "Vadem",
    template: "%s • Vadem",
  },
  description: "Prends des notes qui te font vraiment apprendre.",
  applicationName: "Vadem",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
      // { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/android-chrome-192x192.png" }],
    other: [{ rel: "mask-icon", url: "/maskable-512.png" }],
  },
  openGraph: {
    title: "Vadem",
    description: "Prends des notes qui te font vraiment apprendre.",
    url: "https://vadem.vercel.app/",
    siteName: "Vadem",
    type: "website",
  },
};

// ✅ Next 15 veut themeColor dans `viewport` (pas dans `metadata`)
export const viewport: Viewport = {
  themeColor: "#000000",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // conforme à la PJ : on attend createClient()
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ── Header sobre  ───────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6 md:px-8">
            {/* Logo gauche */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-vadem-full.svg"
                alt="Vadem"
                width={120}
                height={28}
                priority
              />
            </Link>

            {/* Nav minimale */}
            <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
              <Link href="/" className="hover:text-gray-900">Accueil</Link>
              {user && <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>}
            </nav>

            {/* Actions droite */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="hidden text-sm text-gray-600 sm:inline">{user.email}</span>
                  <LogoutButton />
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Démarrer
                </Link>
              )}
            </div>
          </div>
        </header>
        {/* ───────────────────────────────────────────────────────────────────── */}

        {children}
      </body>
    </html>
  );
}
