import { cn } from "@/lib/utils";

export type TingkatStatus = "aman" | "waspada" | "bahaya";

const URUTAN: TingkatStatus[] = ["aman", "waspada", "bahaya"];
const LABEL_BAWAAN: [string, string, string] = ["Aman", "Waspada", "Bahaya"];

const WARNA = {
  aman: { terang: "bg-[#12805c]", gelap: "bg-[#34d399]", teksT: "text-[#12805c]", teksG: "text-[#6ee7b7]" },
  waspada: { terang: "bg-[#b45309]", gelap: "bg-[#fbbf24]", teksT: "text-[#b45309]", teksG: "text-[#fcd34d]" },
  bahaya: { terang: "bg-[#c81e1e]", gelap: "bg-[#f87171]", teksT: "text-[#c81e1e]", teksG: "text-[#fca5a5]" },
} as const;

/**
 * Penanda status berupa skala tiga tingkat, bukan kapsul. Batang terisi sampai tingkat saat ini,
 * dan nama tiap tingkat tetap tertulis, jadi posisi dan teks yang menyampaikan status, bukan warna saja.
 */
export function StatusMark({
  tingkat,
  labels = LABEL_BAWAAN,
  tone = "terang",
  className,
}: {
  tingkat: TingkatStatus;
  /** Nama tiga tingkat, mis. ["Rendah", "Sedang", "Tinggi"] untuk risiko wilayah. */
  labels?: [string, string, string];
  /** "gelap" dipakai di atas latar gelap. */
  tone?: "terang" | "gelap";
  className?: string;
}) {
  const aktif = URUTAN.indexOf(tingkat);
  const gelap = tone === "gelap";
  const w = WARNA[tingkat];

  return (
    <div
      role="img"
      aria-label={`Status ${labels[aktif]}, dari ${labels.join(", ")}`}
      className={cn("w-full max-w-[230px]", className)}
    >
      <div className="grid grid-cols-3 gap-1.5" aria-hidden="true">
        {URUTAN.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-[5px] rounded-full",
              i <= aktif ? (gelap ? w.gelap : w.terang) : gelap ? "bg-white/15" : "bg-line",
            )}
          />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5 text-[13px] leading-none" aria-hidden="true">
        {labels.map((nama, i) => (
          <span
            key={nama}
            className={cn(
              i === aktif
                ? cn("font-semibold", gelap ? w.teksG : w.teksT)
                : gelap
                  ? "text-white/45"
                  : "text-muted",
            )}
          >
            {nama}
          </span>
        ))}
      </div>
    </div>
  );
}
