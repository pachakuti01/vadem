"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Menu,
  Search,
  Mic,
  Upload,
  FileText,
  Youtube,
  Link as LinkIcon,
  Plus,
  Filter,
  MoreHorizontal,
  Star,
  StarOff,
  Clock,
} from "lucide-react";

// ---------- Types ----------
type NoteType = "pdf" | "audio" | "web" | "text";

type Note = {
  id: string;
  title: string;
  excerpt: string | null;
  type: NoteType;
  folder_id: string | null;
  pinned: boolean;
  created_at: string; // ISO
};

type FolderRow = { id: string; name: string };

// ---------- UI helpers (100% Tailwind) ----------
function btn(base = "") {
  return `inline-flex items-center gap-2 rounded-lg border border-transparent
  text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${base}`;
}
const btnGhost = btn("hover:bg-gray-100 px-2 py-1.5");
const btnOutline = btn("border-gray-300 hover:bg-gray-50 px-3 py-2");
const btnSolid = btn("bg-black text-white hover:bg-gray-900 px-3 py-2");
const btnSecondary = btn("bg-gray-100 hover:bg-gray-200 px-3 py-2");

function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`rounded-xl border bg-white ${className}`}>{children}</div>;
}

function TypeBadge({ type }: { type: NoteType }) {
  const map: Record<NoteType, { label: string; Icon: React.ElementType }> = {
    pdf: { label: "PDF", Icon: FileText },
    audio: { label: "Audio", Icon: Mic },
    web: { label: "Web", Icon: LinkIcon },
    text: { label: "Texte", Icon: FileText },
  };
  const { label, Icon } = map[type];
  return (
    <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs text-gray-700">
      <Icon className="h-3.5 w-3.5" /> {label}
    </span>
  );
}

function NoteCard({
  note,
  onTogglePin,
}: {
  note: Note;
  onTogglePin: (id: string, pinned: boolean) => void;
}) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-base font-medium leading-tight truncate">
              {note.title}
            </h3>
            {note.excerpt && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {note.excerpt}
              </p>
            )}
          </div>

          {/* Menu simple (hover) */}
          <div className="relative group">
            <button className={btnGhost}>
              <MoreHorizontal className="h-4 w-4" />
            </button>
            <div className="absolute right-0 z-10 mt-2 hidden w-40 rounded-md border bg-white p-1 text-sm shadow-md group-hover:block">
              <button
                className={`${btnGhost} w-full justify-start`}
                onClick={() => onTogglePin(note.id, !note.pinned)}
              >
                {note.pinned ? (
                  <StarOff className="mr-2 h-4 w-4" />
                ) : (
                  <Star className="mr-2 h-4 w-4" />
                )}
                {note.pinned ? "Désépingler" : "Épingler"}
              </button>
              <div className="my-1 h-px bg-gray-200" />
              <button
                className={`${btnGhost} w-full justify-start text-red-600`}
                disabled
              >
                Supprimer (à venir)
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <TypeBadge type={note.type} />
            {/* À venir : afficher le nom du dossier via join */}
          </div>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {new Date(note.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
}

function Sidebar({
  userEmail,
  folders,
}: {
  userEmail: string;
  folders: FolderRow[];
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-3 pt-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gray-200 font-semibold">
            {userEmail[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="text-sm leading-tight">
            <div className="font-medium">{userEmail.split("@")[0]}</div>
            <div className="text-gray-500">{userEmail}</div>
          </div>
        </div>
      </div>
      <div className="h-px bg-gray-200" />
      <div className="flex-1 overflow-y-auto px-3">
        <div className="py-4 space-y-6">
          <div>
            <div className="px-2 text-xs font-medium text-gray-500 uppercase">
              Vues rapides
            </div>
            <div className="mt-2 grid gap-1">
              <button className={`${btnGhost} justify-start`}>
                <Star className="h-4 w-4" /> Épinglées
              </button>
              <button className={`${btnGhost} justify-start`}>
                <Clock className="h-4 w-4" /> Récentes
              </button>
            </div>
          </div>

          <div>
            <div className="px-2 text-xs font-medium text-gray-500 uppercase">
              Dossiers
            </div>
            <div className="mt-2 grid gap-1">
              <button className={`${btnGhost} justify-start`}>
                Toutes les notes
              </button>
              {folders.map((f) => (
                <button key={f.id} className={`${btnGhost} justify-start`}>
                  {f.name}
                </button>
              ))}
              <button className={`${btnOutline} justify-start mt-2`}>
                <Plus className="h-4 w-4" /> Nouveau dossier
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-200" />
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium">Plan gratuit</div>
            <div className="mt-1 text-xs text-gray-500">2 / 3 notes utilisées</div>
            <div className="mt-2 h-2 rounded bg-gray-100">
              <div className="h-full w-2/3 rounded bg-black" />
            </div>
            <button className={`${btnSecondary} mt-3 w-full`}>Mettre à niveau</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Page client ----------
export default function DashboardClient({
  userId,
  userEmail,
  initialNotes,
  folders,
}: {
  userId: string;
  userEmail: string;
  initialNotes: Note[];
  folders: FolderRow[];
}) {
  const supabase = createClient();

  const [notes, setNotes] = React.useState<Note[]>(initialNotes);
  const [query, setQuery] = React.useState("");
  const [tab, setTab] = React.useState<"all" | NoteType>("all");
  const [pinnedOnly, setPinnedOnly] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // -------- actions --------

  async function reload() {
    setLoading(true);
    const q = supabase
      .from("notes")
      .select("id,title,excerpt,type,folder_id,pinned,created_at")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(60);

    if (tab !== "all") q.eq("type", tab);
    if (pinnedOnly) q.eq("pinned", true);
    if (query) q.ilike("title", `%${query}%`);

    const { data, error } = await q;
    setLoading(false);
    if (!error && data) setNotes(data as Note[]);
  }

  async function createBlankNote() {
    const { data, error } = await supabase
      .from("notes")
      .insert({ title: "Nouvelle note", type: "text", user_id: userId })
      .select("id,title,excerpt,type,folder_id,pinned,created_at")
      .single();
    if (error) return alert(error.message);
    setNotes((cur) => [data as Note, ...cur]);
  }

  // upload PDF → storage + note
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  function openFile() {
    fileRef.current?.click();
  }
  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const key = `${userId}/${crypto.randomUUID()}-${file.name}`;

    // 1) upload
    const { error: upErr } = await supabase.storage
      .from("user-content")
      .upload(key, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (upErr) return alert(upErr.message);

    // 2) create note
    const { data, error } = await supabase
      .from("notes")
      .insert({
        title: file.name.replace(/\.[^.]+$/, ""),
        type: ext === "pdf" ? "pdf" : "text",
        file_key: key,
        user_id: userId,
      })
      .select("id,title,excerpt,type,folder_id,pinned,created_at")
      .single();

    if (error) return alert(error.message);
    setNotes((cur) => [data as Note, ...cur]);
    e.currentTarget.value = ""; // reset
  }

  async function togglePin(id: string, next: boolean) {
    // Optimistic update
    setNotes((cur) => cur.map((n) => (n.id === id ? { ...n, pinned: next } : n)));
    const { error } = await supabase.from("notes").update({ pinned: next }).eq("id", id);
    if (error) {
      alert(error.message);
      setNotes((cur) => cur.map((n) => (n.id === id ? { ...n, pinned: !next } : n)));
    }
  }

  // -------- derive --------
  const filtered = notes.filter((n) => {
    if (tab !== "all" && n.type !== tab) return false;
    if (pinnedOnly && !n.pinned) return false;
    if (query && !(`${n.title} ${n.excerpt ?? ""}`.toLowerCase().includes(query.toLowerCase())))
      return false;
    return true;
  });
  const pinned = filtered.filter((n) => n.pinned);
  const others = filtered.filter((n) => !n.pinned);

  // ---------- render ----------
  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[280px_1fr]">
      {/* Sidebar desktop */}
      <div className="hidden border-r md:block">
        <Sidebar userEmail={userEmail} folders={folders} />
      </div>

      {/* Content */}
      <div className="flex flex-col">
        {/* Header sticky */}
        <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-2">
            {/* Mobile menu */}
            <button
              className={`${btnGhost} md:hidden`}
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-drawer"
            >
              <Menu className="h-5 w-5" />
            </button>

            {mobileNavOpen && (
              <div
                id="mobile-drawer"
                className="fixed inset-0 z-20 md:hidden"
                onClick={() => setMobileNavOpen(false)}
              >
                <div className="absolute inset-0 bg-black/30" />
                <div
                  className="absolute left-0 top-0 h-full w-[300px] bg-white shadow-lg p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Sidebar userEmail={userEmail} folders={folders} />
                </div>
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="relative w-full max-w-xl">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setQuery(e.currentTarget.value)
                    }
                    placeholder="Rechercher une note…"
                    className="w-full rounded-lg border px-9 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>

                {/* Filtres */}
                <div className="relative group">
                  <button className={btnOutline}>
                    <Filter className="h-4 w-4" /> Filtres
                  </button>
                  <div className="absolute right-0 z-10 mt-2 hidden w-56 rounded-md border bg-white p-1 text-sm shadow-md group-hover:block">
                    <button
                      className={`${btnGhost} w-full justify-start`}
                      onClick={() => setPinnedOnly((p) => !p)}
                    >
                      {pinnedOnly ? (
                        <Star className="mr-2 h-4 w-4" />
                      ) : (
                        <StarOff className="mr-2 h-4 w-4" />
                      )}
                      {pinnedOnly ? "Voir tout" : "Épinglées uniquement"}
                    </button>
                  </div>
                </div>

                {/* Nouvelle note */}
                <div className="relative group">
                  <button className={btnSolid}>
                    <Plus className="h-4 w-4" /> Nouvelle note
                  </button>
                  <div className="absolute right-0 z-10 mt-2 hidden w-56 rounded-md border bg-white p-1 text-sm shadow-md group-hover:block">
                    <button className={`${btnGhost} w-full justify-start`} onClick={createBlankNote}>
                      <FileText className="mr-2 h-4 w-4" /> Note vierge
                    </button>
                    <button
                      className={`${btnGhost} w-full justify-start`}
                      onClick={() => alert("Enregistreur audio à brancher")}
                    >
                      <Mic className="mr-2 h-4 w-4" /> Enregistrer l’audio
                    </button>
                    <button className={`${btnGhost} w-full justify-start`} onClick={openFile}>
                      <Upload className="mr-2 h-4 w-4" /> Téléverser un PDF
                    </button>
                    <button
                      className={`${btnGhost} w-full justify-start`}
                      onClick={() => {
                        const url = prompt("URL YouTube / web ?");
                        if (!url) return;
                        supabase
                          .from("notes")
                          .insert({
                            title: url,
                            type: "web",
                            source_url: url,
                            user_id: userId,
                          })
                          .select(
                            "id,title,excerpt,type,folder_id,pinned,created_at"
                          )
                          .single()
                          .then(({ data, error }) => {
                            if (error) return alert(error.message);
                            setNotes((cur) => [data as Note, ...cur]);
                          });
                      }}
                    >
                      <Youtube className="mr-2 h-4 w-4" /> Importer YouTube
                    </button>
                  </div>
                </div>

                <button className={btnOutline} onClick={reload} disabled={loading}>
                  {loading ? "…" : "Recharger"}
                </button>
              </div>

              {/* Tabs */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {(["all", "audio", "pdf", "web", "text"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      tab === t
                        ? "bg-black text-white border-black"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {t === "all" ? "Tout" : t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-8">
          {/* Quick actions */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Nouvelle note</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                className={`${btnSolid} h-12 justify-start`}
                onClick={() => alert("Enregistreur audio à brancher")}
              >
                <Mic className="h-4 w-4" /> Enregistrer l’audio
              </button>
              <button className={`${btnSecondary} h-12 justify-start`} onClick={openFile}>
                <Upload className="h-4 w-4" /> Téléverser
              </button>
              <button
                className={`${btnOutline} h-12 justify-start`}
                onClick={() => {
                  const url = prompt("URL YouTube / web ?");
                  if (!url) return;
                  supabase
                    .from("notes")
                    .insert({ title: url, type: "web", source_url: url, user_id: userId })
                    .select("id,title,excerpt,type,folder_id,pinned,created_at")
                    .single()
                    .then(({ data, error }) => {
                      if (error) return alert(error.message);
                      setNotes((cur) => [data as Note, ...cur]);
                    });
                }}
              >
                <Youtube className="h-4 w-4" /> Vidéo YouTube
              </button>
              <button className={`${btnOutline} h-12 justify-start`} onClick={createBlankNote}>
                <FileText className="h-4 w-4" /> Note vierge
              </button>
            </div>
            {/* input fichier caché */}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              onChange={onPickFile}
              className="hidden"
            />
          </section>

          {/* Pinned */}
          {pinned.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <h3 className="font-medium">Épinglées</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pinned.map((n) => (
                  <NoteCard key={n.id} note={n} onTogglePin={togglePin} />
                ))}
              </div>
            </section>
          )}

          {/* Others */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <h3 className="font-medium">Récentes</h3>
            </div>
            {others.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((n) => (
                  <NoteCard key={n.id} note={n} onTogglePin={togglePin} />
                ))}
              </div>
            ) : (
              <Card>
                <div className="py-10 text-center text-gray-500">
                  Aucune note pour ces filtres. Essayez d’élargir votre recherche.
                </div>
              </Card>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
