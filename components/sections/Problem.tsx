"use client";

import { motion } from "framer-motion";

const BLOCKS = [
  {
    num: "1",
    title: "A casa não é um escritório.",
    text: "Trabalhas ao lado do berço, com a máquina de lavar a três metros.",
    photo: "// fotografia: escritório improvisado em casa",
    offset: 0,
  },
  {
    num: "2",
    title: "A ponte come-te duas horas por dia.",
    text: "E o teu trabalho podia ser feito a dez minutos de casa.",
    photo: "// fotografia: trânsito na ponte, hora de ponta",
    offset: 48,
  },
  {
    num: "3",
    title: "Receber um cliente na cozinha não é receber um cliente.",
    text: "",
    photo: "// fotografia: reunião improvisada",
    offset: 16,
  },
];

export function Problem() {
  return (
    <section className="max-w-[1240px] mx-auto py-24 md:py-[120px] px-6">
      <div className="font-label font-bold text-xs tracking-[0.16em] uppercase text-pm-concrete mb-14">
        O PROBLEMA
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {BLOCKS.map((b, i) => (
          <motion.div
            key={b.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.14 }}
            style={{ marginTop: b.offset }}
          >
            <div className="font-label font-bold text-7xl md:text-8xl leading-none text-pm-line mb-2">
              {b.num}
            </div>
            <div className="font-body font-bold text-xl leading-snug mb-3.5 text-pm-ink">
              {b.title}
            </div>
            {b.text && <p className="text-pm-graphite text-base leading-relaxed mb-5">{b.text}</p>}
            <div className="h-[150px] border border-pm-line flex items-center justify-center p-3 text-center bg-[repeating-linear-gradient(135deg,#EAE7DF_0,#EAE7DF_2px,transparent_2px,transparent_11px)]">
              <span className="font-mono text-[10px] text-pm-concrete">{b.photo}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
