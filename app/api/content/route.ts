import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/siteContent";

// Public read of the editable site content (hero video + hero settings).
// force-dynamic: otherwise Next treats this GET as static and caches it,
// so changes saved in /admin would never show up.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const c = await getSiteContent();
  return NextResponse.json({
    hero_video_url: c.heroVideoUrl,
    hero_settings: c.heroSettings,
    sections: c.sections,
  });
}
