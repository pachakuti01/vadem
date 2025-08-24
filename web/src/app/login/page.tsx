"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";


export default function Page() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (!error) setSent(true); else alert(error.message);
  }

  return (
    <div style={{maxWidth:420,margin:"40px auto",fontFamily:"system-ui"}}>
      <h1>Se connecter</h1>
      {sent ? <p>📧 Lien envoyé. Consultez votre e-mail.</p> : (
        <form onSubmit={sendLink}>
          <input type="email" placeholder="vous@exemple.com"
            value={email} onChange={e=>setEmail(e.target.value)}
            style={{width:"100%",padding:12,margin:"12px 0"}} required />
          <button type="submit" style={{padding:12,width:"100%"}}>Recevoir un lien magique</button>
        </form>
      )}
    </div>
  );
}
