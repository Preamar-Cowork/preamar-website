"use client";

import { useState } from "react";
import { Folio } from "@/components/ui/Folio";
import type { SiteSections } from "@/lib/content/schema";

export function FAQ({ content: c, n }: { content: SiteSections["faq"]; n: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-32 md:py-[180px] px-6">
      <div className="max-w-[720px] mx-auto">
        <Folio n={n} />
        <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-concrete mb-10">
          {c.label}
        </div>
        <div className="flex flex-col">
          {c.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-pm-line">
                <div
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex justify-between items-center gap-6 py-7 cursor-pointer"
                >
                  <span className="font-body font-bold text-xl md:text-2xl text-pm-ink">{item.q}</span>
                  <span className="font-label text-pm-sky text-2xl leading-none">{isOpen ? "–" : "+"}</span>
                </div>
                <div
                  className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(.22,1,.36,1)] text-pm-graphite text-base leading-relaxed max-w-[62ch]"
                  style={{ maxHeight: isOpen ? 600 : 0, paddingBottom: isOpen ? 24 : 0 }}
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
