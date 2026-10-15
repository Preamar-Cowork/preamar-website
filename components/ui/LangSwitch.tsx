"use client";

import { useLocale } from "@/lib/i18n";
import { LOCALE_PATH, type Locale } from "@/lib/locale";

const ITEMS: { locale: Locale; label: string; name: string; lang: string }[] = [
  { locale: "pt", label: "PT", name: "Português", lang: "pt-PT" },
  { locale: "en", label: "EN", name: "English", lang: "en" },
];

/** "PT | EN" — the current language in bold. Colour follows the parent. */
export function LangSwitch({
  className = "",
  disabled = false,
  hrefs = LOCALE_PATH,
}: {
  className?: string;
  disabled?: boolean;
  hrefs?: Record<Locale, string>; // e.g. the privacy page in each language
}) {
  const { locale, t } = useLocale();
  return (
    <nav aria-label={t.langNav} className={`font-label text-[11px] md:text-[12px] tracking-[0.18em] uppercase flex items-center gap-2 ${className}`}>
      {ITEMS.map((it, i) => {
        const active = it.locale === locale;
        return (
          <span key={it.locale} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="opacity-50 font-medium">
                |
              </span>
            )}
            <a
              href={hrefs[it.locale]}
              hrefLang={it.lang}
              lang={it.lang}
              aria-label={it.name}
              aria-current={active ? "page" : undefined}
              tabIndex={disabled ? -1 : undefined}
              onClick={disabled ? (e) => e.preventDefault() : undefined}
              style={{ color: "inherit" }}
              className={`no-underline transition-opacity ${active ? "font-bold opacity-100" : "font-medium opacity-60 hover:opacity-100"}`}
            >
              {it.label}
            </a>
          </span>
        );
      })}
    </nav>
  );
}
