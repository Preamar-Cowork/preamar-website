import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerAuthClient } from "@/lib/supabase/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// Authenticated-only: uploads a new hero video to Supabase Storage and
// records its public URL on the site_content row. The session cookie is
// checked with the anon-key client; the actual storage write uses the
// service-role client so it isn't blocked by storage RLS.
export async function POST(req: NextRequest) {
  const authClient = createServerAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "supabase_not_configured" }, { status: 500 });
  }

  const formData = await req.formData();
  const file = formData.get("video");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "mp4";
  const path = `hero/hero-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, buffer, { contentType: file.type || "video/mp4", upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
  const heroVideoUrl = pub.publicUrl;

  const { error: dbError } = await supabase
    .from("site_content")
    .upsert({ id: 1, hero_video_url: heroVideoUrl, updated_at: new Date().toISOString() });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, hero_video_url: heroVideoUrl });
}
