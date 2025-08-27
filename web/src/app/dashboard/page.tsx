import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

// Types côté serveur (structurellement compatibles avec ceux du client)
type NoteRow = {
  id: string;
  title: string;
  excerpt: string | null;
  type: "pdf" | "audio" | "web" | "text";
  folder_id: string | null;
  pinned: boolean;
  created_at: string;
};
type FolderRow = { id: string; name: string };

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const notesRes = await supabase
    .from("notes")
    .select("id,title,excerpt,type,folder_id,pinned,created_at")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(30);

  const foldersRes = await supabase
    .from("folders")
    .select("id,name")
    .order("name");

  // <-- Coalescence + cast: plus de `null` dans les props
  const notes: NoteRow[] = (notesRes.data ?? []) as NoteRow[];
  const folders: FolderRow[] = (foldersRes.data ?? []) as FolderRow[];

  return (
    <DashboardClient
      userId={user.id}
      userEmail={user.email ?? ""}
      initialNotes={notes}
      folders={folders}
    />
  );
}
