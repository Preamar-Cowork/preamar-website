"use client";

import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const PLANS = [
  { name: "FLEXÍVEL", target: 95, prefix: "", desc: "Secretária livre, horário de escritório.", accent: false },
  { name: "FIXO", target: 150, prefix: "", desc: "A tua secretária, sempre a mesma. Acesso alargado, cacifo incluído.", accent: true },
  { name: "GABINETE", target: 400, prefix: "desde ", desc: "Sala privada para 2 a 6 pessoas, com morada fiscal incluída.", accent: false },
];

function Price({ target }: { target: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [target]);
  return <>{value}</>;
}

export function Plans() {
  return (
    <section className="bg-pm-bgAlt py-24 md:py-[120px] px-6">
      <div className="max-w-[1080px] mx-auto">
        <div className="font-label font-bold text-xs tracking-[0.16em] uppercase text-pm-concrete mb-14">
          PLANOS
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-pm-line"
        >
          {PLANS.map((p) => (
            <div key={p.name} className="px-0 md:px-10 py-8 md:py-0 first:pl-0">
              <div
                className="font-label font-bold text-[13px] tracking-[0.14em] mb-6"
                style={{ color: p.accent ? "#84A6B2" : "#7B8083" }}
              >
                {p.name}
              </div>
              <div className="font-display text-4xl md:text-[42px] text-pm-ink mb-2">
                {p.prefix}
                <Price target={p.target} />
                &nbsp;€
              </div>
              <div className="font-label text-xs tracking-[0.08em] uppercase text-pm-concrete mb-6">
                /mês, IVA incl.
              </div>
              <p className="text-[15px] text-pm-graphite leading-relaxed m-0">{p.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
