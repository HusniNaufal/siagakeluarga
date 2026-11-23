import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAdminHazardZones, useCreateHazardZone, useDeleteHazardZone, } from "@/hooks/useAdmin";
import { useRegions } from "@/hooks/useRisk";
const JENIS_OPTIONS = [
    "BANJIR",
    "GEMPA",
    "LONGSOR",
    "CUACA_EKSTREM",
    "TSUNAMI",
];
const TINGKAT_OPTIONS = ["RENDAH", "SEDANG", "TINGGI"];
const JENIS_LABEL = {
    BANJIR: "Banjir",
    GEMPA: "Gempa",
    LONGSOR: "Longsor",
    CUACA_EKSTREM: "Cuaca ekstrem",
    TSUNAMI: "Tsunami",
};
const TINGKAT_LABEL = {
    RENDAH: "Rendah",
    SEDANG: "Sedang",
    TINGGI: "Tinggi",
};
const DEFAULT_ROWS = [
    {
        id: 1,
        nama: "Zona Rawan Banjir Dayeuhkolot",
        titleColor: "#1D4ED8",
        kecamatan: "Dayeuhkolot",
        tingkat: "Tinggi",
        status: "Aktif",
    },
    {
        id: 2,
        nama: "Zona Rawan Longsor Bukit Pasirjambu",
        titleColor: "#A16207",
        kecamatan: "Pasirjambu",
        tingkat: "Tinggi",
        status: "Aktif",
    },
    {
        id: 3,
        nama: "Zona Rawan Gempa Sesar Lembang",
        titleColor: "#B91C1C",
        kecamatan: "Lembang",
        tingkat: "Sedang",
        status: "Dipantau",
    },
];
const ZONA_BARS = [
    { label: "Banjir", count: 2, pct: 70, color: "#1D4ED8" },
    { label: "Gempa", count: 1, pct: 35, color: "#B91C1C" },
    { label: "Longsor", count: 1, pct: 35, color: "#A16207" },
    { label: "Cuaca ekstrem", count: 1, pct: 35, color: "#0F766E" },
];
export function AdminZona() {
    const { data: zones } = useAdminHazardZones();
    const { data: regions } = useRegions();
    const createZone = useCreateHazardZone();
    const deleteZone = useDeleteHazardZone();
    const [showAdd, setShowAdd] = useState(false);
    const [regionId, setRegionId] = useState("");
    const [jenis, setJenis] = useState("BANJIR");
    const [tingkat, setTingkat] = useState("SEDANG");
    const [sumber, setSumber] = useState("BNPB");
    async function onAdd(e) {
        e.preventDefault();
        if (!regionId)
            return;
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
        const rows = (zones ?? [])
            .map((z) => `${z.id},"${z.region.kecamatan}",${z.jenis_bencana},${z.tingkat},"${z.sumber}"`)
            .join("\n");
        const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "zona-bahaya-bpbd.csv";
        a.click();
        URL.revokeObjectURL(url);
    }
    const tinggiCount = zones?.length
        ? zones.filter((z) => z.tingkat === "TINGGI").length
        : 2;
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [_jsx("h1", { className: "text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]", children: "Kelola zona bahaya" }), _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("button", { type: "button", onClick: exportCsv, className: "h-[42px] rounded-[10px] border border-[#CBD5E1] bg-white px-[18px] text-[13px] font-semibold text-[#0B2545]", children: "Ekspor CSV" }), _jsx("button", { type: "button", onClick: () => setShowAdd(true), className: "h-[42px] rounded-[10px] bg-[#C2410C] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#9A3412]", children: "+ Tambah zona" })] })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-3", children: [_jsxs("div", { className: "rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5", children: [_jsx("p", { className: "text-[12px] text-[#475569]", children: "Zona aktif" }), _jsx("p", { className: "mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]", children: zones?.length || 5 }), _jsx("p", { className: "mt-1 text-[12px] font-medium text-[#0F766E]", children: "Dipantau 24 jam bersama data BMKG" })] }), _jsxs("div", { className: "rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5", children: [_jsx("p", { className: "text-[12px] text-[#475569]", children: "Tingkat risiko tinggi" }), _jsx("p", { className: "mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]", children: tinggiCount }), _jsx("p", { className: "mt-1 text-[12px] font-medium text-[#D97706]", children: "Prioritas: Dayeuhkolot & Baleendah" })] }), _jsxs("div", { className: "rounded-[16px] border border-[#E2E8F0] bg-white px-[22px] py-5", children: [_jsx("p", { className: "text-[12px] text-[#475569]", children: "Wilayah terdampak" }), _jsx("p", { className: "mt-1.5 text-[30px] leading-tight font-bold text-[#0F172A]", children: "3 kecamatan" }), _jsx("p", { className: "mt-1 text-[12px] font-medium text-[#0F766E]", children: "1.204 keluarga dalam radius peringatan" })] })] }), _jsx("div", { className: "overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white", children: _jsxs("table", { className: "w-full text-left text-[15px]", children: [_jsx("thead", { className: "border-b border-[#E2E8F0] bg-[#F4F1EA] text-[12px] text-[#475569]", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3.5 font-normal", children: "Nama zona" }), _jsx("th", { className: "px-6 py-3.5 font-normal", children: "Kecamatan" }), _jsx("th", { className: "px-6 py-3.5 font-normal", children: "Tingkat Risiko" }), _jsx("th", { className: "px-6 py-3.5 font-normal", children: "Status" }), _jsx("th", { className: "px-6 py-3.5 text-right font-normal", children: "Aksi" })] }) }), _jsx("tbody", { className: "divide-y divide-[#E2E8F0]", children: zones?.length
                                ? zones.map((z) => {
                                    const color = z.jenis_bencana === "BANJIR"
                                        ? "#1D4ED8"
                                        : z.jenis_bencana === "LONGSOR"
                                            ? "#A16207"
                                            : "#B91C1C";
                                    return (_jsxs("tr", { children: [_jsxs("td", { className: "px-6 py-4 font-semibold", style: { color }, children: ["Zona Rawan ", JENIS_LABEL[z.jenis_bencana], " ", z.region.kecamatan] }), _jsx("td", { className: "px-6 py-4 text-[#475569]", children: z.region.kecamatan }), _jsx("td", { className: "px-6 py-4 text-[#475569]", children: TINGKAT_LABEL[z.tingkat] }), _jsx("td", { className: "px-6 py-4 text-[#C2410C]", children: "Aktif" }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx("button", { type: "button", onClick: () => deleteZone.mutate(z.id), className: "text-[13px] font-semibold text-[#0B2545] hover:underline", children: "Ubah" }) })] }, z.id));
                                })
                                : DEFAULT_ROWS.map((r) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 font-semibold", style: { color: r.titleColor }, children: r.nama }), _jsx("td", { className: "px-6 py-4 text-[#475569]", children: r.kecamatan }), _jsx("td", { className: "px-6 py-4 text-[#475569]", children: r.tingkat }), _jsx("td", { className: `px-6 py-4 ${r.status === "Aktif"
                                                ? "text-[#C2410C]"
                                                : "text-[#D97706]"}`, children: r.status }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx("button", { type: "button", onClick: () => setShowAdd(true), className: "text-[13px] font-semibold text-[#0B2545] hover:underline", children: "Ubah" }) })] }, r.id))) })] }) }), _jsxs("div", { className: "grid gap-5 lg:grid-cols-[1fr_380px]", children: [_jsxs("div", { className: "rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsx("p", { className: "text-[18px] font-semibold text-[#0F172A]", children: "Aktivitas terbaru" }), _jsxs("div", { className: "mt-4 divide-y divide-[#E2E8F0] text-[14px]", children: [_jsxs("div", { className: "flex items-center justify-between py-2.5", children: [_jsx("span", { className: "text-[#0F172A]", children: "Zona Rawan Banjir Dayeuhkolot RW 05 diperbarui" }), _jsx("span", { className: "text-[12px] text-[#475569]", children: "1 jam lalu" })] }), _jsxs("div", { className: "flex items-center justify-between py-2.5", children: [_jsx("span", { className: "text-[#0F172A]", children: "Zona Rawan Longsor Bukit Pasirjambu ditinjau ulang" }), _jsx("span", { className: "text-[12px] text-[#475569]", children: "4 jam lalu" })] }), _jsxs("div", { className: "flex items-center justify-between py-2.5", children: [_jsx("span", { className: "text-[#0F172A]", children: "Zona Rawan Luapan Sungai Citarum ditambahkan" }), _jsx("span", { className: "text-[12px] text-[#475569]", children: "Kemarin" })] })] })] }), _jsxs("div", { className: "rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsx("p", { className: "text-[18px] font-semibold text-[#0F172A]", children: "Zona per jenis bahaya" }), _jsx("div", { className: "mt-4 space-y-3", children: ZONA_BARS.map((b) => (_jsxs("div", { className: "flex items-center justify-between gap-3 text-[13px]", children: [_jsx("span", { className: "w-28 shrink-0 text-[#475569]", children: b.label }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-2 w-[140px] overflow-hidden rounded-[4px] bg-[#E2E8F0]", children: _jsx("div", { className: "h-full rounded-[4px]", style: {
                                                            width: `${b.pct}%`,
                                                            backgroundColor: b.color,
                                                        } }) }), _jsx("span", { className: "w-4 text-right text-[12px] text-[#0F172A]", children: b.count })] })] }, b.label))) })] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-5 rounded-[16px] border border-[#E2E8F0] bg-white p-4", children: [_jsx("img", { src: "/images/map-dayeuhkolot.webp", alt: "Peta Sebaran Zona Bahaya", className: "h-[68px] w-[140px] shrink-0 rounded-[10px] object-cover" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-[15px] font-semibold text-[#0F172A]", children: "Peta Sebaran Zona Bahaya Kab. Bandung Selatan" }), _jsx("p", { className: "mt-0.5 text-[13px] text-[#475569]", children: "Sinkronisasi langsung dengan data peringatan dini curah hujan BMKG & pemantauan tinggi muka air Sungai Citarum." }), _jsx("button", { type: "button", onClick: () => setShowAdd(true), className: "mt-1 text-[13px] font-semibold text-[#C2410C] hover:underline", children: "Buka peta interaktif BPBD \u2192" })] })] }), showAdd && (_jsx("div", { role: "dialog", "aria-modal": "true", className: "fixed inset-0 z-50 flex items-center justify-center bg-[#07090C]/55 p-4", children: _jsxs("div", { className: "w-full max-w-[480px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-[22px] font-bold text-[#0F172A]", children: "Tambah zona bahaya" }), _jsx("button", { type: "button", onClick: () => setShowAdd(false), className: "flex size-8 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-lg font-bold text-[#475569]", children: "\u00D7" })] }), _jsxs("form", { onSubmit: onAdd, className: "mt-5 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Wilayah" }), _jsxs("select", { value: regionId, onChange: (e) => setRegionId(e.target.value ? Number(e.target.value) : ""), required: true, className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] bg-white px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]", children: [_jsx("option", { value: "", children: "Pilih wilayah" }), regions?.map((r) => (_jsx("option", { value: r.id, children: r.kecamatan }, r.id)))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Jenis bencana" }), _jsx("select", { value: jenis, onChange: (e) => setJenis(e.target.value), className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] bg-white px-3.5 text-[14px] outline-none", children: JENIS_OPTIONS.map((j) => (_jsx("option", { value: j, children: JENIS_LABEL[j] }, j))) })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Tingkat risiko" }), _jsx("select", { value: tingkat, onChange: (e) => setTingkat(e.target.value), className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] bg-white px-3.5 text-[14px] outline-none", children: TINGKAT_OPTIONS.map((t) => (_jsx("option", { value: t, children: TINGKAT_LABEL[t] }, t))) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Sumber" }), _jsx("input", { value: sumber, onChange: (e) => setSumber(e.target.value), className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none" })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: () => setShowAdd(false), className: "h-11 rounded-[10px] border border-[#CBD5E1] bg-white px-5 text-[14px] font-semibold text-[#0B2545]", children: "Batal" }), _jsx("button", { type: "submit", className: "h-11 rounded-[10px] bg-[#C2410C] px-6 text-[14px] font-semibold text-white", children: "Simpan zona" })] })] })] }) }))] }));
}
