import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { WordRevealHeading } from "@/components/motion/WordRevealHeading";

const LANGKAH = ["Daftarkan anggota rumah", "Cek titik kumpul dan tugasnya", "Kirim tautan ke grup keluarga"];

export function Penutup() {
  return (
    <section className="bg-base py-20 md:py-28">
      <div className="shell">
        <div className="grid overflow-hidden rounded-[32px] bg-ink text-white lg:grid-cols-[0.9fr_1.1fr]">
          <ParallaxImage
            src="/images/rumah-bandung-barat.webp"
            alt="Rumah sederhana di tengah sawah saat fajar, Bandung Barat"
            className="h-[280px] lg:h-auto lg:min-h-[460px]"
            imgClassName="object-[50%_60%]"
          />
          <div className="px-6 py-10 md:px-12 md:py-14">
            <WordRevealHeading className="t-h2 text-white" scrub={false} duration={0.6} stagger={0.13}>
              Susun rencanamu selagi rumah masih kering.
            </WordRevealHeading>
            <p className="mt-4 max-w-[46ch] t-lead text-white/75">
              Gratis untuk rencana dasar. Titik kumpul usulan bisa kamu ubah kalau tidak cocok dengan keadaan gang di
              rumah.
            </p>

            <ol className="mt-7 space-y-2 text-[16px] text-white/90">
              {LANGKAH.map((l, i) => (
                <li key={l} className="flex items-baseline gap-3">
                  <span className="font-display tabular-nums text-[15px] font-semibold text-[#ffb591]">{i + 1}</span>
                  {l}
                </li>
              ))}
            </ol>

            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                to="/daftar"
                className="group mt-9 inline-flex h-14 items-center gap-2.5 rounded-full bg-white px-8 text-[17px] font-semibold text-ink shadow-md hover:shadow-xl transition-shadow"
              >
                Buat rencana keluarga
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
