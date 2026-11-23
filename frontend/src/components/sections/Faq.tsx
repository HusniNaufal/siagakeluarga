import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Pembatas } from "@/components/ui/LangkahGambar";
import { GrafisRumah } from "@/components/ui/Grafis";
import { WordRevealHeading } from "@/components/motion/WordRevealHeading";

const FAQS = [
  {
    q: "Apakah ini gratis?",
    a: "Ya. Profil keluarga dan rencana darurat dasar tidak dipungut biaya.",
  },
  {
    q: "Siapa yang bisa melihat data keluarga saya?",
    a: "Isi lengkapnya hanya lewat akunmu. Tautan yang dibagikan menampilkan bagian yang kamu pilih, dalam mode baca-saja.",
  },
  {
    q: "Apakah jawaban di sini menggantikan BPBD?",
    a: "Tidak. Rencana ini untuk bersiap. Saat kejadian berlangsung, ikuti arahan BPBD, petugas, atau sirine di tempatmu.",
  },
  {
    q: "Bagaimana cara mengirimnya ke orang tua saya?",
    a: "Di halaman rencana, pilih bagikan. Kamu mendapat tautan yang bisa dikirim lewat WhatsApp. Penerima tidak perlu membuat akun.",
  },
  {
    q: "Dari mana cuaca dan data bencananya?",
    a: "Prakiraan cuaca dari BMKG. Angka kejadian dan zona dari BNPB. Keduanya diberi keterangan sumber di halaman yang memakainya.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  const baseId = useId();

  return (
    <section id="faq" className="scroll-mt-20 bg-paper py-20 md:py-28">
      <div className="shell mb-14">
        <Pembatas />
      </div>
      <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <WordRevealHeading className="t-h2 text-ink">
            Pertanyaan yang biasanya ditanyakan dulu.
          </WordRevealHeading>
          <GrafisRumah className="mt-12 hidden w-[320px] lg:block" />
        </div>
        <div className="divide-y divide-line border-y border-line">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-${i}`;
            return (
              <div key={item.q} className="group">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex min-h-14 w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-accent-dark cursor-pointer"
                  >
                    <span className="text-[17px] font-medium text-ink group-hover:text-accent-dark transition-colors">{item.q}</span>
                    <Plus
                      className={cn(
                        "size-5 shrink-0 text-muted transition-transform duration-300",
                        isOpen && "rotate-45 text-accent-dark",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-[16px] leading-[1.65] text-ink-3">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
