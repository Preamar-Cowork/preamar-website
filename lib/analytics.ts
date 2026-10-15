/*
 * Google Ads — measuring which ads bring reservation requests.
 *
 * The tag only uses cookies after the visitor accepts in the cookie banner
 * (Google Consent Mode v2). Until then Google measures without cookies.
 */

export const ADS_ID = "AW-18515751428";

/**
 * Conversion label of the "Enviar formulário de leads" action — the part after
 * the slash in the event snippet: 'send_to': 'AW-18515751428/XXXXXXXX'.
 * Google Ads → Objetivos → Conversões → (ação) → Configuração da etiqueta.
 * Empty = the lead is not reported to Google Ads yet.
 */
export const ADS_LEAD_LABEL = "";

export const CONSENT_KEY = "pm-consent"; // "granted" | "denied"

type Gtag = (...args: unknown[]) => void;
const gtag = (): Gtag | null =>
  typeof window !== "undefined" && typeof (window as unknown as { gtag?: Gtag }).gtag === "function"
    ? (window as unknown as { gtag: Gtag }).gtag
    : null;

export function readConsent(): "granted" | "denied" | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(v: "granted" | "denied") {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {}
  gtag()?.("consent", "update", {
    ad_storage: v,
    ad_user_data: v,
    ad_personalization: v,
    analytics_storage: v,
  });
}

/** Call once the reservation request was saved. */
export function trackLead() {
  const g = gtag();
  if (!g) return;
  if (ADS_LEAD_LABEL) g("event", "conversion", { send_to: `${ADS_ID}/${ADS_LEAD_LABEL}` });
  g("event", "generate_lead");
}

/** Runs before gtag.js: consent defaults (denied unless accepted before), then the tag config. */
export const GTAG_INIT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var c = null; try { c = localStorage.getItem('${CONSENT_KEY}'); } catch (e) {}
var g = c === 'granted' ? 'granted' : 'denied';
gtag('consent', 'default', { ad_storage: g, ad_user_data: g, ad_personalization: g, analytics_storage: g, wait_for_update: 500 });
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
gtag('js', new Date());
gtag('config', '${ADS_ID}');
`;
