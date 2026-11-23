import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAdminGuides, useCreateGuide, useDeleteGuide, useReindexGuides } from "@/hooks/useAdmin";

export function AdminPanduan() {
  const { data: guides, isLoading } = useAdminGuides();
  const createGuide = useCreateGuide();
  const deleteGuide = useDeleteGuide();
  const reindex = useReindexGuides();

  const [showAdd, setShowAdd] = useState(false);
  const [sumber, setSumber] = useState("");
  const [isi, setIsi] = useState("");

  const daftar = guides ?? [];

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!sumber.trim() || !isi.trim()) return;
    await createGuide.mutateAsync({ sumber: sumber.trim(), isi: isi.trim() });
    setSumber("");
    setIsi("");
    setShowAdd(false);
  }

  function exportCsv() {
    const header = "ID,Sumber,Isi\n";
    const rows = daftar.map((g) => `${g.id},"${g.sumber.replace(/"/g, '""')}","${g.isi.replace(/"/g, '""')}"`).join("\n");
    const url = URL.createObjectURL(new Blob([header + rows], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "panduan.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1>Panduan</h1>
        <div className="flex flex-wrap items-center gap-2.5">
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
            Tambah panduan
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-base p-5">
        <p className="text-[14px] text-muted">Panduan tercatat</p>
        <p className="font-display mt-1 text-[34px] leading-none font-semibold tracking-[-0.03em] text-ink">{daftar.length}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => reindex.mutate()}
            disabled={reindex.isPending || daftar.length === 0}
            className="h-10 rounded-full border border-line px-4 text-[14px] font-semibold text-ink hover:bg-tint disabled:opacity-50"
          >
            {reindex.isPending ? "Membuat indeks…" : "Bangun ulang indeks asisten AI"}
          </button>
          <p role="status" aria-live="polite" className="text-[14px] text-ink-3">
            {reindex.isSuccess &&
              `${reindex.data.indexed} dari ${reindex.data.total} panduan terindeks${
                reindex.data.failed.length ? `, ${reindex.data.failed.length} gagal` : ""
              }.`}
            {reindex.isError && (reindex.error instanceof Error ? reindex.error.message : "Indeks belum bisa dibuat.")}
          </p>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={onAdd} className="space-y-4 rounded-2xl border border-line bg-base p-5">
          <div>
            <label htmlFor="g-sumber" className="block text-[14px] font-medium text-ink">
              Sumber
            </label>
            <input
              id="g-sumber"
              value={sumber}
              onChange={(e) => setSumber(e.target.value)}
              required
              placeholder="Mis. Panduan BNPB, Evakuasi Banjir"
              className="mt-1.5 h-11 w-full rounded-xl border border-line px-3.5 text-[15px] outline-none focus:border-ink"
            />
          </div>
          <div>
            <label htmlFor="g-isi" className="block text-[14px] font-medium text-ink">
              Isi panduan
            </label>
            <textarea
              id="g-isi"
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              required
              rows={5}
              className="mt-1.5 w-full rounded-xl border border-line p-3.5 text-[15px] leading-[1.55] outline-none focus:border-ink"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={createGuide.isPending} className="h-11 rounded-full bg-ink px-5 text-[14px] font-semibold text-white disabled:opacity-50">
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
              <th className="px-5 py-3 font-medium">Sumber</th>
              <th className="px-5 py-3 font-medium">Isi</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {isLoading && (
              <tr>
                <td colSpan={3} className="px-5 py-6 text-ink-3">
                  Memuat…
                </td>
              </tr>
            )}
            {!isLoading && daftar.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-6 text-ink-3">
                  Belum ada panduan. Tambahkan yang pertama.
                </td>
              </tr>
            )}
            {daftar.map((g) => (
              <tr key={g.id}>
                <td className="px-5 py-4 font-medium text-ink">{g.sumber}</td>
                <td className="max-w-[420px] px-5 py-4 text-ink-3">
                  <span className="line-clamp-2">{g.isi}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Hapus panduan "${g.sumber}"?`)) deleteGuide.mutate(g.id);
                    }}
                    aria-label={`Hapus ${g.sumber}`}
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
