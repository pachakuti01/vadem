// web/src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  // Rattrape les liens Supabase qui arrivent sur /
  const code =
    typeof searchParams?.code === "string" ? searchParams.code : undefined;
  const token_hash =
    typeof searchParams?.token_hash === "string"
      ? searchParams.token_hash
      : undefined;
  const type =
    typeof searchParams?.type === "string" ? searchParams.type : undefined;

  if (code) {
    redirect(`/auth/callback?code=${encodeURIComponent(code)}`);
  }
  if (token_hash) {
    const qp = new URLSearchParams();
    qp.set("token_hash", token_hash);
    if (type) qp.set("type", type);
    redirect(`/auth/callback?${qp.toString()}`);
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Accueil</h1>
      <p>Non connecté — <a href="/login">se connecter</a></p>
    </main>
  );
}
