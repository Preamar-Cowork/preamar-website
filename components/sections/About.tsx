"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section className="bg-pm-bgAlt py-24 md:py-[120px] px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[600px] mx-auto text-left"
      >
        <div className="font-label font-bold text-xs tracking-[0.16em] uppercase text-pm-concrete mb-7">
          O QUE É PREAMAR
        </div>
        <p className="font-body text-2xl md:text-[28px] leading-relaxed text-pm-ink m-0">
          Preamar é a maré cheia — o ponto mais alto, quando a água chega ao máximo e fica parada
          uns minutos antes de virar. Acontece duas vezes por dia no estuário aqui ao lado. É a
          janela em que os barcos entram e saem. Pareceu-nos um bom nome para um sítio onde o
          trabalho tem finalmente condições.
        </p>
      </motion.div>
    </section>
  );
}
