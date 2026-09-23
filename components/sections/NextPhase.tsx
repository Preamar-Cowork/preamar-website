"use client";

export function NextPhase() {
  return (
    <section className="bg-pm-bgAlt py-24 md:py-[120px] px-6">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-[65%_35%] gap-12 items-center">
        <div>
          <div className="font-label font-bold text-xs tracking-[0.16em] uppercase text-pm-concrete mb-6">
            O QUE VEM A SEGUIR
          </div>
          <p className="font-body text-2xl md:text-[26px] leading-relaxed text-pm-ink max-w-[560px] m-0">
            Este é o primeiro espaço, não o único. O plano é crescer para um edifício maior, com
            salas de conferência e estúdios de gravação. Quem entra agora entra no início.
          </p>
        </div>
        <div className="min-h-[220px] border border-pm-line flex items-center justify-center p-4 text-center bg-[repeating-linear-gradient(135deg,#DAD5CB_0,#DAD5CB_2px,transparent_2px,transparent_11px)]">
          <span className="font-mono text-[10px] text-pm-concrete">// render, fase 2</span>
        </div>
      </div>
    </section>
  );
}
