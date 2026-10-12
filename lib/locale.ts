/*
 * Site languages. Portuguese lives at "/", English at "/en".
 * Texts editable in /admin come from the content (PT + EN layer); the small
 * fixed bits of interface below (button states, error messages, screen-reader
 * labels) are not editable and live here.
 */

export type Locale = "pt" | "en";
export const LOCALES: Locale[] = ["pt", "en"];
export const LOCALE_PATH: Record<Locale, string> = { pt: "/", en: "/en" };
export const HTML_LANG: Record<Locale, string> = { pt: "pt-PT", en: "en" };

export const UI = {
  pt: {
    nextTide: "Próxima preamar",
    nextTideTitle: "Preia-mar no Montijo — previsão FCUL/Lisboa com correção do Instituto Hidrográfico",
    scrollDown: "Descer",
    langNav: "Idioma",
    perPerson: "por pessoa",
    included: "Incluído: ",
    notIncluded: "Não incluído: ",
    deposit: "sinal",
    sending: "A enviar…",
    errMissing: "Preenche nome, email e telemóvel.",
    errPrivacy: "Aceita a política de privacidade para continuar.",
    errSend: "Não foi possível enviar agora. Tenta de novo em instantes.",
    openMap: (p: string) => `Abrir ${p} no mapa`,
    sendEmail: (e: string) => `Enviar email para ${e}`,
    call: (n: string) => `Ligar para ${n}`,
    instagram: "Instagram da PREAMAR (abre numa nova janela)",
    people: "pessoas",
  },
  en: {
    nextTide: "Next high tide",
    nextTideTitle: "High water in Montijo — FCUL/Lisbon forecast corrected by the Portuguese Hydrographic Institute",
    scrollDown: "Scroll down",
    langNav: "Language",
    perPerson: "per person",
    included: "Included: ",
    notIncluded: "Not included: ",
    deposit: "deposit",
    sending: "Sending…",
    errMissing: "Please fill in your name, email and mobile number.",
    errPrivacy: "Please accept the privacy policy to continue.",
    errSend: "We couldn't send it right now. Please try again in a moment.",
    openMap: (p: string) => `Open ${p} on the map`,
    sendEmail: (e: string) => `Email ${e}`,
    call: (n: string) => `Call ${n}`,
    instagram: "PREAMAR on Instagram (opens in a new window)",
    people: "people",
  },
} as const;

export type UIStrings = (typeof UI)[Locale];

/** Number as shown on the site: "12,50" in PT, "12.50" in EN. */
export const fmtNumber = (n: number, locale: Locale) => {
  const s = Number.isInteger(n) ? String(n) : n.toFixed(2);
  return locale === "pt" ? s.replace(".", ",") : s;
};

/** Price with currency: "12 €" in PT, "€12" in EN. */
export const money = (n: number, locale: Locale) =>
  locale === "pt" ? `${fmtNumber(n, locale)} €` : `€${fmtNumber(n, locale)}`;
