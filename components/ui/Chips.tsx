"use client";

export function Chips({
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
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const selected = value === o;
        const border = light ? (selected ? "#3F4346" : "#DAD5CB") : selected ? "#84A6B2" : "#545759";
        const bg = light ? (selected ? "#3F4346" : "transparent") : selected ? "#84A6B2" : "transparent";
        const color = light ? (selected ? "#F3F1EC" : "#3F4346") : selected ? "#3F4346" : "#F3F1EC";
        return (
          <button
            type="button"
            key={o}
            onClick={() => onChange(o)}
            className="font-label font-semibold text-[13px] tracking-[0.1em] uppercase px-4 py-2.5 transition-all"
            style={{ border: `1px solid ${border}`, background: bg, color }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
