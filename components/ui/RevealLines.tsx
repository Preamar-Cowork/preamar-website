"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CSSProperties, ElementType, useMemo } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Short-heading reveal: each line masked behind overflow-hidden and swept
 * up into place, staggered — not a fade. Use for headings only (one string
 * per visual line); long paragraphs should use <Reveal> so they wrap
 * naturally on every screen size.
 *
 * The in-view trigger lives on the (unclipped) wrapper, not on the masked
 * spans: an element translated fully inside an overflow-hidden parent never
 * intersects the viewport, so a trigger on it would never fire.
 */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
  immediate = false,
  style,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  delay?: number;
  immediate?: boolean; // animate on mount (hero) instead of on scroll
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  // stable across renders (creating it inline would remount every render)
  const MotionTag = useMemo(() => motion.create(Tag as ElementType), [Tag]);

  if (reduce) {
    return (
      <Tag className={className} style={style}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  const trigger = immediate
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.2 } };

  return (
    <MotionTag className={className} style={style} {...trigger}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            variants={{
              hidden: { y: "110%" },
              show: { y: "0%", transition: { duration: 0.9, ease: EASE, delay: delay + i * 0.09 } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
