import { useRef, useState } from "react";
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
import { HeroFrames } from "@/components/sections/HeroFrames";

/**
 * Lima babak hero. Setiap babak punya satu kalimat dan satu lapisan visual.
 * "tone" menentukan warna teks: terang di atas foto terang, gelap di atas
 * foto gelap.
 */
const CHAPTERS = [
  { key: "cerah", label: "Cerah", tone: "light" as const },
  { key: "jalur", label: "Jalur", tone: "light" as const },
  { key: "hujan", label: "Hujan", tone: "dark" as const },
  { key: "badai", label: "Badai", tone: "dark" as const },
  { key: "aman", label: "Aman", tone: "light" as const },
];

const N = CHAPTERS.length;

/**
 * Tanpa efek tempelan (hujan, kilat, kartu, partikel): foto dan teks sudah cukup.
 * Satu-satunya lapisan adalah peredam gelap tipis di babak badai supaya teks tengah terbaca.
 */
function ChapterLayer({
  chapter,
  index,
  scrollYProgress,
  reduce,
}: {
  chapter: (typeof CHAPTERS)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
  reduce: boolean | null;
}) {
  const start = index / N;
  const end = (index + 1) / N;
  const mid = (start + end) / 2;
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.03, mid, end - 0.03, end],
    [0, 1, 1, 1, 0],
  );

  // Babak Hujan: rintik hujan lembut
  if (chapter.key === "hujan") {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden bg-night/35"
        style={{ opacity: reduce ? 1 : opacity }}
      >
        <svg
          viewBox="0 0 1440 900"
          className="absolute inset-0 h-full w-full pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          {Array.from({ length: 20 }).map((_, idx) => {
            const x1 = 200 + ((idx * 65) % 1100);
            const y1 = 60 + ((idx * 85) % 700);
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x1 - 12}
                y2={y1 + 55}
                stroke="#E2E8F0"
                strokeOpacity="0.32"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </motion.div>
    );
  }

  // Babak Badai: Sambaran petir dramatis + kilatan cahaya (lightning flash)
  if (chapter.key === "badai") {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden bg-night/65"
        style={{ opacity: reduce ? 1 : opacity }}
      >
        {/* Glow langit saat badai */}
        <div
          className="pointer-events-none absolute top-[-50px] left-1/2 h-[750px] w-[950px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(147, 197, 253, 0.28) 0%, rgba(59, 130, 246, 0.08) 45%, transparent 70%)",
          }}
        />

        {/* Sambaran Kilat Petir Realistis & Cahaya Layar (Flash) */}
        {!reduce && (
          <>
            <motion.div
              className="absolute inset-0 bg-white"
              animate={{ opacity: [0, 0, 0.28, 0.04, 0.38, 0, 0, 0.16, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.8 }}
            />

            <svg
              viewBox="0 0 1440 900"
              className="pointer-events-none absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Kilat Utama */}
              <motion.path
                d="M 748 40 L 730 142 L 758 148 L 732 260 L 760 268 L 720 390 L 738 395 L 710 490"
                fill="none"
                stroke="#F0F9FF"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="drop-shadow(0 0 10px rgba(186, 230, 253, 0.95))"
                animate={{ opacity: [0, 0, 1, 0.15, 1, 0, 0, 0.75, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.8 }}
              />
              {/* Cabang Kilat 1 */}
              <motion.path
                d="M 732 260 L 700 310 L 712 318 L 685 370"
                fill="none"
                stroke="#BAE6FD"
                strokeWidth="1.6"
                strokeLinecap="round"
                filter="drop-shadow(0 0 6px rgba(186, 230, 253, 0.8))"
                animate={{ opacity: [0, 0, 0.9, 0.1, 0.85, 0, 0, 0.6, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.8 }}
              />
              {/* Kilat Samping Kanan */}
              <motion.path
                d="M 988 30 L 974 114 L 996 120 L 972 220 L 990 228 L 968 320"
                fill="none"
                stroke="#BAE6FD"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="drop-shadow(0 0 8px rgba(147, 197, 253, 0.85))"
                animate={{ opacity: [0, 0, 0.95, 0.1, 0.9, 0, 0, 0.5, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.8, delay: 0.05 }}
              />
              {/* Kilat Samping Kiri */}
              <motion.path
                d="M 410 60 L 430 135 L 412 142 L 428 220"
                fill="none"
                stroke="#E0F2FE"
                strokeWidth="1.5"
                strokeLinecap="round"
                filter="drop-shadow(0 0 6px rgba(224, 242, 254, 0.75))"
                animate={{ opacity: [0, 0, 0, 0, 0.85, 0, 0.4, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.8, delay: 0.12 }}
              />
            </svg>
          </>
        )}
      </motion.div>
    );
  }

  return null;
}

function ChapterCopy({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="max-w-[720px]">
        <h1 className="t-display text-white">
          Siap bersama, <span className="text-[#ff8a4c]">sebelum</span> bencana
          datang.
        </h1>
        <p className="mt-6 max-w-[54ch] t-lead text-white/85 md:text-[19px]">
          Satu halaman berisi titik kumpul, tugas tiap anggota, dan isi tas
          siaga. Ditulis sekarang, dibaca saat air sudah naik.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/daftar"
            className="inline-flex h-13 items-center gap-2 rounded-full bg-white px-7 text-[16px] font-semibold text-ink transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Buat rencana gratis
          </Link>
          <a
            href="#cara-kerja"
            className="inline-flex h-13 items-center rounded-full border border-white/45 px-7 text-[16px] font-semibold text-white transition-colors hover:bg-white/10"
          >
            Lihat cara kerja
          </a>
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="max-w-[680px]">
        <h2 className="t-h2 text-white">
          Kenali rumahmu, dan jalur ke titik kumpul.
        </h2>
        <p className="mt-6 max-w-[50ch] t-lead text-white/85">
          Satu tempat aman yang semua orang tahu, dan satu rute yang tidak
          menanjak. Dipilih bersama, bukan diserahkan ke siren.
        </p>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="max-w-[640px]">
        <h2 className="t-h2 text-white">
          Hujan turun, keluargamu tetap tenang.
        </h2>
        <p className="mt-6 max-w-[48ch] t-lead text-white/85">
          Bukan angka untuk seluruh kota: prakiraan BMKG untuk kelurahan
          rumah, dibaca ulang tiap tiga jam.
        </p>
      </div>
    );
  }

  if (index === 3) {
    return (
      <div className="mx-auto max-w-[840px] text-center">
        <h2 className="t-h2 text-white">
          Saat sirine berbunyi, tidak ada waktu untuk berpikir.
        </h2>
        <p className="mx-auto mt-6 max-w-[46ch] t-lead text-white/80">
          Yang sudah ditulis hari itu yang menentukan arah jalan hari itu.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[680px]">
      <h2 className="t-h2 text-white">
        Semua sampai di titik kumpul.
      </h2>
      <p className="mt-6 max-w-[50ch] t-lead text-white/85">
       Bawa obatnya, bawa tasnya. Semuanya sudah kamu tulis sebelum hari itu.
      </p>
      <Link
        to="/daftar"
        className="mt-8 inline-flex h-13 items-center rounded-full bg-white px-7 text-[16px] font-semibold text-ink transition-transform hover:scale-[1.02] active:scale-[0.99]"
      >
        Buat rencana keluargamu
      </Link>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [chapterIndex, setChapterIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const videoProgress = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const amanOpacity = useTransform(scrollYProgress, [0.78, 0.9], [0, 1]);
  const amanScale = useTransform(scrollYProgress, [0.78, 1], [1.05, 1]);
  const scrimOpacity = useTransform(scrollYProgress, [0, 0.25], [0.82, 0.9]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setChapterIndex(Math.min(N - 1, Math.floor(v * N)));
  });

  const chapter = CHAPTERS[chapterIndex];


  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: reduce ? "100svh" : `${N * 100}vh` }}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-night">
        <HeroFrames progress={videoProgress} className="absolute inset-0 size-full" />

        {/* Foto "aman" menutup video pada babak terakhir. */}
        <motion.div className="absolute inset-0" style={{ opacity: reduce ? 0 : amanOpacity }}>
          <motion.picture className="block size-full" style={{ scale: reduce ? 1 : amanScale }}>
            <source media="(max-width: 767px)" srcSet="/hero/aman-m.webp" />
            <img src="/hero/aman.webp" alt="" className="size-full object-cover object-[35%_50%]" />
          </motion.picture>
        </motion.div>

        {/* Scrim: teks selalu putih, jadi latar foto digelapkan dari kiri. */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: reduce ? 0.85 : scrimOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-night via-night/55 to-transparent md:via-night/30" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/70 to-transparent" />
        </motion.div>

        {CHAPTERS.map((item, i) => (
          <ChapterLayer
            key={item.key}
            chapter={item}
            index={i}
            scrollYProgress={scrollYProgress}
            reduce={reduce}
          />
        ))}

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1240px] flex-col justify-center px-5 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-white"
            >
              <ChapterCopy index={chapterIndex} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Penanda data live di kiri bawah. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-[1240px] items-end justify-between gap-4 px-5 pb-6 md:px-8 md:pb-8">

          {/* Relrail babak: lima segmen, yang aktif diberi panjang dan warna. */}
          <ol className="ml-auto flex items-center gap-2" aria-label="Babak cerita">
            {CHAPTERS.map((item, i) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => {
                    const el = ref.current;
                    if (!el) return;
                    const top = el.offsetTop + (i + 0.5) * (el.offsetHeight / N) - window.innerHeight / 2;
                    window.scrollTo({ top, behavior: "smooth" });
                  }}
                  aria-current={i === chapterIndex}
                  className="group flex h-8 items-center"
                >
                  <span
                    className={
                      i === chapterIndex
                        ? "block h-[3px] w-10 rounded-full bg-white transition-all"
                        : "block h-[3px] w-4 rounded-full bg-white/35 transition-all group-hover:bg-white/60"
                    }
                  />
                  <span className="sr-only">{item.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
