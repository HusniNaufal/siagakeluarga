import { useState } from "react";
import { useHousehold } from "@/hooks/useHousehold";
import { useRisk } from "@/hooks/useRisk";
import { useGeneratePlan } from "@/hooks/usePlan";
import { useKontakKeluarga, telHref } from "@/hooks/useKontak";
import { useAuth } from "@/context/AuthContext";
import { NOMOR_NASIONAL } from "@/content/kontak";
import { EmptyIllustration } from "@/components/ui/EmptyIllustration";
import { FASE_LABEL, findGuide, type Fase } from "@/content/panduan";
import type { JenisBencana } from "@/lib/types";

const SECTIONS = [
  { id: "ringkasan", label: "Ringkasan risiko" },
  { id: "panduan", label: "Langkah per bencana" },
  { id: "titik-kumpul", label: "Titik kumpul" },
  { id: "tugas", label: "Tugas tiap anggota" },
  { id: "kontak", label: "Kontak darurat" },
  { id: "catatan", label: "Catatan khusus" },
];

const SCENARIOS: { jenis: JenisBencana; label: string; activeBg: string }[] = [
  { jenis: "BANJIR", label: "Banjir", activeBg: "bg-[#1D4ED8]" },
  { jenis: "GEMPA", label: "Gempa", activeBg: "bg-[#B91C1C]" },
  { jenis: "LONGSOR", label: "Longsor", activeBg: "bg-[#A16207]" },
];

const FASES: Fase[] = ["sebelum", "saat", "sesudah"];

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
  const [activeFase, setActiveFase] = useState<Fase>("sebelum");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isLoading || !household) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted" />;
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
  const guide = findGuide(activeJenis);
  const langkahPanduan = guide?.fase[activeFase];
  const wilayahTeks = household.region
    ? `Kec. ${household.region.kecamatan}, ${household.region.kab_kota}`
    : null;
  const petaHref = titik
    ? `https://www.google.com/maps/search/?api=1&query=${titik.lat},${titik.lng}`
    : null;

  async function copyShareLink() {
    await navigator.clipboard.writeText(shareUrl).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const belumAdaRencana = !plan;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0B2545]">
            Rencana darurat
          </h1>
          <div className="flex flex-wrap gap-2.5 print:hidden">
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="h-[44px] rounded-[12px] bg-[#C2410C] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#9A3412]"
            >
              Bagikan ke keluarga
            </button>
            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="h-[44px] rounded-[12px] border border-[#0B2545] bg-white px-5 text-[14px] font-semibold text-[#0B2545]"
            >
              Cetak / simpan PDF
            </button>
          </div>
        </div>

        {belumAdaRencana && (
          <div className="rounded-[16px] border border-dashed border-[#CBD5E1] bg-white p-6 print:hidden">
            <EmptyIllustration className="mx-0" />
            <p className="text-[18px] font-semibold text-[#0B2545]">Rencana belum disusun</p>
            <p className="mt-2 max-w-[56ch] text-[15px] leading-[1.6] text-[#475569]">
              Rencana dibuat dari anggota keluarga dan wilayah rumahmu.{" "}
              {anggota.length === 0
                ? "Tambahkan anggota keluarga dulu di halaman Keluarga."
                : "Tekan tombol di bawah untuk menyusunnya dengan AI. Prosesnya sekitar setengah menit."}
            </p>
            <button
              type="button"
              disabled={generatePlan.isPending || anggota.length === 0}
              onClick={() => generatePlan.mutate()}
              className="mt-4 h-[44px] rounded-[12px] bg-[#C2410C] px-5 text-[14px] font-semibold text-white hover:bg-[#9A3412] disabled:opacity-50"
            >
              {generatePlan.isPending ? "AI sedang menyusun…" : "Susun rencana dengan AI"}
            </button>
            {generatePlan.isError && (
              <p role="alert" className="mt-3 text-[14px] text-[#B91C1C]">
                {generatePlan.error instanceof Error
                  ? generatePlan.error.message
                  : "Rencana belum bisa disusun. Coba lagi."}
              </p>
            )}
          </div>
        )}

        <section
          id="ringkasan"
          className="rounded-[14px] border border-[#E2E8F0] bg-white px-6 py-5"
        >
          <p className="text-[13px] text-[#9A3412]">Ringkasan risiko</p>
          <p className="mt-1.5 text-[16px] leading-[1.45] text-[#0B2545]">
            {konten?.ringkasan_risiko ??
              (wilayahTeks
                ? `Wilayah rumahmu: ${wilayahTeks}. Ringkasan risiko muncul setelah rencana disusun.`
                : "Wilayah rumah belum diisi. Lengkapi lokasi agar risiko bisa dihitung.")}
          </p>
        </section>

        {/* Langkah per bencana dan fase: panduan umum, bukan data pribadi. */}
        <section id="panduan" className="space-y-3 pt-2">
          <h2 className="text-[22px] font-bold text-[#0B2545]">Langkah per bencana</h2>
          <div className="flex flex-wrap gap-2 print:hidden" role="tablist" aria-label="Jenis bencana">
            {SCENARIOS.map((s) => {
              const active = activeJenis === s.jenis;
              return (
                <button
                  key={s.jenis}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveJenis(s.jenis)}
                  className={`h-[40px] rounded-full px-5 text-[14px] transition-colors ${
                    active
                      ? `${s.activeBg} font-semibold text-white`
                      : "border border-[#E2E8F0] bg-white/80 font-medium text-[#475569] hover:bg-white"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
          <div
            className="flex w-full max-w-[320px] gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-[5px] print:hidden"
            role="tablist"
            aria-label="Fase"
          >
            {FASES.map((f) => {
              const active = activeFase === f;
              return (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveFase(f)}
                  className={`flex-1 rounded-[8px] py-1.5 text-[13px] transition-colors ${
                    active
                      ? "bg-[#0B2545] font-semibold text-white"
                      : "font-medium text-[#475569] hover:text-[#0B2545]"
                  }`}
                >
                  {FASE_LABEL[f]}
                </button>
              );
            })}
          </div>
          {langkahPanduan && (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
              <p className="text-[15px] leading-[1.6] text-[#475569]">{langkahPanduan.ringkasan}</p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[15px] leading-[1.55] text-[#0B2545]">
                {langkahPanduan.langkah.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ol>
            </div>
          )}
        </section>

        <section
          id="titik-kumpul"
          className="rounded-[20px] border border-[#E2E8F0] bg-white p-6"
        >
          <p className="text-[12px] text-[#475569]">Titik kumpul</p>
          {titik ? (
            <>
              <p className="mt-1.5 text-[20px] font-bold text-[#0B2545]">{titik.nama}</p>
              <p className="mt-1.5 text-[16px] text-[#475569]">
                {jarakLabel(titik.jarak_km)
                  ? `${jarakLabel(titik.jarak_km)} dari rumah. `
                  : ""}
                {konten?.rute_dan_titik_kumpul ?? ""}
              </p>
              {petaHref && (
                <a
                  href={petaHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex h-10 items-center rounded-full border border-[#CBD5E1] px-4 text-[14px] font-semibold text-[#0B2545] hover:bg-[#F1F5F9] print:hidden"
                >
                  Buka di peta
                </a>
              )}
            </>
          ) : (
            <p className="mt-1.5 text-[16px] leading-[1.55] text-[#475569]">
              Belum ada titik kumpul untuk wilayah ini. Tanyakan ke RT/RW atau BPBD setempat, lalu
              catat di rencana.
            </p>
          )}
        </section>

        <section id="tugas" className="space-y-3 pt-2">
          <h2 className="text-[22px] font-bold text-[#0B2545]">Tugas tiap anggota</h2>
          {tugas.length === 0 ? (
            <p className="rounded-[16px] border border-dashed border-[#CBD5E1] bg-white p-5 text-[15px] text-[#475569]">
              Tugas dibuat saat rencana disusun.
            </p>
          ) : (
            tugas.map((t, i) => {
              const name = t.anggota ?? `Anggota ${i + 1}`;
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-[16px] border border-[#E2E8F0] bg-white p-5"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] text-[15px] text-[#0B2545]">
                    {getInitials(name)}
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-[#0B2545]">{name}</p>
                    <p className="mt-1 text-[16px] text-[#475569]">{t.tugas ?? t.peran}</p>
                  </div>
                </div>
              );
            })
          )}
        </section>

        <section id="kontak" className="space-y-3 pt-2">
          <h2 className="text-[22px] font-bold text-[#0B2545]">Kontak darurat</h2>
          {[
            ...NOMOR_NASIONAL.slice(0, 3).map((n) => ({ nama: n.nama, nomor: n.nomor, ket: n.untuk })),
            ...kontak.map((k) => ({ nama: k.nama, nomor: k.nomor, ket: "Kontak keluargamu" })),
          ].map((k) => (
            <div
              key={`${k.nama}-${k.nomor}`}
              className="flex items-center justify-between rounded-[16px] border border-[#E2E8F0] bg-white p-5"
            >
              <div>
                <p className="text-[17px] font-semibold text-[#0B2545]">{k.nama}</p>
                <p className="mt-1 text-[15px] text-[#475569]">
                  {k.nomor} <span className="text-[13px]">· {k.ket}</span>
                </p>
              </div>
              <a
                href={telHref(k.nomor)}
                aria-label={`Telepon ${k.nama} ${k.nomor}`}
                className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-[#C2410C] text-[18px] text-white"
              >
                ☎
              </a>
            </div>
          ))}
          {kontak.length === 0 && (
            <p className="text-[14px] leading-[1.6] text-[#475569] print:hidden">
              Tambahkan nomor RT, puskesmas, dan BPBD setempat di halaman Keluarga. Nomor lokal berbeda
              tiap daerah, jadi tidak diisi otomatis.
            </p>
          )}
        </section>

        <section id="catatan" className="space-y-3 pt-2">
          <h2 className="text-[22px] font-semibold text-[#0B2545]">Catatan khusus</h2>
          {catatan.length === 0 ? (
            <p className="rounded-[20px] bg-[#F1F5F9] p-6 text-[15px] text-[#475569]">
              Belum ada kebutuhan khusus. Isi di profil anggota yang membutuhkan obat rutin atau bantuan
              berjalan.
            </p>
          ) : (
            catatan.map((m) => (
              <div key={m.id} className="rounded-[20px] bg-[#F1F5F9] p-6">
                <p className="text-[17px] font-semibold text-[#0B2545]">Kebutuhan {m.panggilan}</p>
                <p className="mt-2 text-[15px] leading-[1.45] text-[#475569]">{m.kebutuhan_khusus}</p>
              </div>
            ))
          )}
        </section>
      </div>

      <aside className="hidden h-fit space-y-5 lg:block print:hidden">
        <nav className="rounded-[14px] border border-[#E2E8F0] bg-white p-5" aria-label="Daftar isi">
          <p className="text-[12px] text-[#475569]">Daftar isi</p>
          <div className="mt-4 space-y-3">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-[14px] text-[#475569] hover:text-[#C2410C]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="rounded-[14px] border border-[#E2E8F0] bg-white p-5">
          <p className="text-[12px] font-semibold text-[#C2410C]">Cuaca saat ini</p>
          {cuaca?.tersedia ? (
            <>
              <p className="mt-2 text-[20px] font-semibold text-[#0B2545]">
                {cuaca.saat_ini.suhu_c}°C, {cuaca.saat_ini.cuaca}
              </p>
              <p className="mt-1.5 text-[13px] leading-[1.35] text-[#475569]">
                {cuaca.lokasi ? `${cuaca.lokasi.desa}, ${cuaca.lokasi.kecamatan}` : wilayahTeks} · Sumber: BMKG
              </p>
            </>
          ) : (
            <p className="mt-2 text-[14px] leading-[1.5] text-[#475569]">
              {cuaca ? "Prakiraan BMKG belum bisa dimuat." : "Memuat cuaca…"}
            </p>
          )}
          <a
            href="tel:112"
            className="mt-4 block w-full rounded-[10px] bg-[#C2410C] py-2.5 text-center text-[13px] font-semibold text-white"
          >
            Hubungi Darurat 112
          </a>
        </div>
      </aside>

      {showPdfModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau lembar darurat"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2545]/45 p-4 print:hidden"
        >
          <div className="flex max-h-[92vh] w-full max-w-[640px] flex-col gap-[18px] overflow-y-auto rounded-[18px] border border-[#E2E8F0] bg-white px-9 py-8 shadow-[0_20px_48px_rgba(11,37,69,0.16)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-semibold text-[#0B2545]">Pratinjau lembar darurat (A4)</h2>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                aria-label="Tutup"
                className="text-[20px] leading-none font-medium text-[#64748B] hover:text-[#0B2545]"
              >
                ×
              </button>
            </div>

            <div className="overflow-hidden rounded-[4px] border border-[#CBD5E1] bg-white pb-[22px] shadow-[0_8px_24px_rgba(11,37,69,0.11)]">
              <div className="flex min-h-12 items-center justify-between gap-3 bg-[#0B2545] px-[22px] py-2">
                <p className="text-[16px] font-bold text-white">Rencana darurat {namaKeluarga}</p>
                <span className="text-[12px] font-semibold text-[#93C5FD]">{guide?.label}</span>
              </div>
              <div className="mt-3 flex flex-col gap-2.5 px-[22px] pt-1.5">
                <p className="text-[12px] text-[#475569]">
                  {wilayahTeks ?? "Wilayah belum diisi"}
                  {titik ? ` · Titik kumpul: ${titik.nama}${jarakLabel(titik.jarak_km) ? ` (${jarakLabel(titik.jarak_km)})` : ""}` : ""}
                </p>
                <div className="h-px w-full bg-[#E2E8F0]" />
                <p className="text-[13px] font-semibold text-[#0B2545]">Pembagian tugas</p>
                {tugas.length === 0 ? (
                  <p className="text-[12px] text-[#475569]">Belum disusun.</p>
                ) : (
                  tugas.map((t, i) => (
                    <p key={i} className="text-[12px] leading-[20px] text-[#475569]">
                      {i + 1}. {t.anggota ?? `Anggota ${i + 1}`}: {t.tugas ?? t.peran}
                    </p>
                  ))
                )}
                <div className="h-px w-full bg-[#E2E8F0]" />
                <p className="text-[12px] font-semibold text-[#9A3412]">
                  Darurat: {NOMOR_NASIONAL[0].nomor} (nasional)
                  {kontak.map((k) => ` | ${k.nama} ${k.nomor}`).join("")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] font-medium text-[#64748B]">
                Di jendela cetak, pilih "Simpan sebagai PDF".
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowPdfModal(false);
                  setTimeout(() => window.print(), 150);
                }}
                className="h-11 rounded-[8px] bg-[#C2410C] px-5 text-[13px] font-semibold text-white"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2545]/45 p-4 print:hidden"
        >
          <div className="flex w-full max-w-[540px] flex-col gap-[18px] rounded-[18px] border border-[#E2E8F0] bg-white px-9 py-8 shadow-[0_20px_48px_rgba(11,37,69,0.16)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-semibold text-[#0B2545]">Bagikan rencana darurat</h2>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                aria-label="Tutup"
                className="text-[20px] leading-none font-medium text-[#64748B] hover:text-[#0B2545]"
              >
                ×
              </button>
            </div>

            <p className="text-[13px] leading-[20px] text-[#475569]">
              Anggota keluarga bisa membuka rencana ini dari ponsel tanpa login (hanya baca).
            </p>

            <div className="flex h-[54px] items-center justify-between gap-2.5 rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] py-2 pr-2 pl-4">
              <span className="truncate text-[14px] font-medium text-[#0B2545]">{shareUrl}</span>
              <button
                type="button"
                onClick={copyShareLink}
                className="h-9 shrink-0 rounded-[7px] bg-[#0B2545] px-4 text-[13px] font-semibold text-white"
              >
                {copied ? "Tersalin" : "Salin tautan"}
              </button>
            </div>

            <div className="space-y-1.5 py-1">
              <p className="text-[13px] font-semibold text-[#0B2545]">Yang dapat dilihat penerima tautan:</p>
              <p className="text-[12px] leading-[19px] text-[#475569]">
                Nama dan peran anggota, kebutuhan khusus (misalnya obat rutin), titik kumpul, dan tombol
                telepon 112. Siapa pun yang memegang tautan ini bisa membukanya, jadi kirim hanya ke
                keluarga. Kalau tautan bocor, buat tautan baru lewat pengaturan keluarga.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Rencana darurat ${namaKeluarga}: ${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 flex-1 items-center justify-center rounded-[8px] bg-[#0F766E] px-5 text-[14px] font-semibold text-white"
              >
                Kirim lewat WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="h-11 rounded-[8px] border border-[#CBD5E1] bg-white px-5 text-[14px] font-semibold text-[#0B2545]"
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
