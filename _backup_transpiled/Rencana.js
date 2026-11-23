import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useHousehold } from "@/hooks/useHousehold";
import { FASE_LABEL } from "@/content/panduan";
const SECTIONS = [
    { id: "ringkasan", label: "Ringkasan risiko", active: true },
    { id: "titik-kumpul", label: "Titik kumpul", active: false },
    { id: "tugas", label: "Tugas tiap anggota", active: false },
    { id: "kontak", label: "Kontak darurat", active: false },
    { id: "catatan", label: "Catatan khusus", active: false },
];
const SCENARIOS = [
    { jenis: "BANJIR", label: "Banjir", activeBg: "bg-[#1D4ED8]" },
    { jenis: "GEMPA", label: "Gempa", activeBg: "bg-[#B91C1C]" },
    { jenis: "LONGSOR", label: "Longsor", activeBg: "bg-[#A16207]" },
];
const FASES = ["sebelum", "saat", "sesudah"];
function getInitials(name) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("");
}
export function Rencana() {
    const { data: household, isLoading } = useHousehold();
    const [activeJenis, setActiveJenis] = useState("BANJIR");
    const [activeFase, setActiveFase] = useState("sebelum");
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copied, setCopied] = useState(false);
    if (isLoading || !household) {
        return _jsx("div", { className: "h-40 animate-pulse rounded-2xl bg-muted" });
    }
    const plan = household.emergency_plans?.[0];
    const konten = plan?.konten;
    const shareUrl = `${window.location.origin}/r/${household.share_token}`;
    async function copyShareLink() {
        await navigator.clipboard.writeText(shareUrl).catch(() => undefined);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
    return (_jsxs("div", { className: "grid gap-10 lg:grid-cols-[1fr_260px]", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [_jsx("h1", { className: "text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]", children: "Rencana darurat" }), _jsxs("div", { className: "flex flex-wrap gap-2.5 print:hidden", children: [_jsx("button", { type: "button", onClick: () => setShowShareModal(true), className: "h-[44px] rounded-[12px] bg-[#C2410C] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#9A3412]", children: "Bagikan ke keluarga" }), _jsx("button", { type: "button", onClick: () => setShowPdfModal(true), className: "h-[44px] rounded-[12px] border border-[#0B2545] bg-white px-5 text-[14px] font-semibold text-[#0B2545]", children: "Unduh PDF" })] })] }), _jsx("div", { className: "flex flex-wrap gap-2 pt-2 print:hidden", children: SCENARIOS.map((s) => {
                            const active = activeJenis === s.jenis;
                            return (_jsx("button", { type: "button", onClick: () => setActiveJenis(s.jenis), className: `h-[40px] rounded-full px-5 text-[14px] transition-colors ${active
                                    ? `${s.activeBg} font-semibold text-white`
                                    : "border border-[#E2E8F0] bg-white/80 font-medium text-[#475569] hover:bg-white"}`, children: s.label }, s.jenis));
                        }) }), _jsx("div", { className: "flex w-full max-w-[320px] gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-[5px] print:hidden", children: FASES.map((f) => {
                            const active = activeFase === f;
                            return (_jsx("button", { type: "button", onClick: () => setActiveFase(f), className: `flex-1 rounded-[8px] py-1.5 text-[13px] transition-colors ${active
                                    ? "bg-[#0B2545] font-semibold text-white"
                                    : "font-medium text-[#475569] hover:text-[#0F172A]"}`, children: FASE_LABEL[f] }, f));
                        }) }), _jsxs("section", { id: "ringkasan", className: "rounded-[14px] border border-[#E2E8F0] bg-white px-6 py-5", children: [_jsx("p", { className: "text-[13px] text-[#9A3412]", children: "Ringkasan risiko" }), _jsx("p", { className: "mt-1.5 text-[16px] leading-[1.45] text-[#0F172A]", children: konten?.ringkasan_risiko ??
                                    "Rumah berada 400 m dari bantaran sungai. Banjir dapat naik cepat saat hujan lebat lebih dari 2 jam." })] }), _jsxs("section", { id: "titik-kumpul", className: "flex flex-col gap-5 rounded-[20px] border border-[#E2E8F0] bg-white p-6 sm:flex-row sm:items-center", children: [_jsxs("div", { className: "relative h-[120px] w-full shrink-0 overflow-hidden rounded-[16px] sm:w-[160px]", children: [_jsx("img", { src: "/images/map-dayeuhkolot.webp", alt: "Peta titik kumpul", className: "h-full w-full object-cover" }), _jsxs("svg", { viewBox: "0 0 160 120", className: "absolute inset-0 h-full w-full", fill: "none", children: [_jsx("path", { d: "M28 96 L78 64 L126 32", stroke: "#C2410C", strokeWidth: "3", strokeLinecap: "round" }), _jsx("circle", { cx: "122", cy: "30", r: "8", fill: "#C2410C" })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[12px] text-[#475569]", children: "Titik kumpul" }), _jsx("p", { className: "mt-1.5 text-[20px] font-bold text-[#0F172A]", children: "Aula Masjid Agung Dayeuhkolot" }), _jsx("p", { className: "mt-1.5 text-[16px] text-[#475569]", children: konten?.rute_dan_titik_kumpul ??
                                            "400 meter, sekitar 5 menit berjalan kaki dari rumah" })] })] }), _jsxs("section", { id: "tugas", className: "space-y-3 pt-2", children: [_jsx("h2", { className: "text-[22px] font-bold text-[#0F172A]", children: "Tugas tiap anggota" }), (konten?.pembagian_tugas_keluarga?.length
                                ? konten.pembagian_tugas_keluarga
                                : [
                                    {
                                        anggota: "Budi (Ayah)",
                                        tugas: "Membawa tas siaga dan dokumen penting ke titik kumpul",
                                    },
                                    {
                                        anggota: "Sari (Ibu)",
                                        tugas: "Mendampingi Raka dan memastikan obat Nenek Aminah terbawa",
                                    },
                                    {
                                        anggota: "Nenek Aminah",
                                        tugas: "Tetap bersama Sari, jalan perlahan menuju titik kumpul",
                                    },
                                ]).map((t, i) => {
                                const name = t.anggota ?? `Anggota ${i + 1}`;
                                return (_jsxs("div", { className: "flex items-center gap-4 rounded-[16px] border border-[#E2E8F0] bg-white p-5", children: [i === 0 ? (_jsx("img", { src: "/images/avatar-budi.webp", alt: name, className: "size-11 shrink-0 rounded-full object-cover" })) : (_jsx("div", { className: "flex size-11 shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[15px] text-[#0B2545]", children: getInitials(name) })), _jsxs("div", { children: [_jsx("p", { className: "text-[16px] font-bold text-[#0F172A]", children: name }), _jsx("p", { className: "mt-1 text-[16px] text-[#475569]", children: t.tugas ?? t.peran })] })] }, i));
                            })] }), _jsxs("section", { id: "kontak", className: "space-y-3 pt-2", children: [_jsx("h2", { className: "text-[22px] font-bold text-[#0F172A]", children: "Kontak darurat" }), _jsxs("div", { className: "flex items-center justify-between rounded-[16px] border border-[#E2E8F0] bg-white p-5", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[17px] font-semibold text-[#0F172A]", children: "BPBD Kab. Bandung" }), _jsx("p", { className: "mt-1 text-[15px] text-[#475569]", children: "(022) 589-2458" })] }), _jsx("a", { href: "tel:0225892458", className: "flex size-[44px] items-center justify-center rounded-full bg-[#C2410C] text-[18px] text-white", children: "\u260E" })] })] }), _jsxs("section", { id: "catatan", className: "space-y-3 pt-2", children: [_jsx("h2", { className: "text-[22px] font-semibold text-[#0F172A]", children: "Catatan khusus" }), _jsxs("div", { className: "rounded-[20px] bg-[#F4F1EA] p-6", children: [_jsx("p", { className: "text-[17px] font-semibold text-[#0F172A]", children: "Kebutuhan Nenek Aminah" }), _jsx("p", { className: "mt-2 text-[15px] leading-[1.45] text-[#475569]", children: "Obat darah tinggi harus selalu ada di tas siaga. Mobilitas terbatas, perlu dibantu berjalan menuju titik kumpul. Dokter keluarga: dr. Santi, (022) 701-4455." })] })] })] }), _jsxs("aside", { className: "hidden h-fit space-y-5 lg:block print:hidden", children: [_jsxs("nav", { className: "rounded-[14px] border border-[#E2E8F0] bg-white p-5", children: [_jsx("p", { className: "text-[12px] text-[#475569]", children: "Daftar isi" }), _jsx("div", { className: "mt-4 space-y-3", children: SECTIONS.map((s) => (_jsx("a", { href: `#${s.id}`, className: `block text-[14px] ${s.active
                                        ? "font-medium text-[#C2410C]"
                                        : "text-[#475569] hover:text-[#C2410C]"}`, children: s.label }, s.id))) })] }), _jsxs("div", { className: "rounded-[14px] border border-[#E2E8F0] bg-white p-5", children: [_jsx("p", { className: "text-[12px] font-semibold text-[#C2410C]", children: "Status Cuaca Saat Ini" }), _jsx("p", { className: "mt-2 text-[20px] font-semibold text-[#0B2545]", children: "24\u00B0C, Hujan Lebat" }), _jsx("p", { className: "mt-1.5 text-[13px] leading-[1.35] text-[#475569]", children: "Kel. Dayeuhkolot (Sumber BMKG). Pantau ketinggian air di teras." }), _jsx("a", { href: "tel:112", className: "mt-4 block w-full rounded-[10px] bg-[#C2410C] py-2.5 text-center text-[13px] font-semibold text-white", children: "Hubungi Darurat 112" })] })] }), showPdfModal && (_jsx("div", { role: "dialog", "aria-modal": "true", className: "fixed inset-0 z-50 flex items-center justify-center bg-[#0B2545]/45 p-4 print:hidden", children: _jsxs("div", { className: "flex w-full max-w-[640px] flex-col gap-[18px] rounded-[18px] border border-[#E2E8F0] bg-white px-9 py-8 shadow-[0_20px_48px_rgba(11,37,69,0.16)]", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-[20px] font-semibold text-[#0B2545]", children: "Preview Lembar Darurat (Siap Cetak A4)" }), _jsx("button", { type: "button", onClick: () => setShowPdfModal(false), className: "text-[20px] leading-none font-medium text-[#64748B] hover:text-[#0F172A]", children: "\u00D7" })] }), _jsxs("div", { className: "overflow-hidden rounded-[4px] border border-[#CBD5E1] bg-white pb-[22px] shadow-[0_8px_24px_rgba(11,37,69,0.11)]", children: [_jsxs("div", { className: "flex h-12 items-center justify-between bg-[#0B2545] px-[22px]", children: [_jsx("p", { className: "text-[16px] font-bold text-white", children: "Rencana Darurat Keluarga Pratama" }), _jsx("span", { className: "text-[12px] font-semibold text-[#93C5FD]", children: "Skenario Banjir" })] }), _jsxs("div", { className: "mt-3 flex flex-col gap-2.5 px-[22px] pt-1.5", children: [_jsx("p", { className: "text-[12px] text-[#475569]", children: "Jl. Raya Dayeuhkolot No. 12, Kab. Bandung (Titik kumpul: Aula Masjid Agung, 400 m)" }), _jsx("div", { className: "h-px w-full bg-[#E2E8F0]" }), _jsx("p", { className: "text-[13px] font-semibold text-[#0F172A]", children: "Pembagian Tugas Anggota Keluarga" }), _jsx("p", { className: "text-[12px] leading-[20px] text-[#475569]", children: "1. Budi (Ayah): Matikan MCB listrik, bawa tas siaga & dokumen kedap air." }), _jsx("p", { className: "text-[12px] leading-[20px] text-[#475569]", children: "2. Sari (Ibu): Dampingi Raka & pastikan obat darah tinggi Nenek Aminah terbawa." }), _jsx("p", { className: "text-[12px] leading-[20px] text-[#475569]", children: "3. Nenek Aminah: Evakuasi lebih dulu menuju Aula Masjid Agung via jalur datar." }), _jsx("div", { className: "h-px w-full bg-[#E2E8F0]" }), _jsx("p", { className: "text-[12px] font-semibold text-[#9A3412]", children: "Nomor Darurat: 112 (Nasional) | BPBD Kab. Bandung (022) 589-2458 | Puskesmas (022) 589-1122" })] })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsx("p", { className: "text-[12px] font-medium text-[#64748B]", children: "Format: PDF A4 (1 halaman)" }), _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("button", { type: "button", onClick: () => {
                                                setShowPdfModal(false);
                                                setTimeout(() => window.print(), 150);
                                            }, className: "h-11 rounded-[8px] border border-[#CBD5E1] bg-white px-[18px] text-[13px] font-semibold text-[#0B2545]", children: "Cetak Langsung" }), _jsx("button", { type: "button", onClick: () => {
                                                setShowPdfModal(false);
                                                setTimeout(() => window.print(), 150);
                                            }, className: "h-11 rounded-[8px] bg-[#C2410C] px-5 text-[13px] font-semibold text-white", children: "Unduh PDF (120 KB)" })] })] })] }) })), showShareModal && (_jsx("div", { role: "dialog", "aria-modal": "true", className: "fixed inset-0 z-50 flex items-center justify-center bg-[#0B2545]/45 p-4 print:hidden", children: _jsxs("div", { className: "flex w-full max-w-[540px] flex-col gap-[18px] rounded-[18px] border border-[#E2E8F0] bg-white px-9 py-8 shadow-[0_20px_48px_rgba(11,37,69,0.16)]", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-[20px] font-semibold text-[#0B2545]", children: "Bagikan Rencana Darurat Keluarga" }), _jsx("button", { type: "button", onClick: () => setShowShareModal(false), className: "text-[20px] leading-none font-medium text-[#64748B] hover:text-[#0F172A]", children: "\u00D7" })] }), _jsx("p", { className: "text-[13px] leading-[20px] text-[#475569]", children: "Anggota keluarga bisa membuka rencana ini langsung dari ponsel tanpa perlu login (mode hanya baca)." }), _jsxs("div", { className: "flex h-[54px] items-center justify-between gap-2.5 rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] py-2 pr-2 pl-4", children: [_jsx("span", { className: "truncate text-[14px] font-medium text-[#0B2545]", children: shareUrl }), _jsx("button", { type: "button", onClick: copyShareLink, className: "h-9 shrink-0 rounded-[7px] bg-[#0B2545] px-4 text-[13px] font-semibold text-white", children: copied ? "Tersalin" : "Salin tautan" })] }), _jsxs("div", { className: "space-y-1.5 py-1", children: [_jsx("p", { className: "text-[13px] font-semibold text-[#0B2545]", children: "Yang dapat dilihat penerima tautan:" }), _jsx("p", { className: "text-[12px] leading-[19px] text-[#475569]", children: "Titik kumpul Aula Masjid Agung Dayeuhkolot, pembagian tugas anggota, catatan Nenek Aminah, dan tombol Telepon 112." })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("a", { href: `https://wa.me/?text=${encodeURIComponent(`Rencana Darurat Keluarga Pratama: ${shareUrl}`)}`, target: "_blank", rel: "noreferrer", className: "flex h-11 flex-1 items-center justify-center rounded-[8px] bg-[#0F766E] px-5 text-[14px] font-semibold text-white", children: "Kirim ke WhatsApp Keluarga" }), _jsx("button", { type: "button", onClick: () => setShowShareModal(false), className: "h-11 rounded-[8px] border border-[#CBD5E1] bg-white px-5 text-[14px] font-semibold text-[#0B2545]", children: "Tutup" })] })] }) }))] }));
}
