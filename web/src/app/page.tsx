import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignInButtons from "@/components/SignInButtons";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const features: { title: string; desc: string }[] = [
    {
      title: "Fiches de révision automatiques",
      desc: "Synthèse des notions clés, définitions, formules et exemples pour mémoriser vite.",
    },
    {
      title: "Structuration intelligente",
      desc: "Outline, thèmes, et liens entre concepts pour une compréhension durable.",
    },
    {
      title: "Capture multi-sources",
      desc: "Texte, audio, PDF, pages web… Vadem nettoie, transcrit et organise.",
    },
    {
      title: "Recherche sémantique",
      desc: "Retrouve instantanément les passages pertinents dans toutes tes notes.",
    },
  ];

  const steps: { title: string; desc: string }[] = [
    { title: "1. Importer", desc: "Colle du texte, upload un audio/PDF, ou donne une URL." },
    { title: "2. Nettoyer & résumer", desc: "Transcription, nettoyage, structure, et résumé intelligent." },
    { title: "3. Réviser", desc: "Génère des fiches & quiz; programme tes révisions." },
    { title: "4. Partager/Exporter", desc: "Partage avec ta promo, exporte en PDF/Markdown." },
  ];

  return (
    <main className="px-6 pb-24">
      {/* HERO */}
      <section className="max-w-5xl mx-auto pt-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Vadem — Prends des notes qui te font vraiment{" "}
          <span className="underline underline-offset-4">apprendre</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Capture, organise et révise. Vadem transforme tes notes en{" "}
          <b>fiches de révision</b> prêtes à l’emploi.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg px-5 py-3 bg-black text-white"
            >
              Ouvrir l’app
            </Link>
          ) : (
            <>
              <div className="text-sm text-gray-500">Commence gratuitement — 5 notes incluses</div>
              <SignInButtons />
            </>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-center">Pourquoi Vadem ?</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border p-5">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-center">Comment ça marche</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.title} className="rounded-xl border p-5">
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

