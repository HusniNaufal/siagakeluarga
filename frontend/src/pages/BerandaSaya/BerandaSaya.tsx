import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useHousehold } from "@/hooks/useHousehold";
import { useDrills } from "@/hooks/useDrills";
import { useRisk } from "@/hooks/useRisk";
import { StatusMark } from "@/components/ui/StatusMark";
import { ProgressRing } from "@/components/ProgressRing";
import { computeSkorKesiapan } from "@/lib/score";

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

  if (isLoading || !household) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted" />;
  }

  const adaRencana = (household.emergency_plans?.length ?? 0) > 0;
  const skor = computeSkorKesiapan({
    adaRencana,
    persentaseTasSiaga: household.kesiapan_tas.persentase,
    rataRataSkorLatihan: drillsData?.rata_rata_skor ?? null,
  });

  const siapCount = household.kesiapan_tas.siap;
  const totalCount = household.kesiapan_tas.total;
  const belumCount = Math.max(0, totalCount - siapCount);
  const pctTas = Math.round((siapCount / Math.max(1, totalCount)) * 100);

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
      : household.region?.kecamatan ?? null;

  const jumlahAnggota = household.members?.length ?? 0;
  const langkah =
    jumlahAnggota === 0
      ? { judul: "Tambahkan anggota keluarga", teks: "Rencana dan tas siaga disusun dari siapa saja yang tinggal di rumah.", to: "/keluarga", tombol: "Tambah anggota" }
      : household.lat == null || household.lng == null
        ? { judul: "Isi lokasi rumahmu", teks: "Dipakai untuk titik kumpul terdekat dan prakiraan cuaca di kelurahanmu.", to: "/onboarding", tombol: "Isi lokasi" }
        : !adaRencana
          ? { judul: "Susun rencana daruratmu", teks: "Titik kumpul dan tugas tiap anggota ditulis dalam satu halaman.", to: "/rencana", tombol: "Susun rencana" }
          : totalCount === 0
            ? { judul: "Mulai isi tas siaga", teks: "Tambahkan barang yang perlu dibawa saat harus pergi cepat.", to: "/tas-siaga", tombol: "Buka tas siaga" }
            : belumCount > 0
              ? { judul: `Lengkapi ${belumCount} barang tas siaga`, teks: "Centang barang yang sudah siap supaya terlihat mana yang masih kurang.", to: "/tas-siaga", tombol: "Buka tas siaga" }
              : { judul: "Coba latihan singkat", teks: "Latihan mengecek apakah keluargamu tahu langkah pertama.", to: "/latihan", tombol: "Mulai latihan" };

  return (
    <div className="space-y-5">
      {/* Greeting & Header Quick Actions (persis siagakeluarga.fig Node 1860..1868) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0B2545]">
            Halo{namaDepan ? `, ${namaDepan}` : ""}
          </h1>
          <p className="mt-1 text-[15px] text-[#475569]">
            {tanggalHariIni}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="rounded-[8px] border border-[#E2E8F0] bg-white px-3.5 py-2 text-[12px] text-[#475569]">
            {kecamatanLabel ? `Kec. ${kecamatanLabel}` : "Lokasi belum diisi"}
          </div>
          <Link
            to="/rencana"
            className="rounded-[8px] bg-[#0B2545] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#143258]"
          >
            Perbarui rencana
          </Link>
        </div>
      </div>

      {/* Banner Cuaca Wrap (persis siagakeluarga.fig Node 1869..1876) */}
      <div className="relative rounded-[20px] bg-[#0B2545] px-7 pt-14 pb-6 text-white">
        {statusCuaca && <StatusMark tingkat={statusCuaca} tone="gelap" className="absolute top-5 left-7 w-[220px]" />}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[12px] text-white/65">
              Prakiraan BMKG{kecamatanLabel ? ` · ${kecamatanLabel}` : ""}
            </p>
            <h2 className="text-[20px] font-semibold text-[#F1F5F9] md:text-[22px]">
              {cuaca?.tersedia
                ? `${cuaca.saat_ini.cuaca} saat ini`
                : "Prakiraan belum tersedia"}
            </h2>
          </div>
          <p className="text-[40px] font-normal text-[#F1F5F9]">
            {cuaca?.tersedia ? `${Math.round(cuaca.saat_ini.suhu_c)}°` : "–"}
          </p>
        </div>
      </div>

      {/* Cards Row: Skor kesiapan, Tas siaga, Langkah berikutnya (persis Node 1877..1897) */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Card 1: Skor Kesiapan (Node 1878) */}
        <div className="flex flex-col items-center justify-between rounded-[20px] border border-[#E2E8F0] bg-white p-6 text-center">
          <p className="text-[13px] text-[#475569]">Skor kesiapan</p>
          <div className="my-3">
            <ProgressRing value={skor} size={116} />
          </div>
          <p className="text-[13px] text-[#475569]">Terus lengkapi rencanamu</p>
        </div>

        {/* Card 2: Tas Siaga (Node 1886) */}
        <div className="flex flex-col justify-between rounded-[20px] border border-[#E2E8F0] bg-white p-6">
          <p className="text-[13px] text-[#475569]">Tas siaga</p>
          <div className="my-3">
            <p className="text-[36px] leading-none font-normal text-[#0B2545]">
              {siapCount}/{totalCount}
            </p>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-[5px] bg-[#E2E8F0]">
              <div
                className="h-full rounded-[5px] bg-[#C2410C]"
                style={{ width: `${pctTas}%` }}
              />
            </div>
          </div>
          <p className="text-[13px] text-[#475569]">
            {belumCount} barang perlu dicek
          </p>
        </div>

        {/* Card 3: Langkah Berikutnya (Node 1892) */}
        <div className="flex flex-col justify-between rounded-[20px] border border-[#E2E8F0] bg-white p-6">
          <div>
            <p className="text-[13px] text-[#475569]">Langkah berikutnya</p>
            <p className="mt-2.5 text-[18px] leading-[1.3] font-semibold text-[#0B2545]">{langkah.judul}</p>
            <p className="mt-1.5 text-[14px] leading-[1.5] text-[#475569]">{langkah.teks}</p>
          </div>
          <Link
            to={langkah.to}
            className="mt-4 flex h-[44px] w-full items-center justify-center rounded-[8px] bg-[#C2410C] text-[14px] font-semibold text-white transition-colors hover:bg-[#9A3412]"
          >
            {langkah.tombol}
          </Link>
        </div>
      </div>

      {/* Ringkasan Titik Kumpul (persis Node 1898) */}
      <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[#E2E8F0] bg-white px-7 py-5">
        <div>
          <p className="text-[13px] text-[#475569]">Titik kumpul terdekat</p>
          <p className="mt-1 text-[17px] font-semibold text-[#0B2545]">
            {titikTerdekat
              ? `${titikTerdekat.nama}${titikTerdekat.jarak_km != null ? ` (${titikTerdekat.jarak_km < 1 ? `${Math.round(titikTerdekat.jarak_km * 1000)} m` : `${titikTerdekat.jarak_km.toFixed(1)} km`})` : ""}`
              : "Belum ada titik kumpul untuk wilayahmu"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowMapModal(true)}
          className="rounded-[8px] border border-[#E2E8F0] bg-white px-4 py-2 text-[14px] font-semibold text-[#0B2545] hover:bg-[#F1F5F9]"
        >
          Lihat peta
        </button>
      </div>

      {/* Cuaca beberapa jam ke depan: data BMKG asli, disembunyikan bila belum tersedia. */}
      {cuaca?.tersedia && (
        <ul className="grid grid-cols-2 gap-3 rounded-[16px] border border-[#E2E8F0] bg-white p-4 sm:grid-cols-5">
          {cuaca.prakiraan.slice(0, 5).map((e, i) => (
            <li
              key={e.waktu_lokal}
              className={`flex flex-col items-center gap-1 rounded-[12px] px-3 py-3.5 text-center ${
                i === 0 ? "border border-[#0B2545]/25 bg-[#F1F5F9]" : "border border-[#E2E8F0] bg-[#F8FAFC]"
              }`}
            >
              <p className="text-[12px] text-[#475569]">{e.waktu_lokal.slice(11, 16)}</p>
              <p className="text-[18px] text-[#0B2545]">{Math.round(e.suhu_c)}°</p>
              <p className="text-[12px] font-medium text-[#475569]">
                {e.cuaca}
                {e.curah_hujan_mm > 0 ? ` · ${e.curah_hujan_mm} mm` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Anggota Keluarga Ringkas (persis Node 1925..1943) */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-[#E2E8F0] bg-white px-6 py-4">
        <div className="flex flex-wrap items-center gap-6">
          {(household.members ?? []).length === 0 && (
            <span className="text-[14px] text-[#475569]">Belum ada anggota keluarga.</span>
          )}
          {(household.members ?? []).map((m) => (
            <div key={m.id} className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-full bg-[#F1F5F9] text-[11px] text-[#0B2545]"
              >
                {m.panggilan
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((s) => s[0]?.toUpperCase())
                  .join("")}
              </span>
              <span className="text-[13px] font-medium text-[#0B2545]">{m.panggilan}</span>
            </div>
          ))}
        </div>

        <Link
          to="/keluarga"
          className="text-[13px] font-semibold text-[#C2410C] hover:underline"
        >
          Lihat profil keluarga
        </Link>
      </div>

      {/* Modal Peta Titik Kumpul (persis siagakeluarga.fig Node 1944 / 2061) */}
      {showMapModal && titikTerdekat && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2545]/45 p-4"
        >
          <div className="flex w-full max-w-[620px] flex-col gap-4 rounded-[18px] border border-[#E2E8F0] bg-white px-8 py-7 shadow-[0_20px_48px_rgba(11,37,69,0.16)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-semibold text-[#0B2545]">
                Rute ke Titik Kumpul Terdekat
              </h2>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="text-[20px] leading-none font-medium text-[#64748B] hover:text-[#0B2545]"
              >
                ×
              </button>
            </div>

            {/* Tanpa kotak bersarang abu-abu/krem — tipografi tampil langsung dan rapi (Node 2066) */}
            <div className="space-y-1.5 py-1">
              <p className="text-[16px] font-semibold text-[#0B2545]">
                {titikTerdekat.nama}
              </p>
              <p className="text-[13px] leading-[20px] text-[#475569]">
                {titikTerdekat.jarak_km != null
                  ? `Sekitar ${titikTerdekat.jarak_km < 1 ? `${Math.round(titikTerdekat.jarak_km * 1000)} m` : `${titikTerdekat.jarak_km.toFixed(1)} km`} dari rumah. `
                  : ""}
                Cek jalur dan kondisi jalan sebelum berangkat.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] font-medium text-[#64748B]">
                Koordinat titik kumpul dari data wilayah
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowMapModal(false)}
                  className="h-[42px] rounded-[8px] border border-[#CBD5E1] bg-white px-[18px] text-[13px] font-semibold text-[#0B2545]"
                >
                  Tutup
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${titikTerdekat.lat},${titikTerdekat.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-[42px] items-center rounded-[8px] bg-[#C2410C] px-5 text-[13px] font-semibold text-white"
                >
                  Buka di Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
