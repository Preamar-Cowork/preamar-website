"use client";

import { motion, animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Folio } from "@/components/ui/Folio";
import type { SiteSections } from "@/lib/content/schema";

function Price({ target }: { target: number }) {
  // counts up when the price scrolls into view (not on page load)
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? target : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, target, {
      duration: 1.3,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, target]);
  return <span ref={ref}>{value}</span>;
}

export function Plans({ content: c, n }: { content: SiteSections["plans"]; n: string }) {
  return (
    <section className="bg-pm-bg py-32 md:py-[180px] px-6">
      <div className="max-w-[1180px] mx-auto">
        <Folio n={n} />
        <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-concrete mb-16">
          {c.label}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-pm-line"
        >
          {c.plans.map((p, i) => (
            <div
              key={i}
              className="px-6 md:px-12 py-12 md:py-16"
              style={{ background: p.highlight ? "#EAE7DF" : "transparent" }}
            >
              <div
                className="font-label font-bold text-[13px] tracking-[0.15em] uppercase mb-8"
                style={{ color: p.highlight ? "#84A6B2" : "#7B8083" }}
              >
                {p.name}
              </div>
              <div className="font-display text-[56px] leading-none text-pm-ink mb-3">
                {p.prefix}
                <Price target={p.price} />
                &nbsp;€
              </div>
              <div className="font-label text-[11px] tracking-[0.08em] uppercase text-pm-concrete mb-8">
                {c.unit}
              </div>
              <p className="text-[15px] text-pm-graphite leading-relaxed m-0 max-w-[26ch]">{p.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
