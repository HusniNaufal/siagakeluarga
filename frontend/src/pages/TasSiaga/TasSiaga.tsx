import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { useAddKitItem, useDeleteKitItem, useKit, useUpdateKitItem } from "@/hooks/useKit";
import { AppHero } from "@/components/app/AppHero";
import { EmptyIllustration } from "@/components/ui/EmptyIllustration";
import { cn } from "@/lib/utils";

/** Saran awal yang umum untuk semua keluarga. Tidak menyebut nama atau kondisi siapa pun. */
const SARAN_BARANG = [
  "Dokumen penting dalam plastik kedap air",
  "Obat rutin untuk 7 hari",
  "Air minum dan makanan siap saji untuk 3 hari",
  "Senter dan baterai cadangan",
  "Peluit",
  "Kotak P3K",
  "Pakaian ganti yang kering",
  "Powerbank dan radio kecil",
  "Masker",
];

const HARI = 24 * 60 * 60 * 1000;

export function TasSiaga() {
  const { data, isLoading } = useKit();
  const addItem = useAddKitItem();
  const updateItem = useUpdateKitItem();
  const deleteItem = useDeleteKitItem();

  const [showAdd, setShowAdd] = useState(false);
  const [nama, setNama] = useState("");
  const [kadaluarsa, setKadaluarsa] = useState("");

  if (isLoading || !data) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted" />;
  }

  const items = [...data.items].sort((a, b) => Number(a.status) - Number(b.status));
  const total = data.kesiapan.total;
  const siap = data.kesiapan.siap;
  const pct = data.kesiapan.persentase;
  const adaItem = items.length > 0;

  const sudahAda = new Set(items.map((i) => i.nama_item.toLowerCase()));
  const saranBelumAda = SARAN_BARANG.filter((s) => !sudahAda.has(s.toLowerCase()));
  const hampirKadaluarsa = items.filter(
    (i) => i.kadaluarsa && new Date(i.kadaluarsa).getTime() - Date.now() < 60 * HARI,
  ).length;

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim()) return;
    await addItem.mutateAsync({ nama_item: nama.trim(), kadaluarsa: kadaluarsa || null });
    setNama("");
    setKadaluarsa("");
    setShowAdd(false);
  }

  return (
    <div className="space-y-8">
      <AppHero
        variasi="cincin"
        className="print:hidden"
        aksi={
          <>
            {adaItem && (
              <button
                type="button"
                onClick={() => window.print()}
                className="h-11 rounded-full border border-line bg-base px-5 text-[14px] font-semibold text-ink hover:bg-tint"
              >
                Cetak daftar
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowAdd((v) => !v)}
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-accent-dark px-5 text-[14px] font-semibold text-white hover:bg-accent-hover"
            >
              <Plus className="size-4" aria-hidden="true" />
              Tambah barang
            </button>
          </>
        }
      >
        <h1>Tas siaga</h1>
        <p className="mt-1 max-w-[56ch] text-[16px] text-ink-3">
          {adaItem ? `${siap} dari ${total} barang sudah siap` : "Belum ada barang di daftar"}
        </p>
      </AppHero>

      {showAdd && (
        <form onSubmit={onAdd} className="grid gap-3 rounded-2xl border border-line bg-base p-5 sm:grid-cols-[1fr_180px_auto] print:hidden">
          <div>
            <label htmlFor="kit-nama" className="block text-[14px] font-medium text-ink">
              Nama barang
            </label>
            <input
              id="kit-nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              autoFocus
              className="mt-1.5 h-11 w-full rounded-xl border border-line px-3.5 text-[15px] outline-none focus:border-ink"
            />
          </div>
          <div>
            <label htmlFor="kit-kadaluarsa" className="block text-[14px] font-medium text-ink">
              Kedaluwarsa <span className="font-normal text-muted">(opsional)</span>
            </label>
            <input
              id="kit-kadaluarsa"
              type="date"
              value={kadaluarsa}
              onChange={(e) => setKadaluarsa(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-line px-3.5 text-[15px] outline-none focus:border-ink"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={addItem.isPending}
              className="h-11 rounded-full bg-ink px-5 text-[14px] font-semibold text-white disabled:opacity-50"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="h-11 rounded-full px-3 text-[14px] text-ink-3 hover:text-ink"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {adaItem && (
        <div className="rounded-2xl bg-ink p-6 text-white">
          <p className="font-display text-[40px] leading-none font-semibold tracking-[-0.03em]">{pct}%</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] text-white/75">Kelengkapan tas siaga</p>
            {hampirKadaluarsa > 0 && (
              <p className="text-[14px] text-white">{hampirKadaluarsa} barang kedaluwarsa dalam 60 hari</p>
            )}
          </div>
          <div
            role="progressbar"
            aria-label="Kelengkapan tas siaga"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/15"
          >
            <div className="h-full rounded-full bg-white transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {!adaItem && (
        <div className="rounded-2xl border border-line bg-base p-6 text-center print:hidden md:p-9">
          <EmptyIllustration />
          <p className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Tasmu masih kosong</p>
          <p className="mx-auto mt-2 max-w-[52ch] text-[16px] leading-[1.6] text-ink-3">
            Tambahkan barang sendiri atau mulai dari daftar saran di bawah.
          </p>
        </div>
      )}

      {adaItem && (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-base">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <label className="flex min-h-11 cursor-pointer items-center gap-3.5">
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={(e) => updateItem.mutate({ id: item.id, status: e.target.checked })}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-dark",
                    item.status ? "border-accent-dark bg-accent-dark text-white" : "border-line bg-base",
                  )}
                >
                  {item.status && <Check className="size-4" strokeWidth={3} />}
                </span>
                <span className={cn("text-[16px]", item.status ? "text-muted line-through" : "text-ink")}>
                  {item.nama_item}
                </span>
              </label>
              <div className="flex items-center gap-4 print:hidden">
                {item.kadaluarsa && (
                  <span className="text-[13px] text-ink-3">
                    Kedaluwarsa{" "}
                    {new Date(item.kadaluarsa).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => deleteItem.mutate(item.id)}
                  aria-label={`Hapus ${item.nama_item}`}
                  className="flex size-10 items-center justify-center rounded-full text-muted hover:bg-tint hover:text-bahaya"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {saranBelumAda.length > 0 && (
        <section className="print:hidden">
          <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
            {adaItem ? "Saran barang lain" : "Mulai dari daftar umum"}
          </h2>
          <p className="mt-1 text-[15px] text-ink-3">
            Tekan untuk menambahkan. Sesuaikan dengan keluargamu, misalnya obat khusus atau perlengkapan bayi.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {saranBelumAda.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  disabled={addItem.isPending}
                  onClick={() => addItem.mutate({ nama_item: s, kadaluarsa: null })}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-base px-4 text-[15px] text-ink hover:border-ink/40 hover:bg-tint disabled:opacity-50"
                >
                  <Plus className="size-4 text-muted" aria-hidden="true" />
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
