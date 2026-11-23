import { motion } from "motion/react";
import { useReveal } from "@/components/motion/Reveal";
import { WordRevealHeading } from "@/components/motion/WordRevealHeading";
import { Cincin } from "@/components/ui/Grafis";
import { TopoBackground } from "@/components/layout/TopoBackground";
import { GambarBagikan, GambarKeluarga, GambarRute } from "@/components/ui/LangkahGambar";

const STEPS = [
  {
    Gambar: GambarKeluarga,
    title: "Isi siapa yang ada di rumah",
    text: "Nama, usia, dan kebutuhan khusus. Obat rutin dan anak kecil mengubah isi tas dan tugas masing-masing.",
  },
  {
    Gambar: GambarRute,
    title: "Rencana disusun dari lokasimu",
    text: "Titik kumpul terdekat, tugas tiap anggota, dan catatan untuk yang butuh bantuan berjalan. Semua bisa kamu ubah.",
  },
  {
    Gambar: GambarBagikan,
    title: "Bagikan, lalu coba sekali",
    text: "Kirim tautan baca-saja ke grup keluarga. Yang membuka tidak perlu mendaftar. Latihan singkat mengecek apakah jalurnya masuk akal.",
  },
];

export function CaraKerja() {
  const reveal = useReveal();
  return (
    <section id="cara-kerja" className="relative scroll-mt-20 overflow-hidden bg-base/95 py-20 backdrop-blur-[2px] md:py-28">
      <TopoBackground variant="warm" className="opacity-[0.12]" />
      <Cincin className="absolute top-0 right-0 hidden w-[290px] opacity-70 lg:block" />
      <div className="shell relative z-10">
        <WordRevealHeading className="max-w-[16ch] t-h2 text-ink" scrub={false} duration={0.6} stagger={0.13}>
          Tiga langkah, sekitar sepuluh menit.
        </WordRevealHeading>

        <ol className="mt-14 border-t border-line">
          {STEPS.map((step, i) => (
            <motion.li
              {...reveal(i)}
              whileHover={{ x: 6, transition: { type: "spring", stiffness: 350, damping: 25 } }}
              initial={{ opacity: 0, y: 20 }}
              key={step.title}
              className="grid gap-3 border-b border-line py-8 transition-colors hover:bg-surface/50 rounded-xl px-2 md:grid-cols-[72px_1.1fr_1fr_120px] md:gap-8 md:py-10"
            >
              <span className="font-display tabular-nums text-[28px] leading-none font-semibold text-accent-dark md:pt-1">
                {i + 1}
              </span>
              <h3 className="t-h3 text-ink">
                {step.title}
              </h3>
              <p className="max-w-[46ch] t-lead text-ink-3 md:pt-2">{step.text}</p>
              <step.Gambar className="hidden md:block" />
            </motion.li>
          ))}
        </ol>

        <p className="mt-8 text-[16px] text-ink-3">
          Boleh berhenti di tengah dan lanjut besok. Yang sudah diisi tidak hilang.
        </p>
      </div>
    </section>
  );
}
