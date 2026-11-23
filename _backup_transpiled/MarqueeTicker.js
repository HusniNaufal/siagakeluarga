import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useReducedMotion } from "motion/react";
const ITEMS = [
    { label: "Banjir", color: "#93C5FD" },
    { label: "Gempa", color: "#FCA5A5" },
    { label: "Longsor", color: "#A16207" },
    { label: "Cuaca Ekstrem", color: "#5EEAD4" },
    { label: "Tas Siaga", color: "#F5F5F4" },
    { label: "Titik Kumpul", color: "#F5F5F4" },
];
function Row() {
    return (_jsx("div", { className: "flex shrink-0 items-center gap-9 pr-9", children: ITEMS.map((item, i) => (_jsxs("span", { className: "flex items-center gap-9", children: [_jsx("span", { className: "text-lg font-medium", style: { color: item.color }, children: item.label }), _jsx("span", { className: "size-2 rotate-45 bg-accent-dark", "aria-hidden": true })] }, i))) }));
}
/** Ticker berjalan (dijeda kalau reduced-motion aktif). */
export function MarqueeTicker() {
    const reduce = useReducedMotion();
    return (_jsxs("div", { className: "overflow-hidden bg-[#0B2545] py-6", children: [_jsxs("div", { className: "flex w-max", style: reduce
                    ? undefined
                    : { animation: "siagakeluarga-marquee 28s linear infinite" }, children: [_jsx(Row, {}), _jsx(Row, {})] }), _jsx("style", { children: `
        @keyframes siagakeluarga-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      ` })] }));
}
