import { cn } from "@/lib/utils";

interface TopoBackgroundProps {
  variant?: "warm" | "light" | "dark";
  className?: string;
}

/**
 * Latar kontur topografi khas SiagaKeluarga (sesuai siagakeluarga.fig:
 * Terrain Relief + Topographic Contours BG + Elevation Ridge Accent).
 */
export function TopoBackground({ variant = "warm", className }: TopoBackgroundProps) {
  const src =
    variant === "dark"
      ? "/images/topo-dark.svg"
      : variant === "light"
        ? "/images/topo-light.svg"
        : "/images/topo-warm.svg";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none",
        className,
      )}
    >
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover object-center opacity-100"
      />
    </div>
  );
}
