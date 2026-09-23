"use client";

/** Magazine-style section number, set in the margin. */
export function Folio({ n, dark = false }: { n: string; dark?: boolean }) {
  return (
    <div
      className={`font-label font-semibold text-[11px] tracking-[0.15em] mb-6 ${
        dark ? "text-white/40" : "text-pm-concrete"
      }`}
    >
      {n}
    </div>
  );
}
