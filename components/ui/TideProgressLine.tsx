"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * The throughline: a thin vertical line pinned to the left edge that
 * fills with scroll progress, like a tide rising over the whole page.
 * Purely structural — hidden on small screens where it would just be
 * noise next to the content edge.
 */
export function TideProgressLine() {
  const { scrollYProgress } = useScroll();
  const height = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.3 });

  return (
    <div className="hidden md:block fixed left-0 top-0 bottom-0 w-px z-40 bg-pm-line/60">
      <motion.div
        className="absolute top-0 left-0 w-full bg-pm-sky origin-top"
        style={{ height: "100%", scaleY: height }}
      />
    </div>
  );
}
