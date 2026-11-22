import { useState } from "react";
import {
  useAdminHazardZones,
  useCreateHazardZone,
  useDeleteHazardZone,
} from "@/hooks/useAdmin";
import { useRegions } from "@/hooks/useRisk";
import type { JenisBencana, TingkatRisiko } from "@/lib/types";

const JENIS_OPTIONS: JenisBencana[] = [
  "BANJIR",
  "GEMPA",
  "LONGSOR",
  "CUACA_EKSTREM",
  "TSUNAMI",
];
const TINGKAT_OPTIONS: TingkatRisiko[] = ["RENDAH", "SEDANG", "TINGGI"];

const JENIS_LABEL: Record<JenisBencana, string> = {
  BANJIR: "Banjir",
  GEMPA: "Gempa",
  LONGSOR: "Longsor",
  CUACA_EKSTREM: "Cuaca ekstrem",
  TSUNAMI: "Tsunami",
};

const TINGKAT_LABEL: Record<TingkatRisiko, string> = {
  RENDAH: "Rendah",
  SEDANG: "Sedang",
  TINGGI: "Tinggi",
};

const DEFAULT_ROWS = [
  {
    id: 1,
    nama: "Zona Rawan Banjir Dayeuhkolot",
    titleColor: "#1D4ED8",
    kecamatan: "Dayeuhkolot",
    tingkat: "Tinggi",
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Zona Rawan Longsor Bukit Pasirjambu",
    titleColor: "#A16207",
    kecamatan: "Pasirjambu",
    tingkat: "Tinggi",
    status: "Aktif",
  },
  {
    id: 3,
    nama: "Zona Rawan Gempa Sesar Lembang",
    titleColor: "#B91C1C",
    kecamatan: "Lembang",
    tingkat: "Sedang",
    status: "Dipantau",
  },
];

const ZONA_BARS = [
  { label: "Banjir", count: 2, pct: 70, color: "#1D4ED8" },
  { label: "Gempa", count: 1, pct: 35, color: "#B91C1C" },
  { label: "Longsor", count: 1, pct: 35, color: "#A16207" },
  { label: "Cuaca ekstrem", count: 1, pct: 35, color: "#0F766E" },
];

export function AdminZona() {
  const { data: zones } = useAdminHazardZones();
  const { data: regions } = useRegions();
  const createZone = useCreateHazardZone();
  const deleteZone = useDeleteHazardZone();

  const [showAdd, setShowAdd] = useState(false);
  const [regionId, setRegionId] = useState<number | "">("");
  const [jenis, setJenis] = useState<JenisBencana>("BANJIR");
  const [tingkat, setTingkat] = useState<TingkatRisiko>("SEDANG");
  const [sumber, setSumber] = useState("BNPB");

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!regionId) return;
    await createZone.mutateAsync({
      region_id: Number(regionId),
      jenis_bencana: jenis,
      tingkat,
      sumber: sumber.trim() || "BNPB",
    });
    setShowAdd(false);
  }

  function exportCsv() {
    const header = "ID,Wilayah,Jenis,Tingkat,Sumber\n";
    const rows = (zones ?? [])
      .map(
        (z) =>
          `${z.id},"${z.region.kecamatan}",${z.jenis_bencana},${z.tingkat},"${z.sumber}"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zona-bahaya-bpbd.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const tinggiCount = zones?.length
    ? zones.filter((z) => z.tingkat === "TINGGI").length
    : 2;

  return (
    <div className="space-y-5">
      {/* Header: Kelola zona bahaya + Ekspor CSV + Tambah zona (persis siagakeluarga.fig Node 4324, 4363, 4406) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]">
          Kelola zona bahaya
        </h1>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={exportCsv}
            className="h-[42px] rounded-[10px] border border-[#CBD5E1] bg-white px-[18px] text-[13px] font-semibold text-[#0B2545]"
          >
            Ekspor CSV
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="h-[42px] rounded-[10px] bg-[#C2410C] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#9A3412]"
          >
            + Tambah zona
          </button>
        </div>
      </div>

      {/* Stats (persis Node 4325) */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5">
          <p className="text-[12px] text-[#475569]">Zona aktif</p>
          <p className="mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]">
            {zones?.length || 5}
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#0F766E]">
            Dipantau 24 jam bersama data BMKG
          </p>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5">
          <p className="text-[12px] text-[#475569]">Tingkat risiko tinggi</p>
          <p className="mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]">
            {tinggiCount}
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#D97706]">
            Prioritas: Dayeuhkolot &amp; Baleendah
          </p>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5">
          <p className="text-[12px] text-[#475569]">Wilayah terdampak</p>
          <p className="mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]">
            3 kecamatan
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#0F766E]">
            1.204 keluarga dalam radius peringatan
          </p>
        </div>
      </div>

      {/* Tabel Zona Bahaya (persis Node 4338) */}
      <div className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white">
        <table className="w-full text-left text-[15px]">
          <thead className="border-b border-[#E2E8F0] bg-[#F4F1EA] text-[12px] text-[#475569]">
            <tr>
              <th className="px-6 py-3.5 font-normal">Nama zona</th>
              <th className="px-6 py-3.5 font-normal">Kecamatan</th>
              <th className="px-6 py-3.5 font-normal">Tingkat Risiko</th>
              <th className="px-6 py-3.5 font-normal">Status</th>
              <th className="px-6 py-3.5 text-right font-normal">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {zones?.length
              ? zones.map((z) => {
                  const color =
                    z.jenis_bencana === "BANJIR"
                      ? "#1D4ED8"
                      : z.jenis_bencana === "LONGSOR"
                        ? "#A16207"
                        : "#B91C1C";
                  return (
                    <tr key={z.id}>
                      <td
                        className="px-6 py-4 font-semibold"
                        style={{ color }}
                      >
                        Zona Rawan {JENIS_LABEL[z.jenis_bencana]} {z.region.kecamatan}
                      </td>
                      <td className="px-6 py-4 text-[#475569]">
                        {z.region.kecamatan}
                      </td>
                      <td className="px-6 py-4 text-[#475569]">
                        {TINGKAT_LABEL[z.tingkat]}
                      </td>
                      <td className="px-6 py-4 text-[#C2410C]">Aktif</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => deleteZone.mutate(z.id)}
                          className="text-[13px] font-semibold text-[#0B2545] hover:underline"
                        >
                          Ubah
                        </button>
                      </td>
                    </tr>
                  );
                })
              : DEFAULT_ROWS.map((r) => (
                  <tr key={r.id}>
                    <td
                      className="px-6 py-4 font-semibold"
                      style={{ color: r.titleColor }}
                    >
                      {r.nama}
                    </td>
                    <td className="px-6 py-4 text-[#475569]">{r.kecamatan}</td>
                    <td className="px-6 py-4 text-[#475569]">{r.tingkat}</td>
                    <td
                      className={`px-6 py-4 ${
                        r.status === "Aktif"
                          ? "text-[#C2410C]"
                          : "text-[#D97706]"
                      }`}
                    >
                      {r.status}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setShowAdd(true)}
                        className="text-[13px] font-semibold text-[#0B2545] hover:underline"
                      >
                        Ubah
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Row: Aktivitas terbaru & Zona per jenis bahaya (persis Node 4365) */}
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6">
          <p className="text-[18px] font-semibold text-[#0F172A]">
            Aktivitas terbaru
          </p>
          <div className="mt-4 divide-y divide-[#E2E8F0] text-[14px]">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#0F172A]">
                Zona Rawan Banjir Dayeuhkolot RW 05 diperbarui
              </span>
              <span className="text-[12px] text-[#475569]">1 jam lalu</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#0F172A]">
                Zona Rawan Longsor Bukit Pasirjambu ditinjau ulang
              </span>
              <span className="text-[12px] text-[#475569]">4 jam lalu</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#0F172A]">
                Zona Rawan Luapan Sungai Citarum ditambahkan
              </span>
              <span className="text-[12px] text-[#475569]">Kemarin</span>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6">
          <p className="text-[18px] font-semibold text-[#0F172A]">
            Zona per jenis bahaya
          </p>
          <div className="mt-4 space-y-3">
            {ZONA_BARS.map((b) => (
              <div
                key={b.label}
                className="flex items-center justify-between gap-3 text-[13px]"
              >
                <span className="w-28 shrink-0 text-[#475569]">{b.label}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-[140px] overflow-hidden rounded-[4px] bg-[#E2E8F0]">
                    <div
                      className="h-full rounded-[4px]"
                      style={{
                        width: `${b.pct}%`,
                        backgroundColor: b.color,
                      }}
                    />
                  </div>
                  <span className="w-4 text-right text-[12px] text-[#0F172A]">
                    {b.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peta Zona Bahaya (persis Node 4400) */}
      <div className="flex flex-wrap items-center gap-5 rounded-[16px] border border-[#E2E8F0] bg-white p-4">
        <img
          src="/images/map-dayeuhkolot.webp"
          alt="Peta Sebaran Zona Bahaya"
          className="h-[68px] w-[140px] shrink-0 rounded-[10px] object-cover"
        />
        <div className="flex-1">
          <p className="text-[15px] font-semibold text-[#0F172A]">
            Peta Sebaran Zona Bahaya Kab. Bandung Selatan
          </p>
          <p className="mt-0.5 text-[13px] text-[#475569]">
            Sinkronisasi langsung dengan data peringatan dini curah hujan BMKG
            &amp; pemantauan tinggi muka air Sungai Citarum.
          </p>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="mt-1 text-[13px] font-semibold text-[#C2410C] hover:underline"
          >
            Buka peta interaktif BPBD →
          </button>
        </div>
      </div>

      {/* Modal Tambah Zona Bahaya (persis Node 4409) */}
      {showAdd && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090C]/55 p-4"
        >
          <div className="w-full max-w-[480px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-[#0F172A]">
                Tambah zona bahaya
              </h2>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="flex size-8 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-lg font-bold text-[#475569]"
              >
                ×
              </button>
            </div>
            <form onSubmit={onAdd} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-[13px] font-medium text-[#475569]">
                  Wilayah
                </label>
                <select
                  value={regionId}
                  onChange={(e) =>
                    setRegionId(e.target.value ? Number(e.target.value) : "")
                  }
                  required
                  className="h-11 w-full rounded-[12px] border border-[#CBD5E1] bg-white px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]"
                >
                  <option value="">Pilih wilayah</option>
                  {regions?.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.kecamatan}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[13px] font-medium text-[#475569]">
                    Jenis bencana
                  </label>
                  <select
                    value={jenis}
                    onChange={(e) => setJenis(e.target.value as JenisBencana)}
                    className="h-11 w-full rounded-[12px] border border-[#CBD5E1] bg-white px-3.5 text-[14px] outline-none"
                  >
                    {JENIS_OPTIONS.map((j) => (
                      <option key={j} value={j}>
                        {JENIS_LABEL[j]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-medium text-[#475569]">
                    Tingkat risiko
                  </label>
                  <select
                    value={tingkat}
                    onChange={(e) =>
                      setTingkat(e.target.value as TingkatRisiko)
                    }
                    className="h-11 w-full rounded-[12px] border border-[#CBD5E1] bg-white px-3.5 text-[14px] outline-none"
                  >
                    {TINGKAT_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {TINGKAT_LABEL[t]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-medium text-[#475569]">
                  Sumber
                </label>
                <input
                  value={sumber}
                  onChange={(e) => setSumber(e.target.value)}
                  className="h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="h-11 rounded-[10px] border border-[#CBD5E1] bg-white px-5 text-[14px] font-semibold text-[#0B2545]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-[10px] bg-[#C2410C] px-6 text-[14px] font-semibold text-white"
                >
                  Simpan zona
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
