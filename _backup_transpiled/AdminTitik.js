import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAdminAssemblyPoints, useCreateAssemblyPoint, useDeleteAssemblyPoint, } from "@/hooks/useAdmin";
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
    const [regionId, setRegionId] = useState("");
    const [nama, setNama] = useState("");
    const [lat, setLat] = useState("-6.9882");
    const [lng, setLng] = useState("107.6284");
    async function onAdd(e) {
        e.preventDefault();
        if (!regionId || !nama.trim() || !lat || !lng)
            return;
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
            .map((p) => `${p.id},"${p.nama}","${p.region.kecamatan}",${p.lat},${p.lng}`)
            .join("\n");
        const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "titik-kumpul-bpbd.csv";
        a.click();
        URL.revokeObjectURL(url);
    }
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [_jsx("h1", { className: "text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]", children: "Kelola titik kumpul" }), _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("button", { type: "button", onClick: exportCsv, className: "h-[42px] rounded-[10px] border border-[#CBD5E1] bg-white px-[18px] text-[13px] font-semibold text-[#0B2545]", children: "Ekspor CSV" }), _jsx("button", { type: "button", onClick: () => setShowAdd(true), className: "h-[42px] rounded-[10px] bg-[#C2410C] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#9A3412]", children: "+ Tambah titik kumpul" })] })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-3", children: [_jsxs("div", { className: "rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5", children: [_jsx("p", { className: "text-[12px] text-[#475569]", children: "Titik aktif" }), _jsx("p", { className: "mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]", children: points?.length || 37 }), _jsx("p", { className: "mt-1 text-[12px] font-medium text-[#0F766E]", children: "35 siap digunakan, 2 perlu pembaruan" })] }), _jsxs("div", { className: "rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5", children: [_jsx("p", { className: "text-[12px] text-[#475569]", children: "Kapasitas total" }), _jsx("p", { className: "mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]", children: "5.200 orang" }), _jsx("p", { className: "mt-1 text-[12px] font-medium text-[#0F766E]", children: "Rata-rata 140 orang/titik, ramah lansia" })] }), _jsxs("div", { className: "rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5", children: [_jsx("p", { className: "text-[12px] text-[#475569]", children: "Kecamatan terjangkau" }), _jsx("p", { className: "mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]", children: "4" }), _jsx("p", { className: "mt-1 text-[12px] font-medium text-[#0F766E]", children: "Dayeuhkolot, Baleendah, Bojongsoang, Citeureup" })] })] }), _jsx("div", { className: "overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white", children: _jsxs("table", { className: "w-full text-left text-[15px]", children: [_jsx("thead", { className: "border-b border-[#E2E8F0] bg-[#F4F1EA] text-[12px] text-[#475569]", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3.5 font-normal", children: "Nama titik kumpul" }), _jsx("th", { className: "px-6 py-3.5 font-normal", children: "Kapasitas" }), _jsx("th", { className: "px-6 py-3.5 font-normal", children: "Akses Lansia" }), _jsx("th", { className: "px-6 py-3.5 font-normal", children: "Status" }), _jsx("th", { className: "px-6 py-3.5 text-right font-normal", children: "Aksi" })] }) }), _jsx("tbody", { className: "divide-y divide-[#E2E8F0]", children: points?.length
                                ? points.map((p) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 font-semibold text-[#0F172A]", children: p.nama }), _jsx("td", { className: "px-6 py-4 text-[#475569]", children: "450 orang" }), _jsx("td", { className: "px-6 py-4 text-[#475569]", children: "Ramah kursi roda" }), _jsx("td", { className: "px-6 py-4 text-[#C2410C]", children: "Aktif" }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx("button", { type: "button", onClick: () => deletePoint.mutate(p.id), className: "text-[13px] font-semibold text-[#0B2545] hover:underline", children: "Ubah" }) })] }, p.id)))
                                : DEFAULT_ROWS.map((r) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 font-semibold text-[#0F172A]", children: r.nama }), _jsx("td", { className: "px-6 py-4 text-[#475569]", children: r.kapasitas }), _jsx("td", { className: "px-6 py-4 text-[#475569]", children: r.akses }), _jsx("td", { className: `px-6 py-4 ${r.status === "Aktif"
                                                ? "text-[#C2410C]"
                                                : "text-[#D97706]"}`, children: r.status }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx("button", { type: "button", onClick: () => setShowAdd(true), className: "text-[13px] font-semibold text-[#0B2545] hover:underline", children: "Ubah" }) })] }, r.id))) })] }) }), _jsxs("div", { className: "grid gap-5 lg:grid-cols-[1fr_380px]", children: [_jsxs("div", { className: "rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsx("p", { className: "text-[18px] font-semibold text-[#0F172A]", children: "Aktivitas terbaru" }), _jsxs("div", { className: "mt-4 divide-y divide-[#E2E8F0] text-[14px]", children: [_jsxs("div", { className: "flex items-center justify-between py-2.5", children: [_jsx("span", { className: "text-[#0F172A]", children: "Titik kumpul Lapangan Desa Citeureup diperbarui" }), _jsx("span", { className: "text-[12px] text-[#475569]", children: "30 menit lalu" })] }), _jsxs("div", { className: "flex items-center justify-between py-2.5", children: [_jsx("span", { className: "text-[#0F172A]", children: "Titik kumpul Balai Warga RW 08 Dayeuhkolot ditambahkan" }), _jsx("span", { className: "text-[12px] text-[#475569]", children: "3 jam lalu" })] }), _jsxs("div", { className: "flex items-center justify-between py-2.5", children: [_jsx("span", { className: "text-[#0F172A]", children: "Titik kumpul Balai Warga RW 08 perlu verifikasi" }), _jsx("span", { className: "text-[12px] text-[#475569]", children: "Kemarin" })] })] })] }), _jsxs("div", { className: "rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsx("p", { className: "text-[18px] font-semibold text-[#0F172A]", children: "Titik per kecamatan" }), _jsx("div", { className: "mt-4 space-y-3", children: KECAMATAN_BARS.map((b) => (_jsxs("div", { className: "flex items-center justify-between gap-3 text-[13px]", children: [_jsx("span", { className: "w-28 shrink-0 text-[#475569]", children: b.label }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-2 w-[140px] overflow-hidden rounded-[4px] bg-[#E2E8F0]", children: _jsx("div", { className: "h-full rounded-[4px]", style: {
                                                            width: `${b.pct}%`,
                                                            backgroundColor: b.color,
                                                        } }) }), _jsx("span", { className: "w-5 text-right text-[12px] text-[#0F172A]", children: b.count })] })] }, b.label))) })] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-5 rounded-[16px] border border-[#E2E8F0] bg-white p-4", children: [_jsx("img", { src: "/images/map-dayeuhkolot.webp", alt: "Peta Sebaran Titik Kumpul", className: "h-[68px] w-[140px] shrink-0 rounded-[10px] object-cover" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-[15px] font-semibold text-[#0F172A]", children: "Peta Sebaran 37 Titik Kumpul Terverifikasi Kab. Bandung" }), _jsx("p", { className: "mt-0.5 text-[13px] text-[#475569]", children: "Mencakup Aula Masjid Agung Dayeuhkolot, Lapangan Desa Citeureup, Kantor Kecamatan, dan 34 titik aman ramah lansia." }), _jsx("button", { type: "button", onClick: () => setShowAdd(true), className: "mt-1 text-[13px] font-semibold text-[#C2410C] hover:underline", children: "Verifikasi koordinat di peta \u2192" })] })] }), showAdd && (_jsx("div", { role: "dialog", "aria-modal": "true", className: "fixed inset-0 z-50 flex items-center justify-center bg-[#07090C]/55 p-4", children: _jsxs("div", { className: "w-full max-w-[480px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-[22px] font-bold text-[#0F172A]", children: "Tambah titik kumpul" }), _jsx("button", { type: "button", onClick: () => setShowAdd(false), className: "flex size-8 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-lg font-bold text-[#475569]", children: "\u00D7" })] }), _jsxs("form", { onSubmit: onAdd, className: "mt-5 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Wilayah" }), _jsxs("select", { value: regionId, onChange: (e) => setRegionId(e.target.value ? Number(e.target.value) : ""), required: true, className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] bg-white px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]", children: [_jsx("option", { value: "", children: "Pilih wilayah" }), regions?.map((r) => (_jsx("option", { value: r.id, children: r.kecamatan }, r.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Nama titik kumpul" }), _jsx("input", { value: nama, onChange: (e) => setNama(e.target.value), placeholder: "Mis. Aula Masjid Agung Dayeuhkolot", required: true, className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Latitude" }), _jsx("input", { type: "number", step: "any", required: true, value: lat, onChange: (e) => setLat(e.target.value), className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Longitude" }), _jsx("input", { type: "number", step: "any", required: true, value: lng, onChange: (e) => setLng(e.target.value), className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none" })] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: () => setShowAdd(false), className: "h-11 rounded-[10px] border border-[#CBD5E1] bg-white px-5 text-[14px] font-semibold text-[#0B2545]", children: "Batal" }), _jsx("button", { type: "submit", className: "h-11 rounded-[10px] bg-[#C2410C] px-6 text-[14px] font-semibold text-white", children: "Simpan titik kumpul" })] })] })] }) }))] }));
}
