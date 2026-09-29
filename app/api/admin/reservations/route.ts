import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { isAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// Authenticated-only: list reservations (the /admin inbox).
// ?summary=1 → just the unread count (for the menu badge).
export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const supabase = getSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 500 });

    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) return NextResponse.json({ error: `db: ${error.message}` }, { status: 500 });

    const rows = data ?? [];
    const hasReadColumn = rows.length === 0 || "read_at" in rows[0];
    const unread = hasReadColumn ? rows.filter((r) => !r.read_at).length : rows.length;

    if (req.nextUrl.searchParams.get("summary")) return NextResponse.json({ unread });
    return NextResponse.json({ rows, unread, hasReadColumn });
  } catch (e) {
    return NextResponse.json({ error: `unexpected: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 });
  }
}

// Mark one reservation as read / unread: { id, read: boolean }
export async function PATCH(req: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const supabase = getSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 500 });

    const body = await req.json().catch(() => null);
    const id = typeof body?.id === "string" ? body.id : null;
    if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
    const read_at = body.read ? new Date().toISOString() : null;

    const { error } = await supabase.from("reservations").update({ read_at }).eq("id", id);
    if (error) {
      const hint = /read_at/.test(error.message) ? " — falta correr a migração 007_reservations_read.sql" : "";
      return NextResponse.json({ error: `db: ${error.message}${hint}` }, { status: 500 });
    }
    return NextResponse.json({ ok: true, read_at });
  } catch (e) {
    return NextResponse.json({ error: `unexpected: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 });
  }
}
