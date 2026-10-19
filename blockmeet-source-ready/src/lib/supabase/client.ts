import { createBrowserClient } from "@supabase/ssr";

// Used inside pages that run in the visitor's browser (login, forms, admin).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
