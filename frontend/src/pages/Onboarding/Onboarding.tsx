import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, LocateFixed, Search, Trash2 } from "lucide-react";
import { useAddMember, useUpdateHousehold } from "@/hooks/useHousehold";
import { useRegions } from "@/hooks/useRisk";
import { useGeneratePlan } from "@/hooks/usePlan";
import { useLokasi } from "@/hooks/useLokasi";
import { useCuaca } from "@/hooks/useCuaca";
import { useCariLokasi } from "@/hooks/useCariLokasi";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import type { KelompokUmur } from "@/lib/types";

interface DraftMember {
  panggilan: string;
  kelompok_umur: KelompokUmur;
  kebutuhan_khusus: string;
}

const UMUR: { value: KelompokUmur; label: string; hint: string }[] = [
  { value: "DEWASA", label: "Dewasa", hint: "18 tahun ke atas" },
  { value: "LANSIA", label: "Lansia", hint: "60 tahun ke atas" },
  { value: "ANAK", label: "Anak", hint: "6 sampai 17 tahun" },
  { value: "BALITA", label: "Balita", hint: "di bawah 6 tahun" },
];

const KEBUTUHAN = ["Obat rutin", "Butuh bantuan berjalan", "Alergi", "Pakai kursi roda"];

const AI_STEPS = [
  "Menyimpan anggota keluarga",
  "Menyimpan lokasi rumah",
  "Menyusun tugas dan titik kumpul",
];

const TOTAL_LANGKAH = 2;

export function Onboarding() {
  const navigate = useNavigate();
  // 1 = anggota, 2 = lokasi, 3 = menyusun, 4 = selesai
  const [step, setStep] = useState(1);
  const [members, setMembers] = useState<DraftMember[]>([]);

  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState<KelompokUmur>("DEWASA");
  const [kebutuhan, setKebutuhan] = useState<string[]>([]);

  const [aiStepIndex, setAiStepIndex] = useState(0);
  const [aiError, setAiError] = useState<string | null>(null);

  const lokasi = useLokasi();
  const adaLokasi = lokasi.status === "gps" || lokasi.status === "dipilih";
  const { data: cuaca } = useCuaca(lokasi.lat, lokasi.lng, adaLokasi);
  const { data: regions } = useRegions();
  const cari = useCariLokasi();
  const [q, setQ] = useState("");

  const addMember = useAddMember();
  const updateHousehold = useUpdateHousehold();
  const generatePlan = useGeneratePlan();

  // Cocokkan wilayah terbaca dengan wilayah yang punya data titik kumpul. Tidak cocok = tanpa wilayah,
  // bukan dipaksa ke wilayah lain.
  const regionId = useMemo(() => {
    const kec = cuaca?.wilayah.kecamatan?.toLowerCase();
    if (!kec) return null;
    return regions?.find((r) => r.kecamatan.toLowerCase() === kec)?.id ?? null;
  }, [cuaca, regions]);

  const namaLokasi = cuaca
    ? [cuaca.wilayah.desa, cuaca.wilayah.kecamatan, cuaca.wilayah.kotkab].filter(Boolean).join(", ")
    : null;

  function toggleKebutuhan(k: string) {
    setKebutuhan((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  }

  function tambahAnggota(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim()) return;
    setMembers((prev) => [
      ...prev,
      { panggilan: nama.trim(), kelompok_umur: umur, kebutuhan_khusus: kebutuhan.join(", ") },
    ]);
    setNama("");
    setUmur("DEWASA");
    setKebutuhan([]);
  }

  async function selesai() {
    setStep(3);
    setAiError(null);
    setAiStepIndex(0);
    try {
      for (const m of members) {
        await addMember.mutateAsync({
          panggilan: m.panggilan,
          kelompok_umur: m.kelompok_umur,
          kebutuhan_khusus: m.kebutuhan_khusus || null,
        });
      }
      setAiStepIndex(1);
      if (adaLokasi) {
        await updateHousehold.mutateAsync({ region_id: regionId, lat: lokasi.lat, lng: lokasi.lng });
      }
      setAiStepIndex(2);
      await generatePlan.mutateAsync();
      setAiStepIndex(3);
      setStep(4);
    } catch (err) {
      setAiError(
        err instanceof Error && err.message
          ? err.message
          : "Rencana belum bisa disusun sekarang.",
      );
    }
  }

  const persen = step === 1 ? 8 : step === 2 ? 50 : 100;

  return (
    <div className="flex min-h-svh flex-col bg-paper">
      {/* Bilah kemajuan: terlihat sejak layar pertama, bergerak halus. */}
      <div
        role="progressbar"
        aria-label="Kemajuan pengisian"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={persen}
        className="h-1.5 w-full bg-line"
      >
        <div
          className="h-full rounded-r-full bg-accent-dark transition-[width] duration-500 ease-[var(--ease-out)]"
          style={{ width: `${persen}%` }}
        />
      </div>

      <header className="shell flex h-16 items-center justify-between">
        <Link to="/" aria-label="SiagaKeluarga, beranda">
          <Logo />
        </Link>
        {step <= TOTAL_LANGKAH && (
          <p className="text-[14px] text-muted">
            Langkah {step} dari {TOTAL_LANGKAH}
          </p>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col px-5 pt-6 pb-10 md:pt-12">
        {/* ---------- Langkah 1: anggota ---------- */}
        {step === 1 && (
          <section className="flex flex-1 flex-col">
            <h1 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.03em] text-ink md:text-[40px]">
              Siapa saja yang tinggal di rumahmu?
            </h1>
            <p className="mt-3 text-[17px] leading-[1.6] text-ink-3">
              Mulai dari dirimu sendiri. Tidak perlu sempurna, semuanya bisa diubah nanti.
            </p>

            {members.length > 0 && (
              <ul className="mt-8 space-y-2.5">
                {members.map((m, i) => (
                  <li key={i} className="flex items-center gap-4 rounded-2xl border border-line bg-base p-4">
                    <span
                      aria-hidden="true"
                      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-tint text-[15px] font-semibold text-ink"
                    >
                      {m.panggilan[0]?.toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[17px] font-semibold text-ink">{m.panggilan}</p>
                      <p className="truncate text-[14px] text-ink-3">
                        {UMUR.find((u) => u.value === m.kelompok_umur)?.label}
                        {m.kebutuhan_khusus ? ` · ${m.kebutuhan_khusus}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMembers((prev) => prev.filter((_, idx) => idx !== i))}
                      aria-label={`Hapus ${m.panggilan}`}
                      className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-tint hover:text-bahaya"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={tambahAnggota} className="mt-8 space-y-6">
              <div>
                <label htmlFor="nama" className="block text-[15px] font-medium text-ink">
                  Nama panggilan
                </label>
                <input
                  id="nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Mis. Ibu, Bapak, atau nama anak"
                  autoComplete="off"
                  className="mt-2 h-14 w-full rounded-2xl border border-line bg-base px-4 text-[17px] text-ink outline-none transition-colors focus:border-ink"
                />
              </div>

              <fieldset>
                <legend className="text-[15px] font-medium text-ink">Kelompok usia</legend>
                <div className="mt-2 grid grid-cols-2 gap-2.5">
                  {UMUR.map((u) => (
                    <button
                      key={u.value}
                      type="button"
                      onClick={() => setUmur(u.value)}
                      aria-pressed={umur === u.value}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-left transition-colors",
                        umur === u.value
                          ? "border-ink bg-ink text-white"
                          : "border-line bg-base text-ink hover:border-ink/40",
                      )}
                    >
                      <span className="block text-[16px] font-semibold">{u.label}</span>
                      <span className={cn("block text-[13px]", umur === u.value ? "text-white/70" : "text-muted")}>
                        {u.hint}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-[15px] font-medium text-ink">
                  Ada kebutuhan khusus? <span className="font-normal text-muted">(boleh dikosongkan)</span>
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {KEBUTUHAN.map((k) => {
                    const on = kebutuhan.includes(k);
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => toggleKebutuhan(k)}
                        aria-pressed={on}
                        className={cn(
                          "inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-[15px] transition-colors",
                          on ? "border-accent-dark bg-accent-soft text-accent-hover" : "border-line bg-base text-ink-3 hover:border-ink/40",
                        )}
                      >
                        {on && <Check className="size-4" aria-hidden="true" />}
                        {k}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={!nama.trim()}
                className="h-12 rounded-full border border-ink px-6 text-[16px] font-semibold text-ink hover:bg-tint disabled:opacity-40"
              >
                {members.length === 0 ? "Tambahkan" : "Tambahkan anggota lain"}
              </button>
            </form>

            <div className="mt-auto flex flex-col gap-3 pt-10">
              <button
                type="button"
                disabled={members.length === 0}
                onClick={() => setStep(2)}
                className="h-14 rounded-full bg-accent-dark text-[17px] font-semibold text-white hover:bg-accent-hover disabled:opacity-40"
              >
                Lanjut
              </button>
              {members.length === 0 && (
                <p className="text-center text-[14px] text-muted">Tambahkan minimal satu orang untuk melanjutkan.</p>
              )}
            </div>
          </section>
        )}

        {/* ---------- Langkah 2: lokasi ---------- */}
        {step === 2 && (
          <section className="flex flex-1 flex-col">
            <h1 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.03em] text-ink md:text-[40px]">
              Di mana rumahmu?
            </h1>
            <p className="mt-3 text-[17px] leading-[1.6] text-ink-3">
              Lokasi dipakai untuk mencari titik kumpul terdekat dan prakiraan cuaca BMKG di kelurahanmu.
            </p>

            <button
              type="button"
              onClick={lokasi.minta}
              disabled={lokasi.status === "meminta"}
              className="mt-8 flex h-14 items-center justify-center gap-2.5 rounded-full border border-ink text-[16px] font-semibold text-ink hover:bg-tint disabled:opacity-60"
            >
              <LocateFixed className="size-5" aria-hidden="true" />
              {lokasi.status === "meminta" ? "Menunggu izin lokasi…" : "Pakai lokasiku sekarang"}
            </button>

            <p className="my-5 text-center text-[14px] text-muted">atau cari tempatnya</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (q.trim().length >= 3) cari.mutate(q.trim());
              }}
              className="flex items-center gap-2 rounded-full border border-line bg-base p-1.5 pl-4 focus-within:border-ink"
            >
              <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
              <label htmlFor="lokasi-q" className="sr-only">
                Cari kelurahan atau kota
              </label>
              <input
                id="lokasi-q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Nama kelurahan atau kota"
                className="min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                disabled={q.trim().length < 3 || cari.isPending}
                className="h-11 rounded-full bg-ink px-5 text-[15px] font-semibold text-white disabled:opacity-40"
              >
                {cari.isPending ? "Mencari…" : "Cari"}
              </button>
            </form>

            <div role="status" aria-live="polite">
              {cari.isError && (
                <p className="mt-3 text-[14px] text-bahaya">
                  {cari.error instanceof Error ? cari.error.message : "Pencarian belum bisa dilakukan."}
                </p>
              )}
              {cari.isSuccess && (cari.data ?? []).length === 0 && (
                <p className="mt-3 text-[14px] text-muted">Tidak ditemukan. Coba nama kelurahan atau kecamatan.</p>
              )}
              {(cari.data ?? []).length > 0 && (
                <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-base">
                  {(cari.data ?? []).map((h) => (
                    <li key={`${h.lat},${h.lng}`}>
                      <button
                        type="button"
                        onClick={() => {
                          lokasi.pilih(h.lat, h.lng);
                          cari.reset();
                          setQ("");
                        }}
                        className="block min-h-12 w-full px-4 py-3 text-left text-[16px] text-ink hover:bg-tint"
                      >
                        {h.nama}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {adaLokasi && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-aman/30 bg-base p-4" role="status">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aman text-white">
                  <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[16px] font-semibold text-ink">Lokasi tersimpan</p>
                  <p className="text-[15px] text-ink-3">{namaLokasi ?? "Membaca nama wilayah…"}</p>
                  {cuaca && !regionId && (
                    <p className="mt-2 text-[14px] leading-[1.5] text-muted">
                      Data titik kumpul untuk wilayah ini belum tersedia. Cuaca BMKG tetap tampil, dan kamu bisa
                      menambahkan titik kumpul sendiri nanti.
                    </p>
                  )}
                </div>
              </div>
            )}

            {(lokasi.status === "ditolak" || lokasi.status === "gagal") && (
              <p className="mt-4 text-[14px] leading-[1.5] text-muted">
                Lokasimu belum bisa dibaca. Tidak apa-apa, cari nama tempatnya di kolom di atas.
              </p>
            )}

            <div className="mt-auto flex flex-col gap-3 pt-10">
              <button
                type="button"
                onClick={selesai}
                className="h-14 rounded-full bg-accent-dark text-[17px] font-semibold text-white hover:bg-accent-hover"
              >
                {adaLokasi ? "Susun rencanaku" : "Lewati lokasi dan susun rencana"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-11 text-[15px] font-medium text-ink-3 hover:text-ink"
              >
                Kembali
              </button>
            </div>
          </section>
        )}

        {/* ---------- Menyusun ---------- */}
        {step === 3 && (
          <section className="flex flex-1 flex-col justify-center">
            <h1 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.03em] text-ink md:text-[40px]">
              Sebentar, rencanamu sedang disiapkan.
            </h1>
            <ol className="mt-10 space-y-5">
              {AI_STEPS.map((s, i) => {
                const done = i < aiStepIndex;
                const active = i === aiStepIndex && !aiError;
                return (
                  <li key={s} className="flex items-center gap-4 text-[17px]">
                    {done ? (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-aman text-white">
                        <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                      </span>
                    ) : active ? (
                      <span className="size-7 shrink-0 animate-spin rounded-full border-[3px] border-line border-t-accent-dark" />
                    ) : (
                      <span className="size-7 shrink-0 rounded-full border-2 border-line" />
                    )}
                    <span className={done || active ? "font-medium text-ink" : "text-muted"}>{s}</span>
                  </li>
                );
              })}
            </ol>

            {aiError && (
              <div role="alert" className="mt-10 rounded-2xl border border-line bg-base p-5">
                <p className="text-[16px] font-semibold text-ink">Belum berhasil</p>
                <p className="mt-1 text-[15px] leading-[1.55] text-ink-3">
                  {aiError} Anggota dan lokasi yang sudah kamu isi tetap tersimpan, dan rencana bisa disusun lagi dari
                  halaman Rencana.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={selesai}
                    className="h-11 rounded-full bg-accent-dark px-5 text-[15px] font-semibold text-white"
                  >
                    Coba lagi
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/beranda-saya", { replace: true })}
                    className="h-11 rounded-full border border-line px-5 text-[15px] font-semibold text-ink"
                  >
                    Lanjut ke beranda
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ---------- Selesai ---------- */}
        {step === 4 && (
          <section className="flex flex-1 flex-col items-center justify-center text-center">
            <span className="flex size-20 animate-[siaga-pop_0.5s_var(--ease-out)] items-center justify-center rounded-full bg-aman text-white">
              <Check className="size-10" strokeWidth={3} aria-hidden="true" />
            </span>
            <h1 className="mt-8 text-[32px] leading-[1.1] font-semibold tracking-[-0.03em] text-ink md:text-[40px]">
              Rencana keluargamu siap.
            </h1>
            <p className="mt-3 max-w-[40ch] text-[17px] leading-[1.6] text-ink-3">
              {members.length} anggota tercatat. Langkah berikutnya: isi tas siaga dan bagikan tautannya ke keluarga.
            </p>
            <button
              type="button"
              onClick={() => navigate("/beranda-saya", { replace: true })}
              className="mt-10 h-14 w-full max-w-[360px] rounded-full bg-accent-dark text-[17px] font-semibold text-white hover:bg-accent-hover"
            >
              Lihat rencanaku
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
