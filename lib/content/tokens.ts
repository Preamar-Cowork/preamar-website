import type { SiteSections } from "@/lib/content/schema";

/*
 * Price variables. Any text on the site can say e.g. "custa {fixo} por mês"
 * and it shows the price currently set in /admin → Planos.
 *
 * Names come from the plan and option names (lower case, no accents):
 *   {flexivel-dia} {flexivel-semana} {flexivel-mes}  → each option
 *   {flexivel}                                        → cheapest option
 *   {fixo}                                            → plan without options
 *   {gabinete-2} … {gabinete-6}, {gabinete}           → per team size / cheapest
 *   {morada-fiscal}  {sinal}  {sinal-gabinete}
 */

export const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const euro = (n: number) =>
  `${Number.isInteger(n) ? n : n.toFixed(2).replace(".", ",")} €`;

export type TokenInfo = { token: string; value: string; label: string };

export function priceTokenList(c: SiteSections): TokenInfo[] {
  const out: TokenInfo[] = [];
  for (const p of c.plans.plans) {
    const base = slug(p.name);
    if (!base) continue;
    if (p.options.length) {
      for (const o of p.options) {
        const k = slug(o.label);
        if (k) out.push({ token: `${base}-${k}`, value: euro(o.price), label: `${p.name} — ${o.label}` });
      }
      const min = Math.min(...p.options.map((o) => o.price));
      out.push({ token: base, value: euro(min), label: `${p.name} (mais barato)` });
    } else {
      out.push({ token: base, value: euro(p.price), label: p.name });
    }
  }
  out.push({ token: "morada-fiscal", value: euro(c.fiscal.price), label: "Morada fiscal" });
  out.push({ token: "sinal", value: euro(c.form.sinalAmount), label: "Sinal (secretárias)" });
  out.push({ token: "sinal-gabinete", value: euro(c.form.sinalAmountOffice), label: "Sinal (gabinetes)" });
  return out;
}

export function priceTokens(c: SiteSections): Record<string, string> {
  return Object.fromEntries(priceTokenList(c).map((t) => [t.token, t.value]));
}

/** Replace {tokens} in every string inside `value` (deep). Unknown tokens are left as they are. */
export function applyTokens<T>(value: T, tokens: Record<string, string>): T {
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") return v.replace(/\{([a-z0-9-]+)\}/g, (m, k) => tokens[k] ?? m);
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      return Object.fromEntries(Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, walk(x)]));
    }
    return v;
  };
  return walk(value) as T;
}

/** The whole page content with price variables filled in. */
export function resolveSections(c: SiteSections): SiteSections {
  return applyTokens(c, priceTokens(c));
}
