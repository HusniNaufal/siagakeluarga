import { useState } from "react";
import { useHousehold } from "@/hooks/useHousehold";
import { useRisk } from "@/hooks/useRisk";
import type { TingkatRisiko } from "@/lib/types";

const TINGKAT_RANK: Record<TingkatRisiko, number> = {
  RENDAH: 0,
  SEDANG: 1,
  TINGGI: 2,
};
const TINGKAT_LABEL: Record<TingkatRisiko, string> = {
  RENDAH: "Aman",
  SEDANG: "Waspada",
  TINGGI: "Bahaya",
};

const DAYS = [
  {
    label: "Senin",
    suhu: "27°/21°",
    cuaca: "Cerah berawan",
    detail: "Curah hujan 2 mm, kelembapan 72%",
    highlight: false,
  },
  {
    label: "Selasa",
    suhu: "28°/22°",
    cuaca: "Hujan lebat sore",
    detail: "Curah hujan 42 mm, waspada genangan",
    highlight: true,
  },
  {
    label: "Rabu",
    suhu: "26°/21°",
    cuaca: "Hujan ringan",
    detail: "Curah hujan 12 mm, angin 14 km/j",
    highlight: false,
  },
];

const TIMELINE = [
  {
    jam: "08:00",
    suhu: "27°",
    hujan: "0%",
    ket: "Cerah",
    fillPct: 4,
    active: false,
    blueKet: false,
  },
  {
    jam: "11:00",
    suhu: "29°",
    hujan: "10%",
    ket: "Berawan",
    fillPct: 10,
    active: false,
    blueKet: false,
  },
  {
    jam: "14:00",
    suhu: "24°",
    hujan: "80%",
    ket: "Hujan Lebat",
    fillPct: 80,
    active: true,
    blueKet: false,
  },
  {
    jam: "17:00",
    suhu: "22°",
    hujan: "60%",
    ket: "Hujan Ringan",
    fillPct: 60,
    active: false,
    blueKet: true,
  },
  {
    jam: "20:00",
    suhu: "21°",
    hujan: "20%",
    ket: "Berawan",
    fillPct: 20,
    active: false,
    blueKet: false,
  },
];

const SARAN = [
  {
    judul: "Siapkan tas siaga",
    teks: "Pastikan senter, obat rutin, dan dokumen penting sudah ada di tas siaga.",
  },
  {
    judul: "Pantau info resmi BPBD",
    teks: "Aktifkan notifikasi cuaca ekstrem dan ikuti arahan petugas setempat.",
  },
  {
    judul: "Kenali jalur ke titik kumpul",
    teks: "Jalur ke Aula Masjid Agung Dayeuhkolot, sekitar 400 m dari rumah.",
  },
];

const DEFAULT_TITIK = [
  {
    id: 1,
    nama: "Aula Masjid Agung Dayeuhkolot",
    jarak: "400 m",
    lat: -6.9882,
    lng: 107.6284,
  },
  {
    id: 2,
    nama: "Kantor Kecamatan Dayeuhkolot",
    jarak: "650 m",
    lat: -6.9855,
    lng: 107.6305,
  },
  {
    id: 3,
    nama: "Lapangan Desa Citeureup",
    jarak: "1,1 km",
    lat: -6.9812,
    lng: 107.6331,
  },
];

export function Risiko() {
  const { data: household } = useHousehold();
  const { data: risk, isLoading } = useRisk(
    household?.region_id
      ? {
          region_id: household.region_id,
          lat: household.lat ?? undefined,
          lng: household.lng ?? undefined,
        }
      : undefined,
  );
  const [selectedPoint, setSelectedPoint] = useState<{
    nama: string;
    lat: number;
    lng: number;
  } | null>(null);

  if (isLoading || !risk) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted" />;
  }

  const tingkatTertinggi = risk.zona_risiko.length
    ? risk.zona_risiko.reduce<TingkatRisiko>(
        (acc, z) =>
          TINGKAT_RANK[z.tingkat] > TINGKAT_RANK[acc] ? z.tingkat : acc,
        "RENDAH",
      )
    : "SEDANG";

  const titikList = risk.titik_kumpul.length
    ? risk.titik_kumpul.slice(0, 3).map((t, idx) => ({
        id: t.id,
        nama: t.nama,
        jarak:
          t.jarak_km != null
            ? t.jarak_km < 1
              ? `${Math.round(t.jarak_km * 1000)} m`
              : `${t.jarak_km} km`
            : DEFAULT_TITIK[idx]?.jarak ?? "400 m",
        lat: t.lat,
        lng: t.lng,
      }))
    : DEFAULT_TITIK;

  return (
    <div className="space-y-5">
      {/* Judul Halaman (persis siagakeluarga.fig Node 3335) */}
      <h1 className="text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]">
        Risiko dan cuaca
      </h1>

      {/* Status Besar (persis Node 3336) */}
      <div className="rounded-[20px] border border-[#E2E8F0] bg-white px-7 py-6">
        <span className="inline-flex items-center rounded-full bg-[#D97706] px-3.5 py-1.5 text-[13px] font-medium text-white">
          ⚠ {TINGKAT_LABEL[tingkatTertinggi]}
        </span>
        <h2 className="mt-4 text-[26px] leading-tight font-bold text-[#0F172A]">
          Hujan lebat di wilayahmu sore ini
        </h2>
        <p className="mt-2 text-[16px] text-[#92400E]">
          Saran: siapkan tas siaga dan pantau ketinggian air di sekitar rumah.
        </p>
      </div>

      {/* 3 Hari (persis Node 3341..3356) */}
      <div className="grid gap-4 sm:grid-cols-3">
        {DAYS.map((d) => (
          <div
            key={d.label}
            className={`rounded-[16px] border p-5 ${
              d.highlight
                ? "border-[1.5px] border-[#C2410C] bg-[#F4F1EA]"
                : "border-[#E2E8F0] bg-white"
            }`}
          >
            <p
              className={`text-[12px] ${
                d.highlight ? "text-[#C2410C]" : "text-[#475569]"
              }`}
            >
              {d.label}
            </p>
            <p className="mt-3 text-[22px] font-normal text-[#0F172A]">
              {d.suhu}
            </p>
            <p
              className={`mt-1 text-[14px] ${
                d.highlight ? "font-semibold text-[#9A3412]" : "text-[#475569]"
              }`}
            >
              {d.cuaca}
            </p>
            <p
              className={`mt-1 text-[12px] ${
                d.highlight ? "text-[#9A3412]" : "text-[#64748B]"
              }`}
            >
              {d.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Timeline 3 Jam (persis Node 3357..3392 — kartu PUTIH dengan 5 kartu slot di dalamnya!) */}
      <div className="grid grid-cols-2 gap-3 rounded-[16px] border border-[#E2E8F0] bg-white p-4 sm:grid-cols-5">
        {TIMELINE.map((t) => (
          <div
            key={t.jam}
            className={`flex flex-col items-center gap-1.5 rounded-[12px] px-3.5 py-3 text-center ${
              t.active
                ? "border-[1.5px] border-[#C2410C] bg-[#FFF7ED]"
                : "border border-[#E2E8F0] bg-[#F8FAFC]"
            }`}
          >
            <p
              className={`text-[13px] ${
                t.active
                  ? "font-semibold text-[#C2410C]"
                  : "font-medium text-[#475569]"
              }`}
            >
              {t.jam}
            </p>
            <p
              className={`font-semibold ${
                t.active
                  ? "text-[24px] text-[#C2410C]"
                  : "text-[22px] text-[#0B2545]"
              }`}
            >
              {t.suhu}
            </p>
            <p className="text-[13px] font-medium text-[#1D4ED8]">{t.hujan}</p>
            <div
              className={`h-[6px] w-[100px] overflow-hidden rounded-[3px] ${
                t.active ? "bg-[#FED7AA]" : "bg-[#E2E8F0]"
              }`}
            >
              <div
                className={`h-full rounded-[3px] ${
                  t.active ? "bg-[#C2410C]" : "bg-[#1D4ED8]"
                }`}
                style={{ width: `${t.fillPct}%` }}
              />
            </div>
            <p
              className={`text-[11px] ${
                t.active
                  ? "font-semibold text-[#9A3412]"
                  : t.blueKet
                    ? "font-medium text-[#1D4ED8]"
                    : "font-medium text-[#64748B]"
              }`}
            >
              {t.ket}
            </p>
          </div>
        ))}
      </div>

      {/* Saran tindakan (persis Node 3393..3402) */}
      <div>
        <h3 className="mb-3 text-[20px] font-semibold text-[#0F172A]">
          Saran tindakan
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {SARAN.map((s) => (
            <div
              key={s.judul}
              className="rounded-[16px] border border-[#E2E8F0] bg-white p-5"
            >
              <p className="text-[16px] font-semibold text-[#0F172A]">
                {s.judul}
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#475569]">
                {s.teks}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Titik kumpul terdekat (persis Node 3403..3428) */}
      <div>
        <h3 className="mb-3 text-[20px] font-semibold text-[#0F172A]">
          Titik kumpul terdekat
        </h3>
        <div className="divide-y divide-[#E2E8F0] overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white">
          {titikList.map((t, idx) => (
            <div
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
            >
              <div className="flex items-center gap-4">
                <span className="text-[14px] text-[#C2410C]">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <p className="text-[16px] font-semibold text-[#0F172A]">
                  {t.nama}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[13px] text-[#475569]">{t.jarak}</span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPoint({ nama: t.nama, lat: t.lat, lng: t.lng })
                  }
                  className="text-[14px] font-semibold text-[#C2410C] hover:underline"
                >
                  Lihat di peta
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Peta Titik Kumpul (persis Node 3556) */}
      {selectedPoint && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090C]/55 p-4"
        >
          <div className="w-full max-w-[580px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-[#0F172A]">
                {selectedPoint.nama}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedPoint(null)}
                className="flex size-8 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-lg font-bold text-[#475569]"
              >
                ×
              </button>
            </div>
            <div className="relative mt-4 h-[260px] w-full overflow-hidden rounded-[16px] border border-[#E2E8F0]">
              <img
                src="/images/map-dayeuhkolot.webp"
                alt={selectedPoint.nama}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-1/2 left-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#C2410C] text-white shadow">
                <span className="size-2.5 rounded-full bg-white" />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPoint(null)}
                className="h-11 rounded-[10px] bg-[#C2410C] px-6 text-[14px] font-semibold text-white"
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
