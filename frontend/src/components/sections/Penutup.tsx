import { Link } from "react-router-dom";
import { Reveal } from "@/components/motion/Reveal";
import { TopoBackground } from "@/components/layout/TopoBackground";

export function Penutup() {
  return (
    <section className="relative overflow-hidden bg-[#F4F1EA] px-6 py-24 text-center md:px-[100px] md:py-40">
      <TopoBackground variant="warm" />

      {/* Aksen bintang sudut sesuai siagakeluarga.fig Node 864 & 865 */}
      <svg
        aria-hidden="true"
        viewBox="0 0 28 28"
        className="pointer-events-none absolute top-20 left-20 hidden size-7 text-[#C2410C] md:block"
      >
        <path
          d="M14 0L16.8 11.2L28 14L16.8 16.8L14 28L11.2 16.8L0 14L11.2 11.2L14 0Z"
          fill="currentColor"
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-24 bottom-20 hidden size-6 text-[#C2410C] md:block"
      >
        <path
          d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z"
          fill="currentColor"
        />
      </svg>

      <Reveal className="relative z-10 mx-auto max-w-4xl">
        <h2 className="text-4xl font-extrabold tracking-[-0.03em] text-[#0B2545] md:text-[64px] md:leading-[1.05]">
          Buat rencanamu <span className="text-[#C2410C]">sebelum</span> butuh.
        </h2>
        <Link
          to="/daftar"
          className="mt-8 inline-flex h-[56px] items-center justify-center rounded-full bg-[#C2410C] px-7 text-[17px] font-semibold text-white transition-transform duration-150 hover:scale-[1.02] hover:bg-[#9A3412]"
        >
          Buat rencana keluargamu
        </Link>
      </Reveal>
    </section>
  );
}
