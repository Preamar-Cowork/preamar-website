"use client";

export function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const selected = value === o;
        return (
          <button
            type="button"
            key={o}
            onClick={() => onChange(o)}
            className="font-label font-semibold text-[13px] tracking-[0.1em] uppercase px-4 py-2.5 transition-all"
            style={{
              border: selected ? "1px solid #84A6B2" : "1px solid #545759",
              background: selected ? "#84A6B2" : "transparent",
              color: selected ? "#3F4346" : "#F3F1EC",
            }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
