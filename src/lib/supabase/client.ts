import { createBrowserClient } from "@supabase/ssr";

/** Browser-side Supabase client — respects the signed-in user's RLS session. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
