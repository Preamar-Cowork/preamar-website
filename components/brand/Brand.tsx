import type { CSSProperties } from "react";

/*
 * PREAMAR brand marks, drawn from the official lockup SVG
 * (00_Resources/Preamar/Logos) but rendered in HTML so the wordmark uses the
 * real Libre Caslon Display webfont — the SVG files set it as live <text>,
 * which an <img> can't load fonts for (it falls back to Georgia).
 */

const INK = "#3F4346";
const SKY = "#84A6B2";

/** The marégrafo: five bars, the top one thicker and always azul-maré. */
export function BrandSymbol({
  color = INK,
  className = "",
  style,
}: {
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  // geometry copied 1:1 from lockup-preamar-*.svg (viewBox cropped to the symbol)
  return (
    <svg viewBox="26 68 34 55" className={className} style={style} aria-hidden="true">
      <rect x="26" y="68" width="34" height="7" fill={SKY} />
      <rect x="41" y="83" width="19" height="4" fill={color} />
      <rect x="26" y="95" width="34" height="4" fill={color} />
      <rect x="41" y="107" width="19" height="4" fill={color} />
      <rect x="26" y="119" width="34" height="4" fill={color} />
    </svg>
  );
}

/** Wordmark only — "PREAMAR" in Libre Caslon Display, brand letter-spacing. */
export function Wordmark({
  color = INK,
  className = "",
  style,
  as: Tag = "span",
}: {
  color?: string;
  className?: string;
  style?: CSSProperties;
  as?: "span" | "div" | "h1" | "p";
}) {
  return (
    <Tag
      className={`font-display uppercase leading-none whitespace-nowrap ${className}`}
      style={{ letterSpacing: "0.048em", color, ...style }}
    >
      PREAMAR
    </Tag>
  );
}

/**
 * Symbol + wordmark, proportions of the official lockup. Size it with
 * `size` (the wordmark's font size in px).
 */
export function Lockup({
  size = 20,
  color = INK,
  className = "",
  label = true,
}: {
  size?: number;
  color?: string;
  className?: string;
  label?: boolean; // aria-label on the group
}) {
  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ fontSize: size, gap: "0.5em" }}
      role={label ? "img" : undefined}
      aria-label={label ? "PREAMAR" : undefined}
    >
      <BrandSymbol color={color} style={{ height: "0.72em", width: "auto", transform: "translateY(-0.05em)" }} />
      <Wordmark color={color} />
    </span>
  );
}
