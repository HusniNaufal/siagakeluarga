import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { GUIDES, FASE_LABEL } from "@/content/panduan";
import { TopoBackground } from "@/components/layout/TopoBackground";
const FILTERS = [
    { value: "SEMUA", label: "Semua" },
    { value: "BANJIR", label: "Banjir" },
    { value: "GEMPA", label: "Gempa" },
    { value: "LONGSOR", label: "Longsor" },
    { value: "CUACA_EKSTREM", label: "Cuaca ekstrem" },
    { value: "TSUNAMI", label: "Tsunami" },
];
const FASES = ["sebelum", "saat", "sesudah"];
export function PanduanDaftar() {
    const [filter, setFilter] = useState("SEMUA");
    const cards = GUIDES.filter((g) => filter === "SEMUA" || g.jenis === filter).flatMap((guide) => FASES.map((fase) => ({ guide, fase })));
    return (_jsxs("div", { children: [_jsxs("section", { className: "relative overflow-hidden bg-[#07090C] px-6 pt-40 pb-24 md:px-[100px]", children: [_jsx("img", { src: "/images/panduan-hero.webp", alt: "Panduan bencana", className: "absolute inset-0 h-full w-full object-cover object-center" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#07090C]/90 via-[#07090C]/20 to-transparent" }), _jsx("div", { className: "relative z-10 mx-auto max-w-[1240px]", children: _jsxs("div", { className: "max-w-2xl", children: [_jsx("h1", { className: "text-4xl font-bold tracking-[-0.025em] text-white md:text-[56px]", children: "Panduan bencana" }), _jsx("p", { className: "mt-4 text-[18px] text-[#F5F5F4]", children: "Langkah resmi BNPB untuk sebelum, saat, dan sesudah bencana." }), _jsx("div", { className: "mt-8 flex flex-wrap gap-2.5", children: FILTERS.map((f) => (_jsx("button", { type: "button", onClick: () => setFilter(f.value), className: `rounded-full px-5 py-2.5 text-[15px] transition-colors ${filter === f.value
                                            ? "bg-[#C2410C] font-semibold text-white"
                                            : "border border-white/25 bg-[#0B2545]/80 font-medium text-white hover:bg-[#0B2545]"}`, children: f.label }, f.value))) })] }) })] }), _jsxs("section", { className: "relative overflow-hidden bg-[#F4F1EA] px-6 py-14 md:px-[100px]", children: [_jsx(TopoBackground, { variant: "warm" }), _jsx("div", { className: "relative z-10 mx-auto max-w-[1240px]", children: _jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4", children: cards.map(({ guide, fase }) => (_jsxs(Link, { to: `/panduan/${guide.jenis}?fase=${fase}`, className: "group flex flex-col gap-3 rounded-[20px] border border-[#E2E8F0] bg-white p-[14px] pb-[18px] transition-transform hover:-translate-y-0.5", children: [_jsx("div", { className: "h-[240px] overflow-hidden rounded-[14px] bg-[#E2E8F0]", children: _jsx("img", { src: guide.fase[fase].image || guide.image, alt: `${guide.label} (${FASE_LABEL[fase]})`, className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]", loading: "lazy", onError: (e) => {
                                                e.currentTarget.src = "/images/panduan-hero.webp";
                                            } }) }), _jsxs("p", { className: "text-[13px] font-normal", style: { color: guide.color }, children: [guide.label, " (", FASE_LABEL[fase], ")"] }), _jsx("p", { className: "text-[18px] leading-[1.25] font-semibold text-[#0F172A]", children: guide.fase[fase].ringkasan })] }, `${guide.jenis}-${fase}`))) }) })] })] }));
}
