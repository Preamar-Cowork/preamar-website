"use client";

/**
 * PREAMAR mark — the "marégrafo" (tide gauge): 5 horizontal strokes,
 * the top one thicker and always sky-blue (#84A6B2), the rest a solid
 * color that adapts to light/dark backgrounds.
 */
const RATIOS = [1, 0.6, 0.85, 0.45, 0.75];

export function Symbol({
  baseWidth = 20,
  topColor = "#84A6B2",
  restColor = "#3F4346",
  className = "",
}: {
  baseWidth?: number;
  topColor?: string;
  restColor?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-end gap-[6px] ${className}`}>
      {RATIOS.map((r, i) => (
        <div
          key={i}
          style={{
            width: Math.round(baseWidth * r),
            height: i === 0 ? Math.max(3, Math.round(baseWidth * 0.11)) : Math.max(1.5, Math.round(baseWidth * 0.055)),
            background: i === 0 ? topColor : restColor,
          }}
        />
      ))}
    </div>
  );
}
