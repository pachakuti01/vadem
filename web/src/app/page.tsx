// src/app/page.tsx
import { createClient } from "@/lib/supabase/server";

// on force le rendu dynamique pour lire la session à chaque requête
export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Accueil</h1>
      {user ? (
        <p>Connecté : <b>{user.email}</b></p>
      ) : (
        <p>Non connecté — <a href="/login">se connecter</a></p>
      )}
    </main>
  );
}
