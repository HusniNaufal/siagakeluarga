import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useInView, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { TopoBackground } from "@/components/layout/TopoBackground";

function CountUpStat({ target = 5402 }: { target?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? target : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const duration = 1200;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      setVal(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {(reduce ? target : val).toLocaleString("id-ID")}
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-[#F4F1EA] px-6 py-24 md:px-[100px] md:py-40">
      <TopoBackground variant="warm" />

      <div className="relative z-10 mx-auto flex max-w-[1240px] flex-col gap-16 lg:flex-row lg:items-center lg:justify-between">
        {/* Kolom Kiri — Angka 5.402 BNPB (persis siagakeluarga.fig Node 650..656) */}
        <Reveal className="max-w-[380px] space-y-3">
          <p className="text-[13px] tracking-[0.04em] text-[#475569]">
            Sumber: BNPB
          </p>
          <p className="text-6xl font-extrabold tracking-[-0.04em] text-[#0F172A] md:text-[96px] md:leading-[1.02]">
            <CountUpStat target={5402} />
          </p>
          <p className="text-[16px] leading-[1.6] text-[#475569]">
            kejadian bencana hidrometeorologi tercatat sepanjang 2025 di
            Indonesia
          </p>
          <div className="mt-3 rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3.5">
            <p className="text-[12px] font-semibold text-[#0B2545]">
              Rincian Kejadian Utama (BNPB 2025)
            </p>
            <p className="mt-2 text-[12px] text-[#475569]">
              3.120 Banjir, 1.280 Cuaca ekstrem, 710 Tanah longsor
            </p>
          </div>
        </Reveal>

        {/* Kolom Tengah — Tumpukan 2 Foto + Lencana Centang Oranye (persis Node 657..661) */}
        <Reveal
          delay={0.08}
          className="relative mx-auto h-[320px] w-full max-w-[420px] shrink-0 lg:mx-0"
        >
          <div className="group absolute top-10 left-0 h-[280px] w-[280px] overflow-hidden rounded-[24px] bg-[#E8E2D4] sm:w-[300px]">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"
              alt="Keluarga menyiapkan tas siaga"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              onError={(e) => {
                e.currentTarget.src = "/images/stats-tas-siaga.webp";
              }}
            />
          </div>
          <div className="group absolute top-0 right-0 h-[190px] w-[235px] overflow-hidden rounded-[24px] bg-[#0B2545] sm:left-[160px] sm:w-[260px]">
            <img
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80"
              alt="Titik kumpul keluarga"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              onError={(e) => {
                e.currentTarget.src = "/images/stats-titik-kumpul.webp";
              }}
            />
          </div>
          <div className="absolute top-[148px] left-[112px] flex size-[76px] items-center justify-center rounded-full border-[3px] border-white bg-[#C2410C] text-[28px] font-bold text-white">
            ✓
          </div>
        </Reveal>

        {/* Kolom Kanan — Ajakan Buat Rencana (persis Node 662..666) */}
        <Reveal delay={0.14} className="max-w-[380px] space-y-3.5">
          <h2 className="text-[28px] leading-[1.2] font-semibold tracking-[-0.015em] text-[#0F172A]">
            Banyak keluarga belum punya rencana tertulis
          </h2>
          <p className="text-[16px] leading-[1.6] text-[#475569]">
            Tanpa titik kumpul dan tugas yang jelas, keluarga mudah panik saat
            bencana datang.
          </p>
          <div className="pt-0.5">
            <Link
              to="/daftar"
              className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#C2410C] px-6 text-[15px] font-semibold text-white transition-transform duration-150 hover:scale-[1.02] hover:bg-[#9A3412]"
            >
              Buat rencana sekarang
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
