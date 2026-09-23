import { LISBOA_PM } from "@/lib/tides/lisboaFcul";

/**
 * Próximas preia-mares no MONTIJO — dados reais.
 *
 * Base: previsões oficiais da FCUL para o Porto de Lisboa (TU), lidas do
 * site da FCUL e guardadas em cache 12h; se falhar, cópia local (2026–27).
 * Montijo é porto secundário de Lisboa. Correções da Tabela de Marés 2026
 * do Instituto Hidrográfico (Montijo, preia-mar):
 *   hora   −3 min (águas mortas) … −6 min (águas vivas)
 *   altura +0,06 m (águas mortas) … +0,11 m (águas vivas)
 * Interpolamos entre os dois extremos pela altura da preia-mar em Lisboa.
 */

import type { HighTide } from "@/lib/tideFormat";
export type { HighTide };

const FCUL_URL = (year: number) =>
  `https://webpages.ciencias.ulisboa.pt/~cmantunes/hidrografia/LisboaFCUL${year}.TXT`;

type Raw = { t: number; h: number }; // epoch ms (UTC), metres — Lisboa

function parseFculText(text: string): Raw[] {
  const out: Raw[] = [];
  const re = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s+([\d.]+)\s+Preia/;
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(re);
    if (!m) continue;
    out.push({
      t: Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]),
      h: parseFloat(m[6]),
    });
  }
  return out;
}

function parseBundled(year: number): Raw[] {
  const s = LISBOA_PM[year];
  if (!s) return [];
  return s.split(",").map((e) => ({
    t: Date.UTC(year, +e.slice(0, 2) - 1, +e.slice(2, 4), +e.slice(4, 6), +e.slice(6, 8)),
    h: +e.slice(8) / 100,
  }));
}

async function lisboaYear(year: number): Promise<Raw[]> {
  try {
    const res = await fetch(FCUL_URL(year), { next: { revalidate: 43200 } });
    if (res.ok) {
      const text = new TextDecoder("latin1").decode(await res.arrayBuffer());
      const parsed = parseFculText(text);
      if (parsed.length > 600) return parsed; // a full year has ~705
    }
  } catch {
    // network error — fall through to the bundled copy
  }
  return parseBundled(year);
}

const NEAP = 2.9; // m, preia-mar típica de águas mortas em Lisboa
const SPRING = 3.8; // m, preia-mar típica de águas vivas em Lisboa

export function toMontijo(p: Raw): HighTide {
  const k = Math.min(1, Math.max(0, (p.h - NEAP) / (SPRING - NEAP)));
  const dtMin = -3 - 3 * k;
  const dh = 0.06 + 0.05 * k;
  return {
    iso: new Date(p.t + dtMin * 60_000).toISOString(),
    heightM: Math.round((p.h + dh) * 100) / 100,
  };
}

/** Next `count` high waters in Montijo after `now` (a few extra so the client can roll over). */
export async function getUpcomingHighTides(now = new Date(), count = 6): Promise<HighTide[]> {
  const year = now.getUTCFullYear();
  let raws = await lisboaYear(year);
  if (now.getUTCMonth() === 11) raws = raws.concat(await lisboaYear(year + 1));
  return raws
    .map(toMontijo)
    .filter((t) => Date.parse(t.iso) > now.getTime() - 60_000)
    .slice(0, count);
}
