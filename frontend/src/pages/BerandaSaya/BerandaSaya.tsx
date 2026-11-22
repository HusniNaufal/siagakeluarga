import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useHousehold } from "@/hooks/useHousehold";
import { useDrills } from "@/hooks/useDrills";
import { useRisk } from "@/hooks/useRisk";
import { ProgressRing } from "@/components/ProgressRing";
import { computeSkorKesiapan } from "@/lib/score";

const DEFAULT_TIMELINE = [
  { jam: "08:00", suhu: "27°", ket: "Cerah (0% hujan)", active: false, blueKet: false },
  { jam: "11:00", suhu: "29°", ket: "Berawan (10% hujan)", active: false, blueKet: false },
  { jam: "14:00", suhu: "24°", ket: "Hujan lebat (80%)", active: true, blueKet: false },
  { jam: "17:00", suhu: "22°", ket: "Hujan ringan (60%)", active: false, blueKet: true },
  { jam: "20:00", suhu: "21°", ket: "Berawan (20% hujan)", active: false, blueKet: false },
];

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
    persentaseTasSiaga: household.kesiapan_tas.persentase || 67,
    rataRataSkorLatihan: drillsData?.rata_rata_skor ?? null,
  });

  const siapCount =
    household.kesiapan_tas.total > 0 ? household.kesiapan_tas.siap : 8;
  const totalCount =
    household.kesiapan_tas.total > 0 ? household.kesiapan_tas.total : 12;
  const belumCount = Math.max(0, totalCount - siapCount);
  const pctTas = Math.round((siapCount / Math.max(1, totalCount)) * 100);

  const titikTerdekat = risk?.titik_kumpul?.[0] ?? {
    id: 1,
    nama: "Aula Masjid Agung Dayeuhkolot",
    jarak_km: 0.4,
    lat: -6.9882,
    lng: 107.6284,
  };
  const cuaca = risk?.cuaca;
  const namaDepan = (user?.nama ?? "Budi").split(" ")[0];
  const kecamatanLabel =
    cuaca && cuaca.tersedia && cuaca.lokasi?.kecamatan
      ? cuaca.lokasi.kecamatan
      : household.region?.kecamatan ?? "Dayeuhkolot";

  return (
    <div className="space-y-5">
      {/* Greeting & Header Quick Actions (persis siagakeluarga.fig Node 1860..1868) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]">
            Halo, {namaDepan}
          </h1>
          <p className="mt-1 text-[15px] text-[#475569]">
            Sabtu, 21 November 2026
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="rounded-[8px] border border-[#E2E8F0] bg-white px-3.5 py-2 text-[12px] text-[#475569]">
            Kel. {kecamatanLabel}, sinkron 14:00 WIB
          </div>
          <Link
            to="/rencana"
            className="rounded-[8px] bg-[#0B2545] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#13345D]"
          >
            Perbarui rencana
          </Link>
        </div>
      </div>

      {/* Banner Cuaca Wrap (persis siagakeluarga.fig Node 1869..1876) */}
      <div className="relative rounded-[20px] bg-[#0B2545] px-7 pt-14 pb-6 text-white">
        <div className="absolute top-4 left-7 inline-flex items-center rounded-full bg-[#D97706] px-3.5 py-1.5 text-[13px] font-medium text-white">
          ⚠ Waspada
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[12px] text-white/65">
              Prakiraan BMKG {kecamatanLabel}
            </p>
            <h2 className="text-[20px] font-semibold text-[#F5F5F4] md:text-[22px]">
              {cuaca?.tersedia
                ? `${cuaca.saat_ini.cuaca} diperkirakan hari ini`
                : "Hujan lebat diperkirakan 15:00 hari ini"}
            </h2>
          </div>
          <p className="text-[40px] font-normal text-[#F5F5F4]">
            {cuaca?.tersedia ? `${Math.round(cuaca.saat_ini.suhu_c)}°` : "24°"}
          </p>
        </div>
      </div>

      {/* Cards Row: Skor kesiapan, Tas siaga, Langkah berikutnya (persis Node 1877..1897) */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Card 1: Skor Kesiapan (Node 1878) */}
        <div className="flex flex-col items-center justify-between rounded-[20px] border border-[#E2E8F0] bg-white p-6 text-center">
          <p className="text-[13px] text-[#475569]">Skor kesiapan</p>
          <div className="my-3">
            <ProgressRing value={skor || 72} size={116} />
          </div>
          <p className="text-[13px] text-[#475569]">Terus lengkapi rencanamu</p>
        </div>

        {/* Card 2: Tas Siaga (Node 1886) */}
        <div className="flex flex-col justify-between rounded-[20px] border border-[#E2E8F0] bg-white p-6">
          <p className="text-[13px] text-[#475569]">Tas siaga</p>
          <div className="my-3">
            <p className="text-[36px] leading-none font-normal text-[#0F172A]">
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
            <p className="mt-2.5 text-[18px] leading-[1.3] font-semibold text-[#9A3412]">
              Tambahkan kontak darurat keluarga besar
            </p>
            <p className="mt-1.5 text-[12px] text-[#475569]">
              Menambah +14% skor kesiapan keluarga (estimasi 2 menit)
            </p>
          </div>
          <Link
            to="/keluarga"
            className="mt-4 flex h-[44px] w-full items-center justify-center rounded-[8px] bg-[#C2410C] text-[14px] font-semibold text-white transition-colors hover:bg-[#9A3412]"
          >
            Lanjutkan
          </Link>
        </div>
      </div>

      {/* Ringkasan Titik Kumpul (persis Node 1898) */}
      <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[#E2E8F0] bg-white px-7 py-5">
        <div>
          <p className="text-[13px] text-[#475569]">Titik kumpul terdekat</p>
          <p className="mt-1 text-[17px] font-semibold text-[#0F172A]">
            {titikTerdekat.nama} (400 m)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowMapModal(true)}
          className="rounded-[8px] border border-[#E2E8F0] bg-white px-4 py-2 text-[14px] font-semibold text-[#0F172A] hover:bg-[#F4F1EA]"
        >
          Lihat peta
        </button>
      </div>

      {/* Mini Timeline (persis Node 1904..1924) */}
      <div className="grid grid-cols-2 gap-3 rounded-[16px] border border-[#E2E8F0] bg-white p-4 sm:grid-cols-5">
        {DEFAULT_TIMELINE.map((item) => (
          <div
            key={item.jam}
            className={`flex flex-col items-center gap-1 rounded-[12px] px-3 py-3.5 text-center ${
              item.active
                ? "border-[1.5px] border-[#C2410C] bg-[#FFF7ED]"
                : "border border-[#E2E8F0] bg-[#F8FAFC]"
            }`}
          >
            <p
              className={`text-[12px] ${
                item.active ? "text-[#C2410C]" : "text-[#475569]"
              }`}
            >
              {item.jam}
            </p>
            <p
              className={`text-[18px] ${
                item.active ? "text-[#C2410C]" : "text-[#0B2545]"
              }`}
            >
              {item.suhu}
            </p>
            <p
              className={`text-[12px] ${
                item.active
                  ? "font-semibold text-[#9A3412]"
                  : item.blueKet
                    ? "font-medium text-[#1D4ED8]"
                    : "font-medium text-[#475569]"
              }`}
            >
              {item.ket}
            </p>
          </div>
        ))}
      </div>

      {/* Anggota Keluarga Ringkas (persis Node 1925..1943) */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-[#E2E8F0] bg-white px-6 py-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/avatar-budi.webp"
              alt="Budi"
              className="size-9 rounded-full object-cover"
            />
            <span className="text-[13px] font-medium text-[#0F172A]">Budi</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#F4F1EA] text-[11px] text-[#0B2545]">
              SP
            </span>
            <span className="text-[13px] font-medium text-[#0F172A]">Sari</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#F4F1EA] text-[11px] text-[#0B2545]">
              NA
            </span>
            <span className="text-[13px] font-medium text-[#0F172A]">
              Nenek Aminah
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#F4F1EA] text-[11px] text-[#0B2545]">
              RP
            </span>
            <span className="text-[13px] font-medium text-[#0F172A]">Raka</span>
          </div>
        </div>

        <Link
          to="/keluarga"
          className="text-[13px] font-semibold text-[#C2410C] hover:underline"
        >
          Lihat profil keluarga
        </Link>
      </div>

      {/* Modal Peta Titik Kumpul (persis siagakeluarga.fig Node 1944 / 2061) */}
      {showMapModal && (
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
                className="text-[20px] leading-none font-medium text-[#64748B] hover:text-[#0F172A]"
              >
                ×
              </button>
            </div>

            <div className="relative h-[240px] w-full overflow-hidden rounded-[12px] border border-[#CBD5E1] bg-[#E2E8F0]">
              <img
                src="/images/map-dayeuhkolot.webp"
                alt="Peta OSM Dayeuhkolot"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-1/2 left-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#C2410C] text-white shadow">
                <span className="size-2.5 rounded-full bg-white" />
              </div>
            </div>

            {/* Tanpa kotak bersarang abu-abu/krem — tipografi tampil langsung dan rapi (Node 2066) */}
            <div className="space-y-1.5 py-1">
              <p className="text-[16px] font-semibold text-[#0B2545]">
                {titikTerdekat.nama}
              </p>
              <p className="text-[13px] leading-[20px] text-[#475569]">
                Jarak 400 meter (±5 menit berjalan kaki dari Jl. Raya Dayeuhkolot
                No. 12). Kapasitas 450 orang, akses ramah kursi roda untuk Nenek
                Aminah.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] font-medium text-[#64748B]">
                Sumber koordinat: BPBD Kab. Bandung
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
