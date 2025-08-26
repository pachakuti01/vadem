import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        {/* Bandeau principal */}
        <div className="flex flex-col items-start gap-6 py-10 md:flex-row md:items-center md:justify-between">
          {/* Logo visible (icône + nom) */}
          <div className="flex items-center">
            <Image
              src="/logo-vadem-full.svg"
              alt="Vadem"
              width={160}
              height={40}
              priority
            />
          </div>

          {/* Tagline FR */}
          <p className="text-center text-sm text-gray-600 md:text-left">
            La meilleure app IA pour la prise de notes
          </p>

          {/* Contact */}
          <Link
            href="mailto:hello@vadem.app"
            className="inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm hover:bg-gray-50"
          >
            ✉️&nbsp; Contact
          </Link>
        </div>

        {/* Liens légaux */}
        <div className="flex flex-col items-start justify-between gap-4 border-t py-6 text-sm text-gray-600 md:flex-row">
          <p>Construit avec <span className="mx-1">❤️</span> par l’équipe Vadem</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-gray-900">
              Politique de confidentialité
            </Link>
            <Link href="/terms" className="hover:text-gray-900">
              Conditions d’utilisation
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t py-6 text-xs text-gray-500">
          © {new Date().getFullYear()} Vadem. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
