import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
const HAZARDS = [
    {
        jenis: "BANJIR",
        title: "Banjir",
        text: "Kapan pindah, ke mana berjalan, dan apa yang tidak boleh dinyalakan saat genangan.",
        color: "#1D4ED8",
    },
    {
        jenis: "GEMPA",
        title: "Gempa",
        text: "Lindungi kepala lebih dulu. Keluar ke titik kumpul setelah guncangan berhenti.",
        color: "#B91C1C",
    },
    {
        jenis: "LONGSOR",
        title: "Longsor",
        text: "Perhatikan retakan tanah dan lereng di belakang rumah sebelum hujan panjang.",
        color: "#A16207",
    },
    {
        jenis: "CUACA_EKSTREM",
        title: "Cuaca ekstrem",
        text: "Angin kencang dan hujan lebat: apa yang dikunci, dan siapa yang dicek kabarnya.",
        color: "#0F766E",
    },
    {
        jenis: "TSUNAMI",
        title: "Tsunami",
        text: "Naik ke tempat tinggi yang sudah disepakati. Jangan menunggu air terlihat.",
        color: "#0E7490",
    },
];
export function Fitur() {
    return (_jsxs("section", { className: "px-4 py-14 md:px-8 md:py-16", children: [_jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [_jsxs("div", { className: "max-w-[640px]", children: [_jsx("h2", { className: "text-[32px] leading-[1.15] font-semibold tracking-[-0.03em] text-[#10243F] md:text-[40px]", children: "Lima bencana, langkahnya tidak sama." }), _jsx("p", { className: "mt-3 text-[16px] leading-[1.6] text-[#3E5168]", children: "Setiap panduan dibagi sebelum, saat, dan sesudah. Langkah yang cocok bisa dimasukkan ke rencana keluarga." })] }), _jsx(Link, { to: "/panduan", className: "inline-flex h-11 items-center rounded-full bg-[#10243F] px-4 text-[15px] font-semibold text-white hover:bg-[#1A3358]", children: "Buka semua panduan" })] }), _jsx("div", { className: "mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5", children: HAZARDS.map((item) => (_jsxs(Link, { to: `/panduan/${item.jenis}`, className: "flex flex-col rounded-[22px] border border-[#E5DDD2] bg-white p-5", style: { borderTop: `3px solid ${item.color}` }, children: [_jsx("h3", { className: "text-[18px] font-semibold text-[#10243F]", children: item.title }), _jsx("p", { className: "mt-2 flex-1 text-[14px] leading-[1.5] text-[#3E5168]", children: item.text }), _jsx("span", { className: "mt-5 text-[14px] font-semibold text-[#9A3412]", children: "Baca panduan" })] }, item.jenis))) })] }));
}
