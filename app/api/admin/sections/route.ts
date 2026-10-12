import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { isAdmin } from "@/lib/adminAuth";
import { SECTION_KEYS, sanitizeSection, type SectionKey } from "@/lib/content/schema";
import { sanitizeEnSection } from "@/lib/content/en";

// Authenticated-only: saves the texts/images of one section of the site
// (locale "en" = only the English texts, into site_content.sections_en).
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const supabase = getSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 500 });

    const body = await req.json().catch(() => null);
    const key = body?.key as SectionKey;
    if (!SECTION_KEYS.includes(key)) return NextResponse.json({ error: "secção desconhecida" }, { status: 400 });
    const en = body?.locale === "en";
    const clean = en ? sanitizeEnSection(key, body?.data) : sanitizeSection(key, body?.data);
    const column = en ? "sections_en" : "sections";

    // merge into the stored object so saving one section never touches the others
    const { data: row, error: readError } = await supabase
      .from("site_content")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (readError) return NextResponse.json({ error: `db: ${readError.message}` }, { status: 500 });
    if (row && !(column in row)) {
      return NextResponse.json(
        { error: `falta correr a migração ${en ? "010_ingles.sql" : "005_sections.sql"} no Supabase` },
        { status: 500 }
      );
    }
    const stored = row?.[column];
    const current = stored && typeof stored === "object" ? stored : {};
    const merged = { ...current, [key]: clean };

    const { error } = await supabase
      .from("site_content")
      .upsert({ id: 1, [column]: merged, updated_at: new Date().toISOString() });
    if (error) return NextResponse.json({ error: `db: ${error.message}` }, { status: 500 });

    return NextResponse.json({ ok: true, data: clean });
  } catch (e) {
    return NextResponse.json({ error: `unexpected: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 });
  }
}
