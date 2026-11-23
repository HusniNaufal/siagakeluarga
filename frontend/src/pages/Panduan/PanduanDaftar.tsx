import { useState } from "react";
import { GrafisRumah } from "@/components/ui/Grafis";
import { Link } from "react-router-dom";
import { GUIDES, FASE_LABEL, type Fase } from "@/content/panduan";
import type { JenisBencana } from "@/lib/types";

type FilterValue = "SEMUA" | JenisBencana;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "SEMUA", label: "Semua" },
  { value: "BANJIR", label: "Banjir" },
  { value: "GEMPA", label: "Gempa" },
  { value: "LONGSOR", label: "Longsor" },
  { value: "CUACA_EKSTREM", label: "Cuaca ekstrem" },
  { value: "TSUNAMI", label: "Tsunami" },
];

const FASES: Fase[] = ["sebelum", "saat", "sesudah"];

export function PanduanDaftar() {
  const [filter, setFilter] = useState<FilterValue>("SEMUA");

  const cards = GUIDES.filter(
    (g) => filter === "SEMUA" || g.jenis === filter,
  ).flatMap((guide) => FASES.map((fase) => ({ guide, fase })));

  return (
    <div>
      <section className="relative overflow-hidden bg-paper px-5 pt-32 pb-10 md:px-8">
        <GrafisRumah className="absolute top-20 right-12 hidden w-[340px] lg:block" />
        <div className="mx-auto max-w-[1240px]">
          <h1 className="max-w-[16ch] text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] text-ink md:text-[56px]">
            Panduan bencana
          </h1>
          <p className="mt-4 max-w-[54ch] text-[18px] leading-[1.6] text-ink-3">
            Langkah untuk sebelum, saat, dan sesudah bencana. Pilih jenisnya, lalu baca langkahnya satu per satu.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5" role="group" aria-label="Jenis bencana">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={filter === f.value}
                className={`h-11 rounded-full px-5 text-[15px] transition-colors ${
                  filter === f.value
                    ? "bg-ink font-semibold text-white"
                    : "border border-line bg-base font-medium text-ink-3 hover:border-ink/40 hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Panduan (persis siagakeluarga.fig Node 1201..1275) */}
      <section className="bg-paper px-5 pb-20 md:px-8">

        <div className="relative z-10 mx-auto max-w-[1240px]">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ guide, fase }) => (
              <Link
                key={`${guide.jenis}-${fase}`}
                to={`/panduan/${guide.jenis}?fase=${fase}`}
                className="group flex min-h-[180px] flex-col rounded-2xl border border-line bg-base p-6 transition-colors hover:border-ink/40"
              >
                <span aria-hidden="true" className="mb-4 h-1 w-8 rounded-full" style={{ backgroundColor: guide.color }} />
                <p className="text-[14px] font-medium" style={{ color: guide.color }}>
                  {guide.label} · {FASE_LABEL[fase]}
                </p>
                <p className="mt-3 flex-1 text-[18px] leading-[1.35] font-semibold tracking-[-0.01em] text-ink">
                  {guide.fase[fase].ringkasan}
                </p>
                <span className="mt-4 text-[15px] font-semibold text-ink group-hover:underline">Baca langkahnya</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
