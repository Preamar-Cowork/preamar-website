"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
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

type SaveState = { kind: "idle" | "busy" | "done" | "error"; msg?: string };

const labelCls = "font-label font-bold text-[11px] tracking-[0.15em] uppercase text-pm-concrete";
const inputCls =
  "w-full bg-transparent border-0 border-b border-pm-line focus:border-pm-ink focus:outline-none py-2.5 text-[16px] text-pm-ink font-body";

async function readJson(res: Response) {
  try {
    return await res.json();
  } catch {
    const text = await res.text().catch(() => "");
    throw new Error(`resposta inesperada do servidor (${res.status}): ${text.slice(0, 160)}`);
  }
}

export default function AdminContentPage() {
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
          <ScaledPreview>
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

/** Renders children at a real 1440×810 desktop size, scaled to fit the column. */
function ScaledPreview({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 1440));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative w-full border border-pm-line bg-pm-ink overflow-hidden" style={{ height: 810 * scale }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ width: 1440, height: 810, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-pm-line bg-pm-bg p-6">
      <div className={`${labelCls} mb-6 text-pm-ink`}>{title}</div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className={`${labelCls} mb-2.5`}>{label}</div>
      {children}
    </div>
  );
}

function Choice({
  active,
  onClick,
  children,
  wide = false,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${wide ? "w-full text-left" : ""} whitespace-nowrap px-3.5 py-2.5 border font-label font-semibold text-[12px] tracking-[0.08em] uppercase transition-colors ${
        active ? "bg-pm-ink text-pm-bg border-pm-ink" : "bg-transparent text-pm-ink border-pm-line hover:border-pm-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className={labelCls}>{label}</span>
        <span className="font-label font-bold text-[13px] text-pm-ink tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        className="pm-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
