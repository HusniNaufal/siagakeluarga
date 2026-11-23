import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  useAdminHazardZones,
  useCreateHazardZone,
  useDeleteHazardZone,
} from "@/hooks/useAdmin";
import { useRegions } from "@/hooks/useRisk";
import type { JenisBencana, TingkatRisiko } from "@/lib/types";

const JENIS: JenisBencana[] = ["BANJIR", "GEMPA", "LONGSOR", "CUACA_EKSTREM", "TSUNAMI"];
const TINGKAT: TingkatRisiko[] = ["RENDAH", "SEDANG", "TINGGI"];

const JENIS_LABEL: Record<string, string> = {
  BANJIR: "Banjir",
  GEMPA: "Gempa",
  LONGSOR: "Longsor",
  CUACA_EKSTREM: "Cuaca ekstrem",
  TSUNAMI: "Tsunami",
};
const TINGKAT_LABEL: Record<TingkatRisiko, string> = { RENDAH: "Rendah", SEDANG: "Sedang", TINGGI: "Tinggi" };

export function AdminZona() {
  const { data: zones, isLoading } = useAdminHazardZones();
  const { data: regions } = useRegions();
  const createZone = useCreateHazardZone();
  const deleteZone = useDeleteHazardZone();

  const [showAdd, setShowAdd] = useState(false);
  const [regionId, setRegionId] = useState<number | "">("");
  const [jenis, setJenis] = useState<JenisBencana>("BANJIR");
  const [tingkat, setTingkat] = useState<TingkatRisiko>("SEDANG");
  const [sumber, setSumber] = useState("BNPB");

  const daftar = zones ?? [];
  const tinggi = daftar.filter((z) => z.tingkat === "TINGGI").length;
  const wilayah = new Set(daftar.map((z) => z.region_id)).size;
  const perJenis = JENIS.map((j) => ({ j, n: daftar.filter((z) => z.jenis_bencana === j).length })).filter((x) => x.n > 0);

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
    const rows = daftar
      .map((z) => `${z.id},"${z.region.kecamatan}",${z.jenis_bencana},${z.tingkat},"${z.sumber}"`)
      .join("\n");
    const url = URL.createObjectURL(new Blob([header + rows], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "zona-bahaya.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1>Zona bahaya</h1>
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
            Tambah zona
          </button>
        </div>
      </div>

      <dl className="grid gap-3 sm:grid-cols-3">
        {[
          ["Zona tercatat", daftar.length],
          ["Risiko tinggi", tinggi],
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
            <label htmlFor="z-region" className="block text-[14px] font-medium text-ink">
              Wilayah
            </label>
            <select
              id="z-region"
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
          <div>
            <label htmlFor="z-jenis" className="block text-[14px] font-medium text-ink">
              Jenis bencana
            </label>
            <select
              id="z-jenis"
              value={jenis}
              onChange={(e) => setJenis(e.target.value as JenisBencana)}
              className="mt-1.5 h-11 w-full rounded-xl border border-line bg-base px-3 text-[15px]"
            >
              {JENIS.map((j) => (
                <option key={j} value={j}>
                  {JENIS_LABEL[j]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="z-tingkat" className="block text-[14px] font-medium text-ink">
              Tingkat risiko
            </label>
            <select
              id="z-tingkat"
              value={tingkat}
              onChange={(e) => setTingkat(e.target.value as TingkatRisiko)}
              className="mt-1.5 h-11 w-full rounded-xl border border-line bg-base px-3 text-[15px]"
            >
              {TINGKAT.map((t) => (
                <option key={t} value={t}>
                  {TINGKAT_LABEL[t]}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="z-sumber" className="block text-[14px] font-medium text-ink">
              Sumber data
            </label>
            <input
              id="z-sumber"
              value={sumber}
              onChange={(e) => setSumber(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-line px-3.5 text-[15px] outline-none focus:border-ink"
            />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={createZone.isPending}
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
              <th className="px-5 py-3 font-medium">Wilayah</th>
              <th className="px-5 py-3 font-medium">Jenis</th>
              <th className="px-5 py-3 font-medium">Tingkat</th>
              <th className="px-5 py-3 font-medium">Sumber</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-ink-3">
                  Memuat…
                </td>
              </tr>
            )}
            {!isLoading && daftar.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-ink-3">
                  Belum ada zona bahaya. Tambahkan yang pertama.
                </td>
              </tr>
            )}
            {daftar.map((z) => (
              <tr key={z.id}>
                <td className="px-5 py-4 font-medium text-ink">
                  {z.region.kecamatan}
                  <span className="block text-[13px] font-normal text-muted">{z.region.kab_kota}</span>
                </td>
                <td className="px-5 py-4 text-ink">{JENIS_LABEL[z.jenis_bencana] ?? z.jenis_bencana}</td>
                <td className="px-5 py-4 text-ink">{TINGKAT_LABEL[z.tingkat]}</td>
                <td className="px-5 py-4 text-ink-3">{z.sumber}</td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Hapus zona ${JENIS_LABEL[z.jenis_bencana] ?? z.jenis_bencana} di ${z.region.kecamatan}?`))
                        deleteZone.mutate(z.id);
                    }}
                    aria-label={`Hapus zona ${JENIS_LABEL[z.jenis_bencana] ?? z.jenis_bencana} di ${z.region.kecamatan}`}
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

      {perJenis.length > 0 && (
        <p className="text-[14px] text-ink-3">
          Per jenis: {perJenis.map((x) => `${JENIS_LABEL[x.j]} ${x.n}`).join(" · ")}
        </p>
      )}
    </div>
  );
}
