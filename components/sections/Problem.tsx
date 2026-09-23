"use client";

import { motion } from "framer-motion";
import { RevealLines } from "@/components/ui/RevealLines";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Folio } from "@/components/ui/Folio";

const BLOCKS = [
  {
    num: "1",
    title: ["A casa não é", "um escritório."],
    text: "Trabalhas ao lado do berço, com a máquina de lavar a três metros.",
    caption: "escritório improvisado em casa",
    offset: 0,
  },
  {
    num: "2",
    title: ["A ponte come-te", "duas horas por dia."],
    text: "E o teu trabalho podia ser feito a dez minutos de casa.",
    caption: "trânsito na ponte, hora de ponta",
    offset: 96,
  },
  {
    num: "3",
    title: ["Receber um cliente", "na cozinha não é", "receber um cliente."],
    text: "",
    caption: "reunião improvisada",
    offset: 32,
  },
];

export function Problem() {
  return (
    <section className="max-w-[1320px] mx-auto py-32 md:py-[180px] px-6 md:px-12">
      <Folio n="02" />
      <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-concrete mb-20">
        O PROBLEMA
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {BLOCKS.map((b, i) => (
          <motion.div
            key={b.num}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
            style={{ marginTop: b.offset }}
          >
            <div className="font-label font-bold text-[clamp(88px,10vw,150px)] leading-[0.8] text-pm-line mb-4 select-none">
              {b.num}
            </div>
            <RevealLines
              as="div"
              lines={b.title}
              className="font-body font-bold text-2xl md:text-[26px] leading-[1.15] mb-4 text-pm-ink"
            />
            {b.text && <p className="text-pm-graphite text-base leading-relaxed mb-6 max-w-[38ch]">{b.text}</p>}
            <PhotoPlaceholder caption={b.caption} className="h-[190px]" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
