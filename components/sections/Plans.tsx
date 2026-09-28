"use client";

import { motion, animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Folio } from "@/components/ui/Folio";
import type { SiteSections } from "@/lib/content/schema";

const EASE = [0.22, 1, 0.36, 1] as const;
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ","));

/** Counts up the first time it scrolls into view, then glides between values. */
function Price({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? target : 0);
  const current = useRef(reduce ? target : 0);
  useEffect(() => {
    if (reduce) {
      setValue(target);
      return;
    }
    if (!inView) return;
    const controls = animate(current.current, target, {
      duration: current.current === 0 ? 1.3 : 0.5,
      ease: EASE,
      onUpdate: (v) => {
        current.current = v;
        setValue(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, target]);
  return <span ref={ref}>{value}</span>;
}

type Plan = SiteSections["plans"]["plans"][number];

function PlanCard({
  p,
  i,
  unit,
  features,
}: {
  p: Plan;
  i: number;
  unit: string;
  features: SiteSections["plans"]["features"];
}) {
  const hasOptions = p.options.length > 0;
  const [sel, setSel] = useState(Math.min(Math.max(0, p.defaultOption - 1), Math.max(0, p.options.length - 1)));
  const opt = hasOptions ? p.options[Math.min(sel, p.options.length - 1)] : null;
  const price = opt ? opt.price : p.price;
  const perPerson = opt && opt.people > 0 ? opt.price / opt.people : null;
  const key = (["p1", "p2", "p3"] as const)[i] ?? "p1";

  return (
    // subgrid: name / desc / options / price / features / note line up across the three cards
    <div
      className="md:row-span-6 grid md:grid-rows-subgrid px-6 md:px-10 py-10 md:py-12 gap-y-0"
      style={{ background: p.highlight ? "#EAE7DF" : "transparent" }}
    >
      <div
        className="font-label font-bold text-[13px] tracking-[0.15em] uppercase mb-4"
        style={{ color: p.highlight ? "#84A6B2" : "#7B8083" }}
      >
        {p.name}
      </div>

      <p className="text-[15px] text-pm-graphite leading-relaxed m-0 mb-6 max-w-[30ch]">{p.desc}</p>

      <div className="mb-5 min-h-0">
        {hasOptions && (
          <div>
            {p.optionsLabel && (
              <div className="font-label font-semibold text-[10px] tracking-[0.14em] uppercase text-pm-concrete mb-2">
                {p.optionsLabel}
              </div>
            )}
            <div className="inline-flex border border-pm-line p-[3px] gap-[3px]" role="radiogroup" aria-label={p.optionsLabel || p.name}>
              {p.options.map((o, j) => {
                const active = j === sel;
                return (
                  <button
                    key={j}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSel(j)}
                    className={`min-w-[40px] px-3 py-1.5 font-label font-bold text-[12px] tracking-[0.08em] uppercase transition-colors ${
                      active ? "bg-pm-ink text-pm-bg" : "text-pm-ink hover:bg-pm-line/60"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="font-display text-[52px] md:text-[56px] leading-none text-pm-ink mb-3 whitespace-nowrap">
          {!hasOptions && p.prefix}
          <Price target={price} />
          &nbsp;€
        </div>
        <div className="font-label text-[11px] tracking-[0.08em] uppercase text-pm-concrete">
          {opt ? opt.unit : unit}
        </div>
        {(opt?.detail || perPerson) && (
          <div className="text-[14px] text-pm-graphite mt-2">
            {opt?.detail}
            {opt?.detail && perPerson ? " · " : ""}
            {perPerson !== null && (
              <>
                <span className="text-pm-ink">{fmt(Math.round(perPerson * 100) / 100)} €</span> por pessoa
              </>
            )}
          </div>
        )}
      </div>

      <ul className="m-0 p-0 list-none border-t border-pm-line">
        {features.map((f, j) => {
          const on = f[key];
          return (
            <li
              key={j}
              className={`flex items-baseline gap-3 py-2.5 border-b border-pm-line/70 text-[14px] leading-snug ${
                on ? "text-pm-ink" : "text-pm-concrete/60"
              }`}
            >
              <span
                aria-hidden="true"
                className={`w-3 shrink-0 font-label font-bold ${on ? "text-pm-sky" : "text-pm-concrete/50"}`}
              >
                {on ? "✓" : "—"}
              </span>
              <span>
                <span className="sr-only">{on ? "Incluído: " : "Não incluído: "}</span>
                {f.label}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="text-[13px] text-pm-concrete mt-4">{p.note}</div>
    </div>
  );
}

export function Plans({ content: c, n }: { content: SiteSections["plans"]; n: string }) {
  return (
    <section className="bg-pm-bg py-20 md:py-28 px-6">
      <div className="max-w-[1180px] mx-auto">
        <Folio n={n} />
        <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-concrete mb-12">
          {c.label}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_auto_auto_auto_auto_auto] divide-y md:divide-y-0 md:divide-x divide-pm-line"
        >
          {c.plans.map((p, i) => (
            <PlanCard key={`${i}-${p.defaultOption}-${p.options.length}`} p={p} i={i} unit={c.unit} features={c.features} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
