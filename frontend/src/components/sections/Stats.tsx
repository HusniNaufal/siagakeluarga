import { Clock3, ListChecks } from "lucide-react";
import { motion } from "motion/react";
import { useReveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { WordRevealHeading } from "@/components/motion/WordRevealHeading";

export function Stats() {
  const reveal = useReveal();
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <WordRevealHeading className="t-h2 text-ink" scrub={false} duration={0.6} stagger={0.13}>
            Banyak keluarga baru berunding saat air sudah masuk rumah.
          </WordRevealHeading>
          <p className="max-w-[48ch] t-lead text-ink-3">
            Putuskan sekarang, saat masih tenang: ke mana pergi, siapa membawa apa, dan siapa dijemput lebih dulu.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <motion.article
            {...reveal(0)}
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 22 } }}
            className="relative min-h-[300px] overflow-hidden rounded-[24px] lg:col-span-7 lg:min-h-[360px] cursor-pointer"
          >
            <ParallaxImage
              src="/images/banjir-jakarta.webp"
              alt="Jalan permukiman di Jakarta Selatan terendam banjir setinggi dada, seorang warga berdiri di tengahnya"
              className="absolute inset-0"
              imgClassName="object-[50%_35%]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 to-transparent p-6 pt-20">
              <p className="max-w-[40ch] text-[16px] leading-[1.45] font-medium text-white">
                Rawa Jati, Jakarta Selatan, Maret 2025. Saat air sudah di jalan, waktu untuk berunding sudah habis.
              </p>
            </div>
          </motion.article>

          <div className="grid gap-4 lg:col-span-5">
            <motion.article
              {...reveal(1)}
              whileHover={{ y: -6, scale: 1.015, transition: { type: "spring", stiffness: 320, damping: 24 } }}
              className="flex flex-col justify-between rounded-[24px] bg-accent-dark p-7 text-white shadow-sm hover:shadow-lg transition-shadow cursor-default"
            >
              <ListChecks className="size-6" strokeWidth={1.6} aria-hidden="true" />
              <div className="mt-10">
                <p className="font-display text-[64px] leading-none font-semibold tracking-[-0.04em]">3.233</p>
                <p className="mt-3 max-w-[34ch] text-[16px] leading-[1.5] text-white/90">
                  kejadian bencana di Indonesia sepanjang 2025. Hampir separuhnya (49,42%) adalah banjir.
                </p>
              </div>
            </motion.article>
            <motion.article
              {...reveal(2)}
              whileHover={{ y: -6, scale: 1.015, transition: { type: "spring", stiffness: 320, damping: 24 } }}
              className="flex flex-col justify-between rounded-[24px] bg-storm p-7 text-white shadow-sm hover:shadow-lg transition-shadow cursor-default"
            >
              <Clock3 className="size-6 text-mist" strokeWidth={1.6} aria-hidden="true" />
              <div className="mt-10">
                <p className="font-display text-[64px] leading-none font-semibold tracking-[-0.04em]">48%</p>
                <p className="mt-3 max-w-[34ch] text-[16px] leading-[1.5] text-mist">
                  warga memiliki skor kesiapsiagaan rendah menghadapi banjir.
                </p>
              </div>
            </motion.article>
          </div>
        </div>

        <p className="mt-5 max-w-[80ch] text-[13px] leading-[1.6] text-muted">
          Sumber: rekap BNPB 2025 melalui GoodStats; studi Health Collaborative Center melalui Kompas.com (2024).
        </p>
      </div>
    </section>
  );
}
