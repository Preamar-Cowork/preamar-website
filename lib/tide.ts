/**
 * PREAMAR "next tide" display — a decorative countdown-style readout on the
 * hero, echoing the estuary theme. Not a real tide table; a fixed-period
 * approximation anchored to a reference timestamp.
 */
export function nextTideLabel(now: number = Date.now()): string {
  const anchor = new Date("2024-01-01T03:10:00Z").getTime();
  const periodMin = 745.2; // ~ average semi-diurnal + lunar drift, decorative
  const minsSince = (now - anchor) / 60000;
  const rem = minsSince % periodMin;
  const nextInMin = periodMin - rem;
  const nextDate = new Date(now + nextInMin * 60000);
  const hh = String(nextDate.getHours()).padStart(2, "0");
  const mm = String(nextDate.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
