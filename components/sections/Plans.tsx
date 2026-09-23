"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Folio } from "@/components/ui/Folio";

const PLANS = [
  { name: "FLEXÍVEL", target: 80, prefix: "", desc: "Secretária livre, horário de escritório.", highlight: false },
  { name: "FIXO", target: 130, prefix: "", desc: "A tua secretária, sempre a mesma. Acesso alargado, cacifo incluído.", highlight: true },
  { name: "GABINETE", target: 600, prefix: "desde ", desc: "Sala privada para 3 a 6 pessoas, com morada fiscal incluída.", highlight: false },
];

function Price({ target }: { target: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration: 1.3,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [target]);
  return <>{value}</>;
}

export function Plans() {
  return (
    <section className="bg-pm-bg py-32 md:py-[180px] px-6">
      <div className="max-w-[1180px] mx-auto">
        <Folio n="04" />
        <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-concrete mb-16">
          PLANOS
        </div>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-pm-line"
        >
          {PLANS.map((p) => (
            <div
              key={p.name}
              className="px-0 md:px-12 py-12 md:py-16"
              style={{ background: p.highlight ? "#EAE7DF" : "transparent" }}
            >
              <div
                className="font-label font-bold text-[13px] tracking-[0.15em] mb-8"
                style={{ color: p.highlight ? "#84A6B2" : "#7B8083" }}
              >
                {p.name}
              </div>
              <div className="font-display text-[56px] leading-none text-pm-ink mb-3">
                {p.prefix}
                <Price target={p.target} />
                &nbsp;€
              </div>
              <div className="font-label text-[11px] tracking-[0.08em] uppercase text-pm-concrete mb-8">
                /mês + IVA
              </div>
              <p className="text-[15px] text-pm-graphite leading-relaxed m-0 max-w-[26ch]">{p.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
