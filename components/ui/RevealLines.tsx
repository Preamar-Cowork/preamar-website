"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ElementType } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Heading reveal: each line masked behind overflow-hidden and swept up
 * into place, staggered — not a fade. Pass one string per visual line.
 */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={reduce ? undefined : { y: "110%" }}
            whileInView={reduce ? undefined : { y: "0%" }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
