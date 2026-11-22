import { useState } from "react";
import {
  useAdminGuides,
  useCreateGuide,
  useDeleteGuide,
  useReindexGuides,
} from "@/hooks/useAdmin";

const DEFAULT_ROWS = [
  {
    id: 1,
    judul: "Banjir (Sebelum)",
    titleColor: "#1D4ED8",
    kategori: "Hidrometeorologi",
    diperbarui: "21 Nov 2026",
    status: "Terbit",
  },
  {
    id: 2,
    judul: "Gempa (Saat)",
    titleColor: "#B91C1C",
    kategori: "Geologi",
    diperbarui: "18 Nov 2026",
    status: "Terbit",
  },
  {
    id: 3,
    judul: "Cuaca ekstrem (Sebelum)",
    titleColor: "#0F766E",
    kategori: "Hidrometeorologi",
    diperbarui: "15 Nov 2026",
    status: "Draf",
  },
];

const KATEGORI_BARS = [
  { label: "Banjir", count: 8, pct: 80, color: "#1D4ED8" },
  { label: "Gempa", count: 6, pct: 60, color: "#B91C1C" },
  { label: "Longsor", count: 5, pct: 50, color: "#A16207" },
  { label: "Cuaca ekstrem", count: 5, pct: 50, color: "#0F766E" },
];

export function AdminPanduan() {
  const { data: guides } = useAdminGuides();
  const createGuide = useCreateGuide();
  const deleteGuide = useDeleteGuide();
  const reindex = useReindexGuides();

  const [showAdd, setShowAdd] = useState(false);
  const [sumber, setSumber] = useState("");
  const [isi, setIsi] = useState("");

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!sumber.trim() || !isi.trim()) return;
    await createGuide.mutateAsync({ sumber: sumber.trim(), isi: isi.trim() });
    setSumber("");
    setIsi("");
    setShowAdd(false);
  }

  function exportCsv() {
    const header = "ID,Judul Panduan,Isi\n";
    const rows = (guides ?? [])
      .map((g) => `${g.id},"${g.sumber}","${g.isi.replace(/"/g, '""')}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "panduan-bnpb.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      {/* Header: Kelola panduan + Ekspor CSV + Tambah panduan (persis siagakeluarga.fig Node 3840, 3914, 3916) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]">
          Kelola panduan
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
            + Tambah panduan
          </button>
        </div>
      </div>

      {/* Stats (persis Node 3841..3853) */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5">
          <p className="text-[12px] text-[#475569]">Panduan aktif</p>
          <p className="mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]">
            {guides?.length || 24}
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#0F766E]">
            +3 diperbarui bulan ini (Sumber BNPB)
          </p>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5">
          <p className="text-[12px] text-[#475569]">Keluarga terdaftar</p>
          <p className="mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]">
            1.204
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#0F766E]">
            +84 keluarga baru di Kab. Bandung
          </p>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5">
          <p className="text-[12px] text-[#475569]">Titik kumpul</p>
          <p className="mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]">
            37
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#0F766E]">
            100% terverifikasi petugas BPBD
          </p>
        </div>
      </div>

      {/* Tabel Panduan (persis Node 3854..3878) */}
      <div className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white">
        <table className="w-full text-left text-[15px]">
          <thead className="border-b border-[#E2E8F0] bg-[#F4F1EA] text-[12px] text-[#475569]">
            <tr>
              <th className="px-6 py-3.5 font-normal">Judul panduan</th>
              <th className="px-6 py-3.5 font-normal">Kategori</th>
              <th className="px-6 py-3.5 font-normal">Diperbarui</th>
              <th className="px-6 py-3.5 font-normal">Status</th>
              <th className="px-6 py-3.5 text-right font-normal">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {guides?.length
              ? guides.map((g, idx) => {
                  const color =
                    idx % 3 === 0
                      ? "#1D4ED8"
                      : idx % 3 === 1
                        ? "#B91C1C"
                        : "#0F766E";
                  return (
                    <tr key={g.id}>
                      <td
                        className="px-6 py-4 font-semibold"
                        style={{ color }}
                      >
                        {g.sumber}
                      </td>
                      <td className="px-6 py-4 text-[#475569]">
                        Hidrometeorologi
                      </td>
                      <td className="px-6 py-4 text-[#475569]">21 Nov 2026</td>
                      <td className="px-6 py-4 text-[#C2410C]">Terbit</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => deleteGuide.mutate(g.id)}
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
                      {r.judul}
                    </td>
                    <td className="px-6 py-4 text-[#475569]">{r.kategori}</td>
                    <td className="px-6 py-4 text-[#475569]">{r.diperbarui}</td>
                    <td
                      className={`px-6 py-4 ${
                        r.status === "Terbit"
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

      {/* Bottom Row: Aktivitas terbaru & Panduan per kategori (persis Node 3879..3913) */}
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6">
          <p className="text-[18px] font-semibold text-[#0F172A]">
            Aktivitas terbaru
          </p>
          <div className="mt-4 divide-y divide-[#E2E8F0] text-[14px]">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#0F172A]">
                Panduan Banjir Sebelum diterbitkan
              </span>
              <span className="text-[12px] text-[#475569]">2 jam lalu</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#0F172A]">
                Titik kumpul Balai Warga RW 08 perlu diperbarui
              </span>
              <span className="text-[12px] text-[#475569]">5 jam lalu</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#0F172A]">
                Zona Rawan Gempa ditambahkan ke pemantauan
              </span>
              <span className="text-[12px] text-[#475569]">Kemarin</span>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6">
          <p className="text-[18px] font-semibold text-[#0F172A]">
            Panduan per kategori
          </p>
          <div className="mt-4 space-y-3">
            {KATEGORI_BARS.map((b) => (
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

      {/* Ringkasan Verifikasi BNPB (persis Node 3918) */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-[#E2E8F0] bg-white px-6 py-4">
        <div className="max-w-xl">
          <p className="text-[15px] font-semibold text-[#0F172A]">
            Sinkronisasi Resmi Modul BNPB &amp; BPBD Kab. Bandung
          </p>
          <p className="mt-1 text-[13px] text-[#475569]">
            Seluruh 24 panduan telah diverifikasi untuk skenario Banjir, Gempa,
            Longsor, Cuaca Ekstrem, dan Tsunami.
          </p>
        </div>
        <button
          type="button"
          onClick={() => reindex.mutate()}
          disabled={reindex.isPending}
          className="text-[13px] font-semibold text-[#C2410C] hover:underline disabled:opacity-60"
        >
          {reindex.isPending ? "Menyinkronkan..." : "Sinkronkan Modul BNPB →"}
        </button>
      </div>

      {/* Modal Tambah Panduan (persis Node 3926) */}
      {showAdd && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090C]/55 p-4"
        >
          <div className="w-full max-w-[520px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-[#0F172A]">
                Tambah panduan baru
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
                  Judul panduan
                </label>
                <input
                  value={sumber}
                  onChange={(e) => setSumber(e.target.value)}
                  placeholder="Mis. Banjir (Sebelum)"
                  required
                  className="h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-medium text-[#475569]">
                  Isi panduan
                </label>
                <textarea
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  placeholder="Isi langkah panduan resmi BNPB..."
                  required
                  rows={4}
                  className="w-full rounded-[12px] border border-[#CBD5E1] p-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]"
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
                  Simpan panduan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
