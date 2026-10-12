// Hero settings editable from /admin. Stored as one JSON object in
// site_content.hero_settings so new knobs don't need new migrations.

export type HeroFont = "display" | "body" | "label";
export type HeroTheme = "escuro" | "claro";
export type OverlayColor = "offwhite" | "ardosia" | "azul";

export type HeroSettings = {
  descriptor: string; // small line under the icon, top-left
  theme: HeroTheme; // escuro = logo + texto ardósia; claro = logo + texto off-white
  logoWidth: number; // px, desktop (scales down on mobile)
  tagline: string;
  taglineFont: HeroFont;
  taglineSize: number; // px, desktop (scales down on mobile)
  subtitle: string; // optional second line under the tagline
  ctaText: string;
  overlayColor: OverlayColor;
  overlayOpacity: number; // 0–90 (%)
  en: HeroText; // English texts (empty = shows the Portuguese)
};

/** The hero texts that have an English version. */
export type HeroText = { descriptor: string; tagline: string; subtitle: string; ctaText: string };
export const HERO_TEXT_KEYS = ["descriptor", "tagline", "subtitle", "ctaText"] as const;

export const HERO_DEFAULTS: HeroSettings = {
  descriptor: "Espaços de trabalho · Montijo",
  theme: "escuro",
  logoWidth: 560,
  tagline: "O teu escritório à beira-rio",
  taglineFont: "body",
  taglineSize: 56,
  subtitle: "Cowork no Montijo — secretárias, gabinetes privados e morada fiscal.",
  ctaText: "Reservar o meu lugar",
  overlayColor: "offwhite",
  overlayOpacity: 15,
  en: {
    descriptor: "Workspaces · Montijo",
    tagline: "Your office by the river",
    subtitle: "Coworking in Montijo — desks, private offices and a business address.",
    ctaText: "Book my spot",
  },
};

export const OVERLAY_HEX: Record<OverlayColor, string> = {
  offwhite: "#F3F1EC",
  ardosia: "#3F4346",
  azul: "#84A6B2",
};

export const FONT_LABELS: Record<HeroFont, string> = {
  display: "Libre Caslon Display",
  body: "Libre Caslon Text",
  label: "Archivo Narrow",
};

export const FONT_CLASS: Record<HeroFont, string> = {
  display: "font-display",
  body: "font-body",
  label: "font-label font-bold uppercase tracking-[0.12em]",
};

const clamp = (n: unknown, min: number, max: number, fallback: number) => {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;
};
const str = (s: unknown, max: number, fallback: string) =>
  typeof s === "string" ? s.slice(0, max) : fallback;
const oneOf = <T extends string>(v: unknown, opts: readonly T[], fallback: T): T =>
  opts.includes(v as T) ? (v as T) : fallback;

/** Merge stored (possibly partial / malformed) settings over the defaults. */
export function sanitizeHeroSettings(raw: unknown): HeroSettings {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const d = HERO_DEFAULTS;
  return {
    descriptor: str(r.descriptor, 80, d.descriptor),
    theme: oneOf(r.theme, ["escuro", "claro"] as const, d.theme),
    logoWidth: clamp(r.logoWidth, 160, 1000, d.logoWidth),
    tagline: str(r.tagline, 140, d.tagline),
    taglineFont: oneOf(r.taglineFont, ["display", "body", "label"] as const, d.taglineFont),
    taglineSize: clamp(r.taglineSize, 16, 120, d.taglineSize),
    subtitle: str(r.subtitle, 280, d.subtitle),
    ctaText: str(r.ctaText, 60, d.ctaText) || d.ctaText,
    overlayColor: oneOf(r.overlayColor, ["offwhite", "ardosia", "azul"] as const, d.overlayColor),
    overlayOpacity: clamp(r.overlayOpacity, 0, 90, d.overlayOpacity),
    en: sanitizeHeroText(r.en),
  };
}

function sanitizeHeroText(raw: unknown): HeroText {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const d = HERO_DEFAULTS.en;
  return {
    descriptor: str(r.descriptor, 80, d.descriptor),
    tagline: str(r.tagline, 140, d.tagline),
    subtitle: str(r.subtitle, 280, d.subtitle),
    ctaText: str(r.ctaText, 60, d.ctaText),
  };
}

/** Settings with the texts of the given language (empty English text → Portuguese). */
export function localizeHero(s: HeroSettings, locale: "pt" | "en"): HeroSettings {
  if (locale === "pt") return s;
  const out = { ...s };
  for (const k of HERO_TEXT_KEYS) out[k] = s.en[k].trim() || s[k];
  return out;
}
