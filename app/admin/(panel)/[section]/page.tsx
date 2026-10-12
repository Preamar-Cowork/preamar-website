"use client";

import { useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { FieldEditor } from "@/components/admin/FieldEditor";
import { SectionPreview } from "@/components/admin/SectionPreview";
import { Panel, SaveBar, ScaledPreview, labelCls, readJson, type SaveState } from "@/components/admin/ui";
import { TokenHelp } from "@/components/admin/TokenHelp";
import { LangTabs, useEditLang } from "@/components/admin/LangTabs";
import { applyTokens, priceTokenList } from "@/lib/content/tokens";
import { enDraftSection, fillSectionFromPt } from "@/lib/content/en";
import { LocaleProvider } from "@/lib/i18n";
import {
  DEFAULT_SECTIONS,
  getSectionDef,
  sanitizeSection,
  sanitizeSections,
  type SectionKey,
  type SiteSections,
} from "@/lib/content/schema";

type Obj = Record<string, unknown>;

export default function SectionEditorPage({ params }: { params: { section: string } }) {
  const def = getSectionDef(params.section);
  if (!def) notFound();
  const key = def.key as SectionKey;

  const [lang, setLang] = useEditLang();

  // Portuguese (master)
  const [draft, setDraft] = useState<Obj>(() => sanitizeSection(key, null) as Obj);
  const [saved, setSaved] = useState<Obj>(draft);
  // English texts (same shape; numbers/images copied from the Portuguese)
  const [draftEn, setDraftEn] = useState<Obj>(() => enDraftSection(key, sanitizeSection(key, null), undefined) as Obj);
  const [savedEn, setSavedEn] = useState<Obj>(draftEn);

  const [loaded, setLoaded] = useState(false);
  const [all, setAll] = useState<SiteSections>(() => sanitizeSections(null)); // other sections, for price variables
  const [save, setSave] = useState<SaveState>({ kind: "idle" });

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const allPt = sanitizeSections(data?.sections);
        setAll(allPt);
        const s = allPt[key] as Obj;
        setDraft(s);
        setSaved(s);
        const e = enDraftSection(key, allPt[key], data?.sections_en?.[key]) as Obj;
        setDraftEn(e);
        setSavedEn(e);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [key]);

  const dirtyPt = JSON.stringify(draft) !== JSON.stringify(saved);
  const dirtyEn = JSON.stringify(draftEn) !== JSON.stringify(savedEn);
  const dirty = lang === "en" ? dirtyEn : dirtyPt;

  // price variables from the saved content — or from this draft when editing Planos/Morada/Reserva
  const ptAll = useMemo(() => ({ ...all, [key]: draft }) as SiteSections, [all, key, draft]);
  const tokenList = useMemo(() => priceTokenList(ptAll, lang), [ptAll, lang]);
  const previewContent = useMemo(() => {
    const tokens = Object.fromEntries(tokenList.map((t) => [t.token, t.value]));
    const text =
      lang === "en"
        ? fillSectionFromPt(key, enDraftSection(key, draft as never, draftEn) as never, draft as never)
        : draft;
    return applyTokens(text, tokens);
  }, [draft, draftEn, tokenList, lang, key]);

  // warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirtyPt && !dirtyEn) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirtyPt, dirtyEn]);

  async function handleSave() {
    setSave({ kind: "busy" });
    try {
      const en = lang === "en";
      const res = await fetch("/api/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, data: en ? draftEn : draft, locale: lang }),
      });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data?.error || `erro ${res.status}`);
      if (en) {
        const e = enDraftSection(key, draft as never, data.data) as Obj;
        setDraftEn(e);
        setSavedEn(e);
      } else {
        setDraft(data.data);
        setSaved(data.data);
        setAll((a) => ({ ...a, [key]: data.data }));
        // English follows the new Portuguese structure (added/removed items)
        setDraftEn((e) => enDraftSection(key, data.data, e) as Obj);
        setSavedEn((e) => enDraftSection(key, data.data, e) as Obj);
      }
      setSave({ kind: "done", msg: en ? "Guardado — já está em preamar.pt/en." : "Guardado — já está no site." });
    } catch (e) {
      setSave({ kind: "error", msg: e instanceof Error ? e.message : String(e) });
    }
  }

  return (
    <div className="pb-24">
      <div className={`${labelCls} mb-3`}>Página inicial</div>
      <h1 className="font-display text-[32px] text-pm-ink mb-2">{def.title}</h1>
      <p className="text-pm-graphite text-[15px] mb-8 max-w-[60ch]">
        As alterações aparecem logo na pré-visualização. Só vão para o site quando carregares em{" "}
        <em>Guardar alterações</em>. As imagens carregadas também só ficam no site depois de guardar.
      </p>

      <LangTabs
        value={lang}
        onChange={(l) => {
          setLang(l);
          setSave({ kind: "idle" });
        }}
        dirty={{ pt: dirtyPt, en: dirtyEn }}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-10 items-start">
        <div className="xl:sticky xl:top-6">
          <div className={`${labelCls} mb-3 flex justify-between`}>
            <span>Pré-visualização{lang === "en" ? " — inglês" : ""}</span>
            {dirty && <span className="text-pm-sky">alterações por guardar</span>}
          </div>
          <div className="xl:max-h-[calc(100vh-220px)] overflow-auto">
            <ScaledPreview>
              {loaded && (
                <LocaleProvider locale={lang}>
                  <SectionPreview sectionKey={key} content={previewContent} />
                </LocaleProvider>
              )}
            </ScaledPreview>
          </div>
          <div className="mt-6">
            <SaveBar
              dirty={dirty}
              save={save}
              onSave={handleSave}
              onUndo={() => (lang === "en" ? setDraftEn(savedEn) : setDraft(saved))}
              onReset={() => {
                if (lang === "en") setDraftEn(enDraftSection(key, draft as never, undefined) as Obj);
                else setDraft(DEFAULT_SECTIONS[key] as Obj);
                setSave({ kind: "idle" });
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title={lang === "en" ? "Textos em inglês" : "Conteúdo"}>
            {def.fields.map((f) =>
              lang === "en" ? (
                <FieldEditor
                  key={`en-${f.key}`}
                  def={f}
                  value={draftEn[f.key]}
                  pt={draft[f.key]}
                  onChange={(v) => {
                    setDraftEn((d) => ({ ...d, [f.key]: v }));
                    setSave({ kind: "idle" });
                  }}
                />
              ) : (
                <FieldEditor
                  key={f.key}
                  def={f}
                  value={draft[f.key]}
                  onChange={(v) => {
                    setDraft((d) => ({ ...d, [f.key]: v }));
                    setSave({ kind: "idle" });
                  }}
                />
              )
            )}
          </Panel>
          <TokenHelp tokens={tokenList} />
        </div>
      </div>
    </div>
  );
}
