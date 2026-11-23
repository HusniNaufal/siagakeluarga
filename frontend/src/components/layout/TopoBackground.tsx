import { cn } from "@/lib/utils";

interface TopoBackgroundProps {
  variant?: "warm" | "light" | "dark";
  className?: string;
  opacity?: number;
}

/**
 * Latar kontur topografi khas SiagaKeluarga (Terrain Relief + Topographic Contours BG + Elevation Ridge).
 */
export function TopoBackground({ variant = "light", className, opacity }: TopoBackgroundProps) {
  const src =
    variant === "dark"
      ? "/images/topo-dark.svg"
      : variant === "warm"
        ? "/images/topo-warm.svg"
        : "/images/topo-light.svg";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none",
        className,
      )}
      style={opacity !== undefined ? { opacity } : undefined}
    >
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}
