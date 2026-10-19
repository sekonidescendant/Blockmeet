import { createClient } from "@supabase/supabase-js";

// Read-only client for public pages (events lists, event pages).
// It never carries a login, so those pages can be cached and stay fast.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
