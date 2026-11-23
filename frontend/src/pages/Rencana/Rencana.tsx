import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Info,
} from "lucide-react";
import { useHousehold } from "@/hooks/useHousehold";
import { useRisk } from "@/hooks/useRisk";
import { useGeneratePlan } from "@/hooks/usePlan";
import { useKontakKeluarga, telHref } from "@/hooks/useKontak";
import { useAuth } from "@/context/AuthContext";
import { NOMOR_NASIONAL } from "@/content/kontak";
import { EmptyIllustration } from "@/components/ui/EmptyIllustration";
import { AppHero } from "@/components/app/AppHero";
import { FASE_LABEL, GUIDES, findGuide, type Fase } from "@/content/panduan";
import { cn } from "@/lib/utils";
import type { JenisBencana } from "@/lib/types";

const FASES: Fase[] = ["sebelum", "saat", "sesudah"];

const DASAR: JenisBencana[] = ["BANJIR", "GEMPA", "LONGSOR", "CUACA_EKSTREM"];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function jarakLabel(km: number | null | undefined) {
  if (km == null) return null;
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

const FASE_METAS: Record<
  Fase,
  {
    label: string;
    badge: string;
    badgeCls: string;
    accentCls: string;
    icon: typeof Clock;
  }
> = {
  sebelum: {
    label: "Sebelum",
    badge: "Pra-Bencana",
    badgeCls: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    accentCls: "bg-amber-500",
    icon: Clock,
  },
  saat: {
    label: "Saat Kejadian",
    badge: "Evakuasi & Tanggap",
    badgeCls: "bg-bahaya/10 text-bahaya border-bahaya/20",
    accentCls: "bg-bahaya",
    icon: AlertTriangle,
  },
  sesudah: {
    label: "Sesudah",
    badge: "Pemulihan & Aman",
    badgeCls: "bg-aman/10 text-aman border-aman/20",
    accentCls: "bg-aman",
    icon: CheckCircle2,
  },
};

function NumberedList({
  items,
  variant = "default",
}: {
  items: string[];
  variant?: "default" | "ai";
}) {
  return (
    <ol className="space-y-2.5">
      {items.map((l, i) => (
        <li
          key={`${i}-${l}`}
          className={cn(
            "flex items-start gap-3 rounded-2xl p-3.5 text-[14px] leading-[1.6] transition-all",
            variant === "ai"
              ? "bg-accent-dark/5 text-ink border border-accent-dark/20 shadow-2xs"
              : "bg-surface/80 text-ink-2 hover:bg-surface border border-line/60"
          )}
        >
          <span
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold shadow-2xs mt-0.5",
              variant === "ai"
                ? "bg-accent-dark text-white"
                : "bg-base text-ink border border-line"
            )}
          >
            {i + 1}
          </span>
          <span className="min-w-0 flex-1">{l}</span>
        </li>
      ))}
    </ol>
  );
}

export function Rencana() {
  const { user } = useAuth();
  const { data: household, isLoading } = useHousehold();
  const generatePlan = useGeneratePlan();
  const { kontak } = useKontakKeluarga();
  const { data: risiko } = useRisk(
    household?.region_id
      ? {
          region_id: household.region_id,
          lat: household.lat ?? undefined,
          lng: household.lng ?? undefined,
        }
      : undefined,
    { enabled: Boolean(household?.region_id) },
  );

  const [activeJenis, setActiveJenis] = useState<JenisBencana>("BANJIR");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isLoading || !household) {
    return <div className="h-40 animate-pulse rounded-2xl bg-surface" />;
  }

  const plan = household.emergency_plans?.[0];
  const konten = plan?.konten;
  const shareUrl = `${window.location.origin}/r/${household.share_token}`;
  const namaKeluarga = user?.nama ?? "Keluarga";
  const anggota = household.members ?? [];
  const catatan = anggota.filter((m) => m.kebutuhan_khusus);
  const titik = risiko?.titik_kumpul?.[0];
  const cuaca = risiko?.cuaca;
  const tugas = konten?.pembagian_tugas_keluarga ?? [];
  const wilayahTeks = household.region ? `Kec. ${household.region.kecamatan}, ${household.region.kab_kota}` : null;
  const petaHref = titik ? `https://www.google.com/maps/search/?api=1&query=${titik.lat},${titik.lng}` : null;

  // Jenis dasar selalu tampil; jenis lain (mis. tsunami) hanya bila data wilayah memuatnya.
  const jenisLain = new Set((risiko?.zona_risiko ?? []).map((z) => z.jenis_bencana));
  const skenario = GUIDES.filter((g) => DASAR.includes(g.jenis) || jenisLain.has(g.jenis));
  const guide = findGuide(activeJenis) ?? skenario[0];

  const aiSebelum = konten?.rencana_sebelum_bencana ?? [];
  const aiSaat = konten?.langkah_saat_bencana ?? [];
  const kontakAi = (konten?.kontak_darurat ?? []).map((k) =>
    typeof k === "string" ? k : [k.instansi, k.nomor].filter(Boolean).join(" "),
  );

  const kontakDaftar = [
    ...NOMOR_NASIONAL.map((n) => ({ nama: n.nama, nomor: n.nomor, ket: n.untuk })),
    ...kontak.map((k) => ({ nama: k.nama, nomor: k.nomor, ket: "Kontak keluargamu" })),
  ];

  async function copyShareLink() {
    await navigator.clipboard.writeText(shareUrl).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const belumAdaRencana = !plan;

  return (
    <div className="space-y-10">
      <AppHero
        variasi="gelombang"
        className="print:hidden"
        aksi={
          <>
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="h-12 rounded-full bg-accent-dark px-6 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Bagikan ke keluarga
            </button>
            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="h-12 rounded-full border border-line bg-base px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-tint"
            >
              Cetak / simpan PDF
            </button>
          </>
        }
      >
        <h1>Rencana darurat</h1>
        <p className="mt-1 max-w-[56ch] text-[16px] text-ink-3">
          Apa yang dilakukan tiap anggota sebelum, saat, dan sesudah bencana.
        </p>
      </AppHero>

      {belumAdaRencana && (
        <div className="rounded-2xl border border-line bg-base p-6 text-center print:hidden md:p-9">
          <EmptyIllustration />
          <p className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Rencana belum disusun</p>
          <p className="mx-auto mt-2 max-w-[52ch] text-[16px] leading-[1.6] text-ink-3">
            Rencana dibuat dari anggota keluarga dan wilayah rumahmu.{" "}
            {anggota.length === 0
              ? "Tambahkan anggota keluarga dulu di halaman Keluarga."
              : "Tekan tombol di bawah untuk menyusunnya dengan AI. Prosesnya sekitar setengah menit."}
          </p>
          {anggota.length === 0 ? (
            <Link
              to="/keluarga"
              className="mt-5 inline-flex h-12 items-center rounded-full bg-accent-dark px-6 text-[15px] font-semibold text-white hover:bg-accent-hover"
            >
              Tambah anggota keluarga
            </Link>
          ) : (
            <button
              type="button"
              disabled={generatePlan.isPending}
              onClick={() => generatePlan.mutate()}
              className="mt-5 h-12 rounded-full bg-accent-dark px-6 text-[15px] font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
            >
              {generatePlan.isPending ? "AI sedang menyusun…" : "Susun rencana dengan AI"}
            </button>
          )}
          {generatePlan.isError && (
            <p role="alert" className="mt-3 text-[15px] text-bahaya">
              {generatePlan.error instanceof Error ? generatePlan.error.message : "Rencana belum bisa disusun. Coba lagi."}
            </p>
          )}
        </div>
      )}

      <div className="space-y-8 print:hidden">
        {/* Baris 1: Ringkasan risiko & Cuaca BMKG berdampingan secara proporsional */}
        <div className="grid gap-6 md:grid-cols-3">
          <section id="ringkasan" className="flex flex-col justify-between rounded-3xl border border-line/80 bg-base p-6 shadow-sm md:col-span-2">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent-dark/10 text-accent-dark">
                  <ShieldAlert className="size-4" />
                </span>
                <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Ringkasan risiko</h2>
              </div>
              <p className="mt-3 text-[15px] leading-[1.65] text-ink-3">
                {konten?.ringkasan_risiko ??
                  (wilayahTeks
                    ? `Wilayah rumahmu: ${wilayahTeks}. Ringkasan risiko muncul setelah rencana disusun.`
                    : "Wilayah rumah belum diisi. Lengkapi lokasi agar risiko bisa dihitung.")}
              </p>
            </div>
            {household.region?.hazard_zones?.length ? (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line/60 pt-3">
                <span className="text-[12px] font-medium text-muted">Potensi ancaman di wilayah ini:</span>
                {household.region.hazard_zones.map((z) => (
                  <span
                    key={z.id}
                    className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-[12px] font-semibold text-ink"
                  >
                    {z.jenis_bencana.replace("_", " ")} ({z.tingkat.toLowerCase()})
                  </span>
                ))}
              </div>
            ) : null}
          </section>

          <section className="flex flex-col justify-between rounded-3xl border border-line/80 bg-base p-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-semibold text-ink">Cuaca BMKG</p>
                <span className="rounded-full bg-tint px-2.5 py-0.5 text-[11px] font-semibold text-ink">Live</span>
              </div>
              {cuaca?.tersedia ? (
                <div className="mt-3">
                  <p className="font-display text-[32px] font-bold text-ink leading-none">
                    {Math.round(cuaca.saat_ini.suhu_c)}°C
                  </p>
                  <p className="mt-1 text-[15px] font-medium text-ink-2">{cuaca.saat_ini.cuaca}</p>
                  <p className="mt-1 text-[12px] text-muted">
                    {cuaca.lokasi ? `${cuaca.lokasi.desa}, ${cuaca.lokasi.kecamatan}` : wilayahTeks}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-[14px] text-ink-3">
                  {cuaca ? "Prakiraan BMKG belum bisa dimuat." : "Memuat cuaca…"}
                </p>
              )}
            </div>
            <a
              href="tel:112"
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-accent-dark px-4 text-[14px] font-semibold text-white shadow-xs transition-colors hover:bg-accent-hover cursor-pointer"
            >
              <Phone className="size-4" />
              <span>Hubungi darurat 112</span>
            </a>
          </section>
        </div>

        {/* Baris 2: Langkah per skenario (Full Width 3 Kolom Megah & Luas) */}
        <section id="panduan" className="space-y-6 rounded-3xl border border-line/80 bg-base/60 p-6 shadow-xs backdrop-blur-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-[22px] font-bold tracking-[-0.015em] text-ink">Langkah per skenario</h2>
              <p className="mt-1 text-[14px] text-ink-3">
                Panduan praktis sebelum, saat, dan sesudah bencana untuk melindungi seluruh anggota keluarga.
              </p>
            </div>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Jenis bencana">
              {skenario.map((s) => {
                const active = guide.jenis === s.jenis;
                return (
                  <button
                    key={s.jenis}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveJenis(s.jenis)}
                    className={cn(
                      "h-10 rounded-full px-4 text-[14px] font-medium transition-all cursor-pointer",
                      active
                        ? "bg-ink font-semibold text-white shadow-xs"
                        : "border border-line bg-base text-ink-3 hover:bg-tint hover:text-ink",
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3" role="tabpanel" aria-label={`Langkah ${guide.label}`}>
            {FASES.map((f) => {
              const fase = guide.fase[f];
              const meta = FASE_METAS[f];
              const Icon = meta.icon;
              const dariAi = f === "sebelum" ? aiSebelum : f === "saat" ? aiSaat : [];
              return (
                <div
                  key={f}
                  className="flex flex-col justify-between overflow-hidden rounded-3xl border border-line/80 bg-base p-5 shadow-xs transition-shadow hover:shadow-md"
                >
                  <div>
                    {/* Header Fase */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={cn("flex size-7 items-center justify-center rounded-lg text-white", meta.accentCls)}>
                          <Icon className="size-4" />
                        </span>
                        <h3 className="text-[17px] font-bold tracking-[-0.01em] text-ink">{meta.label}</h3>
                      </div>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold border", meta.badgeCls)}>
                        {meta.badge}
                      </span>
                    </div>

                    <p className="mt-2.5 mb-4 text-[13px] leading-[1.55] text-ink-3">
                      {fase.ringkasan}
                    </p>

                    {/* Daftar Langkah Standar */}
                    <NumberedList items={fase.langkah} />
                  </div>

                  {/* Tambahan Personalisasi AI */}
                  {dariAi.length > 0 && (
                    <div className="mt-5 border-t border-line/80 pt-4">
                      <div className="mb-2.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-accent-dark">
                        <Sparkles className="size-3.5" />
                        <span>Tambahan Khusus AI Keluargamu</span>
                      </div>
                      <NumberedList items={dariAi} variant="ai" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="flex items-center gap-1.5 pt-1 text-[13px] text-muted">
            <Info className="size-3.5 shrink-0" />
            Langkah umum berpedoman pada standar BNPB. Rekomendasi tambahan AI disesuaikan dengan profil dan usia keluargamu.
          </p>
        </section>

        {/* Baris 3: Titik kumpul & Tugas anggota */}
        <div className="grid gap-6 md:grid-cols-2">
          <section id="titik-kumpul" className="rounded-3xl border border-line/80 bg-base p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Titik kumpul</h2>
              {titik ? (
                <>
                  <p className="font-display mt-3 text-[22px] leading-tight font-semibold tracking-[-0.02em] text-ink">{titik.nama}</p>
                  <p className="mt-2 text-[15px] leading-[1.6] text-ink-3">
                    {jarakLabel(titik.jarak_km) ? `${jarakLabel(titik.jarak_km)} dari rumah. ` : ""}
                    {konten?.rute_dan_titik_kumpul ?? ""}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-[15px] leading-[1.6] text-ink-3">
                  Belum ada titik kumpul untuk wilayah ini. Tanyakan ke RT/RW atau BPBD setempat, lalu catat di rencana.
                </p>
              )}
            </div>
            {titik && petaHref && (
              <a
                href={petaHref}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex h-11 w-fit items-center rounded-full border border-line bg-base px-5 text-[14px] font-semibold text-ink hover:bg-tint"
              >
                Buka di peta
              </a>
            )}
          </section>

          <section id="tugas" className="space-y-4 rounded-3xl border border-line/80 bg-base p-6 shadow-sm">
            <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Tugas tiap anggota</h2>
            {tugas.length === 0 ? (
              <p className="rounded-2xl border border-line bg-surface/60 p-4 text-[14px] text-ink-3">
                Tugas dibuat saat rencana disusun.
              </p>
            ) : (
              <ul className="grid gap-3">
                {tugas.map((t, i) => {
                  const name = t.anggota ?? `Anggota ${i + 1}`;
                  return (
                    <li key={i} className="flex items-start gap-3 rounded-2xl border border-line/60 bg-surface/70 p-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-base text-[13px] font-semibold text-ink shadow-2xs">
                        {getInitials(name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-ink">{name}</p>
                        <p className="mt-0.5 text-[14px] leading-[1.5] text-ink-3">{t.tugas ?? t.peran}</p>
                        {t.fokus_pendampingan && (
                          <p className="mt-1 text-[13px] text-muted">{t.fokus_pendampingan}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        {/* Baris 4: Kontak darurat & Catatan khusus */}
        <div className="grid gap-6 md:grid-cols-2">
          <section id="kontak" className="space-y-4 rounded-3xl border border-line/80 bg-base p-6 shadow-sm">
            <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Kontak darurat</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {kontakDaftar.map((k) => (
                <li
                  key={`${k.nama}-${k.nomor}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line/60 bg-surface/70 p-4"
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-ink truncate">{k.nama}</p>
                    <p className="mt-0.5 text-[14px] text-ink-3">
                      <span className="font-display font-semibold tracking-[-0.01em] text-ink">{k.nomor}</span>
                      <span className="text-[13px] text-muted"> · {k.ket}</span>
                    </p>
                  </div>
                  <a
                    href={telHref(k.nomor)}
                    aria-label={`Telepon ${k.nama} ${k.nomor}`}
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-dark text-white hover:bg-accent-hover"
                  >
                    <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            {kontakAi.length > 0 && (
              <p className="text-[13px] leading-[1.5] text-muted">Dari rencana AI: {kontakAi.join(", ")}.</p>
            )}
            {kontak.length === 0 && (
              <p className="text-[13px] leading-[1.5] text-muted">
                Tambahkan nomor RT, puskesmas, dan BPBD setempat di halaman Keluarga. Nomor lokal berbeda tiap daerah,
                jadi tidak diisi otomatis.
              </p>
            )}
          </section>

          <section id="catatan" className="space-y-4 rounded-3xl border border-line/80 bg-base p-6 shadow-sm">
            <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Catatan khusus</h2>
            {catatan.length === 0 ? (
              <p className="rounded-2xl border border-line/60 bg-surface/60 p-4 text-[14px] leading-[1.6] text-ink-3">
                Belum ada kebutuhan khusus. Isi di profil anggota yang membutuhkan obat rutin atau bantuan berjalan.
              </p>
            ) : (
              <ul className="grid gap-3">
                {catatan.map((m) => (
                  <li key={m.id} className="rounded-2xl border border-line/60 bg-surface/70 p-4">
                    <p className="text-[15px] font-semibold text-ink">Kebutuhan {m.panggilan}</p>
                    <p className="mt-1 text-[14px] leading-[1.5] text-ink-3">{m.kebutuhan_khusus}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <p className="rounded-2xl bg-surface/80 p-4 text-center text-[14px] text-ink-3">
          Instruksi resmi petugas dan BPBD setempat tetap menjadi acuan keselamatan utama.
        </p>
      </div>

      {/* Lembar cetak ringkas: hanya tampil saat dicetak. */}
      <div className="hidden text-ink print:block">
        <h1 className="!text-[22px]">Rencana darurat {namaKeluarga}</h1>
        <p className="mt-1 text-[12px]">
          {wilayahTeks ?? "Wilayah belum diisi"}
          {titik ? ` · Titik kumpul: ${titik.nama}${jarakLabel(titik.jarak_km) ? ` (${jarakLabel(titik.jarak_km)})` : ""}` : ""}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-4">
          {FASES.map((f) => (
            <div key={f}>
              <p className="text-[13px] font-semibold">
                {FASE_LABEL[f]} {guide.label.toLowerCase()}
              </p>
              <ol className="mt-1 list-decimal space-y-0.5 pl-4 text-[11px] leading-[1.4]">
                {guide.fase[f].langkah.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[13px] font-semibold">Pembagian tugas</p>
        {tugas.length === 0 ? (
          <p className="text-[11px]">Belum disusun.</p>
        ) : (
          tugas.map((t, i) => (
            <p key={i} className="text-[11px] leading-[1.5]">
              {i + 1}. {t.anggota ?? `Anggota ${i + 1}`}: {t.tugas ?? t.peran}
            </p>
          ))
        )}
        <p className="mt-3 text-[13px] font-semibold">Kontak darurat</p>
        <p className="text-[11px] leading-[1.5]">
          {kontakDaftar.map((k) => `${k.nama} ${k.nomor}`).join(" | ")}
        </p>
        <p className="mt-3 text-[11px]">Instruksi resmi petugas dan BPBD tetap menjadi acuan utama.</p>
      </div>

      {showPdfModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau lembar darurat"
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/60 p-4 print:hidden"
        >
          <div className="flex max-h-[92vh] w-full max-w-[640px] flex-col gap-5 overflow-y-auto rounded-2xl border border-line bg-base p-6 md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Pratinjau lembar darurat (A4)</h2>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                aria-label="Tutup"
                className="flex size-11 items-center justify-center rounded-full text-[22px] leading-none text-muted hover:bg-tint hover:text-ink"
              >
                ×
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-line bg-base pb-5">
              <div className="flex min-h-12 items-center justify-between gap-3 bg-night px-5 py-2">
                <p className="text-[16px] font-semibold text-white">Rencana darurat {namaKeluarga}</p>
                <span className="text-[12px] font-semibold text-mist">{guide.label}</span>
              </div>
              <div className="mt-3 flex flex-col gap-2.5 px-5 pt-1.5">
                <p className="text-[12px] text-ink-3">
                  {wilayahTeks ?? "Wilayah belum diisi"}
                  {titik ? ` · Titik kumpul: ${titik.nama}${jarakLabel(titik.jarak_km) ? ` (${jarakLabel(titik.jarak_km)})` : ""}` : ""}
                </p>
                <div className="h-px w-full bg-line" />
                <p className="text-[13px] font-semibold text-ink">Pembagian tugas</p>
                {tugas.length === 0 ? (
                  <p className="text-[12px] text-ink-3">Belum disusun.</p>
                ) : (
                  tugas.map((t, i) => (
                    <p key={i} className="text-[12px] leading-[20px] text-ink-3">
                      {i + 1}. {t.anggota ?? `Anggota ${i + 1}`}: {t.tugas ?? t.peran}
                    </p>
                  ))
                )}
                <div className="h-px w-full bg-line" />
                <p className="text-[12px] font-semibold text-accent-dark">
                  Darurat: {NOMOR_NASIONAL[0].nomor} (nasional)
                  {kontak.map((k) => ` | ${k.nama} ${k.nomor}`).join("")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-muted">Di jendela cetak, pilih "Simpan sebagai PDF".</p>
              <button
                type="button"
                onClick={() => {
                  setShowPdfModal(false);
                  setTimeout(() => window.print(), 150);
                }}
                className="h-12 rounded-full bg-accent-dark px-6 text-[15px] font-semibold text-white hover:bg-accent-hover"
              >
                Cetak / simpan PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Bagikan rencana"
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/60 p-4 print:hidden"
        >
          <div className="flex w-full max-w-[540px] flex-col gap-5 rounded-2xl border border-line bg-base p-6 md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Bagikan rencana darurat</h2>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                aria-label="Tutup"
                className="flex size-11 items-center justify-center rounded-full text-[22px] leading-none text-muted hover:bg-tint hover:text-ink"
              >
                ×
              </button>
            </div>

            <p className="text-[15px] leading-[1.55] text-ink-3">
              Anggota keluarga bisa membuka rencana ini dari ponsel tanpa login (hanya baca).
            </p>

            <div className="flex min-h-14 items-center justify-between gap-2.5 rounded-2xl border border-line bg-paper py-2 pr-2 pl-4">
              <span className="truncate text-[14px] font-medium text-ink">{shareUrl}</span>
              <button
                type="button"
                onClick={copyShareLink}
                className="h-10 shrink-0 rounded-full bg-accent-dark px-5 text-[14px] font-semibold text-white hover:bg-accent-hover"
              >
                {copied ? "Tersalin" : "Salin tautan"}
              </button>
            </div>
            <p role="status" className="sr-only">
              {copied ? "Tautan tersalin" : ""}
            </p>

            <div className="space-y-1.5">
              <p className="text-[15px] font-semibold text-ink">Yang dapat dilihat penerima tautan</p>
              <p className="text-[14px] leading-[1.55] text-ink-3">
                Nama dan peran anggota, kebutuhan khusus (misalnya obat rutin), titik kumpul, dan tombol telepon 112.
                Siapa pun yang memegang tautan ini bisa membukanya, jadi kirim hanya ke keluarga. Kalau tautan bocor,
                buat tautan baru lewat pengaturan keluarga.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Rencana darurat ${namaKeluarga}: ${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 flex-1 items-center justify-center rounded-full bg-accent-dark px-6 text-[15px] font-semibold text-white hover:bg-accent-hover"
              >
                Kirim lewat WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="h-12 rounded-full border border-line bg-base px-6 text-[15px] font-semibold text-ink hover:bg-tint"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
