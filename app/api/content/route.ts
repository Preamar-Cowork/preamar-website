import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// Public read of site content (currently just the hero video URL).
// Uses the service-role client server-side so it works even before any
// RLS policy is set up; there is nothing sensitive in this row.
export async function GET() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ hero_video_url: null });
  }
  const { data } = await supabase.from("site_content").select("hero_video_url").eq("id", 1).maybeSingle();
  return NextResponse.json({ hero_video_url: data?.hero_video_url ?? null });
}
