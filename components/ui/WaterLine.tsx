"use client";

import { useReducedMotion } from "framer-motion";

/**
 * A soft "water line": two thin sine waves drifting at different speeds.
 * Each path is several periods wider than any screen and slides left by
 * exactly one period per loop, so the motion is seamless.
 */
function wavePath(period: number, amp: number, width: number, mid: number) {
  let d = `M0 ${mid} Q${period / 4} ${mid - amp} ${period / 2} ${mid}`;
  for (let x = period / 2; x < width; x += period / 2) d += ` T${x + period / 2} ${mid}`;
  return d;
}

const W = 3200; // wider than any viewport + one period

export function WaterLine({ color, className = "" }: { color: string; className?: string }) {
  const reduce = useReducedMotion();
  const h = 18;
  const mid = h / 2;
  const waves = [
    { period: 240, amp: 4.5, dur: 10, opacity: 0.75, width: 1.1 },
    { period: 380, amp: 3, dur: 16, opacity: 0.35, width: 1, reverse: true },
  ];
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height: h }} aria-hidden="true">
      {waves.map((w, i) => (
        <svg
          key={i}
          width={W}
          height={h}
          className="absolute left-0 top-0"
          style={
            reduce
              ? undefined
              : {
                  animation: `pm-wave-${i} ${w.dur}s linear infinite${w.reverse ? " reverse" : ""}`,
                }
          }
        >
          <path d={wavePath(w.period, w.amp, W, mid)} fill="none" stroke={color} strokeOpacity={w.opacity} strokeWidth={w.width} />
        </svg>
      ))}
      <style>{waves
        .map((w, i) => `@keyframes pm-wave-${i}{from{transform:translateX(0)}to{transform:translateX(-${w.period}px)}}`)
        .join("")}</style>
    </div>
  );
}
