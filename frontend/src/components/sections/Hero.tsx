import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { HeroFrames } from "@/components/sections/HeroFrames";

interface Chapter {
  key: string;
  dark: boolean;
  effect?: "rain" | "lightning" | "glow" | "path" | null;
}

const CHAPTERS: Chapter[] = [
  { key: "k1-cerah", dark: false, effect: null },
  { key: "k2-jalur", dark: false, effect: "path" },
  { key: "k3-cuaca", dark: true, effect: "rain" },
  { key: "k4-badai", dark: true, effect: "lightning" },
  { key: "k5-aman", dark: false, effect: "glow" },
];

const N = CHAPTERS.length;

/* Partikel P1..P19 pada babak K4 Badai (persis siagakeluarga.fig Node 590..608) */
const STORM_PARTICLES = [
  { x: 380, y: 760, s: 8 },
  { x: 400, y: 740, s: 8 },
  { x: 420, y: 770, s: 10 },
  { x: 450, y: 720, s: 8 },
  { x: 480, y: 760, s: 9 },
  { x: 510, y: 700, s: 7 },
  { x: 540, y: 750, s: 8 },
  { x: 575, y: 690, s: 6 },
  { x: 610, y: 730, s: 7 },
  { x: 650, y: 680, s: 6 },
  { x: 695, y: 720, s: 7 },
  { x: 740, y: 695, s: 6 },
  { x: 785, y: 740, s: 8 },
  { x: 830, y: 710, s: 7 },
  { x: 875, y: 755, s: 9 },
  { x: 920, y: 725, s: 8 },
  { x: 965, y: 765, s: 10 },
  { x: 1010, y: 735, s: 8 },
  { x: 1050, y: 760, s: 8 },
];

function ChapterLayer({
  chapter,
  index,
  scrollYProgress,
  reduce,
  mouseOffset,
}: {
  chapter: Chapter;
  index: number;
  scrollYProgress: MotionValue<number>;
  reduce: boolean | null;
  mouseOffset: { x: number; y: number };
}) {
  const start = index / N;
  const end = (index + 1) / N;
  const mid = (start + end) / 2;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.02, mid, end - 0.02, end],
    index === 0
      ? [1, 1, 1, 1, 0]
      : index === N - 1
        ? [0, 1, 1, 1, 1]
        : [0, 1, 1, 1, 0],
  );

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ opacity: reduce ? (index === 0 ? 1 : 0) : opacity }}
    >
      {/* K2: Jalur Evakuasi + Titik Rumah + Titik Bukit + Label Titik Kumpul (persis Node 531..536) */}
      {chapter.effect === "path" && (
        <>
          <svg
            viewBox="0 0 1440 900"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M 1000 700 C 1090 580, 1180 450, 1300 320"
              fill="none"
              stroke="#C2410C"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="1000" cy="700" r="6" fill="#C2410C" />
            <circle cx="1300" cy="320" r="6" fill="#C2410C" />
          </svg>
          <div className="absolute top-[28%] right-[8%] hidden flex-col gap-0.5 md:flex">
            <span className="text-[14px] font-semibold text-white">
              Titik kumpul
            </span>
            <span className="text-[13px] text-[#C2410C]">400 m</span>
          </div>
        </>
      )}

      {/* K3: Hujan 1..12 + Kartu Prakiraan #0B2545 (persis Node 558..578) */}
      {chapter.effect === "rain" && (
        <>
          <svg
            viewBox="0 0 1440 900"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {Array.from({ length: 16 }).map((_, idx) => {
              const x1 = 740 + ((idx * 78) % 620);
              const y1 = 120 + ((idx * 105) % 520);
              return (
                <line
                  key={idx}
                  x1={x1}
                  y1={y1}
                  x2={x1 - 14}
                  y2={y1 + 60}
                  stroke="#CBD5E1"
                  strokeOpacity="0.38"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          <div className="absolute right-[7%] bottom-[14%] hidden w-[360px] rounded-[20px] border border-white/10 bg-[#0B2545] p-6 text-left shadow-xl md:block">
            <div className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[#2A1D0E] px-2.5 text-[12px] font-medium text-[#F59E0B]">
              <span className="flex size-3.5 items-center justify-center rounded-full border border-[#F59E0B] text-[10px] leading-none">
                !
              </span>
              Waspada
            </div>
            <p className="mt-3 text-[17px] font-semibold text-[#F5F5F4]">
              Hujan lebat diperkirakan 15:00
            </p>
            <p className="mt-2 text-[13px] text-[#9AA4B2]">
              Sumber: BMKG (diperbarui tiap 3 jam)
            </p>
          </div>
        </>
      )}

      {/* K4: Glow + Kilat 1 & 2 + Partikel P1..P19 (persis Node 580..608) */}
      {chapter.effect === "lightning" && (
        <>
          <div className="absolute inset-0 bg-[#0B2545]/90" />
          <div
            className="absolute top-[-40px] left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(154,196,255,0.25) 0%, rgba(154,196,255,0) 70%)",
            }}
          />
          {!reduce && (
            <motion.div
              className="absolute inset-0 bg-white"
              animate={{ opacity: [0, 0, 0.22, 0, 0, 0.12, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 2.2 }}
            />
          )}
          <svg
            viewBox="0 0 1440 900"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Kilat 1 & Kilat 2 */}
            <path
              d="M 748 60 L 730 142 L 758 148 L 736 240"
              fill="none"
              stroke="#E8F0FF"
              strokeWidth="2"
            />
            <path
              d="M 988 40 L 974 114 L 996 120 L 978 200"
              fill="none"
              stroke="#E8F0FF"
              strokeOpacity="0.33"
              strokeWidth="1.5"
            />
            {/* Partikel siluet desa P1..P19 dengan parallax ±8px (Note 4 Node 4599) */}
            <g
              style={{
                transform: reduce
                  ? undefined
                  : `translate3d(${mouseOffset.x * -8}px, ${mouseOffset.y * -8}px, 0)`,
                transition: "transform 280ms ease-out",
              }}
            >
              {STORM_PARTICLES.map((p, idx) => (
                <rect
                  key={idx}
                  x={p.x}
                  y={p.y}
                  width={p.s}
                  height={p.s}
                  fill="#8FA8B5"
                />
              ))}
            </g>
          </svg>
        </>
      )}

      {/* K5: Aman (Node 613) */}
      {chapter.effect === "glow" && (
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B2545]/45 to-transparent" />
      )}
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [chapterIndex, setChapterIndex] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const videoProgress = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const amanOpacity = useTransform(scrollYProgress, [0.78, 0.86], [0, 1]);
  const amanScale = useTransform(scrollYProgress, [0.78, 1], [1.06, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setChapterIndex(Math.min(N - 1, Math.floor(v * N)));
  });

  useEffect(() => {
    function onScroll() {
      const heroHeight = ref.current?.offsetHeight ?? Infinity;
      setPastHero(window.scrollY >= heroHeight - 4);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMouseOffset({ x, y });
  }

  const indicatorNumber = String(Math.min(4, chapterIndex + 1)).padStart(2, "0");

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative"
      style={{ height: reduce ? "100vh" : `${N * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#07090C]">
        <PublicNavbar dark={!pastHero && CHAPTERS[chapterIndex].dark} />

        <HeroFrames progress={videoProgress} className="absolute inset-0 size-full" />

        <motion.div
          className="absolute inset-0"
          style={{ opacity: reduce ? 0 : amanOpacity }}
        >
          <motion.picture
            className="block size-full"
            style={{ scale: reduce ? 1 : amanScale }}
          >
            <source media="(max-width: 767px)" srcSet="/hero/aman-m.webp" />
            <img
              src="/hero/aman.webp"
              alt=""
              className="size-full object-cover object-[35%_50%]"
            />
          </motion.picture>
        </motion.div>

        {/* Scrim Kiri (Node 481) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#07090C]/70 to-transparent md:w-[820px]" />

        {CHAPTERS.map((chapter, i) => (
          <ChapterLayer
            key={chapter.key}
            chapter={chapter}
            index={i}
            scrollYProgress={scrollYProgress}
            reduce={reduce}
            mouseOffset={mouseOffset}
          />
        ))}

        {/* Headline Block (persis Node 491, 522, 549, 583, 634) */}
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1240px] flex-col justify-center px-6">
          <AnimatePresence mode="wait">
            {chapterIndex === 0 && (
              <motion.div
                key="k1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[980px]"
              >
                <h1 className="text-5xl leading-[1.02] font-extrabold tracking-[-0.04em] text-white md:text-[80px]">
                  <span className="block">Siap bersama,</span>
                  <span className="mt-2 block">
                    <span className="text-[#C2410C]">sebelum</span> bencana
                    datang.
                  </span>
                </h1>
                <p className="mt-7 max-w-[787px] text-[19px] leading-[1.58] text-[#F5F5F4]">
                  Isi profil keluarga sekali, dan AI menyusun rencana darurat
                  yang jelas untuk tiap anggota.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/daftar"
                    className="group inline-flex h-[56px] items-center gap-2.5 rounded-full bg-[#C2410C] px-7 text-[17px] font-semibold text-white transition-transform duration-150 hover:scale-[1.02]"
                  >
                    <span>Buat rencana gratis</span>
                    <span className="transition-transform duration-150 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                  <a
                    href="#cara-kerja"
                    className="inline-flex h-[56px] items-center rounded-full border border-white/40 px-7 text-[17px] font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Lihat cara kerja
                  </a>
                </div>
                <p className="mt-8 text-[13px] tracking-[0.04em] text-[#F5F5F4]">
                  Prakiraan BMKG Dayeuhkolot, 14:00 WIB
                </p>
              </motion.div>
            )}

            {chapterIndex === 1 && (
              <motion.div
                key="k2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[980px]"
              >
                <h2 className="text-4xl leading-[1.02] font-extrabold tracking-[-0.04em] text-white md:text-[80px]">
                  01 Kenali rumahmu
                </h2>
                <p className="mt-7 text-[13px] tracking-[0.04em] text-[#F5F5F4]">
                  Prakiraan BMKG Dayeuhkolot, 14:00 WIB
                </p>
              </motion.div>
            )}

            {chapterIndex === 2 && (
              <motion.div
                key="k3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[980px]"
              >
                <h2 className="text-4xl leading-[1.02] font-extrabold tracking-[-0.04em] text-white md:text-[80px]">
                  02 Hujan turun, tetap tenang
                </h2>
                <p className="mt-7 text-[13px] tracking-[0.04em] text-[#F5F5F4]">
                  Prakiraan BMKG Dayeuhkolot, 14:00 WIB
                </p>
              </motion.div>
            )}

            {chapterIndex === 3 && (
              <motion.div
                key="k4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto max-w-[1000px] text-center"
              >
                <h2 className="text-4xl leading-[1.05] font-extrabold tracking-[-0.03em] text-[#F5F5F4] md:text-[64px]">
                  <span className="block">Saat sirine berbunyi,</span>
                  <span className="mt-3 block">
                    tidak ada waktu untuk{" "}
                    <span className="text-[#FB923C]">berpikir.</span>
                  </span>
                </h2>
                <p className="mt-6 text-[17px] text-[#9AA4B2]">
                  Rencana yang sudah disiapkan jauh lebih kuat daripada keputusan
                  mendadak.
                </p>
              </motion.div>
            )}

            {chapterIndex === 4 && (
              <motion.div
                key="k5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[980px]"
              >
                <h2 className="text-4xl leading-[1.02] font-extrabold tracking-[-0.03em] text-white md:text-[60px]">
                  03 Semua sampai di titik kumpul.
                </h2>
                <p className="mt-7 max-w-[666px] text-[19px] leading-[1.58] text-[#F5F5F4]">
                  Keluarga Pratama tiba lebih dulu karena rencananya sudah jelas
                  sejak awal.
                </p>
                <div className="mt-8">
                  <Link
                    to="/daftar"
                    className="group inline-flex h-[56px] items-center gap-2.5 rounded-full bg-[#C2410C] px-7 text-[17px] font-semibold text-white transition-transform duration-150 hover:scale-[1.02]"
                  >
                    <span>Buat rencana keluargamu</span>
                    <span className="transition-transform duration-150 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll Indicator vertikal di sisi kanan (persis Node 506, 527, 641) */}
        {!reduce && (
          <div className="absolute top-1/2 right-12 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 text-[13px] md:flex">
            <span className="text-white">{indicatorNumber}</span>
            <span className="h-10 w-px bg-white/40" />
            <span className="text-white/40">04</span>
          </div>
        )}
      </div>
    </section>
  );
}
