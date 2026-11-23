import { CircleCheck, Clock3, OctagonAlert } from "lucide-react";
import { waktuRelatif, type KabarItem } from "@/hooks/useKabar";
import { cn } from "@/lib/utils";

/** Satu baris status kabar: selalu ikon + teks, tidak hanya warna. */
export function KabarStatus({ kabar, className }: { kabar: KabarItem | null; className?: string }) {
  if (!kabar) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-[15px] text-muted", className)}>
        <Clock3 className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
        Belum ada kabar
      </span>
    );
  }
  const aman = kabar.status === "AMAN";
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[15px]", className)}>
      {aman ? (
        <CircleCheck className="size-[18px] text-aman" strokeWidth={2} aria-hidden="true" />
      ) : (
        <OctagonAlert className="size-[18px] text-bahaya" strokeWidth={2} aria-hidden="true" />
      )}
      <span className={cn("font-semibold", aman ? "text-aman" : "text-bahaya")}>{aman ? "Aman" : "Butuh bantuan"}</span>
      <span className="text-muted">{waktuRelatif(kabar.waktu)}</span>
    </span>
  );
}

export function petaHref(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
