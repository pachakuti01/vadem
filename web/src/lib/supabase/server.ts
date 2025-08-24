// src/lib/supabase/server.ts
import { cookies as nextCookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const createClient = () => {
  // Dans Next 15, les types de `cookies()` peuvent être Promise dans certains contextes.
  // On force ici un appel synchrone compatible avec Supabase SSR.
  const cookieStore = (nextCookies as unknown as () => {
    getAll: () => { name: string; value: string }[];
    set: (name: string, value: string, options?: CookieOptions) => void;
  })();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // ignore si set() n'est pas dispo dans certains runtimes
          }
        },
      },
    }
  );
};
