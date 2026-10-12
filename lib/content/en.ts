import {
  getSectionDef,
  isTranslatable,
  SECTION_KEYS,
  type Field,
  type SectionKey,
  type SiteSections,
} from "@/lib/content/schema";

/*
 * English version of the site.
 *
 * The Portuguese content is the master: it decides the structure (how many
 * plans, options, questions…), the prices, the images and the switches.
 * The English layer only holds texts, matched to the Portuguese by position.
 * Any English text that is empty shows the Portuguese one instead, so a new
 * question added in PT never leaves a hole on the English page.
 *
 * Stored in site_content.sections_en (migration 010). Until something is
 * saved there, DEFAULT_SECTIONS_EN below is used — first drafts, to be
 * reviewed in /admin.
 */

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);

export const DEFAULT_SECTIONS_EN: Record<SectionKey, Obj> = {
  problem: {
    label: "The problem",
    blocks: [
      {
        title: "One in five workers in Portugal works remotely.",
        text: "That means around 1.1 million people need a proper place to work.",
      },
      {
        title: "Your home isn't an office (and it shouldn't be).",
        text: "Your home should be a place of rest and peace for you and your family — and that doesn't go with a laptop on the dining table.",
      },
      {
        title: "Traffic into Lisbon steals 2 hours of your day!",
        text: "You don't want to work from home, but there are no good options here either, so you end up commuting to Lisbon? That's what we're here to change.",
      },
    ],
  },
  space: {
    label: "The space",
    text: "A space in Montijo designed for working in comfort and with focus, bringing the beauty of the landscape indoors.",
    amenities: [
      "Dedicated and flexible desks",
      "Private offices",
      "Meeting room",
      "Soundproof phone booth",
      "Kitchenette",
      "Lockers",
      "Business address",
      "Dedicated internet",
      "Plenty of natural light",
      "Easy parking",
    ],
  },
  plans: {
    label: "Plans & pricing",
    unit: "per month, VAT included",
    plans: [
      {
        name: "Flexible",
        desc: "Any free desk, during office hours.",
        optionsLabel: "Pass",
        options: [
          { label: "Day", unit: "per day, VAT included", detail: "Valid for one working day, 9am–7pm." },
          { label: "Week", unit: "per week, VAT included", detail: "5 consecutive working days." },
          { label: "Month", unit: "per month, VAT included", detail: "Every working day for a month." },
        ],
        note: "Locker available for an extra €10/month.",
      },
      {
        name: "Dedicated",
        desc: "Your own desk, always the same one. Extended access, locker included.",
      },
      {
        name: "Office",
        desc: "A private room for 2 to 6 people, business address included.",
        prefix: "from ",
        optionsLabel: "People",
        options: [
          { label: "2", unit: "per month, VAT included" },
          { label: "3", unit: "per month, VAT included" },
          { label: "4", unit: "per month, VAT included" },
          { label: "5", unit: "per month, VAT included" },
          { label: "6", unit: "per month, VAT included" },
        ],
        note: "The bigger the team, the lower the price per person.",
      },
    ],
    features: [
      { label: "Dedicated internet, coffee and kitchenette" },
      { label: "Access during office hours" },
      { label: "Always the same desk" },
      { label: "Personal locker" },
      { label: "Extended access, with your own key" },
      { label: "Mail handling" },
      { label: "Meeting room (2 h/month)" },
      { label: "Private room with a door" },
      { label: "Business address" },
    ],
  },
  fiscal: {
    label: "Business address & company registration",
    headline: "Your company's registered office\n{morada-fiscal} per month, VAT included",
    text: "Mail and parcel reception, scanning and email notifications.",
  },
  about: {
    label: "What is Preamar?",
    text:
      "Preamar is high tide — the moment in the tidal cycle when the water reaches its highest point and floods in, filling everything.\n" +
      "We want to be the place where your business reaches that point, because good ideas can't be held back, just like the tide.",
  },
  form: {
    heading: "Tell us what you need.",
    text: "We reply within 24 working hours.",
    phNome: "Name",
    phEmail: "Email",
    phTelefone: "Mobile",
    phProfissao: "Profession or company",
    ondeLabel: "Where do you live",
    onde: ["Montijo", "Alcochete", "Moita", "Barreiro", "Sarilhos Grandes", "Elsewhere"],
    interesseLabel: "What are you interested in",
    interesse: [
      "Flexible desk",
      "Dedicated desk",
      "Private office",
      "Business address only",
      "Occasional meeting room",
      "Not sure yet",
    ],
    gabineteLabel: "For how many people",
    gabinete: ["1-2", "3-4", "5-6", "More"],
    diasLabel: "How many days a week",
    dias: ["1-2", "3-4", "5", "Occasionally"],
    quandoLabel: "When would you need it",
    quando: ["Now", "1-3 months", "3-6 months", "Just exploring"],
    cacifoLabel: "Do you need a locker?",
    cacifo: ["Yes", "No", "Maybe"],
    sinalLabel: "Reserve your desk",
    sinalTitle: "Secure your spot now!",
    sinalTitleOffice: "Secure your office now!",
    sinalDesc:
      "Fully refundable if you decide not to go ahead. You pay nothing now — we send the payment details after we've spoken with you. Bookings with a deposit get first pick of desks.",
    privacyText: "I accept the privacy policy",
    submitText: "Book my spot",
    successTitle: "We've received your request.",
    successText: "We'll be in touch shortly. See you soon.",
  },
  faq: {
    label: "Frequently asked questions",
    items: [
      {
        q: "Is it open yet?",
        a: "We're in pre-opening — booking now guarantees your spot from day one.\nThe space will open by the end of the year.",
      },
      { q: "Is there parking?", a: "Yes, easy parking right next to the building." },
      {
        q: "Is the deposit really refundable?",
        a: "Yes. The deposit — {sinal} for desks, {sinal-gabinete} for offices — is fully refundable if you decide not to go ahead.",
      },
      { q: "Can I change plans?", a: "Yes, plans can be adjusted to your needs." },
      {
        q: "Can I use PREAMAR as my company's registered address?",
        a: "Yes. The business address costs {morada-fiscal} per month, VAT included, and it comes included with private offices. It covers mail and parcel reception, scanning and email notifications.",
      },
      {
        q: "How much does coworking in Montijo cost?",
        a: "At PREAMAR, a flexible desk costs {flexivel-dia} per day, {flexivel-semana} per week or {flexivel-mes} per month; a dedicated desk {fixo} per month; and a private office from {gabinete-2} per month for 2 people. All prices include VAT.",
      },
    ],
  },
  footer: {
    note: "Space in pre-opening.",
  },
};

/* ---------- cleaning what the admin sends ---------- */

function cleanEn(f: Field, raw: unknown): unknown {
  switch (f.type) {
    case "text":
    case "textarea":
    case "lines": {
      const max = f.type === "lines" ? 400 : f.type === "textarea" ? f.max ?? 3000 : f.max ?? 300;
      return typeof raw === "string" ? raw.slice(0, max) : "";
    }
    case "strings":
      return Array.isArray(raw) ? raw.slice(0, f.max ?? 50).map((s) => (typeof s === "string" ? s.slice(0, 200) : "")) : [];
    case "items": {
      if (!Array.isArray(raw)) return [];
      return raw.slice(0, f.max ?? 50).map((item) => {
        const src = isObj(item) ? item : {};
        const out: Obj = {};
        for (const sub of f.fields) if (hasText(sub)) out[sub.key] = cleanEn(sub, src[sub.key]);
        return out;
      });
    }
    default:
      return undefined;
  }
}

/** Does this field (or anything inside it) have English text? */
export const hasText = (f: Field): boolean => isTranslatable(f) || (f.type === "items" && f.fields.some(hasText));

/** Only the English texts of one section, safe to store. */
export function sanitizeEnSection(key: SectionKey, raw: unknown): Obj {
  const def = getSectionDef(key)!;
  const src = isObj(raw) ? raw : {};
  const out: Obj = {};
  for (const f of def.fields) if (hasText(f)) out[f.key] = cleanEn(f, src[f.key]);
  return out;
}

/* ---------- building the English page ---------- */

const str = (v: unknown) => (typeof v === "string" ? v : "");

/**
 * The English texts for the editor: same shape as the Portuguese section,
 * texts = saved English → first draft → "" (empty = not translated yet).
 * Numbers, images and switches are copied from the Portuguese.
 */
function draftField(f: Field, pt: unknown, saved: unknown, dflt: unknown): unknown {
  if (f.type === "items") {
    const list = Array.isArray(pt) ? (pt as Obj[]) : [];
    const s = Array.isArray(saved) ? saved : [];
    const d = Array.isArray(dflt) ? dflt : [];
    return list.map((item, i) => {
      const si = isObj(s[i]) ? s[i] : {};
      const di = isObj(d[i]) ? d[i] : {};
      const out: Obj = {};
      for (const sub of f.fields) out[sub.key] = draftField(sub, item[sub.key], si[sub.key], di[sub.key]);
      return out;
    });
  }
  if (f.type === "strings") {
    const list = Array.isArray(pt) ? (pt as string[]) : [];
    const s = Array.isArray(saved) ? saved : null;
    const d = Array.isArray(dflt) ? dflt : [];
    return list.map((_, i) => (s ? str(s[i]) : str(d[i])));
  }
  if (!isTranslatable(f)) return pt;
  return typeof saved === "string" ? saved : str(dflt);
}

export function enDraftSection<K extends SectionKey>(key: K, pt: SiteSections[K], saved: unknown): SiteSections[K] {
  const def = getSectionDef(key)!;
  const s = isObj(saved) ? saved : null;
  const d = DEFAULT_SECTIONS_EN[key] ?? {};
  const src = pt as unknown as Obj;
  const out: Obj = {};
  for (const f of def.fields) out[f.key] = draftField(f, src[f.key], s ? s[f.key] : undefined, d[f.key]);
  return out as SiteSections[K];
}

/** Fill every empty English text with the Portuguese one (what the site shows). */
function fillField(f: Field, en: unknown, pt: unknown): unknown {
  if (f.type === "items") {
    const list = Array.isArray(pt) ? (pt as Obj[]) : [];
    const e = Array.isArray(en) ? (en as Obj[]) : [];
    return list.map((item, i) => {
      const ei = isObj(e[i]) ? e[i] : {};
      const out: Obj = {};
      for (const sub of f.fields) out[sub.key] = fillField(sub, ei[sub.key], item[sub.key]);
      return out;
    });
  }
  if (f.type === "strings") {
    const list = Array.isArray(pt) ? (pt as string[]) : [];
    const e = Array.isArray(en) ? en : [];
    return list.map((p, i) => str(e[i]).trim() || p);
  }
  if (!isTranslatable(f)) return pt;
  return str(en).trim() ? en : pt;
}

export function fillSectionFromPt<K extends SectionKey>(key: K, en: SiteSections[K], pt: SiteSections[K]): SiteSections[K] {
  const def = getSectionDef(key)!;
  const e = en as unknown as Obj;
  const p = pt as unknown as Obj;
  const out: Obj = {};
  for (const f of def.fields) out[f.key] = fillField(f, e[f.key], p[f.key]);
  return out as SiteSections[K];
}

/** The whole English page content (before price variables are filled in). */
export function localizeSections(pt: SiteSections, savedEn: unknown): SiteSections {
  const saved = isObj(savedEn) ? savedEn : {};
  const out = {} as Record<SectionKey, unknown>;
  for (const key of SECTION_KEYS) {
    out[key] = fillSectionFromPt(key, enDraftSection(key, pt[key], saved[key]), pt[key]);
  }
  return out as SiteSections;
}

/** Keep only the English layer's known sections (for the API). */
export function sanitizeEnSections(raw: unknown): Record<string, Obj> {
  const src = isObj(raw) ? raw : {};
  const out: Record<string, Obj> = {};
  for (const key of SECTION_KEYS) if (isObj(src[key])) out[key] = sanitizeEnSection(key, src[key]);
  return out;
}
