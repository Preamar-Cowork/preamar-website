"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/locale";

const KEY = "pm-admin-lang";

/** Which language the admin is editing. Remembered between pages (this browser only). */
export function useEditLang(): [Locale, (l: Locale) => void] {
  const [lang, setLang] = useState<Locale>("pt");
  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "en") setLang("en");
    } catch {}
  }, []);
  const set = (l: Locale) => {
    setLang(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  };
  return [lang, set];
}

/** "PT | EN" switch at the top of each editor. */
export function LangTabs({
  value,
  onChange,
  dirty = {},
}: {
  value: Locale;
  onChange: (l: Locale) => void;
  dirty?: Partial<Record<Locale, boolean>>;
}) {
  return (
    <div className="mb-8">
      <div className="inline-flex border border-pm-line p-[3px] gap-[3px] bg-pm-bg" role="tablist" aria-label="Idioma a editar">
        {(["pt", "en"] as Locale[]).map((l) => {
          const active = l === value;
          return (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(l)}
              className={`px-4 py-2 font-label font-bold text-[12px] tracking-[0.14em] uppercase transition-colors ${
                active ? "bg-pm-ink text-pm-bg" : "text-pm-ink hover:bg-pm-line/60"
              }`}
            >
              {l === "pt" ? "Português" : "English"}
              {dirty[l] && <span className="ml-2 text-pm-sky" aria-label="alterações por guardar">•</span>}
            </button>
          );
        })}
      </div>
      {value === "en" && (
        <p className="text-pm-graphite text-[14px] mt-4 mb-0 max-w-[64ch]">
          Estás a editar a página em inglês (<span className="font-label">preamar.pt/en</span>). Aqui só mudam os textos —
          preços, imagens, número de planos e de perguntas vêm do português. Por baixo de cada campo está o texto em
          português para referência. Um campo vazio mostra o português no site.
        </p>
      )}
    </div>
  );
}
