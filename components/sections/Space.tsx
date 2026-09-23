"use client";

const AMENITIES = [
  "Secretárias fixas e flexíveis",
  "Gabinetes privados",
  "Sala de reuniões",
  "Cabine insonorizada para chamadas",
  "Copa",
  "Cacifos",
  "Morada fiscal",
  "Internet dedicada",
  "Muita luz natural",
  "Estacionamento fácil",
];

export function Space() {
  return (
    <section className="bg-pm-ink">
      <div className="grid grid-cols-1 md:grid-cols-[60%_40%]">
        <div className="h-[420px] md:h-[640px] flex items-center justify-center p-6 text-center bg-[repeating-linear-gradient(45deg,#363A3D_0,#363A3D_2px,transparent_2px,transparent_12px)]">
          <span className="font-mono text-xs text-pm-concrete">
            // fotografia: interior, luz natural, secretárias
          </span>
        </div>
        <div className="py-16 px-8 md:px-12 flex flex-col justify-center">
          <div className="font-label font-bold text-xs tracking-[0.16em] uppercase text-pm-sky mb-5">
            O ESPAÇO
          </div>
          <p className="text-pm-bg text-lg leading-relaxed max-w-[420px] mb-10">
            Um espaço no Montijo pensado para trabalhar bem: luz natural em todas as salas, e a
            maré do estuário a dois passos da porta.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {AMENITIES.map((a) => (
              <div
                key={a}
                className="flex items-baseline gap-2.5 py-2.5 border-t border-white/15 text-[15px] text-pm-bg"
              >
                <span className="text-pm-sky">—</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
