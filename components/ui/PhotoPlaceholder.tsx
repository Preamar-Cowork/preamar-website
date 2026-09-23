"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Stand-in for real photography. A slow, continuous duotone drift
 * (ardósia → azul-maré) with a grain overlay — reads as a considered
 * composition rather than a "photo coming soon" box. Swap for a real
 * <img>/<video> once the shoot exists; keep the aspect ratio.
 */
export function PhotoPlaceholder({
  caption,
  className = "",
  dark = false,
}: {
  caption?: string;
  className?: string;
  dark?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <figure className={className}>
      <div className="relative overflow-hidden w-full h-full">
        <motion.div
          className="absolute inset-0"
          style={{
            background: dark
              ? "linear-gradient(135deg, #2A2D2F 0%, #3F4346 45%, #4C6068 100%)"
              : "linear-gradient(135deg, #3F4346 0%, #5C6670 55%, #84A6B2 100%)",
          }}
          animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
          transition={reduce ? undefined : { duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="pm-grain" />
      </div>
      {caption && (
        <figcaption className="mt-3 font-body text-[13px] text-pm-concrete">{caption}</figcaption>
      )}
    </figure>
  );
}
