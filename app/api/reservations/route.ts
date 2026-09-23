import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.nome || !body.email || !body.telefone) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const record = {
    nome: String(body.nome).slice(0, 200),
    email: String(body.email).slice(0, 200),
    telefone: String(body.telefone).slice(0, 60),
    profissao: body.profissao ? String(body.profissao).slice(0, 200) : null,
    onde: body.onde ?? null,
    interesse: body.interesse ?? null,
    gabinete: body.gabinete ?? null,
    dias: body.dias ?? null,
    quando: body.quando ?? null,
    cacifo: body.cacifo ?? null,
    sinal_aceite: !!body.sinalCheck,
    privacy_aceite: !!body.privacyCheck,
  };

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    // Supabase project not wired up yet — log locally so nothing is lost
    // during development, but don't fail the request.
    console.warn("[preamar] Supabase env vars not set; reservation not persisted:", record);
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error } = await supabase.from("reservations").insert(record);
  if (error) {
    console.error("[preamar] Supabase insert failed:", error.message);
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, persisted: true });
}
