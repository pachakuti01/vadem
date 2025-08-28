// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// --- Metadata (favicon + PWA) ---
export const metadata: Metadata = {
  title: { default: "Vadem", template: "%s • Vadem" },
  description: "Prends des notes qui te font vraiment apprendre.",
  applicationName: "Vadem",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
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

// ✅ Next 15 veut themeColor dans `viewport`
export const viewport: Viewport = { themeColor: "#000000" };

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Layout global volontairement SANS header/nav.
  // -> plus de « Accueil / Dashboard »
  // -> plus de double « Vadem » avec le header du Dashboard
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
