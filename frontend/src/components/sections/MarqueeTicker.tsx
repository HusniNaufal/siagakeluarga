import { useReducedMotion } from "motion/react";

const ITEMS = [
  { label: "Banjir", color: "#93C5FD" },
  { label: "Gempa", color: "#FCA5A5" },
  { label: "Longsor", color: "#A16207" },
  { label: "Cuaca Ekstrem", color: "#5EEAD4" },
  { label: "Tas Siaga", color: "#F1F5F9" },
  { label: "Titik Kumpul", color: "#F1F5F9" },
];

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-9 pr-9">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center gap-9">
          <span className="text-lg font-medium" style={{ color: item.color }}>
            {item.label}
          </span>
          <span className="size-2 rotate-45 bg-accent-dark" aria-hidden />
        </span>
      ))}
    </div>
  );
}

/** Ticker berjalan (dijeda kalau reduced-motion aktif). */
export function MarqueeTicker() {
  const reduce = useReducedMotion();

  return (
    <div className="overflow-hidden bg-[#0B2545] py-6">
      <div
        className="flex w-max"
        style={
          reduce
            ? undefined
            : { animation: "siagakeluarga-marquee 28s linear infinite" }
        }
      >
        <Row />
        <Row />
      </div>
      <style>{`
        @keyframes siagakeluarga-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
