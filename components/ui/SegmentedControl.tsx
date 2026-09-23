"use client";

const EASE = "cubic-bezier(.16,1,.3,1)";

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  const idx = value ? options.indexOf(value) : -1;
  const n = options.length;

  return (
    <div className="relative flex border border-[#545759] p-1 gap-1">
      <div
        className="absolute top-1 bottom-1 bg-pm-sky transition-all duration-[400ms]"
        style={{
          left: idx >= 0 ? `calc(${(idx * 100) / n}% + 4px)` : "4px",
          width: `calc(${100 / n}% - 8px)`,
          opacity: idx >= 0 ? 1 : 0,
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
            style={{ color: idx === i ? "#3F4346" : "#F3F1EC" }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
