import { redirect } from "next/navigation";

// Force Next à traiter la home en dynamique (sinon la page peut rester statique)
export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function Home({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;

  const code = typeof sp.code === "string" ? sp.code : undefined;
  const token_hash = typeof sp.token_hash === "string" ? sp.token_hash : undefined;
  const type = typeof sp.type === "string" ? sp.type : undefined;

  if (code) redirect(`/auth/callback?code=${encodeURIComponent(code)}`);

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


