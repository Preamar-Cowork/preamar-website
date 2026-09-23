// Client-safe tide helpers (no data tables here).
export type HighTide = { iso: string; heightM: number };

/** "14:32" in Portuguese local time (handles summer/winter time). */
export function formatLisbonTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Europe/Lisbon",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}
