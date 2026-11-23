import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAdminGuides, useCreateGuide, useDeleteGuide, useReindexGuides, } from "@/hooks/useAdmin";
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
    async function onAdd(e) {
        e.preventDefault();
        if (!sumber.trim() || !isi.trim())
            return;
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
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [_jsx("h1", { className: "text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]", children: "Kelola panduan" }), _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("button", { type: "button", onClick: exportCsv, className: "h-[42px] rounded-[10px] border border-[#CBD5E1] bg-white px-[18px] text-[13px] font-semibold text-[#0B2545]", children: "Ekspor CSV" }), _jsx("button", { type: "button", onClick: () => setShowAdd(true), className: "h-[42px] rounded-[10px] bg-[#C2410C] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#9A3412]", children: "+ Tambah panduan" })] })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-3", children: [_jsxs("div", { className: "rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5", children: [_jsx("p", { className: "text-[12px] text-[#475569]", children: "Panduan aktif" }), _jsx("p", { className: "mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]", children: guides?.length || 24 }), _jsx("p", { className: "mt-1 text-[12px] font-medium text-[#0F766E]", children: "+3 diperbarui bulan ini (Sumber BNPB)" })] }), _jsxs("div", { className: "rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5", children: [_jsx("p", { className: "text-[12px] text-[#475569]", children: "Keluarga terdaftar" }), _jsx("p", { className: "mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]", children: "1.204" }), _jsx("p", { className: "mt-1 text-[12px] font-medium text-[#0F766E]", children: "+84 keluarga baru di Kab. Bandung" })] }), _jsxs("div", { className: "rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5", children: [_jsx("p", { className: "text-[12px] text-[#475569]", children: "Titik kumpul" }), _jsx("p", { className: "mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]", children: "37" }), _jsx("p", { className: "mt-1 text-[12px] font-medium text-[#0F766E]", children: "100% terverifikasi petugas BPBD" })] })] }), _jsx("div", { className: "overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white", children: _jsxs("table", { className: "w-full text-left text-[15px]", children: [_jsx("thead", { className: "border-b border-[#E2E8F0] bg-[#F4F1EA] text-[12px] text-[#475569]", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3.5 font-normal", children: "Judul panduan" }), _jsx("th", { className: "px-6 py-3.5 font-normal", children: "Kategori" }), _jsx("th", { className: "px-6 py-3.5 font-normal", children: "Diperbarui" }), _jsx("th", { className: "px-6 py-3.5 font-normal", children: "Status" }), _jsx("th", { className: "px-6 py-3.5 text-right font-normal", children: "Aksi" })] }) }), _jsx("tbody", { className: "divide-y divide-[#E2E8F0]", children: guides?.length
                                ? guides.map((g, idx) => {
                                    const color = idx % 3 === 0
                                        ? "#1D4ED8"
                                        : idx % 3 === 1
                                            ? "#B91C1C"
                                            : "#0F766E";
                                    return (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 font-semibold", style: { color }, children: g.sumber }), _jsx("td", { className: "px-6 py-4 text-[#475569]", children: "Hidrometeorologi" }), _jsx("td", { className: "px-6 py-4 text-[#475569]", children: "21 Nov 2026" }), _jsx("td", { className: "px-6 py-4 text-[#C2410C]", children: "Terbit" }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx("button", { type: "button", onClick: () => deleteGuide.mutate(g.id), className: "text-[13px] font-semibold text-[#0B2545] hover:underline", children: "Ubah" }) })] }, g.id));
                                })
                                : DEFAULT_ROWS.map((r) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 font-semibold", style: { color: r.titleColor }, children: r.judul }), _jsx("td", { className: "px-6 py-4 text-[#475569]", children: r.kategori }), _jsx("td", { className: "px-6 py-4 text-[#475569]", children: r.diperbarui }), _jsx("td", { className: `px-6 py-4 ${r.status === "Terbit"
                                                ? "text-[#C2410C]"
                                                : "text-[#D97706]"}`, children: r.status }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx("button", { type: "button", onClick: () => setShowAdd(true), className: "text-[13px] font-semibold text-[#0B2545] hover:underline", children: "Ubah" }) })] }, r.id))) })] }) }), _jsxs("div", { className: "grid gap-5 lg:grid-cols-[1fr_380px]", children: [_jsxs("div", { className: "rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsx("p", { className: "text-[18px] font-semibold text-[#0F172A]", children: "Aktivitas terbaru" }), _jsxs("div", { className: "mt-4 divide-y divide-[#E2E8F0] text-[14px]", children: [_jsxs("div", { className: "flex items-center justify-between py-2.5", children: [_jsx("span", { className: "text-[#0F172A]", children: "Panduan Banjir Sebelum diterbitkan" }), _jsx("span", { className: "text-[12px] text-[#475569]", children: "2 jam lalu" })] }), _jsxs("div", { className: "flex items-center justify-between py-2.5", children: [_jsx("span", { className: "text-[#0F172A]", children: "Titik kumpul Balai Warga RW 08 perlu diperbarui" }), _jsx("span", { className: "text-[12px] text-[#475569]", children: "5 jam lalu" })] }), _jsxs("div", { className: "flex items-center justify-between py-2.5", children: [_jsx("span", { className: "text-[#0F172A]", children: "Zona Rawan Gempa ditambahkan ke pemantauan" }), _jsx("span", { className: "text-[12px] text-[#475569]", children: "Kemarin" })] })] })] }), _jsxs("div", { className: "rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsx("p", { className: "text-[18px] font-semibold text-[#0F172A]", children: "Panduan per kategori" }), _jsx("div", { className: "mt-4 space-y-3", children: KATEGORI_BARS.map((b) => (_jsxs("div", { className: "flex items-center justify-between gap-3 text-[13px]", children: [_jsx("span", { className: "w-28 shrink-0 text-[#475569]", children: b.label }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-2 w-[140px] overflow-hidden rounded-[4px] bg-[#E2E8F0]", children: _jsx("div", { className: "h-full rounded-[4px]", style: {
                                                            width: `${b.pct}%`,
                                                            backgroundColor: b.color,
                                                        } }) }), _jsx("span", { className: "w-4 text-right text-[12px] text-[#0F172A]", children: b.count })] })] }, b.label))) })] })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-[#E2E8F0] bg-white px-6 py-4", children: [_jsxs("div", { className: "max-w-xl", children: [_jsx("p", { className: "text-[15px] font-semibold text-[#0F172A]", children: "Sinkronisasi Resmi Modul BNPB & BPBD Kab. Bandung" }), _jsx("p", { className: "mt-1 text-[13px] text-[#475569]", children: "Seluruh 24 panduan telah diverifikasi untuk skenario Banjir, Gempa, Longsor, Cuaca Ekstrem, dan Tsunami." })] }), _jsx("button", { type: "button", onClick: () => reindex.mutate(), disabled: reindex.isPending, className: "text-[13px] font-semibold text-[#C2410C] hover:underline disabled:opacity-60", children: reindex.isPending ? "Menyinkronkan..." : "Sinkronkan Modul BNPB →" })] }), showAdd && (_jsx("div", { role: "dialog", "aria-modal": "true", className: "fixed inset-0 z-50 flex items-center justify-center bg-[#07090C]/55 p-4", children: _jsxs("div", { className: "w-full max-w-[520px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-[22px] font-bold text-[#0F172A]", children: "Tambah panduan baru" }), _jsx("button", { type: "button", onClick: () => setShowAdd(false), className: "flex size-8 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-lg font-bold text-[#475569]", children: "\u00D7" })] }), _jsxs("form", { onSubmit: onAdd, className: "mt-5 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Judul panduan" }), _jsx("input", { value: sumber, onChange: (e) => setSumber(e.target.value), placeholder: "Mis. Banjir (Sebelum)", required: true, className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Isi panduan" }), _jsx("textarea", { value: isi, onChange: (e) => setIsi(e.target.value), placeholder: "Isi langkah panduan resmi BNPB...", required: true, rows: 4, className: "w-full rounded-[12px] border border-[#CBD5E1] p-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]" })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: () => setShowAdd(false), className: "h-11 rounded-[10px] border border-[#CBD5E1] bg-white px-5 text-[14px] font-semibold text-[#0B2545]", children: "Batal" }), _jsx("button", { type: "submit", className: "h-11 rounded-[10px] bg-[#C2410C] px-6 text-[14px] font-semibold text-white", children: "Simpan panduan" })] })] })] }) }))] }));
}
