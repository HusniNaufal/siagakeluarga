import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useReveal } from "@/components/motion/Reveal";
import { WordRevealHeading } from "@/components/motion/WordRevealHeading";
import { ArrowUpRight, Mountain, Siren, Waves, Wind, Activity } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Hazard {
  jenis: string;
  title: string;
  text: string;
  color: string;
  Icon: LucideIcon;
}

const BANJIR: Hazard = {
  jenis: "BANJIR",
  title: "Banjir",
  text: "Kapan pindah, ke mana berjalan, dan apa yang tidak boleh dinyalakan saat air menggenang. Bencana yang paling sering menimpa rumah keluarga di sini.",
  color: "#1d4ed8",
  Icon: Waves,
};

const OTHERS: Hazard[] = [
  {
    jenis: "GEMPA",
    title: "Gempa",
    text: "Lindungi kepala lebih dulu. Keluar ke titik kumpul setelah guncangan berhenti.",
    color: "#b91c1c",
    Icon: Activity,
  },
  {
    jenis: "LONGSOR",
    title: "Longsor",
    text: "Perhatikan retakan tanah dan lereng di belakang rumah sebelum hujan panjang.",
    color: "#a16207",
    Icon: Mountain,
  },
  {
    jenis: "CUACA_EKSTREM",
    title: "Cuaca ekstrem",
    text: "Angin kencang dan hujan lebat: apa yang dikunci, dan siapa yang dicek kabarnya.",
    color: "#0f766e",
    Icon: Wind,
  },
  {
    jenis: "TSUNAMI",
    title: "Tsunami",
    text: "Naik ke tempat tinggi yang sudah disepakati. Jangan menunggu air terlihat.",
    color: "#0e7490",
    Icon: Siren,
  },
];

const MotionLink = motion.create(Link);

export function Fitur() {
  const reveal = useReveal({ hover: true });
  return (
    <section id="fitur" className="scroll-mt-20 bg-paper py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[680px]">
            <WordRevealHeading className="t-h2 text-ink">
              Lima bencana, langkahnya tidak sama.
            </WordRevealHeading>
            <p className="mt-4 t-lead text-ink-3">
              Tiap panduan dibagi tiga: sebelum, saat, dan sesudah. Langkah yang
              cocok bisa langsung dimasukkan ke rencana keluarga.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/panduan"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
            >
              Buka semua panduan
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.15fr_1fr_1fr]">
          <MotionLink
            {...reveal(0)}
            whileHover={{ y: -6, scale: 1.01, transition: { type: "spring", stiffness: 300, damping: 22 } }}
            to={`/panduan/${BANJIR.jenis}`}
            className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[28px] bg-night p-7 text-white lg:row-span-2 shadow-sm hover:shadow-xl transition-shadow"
          >
            <img
              src="/images/evakuasi-perahu.webp"
              alt=""
              loading="lazy"
              className="foto absolute inset-0 size-full object-cover object-[72%_50%] transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-transparent" />
            <div className="relative">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                <BANJIR.Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-[30px] leading-none font-semibold tracking-[-0.025em]">
                {BANJIR.title}
              </h3>
              <p className="mt-3 max-w-[44ch] text-[16px] leading-[1.6] text-white/85">
                {BANJIR.text}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold">
                Baca panduan
                <ArrowUpRight
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </MotionLink>

          {OTHERS.map((item, i) => (
            <MotionLink
              {...reveal(i + 1)}
              whileHover={{
                y: -6,
                scale: 1.015,
                boxShadow: "0 16px 30px -8px rgba(11, 37, 69, 0.08)",
                transition: { type: "spring", stiffness: 320, damping: 22 },
              }}
              key={item.jenis}
              to={`/panduan/${item.jenis}`}
              className="group flex flex-col rounded-[24px] border border-line bg-base p-6 transition-all hover:border-ink/30 cursor-pointer"
            >
              <span
                className="inline-flex size-11 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: item.color }}
              >
                <item.Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-[22px] leading-none font-semibold tracking-[-0.02em] text-ink">
                {item.title}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-ink-3">{item.text}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink">
                Baca panduan
                <ArrowUpRight
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </MotionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
