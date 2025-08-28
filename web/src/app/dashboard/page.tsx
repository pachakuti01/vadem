'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


type Folder = { id: string; name: string };

const FREE_QUOTA = 3; // quota plan gratuit (MVP)
const LS_KEY_FOLDERS = 'vadem.folders';
const LS_KEY_USED = 'vadem.usedNotes';

export default function DashboardPage() {
  const router = useRouter();

  // ---- Refs sûres (pas d'erreur TS)
  const searchRef = useRef<HTMLInputElement | null>(null);
  const pdfRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLInputElement | null>(null);

  // ---- Plan & compteur (MVP -> localStorage ; ensuite brancher backend)
  const [used, setUsed] = useState<number>(() => {
    const v = Number(localStorage.getItem(LS_KEY_USED));
    return Number.isFinite(v) && v >= 0 ? v : 0;
  });
  useEffect(() => localStorage.setItem(LS_KEY_USED, String(used)), [used]);

  // ---- Dossiers (MVP -> localStorage)
  const [folders, setFolders] = useState<Folder[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY_FOLDERS) || '[]') as Folder[];
    } catch {
      return [];
    }
  });
  useEffect(() => localStorage.setItem(LS_KEY_FOLDERS, JSON.stringify(folders)), [folders]);

  const addFolder = () => {
    const name = prompt('Nom du dossier :')?.trim();
    if (!name) return;
    const id = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
    setFolders((f) => [...f, { id, name }]);
  };
  const renameFolder = (id: string) => {
    const cur = folders.find((x) => x.id === id);
    if (!cur) return;
    const name = prompt('Nouveau nom :', cur.name)?.trim();
    if (!name) return;
    setFolders((f) => f.map((x) => (x.id === id ? { ...x, name } : x)));
  };
  const deleteFolder = (id: string) => {
    if (!confirm('Supprimer ce dossier ?')) return;
    setFolders((f) => f.filter((x) => x.id !== id));
  };

  // ---- Upload helpers
  const openPicker = (ref: React.MutableRefObject<HTMLInputElement | null> | React.RefObject<HTMLInputElement>) =>
    ref.current?.click();

  const onPdfChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    console.log('PDF:', file.name);
    setUsed((u) => Math.min(FREE_QUOTA, u + 1));
  };
  const onAudioChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    console.log('Audio:', file.name);
    setUsed((u) => Math.min(FREE_QUOTA, u + 1));
  };
  const onVideoChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    console.log('Video:', file.name);
    setUsed((u) => Math.min(FREE_QUOTA, u + 1));
  };

// Calcul en haut
const usagePct = useMemo(
  () => Math.round((Math.min(used, FREE_QUOTA) / FREE_QUOTA) * 100),
  [used]
);

// Usage
<PlanCard used={used} quota={FREE_QUOTA} pct={usagePct} onUpgrade={() => router.push('/pricing')} />

  return (
    <div className="min-h-screen">
      {/* --- Topbar minimal --- */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
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

          {/* Compteur plan + Upgrade */}
          <div className="hidden sm:flex items-center gap-3">
            <PlanBadge used={used} quota={FREE_QUOTA} />
            <button
              onClick={() => router.push('/pricing')}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Mettre à niveau
            </button>
          </div>

          <button
            onClick={() => alert('Créer une note (à brancher)')}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:hidden"
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

      {/* --- Layout avec sidebar dossiers --- */}
      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-[260px,1fr] gap-6">
        {/* Sidebar */}
        <aside className="md:sticky md:top-[64px] md:self-start">
          <nav>
            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Vues rapides</div>
            <ul className="space-y-1">
              <li><button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100">📌 Épinglées</button></li>
              <li><button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100">🕒 Récentes</button></li>
            </ul>
          </nav>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-slate-500 uppercase">Dossiers</div>
              <button onClick={addFolder} className="text-indigo-600 hover:underline text-sm">+ Nouveau</button>
            </div>
            {folders.length === 0 ? (
              <div className="text-slate-500 text-sm px-3 py-2">Aucun dossier</div>
            ) : (
              <ul className="space-y-1">
                {folders.map((f) => (
                  <li key={f.id} className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100">
                    <button className="text-left truncate flex-1">📁 {f.name}</button>
                    <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-2 text-slate-500">
                      <button onClick={() => renameFolder(f.id)} title="Renommer">✏️</button>
                      <button onClick={() => deleteFolder(f.id)} title="Supprimer">🗑️</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Plan / Mettre à niveau */}
<div className="mt-6">
  <PlanCard
    used={used}
    quota={FREE_QUOTA}
    pct={usagePct}                      // on passe le pourcentage ici
    onUpgrade={() => router.push('/pricing')}
  />
</div>


          {/* Plan meter visible en mobile aussi */}
          <div className="mt-6">
           <PlanCard
  used={used}
  quota={FREE_QUOTA}
  pct={usagePct}
  onUpgrade={() => router.push('/pricing')}
/>

          </div>
        </aside>

        {/* Contenu principal */}
        <main>
          <div className="hidden sm:flex justify-end mb-4">
            <button
              onClick={() => alert('Créer une note (à brancher)')}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Nouvelle note
            </button>
          </div>

          <section>
            <h2 className="text-lg font-semibold mb-3">Nouvelle note</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              <CardButton title="Enregistrer l’audio" subtitle="Parler, transcrire, résumer" icon="🎤"
                          onClick={() => openPicker(audioRef)} />
              <input ref={audioRef} type="file" accept="audio/*" className="hidden" onChange={onAudioChange} />

              <CardButton title="Téléverser une vidéo" subtitle="MP4, WEBM, MOV" icon="🎬"
                          onClick={() => openPicker(videoRef)} />
              <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={onVideoChange} />

              <CardButton title="Téléverser un PDF" subtitle="Extraction + résumé" icon="📄"
                          onClick={() => openPicker(pdfRef)} />
              <input ref={pdfRef} type="file" accept="application/pdf" className="hidden" onChange={onPdfChange} />

              <CardButton title="Lien Web" subtitle="Résumé page web" icon="🔗"
                          onClick={() => { const url = prompt('URL à importer :'); if (url) console.log('URL:', url); }} />

              <CardButton title="Vidéo YouTube" subtitle="Saisir l’URL YouTube" icon="▶️"
                          onClick={() => { const url = prompt('URL YouTube :'); if (url) console.log('YouTube:', url); }} />

              <CardButton title="Note vierge" subtitle="Commencer au clavier" icon="✏️"
                          onClick={() => alert('Créer une note vide (à brancher)')} />
            </div>
          </section>

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
    </div>
  );
}

/* ----------------- UI atoms ----------------- */

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
          {subtitle ? <div className="text-sm text-slate-500">{subtitle}</div> : null}
        </div>
      </div>
    </button>
  );
}

function PlanBadge({ used, quota }: { used: number; quota: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 text-white text-xs">★</span>
      <span>Gratuit&nbsp;•&nbsp;{Math.min(used, quota)} / {quota}</span>
    </span>
  );
}

function PlanCard({
  used,
  quota,
  pct,
  onUpgrade,
}: {
  used: number;
  quota: number;
  pct: number;              // ⬅️ nouveau
  onUpgrade: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="font-medium">Plan gratuit</div>
        <div className="text-sm text-slate-600">
          {Math.min(used, quota)} / {quota} notes
        </div>
      </div>

      {/* Progress bar accessible */}
      <div
        className="mt-2 h-2 w-full rounded-full bg-slate-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Utilisation du quota"
      >
        <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${pct}%` }} />
      </div>

      <button
        onClick={onUpgrade}
        className="mt-3 w-full rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-indigo-700 hover:bg-indigo-100"
      >
        Mettre à niveau
      </button>
    </div>
  );
}

