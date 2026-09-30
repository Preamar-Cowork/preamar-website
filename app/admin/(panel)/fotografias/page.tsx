"use client";

import { useEffect, useState } from "react";
import { ImageField } from "@/components/admin/FieldEditor";
import { Field, inputCls, labelCls, readJson, type SaveState } from "@/components/admin/ui";
import { sanitizeSections, type SectionKey, type SiteSections } from "@/lib/content/schema";

/*
 * Every photo on the page in one place: image, visible caption and the
 * description Google / screen readers use (alt). Saves into the same
 * section content the other admin pages edit.
 */

type Slot = {
  id: string;
  title: string;
  where: string;
  section: SectionKey;
  get: (c: SiteSections) => { image: string; caption?: string; alt: string };
  set: (c: SiteSections, v: { image: string; caption?: string; alt: string }) => SiteSections;
};

const blockSlot = (i: number): Slot => ({
  id: `problem-${i}`,
  title: `O problema — bloco ${i + 1}`,
  where: "Secção “O problema”, por baixo do texto do bloco.",
  section: "problem",
  get: (c) => {
    const b = c.problem.blocks[i];
    return { image: b.image, caption: b.caption, alt: b.alt };
  },
  set: (c, v) => ({
    ...c,
    problem: {
      ...c.problem,
      blocks: c.problem.blocks.map((b, j) => (j === i ? { ...b, image: v.image, caption: v.caption ?? b.caption, alt: v.alt } : b)),
    },
  }),
});

const SLOTS: Slot[] = [
  blockSlot(0),
  blockSlot(1),
  blockSlot(2),
  {
    id: "space",
    title: "O espaço — imagem grande",
    where: "Secção “O espaço”, metade esquerda (sem legenda visível).",
    section: "space",
    get: (c) => ({ image: c.space.image, alt: c.space.imageAlt }),
    set: (c, v) => ({ ...c, space: { ...c.space, image: v.image, imageAlt: v.alt } }),
  },
];

export default function FotografiasPage() {
  const [saved, setSaved] = useState<SiteSections>(() => sanitizeSections(null));
  const [draft, setDraft] = useState<SiteSections>(saved);
  const [save, setSave] = useState<SaveState>({ kind: "idle" });

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const s = sanitizeSections(d?.sections);
        setSaved(s);
        setDraft(s);
      })
      .catch(() => {});
  }, []);

  const changed = SLOTS.map((s) => s.section).filter(
    (k, i, a) => a.indexOf(k) === i && JSON.stringify(draft[k]) !== JSON.stringify(saved[k])
  );
  const dirty = changed.length > 0;

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  async function handleSave() {
    setSave({ kind: "busy" });
    try {
      let next = saved;
      for (const key of changed) {
        const res = await fetch("/api/admin/sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, data: draft[key] }),
        });
        const d = await readJson(res);
        if (!res.ok) throw new Error(d?.error || `erro ${res.status}`);
        next = { ...next, [key]: d.data };
      }
      setSaved(next);
      setDraft(next);
      setSave({ kind: "done", msg: "Guardado — já está no site." });
    } catch (e) {
      setSave({ kind: "error", msg: e instanceof Error ? e.message : String(e) });
    }
  }

  const update = (slot: Slot, patch: Partial<{ image: string; caption: string; alt: string }>) => {
    setDraft((c) => slot.set(c, { ...slot.get(c), ...patch }));
    setSave({ kind: "idle" });
  };

  return (
    <div className="pb-24">
      <div className={`${labelCls} mb-3`}>Página inicial</div>
      <h1 className="font-display text-[32px] text-pm-ink mb-2">Fotografias</h1>
      <p className="text-pm-graphite text-[15px] mb-10 max-w-[64ch]">
        Todas as fotografias do site num só sítio. A <strong>legenda</strong> aparece por baixo da foto; a{" "}
        <strong>descrição</strong> não se vê — é o que o Google e os leitores de ecrã leem. Descreve o que se vê e onde,
        por exemplo “secretárias com luz natural no cowork PREAMAR, Montijo”.
      </p>

      <div className="flex flex-col gap-6 max-w-[860px]">
        {SLOTS.map((slot) => {
          const v = slot.get(draft);
          return (
            <section key={slot.id} className="border border-pm-line bg-pm-bg p-6">
              <div className={`${labelCls} text-pm-ink mb-1`}>{slot.title}</div>
              <p className="text-[13px] text-pm-concrete mb-5">{slot.where}</p>
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6">
                <div>
                  <ImageField label="Fotografia" big value={v.image} onChange={(url) => update(slot, { image: url })} />
                </div>
                <div className="flex flex-col gap-6">
                  {v.caption !== undefined && (
                    <Field label="Legenda (visível)">
                      <input className={inputCls} value={v.caption} onChange={(e) => update(slot, { caption: e.target.value })} />
                    </Field>
                  )}
                  <Field label="Descrição (Google e leitores de ecrã)" help={v.alt ? `${v.alt.length} caracteres` : "Recomendado: 5 a 15 palavras."}>
                    <textarea
                      className={`${inputCls} resize-y`}
                      rows={3}
                      value={v.alt}
                      maxLength={300}
                      onChange={(e) => update(slot, { alt: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="sticky bottom-0 mt-8 -mx-6 px-6 py-4 bg-pm-bgAlt/95 backdrop-blur border-t border-pm-line flex flex-wrap items-center gap-4">
        <button
          onClick={handleSave}
          disabled={!dirty || save.kind === "busy"}
          className="bg-pm-ink text-pm-bg py-3 px-6 font-label font-bold text-sm tracking-[0.14em] uppercase disabled:opacity-40"
        >
          {save.kind === "busy" ? "A guardar…" : "Guardar alterações"}
        </button>
        <button
          onClick={() => setDraft(saved)}
          disabled={!dirty}
          className="font-label font-bold text-[12px] tracking-[0.14em] uppercase text-pm-concrete disabled:opacity-40"
        >
          Desfazer
        </button>
        {save.msg && (
          <span className={`font-label text-[13px] ${save.kind === "error" ? "text-[#A0524A]" : "text-pm-graphite"}`}>{save.msg}</span>
        )}
      </div>
    </div>
  );
}
