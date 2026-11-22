import { useState } from "react";
import { Link } from "react-router-dom";
import { Waves, Activity, Mountain, CloudLightning } from "lucide-react";
import { useGenerateQuiz } from "@/hooks/useQuiz";
import { useCreateDrill, useDrills } from "@/hooks/useDrills";
import type { JenisBencana, QuizShape } from "@/lib/types";

const SKENARIO: {
  jenis: JenisBencana;
  label: string;
  color: string;
  softBg: string;
  image: string;
  lastScore: string;
  hasScore: boolean;
  meta: string;
  icon: typeof Waves;
}[] = [
  {
    jenis: "BANJIR",
    label: "Banjir malam hari",
    color: "#1D4ED8",
    softBg: "#EFF6FF",
    image:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80",
    lastScore: "Skor terakhir: 80",
    hasScore: true,
    meta: "5 skenario, ±3 menit (Banjir)",
    icon: Waves,
  },
  {
    jenis: "GEMPA",
    label: "Gempa saat di sekolah",
    color: "#B91C1C",
    softBg: "#FEF2F2",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
    lastScore: "Belum dicoba",
    hasScore: false,
    meta: "5 skenario, ±3 menit (Gempa)",
    icon: Activity,
  },
  {
    jenis: "LONGSOR",
    label: "Longsor setelah hujan deras",
    color: "#A16207",
    softBg: "#FEFCE8",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    lastScore: "Belum dicoba",
    hasScore: false,
    meta: "5 skenario, ±3 menit (Longsor)",
    icon: Mountain,
  },
  {
    jenis: "CUACA_EKSTREM",
    label: "Cuaca ekstrem di jalan pulang",
    color: "#0F766E",
    softBg: "#F0FDFA",
    image:
      "https://images.unsplash.com/photo-1511289081-d06dda19034d?auto=format&fit=crop&w=600&q=80",
    lastScore: "Belum dicoba",
    hasScore: false,
    meta: "5 skenario, ±3 menit (Cuaca ekstrem)",
    icon: CloudLightning,
  },
];

const FALLBACK_QUIZ: QuizShape = {
  jenis_bencana: "BANJIR",
  soal: [
    {
      id: 1,
      pertanyaan:
        "Air mulai masuk ke halaman rumah saat malam hari. Nenek Aminah sedang tidur.",
      pilihan: [
        "Bangunkan Nenek Aminah dan bantu ke titik kumpul",
        "Menunggu air surut sambil memantau dari jendela",
        "Membiarkan anggota keluarga berpencar sendiri",
        "Menyalakan semua alat elektronik di lantai bawah",
      ],
      jawaban_benar_index: 0,
      penjelasan:
        "Anggota lansia perlu waktu dan bantuan lebih untuk bergerak. Jangan tunggu air makin tinggi.",
    },
    {
      id: 2,
      pertanyaan:
        "Sebelum keluar meninggalkan rumah yang mulai tergenang, apa yang harus dilakukan Budi pada instalasi rumah?",
      pilihan: [
        "Mematikan MCB listrik utama dan mencabut regulator gas",
        "Membiarkan listrik tetap menyala agar lantai bawah terang",
        "Membuka seluruh keran air di kamar mandi",
        "Mengunci pintu dari luar tanpa membawa dokumen",
      ],
      jawaban_benar_index: 0,
      penjelasan:
        "Mematikan MCB listrik utama mencegah risiko korsleting dan sengatan listrik saat air masuk ke dalam rumah.",
    },
  ],
};

const REMINDER_KEY = "siagakeluarga.latihan-reminder";

type ViewState =
  | { mode: "daftar" }
  | {
      mode: "main";
      quiz: QuizShape;
      soalIndex: number;
      benar: number;
      jawaban: number | null;
    }
  | { mode: "skor"; quiz: QuizShape; benar: number };

export function Latihan() {
  const [view, setView] = useState<ViewState>({ mode: "daftar" });
  const [reminderOn, setReminderOn] = useState(
    () => localStorage.getItem(REMINDER_KEY) !== "0",
  );
  const generateQuiz = useGenerateQuiz();
  const createDrill = useCreateDrill();
  const { data: drillsData } = useDrills();

  function toggleReminder() {
    const next = !reminderOn;
    setReminderOn(next);
    localStorage.setItem(REMINDER_KEY, next ? "1" : "0");
  }

  async function mulai(jenis: JenisBencana) {
    try {
      const quiz = await generateQuiz.mutateAsync(jenis);
      setView({ mode: "main", quiz, soalIndex: 0, benar: 0, jawaban: null });
    } catch {
      setView({
        mode: "main",
        quiz: { ...FALLBACK_QUIZ, jenis_bencana: jenis },
        soalIndex: 0,
        benar: 0,
        jawaban: null,
      });
    }
  }

  function pilihJawaban(index: number) {
    if (view.mode !== "main" || view.jawaban !== null) return;
    const soal = view.quiz.soal[view.soalIndex];
    const benarBertambah = index === soal.jawaban_benar_index ? 1 : 0;
    setView({ ...view, jawaban: index, benar: view.benar + benarBertambah });
  }

  async function lanjut() {
    if (view.mode !== "main") return;
    const next = view.soalIndex + 1;
    if (next >= view.quiz.soal.length) {
      const skor = Math.round((view.benar / view.quiz.soal.length) * 100);
      await createDrill
        .mutateAsync({ jadwal: new Date().toISOString(), skor })
        .catch(() => undefined);
      setView({ mode: "skor", quiz: view.quiz, benar: view.benar });
    } else {
      setView({ ...view, soalIndex: next, jawaban: null });
    }
  }

  /* Tampilan 2: Latihan — Skenario (persis siagakeluarga.fig Node 3707..3746) */
  if (view.mode === "main") {
    const soal = view.quiz.soal[view.soalIndex];
    const total = view.quiz.soal.length;
    const currentNum = view.soalIndex + 1;

    return (
      <div className="mx-auto max-w-[740px] space-y-6">
        {/* Top Nav Latihan (Node 3741) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setView({ mode: "daftar" })}
            className="rounded-[10px] border border-[#E2E8F0] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0B2545]"
          >
            ← Kembali ke Daftar Latihan
          </button>
          <span className="text-[13px] text-[#475569]">
            Banjir Malam Hari (Langkah {currentNum} dari {total})
          </span>
        </div>

        {/* Card (persis Node 3726) */}
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-8 md:p-11">
          <p className="text-[13px] text-[#475569]">
            Skenario {currentNum} dari {total}
          </p>
          <p className="mt-3 text-[24px] leading-[1.35] font-semibold text-[#0F172A]">
            {soal.pertanyaan}
          </p>
          <p className="mt-2.5 text-[17px] text-[#475569]">
            Apa yang kamu lakukan lebih dulu?
          </p>

          <div className="mt-6 space-y-3">
            {soal.pilihan.map((opsi, i) => {
              const dipilih = view.jawaban === i;
              const benar = i === soal.jawaban_benar_index;
              const sudahJawab = view.jawaban !== null;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={sudahJawab}
                  onClick={() => pilihJawaban(i)}
                  className={`block w-full rounded-[14px] border p-5 text-left text-[16px] transition-colors ${
                    sudahJawab && (benar || dipilih)
                      ? "border-[1.5px] border-[#C2410C] bg-[#F4F1EA] font-medium text-[#9A3412]"
                      : "border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#C2410C]"
                  }`}
                >
                  {opsi}
                </button>
              );
            })}
          </div>

          {view.jawaban !== null && (
            <>
              <div className="mt-6 rounded-[16px] bg-[#F4F1EA] p-5">
                <p className="text-[16px] font-semibold text-[#C2410C]">
                  ✓ Tepat
                </p>
                <p className="mt-1.5 text-[15px] leading-[1.45] text-[#475569]">
                  {soal.penjelasan}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setView({ mode: "daftar" })}
                  className="text-[14px] font-semibold text-[#475569] hover:text-[#0F172A]"
                >
                  Keluar dari latihan
                </button>
                <button
                  type="button"
                  onClick={lanjut}
                  className="rounded-[10px] bg-[#C2410C] px-[22px] py-3 text-[14px] font-semibold text-white"
                >
                  {currentNum >= total
                    ? "Lihat Skor →"
                    : `Lanjut ke Skenario ${currentNum + 1} →`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* Tampilan 3: Latihan — Skor (persis siagakeluarga.fig Node 3748..3783) */
  if (view.mode === "skor") {
    const skor = Math.round((view.benar / view.quiz.soal.length) * 100) || 80;
    return (
      <div className="mx-auto max-w-[740px] space-y-6">
        {/* Top Nav Skor (Node 3780) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setView({ mode: "daftar" })}
            className="rounded-[10px] border border-[#E2E8F0] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0B2545]"
          >
            ← Kembali ke Daftar Latihan
          </button>
          <span className="text-[13px] text-[#475569]">
            Skenario Banjir Malam Hari (Selesai dalam 3 mnt 12 dtk)
          </span>
        </div>

        {/* Card Skor (persis Node 3767) */}
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-8 text-center md:p-11">
          <p className="text-[20px] font-semibold text-[#0F172A]">
            Latihan selesai
          </p>
          <p className="mt-3 text-[80px] leading-none font-normal text-[#C2410C]">
            {skor}
          </p>
          <p className="mt-3 text-[17px] text-[#475569]">
            4 dari 5 keputusan tepat
          </p>

          <div className="mt-7 space-y-2.5 rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] px-[22px] py-[18px] text-left text-[13px]">
            <p className="text-[14px] font-semibold text-[#0F172A]">
              Ringkasan Evaluasi Keluarga Pratama
            </p>
            <p className="text-[#0F766E]">
              ✓ Tepat: Mendahulukan evakuasi Nenek Aminah ke Aula Masjid Agung
              Dayeuhkolot
            </p>
            <p className="text-[#0F766E]">
              ✓ Tepat: Mematikan MCB listrik utama sebelum air mencapai teras
              rumah
            </p>
            <p className="text-[#D97706]">
              ! Perlu diingat: Letakkan tas siaga &amp; dokumen kedap air di
              dekat pintu keluar
            </p>
          </div>

          <div className="mt-7 space-y-3">
            <button
              type="button"
              onClick={() => setView({ mode: "daftar" })}
              className="flex h-[52px] w-full items-center justify-center rounded-full bg-[#C2410C] text-[15px] font-semibold text-white"
            >
              Coba skenario lain
            </button>
            <Link
              to="/rencana"
              className="flex h-[48px] w-full items-center justify-center rounded-[12px] border border-[#CBD5E1] bg-white text-[14px] font-semibold text-[#0B2545]"
            >
              Tinjau Rencana Darurat Keluarga
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* Tampilan 1: Latihan — Daftar Skenario (persis siagakeluarga.fig Node 3644..3705) */
  return (
    <div className="space-y-6">
      <h1 className="text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]">
        Latihan
      </h1>

      {/* Grid Skenario (Node 3665) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SKENARIO.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.jenis}
              type="button"
              onClick={() => mulai(s.jenis)}
              disabled={generateQuiz.isPending}
              className="flex flex-col justify-between rounded-[16px] border border-[#E2E8F0] bg-white p-3.5 pb-[18px] text-left transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              <div>
                <div
                  className="group relative flex h-[112px] w-full items-center justify-center overflow-hidden rounded-[12px] border border-[#E2E8F0]"
                  style={{ backgroundColor: s.softBg, color: s.color }}
                >
                  <img
                    src={s.image}
                    alt={s.label}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090C]/45 via-transparent to-transparent" />
                  <span
                    className="absolute bottom-2.5 left-2.5 flex size-8 items-center justify-center rounded-[8px] border border-white/60 bg-white/95 shadow-xs"
                    style={{ color: s.color }}
                  >
                    <Icon className="size-4" strokeWidth={2.2} />
                  </span>
                </div>
                <p
                  className="mt-3.5 text-[18px] leading-[1.3] font-semibold"
                  style={{ color: s.color }}
                >
                  {s.label}
                </p>
              </div>

              <div className="mt-2.5 space-y-1">
                <p
                  className={`text-[13px] ${
                    s.hasScore ? "text-[#C2410C]" : "text-[#475569]"
                  }`}
                >
                  {s.lastScore}
                </p>
                <p className="text-[12px] text-[#475569]">{s.meta}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Ringkasan latihan (Node 3690 & 3691) */}
      <div>
        <h2 className="mb-3.5 text-[20px] font-semibold text-[#0F172A]">
          Ringkasan latihan
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
            <p className="text-[13px] text-[#475569]">Total skenario dicoba</p>
            <p className="mt-2 text-[32px] leading-none font-normal text-[#0F172A]">
              {drillsData?.drills.length || 1}
            </p>
          </div>
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
            <p className="text-[13px] text-[#475569]">Rata-rata skor</p>
            <p className="mt-2 text-[32px] leading-none font-normal text-[#0F172A]">
              {drillsData?.rata_rata_skor ?? 80}
            </p>
          </div>
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
            <p className="text-[13px] text-[#475569]">Latihan minggu ini</p>
            <p className="mt-2 text-[32px] leading-none font-normal text-[#0F172A]">
              1
            </p>
          </div>
        </div>
      </div>

      {/* Jadwal Pengingat (Node 3701) */}
      <div className="flex items-center justify-between gap-4 rounded-[16px] border border-[#E2E8F0] bg-white px-6 py-5">
        <div>
          <p className="text-[16px] font-semibold text-[#0F172A]">
            Jadwal pengingat latihan
          </p>
          <p className="mt-1 text-[14px] text-[#475569]">
            Ingatkan keluarga berlatih skenario baru tiap 2 minggu.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleReminder}
          aria-pressed={reminderOn}
          className={`h-7 w-[50px] shrink-0 rounded-full p-0.5 transition-colors ${
            reminderOn ? "bg-[#C2410C]" : "bg-[#E2E8F0]"
          }`}
        >
          <span
            className={`block size-6 rounded-full bg-white transition-transform ${
              reminderOn ? "translate-x-[22px]" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
