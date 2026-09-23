import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// Public read of site content (currently just the hero video URL).
// Uses the service-role client server-side so it works even before any
// RLS policy is set up; there is nothing sensitive in this row.
//
// force-dynamic: without this, Next.js treats this GET route as static
// and caches the response (including supabase-js's internal fetch) —
// so a new hero video saved via /admin would never show up without a
// full rebuild. This forces a fresh read on every request.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ hero_video_url: null });
  }
  const { data } = await supabase.from("site_content").select("hero_video_url").eq("id", 1).maybeSingle();
  return NextResponse.json({ hero_video_url: data?.hero_video_url ?? null });
}
