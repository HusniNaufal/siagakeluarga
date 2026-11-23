import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
/**
 * Latar kontur topografi khas SiagaKeluarga (sesuai siagakeluarga.fig:
 * Terrain Relief + Topographic Contours BG + Elevation Ridge Accent).
 */
export function TopoBackground({ variant = "warm", className }) {
    const src = variant === "dark"
        ? "/images/topo-dark.svg"
        : variant === "light"
            ? "/images/topo-light.svg"
            : "/images/topo-warm.svg";
    return (_jsx("div", { "aria-hidden": "true", className: cn("pointer-events-none absolute inset-0 overflow-hidden select-none", className), children: _jsx("img", { src: src, alt: "", className: "h-full w-full object-cover object-center opacity-100" }) }));
}
