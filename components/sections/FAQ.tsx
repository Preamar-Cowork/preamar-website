"use client";

import { useState } from "react";
import type { SiteSections } from "@/lib/content/schema";

export function FAQ({ content: c }: { content: SiteSections["faq"] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-[720px] mx-auto">
        <h2 className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-concrete mb-10 mt-0">
          {c.label}
        </h2>
        <div className="flex flex-col">
          {c.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-pm-line">
                <h3 className="m-0">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="w-full text-left flex justify-between items-center gap-6 py-7 cursor-pointer bg-transparent"
                  >
                    <span className="font-body font-bold text-xl md:text-2xl text-pm-ink">{item.q}</span>
                    <span aria-hidden="true" className="font-label text-pm-sky text-2xl leading-none">{isOpen ? "–" : "+"}</span>
                  </button>
                </h3>
                <div
                  id={`faq-${i}`}
                  role="region"
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
