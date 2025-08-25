import SignInButtons from "@/components/auth/SignInButtons";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="font-sans">
      {/* HERO */}
      <section className="px-6 py-16 sm:py-24 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Vadem — de la prise de notes à la <span className="bg-yellow-200 px-2 rounded">compréhension</span>
          </h1>
          <p className="mt-5 text-lg text-black/70">
            Capture tes idées, laisse Vadem les structurer et génère des <b>fiches de révision</b> en un clic.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            {user ? (
              <a href="/dashboard" className="inline-flex items-center rounded-xl bg-black text-white h-11 px-5 font-semibold">
                Accéder à l’app
              </a>
            ) : (
              <>
                <SignInButtons />
                <p className="text-sm text-black/50">ou, <a href="/login" className="underline">utiliser ton e-mail</a></p>
              </>
            )}
            <p className="text-xs text-black/40">Respect de la vie privée • Export à tout moment • Stockage au Canada</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-10 bg-gradient-to-b from-white to-gray-50 border-t">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            ["✍️ Prise de notes fluide", "Markdown, images, PDF, copier-coller."],
            ["🧠 Synthèse Feynman", "Reformulation simple + zones d’ombre détectées."],
            ["🗂️ Fiches auto", "Points clés, définitions, formules, exemples."],
            ["🃏 Flashcards & QCM", "Générées depuis tes notes, prêtes à réviser."],
            ["⏰ Répétition espacée", "Rappels intelligents pour mémoriser sur la durée."],
            ["⬇️ Export", "PDF, Markdown, Anki. Tes données restent à toi."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-xl border bg-white p-5">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-black/60 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center">Comment ça marche</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ["
