"use client";

import { useEffect, useState } from "react";
import { ImageField } from "@/components/admin/FieldEditor";
import { Field, inputCls, labelCls, readJson, type SaveState } from "@/components/admin/ui";
import { SECTION_KEYS, sanitizeSections, type SectionKey, type SiteSections } from "@/lib/content/schema";
import { enDraftSection } from "@/lib/content/en";
import { LangTabs, useEditLang } from "@/components/admin/LangTabs";
import type { Locale } from "@/lib/locale";

/** English texts of every section, in the same shape as the Portuguese. */
const enAll = (pt: SiteSections, raw: unknown) =>
  Object.fromEntries(
    SECTION_KEYS.map((k) => [k, enDraftSection(k, pt[k], (raw as Record<string, unknown> | null)?.[k])])
  ) as SiteSections;

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
  const [savedEn, setSavedEn] = useState<SiteSections>(() => enAll(sanitizeSections(null), null));
  const [draftEn, setDraftEn] = useState<SiteSections>(savedEn);
  const [save, setSave] = useState<SaveState>({ kind: "idle" });
  const [lang, setLang] = useEditLang();

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const s = sanitizeSections(d?.sections);
        setSaved(s);
        setDraft(s);
        const e = enAll(s, d?.sections_en);
        setSavedEn(e);
        setDraftEn(e);
      })
      .catch(() => {});
  }, []);

  const changedIn = (d: SiteSections, sv: SiteSections) =>
    SLOTS.map((s) => s.section).filter((k, i, a) => a.indexOf(k) === i && JSON.stringify(d[k]) !== JSON.stringify(sv[k]));
  const changedPt = changedIn(draft, saved);
  const changedEn = changedIn(draftEn, savedEn);
  const changed = lang === "en" ? changedEn : changedPt;
  const dirty = changed.length > 0;
  const anyDirty = changedPt.length > 0 || changedEn.length > 0;

  useEffect(() => {
    if (!anyDirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [anyDirty]);

  async function handleSave() {
    setSave({ kind: "busy" });
    try {
      const en = lang === "en";
      let next = en ? savedEn : saved;
      for (const key of changed) {
        const res = await fetch("/api/admin/sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, data: (en ? draftEn : draft)[key], locale: lang }),
        });
        const d = await readJson(res);
        if (!res.ok) throw new Error(d?.error || `erro ${res.status}`);
        next = { ...next, [key]: en ? enDraftSection(key, draft[key], d.data) : d.data };
      }
      if (en) {
        setSavedEn(next);
        setDraftEn(next);
      } else {
        setSaved(next);
        setDraft(next);
      }
      setSave({ kind: "done", msg: en ? "Guardado — já está em preamar.pt/en." : "Guardado — já está no site." });
    } catch (e) {
      setSave({ kind: "error", msg: e instanceof Error ? e.message : String(e) });
    }
  }

  const update = (slot: Slot, patch: Partial<{ image: string; caption: string; alt: string }>) => {
    const apply = (c: SiteSections) => slot.set(c, { ...slot.get(c), ...patch });
    if (lang === "en") setDraftEn(apply);
    else setDraft(apply);
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

      <LangTabs
        value={lang}
        onChange={(l: Locale) => {
          setLang(l);
          setSave({ kind: "idle" });
        }}
        dirty={{ pt: changedPt.length > 0, en: changedEn.length > 0 }}
      />

      <div className="flex flex-col gap-6 max-w-[860px]">
        {SLOTS.map((slot) => {
          const v = slot.get(draft);
          const e = slot.get(draftEn);
          if (lang === "en") {
            return (
              <section key={slot.id} className="border border-pm-line bg-pm-bg p-6">
                <div className={`${labelCls} text-pm-ink mb-1`}>{slot.title}</div>
                <p className="text-[13px] text-pm-concrete mb-5">{slot.where}</p>
                <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-6">
                  <div className="w-full aspect-[4/3] border border-pm-line bg-pm-bgAlt overflow-hidden flex items-center justify-center">
                    {v.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-label text-[10px] tracking-[0.1em] uppercase text-pm-concrete">sem imagem</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-6">
                    {e.caption !== undefined && (
                      <Field label="Legenda (visível) — inglês">
                        <input className={inputCls} value={e.caption} placeholder={v.caption} onChange={(ev) => update(slot, { caption: ev.target.value })} />
                        <PtLine text={v.caption ?? ""} />
                      </Field>
                    )}
                    <Field label="Descrição (Google e leitores de ecrã) — inglês">
                      <textarea
                        className={`${inputCls} resize-y`}
                        rows={2}
                        value={e.alt}
                        placeholder={v.alt}
                        maxLength={300}
                        onChange={(ev) => update(slot, { alt: ev.target.value })}
                      />
                      <PtLine text={v.alt} />
                    </Field>
                  </div>
                </div>
              </section>
            );
          }
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
          onClick={() => (lang === "en" ? setDraftEn(savedEn) : setDraft(saved))}
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

function PtLine({ text }: { text: string }) {
  if (!text) return null;
  return (
    <p className="text-[13px] text-pm-concrete mt-1.5">
      <span className="font-label font-bold text-[10px] tracking-[0.12em] mr-1.5">PT</span>
      {text}
    </p>
  );
}
