import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Check, CloudLightning, Mountain, Waves, X } from "lucide-react";
import { useGenerateQuiz } from "@/hooks/useQuiz";
import { useCreateDrill, useDrills } from "@/hooks/useDrills";
import { cn } from "@/lib/utils";
import type { JenisBencana, QuizShape } from "@/lib/types";

const SKENARIO: { jenis: JenisBencana; label: string; deskripsi: string; icon: typeof Waves }[] = [
  { jenis: "BANJIR", label: "Banjir malam hari", deskripsi: "Air mulai masuk saat semua orang tidur.", icon: Waves },
  { jenis: "GEMPA", label: "Gempa bumi", deskripsi: "Guncangan kuat saat kamu berada di dalam rumah.", icon: Activity },
  { jenis: "LONGSOR", label: "Longsor setelah hujan", deskripsi: "Tanda tanah bergerak di lereng dekat rumah.", icon: Mountain },
  { jenis: "CUACA_EKSTREM", label: "Cuaca ekstrem", deskripsi: "Angin kencang dan petir saat di luar rumah.", icon: CloudLightning },
];

const LABEL: Record<string, string> = Object.fromEntries(SKENARIO.map((s) => [s.jenis, s.label]));

/**
 * Soal bawaan, dipakai HANYA bila asisten AI tidak bisa dihubungi. Isinya langkah umum yang berlaku
 * untuk siapa saja, tanpa nama atau kondisi keluarga tertentu. Tampilan selalu menyebut ini soal bawaan.
 */
const SOAL_BAWAAN: Partial<Record<JenisBencana, QuizShape["soal"]>> = {
  BANJIR: [
    {
      id: 1,
      pertanyaan: "Air mulai masuk ke halaman rumah saat malam hari, dan ada anggota keluarga lansia yang sedang tidur.",
      pilihan: [
        "Membangunkan semua anggota, membantu lansia, lalu bersiap menuju titik kumpul",
        "Menunggu air surut sambil memantau dari jendela",
        "Membiarkan tiap orang mengurus dirinya sendiri",
        "Menyalakan semua alat elektronik di lantai bawah",
      ],
      jawaban_benar_index: 0,
      penjelasan: "Lansia butuh waktu dan bantuan lebih untuk bergerak. Jangan menunggu air makin tinggi.",
    },
    {
      id: 2,
      pertanyaan: "Rumah mulai tergenang dan kamu harus segera pergi. Apa yang dilakukan pada listrik?",
      pilihan: [
        "Mematikan listrik utama jika aman dijangkau dengan tangan kering, lalu keluar",
        "Membiarkan semuanya menyala agar lantai bawah tetap terang",
        "Mencabut kabel sambil berdiri di dalam genangan",
        "Menyiram panel listrik agar dingin",
      ],
      jawaban_benar_index: 0,
      penjelasan: "Listrik dan air berbahaya jika bertemu. Matikan hanya bila aman, dan jangan menyentuh peralatan listrik di dalam air.",
    },
  ],
  GEMPA: [
    {
      id: 1,
      pertanyaan: "Guncangan kuat terasa saat kamu berada di dalam rumah. Apa yang dilakukan lebih dulu?",
      pilihan: [
        "Merunduk, berlindung di bawah meja kokoh, dan melindungi kepala",
        "Berlari keluar secepat mungkin lewat tangga",
        "Berdiri di bawah lampu gantung",
        "Memakai lift untuk turun",
      ],
      jawaban_benar_index: 0,
      penjelasan: "Saat guncangan, risiko terbesar adalah tertimpa benda jatuh. Lindungi kepala dan tetap di tempat sampai guncangan berhenti.",
    },
    {
      id: 2,
      pertanyaan: "Guncangan sudah berhenti. Apa langkah berikutnya?",
      pilihan: [
        "Memeriksa orang di sekitar, lalu keluar hati-hati lewat jalur aman menuju titik kumpul",
        "Segera kembali tidur karena sudah aman",
        "Menyalakan korek api untuk memeriksa kebocoran gas",
        "Naik lift agar cepat sampai bawah",
      ],
      jawaban_benar_index: 0,
      penjelasan: "Gempa susulan bisa terjadi. Keluar dengan hati-hati, hindari lift, dan jangan menyalakan api.",
    },
  ],
  LONGSOR: [
    {
      id: 1,
      pertanyaan: "Hujan deras berjam-jam. Kamu melihat retakan baru di tanah belakang rumah dan air keruh keluar dari lereng.",
      pilihan: [
        "Segera menjauh dari lereng ke tempat yang lebih aman dan melapor ke RT atau BPBD",
        "Menutup retakan dengan tanah lalu tidur",
        "Tetap di rumah karena belum ada yang runtuh",
        "Berdiri di dekat lereng untuk memantau",
      ],
      jawaban_benar_index: 0,
      penjelasan: "Retakan dan air keruh adalah tanda tanah bergerak. Menjauh lebih dulu, lalu laporkan.",
    },
    {
      id: 2,
      pertanyaan: "Longsor kecil sudah terjadi dan terlihat tenang. Bolehkah kembali mengambil barang?",
      pilihan: [
        "Tidak, tunggu petugas menyatakan aman karena longsor susulan bisa terjadi",
        "Boleh, selama hujan sudah reda",
        "Boleh, asal pergi sendirian",
        "Boleh, lewat lereng supaya lebih cepat",
      ],
      jawaban_benar_index: 0,
      penjelasan: "Longsor susulan sering terjadi setelah yang pertama. Tunggu arahan petugas.",
    },
  ],
  CUACA_EKSTREM: [
    {
      id: 1,
      pertanyaan: "Angin kencang dan petir terjadi saat kamu berada di luar rumah. Apa yang dilakukan?",
      pilihan: [
        "Masuk ke bangunan yang kokoh dan menjauhi pohon besar, tiang, dan baliho",
        "Berteduh di bawah pohon tertinggi",
        "Berdiri di tengah lapangan terbuka",
        "Memegang tiang listrik agar tidak terbang",
      ],
      jawaban_benar_index: 0,
      penjelasan: "Pohon tinggi, tiang, dan benda logam menarik petir dan bisa roboh. Cari bangunan kokoh.",
    },
    {
      id: 2,
      pertanyaan: "Sebuah pohon besar dekat rumah mulai miring setelah angin kencang. Apa yang dilakukan?",
      pilihan: [
        "Menjauhi area itu dan melapor ke RT atau petugas",
        "Mengikat pohon dengan tali sendirian",
        "Berteduh di bawahnya sampai hujan reda",
        "Memanjatnya untuk memeriksa",
      ],
      jawaban_benar_index: 0,
      penjelasan: "Pohon yang miring bisa tumbang kapan saja. Jauhi dan minta petugas menanganinya.",
    },
  ],
};

interface Jawab {
  soalId: number;
  pertanyaan: string;
  pilihan: string[];
  dipilih: number;
  benarIndex: number;
  penjelasan: string;
}

type ViewState =
  | { mode: "daftar" }
  | { mode: "main"; jenis: JenisBencana; quiz: QuizShape; bawaan: boolean; i: number; dipilih: number | null; jawaban: Jawab[] }
  | { mode: "skor"; jenis: JenisBencana; bawaan: boolean; jawaban: Jawab[] };

const MINGGU = 7 * 24 * 60 * 60 * 1000;

export function Latihan() {
  const [view, setView] = useState<ViewState>({ mode: "daftar" });
  const [pesan, setPesan] = useState<string | null>(null);
  const generateQuiz = useGenerateQuiz();
  const createDrill = useCreateDrill();
  const { data: drillsData } = useDrills();

  async function mulai(jenis: JenisBencana) {
    setPesan(null);
    let quiz: QuizShape | null = null;
    let bawaan = false;
    try {
      quiz = await generateQuiz.mutateAsync(jenis);
    } catch {
      const soal = SOAL_BAWAAN[jenis];
      if (soal) {
        quiz = { jenis_bencana: jenis, soal };
        bawaan = true;
      }
    }
    if (!quiz || quiz.soal.length === 0) {
      setPesan("Latihan untuk skenario ini belum tersedia. Coba skenario lain.");
      return;
    }
    setView({ mode: "main", jenis, quiz, bawaan, i: 0, dipilih: null, jawaban: [] });
  }

  function pilih(index: number) {
    if (view.mode !== "main" || view.dipilih !== null) return;
    const s = view.quiz.soal[view.i];
    setView({
      ...view,
      dipilih: index,
      jawaban: [
        ...view.jawaban,
        {
          soalId: s.id,
          pertanyaan: s.pertanyaan,
          pilihan: s.pilihan,
          dipilih: index,
          benarIndex: s.jawaban_benar_index,
          penjelasan: s.penjelasan,
        },
      ],
    });
  }

  async function lanjut() {
    if (view.mode !== "main") return;
    const berikut = view.i + 1;
    if (berikut >= view.quiz.soal.length) {
      const benar = view.jawaban.filter((j) => j.dipilih === j.benarIndex).length;
      const skor = Math.round((benar / view.jawaban.length) * 100);
      await createDrill.mutateAsync({ jadwal: new Date().toISOString(), skor }).catch(() => undefined);
      setView({ mode: "skor", jenis: view.jenis, bawaan: view.bawaan, jawaban: view.jawaban });
    } else {
      setView({ ...view, i: berikut, dipilih: null });
    }
  }

  /* ---------- Soal ---------- */
  if (view.mode === "main") {
    const soal = view.quiz.soal[view.i];
    const total = view.quiz.soal.length;
    const sudah = view.dipilih !== null;
    const tepat = sudah && view.dipilih === soal.jawaban_benar_index;
    const persen = Math.round(((view.i + (sudah ? 1 : 0)) / total) * 100);

    return (
      <div className="mx-auto max-w-[680px] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setView({ mode: "daftar" })}
            className="text-[15px] font-medium text-ink-3 hover:text-ink"
          >
            ← Keluar dari latihan
          </button>
          <span className="text-[14px] text-muted">
            {LABEL[view.jenis]} · soal {view.i + 1} dari {total}
          </span>
        </div>

        <div
          role="progressbar"
          aria-label="Kemajuan latihan"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={persen}
          className="h-1.5 w-full overflow-hidden rounded-full bg-line"
        >
          <div className="h-full rounded-full bg-accent-dark transition-[width] duration-500" style={{ width: `${persen}%` }} />
        </div>

        {view.bawaan && (
          <p className="rounded-xl border border-line bg-base px-4 py-3 text-[14px] leading-[1.5] text-ink-3">
            Ini soal bawaan. Asisten AI belum bisa dihubungi, jadi soalnya bukan buatan AI.
          </p>
        )}

        <div className="rounded-2xl border border-line bg-base p-6 md:p-9">
          <p className="text-[22px] leading-[1.35] font-semibold tracking-[-0.015em] text-ink">{soal.pertanyaan}</p>
          <p className="mt-2 text-[16px] text-ink-3">Apa yang kamu lakukan lebih dulu?</p>

          <div className="mt-6 space-y-3">
            {soal.pilihan.map((opsi, i) => {
              const dipilih = view.dipilih === i;
              const benar = i === soal.jawaban_benar_index;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={sudah}
                  onClick={() => pilih(i)}
                  className={cn(
                    "flex min-h-14 w-full items-start gap-3 rounded-2xl border p-4 text-left text-[16px] leading-[1.45] transition-colors",
                    !sudah && "border-line bg-base text-ink hover:border-ink/50",
                    sudah && benar && "border-aman bg-base text-ink",
                    sudah && dipilih && !benar && "border-bahaya bg-base text-ink",
                    sudah && !benar && !dipilih && "border-line bg-base text-muted",
                  )}
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center" aria-hidden="true">
                    {sudah && benar && <Check className="size-5 text-aman" strokeWidth={2.4} />}
                    {sudah && dipilih && !benar && <X className="size-5 text-bahaya" strokeWidth={2.4} />}
                  </span>
                  <span>{opsi}</span>
                </button>
              );
            })}
          </div>

          {sudah && (
            <div role="status" className="mt-6 rounded-2xl bg-surface p-5">
              <p className={cn("text-[16px] font-semibold", tepat ? "text-aman" : "text-bahaya")}>
                {tepat ? "Tepat" : "Kurang tepat"}
              </p>
              {!tepat && (
                <p className="mt-1 text-[15px] text-ink">Jawaban yang tepat: {soal.pilihan[soal.jawaban_benar_index]}</p>
              )}
              <p className="mt-1.5 text-[15px] leading-[1.55] text-ink-3">{soal.penjelasan}</p>
              <button
                type="button"
                onClick={lanjut}
                disabled={createDrill.isPending}
                className="mt-5 h-12 rounded-full bg-accent-dark px-6 text-[15px] font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
              >
                {view.i + 1 >= total ? "Lihat hasil" : "Soal berikutnya"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---------- Hasil ---------- */
  if (view.mode === "skor") {
    const benar = view.jawaban.filter((j) => j.dipilih === j.benarIndex).length;
    const total = view.jawaban.length;
    const skor = Math.round((benar / total) * 100);
    return (
      <div className="mx-auto max-w-[680px] space-y-6">
        <div className="rounded-2xl border border-line bg-base p-6 text-center md:p-9">
          <p className="text-[15px] text-muted">{LABEL[view.jenis]}</p>
          <p className="font-display mt-3 text-[80px] leading-none font-semibold tracking-[-0.04em] text-ink">{skor}</p>
          <p className="mt-3 text-[17px] text-ink-3">
            {benar} dari {total} jawaban tepat
          </p>
          {view.bawaan && <p className="mt-2 text-[13px] text-muted">Dari soal bawaan, bukan buatan AI.</p>}
        </div>

        <ul className="space-y-3">
          {view.jawaban.map((j, n) => {
            const tepat = j.dipilih === j.benarIndex;
            return (
              <li key={j.soalId} className="rounded-2xl border border-line bg-base p-5">
                <p className="flex items-start gap-2 text-[16px] font-semibold text-ink">
                  {tepat ? (
                    <Check className="mt-0.5 size-5 shrink-0 text-aman" strokeWidth={2.4} aria-label="Tepat" />
                  ) : (
                    <X className="mt-0.5 size-5 shrink-0 text-bahaya" strokeWidth={2.4} aria-label="Kurang tepat" />
                  )}
                  <span>
                    {n + 1}. {j.pertanyaan}
                  </span>
                </p>
                {!tepat && (
                  <p className="mt-2 pl-7 text-[15px] text-ink">Yang tepat: {j.pilihan[j.benarIndex]}</p>
                )}
                <p className="mt-1.5 pl-7 text-[14px] leading-[1.55] text-ink-3">{j.penjelasan}</p>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setView({ mode: "daftar" })}
            className="h-12 flex-1 rounded-full bg-accent-dark text-[15px] font-semibold text-white hover:bg-accent-hover"
          >
            Coba skenario lain
          </button>
          <Link
            to="/rencana"
            className="flex h-12 flex-1 items-center justify-center rounded-full border border-line bg-base text-[15px] font-semibold text-ink hover:bg-tint"
          >
            Lihat rencana keluarga
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- Daftar ---------- */
  const drills = drillsData?.drills ?? [];
  const mingguIni = drills.filter((d) => Date.now() - new Date(d.jadwal).getTime() < MINGGU).length;

  return (
    <div className="space-y-10">
      <div>
        <h1>Latihan</h1>
        <p className="mt-1 max-w-[56ch] text-[16px] text-ink-3">
          Pilih satu skenario. Setiap latihan berisi beberapa pertanyaan singkat tentang langkah pertama yang tepat.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {SKENARIO.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.jenis}>
              <button
                type="button"
                onClick={() => mulai(s.jenis)}
                disabled={generateQuiz.isPending}
                className="flex w-full items-start gap-4 rounded-2xl border border-line bg-base p-5 text-left transition-colors hover:border-ink/40 disabled:opacity-60"
              >
                <Icon className="mt-0.5 size-6 shrink-0 text-ink-3" strokeWidth={1.5} aria-hidden="true" />
                <span>
                  <span className="block text-[18px] font-semibold tracking-[-0.01em] text-ink">{s.label}</span>
                  <span className="mt-1 block text-[15px] leading-[1.5] text-ink-3">{s.deskripsi}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div role="status" aria-live="polite">
        {generateQuiz.isPending && <p className="text-[15px] text-ink-3">Menyiapkan soal…</p>}
        {pesan && <p className="text-[15px] text-bahaya">{pesan}</p>}
      </div>

      <section>
        <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Ringkasan latihan</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["Latihan dicoba", drills.length],
            ["Rata-rata skor", drillsData?.rata_rata_skor != null ? Math.round(drillsData.rata_rata_skor) : "–"],
            ["Minggu ini", mingguIni],
          ].map(([label, nilai]) => (
            <div key={label} className="rounded-2xl border border-line bg-base p-5">
              <dt className="text-[14px] text-muted">{label}</dt>
              <dd className="font-display mt-1 text-[34px] leading-none font-semibold tracking-[-0.03em] text-ink">{nilai}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
