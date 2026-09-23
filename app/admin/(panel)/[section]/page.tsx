"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { FieldEditor } from "@/components/admin/FieldEditor";
import { SectionPreview } from "@/components/admin/SectionPreview";
import { Panel, SaveBar, ScaledPreview, labelCls, readJson, type SaveState } from "@/components/admin/ui";
import {
  DEFAULT_SECTIONS,
  folioOf,
  getSectionDef,
  sanitizeSection,
  type SectionKey,
} from "@/lib/content/schema";

type Obj = Record<string, unknown>;

export default function SectionEditorPage({ params }: { params: { section: string } }) {
  const def = getSectionDef(params.section);
  if (!def) notFound();
  const key = def.key as SectionKey;

  const [draft, setDraft] = useState<Obj>(() => sanitizeSection(key, null) as Obj);
  const [saved, setSaved] = useState<Obj>(draft);
  const [loaded, setLoaded] = useState(false);
  const [save, setSave] = useState<SaveState>({ kind: "idle" });

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const s = sanitizeSection(key, data?.sections?.[key]) as Obj;
        setDraft(s);
        setSaved(s);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [key]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  // warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  async function handleSave() {
    setSave({ kind: "busy" });
    try {
      const res = await fetch("/api/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, data: draft }),
      });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data?.error || `erro ${res.status}`);
      setDraft(data.data);
      setSaved(data.data);
      setSave({ kind: "done", msg: "Guardado — já está no site." });
    } catch (e) {
      setSave({ kind: "error", msg: e instanceof Error ? e.message : String(e) });
    }
  }

  const n = key === "footer" ? "" : folioOf(key);

  return (
    <div className="pb-24">
      <div className={`${labelCls} mb-3`}>{n ? `Secção ${n}` : "Página inicial"}</div>
      <h1 className="font-display text-[32px] text-pm-ink mb-2">{def.title}</h1>
      <p className="text-pm-graphite text-[15px] mb-10 max-w-[60ch]">
        As alterações aparecem logo na pré-visualização. Só vão para o site quando carregares em{" "}
        <em>Guardar alterações</em>. As imagens carregadas também só ficam no site depois de guardar.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-10 items-start">
        <div className="xl:sticky xl:top-6">
          <div className={`${labelCls} mb-3 flex justify-between`}>
            <span>Pré-visualização</span>
            {dirty && <span className="text-pm-sky">alterações por guardar</span>}
          </div>
          <div className="xl:max-h-[calc(100vh-220px)] overflow-auto">
            <ScaledPreview>{loaded && <SectionPreview sectionKey={key} content={draft} />}</ScaledPreview>
          </div>
          <div className="mt-6">
            <SaveBar
              dirty={dirty}
              save={save}
              onSave={handleSave}
              onUndo={() => setDraft(saved)}
              onReset={() => {
                setDraft(DEFAULT_SECTIONS[key] as Obj);
                setSave({ kind: "idle" });
              }}
            />
          </div>
        </div>

        <Panel title="Conteúdo">
          {def.fields.map((f) => (
            <FieldEditor
              key={f.key}
              def={f}
              value={draft[f.key]}
              onChange={(v) => {
                setDraft((d) => ({ ...d, [f.key]: v }));
                setSave({ kind: "idle" });
              }}
            />
          ))}
        </Panel>
      </div>
    </div>
  );
}
