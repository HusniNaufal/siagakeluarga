import { useState } from "react";
import { Link } from "react-router-dom";
import { GUIDES, FASE_LABEL, type Fase } from "@/content/panduan";
import { TopoBackground } from "@/components/layout/TopoBackground";
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
      {/* Hero foto penuh dengan Filter Kapsul (persis siagakeluarga.fig Node 1173) */}
      <section className="relative overflow-hidden bg-[#07090C] px-6 pt-40 pb-24 md:px-[100px]">
        <img
          src="/images/panduan-hero.webp"
          alt="Panduan bencana"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090C]/90 via-[#07090C]/20 to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1240px]">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-[-0.025em] text-white md:text-[56px]">
              Panduan bencana
            </h1>
            <p className="mt-4 text-[18px] text-[#F5F5F4]">
              Langkah resmi BNPB untuk sebelum, saat, dan sesudah bencana.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={`rounded-full px-5 py-2.5 text-[15px] transition-colors ${
                    filter === f.value
                      ? "bg-[#C2410C] font-semibold text-white"
                      : "border border-white/25 bg-[#0B2545]/80 font-medium text-white hover:bg-[#0B2545]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid Panduan (persis siagakeluarga.fig Node 1201..1275) */}
      <section className="relative overflow-hidden bg-[#F4F1EA] px-6 py-14 md:px-[100px]">
        <TopoBackground variant="warm" />

        <div className="relative z-10 mx-auto max-w-[1240px]">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ guide, fase }) => (
              <Link
                key={`${guide.jenis}-${fase}`}
                to={`/panduan/${guide.jenis}?fase=${fase}`}
                className="group flex flex-col gap-3 rounded-[20px] border border-[#E2E8F0] bg-white p-[14px] pb-[18px] transition-transform hover:-translate-y-0.5"
              >
                <div className="h-[240px] overflow-hidden rounded-[14px] bg-[#E2E8F0]">
                  <img
                    src={guide.fase[fase].image || guide.image}
                    alt={`${guide.label} (${FASE_LABEL[fase]})`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/images/panduan-hero.webp";
                    }}
                  />
                </div>
                <p
                  className="text-[13px] font-normal"
                  style={{ color: guide.color }}
                >
                  {guide.label} ({FASE_LABEL[fase]})
                </p>
                <p className="text-[18px] leading-[1.25] font-semibold text-[#0F172A]">
                  {guide.fase[fase].ringkasan}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
