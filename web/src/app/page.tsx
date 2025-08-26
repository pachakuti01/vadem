import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient(); // createClient est async
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const features: { title: string; desc: string }[] = [
    { title: "Fiches de révision automatiques", desc: "Synthèse des notions clés, définitions, formules et exemples pour mémoriser vite." },
    { title: "Structuration intelligente", desc: "Outline, thèmes, et liens entre concepts pour une compréhension durable." },
    { title: "Capture multi-sources", desc: "Texte, audio, PDF, pages web… Vadem nettoie, transcrit et organise." },
    { title: "Recherche sémantique", desc: "Retrouve instantanément les passages pertinents dans toutes tes notes." },
  ];

  const steps: { title: string; desc: string }[] = [
    { title: "1. Importer", desc: "Colle du texte, upload un audio/PDF, ou donne une URL." },
    { title: "2. Nettoyer & résumer", desc: "Transcription, nettoyage, structure, et résumé intelligent." },
    { title: "3. Réviser", desc: "Génère des fiches & quiz; programme tes révisions." },
    { title: "4. Partager/Exporter", desc: "Partage avec ta promo, exporte en PDF/Markdown." },
  ];

  return (
    <>
      <main className="min-h-screen">
        {/* HERO */}
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-6 pt-28 pb-20 text-center">
            <Image
              src="/logo-vadem-mark.svg"
              alt="Vadem"
              width={72}
              height={72}
              className="mx-auto"
              priority
            />
            <h1 className="mt-6 text-5xl font-bold tracking-tight">Vadem</h1>
            <p className="mt-3 text-lg text-gray-600">
              Prends des notes qui te font vraiment <b>apprendre</b>
            </p>

            <div className="mt-10 flex flex-col items-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-3 text-white"
                >
                  Ouvrir l’app
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-lg border px-5 py-3 hover:bg-gray-50"
                  >
                    Démarrer
                  </Link>
                  <div className="text-sm text-gray-500">
                    Commence gratuitement — 5 notes incluses
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-5xl px-6 py-24">
            <h2 className="text-center text-2xl font-bold">Pourquoi Vadem ?</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div key={f.title} className="rounded-xl border bg-white p-5">
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-6 py-24">
            <h2 className="text-center text-2xl font-bold">Comment ça marche</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div key={s.title} className="rounded-xl border bg-slate-50 p-5">
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-slate-50">
          <FAQ />
        </section>
      </main>

      <Footer />
    </>
  );
}
