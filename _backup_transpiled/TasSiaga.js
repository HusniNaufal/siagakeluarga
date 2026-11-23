import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { useAddKitItem, useDeleteKitItem, useKit, useUpdateKitItem, } from "@/hooks/useKit";
const GROUP_COLORS = {
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
function assignGroup(item, index) {
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
        return _jsx("div", { className: "h-40 animate-pulse rounded-2xl bg-muted" });
    }
    async function onAdd(e) {
        e.preventDefault();
        if (!nama.trim())
            return;
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
    const groupedBackend = new Map();
    data.items.forEach((item, idx) => {
        const g = assignGroup(item, idx);
        groupedBackend.set(g, [...(groupedBackend.get(g) ?? []), item]);
    });
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]", children: "Tas siaga" }), _jsxs("p", { className: "mt-1 text-[16px] text-[#475569]", children: [siapCount, " dari ", totalCount, " barang sudah siap"] })] }), _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("button", { type: "button", onClick: () => window.print(), className: "h-[40px] rounded-[8px] border border-[#CBD5E1] bg-white px-4 text-[13px] font-semibold text-[#0B2545]", children: "Cetak daftar" }), _jsx("button", { type: "button", onClick: () => setShowAdd(true), className: "h-[40px] rounded-[8px] bg-[#C2410C] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#9A3412]", children: "+ Tambah barang" })] })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#E2E8F0] bg-white px-6 py-[18px]", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [_jsxs("p", { className: "text-[15px] font-semibold text-[#0F172A]", children: ["Kelengkapan ", pct, "% (", siapCount, "/", totalCount, " barang)"] }), _jsx("div", { className: "h-[10px] w-[220px] overflow-hidden rounded-[5px] bg-[#E2E8F0]", children: _jsx("div", { className: "h-full rounded-[5px] bg-[#C2410C]", style: { width: `${pct}%` } }) })] }), _jsxs("p", { className: "text-[13px] text-[#475569]", children: [belumCount, " barang belum dicek \u00A0|\u00A0 2 obat kedaluwarsa 12/2026"] })] }), hasBackendItems ? (_jsx("div", { className: "space-y-4", children: Array.from(groupedBackend.entries()).map(([groupTitle, list]) => (_jsxs("div", { className: "rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsx("p", { className: "mb-3 text-[13px] font-normal", style: { color: GROUP_COLORS[groupTitle] ?? "#1D4ED8" }, children: groupTitle }), _jsx("div", { className: "divide-y divide-[#E2E8F0]", children: list.map((item) => (_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 py-4", children: [_jsxs("label", { className: "flex cursor-pointer items-center gap-3.5", children: [_jsx("input", { type: "checkbox", checked: item.status, onChange: (e) => updateItem.mutate({
                                                    id: item.id,
                                                    status: e.target.checked,
                                                }), className: "sr-only" }), _jsx("span", { className: `flex size-[22px] shrink-0 items-center justify-center rounded-[6px] ${item.status
                                                    ? "bg-[#C2410C] text-white"
                                                    : "border-[1.5px] border-[#E2E8F0] bg-white"}`, children: item.status && _jsx(Check, { className: "size-3.5 stroke-[3]" }) }), _jsx("span", { className: "text-[16px] text-[#0F172A]", children: item.nama_item })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "rounded-[6px] bg-[#F4F1EA] px-2.5 py-1 text-[12px] text-[#475569]", children: "untuk semua" }), item.kadaluarsa && (_jsxs("span", { className: "text-[12px] text-[#DC2626]", children: ["kadaluwarsa", " ", new Date(item.kadaluarsa).toLocaleDateString("id-ID", {
                                                        month: "2-digit",
                                                        year: "numeric",
                                                    })] })), _jsx("button", { type: "button", onClick: () => deleteItem.mutate(item.id), className: "text-[#475569] hover:text-[#DC2626]", children: _jsx(Trash2, { className: "size-4" }) })] })] }, item.id))) })] }, groupTitle))) })) : (_jsx("div", { className: "space-y-4", children: DEFAULT_GROUPS.map((g) => (_jsxs("div", { className: "rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsx("p", { className: "mb-3 text-[13px] font-normal", style: { color: g.color }, children: g.title }), _jsx("div", { className: "divide-y divide-[#E2E8F0]", children: g.items.map((item) => (_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 py-4", children: [_jsxs("div", { className: "flex items-center gap-3.5", children: [_jsx("span", { className: `flex size-[22px] shrink-0 items-center justify-center rounded-[6px] ${item.status
                                                    ? "bg-[#C2410C] text-white"
                                                    : "border-[1.5px] border-[#E2E8F0] bg-white"}`, children: item.status && _jsx(Check, { className: "size-3.5 stroke-[3]" }) }), _jsx("span", { className: "text-[16px] text-[#0F172A]", children: item.nama_item })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "rounded-[6px] bg-[#F4F1EA] px-2.5 py-1 text-[12px] text-[#475569]", children: item.tag }), item.kadaluarsa && (_jsxs("span", { className: "text-[12px] text-[#DC2626]", children: ["kadaluwarsa ", item.kadaluarsa] }))] })] }, item.id))) })] }, g.title))) })), showAdd && (_jsx("div", { role: "dialog", "aria-modal": "true", className: "fixed inset-0 z-50 flex items-center justify-center bg-[#07090C]/55 p-4", children: _jsxs("div", { className: "w-full max-w-[480px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-[22px] font-bold text-[#0F172A]", children: "Tambah barang tas siaga" }), _jsx("button", { type: "button", onClick: () => setShowAdd(false), className: "flex size-8 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-lg font-bold text-[#475569]", children: "\u00D7" })] }), _jsxs("form", { onSubmit: onAdd, className: "mt-5 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Nama barang" }), _jsx("input", { value: nama, onChange: (e) => setNama(e.target.value), placeholder: "Mis. Senter dan baterai cadangan", required: true, className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Tanggal kedaluwarsa (opsional)" }), _jsx("input", { type: "date", value: kadaluarsa, onChange: (e) => setKadaluarsa(e.target.value), className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]" })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: () => setShowAdd(false), className: "h-11 rounded-[10px] border border-[#CBD5E1] bg-white px-5 text-[14px] font-semibold text-[#0B2545]", children: "Batal" }), _jsx("button", { type: "submit", className: "h-11 rounded-[10px] bg-[#C2410C] px-6 text-[14px] font-semibold text-white", children: "Simpan barang" })] })] })] }) }))] }));
}
