import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Bienvenue, <b>{user.email}</b>.</p>
    </main>
  );
}

