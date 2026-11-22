import { Reveal } from "@/components/motion/Reveal";
import { TopoBackground } from "@/components/layout/TopoBackground";

export function Fitur() {
  return (
    <section
      id="fitur"
      className="relative overflow-hidden bg-white px-6 py-24 md:px-[100px] md:py-36"
    >
      <TopoBackground variant="light" />

      <div className="relative z-10 mx-auto max-w-[1240px]">
        <Reveal>
          <p className="text-[13px] font-normal text-[#C2410C]">Fitur</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-[#0F172A] md:text-[40px] md:leading-[1.15]">
            Fitur utama
          </h2>
        </Reveal>

        {/* Grid 4 Kartu Fitur — Editorial Compact (persis siagakeluarga.fig Node 761..801) */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 — Rencana darurat AI (Node 762) */}
          <Reveal delay={0}>
            <div className="flex h-[274px] flex-col gap-3.5 rounded-[20px] border border-[#E2E8F0] bg-white p-4">
              <div className="relative h-[152px] w-full overflow-hidden rounded-[12px] bg-[#F4F1EA]">
                <img
                  src="/images/map-dayeuhkolot.webp"
                  alt="Peta Rencana Darurat AI"
                  className="h-full w-full object-cover"
                />
                {/* Garis jalan putih & rute oranye sesuai Node 764..768 */}
                <div className="pointer-events-none absolute inset-x-0 top-[68px] h-2 bg-white" />
                <div className="pointer-events-none absolute inset-y-0 left-[108px] w-2 bg-white" />
                <div className="pointer-events-none absolute inset-y-0 left-[210px] w-2 bg-white" />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 262 152"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                >
                  <path
                    d="M46 112 C95 112, 145 38, 214 38"
                    fill="none"
                    stroke="#C2410C"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="214" cy="38" r="6" fill="#C2410C" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#0B2545]">
                Rencana darurat AI
              </h3>
              <p className="text-[13px] leading-[1.45] text-[#475569]">
                Titik kumpul, jalur evakuasi, dan tugas tiap anggota.
              </p>
            </div>
          </Reveal>

          {/* Card 2 — Cuaca & risiko BMKG (Node 771) */}
          <Reveal delay={0.06}>
            <div className="flex h-[274px] flex-col gap-3.5 rounded-[20px] bg-[#0B2545] p-4">
              <div className="flex h-[152px] flex-col justify-between rounded-[12px] bg-[#13345D] p-4 text-white">
                <p className="text-[11px] font-normal text-[#FB923C]">
                  Dayeuhkolot, 15:00 WIB
                </p>
                <p className="text-[34px] leading-none font-semibold text-white">
                  24°C
                </p>
                <div className="flex h-[34px] items-end gap-2">
                  <div className="h-[14px] flex-1 rounded-[3px] bg-[#1D4ED8]/55" />
                  <div className="h-[22px] flex-1 rounded-[3px] bg-[#1D4ED8]/75" />
                  <div className="h-[34px] flex-1 rounded-[3px] bg-[#C2410C]" />
                  <div className="h-[18px] flex-1 rounded-[3px] bg-[#1D4ED8]/55" />
                </div>
              </div>
              <h3 className="text-[17px] font-semibold text-white">
                Cuaca &amp; risiko BMKG
              </h3>
              <p className="text-[13px] leading-[1.45] text-[#CBD5E1]">
                Prakiraan 3 hari diperbarui otomatis setiap 3 jam.
              </p>
            </div>
          </Reveal>

          {/* Card 3 — Tas siaga keluarga (Node 782) */}
          <Reveal delay={0.12}>
            <div className="flex h-[274px] flex-col gap-3.5 rounded-[20px] border border-[#E2E8F0] bg-white p-4">
              <div className="flex h-[152px] flex-col justify-center gap-2.5 rounded-[12px] bg-[#F4F1EA] p-4">
                <div className="flex items-center gap-2.5">
                  <span className="size-4 shrink-0 rounded-[4px] bg-[#C2410C]" />
                  <span className="truncate text-[12px] font-medium text-[#0F172A]">
                    Dokumen kedap air
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="size-4 shrink-0 rounded-[4px] bg-[#C2410C]" />
                  <span className="truncate text-[12px] font-medium text-[#0F172A]">
                    Obat Nenek Aminah (7 hr)
                  </span>
                </div>
                <div className="mt-1 h-[6px] w-full overflow-hidden rounded-[3px] bg-[#E2E8F0]">
                  <div className="h-full w-[73%] rounded-[3px] bg-[#0F766E]" />
                </div>
              </div>
              <h3 className="text-[17px] font-semibold text-[#0B2545]">
                Tas siaga keluarga
              </h3>
              <p className="text-[13px] leading-[1.45] text-[#475569]">
                Checklist sesuai anggota beserta pengingat kedaluwarsa.
              </p>
            </div>
          </Reveal>

          {/* Card 4 — Tanya AI darurat (Node 794) */}
          <Reveal delay={0.18}>
            <div className="flex h-[274px] flex-col gap-3.5 rounded-[20px] border border-[#E2E8F0] bg-white p-4">
              <div className="flex h-[152px] flex-col justify-center gap-2.5 rounded-[12px] bg-[#F4F1EA] p-3.5">
                <div className="rounded-[10px] bg-[#0B2545] px-2.5 py-2 text-[11px] font-normal text-white">
                  Evakuasi lansia saat air naik?
                </div>
                <div className="rounded-[10px] border border-[#E2E8F0] bg-white px-2.5 py-2 text-[11px] leading-snug text-[#0F172A]">
                  Evakuasi sebelum 20 cm via Jl. Raya Dayeuhkolot.
                </div>
              </div>
              <h3 className="text-[17px] font-semibold text-[#0B2545]">
                Tanya AI darurat
              </h3>
              <p className="text-[13px] leading-[1.45] text-[#475569]">
                Panduan cepat berbasis modul resmi BNPB.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
