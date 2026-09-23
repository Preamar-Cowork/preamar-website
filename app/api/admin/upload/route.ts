import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { isAdmin } from "@/lib/adminAuth";

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const MAX_BYTES = 15 * 1024 * 1024;

// Authenticated-only: uploads one image to Storage (bucket "media") and
// returns its public URL. The section is only changed when you then save.
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const supabase = getSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 500 });

    const form = await req.formData();
    const file = form.get("image");
    if (!(file instanceof File)) return NextResponse.json({ error: "sem ficheiro" }, { status: 400 });
    const ext = TYPES[file.type];
    if (!ext) return NextResponse.json({ error: "formato não suportado (usa JPG, PNG ou WebP)" }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "imagem demasiado grande (máx. 15 MB)" }, { status: 400 });

    const path = `images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from("media")
      .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
    if (error) return NextResponse.json({ error: `storage: ${error.message}` }, { status: 500 });

    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return NextResponse.json({ ok: true, url: data.publicUrl });
  } catch (e) {
    return NextResponse.json({ error: `unexpected: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 });
  }
}
