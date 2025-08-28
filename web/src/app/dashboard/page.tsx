'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ────────────────────────────────────────────────────────────────────────── */
/* Types & constantes                                                         */
/* ────────────────────────────────────────────────────────────────────────── */
type Folder = { id: string; name: string; parentId: string | null };
type Note = { id: string; title: string; excerpt?: string; kind?: 'pdf' | 'audio' | 'video' | 'text'; updatedAt: string };

const FREE_QUOTA = 3;
const LS_KEY_FOLDERS  = 'vadem.folders';
const LS_KEY_USED     = 'vadem.usedNotes';
const LS_KEY_COLLAPSE = 'vadem.folders.collapse';

/* ────────────────────────────────────────────────────────────────────────── */
/* Page                                                                        */
/* ────────────────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();

  // Refs upload/recherche
  const searchRef = useRef<HTMLInputElement | null>(null);
  const pdfRef   = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLInputElement | null>(null);

  // Compteur (MVP localStorage)
  const [used, setUsed] = useState<number>(() => {
    const v = Number(localStorage.getItem(LS_KEY_USED));
    return Number.isFinite(v) && v >= 0 ? v : 0;
  });
  useEffect(() => localStorage.setItem(LS_KEY_USED, String(used)), [used]);

  // Dossiers (flat) + état repli
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

  // Index par parent (tri alpha par fratrie)
  const byParent = useMemo(() => {
    const map = new Map<string | null, Folder[]>();
    for (const f of folders) {
      const arr = map.get(f.parentId) ?? [];
      arr.push(f);
      map.set(f.parentId, arr);
    }
    for (const [, arr] of map) arr.sort((a, b) => a.name.localeCompare(b.name));
    return map;
  }, [folders]);

  // CRUD dossiers
  const addFolder = (name: string, parentId: string | null) => {
    const id = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
    setFolders((fs) => [...fs, { id, name, parentId }]);
    if (parentId) setCollapsed((c) => ({ ...c, [parentId]: false })); // déplier le parent
  };
  const promptAddChild = (pid: string) => {
    const n = prompt('Nom du sous-dossier :')?.trim();
    if (n) addFolder(n, pid);
  };
  const renameFolder   = (id: string) => {
    const cur = folders.find((x) => x.id === id); if (!cur) return;
    const n = prompt('Nouveau nom :', cur.name)?.trim(); if (!n) return;
    setFolders((fs) => fs.map((x) => (x.id === id ? { ...x, name: n } : x)));
  };
  const deleteFolder   = (id: string) => {
    if (!confirm('Supprimer ce dossier et son contenu ?')) return;
    const toDelete = new Set<string>();
    const visit = (d: string) => { toDelete.add(d); for (const f of folders) if (f.parentId === d) visit(f.id); };
    visit(id);
    setFolders((fs) => fs.filter((x) => !toDelete.has(x.id)));
  };
  const toggleCollapse = (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  // Création de dossier inline
  const [adding, setAdding] = useState(false);
  const addRef = useRef<HTMLInputElement|null>(null);

  // Quota
  const requireQuota = () => {
    if (used >= FREE_QUOTA) {
      const go = confirm('Tu as atteint la limite du plan gratuit. Mettre à niveau ?');
      if (go) router.push('/pricing');
      return false;
    }
    return true;
  };

  // Upload
  const openPicker = (ref: React.MutableRefObject<HTMLInputElement | null> | React.RefObject<HTMLInputElement>) => {
    if (!requireQuota()) return;
    ref.current?.click();
  };
  const onPdfChange:   React.ChangeEventHandler<HTMLInputElement> = (e) => { if (!e.currentTarget.files?.[0]) return; if (!requireQuota()) return; setUsed((u) => Math.min(FREE_QUOTA, u + 1)); };
  const onAudioChange: React.ChangeEventHandler<HTMLInputElement> = (e) => { if (!e.currentTarget.files?.[0]) return; if (!requireQuota()) return; setUsed((u) => Math.min(FREE_QUOTA, u + 1)); };
  const onVideoChange: React.ChangeEventHandler<HTMLInputElement> = (e) => { if (!e.currentTarget.files?.[0]) return; if (!requireQuota()) return; setUsed((u) => Math.min(FREE_QUOTA, u + 1)); };

  // (démo) données notes – branchement backend plus tard
  const notes: Note[] = []; // ex: [{id:'1', title:'Lettre aux actionnaires - Juin 2024', excerpt:'Résumé...', kind:'pdf', updatedAt:'2025-08-22T15:52:00Z'}]

  return (
    <div className="min-h-screen">
      {/* ── Header ───────────────────────────────────────────── */}
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

      {/* Bandeau quota (option) */}
      {used >= FREE_QUOTA && (
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900 flex items-center justify-between">
            <span>Tu as atteint la limite du plan gratuit.</span>
            <button onClick={() => router.push('/pricing')} className="rounded-lg bg-amber-600 px-3 py-1.5 text-white hover:bg-amber-500">
              Mettre à niveau
            </button>
          </div>
        </div>
      )}

      {/* ── Grille principale : Sidebar / Main ─────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="order-2 lg:order-1 lg:col-span-3 space-y-6">
          {/* Vues */}
          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase px-1 mb-2">Vues</div>
            <nav className="grid gap-1">
              <NavItem label="Toutes" active count={used} onClick={() => console.log('vue: all')} />
              <NavItem label="Récents" count={0} onClick={() => console.log('vue: recent')} />
              <NavItem label="Épinglées" count={0} onClick={() => console.log('vue: pinned')} />
              <NavItem label="Non classées" count={Math.max(0, used)} onClick={() => console.log('vue: uncategorized')} />
            </nav>
          </section>

          {/* Dossiers */}
          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-500 uppercase">Dossiers</div>
              <button onClick={() => setAdding(true)} className="text-indigo-600 hover:underline text-sm">+ Dossier</button>
            </div>

            {adding ? (
              <div className="flex gap-2 px-2 pb-2">
                <input
                  ref={addRef}
                  autoFocus
                  className="flex-1 rounded-lg border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nom du dossier…"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const name = (e.currentTarget.value || '').trim();
                      if (name) addFolder(name, null);
                      setAdding(false);
                    }
                    if (e.key === 'Escape') setAdding(false);
                  }}
                  onBlur={() => setAdding(false)}
                />
              </div>
            ) : null}

            <FolderTree
              byParent={byParent}
              collapsed={collapsed}
              onToggle={toggleCollapse}
              onAddChild={promptAddChild}
              onRename={renameFolder}
              onDelete={deleteFolder}
            />
          </section>
        </aside>

        {/* Main */}
        <main className="order-1 lg:order-2 lg:col-span-9 space-y-8">
          {/* Créer une note – 4 boutons par ligne */}
          <section>
            <h2 className="mb-3 text-lg font-semibold">Créer une note</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              <NoteActionCard title="Enregistrer l’audio" subtitle="Parler, transcrire, résumer" icon="🎤" onClick={() => openPicker(audioRef)} />
              <input ref={audioRef} type="file" accept="audio/*" className="hidden" onChange={onAudioChange} />

              <NoteActionCard title="Téléverser une vidéo" subtitle="MP4, WEBM, MOV" icon="🎬" onClick={() => openPicker(videoRef)} />
              <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={onVideoChange} />

              <NoteActionCard title="Téléverser un PDF" subtitle="Extraction + résumé" icon="📄" onClick={() => openPicker(pdfRef)} />
              <input ref={pdfRef} type="file" accept="application/pdf" className="hidden" onChange={onPdfChange} />

              <NoteActionCard title="Lien Web" subtitle="Résumé page web" icon="🔗" onClick={() => { if (!requireQuota()) return; const url = prompt('URL à importer :'); if (url) console.log('URL:', url); }} />

              <NoteActionCard title="Vidéo YouTube" subtitle="Saisir l’URL YouTube" icon="▶️" onClick={() => { if (!requireQuota()) return; const url = prompt('URL YouTube :'); if (url) console.log('YouTube:', url); }} />

              <NoteActionCard title="Note vierge" subtitle="Commencer au clavier" icon="✏️" onClick={() => (requireQuota() ? alert('Créer une note vide (à brancher)') : null)} />

              {/* (option) Une carte "Importer un fichier" si tu veux remplacer le hint compact */}
              {/* <NoteActionCard title="Importer un fichier" subtitle="PDF, vidéo, audio" icon="📥" onClick={() => openPicker(pdfRef)} /> */}
            </div>

            {/* Hint d’import compact */}
            <CompactDropHint onClick={() => openPicker(pdfRef)} />
          </section>

          {/* Mes notes – liste claire et visible */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Mes notes</h3>
              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm hover:bg-slate-50" aria-label="Vue grille">▦</button>
                <button className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm hover:bg-slate-50" aria-label="Vue liste">≣</button>
                <select
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => console.log('sort:', e.target.value)}
                  defaultValue="recent"
                >
                  <option value="recent">Trier : Récents</option>
                  <option value="az">Trier : A → Z</option>
                  <option value="za">Trier : Z → A</option>
                </select>
              </div>
            </div>

            {notes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                <div className="mx-auto mb-2 text-3xl">📂</div>
                <p>Aucune note pour le moment.</p>
                <p className="text-sm">Importe un PDF/vidéo, colle un lien, ou crée une note vierge.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((n) => (
                  <NoteRow key={n.id} note={n} onOpen={() => alert(`Ouvrir la note ${n.id}`)} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* UI atoms                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

function NavItem({ label, active=false, count, onClick }:{
  label: string; active?: boolean; count?: number; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center justify-between rounded-lg px-3 py-2 transition",
        active ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-100 text-slate-700"
      ].join(" ")}
    >
      <span>{label}</span>
      {typeof count === "number" && (
        <span className={[
          "ml-3 inline-flex items-center rounded-full px-2 text-xs",
          active ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
        ].join(" ")}>
          {count}
        </span>
      )}
    </button>
  );
}

function NoteActionCard(props: { title: string; subtitle?: string; icon?: string; onClick?: () => void }) {
  const { title, subtitle, icon = '📎', onClick } = props;
  return (
    <button
      onClick={onClick}
      className="group rounded-xl border border-indigo-100 bg-white px-4 py-3 text-left shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className="flex items-start gap-3">
        <div className="text-xl text-indigo-600/90">{icon}</div>
        <div className="min-w-0">
          <div className="font-medium truncate">{title}</div>
          {subtitle ? <div className="text-xs text-slate-500 truncate">{subtitle}</div> : null}
        </div>
      </div>
    </button>
  );
}

function CompactDropHint({ onClick }:{ onClick?:()=>void }) {
  return (
    <div className="mt-2 text-sm text-slate-600">
      Glisse un fichier (PDF, vidéo, audio) ou{' '}
      <button onClick={onClick} className="text-indigo-600 underline hover:text-indigo-700">
        clique pour choisir
      </button>.
    </div>
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

/* ────────────────────────────────────────────────────────────────────────── */
/* Liste de notes (row)                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

function NoteRow({ note, onOpen }:{ note: Note; onOpen: () => void }) {
  const icon = note.kind === 'pdf' ? '📄' : note.kind === 'audio' ? '🎤' : note.kind === 'video' ? '🎬' : '📝';
  const date = new Date(note.updatedAt).toLocaleString();

  return (
    <button
      onClick={onOpen}
      className="w-full rounded-xl border border-slate-200 bg-white text-left p-4 shadow-sm hover:shadow-md transition flex items-start justify-between gap-4"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="text-xl">{icon}</div>
        <div className="min-w-0">
          <div className="font-semibold leading-tight truncate">{note.title}</div>
          {note.excerpt ? <div className="text-sm text-slate-600 line-clamp-2">{note.excerpt}</div> : null}
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5">
              {icon === '📄' ? 'PDF' : icon === '🎤' ? 'Audio' : icon === '🎬' ? 'Vidéo' : 'Texte'}
            </span>
            <span>Modifiée&nbsp;: {date}</span>
          </div>
        </div>
      </div>
      <div className="text-slate-400">›</div>
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Arbre de dossiers                                                          */
/* ────────────────────────────────────────────────────────────────────────── */

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
          <button className="truncate text-left" aria-label={`Ouvrir le dossier ${node.name}`}>📁 {node.name}</button>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-2 text-slate-500">
          <button onClick={() => onAddChild(node.id)} title="Sous-dossier" aria-label="Créer un sous-dossier">➕</button>
          <button onClick={() => onRename(node.id)}   title="Renommer" aria-label="Renommer le dossier">✏️</button>
          <button onClick={() => onDelete(node.id)}   title="Supprimer" aria-label="Supprimer le dossier">🗑️</button>
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

