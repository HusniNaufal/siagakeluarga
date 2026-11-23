import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useHousehold } from "@/hooks/useHousehold";
import { useDrills } from "@/hooks/useDrills";
import { useRisk } from "@/hooks/useRisk";
import { AppHero } from "@/components/app/AppHero";
import { StatusMark } from "@/components/ui/StatusMark";
import { PeringatanKeluarga } from "@/components/app/PeringatanKeluarga";
import { KabarKeluarga } from "@/components/app/KabarKeluarga";
import { ProgressRing } from "@/components/ProgressRing";
import { computeSkorKesiapan } from "@/lib/score";
import { TopoBackground } from "@/components/layout/TopoBackground";

const TOMBOL_UTAMA =
  "inline-flex h-12 items-center justify-center rounded-full bg-accent-dark px-6 text-[16px] font-semibold text-white transition-colors hover:bg-accent-hover";
const TOMBOL_SEKUNDER =
  "inline-flex h-10 items-center justify-center rounded-full border border-line bg-base px-5 text-[15px] font-semibold text-ink transition-colors hover:bg-tint";

function formatJarak(km: number | null | undefined) {
  if (km == null) return "";
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

function inisial(nama: string) {
  return nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export function BerandaSaya() {
  const { user } = useAuth();
  const { data: household, isLoading } = useHousehold();
  const { data: drillsData } = useDrills();
  const { data: risk } = useRisk(
    household?.region_id
      ? {
          region_id: household.region_id,
          lat: household.lat ?? undefined,
          lng: household.lng ?? undefined,
        }
      : undefined,
  );
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    if (!showMapModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowMapModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showMapModal]);

  if (isLoading || !household) {
    return <div className="h-40 animate-pulse rounded-2xl bg-surface" />;
  }

  const adaRencana = (household.emergency_plans?.length ?? 0) > 0;
  const kesiapanTas = household.kesiapan_tas ?? { total: 0, siap: 0, persentase: 0 };
  const skor = computeSkorKesiapan({
    adaRencana,
    persentaseTasSiaga: kesiapanTas.persentase ?? 0,
    rataRataSkorLatihan: drillsData?.rata_rata_skor ?? null,
  });

  const siapCount = kesiapanTas.siap ?? 0;
  const totalCount = kesiapanTas.total ?? 0;
  const belumCount = Math.max(0, totalCount - siapCount);
  const pctTas = kesiapanTas.persentase ?? Math.round((siapCount / Math.max(1, totalCount)) * 100);

  const titikTerdekat = risk?.titik_kumpul?.[0] ?? null;
  const cuaca = risk?.cuaca;
  const namaDepan = (user?.nama ?? "").split(" ")[0];
  const tanggalHariIni = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const statusCuaca = cuaca?.tersedia ? (cuaca.status?.tingkat ?? "aman") : null;
  const kecamatanLabel =
    cuaca && cuaca.tersedia && cuaca.lokasi?.kecamatan
      ? cuaca.lokasi.kecamatan
      : (household.region?.kecamatan ?? null);

  const anggota = household.members ?? [];
  const jumlahAnggota = anggota.length;
  const langkah =
    jumlahAnggota === 0
      ? { judul: "Tambahkan anggota keluarga", teks: "Rencana dan tas siaga disusun dari siapa saja yang tinggal di rumah.", to: "/keluarga", tombol: "Tambah anggota" }
      : household.lat == null || household.lng == null
        ? { judul: "Isi lokasi rumahmu", teks: "Dipakai untuk titik kumpul terdekat dan prakiraan cuaca di kelurahanmu.", to: "/keluarga", tombol: "Isi lokasi" }
        : !adaRencana
          ? { judul: "Susun rencana daruratmu", teks: "Titik kumpul dan tugas tiap anggota ditulis dalam satu halaman.", to: "/rencana", tombol: "Susun rencana" }
          : totalCount === 0
            ? { judul: "Mulai isi tas siaga", teks: "Tambahkan barang yang perlu dibawa saat harus pergi cepat.", to: "/tas-siaga", tombol: "Buka tas siaga" }
            : belumCount > 0
              ? { judul: `Lengkapi ${belumCount} barang tas siaga`, teks: "Centang barang yang sudah siap supaya terlihat mana yang masih kurang.", to: "/tas-siaga", tombol: "Buka tas siaga" }
              : { judul: "Coba latihan singkat", teks: "Latihan mengecek apakah keluargamu tahu langkah pertama.", to: "/latihan", tombol: "Mulai latihan" };

  return (
    <div className="mx-auto max-w-[960px] space-y-6">
      {/* Salam */}
      <AppHero
        variasi="rumah"
        aksi={
          <Link to="/rencana" className={TOMBOL_SEKUNDER}>
            Perbarui rencana
          </Link>
        }
      >
        <h1>Halo{namaDepan ? `, ${namaDepan}` : ""}</h1>
        <p className="mt-2 max-w-[56ch] text-[16px] leading-[1.55] text-ink-3">
          {tanggalHariIni}
          {kecamatanLabel ? ` · Kec. ${kecamatanLabel}` : " · Lokasi belum diisi"}. Ini ringkasan kesiapsiagaan keluargamu hari ini.
        </p>
      </AppHero>

      {/* Banner cuaca hari ini */}
      <section
        aria-labelledby="judul-cuaca"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-night via-storm to-storm-2 p-6 text-white shadow-xl md:p-8"
      >
        <TopoBackground variant="dark" className="opacity-[0.22]" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-5">
          <div>
            <h2 id="judul-cuaca" className="text-[15px] font-normal text-mist">
              Cuaca hari ini{kecamatanLabel ? `, ${kecamatanLabel}` : ""}
            </h2>
            <p className="mt-2 text-[22px] font-semibold tracking-[-0.015em]">
              {cuaca?.tersedia ? `${cuaca.saat_ini.cuaca} saat ini` : "Prakiraan belum tersedia"}
            </p>
            <p className="mt-1 text-[14px] text-mist">Prakiraan BMKG</p>
          </div>
          <p className="font-display text-[48px] leading-none font-semibold tracking-[-0.03em]">
            {cuaca?.tersedia ? `${Math.round(cuaca.saat_ini.suhu_c)}°` : "–"}
          </p>
        </div>
        {statusCuaca && <StatusMark tingkat={statusCuaca} tone="gelap" className="relative z-10 mt-6" />}
        {cuaca?.tersedia && cuaca.prakiraan.length > 0 && (
          <ul className="relative z-10 mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-5 sm:grid-cols-5">
            {cuaca.prakiraan.slice(0, 5).map((e) => (
              <li key={e.waktu_lokal}>
                <p className="text-[14px] text-mist">{e.waktu_lokal.slice(11, 16)}</p>
                <p className="mt-0.5 font-display text-[24px] leading-none font-semibold tracking-[-0.03em]">{Math.round(e.suhu_c)}°</p>
                <p className="mt-1 text-[13px] leading-[1.35] text-mist">
                  {e.cuaca}
                  {e.curah_hujan_mm > 0 ? `, ${e.curah_hujan_mm} mm` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <PeringatanKeluarga
        shareToken={household.share_token}
        lat={household.lat}
        lng={household.lng}
      />

      {/* Skor, tas siaga, langkah berikutnya */}
      <div className="grid gap-4 md:grid-cols-3">
        <section
          aria-labelledby="judul-skor"
          className="relative flex flex-col items-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-ink to-ink-2 p-6 text-center text-white shadow-md transition-all hover:shadow-lg"
        >
          <h2 id="judul-skor" className="text-[20px] font-semibold tracking-[-0.015em] text-white">
            Skor kesiapsiagaan
          </h2>
          <div className="my-4">
            <ProgressRing value={skor} size={124} tone="gelap" />
          </div>
          <p className="text-[15px] text-white/75">Dari 100, dihitung dari rencana, tas siaga, dan latihan.</p>
        </section>

        <section
          aria-labelledby="judul-tas"
          className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent-dark via-siaga to-accent-hover p-6 text-white shadow-md transition-all hover:shadow-lg"
        >
          <div>
            <h2 id="judul-tas" className="text-[20px] font-semibold tracking-[-0.015em] text-white">
              Tas siaga
            </h2>
            <p className="mt-4 font-display text-[48px] leading-none font-semibold tracking-[-0.03em] text-white">
              {siapCount}
              <span className="text-white/65">/{totalCount}</span>
            </p>
            <div
              role="progressbar"
              aria-label="Kemajuan tas siaga"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pctTas}
              className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/25"
            >
              <div className="h-full rounded-full bg-white" style={{ width: `${pctTas}%` }} />
            </div>
          </div>
          <p className="mt-3 text-[15px] text-white/90">
            {totalCount === 0 ? "Belum ada barang di tas siaga." : `${belumCount} barang masih perlu disiapkan.`}
          </p>
        </section>

        <section
          aria-labelledby="judul-langkah"
          className="flex flex-col justify-between rounded-3xl border border-line/80 bg-base/95 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
        >
          <div>
            <h2 id="judul-langkah" className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
              Langkah berikutnya
            </h2>
            <p className="mt-3 text-[17px] leading-[1.35] font-semibold text-ink">{langkah.judul}</p>
            <p className="mt-1.5 text-[15px] leading-[1.55] text-ink-3">{langkah.teks}</p>
          </div>
          <Link to={langkah.to} className={`${TOMBOL_UTAMA} mt-5 h-11 text-[15px]`}>
            {langkah.tombol}
          </Link>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Titik kumpul terdekat */}
        <section
          aria-labelledby="judul-kumpul"
          className="flex flex-wrap content-between items-start justify-between gap-4 rounded-3xl border border-line/80 bg-base/95 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
        >
          <div>
            <h2 id="judul-kumpul" className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
              Titik kumpul terdekat
            </h2>
            <p className="mt-2 text-[16px] text-ink-3">
              {titikTerdekat
                ? `${titikTerdekat.nama}${titikTerdekat.jarak_km != null ? `, ${formatJarak(titikTerdekat.jarak_km)} dari rumah` : ""}`
                : "Belum ada titik kumpul untuk wilayahmu."}
            </p>
          </div>
          {titikTerdekat && (
            <button type="button" onClick={() => setShowMapModal(true)} className={TOMBOL_SEKUNDER}>
              Lihat rute
            </button>
          )}
        </section>


        {/* Anggota keluarga */}
        <section
          aria-labelledby="judul-anggota"
          className="rounded-3xl border border-line/80 bg-base/95 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
        >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="judul-anggota" className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
            Anggota keluarga
          </h2>
          <Link to="/keluarga" className={TOMBOL_SEKUNDER}>
            Lihat profil keluarga
          </Link>
        </div>
        {anggota.length === 0 ? (
          <p className="mt-3 text-[16px] text-ink-3">Belum ada anggota keluarga.</p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
            {anggota.map((m) => (
              <li key={m.id} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-full bg-tint text-[14px] font-semibold text-ink"
                >
                  {inisial(m.panggilan)}
                </span>
                <span className="text-[16px] font-medium text-ink">{m.panggilan}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      </div>

      <KabarKeluarga shareToken={household.share_token} />

      {/* Rute ke titik kumpul */}
      {showMapModal && titikTerdekat && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-rute"
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/60 p-4"
        >
          <div className="w-full max-w-[560px] rounded-2xl border border-line bg-base p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 id="judul-rute" className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
                Rute ke titik kumpul
              </h2>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                aria-label="Tutup"
                className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-tint hover:text-ink"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 text-[17px] font-semibold text-ink">{titikTerdekat.nama}</p>
            <p className="mt-1 text-[15px] leading-[1.55] text-ink-3">
              {titikTerdekat.jarak_km != null ? `Sekitar ${formatJarak(titikTerdekat.jarak_km)} dari rumah. ` : ""}
              Cek jalur dan kondisi jalan sebelum berangkat.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setShowMapModal(false)} className={TOMBOL_SEKUNDER}>
                Tutup
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${titikTerdekat.lat},${titikTerdekat.lng}`}
                target="_blank"
                rel="noreferrer"
                className={`${TOMBOL_UTAMA} h-10 text-[15px]`}
              >
                Buka di Google Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
