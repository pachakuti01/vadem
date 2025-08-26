import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignInButtons from "@/components/SignInButtons";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 pt-24 pb-24 text-center">
        <Image src="/logo-vadem-appicon.svg" alt="Vadem" width={56} height={56} className="mx-auto mb-6" />
        <h1 className="text-5xl font-extrabold tracking-tight">
          Laissez l’IA vous aider à <span className="block">prendre des notes</span>
        </h1>

        <div className="mt-6 text-gray-600">
          <div className="text-xl">★★★★★</div>
          <div className="mt-1 text-sm">
            169 755+ <span className="text-gray-500">utilisateurs satisfaits</span>
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-xl">
          <SignInButtons variant="full" />
          <p className="mt-4 text-xs text-gray-500">
            En vous connectant, vous acceptez nos{" "}
            <a href="/terms" className="underline">Conditions d’utilisation</a> et notre{" "}
            <a href="/privacy" className="underline">Politique de confidentialité</a>.
          </p>
        </div>
      </div>
    </main>
  );
}


