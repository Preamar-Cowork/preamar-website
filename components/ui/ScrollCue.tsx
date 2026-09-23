"use client";

import { useReducedMotion } from "framer-motion";

/** Double chevron (») pointing down, gently bobbing. Scrolls one screen on click. */
export function ScrollCue({ color, onClick }: { color: string; onClick?: () => void }) {
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Descer"
      className="block mx-auto p-2 bg-transparent cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
      style={{ color }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 22 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={reduce ? undefined : { animation: "pm-cue 2.4s ease-in-out infinite" }}
      >
        <path d="M5 4.5 L11 10 L17 4.5" />
        <path d="M5 11.5 L11 17 L17 11.5" opacity="0.55" />
      </svg>
      <style>{`@keyframes pm-cue{0%,100%{transform:translateY(-2px)}50%{transform:translateY(5px)}}`}</style>
    </button>
  );
}
