import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useHousehold } from "@/hooks/useHousehold";
import { useRisk } from "@/hooks/useRisk";
import { jamDari, namaHari, useCuaca } from "@/hooks/useCuaca";
import { StatusMark } from "@/components/ui/StatusMark";
import { AppHero } from "@/components/app/AppHero";
import { PetaLeaflet, type TitikPeta } from "@/components/map/PetaLeaflet";
import type { TingkatRisiko } from "@/lib/types";

const TINGKAT_LABEL: Record<TingkatRisiko, string> = {
  RENDAH: "Rendah",
  SEDANG: "Sedang",
  TINGGI: "Tinggi",
};
const TINGKAT_RANK: Record<TingkatRisiko, number> = { RENDAH: 0, SEDANG: 1, TINGGI: 2 };

const JUDUL_STATUS = {
  aman: "Tidak ada hujan deras dalam 24 jam ke depan",
  waspada: "Hujan cukup deras diperkirakan",
  bahaya: "Hujan sangat deras atau petir diperkirakan",
} as const;

const SARAN_STATUS = {
  aman: "Tetap cek lagi nanti. Prakiraan diperbarui tiap beberapa jam.",
  waspada: "Siapkan tas siaga dan pantau kondisi sekitar rumah. Belum berarti harus mengungsi.",
  bahaya: "Ikuti arahan BPBD dan petugas di tempatmu. Halaman ini bukan peringatan dini resmi.",
} as const;

const SARAN_UMUM = [
  { judul: "Siapkan tas siaga", teks: "Pastikan senter, obat rutin, dan dokumen penting ada di dalamnya." },
  { judul: "Pantau info resmi", teks: "Ikuti BMKG dan BPBD setempat, dan patuhi arahan petugas." },
  { judul: "Kenali jalur", teks: "Pastikan semua anggota tahu jalan ke titik kumpul, termasuk saat gelap." },
];

function jenisLabel(j: string) {
  const s = j.toLowerCase().replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function jarakLabel(km: number | null | undefined) {
  if (km == null) return null;
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export function Risiko() {
  const { data: household, isLoading } = useHousehold();
  const punyaLokasi = household?.lat != null && household?.lng != null;
  const { data: risk } = useRisk(
    household?.region_id
      ? {
          region_id: household.region_id,
          lat: household.lat ?? undefined,
          lng: household.lng ?? undefined,
        }
      : undefined,
    { enabled: Boolean(household?.region_id) },
  );
  const { data: cuacaData, isPending: cuacaMemuat } = useCuaca(household?.lat ?? 0, household?.lng ?? 0, punyaLokasi);

  if (isLoading || !household) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted" />;
  }

  const cuaca = cuacaData?.cuaca;
  const zona = risk?.zona_risiko ?? [];
  const tingkatTertinggi = zona.length
    ? zona.reduce<TingkatRisiko>((acc, z) => (TINGKAT_RANK[z.tingkat] > TINGKAT_RANK[acc] ? z.tingkat : acc), "RENDAH")
    : null;
  const titik = risk?.titik_kumpul ?? [];
  const namaWilayah = cuacaData
    ? [cuacaData.wilayah.desa, cuacaData.wilayah.kecamatan].filter(Boolean).join(", ")
    : null;

  return (
    <div className="space-y-10">
      <AppHero variasi="cincin">
        <h1>Risiko dan cuaca</h1>
        <p className="mt-1 max-w-[56ch] text-[16px] text-ink-3">
          Prakiraan cuaca BMKG dan tingkat risiko bencana di sekitar rumahmu.
          {namaWilayah ? ` Wilayah: ${namaWilayah}.` : ""}
        </p>
      </AppHero>

      {!punyaLokasi && (
        <p className="rounded-2xl border border-dashed border-line bg-base p-6 text-[16px] leading-[1.6] text-ink-3">
          Lokasi rumah belum diisi, jadi cuaca dan risiko belum bisa ditampilkan.{" "}
          <Link to="/onboarding" className="font-semibold text-accent-dark underline underline-offset-4">
            Isi lokasi rumah
          </Link>
        </p>
      )}

      {punyaLokasi && cuacaMemuat && <div className="h-40 animate-pulse rounded-2xl bg-muted" aria-busy="true" />}

      {cuaca && !cuaca.tersedia && (
        <p className="rounded-2xl border border-line bg-base p-6 text-[16px] text-ink-3">
          Prakiraan BMKG belum bisa dimuat ({cuaca.alasan}). Coba lagi beberapa saat lagi.
        </p>
      )}

      {cuaca?.tersedia && (
        <>
          {/* Status */}
          <section className="grid gap-8 rounded-2xl border border-line bg-base p-6 md:grid-cols-[1.4fr_1fr] md:p-8">
            <div>
              <p className="text-[14px] text-muted">Cuaca 24 jam ke depan</p>
              <h2 className="mt-2 text-[26px] leading-[1.15] font-semibold tracking-[-0.025em] text-ink">
                {JUDUL_STATUS[cuaca.status.tingkat]}
              </h2>
              {cuaca.status.tingkat !== "aman" && cuaca.status.cuaca && (
                <p className="mt-2 text-[16px] text-ink">
                  {cuaca.status.cuaca}, sekitar pukul {jamDari(cuaca.status.waktu_lokal)} ({cuaca.status.curah_hujan_mm} mm).
                </p>
              )}
              <p className="mt-2 text-[15px] leading-[1.6] text-ink-3">{SARAN_STATUS[cuaca.status.tingkat]}</p>
            </div>
            <div className="md:border-l md:border-line md:pl-8">
              <p className="mb-3 text-[14px] text-muted">Status cuaca</p>
              <StatusMark tingkat={cuaca.status.tingkat} />
              {tingkatTertinggi && (
                <>
                  <p className="mt-7 mb-3 text-[14px] text-muted">Risiko wilayah</p>
                  <StatusMark
                    tingkat={tingkatTertinggi === "TINGGI" ? "bahaya" : tingkatTertinggi === "SEDANG" ? "waspada" : "aman"}
                    labels={[TINGKAT_LABEL.RENDAH, TINGKAT_LABEL.SEDANG, TINGKAT_LABEL.TINGGI]}
                  />
                </>
              )}
            </div>
          </section>

          {/* 3 hari */}
          <section>
            <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Tiga hari ke depan</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {cuaca.harian.map((h, i) => (
                <li key={h.tanggal} className="rounded-2xl border border-line bg-base p-5">
                  <p className="text-[14px] text-muted">{i === 0 ? "Hari ini" : namaHari(h.tanggal)}</p>
                  <p className="mt-2 tabular-nums text-[24px] font-semibold tracking-[-0.02em] text-ink">
                    {h.suhu_maks_c}° / {h.suhu_min_c}°
                  </p>
                  <p className="mt-1 text-[15px] text-ink">{h.cuaca}</p>
                  <p className="mt-1 text-[14px] text-ink-3">Hujan {h.curah_hujan_mm} mm</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Per 3 jam */}
          <section>
            <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Hujan per 3 jam</h2>
            <p className="mt-1 text-[14px] text-ink-3">Dalam milimeter. Ini curah hujan, bukan tinggi air.</p>
            <JamJaman entri={cuaca.prakiraan.slice(0, 8)} />
          </section>
        </>
      )}

      {/* Zona */}
      {zona.length > 0 && (
        <section>
          <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Ancaman di wilayahmu</h2>
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-base">
            {zona.map((z) => (
              <li key={z.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="text-[16px] font-medium text-ink">{jenisLabel(z.jenis_bencana)}</span>
                <span className="text-[15px] text-ink-3">Risiko {TINGKAT_LABEL[z.tingkat].toLowerCase()}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Saran */}
      <section>
        <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Saran tindakan</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {SARAN_UMUM.map((s) => (
            <li key={s.judul} className="rounded-2xl border border-line bg-base p-5">
              <p className="text-[16px] font-semibold text-ink">{s.judul}</p>
              <p className="mt-1.5 text-[15px] leading-[1.55] text-ink-3">{s.teks}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Titik kumpul */}
      <section>
        <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Titik kumpul terdekat</h2>
        {titik.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-line bg-base p-6 text-[16px] leading-[1.6] text-ink-3">
            Belum ada titik kumpul tercatat untuk wilayahmu. Tanyakan ke RT/RW atau BPBD setempat.
          </p>
        ) : (
          <>
          <PetaLeaflet
            className="mt-4"
            tinggi={300}
            titik={[
              ...(household.lat != null && household.lng != null
                ? [{ lat: household.lat, lng: household.lng, label: "Rumahmu", jenis: "rumah" } as TitikPeta]
                : []),
              ...titik.slice(0, 3).map((t) => ({ lat: t.lat, lng: t.lng, label: t.nama, jenis: "kumpul" }) as TitikPeta),
            ]}
          />
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-base">
            {titik.slice(0, 3).map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-[16px] font-semibold text-ink">{t.nama}</p>
                  {jarakLabel(t.jarak_km) && (
                    <p className="text-[14px] text-ink-3">{jarakLabel(t.jarak_km)} dari rumah</p>
                  )}
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${t.lat},${t.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-[14px] font-semibold text-ink hover:bg-tint"
                >
                  Buka di peta
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          </>
        )}
      </section>
    </div>
  );
}

function JamJaman({
  entri,
}: {
  entri: { waktu_lokal: string; suhu_c: number; curah_hujan_mm: number }[];
}) {
  const maks = Math.max(10, ...entri.map((e) => e.curah_hujan_mm));
  const puncak = entri.reduce((a, b) => (b.curah_hujan_mm > a.curah_hujan_mm ? b : a), entri[0]);
  const TINGGI = 120;
  return (
    <ul className="mt-5 grid grid-cols-8 gap-x-1 rounded-2xl border border-line bg-base p-4 md:gap-x-3 md:p-6">
      {entri.map((e) => {
        const ada = e.curah_hujan_mm > 0;
        const aktif = e === puncak && ada;
        return (
          <li key={e.waktu_lokal} className="flex flex-col items-center">
            <div
              className="flex w-full flex-col items-center justify-end border-b border-line"
              style={{ height: TINGGI + 22 }}
            >
              <span
                className={`mb-1 tabular-nums text-[13px] leading-none ${
                  aktif ? "font-semibold text-accent-dark" : ada ? "text-ink" : "text-muted/60"
                }`}
              >
                {e.curah_hujan_mm}
              </span>
              <div
                className={`w-[min(60%,26px)] rounded-t-[5px] ${aktif ? "bg-siaga" : "bg-data-blue"}`}
                style={{ height: ada ? Math.max((e.curah_hujan_mm / maks) * TINGGI, 4) : 0 }}
              />
            </div>
            <span className="mt-3 tabular-nums text-[13px] text-ink">{jamDari(e.waktu_lokal)}</span>
            <span className="tabular-nums text-[12px] text-muted">{e.suhu_c}°</span>
          </li>
        );
      })}
    </ul>
  );
}
