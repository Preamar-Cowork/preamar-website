"use client";

import { useEffect, useState } from "react";

export default function AdminContentPage() {
  const [heroVideoUrl, setHeroVideoUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setHeroVideoUrl(data?.hero_video_url ?? null))
      .catch(() => {});
  }, []);

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setErrorMsg("");
    const body = new FormData();
    body.append("video", file);
    try {
      const res = await fetch("/api/admin/content", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "upload_failed");
      setHeroVideoUrl(data.hero_video_url);
      setStatus("done");
      setFile(null);
    } catch (e) {
      setStatus("error");
      setErrorMsg("Não foi possível enviar o vídeo. Tenta de novo.");
    }
  }

  return (
    <div>
      <div className="font-label font-bold text-[11px] tracking-[0.15em] uppercase text-pm-concrete mb-3">
        Conteúdo
      </div>
      <h1 className="font-display text-[32px] text-pm-ink mb-10">Vídeo do hero</h1>

      {heroVideoUrl ? (
        <div className="mb-8">
          <div className="font-label text-[11px] tracking-[0.1em] uppercase text-pm-concrete mb-3">
            Vídeo atual
          </div>
          <video src={heroVideoUrl} controls className="w-full max-w-md border border-pm-line" />
        </div>
      ) : (
        <p className="text-pm-graphite text-[15px] mb-8">
          Ainda sem vídeo — o hero usa a composição de reserva (placeholder) até enviares um.
        </p>
      )}

      <div className="border border-pm-line p-6 bg-pm-bg">
        <div className="font-label text-[11px] tracking-[0.1em] uppercase text-pm-concrete mb-4">
          Enviar novo vídeo
        </div>
        <input
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-[15px] text-pm-ink mb-4 block"
        />
        <button
          onClick={handleUpload}
          disabled={!file || status === "uploading"}
          className="bg-pm-ink text-pm-bg border-0 py-3 px-6 font-label font-bold text-sm tracking-[0.14em] uppercase cursor-pointer disabled:opacity-50"
        >
          {status === "uploading" ? "A enviar…" : "Guardar vídeo"}
        </button>
        {status === "done" && (
          <div className="mt-4 font-label text-[13px] text-pm-sky">Vídeo atualizado.</div>
        )}
        {status === "error" && (
          <div className="mt-4 font-label text-[13px] text-pm-sky">{errorMsg}</div>
        )}
        <p className="text-pm-concrete text-[13px] mt-5 max-w-[46ch]">
          Ideal: 15–30 segundos, sem som (o hero reproduz em loop, mudo, cobrindo o ecrã inteiro).
          MP4 ou WebM, até ~30 MB para carregar depressa.
        </p>
      </div>
    </div>
  );
}
