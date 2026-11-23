import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  useAdminAssemblyPoints,
  useCreateAssemblyPoint,
  useDeleteAssemblyPoint,
} from "@/hooks/useAdmin";
import { useRegions } from "@/hooks/useRisk";

export function AdminTitik() {
  const { data: points, isLoading } = useAdminAssemblyPoints();
  const { data: regions } = useRegions();
  const createPoint = useCreateAssemblyPoint();
  const deletePoint = useDeleteAssemblyPoint();

  const [showAdd, setShowAdd] = useState(false);
  const [regionId, setRegionId] = useState<number | "">("");
  const [nama, setNama] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const daftar = points ?? [];
  const wilayah = new Set(daftar.map((p) => p.region_id)).size;

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    const la = Number(lat);
    const lo = Number(lng);
    if (!regionId || !nama.trim() || !Number.isFinite(la) || !Number.isFinite(lo)) return;
    await createPoint.mutateAsync({ region_id: Number(regionId), nama: nama.trim(), lat: la, lng: lo });
    setNama("");
    setLat("");
    setLng("");
    setShowAdd(false);
  }

  function exportCsv() {
    const header = "ID,Nama,Wilayah,Lat,Lng\n";
    const rows = daftar.map((p) => `${p.id},"${p.nama}","${p.region.kecamatan}",${p.lat},${p.lng}`).join("\n");
    const url = URL.createObjectURL(new Blob([header + rows], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "titik-kumpul.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1>Titik kumpul</h1>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={exportCsv}
            disabled={daftar.length === 0}
            className="h-10 rounded-full border border-line bg-base px-4 text-[14px] font-semibold text-ink hover:bg-tint disabled:opacity-50"
          >
            Ekspor CSV
          </button>
          <button
            type="button"
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-accent-dark px-4 text-[14px] font-semibold text-white hover:bg-accent-hover"
          >
            <Plus className="size-4" aria-hidden="true" />
            Tambah titik
          </button>
        </div>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["Titik tercatat", daftar.length],
          ["Wilayah tercakup", wilayah],
        ].map(([label, nilai]) => (
          <div key={label} className="rounded-2xl border border-line bg-base p-5">
            <dt className="text-[14px] text-muted">{label}</dt>
            <dd className="font-display mt-1 text-[34px] leading-none font-semibold tracking-[-0.03em] text-ink">{nilai}</dd>
          </div>
        ))}
      </dl>

      {showAdd && (
        <form onSubmit={onAdd} className="grid gap-4 rounded-2xl border border-line bg-base p-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="t-region" className="block text-[14px] font-medium text-ink">
              Wilayah
            </label>
            <select
              id="t-region"
              value={regionId}
              onChange={(e) => setRegionId(e.target.value ? Number(e.target.value) : "")}
              required
              className="mt-1.5 h-11 w-full rounded-xl border border-line bg-base px-3 text-[15px]"
            >
              <option value="">Pilih wilayah</option>
              {regions?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.kecamatan}, {r.kab_kota}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="t-nama" className="block text-[14px] font-medium text-ink">
              Nama titik kumpul
            </label>
            <input
              id="t-nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              placeholder="Mis. Lapangan kelurahan"
              className="mt-1.5 h-11 w-full rounded-xl border border-line px-3.5 text-[15px] outline-none focus:border-ink"
            />
          </div>
          <div>
            <label htmlFor="t-lat" className="block text-[14px] font-medium text-ink">
              Lintang (lat)
            </label>
            <input
              id="t-lat"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              inputMode="decimal"
              required
              placeholder="-3.7956"
              className="mt-1.5 h-11 w-full rounded-xl border border-line px-3.5 text-[15px] outline-none focus:border-ink"
            />
          </div>
          <div>
            <label htmlFor="t-lng" className="block text-[14px] font-medium text-ink">
              Bujur (lng)
            </label>
            <input
              id="t-lng"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              inputMode="decimal"
              required
              placeholder="102.2592"
              className="mt-1.5 h-11 w-full rounded-xl border border-line px-3.5 text-[15px] outline-none focus:border-ink"
            />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={createPoint.isPending}
              className="h-11 rounded-full bg-ink px-5 text-[14px] font-semibold text-white disabled:opacity-50"
            >
              Simpan
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="h-11 rounded-full px-4 text-[14px] text-ink-3 hover:text-ink">
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-line bg-base">
        <table className="w-full min-w-[560px] text-left text-[15px]">
          <thead className="border-b border-line text-[13px] text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Nama</th>
              <th className="px-5 py-3 font-medium">Wilayah</th>
              <th className="px-5 py-3 font-medium">Koordinat</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-ink-3">
                  Memuat…
                </td>
              </tr>
            )}
            {!isLoading && daftar.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-ink-3">
                  Belum ada titik kumpul. Tambahkan yang pertama.
                </td>
              </tr>
            )}
            {daftar.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-4 font-medium text-ink">{p.nama}</td>
                <td className="px-5 py-4 text-ink-3">
                  {p.region.kecamatan}, {p.region.kab_kota}
                </td>
                <td className="px-5 py-4 tabular-nums text-ink-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4 hover:text-ink"
                  >
                    {p.lat}, {p.lng}
                  </a>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Hapus titik kumpul ${p.nama}?`)) deletePoint.mutate(p.id);
                    }}
                    aria-label={`Hapus ${p.nama}`}
                    className="inline-flex size-10 items-center justify-center rounded-full text-muted hover:bg-tint hover:text-bahaya"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
