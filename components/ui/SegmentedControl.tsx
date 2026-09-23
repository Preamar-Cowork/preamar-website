"use client";

const EASE = "cubic-bezier(.22,1,.36,1)";

export function SegmentedControl({
  options,
  value,
  onChange,
  light = false,
}: {
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
  light?: boolean;
}) {
  const idx = value ? options.indexOf(value) : -1;
  const n = options.length;
  const borderColor = light ? "#DAD5CB" : "#545759";
  const pillColor = light ? "#3F4346" : "#84A6B2";

  return (
    <div className="relative flex border p-1 gap-1" style={{ borderColor }}>
      <div
        className="absolute top-1 bottom-1 transition-all duration-[400ms]"
        style={{
          left: idx >= 0 ? `calc(${(idx * 100) / n}% + 4px)` : "4px",
          width: `calc(${100 / n}% - 8px)`,
          opacity: idx >= 0 ? 1 : 0,
          background: pillColor,
          transitionTimingFunction: EASE,
        }}
      />
      {options.map((label, i) => (
        <div
          key={label}
          onClick={() => onChange(label)}
          className="relative z-[2] flex-1 text-center py-2.5 px-2 cursor-pointer"
        >
          <span
            className="font-label font-bold text-[13px] tracking-[0.08em] uppercase"
            style={{
              color: idx === i ? (light ? "#F3F1EC" : "#3F4346") : light ? "#3F4346" : "#F3F1EC",
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
