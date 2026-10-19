import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Used only by the sign-in callback, which needs to save the login cookie.
export async function createServerSupabase() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return store.getAll();
        },
        setAll(list) {
          try {
            list.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {
            // Called from a place where cookies are read-only; safe to ignore.
          }
        },
      },
    }
  );
}
