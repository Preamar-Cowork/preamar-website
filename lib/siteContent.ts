import { unstable_noStore as noStore } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sanitizeHeroSettings, type HeroSettings } from "@/lib/heroSettings";
import { sanitizeSections, type SiteSections } from "@/lib/content/schema";

export type SiteContent = {
  heroVideoUrl: string | null;
  heroSettings: HeroSettings;
  sections: SiteSections;
};

/**
 * Server-only read of the editable site content. `select("*")` (not named
 * columns) so it keeps working whether or not migration 004 has been run;
 * any failure falls back to defaults instead of breaking the page.
 */
export async function getSiteContent(): Promise<SiteContent> {
  noStore(); // always fresh — edits in /admin must show up on the next page load
  const fallback: SiteContent = {
    heroVideoUrl: null,
    heroSettings: sanitizeHeroSettings(null),
    sections: sanitizeSections(null),
  };
  const supabase = getSupabaseServerClient();
  if (!supabase) return fallback;
  try {
    const { data, error } = await supabase.from("site_content").select("*").eq("id", 1).maybeSingle();
    if (error || !data) return fallback;
    return {
      heroVideoUrl: (data.hero_video_url as string | null) ?? null,
      heroSettings: sanitizeHeroSettings(data.hero_settings),
      sections: sanitizeSections(data.sections), // column added by migration 005
    };
  } catch {
    return fallback;
  }
}
