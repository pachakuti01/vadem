// components/FAQ.tsx
"use client";

import { useState } from "react";

type Item = {
  q: string;
  a: React.ReactNode;
};

const faqs: Item[] = [
  {
    q: "Qu’est‑ce que Vadem ?",
    a: (
      <>
        Vadem transforme vos PDF, vidéos YouTube et audios en résumés,
        explications façon Feynman, quiz, flashcards et mind maps—avec
        citations cliquables vers la source.
      </>
    ),
  },
  {
    q: "Comment Vadem fonctionne‑t‑il ?",
    a: (
      <>
        Vous uploadez un fichier ou un lien, nous transcrivons/évaluons le
        contenu côté serveur, puis nous générons des notes auditables avec un
        « Source Inspector ». Rien à installer.
      </>
    ),
  },
  {
    q: "Vadem est‑il gratuit ?",
    a: (
      <>
        Oui, un plan gratuit permet d’essayer une note complète (ou jusqu’à 20
        pages / 10 min audio). Les plans payants débloquent les sets complets et
        les exports.
      </>
    ),
  },
  {
    q: "Y a‑t‑il une app iOS/Android ?",
    a: (
      <>
        Vadem est une web‑app installable (PWA). Les apps iOS/Android arrivent
        via un wrapper natif—même compte, mêmes données.
      </>
    ),
  },
  {
    q: "Est‑ce légal dans mon établissement ?",
    a: (
      <>
        L’usage dépend de la politique de votre école/entreprise. Vadem respecte
        la confidentialité (Loi 25/RGPD) et fournit des citations pour
        attribuer correctement les sources.
      </>
    ),
  },
];

function Item({ item, index }: { item: Item; index: number }) {
  const [open, setOpen] = useState(false);
  const id = `faq-${index}`;
  return (
    <div className="border-b">
      <button
        className="flex w-full items-center justify-between py-6 text-left"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-lg font-medium">{item.q}</span>
        <svg
          className={`h-5 w-5 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={id}
        className={`grid overflow-hidden transition-all duration-200 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 pb-6 text-muted-foreground">{item.a}</div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 md:px-8">
      <h2 id="faq-heading" className="mb-10 text-4xl font-bold tracking-tight text-center">
        FAQ
      </h2>
      <div className="divide-y">
        {faqs.map((f, i) => (
          <Item key={i} item={f} index={i} />
        ))}
      </div>
    </section>
  );
}
