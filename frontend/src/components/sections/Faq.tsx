import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { TopoBackground } from "@/components/layout/TopoBackground";

const FAQS = [
  {
    q: "Apakah SiagaKeluarga gratis dipakai?",
    a: "Ya. Menyusun profil keluarga dan rencana darurat dasar tidak dipungut biaya.",
  },
  {
    q: "Apakah data keluarga saya aman?",
    a: "Data disimpan di server kami dan hanya bisa diakses dengan akun kamu. Tautan rencana publik hanya menampilkan info yang kamu pilih untuk dibagikan.",
  },
  {
    q: "Apakah AI menggantikan arahan BPBD?",
    a: "Tidak. Rencana dari AI membantu kamu bersiap, tapi tetap ikuti arahan resmi BPBD atau petugas saat kejadian berlangsung.",
  },
  {
    q: "Bagaimana cara membagikan rencana ke keluarga?",
    a: 'Buka halaman Rencana Darurat, lalu tekan "Bagikan ke Keluarga" untuk mendapat tautan baca-saja yang bisa dikirim lewat WhatsApp.',
  },
  {
    q: "Dari mana sumber data cuaca dan bencananya?",
    a: "Prakiraan cuaca dari BMKG dan data zona bahaya dari BNPB, diperbarui berkala.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 md:px-[100px] md:py-40">
      <TopoBackground variant="light" />

      <div className="relative z-10 mx-auto max-w-[1000px]">
        <Reveal className="text-center">
          <p className="text-[13px] tracking-[0.04em] text-[#C2410C]">FAQ</p>
          <h2 className="mt-6 text-3xl font-bold tracking-[-0.025em] text-[#0F172A] md:text-[40px] md:leading-[1.15]">
            Pertanyaan yang sering ditanyakan
          </h2>
        </Reveal>

        <Reveal
          delay={0.08}
          className="mt-14 overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white"
        >
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={i > 0 ? "border-t border-[#E2E8F0]" : undefined}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left transition-colors hover:bg-[#F4F1EA]/40"
                >
                  <span className="text-[17px] font-medium text-[#0F172A]">
                    {item.q}
                  </span>
                  <span
                    className={`text-[20px] leading-none font-normal ${
                      isOpen ? "text-[#C2410C]" : "text-[#475569]"
                    }`}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-[15px] leading-[1.6] text-[#475569]">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
