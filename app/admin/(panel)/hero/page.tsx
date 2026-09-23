"use client";

import { useEffect, useState } from "react";
import {
  Choice,
  Field,
  Panel,
  ScaledPreview,
  Slider,
  inputCls,
  labelCls,
  readJson,
  type SaveState,
} from "@/components/admin/ui";
import { Hero } from "@/components/sections/Hero";
import type { HighTide } from "@/lib/tideFormat";
import {
  FONT_LABELS,
  HERO_DEFAULTS,
  OVERLAY_HEX,
  sanitizeHeroSettings,
  type HeroFont,
  type HeroSettings,
  type OverlayColor,
} from "@/lib/heroSettings";

export default function AdminHeroPage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<HeroSettings>(HERO_DEFAULTS);
  const [saved, setSaved] = useState<HeroSettings>(HERO_DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  const [tides, setTides] = useState<HighTide[]>([]);
  const [save, setSave] = useState<SaveState>({ kind: "idle" });

  const [file, setFile] = useState<File | null>(null);
  const [upload, setUpload] = useState<SaveState>({ kind: "idle" });

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setVideoUrl(data?.hero_video_url ?? null);
        const s = sanitizeHeroSettings(data?.hero_settings);
        setSettings(s);
        setSaved(s);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
    fetch("/api/tide", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setTides(d?.tides ?? []))
      .catch(() => {});
  }, []);

  const dirty = JSON.stringify(settings) !== JSON.stringify(saved);
  const set = <K extends keyof HeroSettings>(k: K, v: HeroSettings[K]) => {
    setSettings((s) => ({ ...s, [k]: v }));
    setSave({ kind: "idle" });
  };

  async function handleSave() {
    setSave({ kind: "busy" });
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero_settings: settings }),
      });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data?.error || `erro ${res.status}`);
      const s = sanitizeHeroSettings(data.hero_settings);
      setSettings(s);
      setSaved(s);
      setSave({ kind: "done", msg: "Guardado — já está no site." });
    } catch (e) {
      setSave({ kind: "error", msg: e instanceof Error ? e.message : String(e) });
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUpload({ kind: "busy" });
    const body = new FormData();
    body.append("video", file);
    try {
      const res = await fetch("/api/admin/content", { method: "POST", body });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data?.error || `upload_failed (${res.status})`);
      setVideoUrl(data.hero_video_url);
      setFile(null);
      setUpload({ kind: "done", msg: "Vídeo atualizado." });
    } catch (e) {
      setUpload({
        kind: "error",
        msg: `Não foi possível enviar o vídeo: ${e instanceof Error ? e.message : String(e)}`,
      });
    }
  }

  return (
    <div className="pb-24">
      <div className={`${labelCls} mb-3`}>Conteúdo</div>
      <h1 className="font-display text-[32px] text-pm-ink mb-2">Hero</h1>
      <p className="text-pm-graphite text-[15px] mb-10 max-w-[60ch]">
        Tudo o que mudares aqui aparece logo na pré-visualização. Só vai para o site quando
        carregares em <em>Guardar alterações</em>.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-10 items-start">
        {/* live preview */}
        <div className="lg:sticky lg:top-6">
          <div className={`${labelCls} mb-3 flex justify-between`}>
            <span>Pré-visualização</span>
            {dirty && <span className="text-pm-sky">alterações por guardar</span>}
          </div>
          <ScaledPreview height={810}>
            {loaded && <Hero contained videoUrl={videoUrl} settings={settings} tides={tides} />}
          </ScaledPreview>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button
              onClick={handleSave}
              disabled={!dirty || save.kind === "busy"}
              className="bg-pm-ink text-pm-bg py-3 px-6 font-label font-bold text-sm tracking-[0.14em] uppercase disabled:opacity-40"
            >
              {save.kind === "busy" ? "A guardar…" : "Guardar alterações"}
            </button>
            <button
              onClick={() => setSettings(saved)}
              disabled={!dirty}
              className="font-label font-bold text-[12px] tracking-[0.14em] uppercase text-pm-concrete disabled:opacity-40"
            >
              Desfazer
            </button>
            <button
              onClick={() => {
                setSettings(HERO_DEFAULTS);
                setSave({ kind: "idle" });
              }}
              className="font-label font-bold text-[12px] tracking-[0.14em] uppercase text-pm-concrete"
            >
              Repor predefinições
            </button>
          </div>
          {save.msg && (
            <p
              className={`mt-4 font-label text-[13px] ${
                save.kind === "error" ? "text-[#A0524A]" : "text-pm-graphite"
              }`}
            >
              {save.msg}
            </p>
          )}
        </div>

        {/* controls */}
        <div className="flex flex-col gap-8">
          <Panel title="Filtro sobre o vídeo">
            <Field label="Cor">
              <div className="flex flex-wrap gap-2">
                {(["offwhite", "ardosia", "azul"] as OverlayColor[]).map((c) => (
                  <Choice key={c} active={settings.overlayColor === c} onClick={() => set("overlayColor", c)}>
                    <span
                      className="inline-block w-3 h-3 border border-pm-line mr-2 align-[-1px]"
                      style={{ background: OVERLAY_HEX[c] }}
                    />
                    {c === "offwhite" ? "Off-white" : c === "ardosia" ? "Ardósia" : "Azul-maré"}
                  </Choice>
                ))}
              </div>
            </Field>
            <Slider
              label="Intensidade"
              value={settings.overlayOpacity}
              min={0}
              max={90}
              unit="%"
              onChange={(v) => set("overlayOpacity", v)}
            />
          </Panel>

          <Panel title="Logo e cor do texto">
            <Field label="Versão">
              <div className="flex gap-2">
                <Choice active={settings.theme === "escuro"} onClick={() => set("theme", "escuro")}>
                  Escura (preto)
                </Choice>
                <Choice active={settings.theme === "claro"} onClick={() => set("theme", "claro")}>
                  Clara (off-white)
                </Choice>
              </div>
            </Field>
            <Slider
              label="Tamanho do logo"
              value={settings.logoWidth}
              min={160}
              max={1000}
              step={10}
              unit="px"
              onChange={(v) => set("logoWidth", v)}
            />
          </Panel>

          <Panel title="Texto do hero">
            <Field label="Linha por baixo do ícone (canto superior esquerdo)">
              <input
                className={inputCls}
                value={settings.descriptor}
                maxLength={80}
                onChange={(e) => set("descriptor", e.target.value)}
              />
            </Field>
            <Field label="Frase-chave">
              <input
                className={inputCls}
                value={settings.tagline}
                maxLength={140}
                onChange={(e) => set("tagline", e.target.value)}
              />
            </Field>
            <Field label="Tipo de letra">
              <div className="flex flex-col gap-2">
                {(["body", "display", "label"] as HeroFont[]).map((f) => (
                  <Choice key={f} active={settings.taglineFont === f} onClick={() => set("taglineFont", f)} wide>
                    <span
                      className={
                        f === "display"
                          ? "font-display normal-case tracking-normal text-[16px]"
                          : f === "body"
                          ? "font-body normal-case tracking-normal text-[15px]"
                          : ""
                      }
                    >
                      {FONT_LABELS[f]}
                    </span>
                  </Choice>
                ))}
              </div>
            </Field>
            <Slider
              label="Tamanho da frase"
              value={settings.taglineSize}
              min={16}
              max={120}
              unit="px"
              onChange={(v) => set("taglineSize", v)}
            />
            <Field label="Subtítulo (opcional)">
              <textarea
                className={`${inputCls} resize-none`}
                rows={2}
                maxLength={280}
                placeholder="Ex.: Secretárias, gabinetes e sala de reuniões no Montijo."
                value={settings.subtitle}
                onChange={(e) => set("subtitle", e.target.value)}
              />
            </Field>
            <Field label="Texto do botão">
              <input
                className={inputCls}
                value={settings.ctaText}
                maxLength={60}
                onChange={(e) => set("ctaText", e.target.value)}
              />
            </Field>
          </Panel>

          <Panel title="Vídeo de fundo">
            {videoUrl ? (
              <video src={videoUrl} muted controls className="w-full border border-pm-line mb-4" />
            ) : (
              <p className="text-pm-graphite text-[14px] mb-4">Ainda sem vídeo.</p>
            )}
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-[14px] text-pm-ink mb-4 block w-full"
            />
            <button
              onClick={handleUpload}
              disabled={!file || upload.kind === "busy"}
              className="bg-pm-ink text-pm-bg py-2.5 px-5 font-label font-bold text-[12px] tracking-[0.14em] uppercase disabled:opacity-40"
            >
              {upload.kind === "busy" ? "A enviar…" : "Enviar vídeo"}
            </button>
            {upload.msg && (
              <p
                className={`mt-3 font-label text-[13px] ${
                  upload.kind === "error" ? "text-[#A0524A]" : "text-pm-graphite"
                }`}
              >
                {upload.msg}
              </p>
            )}
            <p className="text-pm-concrete text-[12px] mt-4">
              MP4 ou WebM, sem som, até ~40 MB. O vídeo é publicado logo ao enviar.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
