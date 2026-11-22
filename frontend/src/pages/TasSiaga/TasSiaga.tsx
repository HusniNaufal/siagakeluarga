import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import {
  useAddKitItem,
  useDeleteKitItem,
  useKit,
  useUpdateKitItem,
} from "@/hooks/useKit";
import type { KitItem } from "@/lib/types";

const GROUP_COLORS: Record<string, string> = {
  "Khusus banjir": "#1D4ED8",
  "Khusus longsor": "#A16207",
  "Khusus gempa": "#B91C1C",
  "Khusus cuaca ekstrem": "#0F766E",
};

const DEFAULT_GROUPS = [
  {
    title: "Khusus banjir",
    color: "#1D4ED8",
    items: [
      {
        id: "d-1",
        nama_item: "Dokumen penting (KTP, KK) dalam plastik kedap air",
        status: true,
        tag: "untuk semua",
        kadaluarsa: null,
      },
      {
        id: "d-2",
        nama_item: "Obat darah tinggi Nenek Aminah (7 hari)",
        status: true,
        tag: "untuk Nenek Aminah",
        kadaluarsa: "12/2026",
      },
      {
        id: "d-3",
        nama_item: "Pakaian kering ganti dan pelampung anak",
        status: false,
        tag: "untuk Raka",
        kadaluarsa: null,
      },
    ],
  },
  {
    title: "Khusus longsor",
    color: "#A16207",
    items: [
      {
        id: "d-4",
        nama_item: "Peluit darurat dan senter kepala",
        status: true,
        tag: "untuk semua",
        kadaluarsa: null,
      },
      {
        id: "d-5",
        nama_item: "Sepatu bot karet dan sarung tangan kerja",
        status: true,
        tag: "untuk Budi",
        kadaluarsa: null,
      },
      {
        id: "d-6",
        nama_item: "Masker debu N95 (1 kotak)",
        status: false,
        tag: "untuk semua",
        kadaluarsa: null,
      },
    ],
  },
  {
    title: "Khusus gempa",
    color: "#B91C1C",
    items: [
      {
        id: "d-7",
        nama_item: "Kotak P3K lengkap dan perban gulung",
        status: true,
        tag: "untuk semua",
        kadaluarsa: null,
      },
      {
        id: "d-8",
        nama_item: "Air minum kemasan (3 L/orang) dan biskuit energi",
        status: true,
        tag: "untuk semua",
        kadaluarsa: "12/2026",
      },
      {
        id: "d-9",
        nama_item: "Powerbank 20.000 mAh dan radio baterai",
        status: false,
        tag: "untuk semua",
        kadaluarsa: null,
      },
    ],
  },
  {
    title: "Khusus cuaca ekstrem",
    color: "#0F766E",
    items: [
      {
        id: "d-10",
        nama_item: "Jas hujan keluarga dan payung lipat",
        status: true,
        tag: "untuk semua",
        kadaluarsa: null,
      },
      {
        id: "d-11",
        nama_item: "Lampu darurat LED isi ulang",
        status: true,
        tag: "untuk semua",
        kadaluarsa: null,
      },
      {
        id: "d-12",
        nama_item: "Selimut hangat darurat",
        status: false,
        tag: "untuk Nenek Aminah",
        kadaluarsa: null,
      },
    ],
  },
];

function assignGroup(item: KitItem, index: number): string {
  const n = item.nama_item.toLowerCase();
  if (n.includes("dokumen") || n.includes("obat") || n.includes("pakaian"))
    return "Khusus banjir";
  if (n.includes("peluit") || n.includes("sepatu") || n.includes("masker"))
    return "Khusus longsor";
  if (n.includes("p3k") || n.includes("air") || n.includes("powerbank"))
    return "Khusus gempa";
  const titles = [
    "Khusus banjir",
    "Khusus longsor",
    "Khusus gempa",
    "Khusus cuaca ekstrem",
  ];
  return titles[index % titles.length];
}

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

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim()) return;
    await addItem.mutateAsync({
      nama_item: nama.trim(),
      kadaluarsa: kadaluarsa || null,
    });
    setNama("");
    setKadaluarsa("");
    setShowAdd(false);
  }

  const hasBackendItems = data.items.length > 0;
  const siapCount = hasBackendItems ? data.kesiapan.siap : 8;
  const totalCount = hasBackendItems ? data.kesiapan.total : 12;
  const pct = hasBackendItems ? data.kesiapan.persentase : 67;
  const belumCount = Math.max(0, totalCount - siapCount);

  const groupedBackend = new Map<string, KitItem[]>();
  data.items.forEach((item, idx) => {
    const g = assignGroup(item, idx);
    groupedBackend.set(g, [...(groupedBackend.get(g) ?? []), item]);
  });

  return (
    <div className="space-y-4">
      {/* Head: Tas siaga + Cetak daftar + Tambah barang (persis siagakeluarga.fig Node 3021..3029) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]">
            Tas siaga
          </h1>
          <p className="mt-1 text-[16px] text-[#475569]">
            {siapCount} dari {totalCount} barang sudah siap
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-[40px] rounded-[8px] border border-[#CBD5E1] bg-white px-4 text-[13px] font-semibold text-[#0B2545]"
          >
            Cetak daftar
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="h-[40px] rounded-[8px] bg-[#C2410C] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#9A3412]"
          >
            + Tambah barang
          </button>
        </div>
      </div>

      {/* Ringkasan Progres Tas Siaga (persis Node 3030..3035) */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#E2E8F0] bg-white px-6 py-[18px]">
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-[15px] font-semibold text-[#0F172A]">
            Kelengkapan {pct}% ({siapCount}/{totalCount} barang)
          </p>
          <div className="h-[10px] w-[220px] overflow-hidden rounded-[5px] bg-[#E2E8F0]">
            <div
              className="h-full rounded-[5px] bg-[#C2410C]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <p className="text-[13px] text-[#475569]">
          {belumCount} barang belum dicek &nbsp;|&nbsp; 2 obat kedaluwarsa
          12/2026
        </p>
      </div>

      {/* Grup Barang (persis Node 3036, 3060, 3083, 3107) */}
      {hasBackendItems ? (
        <div className="space-y-4">
          {Array.from(groupedBackend.entries()).map(([groupTitle, list]) => (
            <div
              key={groupTitle}
              className="rounded-[20px] border border-[#E2E8F0] bg-white p-6"
            >
              <p
                className="mb-3 text-[13px] font-normal"
                style={{ color: GROUP_COLORS[groupTitle] ?? "#1D4ED8" }}
              >
                {groupTitle}
              </p>
              <div className="divide-y divide-[#E2E8F0]">
                {list.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-4"
                  >
                    <label className="flex cursor-pointer items-center gap-3.5">
                      <input
                        type="checkbox"
                        checked={item.status}
                        onChange={(e) =>
                          updateItem.mutate({
                            id: item.id,
                            status: e.target.checked,
                          })
                        }
                        className="sr-only"
                      />
                      <span
                        className={`flex size-[22px] shrink-0 items-center justify-center rounded-[6px] ${
                          item.status
                            ? "bg-[#C2410C] text-white"
                            : "border-[1.5px] border-[#E2E8F0] bg-white"
                        }`}
                      >
                        {item.status && <Check className="size-3.5 stroke-[3]" />}
                      </span>
                      <span className="text-[16px] text-[#0F172A]">
                        {item.nama_item}
                      </span>
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="rounded-[6px] bg-[#F4F1EA] px-2.5 py-1 text-[12px] text-[#475569]">
                        untuk semua
                      </span>
                      {item.kadaluarsa && (
                        <span className="text-[12px] text-[#DC2626]">
                          kadaluwarsa{" "}
                          {new Date(item.kadaluarsa).toLocaleDateString(
                            "id-ID",
                            {
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteItem.mutate(item.id)}
                        className="text-[#475569] hover:text-[#DC2626]"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {DEFAULT_GROUPS.map((g) => (
            <div
              key={g.title}
              className="rounded-[20px] border border-[#E2E8F0] bg-white p-6"
            >
              <p
                className="mb-3 text-[13px] font-normal"
                style={{ color: g.color }}
              >
                {g.title}
              </p>
              <div className="divide-y divide-[#E2E8F0]">
                {g.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex size-[22px] shrink-0 items-center justify-center rounded-[6px] ${
                          item.status
                            ? "bg-[#C2410C] text-white"
                            : "border-[1.5px] border-[#E2E8F0] bg-white"
                        }`}
                      >
                        {item.status && <Check className="size-3.5 stroke-[3]" />}
                      </span>
                      <span className="text-[16px] text-[#0F172A]">
                        {item.nama_item}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-[6px] bg-[#F4F1EA] px-2.5 py-1 text-[12px] text-[#475569]">
                        {item.tag}
                      </span>
                      {item.kadaluarsa && (
                        <span className="text-[12px] text-[#DC2626]">
                          kadaluwarsa {item.kadaluarsa}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah Barang Tas Siaga (persis Node 3274) */}
      {showAdd && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090C]/55 p-4"
        >
          <div className="w-full max-w-[480px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-[#0F172A]">
                Tambah barang tas siaga
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
                  Nama barang
                </label>
                <input
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Mis. Senter dan baterai cadangan"
                  required
                  className="h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-medium text-[#475569]">
                  Tanggal kedaluwarsa (opsional)
                </label>
                <input
                  type="date"
                  value={kadaluarsa}
                  onChange={(e) => setKadaluarsa(e.target.value)}
                  className="h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]"
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
                  Simpan barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
