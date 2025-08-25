import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { title: "Vadem", description: "Vadem app" };
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header style={{display:"flex",gap:16,alignItems:"center",padding:"12px 16px",borderBottom:"1px solid #e5e7eb"}}>
          <Link href="/">🏠 Accueil</Link>
          <Link href="/dashboard">📊 Dashboard</Link>
          <div style={{marginLeft:"auto",display:"flex",gap:12}}>
            {user ? (<><span style={{opacity:.7}}>{user.email}</span><LogoutButton/></>) : (<Link href="/login">Se connecter</Link>)}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

