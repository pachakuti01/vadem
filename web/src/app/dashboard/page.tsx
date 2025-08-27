'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  // Refs sûres
  const searchRef = useRef<HTMLInputElement | null>(null);
  const pdfRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLInputElement | null>(null);

  // Déclenche l’ouverture d’un input[type=file]
  const openPicker = (
    ref:
      | React.MutableRefObject<HTMLInputElement | null>
      | React.RefObject<HTMLInputElement>
  ) => {
    ref.current?.click();
  };

  // Handlers de téléversement (à brancher à ton API)
  const onPdfChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    // TODO: upload PDF
    console.log('PDF:', file.name);
  };

  const onAudioChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    // TODO: upload AUDIO
    console.log('Audio:', file.name);
  };

  const onVideoChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    // TODO: upload VIDEO (mp4/webm/mov)
    console.log('Video:', file.name);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Topbar minimaliste */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">★</span>
            <span>Vadem</span>
          </Link>

          <div className="ml-4 flex-1">
            <label className="sr-only" htmlFor="search">Rechercher</label>
            <div className="relative">
              <input
                id="search"
                ref={searchRef}
                type="search"
                placeholder="Rechercher une note…"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 pl-10 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">⌕</span>
            </div>
          </div>

          <button
            onClick={() => alert('Créer une note (à brancher)')}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Nouvelle note
          </button>

          <button
            onClick={() => alert('Menu utilisateur')}
            className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700"
            aria-label="Ouvrir le menu utilisateur"
          >
            LD
          </button>
        </div>
      </header>

      {/* Contenu */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Composer */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Nouvelle note</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Enregistrer audio */}
            <CardButton
              title="Enregistrer l’audio"
              subtitle="Parler, transcrire, résumer"
              onClick={() => alert('Lancement enregistrement (à brancher)')}
              icon="🎤"
            />

            {/* Téléverser vidéo */}
            <CardButton
              title="Téléverser une vidéo"
              subtitle="MP4, WEBM, MOV"
              onClick={() => openPicker(videoRef)}
              icon="🎬"
            />
            <input
              ref={videoRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={onVideoChange}
            />

            {/* Téléverser PDF */}
            <CardButton
              title="Téléverser un PDF"
              subtitle="Extraction + résumé"
              onClick={() => openPicker(pdfRef)}
              icon="📄"
            />
            <input
              ref={pdfRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={onPdfChange}
            />

            {/* Lien Web */}
            <CardButton
              title="Lien Web"
              subtitle="Résumé page web"
              onClick={() => {
                const url = prompt('URL à importer :');
                if (url) console.log('URL:', url);
              }}
              icon="🔗"
            />

            {/* YouTube */}
            <CardButton
              title="Vidéo YouTube"
              subtitle="Saisir l’URL YouTube"
              onClick={() => {
                const url = prompt('URL YouTube :');
                if (url) console.log('YouTube:', url);
              }}
              icon="▶️"
            />

            {/* Note vierge */}
            <CardButton
              title="Note vierge"
              subtitle="Commencer au clavier"
              onClick={() => alert('Créer une note vide (à brancher)')}
              icon="✏️"
            />
          </div>
        </section>

        {/* Liste / Empty state */}
        <section className="mt-10">
          <h3 className="text-base font-semibold mb-3">Récentes</h3>
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            <div className="mx-auto mb-2 text-3xl">📂</div>
            <p>Aucune note pour le moment.</p>
            <p className="text-sm">Importe un PDF/vidéo, colle un lien, ou crée une note vierge.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

/** Bouton/carte réutilisable */
function CardButton(props: { title: string; subtitle?: string; icon?: string; onClick?: () => void }) {
  const { title, subtitle, icon = '📎', onClick } = props;
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className="flex items-start gap-3">
        <div className="text-xl">{icon}</div>
        <div>
          <div className="font-medium">{title}</div>
          {subtitle ? (
            <div className="text-sm text-slate-500">{subtitle}</div>
          ) : null}
        </div>
      </div>
    </button>
  );
}
