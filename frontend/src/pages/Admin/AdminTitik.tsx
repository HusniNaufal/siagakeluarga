import { useState } from "react";
import {
  useAdminAssemblyPoints,
  useCreateAssemblyPoint,
  useDeleteAssemblyPoint,
} from "@/hooks/useAdmin";
import { useRegions } from "@/hooks/useRisk";

const DEFAULT_ROWS = [
  {
    id: 1,
    nama: "Aula Masjid Agung Dayeuhkolot",
    kapasitas: "450 orang",
    akses: "Ramah kursi roda",
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Lapangan Desa Citeureup",
    kapasitas: "600 orang",
    akses: "Akses datar",
    status: "Aktif",
  },
  {
    id: 3,
    nama: "Balai Warga RW 08",
    kapasitas: "220 orang",
    akses: "Perlu ramp",
    status: "Perlu diperbarui",
  },
];

const KECAMATAN_BARS = [
  { label: "Dayeuhkolot", count: 14, pct: 80, color: "#1D4ED8" },
  { label: "Baleendah", count: 11, pct: 64, color: "#0F766E" },
  { label: "Bojongsoang", count: 7, pct: 45, color: "#A16207" },
  { label: "Citeureup", count: 5, pct: 32, color: "#C2410C" },
];

export function AdminTitik() {
  const { data: points } = useAdminAssemblyPoints();
  const { data: regions } = useRegions();
  const createPoint = useCreateAssemblyPoint();
  const deletePoint = useDeleteAssemblyPoint();

  const [showAdd, setShowAdd] = useState(false);
  const [regionId, setRegionId] = useState<number | "">("");
  const [nama, setNama] = useState("");
  const [lat, setLat] = useState("-6.9882");
  const [lng, setLng] = useState("107.6284");

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!regionId || !nama.trim() || !lat || !lng) return;
    await createPoint.mutateAsync({
      region_id: Number(regionId),
      nama: nama.trim(),
      lat: Number(lat),
      lng: Number(lng),
    });
    setNama("");
    setShowAdd(false);
  }

  function exportCsv() {
    const header = "ID,Nama Titik Kumpul,Wilayah,Lat,Lng\n";
    const rows = (points ?? [])
      .map(
        (p) => `${p.id},"${p.nama}","${p.region.kecamatan}",${p.lat},${p.lng}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "titik-kumpul-bpbd.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      {/* Header: Kelola titik kumpul + Ekspor CSV + Tambah titik kumpul (persis siagakeluarga.fig Node 4085, 4124, 4167) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]">
          Kelola titik kumpul
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
            + Tambah titik kumpul
          </button>
        </div>
      </div>

      {/* Stats (persis Node 4086) */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5">
          <p className="text-[12px] text-[#475569]">Titik aktif</p>
          <p className="mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]">
            {points?.length || 37}
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#0F766E]">
            35 siap digunakan, 2 perlu pembaruan
          </p>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5">
          <p className="text-[12px] text-[#475569]">Kapasitas total</p>
          <p className="mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]">
            5.200 orang
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#0F766E]">
            Rata-rata 140 orang/titik, ramah lansia
          </p>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5">
          <p className="text-[12px] text-[#475569]">Kecamatan terjangkau</p>
          <p className="mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]">
            4
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#0F766E]">
            Dayeuhkolot, Baleendah, Bojongsoang, Citeureup
          </p>
        </div>
      </div>

      {/* Tabel Titik Kumpul (persis Node 4099) */}
      <div className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white">
        <table className="w-full text-left text-[15px]">
          <thead className="border-b border-[#E2E8F0] bg-[#F4F1EA] text-[12px] text-[#475569]">
            <tr>
              <th className="px-6 py-3.5 font-normal">Nama titik kumpul</th>
              <th className="px-6 py-3.5 font-normal">Kapasitas</th>
              <th className="px-6 py-3.5 font-normal">Akses Lansia</th>
              <th className="px-6 py-3.5 font-normal">Status</th>
              <th className="px-6 py-3.5 text-right font-normal">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {points?.length
              ? points.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 font-semibold text-[#0F172A]">
                      {p.nama}
                    </td>
                    <td className="px-6 py-4 text-[#475569]">450 orang</td>
                    <td className="px-6 py-4 text-[#475569]">
                      Ramah kursi roda
                    </td>
                    <td className="px-6 py-4 text-[#C2410C]">Aktif</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => deletePoint.mutate(p.id)}
                        className="text-[13px] font-semibold text-[#0B2545] hover:underline"
                      >
                        Ubah
                      </button>
                    </td>
                  </tr>
                ))
              : DEFAULT_ROWS.map((r) => (
                  <tr key={r.id}>
                    <td className="px-6 py-4 font-semibold text-[#0F172A]">
                      {r.nama}
                    </td>
                    <td className="px-6 py-4 text-[#475569]">{r.kapasitas}</td>
                    <td className="px-6 py-4 text-[#475569]">{r.akses}</td>
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

      {/* Bottom Row: Aktivitas terbaru & Titik per kecamatan (persis Node 4126) */}
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6">
          <p className="text-[18px] font-semibold text-[#0F172A]">
            Aktivitas terbaru
          </p>
          <div className="mt-4 divide-y divide-[#E2E8F0] text-[14px]">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#0F172A]">
                Titik kumpul Lapangan Desa Citeureup diperbarui
              </span>
              <span className="text-[12px] text-[#475569]">30 menit lalu</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#0F172A]">
                Titik kumpul Balai Warga RW 08 Dayeuhkolot ditambahkan
              </span>
              <span className="text-[12px] text-[#475569]">3 jam lalu</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#0F172A]">
                Titik kumpul Balai Warga RW 08 perlu verifikasi
              </span>
              <span className="text-[12px] text-[#475569]">Kemarin</span>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6">
          <p className="text-[18px] font-semibold text-[#0F172A]">
            Titik per kecamatan
          </p>
          <div className="mt-4 space-y-3">
            {KECAMATAN_BARS.map((b) => (
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
                  <span className="w-5 text-right text-[12px] text-[#0F172A]">
                    {b.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peta Titik Kumpul (persis Node 4161) */}
      <div className="flex flex-wrap items-center gap-5 rounded-[16px] border border-[#E2E8F0] bg-white p-4">
        <img
          src="/images/map-dayeuhkolot.webp"
          alt="Peta Sebaran Titik Kumpul"
          className="h-[68px] w-[140px] shrink-0 rounded-[10px] object-cover"
        />
        <div className="flex-1">
          <p className="text-[15px] font-semibold text-[#0F172A]">
            Peta Sebaran 37 Titik Kumpul Terverifikasi Kab. Bandung
          </p>
          <p className="mt-0.5 text-[13px] text-[#475569]">
            Mencakup Aula Masjid Agung Dayeuhkolot, Lapangan Desa Citeureup,
            Kantor Kecamatan, dan 34 titik aman ramah lansia.
          </p>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="mt-1 text-[13px] font-semibold text-[#C2410C] hover:underline"
          >
            Verifikasi koordinat di peta →
          </button>
        </div>
      </div>

      {/* Modal Tambah Titik Kumpul (persis Node 4170) */}
      {showAdd && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090C]/55 p-4"
        >
          <div className="w-full max-w-[480px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-[#0F172A]">
                Tambah titik kumpul
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
              <div>
                <label className="mb-1 block text-[13px] font-medium text-[#475569]">
                  Nama titik kumpul
                </label>
                <input
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Mis. Aula Masjid Agung Dayeuhkolot"
                  required
                  className="h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[13px] font-medium text-[#475569]">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-medium text-[#475569]">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none"
                  />
                </div>
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
                  Simpan titik kumpul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
