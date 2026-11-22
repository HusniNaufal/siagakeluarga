import { Reveal } from "@/components/motion/Reveal";
import { TopoBackground } from "@/components/layout/TopoBackground";
import { cn } from "@/lib/utils";

const DAYS = [
  {
    hari: "Senin",
    suhu: "27°/21°",
    cuaca: "Cerah berawan",
    detail: "Curah hujan 2 mm, kelembapan 72%",
    active: false,
  },
  {
    hari: "Selasa",
    suhu: "28°/22°",
    cuaca: "Hujan lebat sore",
    detail: "Curah hujan 42 mm, waspada genangan",
    active: true,
  },
  {
    hari: "Rabu",
    suhu: "26°/21°",
    cuaca: "Hujan ringan",
    detail: "Curah hujan 12 mm, angin 14 km/j",
    active: false,
  },
];

const TIMELINE = [
  { jam: "08:00", suhu: "27°", hujan: "0%" },
  { jam: "11:00", suhu: "29°", hujan: "10%" },
  { jam: "14:00", suhu: "24°", hujan: "80%", active: true },
  { jam: "17:00", suhu: "22°", hujan: "60%" },
  { jam: "20:00", suhu: "21°", hujan: "20%" },
];

export function DataBmkgLive() {
  return (
    <section
      id="data-bmkg"
      className="relative overflow-hidden bg-[#0B2545] px-6 py-24 text-white md:px-[100px] md:py-36"
    >
      <TopoBackground variant="dark" />

      <div className="relative z-10 mx-auto max-w-[1240px]">
        <Reveal>
          <p className="text-[13px] font-normal text-[#FB923C]">
            Prakiraan BMKG Dayeuhkolot, 14:00 WIB
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-[#F5F5F4] md:text-[40px] md:leading-[1.15]">
            Data cuaca langsung dari BMKG
          </h2>
        </Reveal>

        {/* Baris 3 kartu prakiraan harian (persis siagakeluarga.fig Node 810) */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {DAYS.map((d, i) => (
            <Reveal key={d.hari} delay={i * 0.06}>
              <div
                className={cn(
                  "rounded-[16px] border px-6 py-[22px]",
                  d.active
                    ? "border-[1.5px] border-[#FB923C] bg-[#1E293B]"
                    : "border-white/14 bg-[#13345D]",
                )}
              >
                <p
                  className={cn(
                    "text-[13px]",
                    d.active ? "text-[#F59E0B]" : "text-[#9AA4B2]",
                  )}
                >
                  {d.hari}
                </p>
                <p className="mt-2 text-[22px] font-normal text-[#F5F5F4]">
                  {d.suhu}
                </p>
                <p
                  className={cn(
                    "mt-2 text-[14px]",
                    d.active ? "text-[#F59E0B]" : "text-[#9AA4B2]",
                  )}
                >
                  {d.cuaca}
                </p>
                <p
                  className={cn(
                    "mt-2 text-[12px]",
                    d.active ? "font-medium text-[#FDBA74]" : "text-[#94A3B8]",
                  )}
                >
                  {d.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Timeline 3 jam (persis siagakeluarga.fig Node 826) */}
        <Reveal
          delay={0.1}
          className="mt-10 flex justify-between gap-2 overflow-x-auto rounded-[20px] bg-[#13345D] p-6"
        >
          {TIMELINE.map((t) => (
            <div key={t.jam} className="flex flex-col items-center gap-1.5">
              <p
                className={cn(
                  "text-[13px]",
                  t.active ? "text-[#F59E0B]" : "text-[#9AA4B2]",
                )}
              >
                {t.jam}
              </p>
              <p className="text-[18px] text-[#F5F5F4]">{t.suhu}</p>
              <p className="text-[13px] text-[#3B82F6]">{t.hujan}</p>
            </div>
          ))}
        </Reveal>

        {/* Baris bawah: Status wilayah & Titik kumpul terdekat (Node 847 & 852) */}
        <Reveal delay={0.15} className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[16px] border border-white/14 bg-[#13345D] p-6">
            <span className="inline-flex items-center rounded-full bg-[#D97706] px-3.5 py-1.5 text-[13px] font-medium text-white">
              Waspada
            </span>
            <p className="mt-2.5 text-[19px] font-semibold text-[#F5F5F4]">
              Status wilayah: siaga hujan sedang
            </p>
            <p className="mt-2 text-[14px] text-[#9AA4B2]">
              Hujan intensitas sedang diperkirakan sore ini di Dayeuhkolot. Pantau timeline di bawah.
            </p>
          </div>

          <div className="rounded-[16px] border border-white/14 bg-[#13345D] p-6">
            <p className="text-[12px] font-semibold text-[#FB923C]">
              Titik kumpul terdekat, Kel. Dayeuhkolot
            </p>
            <p className="mt-2 text-[20px] font-semibold text-white">
              Aula Masjid Agung Dayeuhkolot (400 m)
            </p>
            <p className="mt-2 text-[13px] text-[#CBD5E1]">
              Waktu tempuh ±5 menit berjalan kaki. Rute ramah kursi roda untuk Nenek Aminah.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
