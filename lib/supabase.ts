import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-side Supabase client using the service role key.
 * Only used from API routes (never exposed to the browser).
 * Returns null when env vars aren't set yet, so local dev doesn't crash
 * before the Supabase project exists — the API route degrades gracefully.
 */
export function getSupabaseServerClient() {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
