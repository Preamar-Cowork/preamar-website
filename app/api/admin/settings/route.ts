import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sanitizeHeroSettings } from "@/lib/heroSettings";

// Authenticated-only: saves the hero settings (filtro, texto, logo).
// Values are sanitized/clamped server-side before they reach the DB.
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const supabase = getSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 500 });

    const body = await req.json().catch(() => null);
    const settings = sanitizeHeroSettings(body?.hero_settings);

    const { error } = await supabase
      .from("site_content")
      .upsert({ id: 1, hero_settings: settings, updated_at: new Date().toISOString() });

    if (error) {
      const hint = /hero_settings/.test(error.message)
        ? " — falta correr a migração 004_hero_settings.sql"
        : "";
      return NextResponse.json({ error: `db: ${error.message}${hint}` }, { status: 500 });
    }
    return NextResponse.json({ ok: true, hero_settings: settings });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `unexpected: ${message}` }, { status: 500 });
  }
}
