'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Folder = {
  id: string;
  name: string;
  parentId: string | null; // null = dossier racine
};

const FREE_QUOTA = 3; // quota plan gratuit (MVP)
const LS_KEY_FOLDERS = 'vadem.folders';
const LS_KEY_USED = 'vadem.usedNotes';
const LS_KEY_COLLAPSE = 'vadem.folders.collapse';

export default function DashboardPage() {
  const router = useRouter();

  // ---- Refs sûres
  const searchRef = useRef<HTMLInputElement | null>(null);
  const pdfRef   = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLInputElement | null>(null);

  // ---- Compteur (MVP -> localStorage)
  const [used, setUsed] = useState<number>(() => {
    const v = Number(localStorage.getItem(LS_KEY_USED));
    return Number.isFinite(v) && v >= 0 ? v : 0;
  });
  useEffect(() => localStorage.setItem(LS_KEY_USED, String(used)), [used]);

  // ---- Dossiers (flat) + état de repli
  const [folders, setFolders] = useState<Folder[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY_FOLDERS) || '[]') as Folder[]; }
    catch { return []; }
  });
  useEffect(() => localStorage.setItem(LS_KEY_FOLDERS, JSON.stringify(folders)), [folders]);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY_COLLAPSE) || '{}') as Record<string, boolean>; }
    catch { return {}; }
  });
  useEffect(() => localStorage.setItem(LS_KEY_COLLAPSE, JSON.stringify(collapsed)), [collapsed]);

  // ---- Helpers dossiers
  const byParent = useMemo(() => {
    const map = new Map<string | null, Folder[]>();
    for (const f of folders) {
      const k = f.parentId;
      const arr = map.get(k) ?? [];
      arr.push(f);
      map.set(k, arr);
    }
    // tri alpha par fratrie
    for (const [, arr] of map) arr.sort((a, b) => a.name.localeCompare(b.name));
    return map;
  }, [folders]);

  const addFolder = (name: string, parentId: string | null = null) => {
    const id = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
    setFolders((fs) => [...fs, { id, name, parentId }]);
    if (parentId) setCollapsed((c) => ({ ...c, [parentId]: false })); // déplier le parent à la création
  };

  const promptAddRoot = () => {
    const name = prompt('Nom du dossier :')?.trim();
    if (name) addFolder(name, null);
  };
  const promptAddChild = (parentId: string) => {
    const name = prompt('Nom du sous-dossier :')?.trim();
    if (name) addFolder(name, parentId);
  };

  const renameFolder = (id: string) => {
    const cur = folders.find((x) => x.id === id);
    if (!cur) return;
    const name = prompt('Nouveau nom :', cur.name)?.trim();
    if (!name) return;
    setFolders((fs) => fs.map((x) => (x.id === id ? { ...x, name } : x)));
  };

  const deleteFolder = (id: string) => {
    // supprime aussi les descendants
    if (!confirm('Supprimer ce dossier et son contenu ?')) return;
    const toDelete = new Set<string>();
    const visit = (target: string) => {
      toDelete.add(target);
      for (const f of folders) if (f.parentId === target) visit(f.id);
    };
    visit(id);
    setFolders((fs) => fs.filter((x) => !toDelete.has(x.id)));
  };

  const toggleCollapse = (id: string) =>
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  // ---- Garde-fou quota
  const requireQuota = () => {
    if (used >= FREE_QUOTA) {
      const go = confirm('Tu as atteint la limite du plan gratuit. Mettre à niveau ?');
      if (go) router.push('/pricing');
      return false;
    }
    return true;
  };

  // ---- Upload helpers
  const openPicker = (ref: React.MutableRefObject<HTMLInputElement | null> | React.RefObject<HTMLInputElement>) => {
    if (!requireQuota()) return;
    ref.current?.click();
  };

  const onPdfChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    if (!requireQuota()) return;
    console.log('PDF:', file.name);
    setUsed((u) => Math.min(FREE_QUOTA, u + 1));
  };
  const onAudioChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    if (!requireQuota()) return;
    console.log('Audio:', file.name);
    setUsed((u) => Math.min(FREE_QUOTA, u + 1));
  };
  const onVideoChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    if (!requireQuota()) return;
    console.log('Video:', file.name);
    setUsed((u) => Math.min(FREE_QUOTA, u + 1));
  };

  return (
    <div className="min-h-screen">
      {/* --- Topbar --- */}
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

          {/* Badge + Upgrade dans le header */}
          <div className="ml-auto hidden sm:flex items-center gap-3">
            <PlanBadge used={used} quota={FREE_QUOTA} />
            <button
              onClick={() => router.push('/pricing')}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Mettre à niveau
            </button>
          </div>

          <button
            onClick={() => alert('Menu utilisateur')}
            className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700"
            aria-label="Ouvrir le menu utilisateur"
          >
            LD
          </button>
        </div>
      </header>

      {/* Bandeau quota atteint */}
      {used >= FREE_QUOTA && (
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900 flex items-center justify-between">
            <span>Tu as atteint la limite du plan gratuit.</span>
            <button
              onClick={() => router.push('/pricing')}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-white hover:bg-amber-500"
            >
              Mettre à niveau
            </button>
          </div>
        </div>
      )}

      {/* ===== Créer une note ===== */}
      <section className="mx-auto max-w-7xl px-4 pt-4">
        <h2 className="mb-3 text-lg font-semibold">Créer une note</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
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
                      onClick={() => {
                        if (!requireQuota()) return;
                        const url = prompt('URL à importer :');
                        if (url) console.log('URL:', url);
                      }} />

          <CardButton title="Vidéo YouTube" subtitle="Saisir l’URL YouTube" icon="▶️"
                      onClick={() => {
                        if (!requireQuota()) return;
                        const url = prompt('URL YouTube :');
                        if (url) console.log('YouTube:', url);
                      }} />

          <CardButton title="Note vierge" subtitle="Commencer au clavier" icon="✏️"
                      onClick={() => (requireQuota() ? alert('Créer une note vide (à brancher)') : null)} />
        </div>
      </section>

      {/* ===== Grille principale : Dossiers à gauche / Mes notes à droite ===== */}
      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6">
        {/* Panneau Dossiers (plus de +Dossier perdu) */}
        <aside className="md:sticky md:top-[64px] md:self-start">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-500 uppercase">Dossiers</div>
            <button onClick={promptAddRoot} className="text-indigo-600 hover:underline text-sm">
              + Dossier
            </button>
          </div>

          <FolderTree
            byParent={byParent}
            collapsed={collapsed}
            onToggle={toggleCollapse}
            onAddChild={promptAddChild}
            onRename={renameFolder}
            onDelete={deleteFolder}
          />
        </aside>

        {/* Mes notes */}
        <main>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <FilterChip label="Toutes" active />
            <FilterChip label="Récents" />
            <FilterChip label="Épinglées" />
            <FilterChip label="Non classées" />
          </div>

          <section>
            <h3 className="text-base font-semibold mb-3">Mes notes</h3>
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

/* ----------------- UI atoms / Folder tree ----------------- */

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

function FilterChip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className={[
        "rounded-full border px-3 py-1 text-sm",
        active
          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
      ].join(" ")}
      onClick={() => console.log('filter:', label)}
    >
      {label}
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

/** Arbre récursif (à partir de la map par parent) */
function FolderTree({
  byParent,
  collapsed,
  onToggle,
  onAddChild,
  onRename,
  onDelete,
}: {
  byParent: Map<string | null, Folder[]>;
  collapsed: Record<string, boolean>;
  onToggle: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const roots = byParent.get(null) ?? [];
  if (roots.length === 0) {
    return <div className="text-slate-500 text-sm px-3 py-2">Aucun dossier</div>;
  }
  return (
    <ul className="space-y-1">
      {roots.map((r) => (
        <FolderNode
          key={r.id}
          node={r}
          depth={0}
          byParent={byParent}
          collapsed={collapsed}
          onToggle={onToggle}
          onAddChild={onAddChild}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

function FolderNode({
  node,
  depth,
  byParent,
  collapsed,
  onToggle,
  onAddChild,
  onRename,
  onDelete,
}: {
  node: Folder;
  depth: number;
  byParent: Map<string | null, Folder[]>;
  collapsed: Record<string, boolean>;
  onToggle: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const children = byParent.get(node.id) ?? [];
  const hasChildren = children.length > 0;
  const isCollapsed = !!collapsed[node.id];

  return (
    <li>
      <div
        className="group flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-slate-100"
        style={{ paddingLeft: 8 + depth * 14 }}
      >
        <div className="flex items-center gap-2 min-w-0">
          {hasChildren ? (
            <button
              onClick={() => onToggle(node.id)}
              className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-slate-200"
              aria-label={isCollapsed ? "Déplier" : "Replier"}
              title={isCollapsed ? "Déplier" : "Replier"}
            >
              {isCollapsed ? '▶' : '▼'}
            </button>
          ) : (
            <span className="inline-flex h-5 w-5 items-center justify-center opacity-40">•</span>
          )}
          <button className="truncate text-left">📁 {node.name}</button>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-2 text-slate-500">
          <button onClick={() => onAddChild(node.id)} title="Sous-dossier">➕</button>
          <button onClick={() => onRename(node.id)} title="Renommer">✏️</button>
          <button onClick={() => onDelete(node.id)} title="Supprimer">🗑️</button>
        </div>
      </div>

      {hasChildren && !isCollapsed && (
        <ul className="space-y-1">
          {children.map((c) => (
            <FolderNode
              key={c.id}
              node={c}
              depth={depth + 1}
              byParent={byParent}
              collapsed={collapsed}
              onToggle={onToggle}
              onAddChild={onAddChild}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  );
}



