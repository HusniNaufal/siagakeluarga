import { Clock3, ListChecks } from "lucide-react";
import { motion } from "motion/react";
import { useReveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

export function Stats() {
  const reveal = useReveal();
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <h2 className="t-h2 text-ink">
            Banyak keluarga baru berunding saat air sudah masuk rumah.
          </h2>
          <p className="max-w-[48ch] t-lead text-ink-3">
            Putuskan sekarang, saat masih tenang: ke mana pergi, siapa membawa apa, dan siapa dijemput lebih dulu.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <motion.article {...reveal(0)} className="relative min-h-[300px] overflow-hidden rounded-[24px] lg:col-span-7 lg:min-h-[360px]">
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
            <motion.article {...reveal(1)} className="flex flex-col justify-between rounded-[24px] bg-accent-dark p-7 text-white">
              <ListChecks className="size-6" strokeWidth={1.6} aria-hidden="true" />
              <div className="mt-10">
                <p className="font-display text-[64px] leading-none font-semibold tracking-[-0.04em]">4</p>
                <p className="mt-3 max-w-[34ch] text-[16px] leading-[1.5] text-white/90">
                  hal yang ditulis di rencana: titik kumpul, tugas tiap anggota, kontak darurat, dan isi tas siaga.
                </p>
              </div>
            </motion.article>
            <motion.article {...reveal(2)} className="flex flex-col justify-between rounded-[24px] bg-storm p-7 text-white">
              <Clock3 className="size-6 text-mist" strokeWidth={1.6} aria-hidden="true" />
              <div className="mt-10">
                <p className="font-display text-[64px] leading-none font-semibold tracking-[-0.04em]">3 hari</p>
                <p className="mt-3 max-w-[34ch] text-[16px] leading-[1.5] text-mist">
                  prakiraan BMKG untuk kelurahan rumahmu, per 3 jam.
                </p>
              </div>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
}
