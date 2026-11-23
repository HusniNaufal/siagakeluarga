import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
const MODULES = [
    {
        title: "Rencana darurat",
        text: "Titik kumpul, jalur, dan tugas tiap anggota dalam satu halaman.",
        visual: "plan",
    },
    {
        title: "Cuaca kelurahan",
        text: "Prakiraan BMKG untuk alamat rumah, dibaca ulang tiap 3 jam.",
        visual: "weather",
    },
    {
        title: "Tas siaga",
        text: "Daftar barang yang beda untuk lansia, bayi, dan obat rutin.",
        visual: "bag",
    },
    {
        title: "Tanya langkah",
        text: "Pertanyaan singkat, jawaban yang tetap mengarah ke petugas resmi.",
        visual: "ask",
    },
];
export function Hero() {
    return (_jsxs("section", { className: "px-4 pt-2 pb-6 md:px-8 md:pb-8", children: [_jsxs("div", { className: "grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10", children: [_jsxs("div", { className: "max-w-[560px]", children: [_jsx("h1", { className: "text-[40px] leading-[1.08] font-semibold tracking-[-0.035em] text-[#10243F] sm:text-[52px]", children: "Siap bersama, sebelum bencana datang." }), _jsx("p", { className: "mt-5 max-w-[46ch] text-[18px] leading-[1.55] text-[#3E5168]", children: "Susun rencana darurat keluarga sekali: siapa menjemput anak, di mana bertemu, dan apa yang harus ada di tas. Bisa dibagikan lewat tautan, tanpa akun untuk yang menerimanya." }), _jsxs("div", { className: "mt-7 flex flex-wrap items-center gap-3", children: [_jsx(Link, { to: "/daftar", className: "inline-flex h-12 items-center rounded-full bg-[#9A3412] px-5 text-[16px] font-semibold text-white hover:bg-[#7C2D0C]", children: "Buat rencana gratis" }), _jsx("a", { href: "#cara-kerja", className: "inline-flex h-12 items-center rounded-full border border-[#10243F]/15 bg-white px-5 text-[16px] font-semibold text-[#10243F] hover:bg-[#F3EEE6]", children: "Lihat cara kerja" })] }), _jsx("p", { className: "mt-5 text-[14px] leading-relaxed text-[#5C6B7C]", children: "Untuk orang tua yang mengurus rumah. Lansia cukup membuka tautan yang dikirim." })] }), _jsxs("div", { className: "relative", children: [_jsx("img", { src: "/hero/aman.webp", alt: "Keluarga berjalan di jalur tinggi, desa di bawahnya tergenang air", className: "h-[340px] w-full rounded-[24px] object-cover object-[22%_72%] sm:h-[420px]" }), _jsxs("div", { className: "mt-3 grid gap-3 sm:absolute sm:inset-x-4 sm:bottom-4 sm:mt-0 sm:grid-cols-2", children: [_jsxs("div", { className: "rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(16,36,63,0.12)]", children: [_jsx("p", { className: "text-[13px] text-[#5C6B7C]", children: "Contoh \u00B7 Dayeuhkolot" }), _jsx("p", { className: "mt-1 text-[15px] font-semibold text-[#10243F]", children: "Waspada hujan lebat, 15:00" }), _jsx("p", { className: "mt-1 text-[13px] text-[#3E5168]", children: "Angka ini contoh tampilan, bukan prakiraan langsung." })] }), _jsxs("div", { className: "rounded-2xl bg-[#10243F] p-4 text-white shadow-[0_10px_30px_rgba(16,36,63,0.18)]", children: [_jsx("p", { className: "text-[13px] text-[#C9D3E0]", children: "Titik kumpul" }), _jsx("p", { className: "mt-1 text-[15px] font-semibold", children: "Aula Masjid Agung \u00B7 400 m" }), _jsx("p", { className: "mt-1 text-[13px] text-[#C9D3E0]", children: "Sekitar 5 menit jalan kaki." })] })] })] })] }), _jsx("div", { id: "fitur", className: "mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4", children: MODULES.map((item) => (_jsxs("article", { className: "flex flex-col rounded-[20px] border border-[#E5DDD2] bg-white p-4", children: [_jsx(ModuleVisual, { kind: item.visual }), _jsx("h2", { className: "mt-4 text-[16px] font-semibold text-[#10243F]", children: item.title }), _jsx("p", { className: "mt-1 text-[14px] leading-[1.5] text-[#3E5168]", children: item.text })] }, item.title))) })] }));
}
function ModuleVisual({ kind }) {
    if (kind === "plan") {
        return (_jsxs("div", { className: "relative h-[112px] overflow-hidden rounded-xl bg-[#E7EEF2]", children: [_jsx("img", { src: "/images/map-dayeuhkolot.webp", alt: "", className: "size-full object-cover" }), _jsxs("svg", { viewBox: "0 0 260 112", className: "absolute inset-0 size-full", "aria-hidden": "true", children: [_jsx("path", { d: "M28 86 C80 86, 120 28, 214 28", fill: "none", stroke: "#9A3412", strokeWidth: "3", strokeLinecap: "round" }), _jsx("circle", { cx: "28", cy: "86", r: "4", fill: "#10243F" }), _jsx("circle", { cx: "214", cy: "28", r: "4", fill: "#9A3412" })] })] }));
    }
    if (kind === "weather") {
        return (_jsxs("div", { className: "flex h-[112px] flex-col justify-between rounded-xl bg-[#10243F] p-3 text-white", children: [_jsx("p", { className: "text-[12px] text-[#C9D3E0]", children: "Selasa sore" }), _jsx("p", { className: "text-[28px] leading-none font-semibold", children: "24\u00B0" }), _jsxs("div", { className: "flex h-7 items-end gap-1.5", "aria-hidden": "true", children: [_jsx("span", { className: "h-2 flex-1 rounded-sm bg-[#7EA2E3]" }), _jsx("span", { className: "h-4 flex-1 rounded-sm bg-[#7EA2E3]" }), _jsx("span", { className: "h-7 flex-1 rounded-sm bg-[#E7B089]" }), _jsx("span", { className: "h-3 flex-1 rounded-sm bg-[#7EA2E3]" })] })] }));
    }
    if (kind === "bag") {
        return (_jsx("ul", { className: "flex h-[112px] flex-col justify-center gap-2 rounded-xl bg-[#F3EEE6] px-3", children: ["Dokumen dalam kantong kedap air", "Obat nenek, cukup 7 hari", "Air minum dan senter"].map((row) => (_jsxs("li", { className: "flex items-center gap-2 text-[13px] text-[#142033]", children: [_jsx("span", { className: "size-3.5 shrink-0 rounded-[4px] border border-[#9A3412] bg-white" }), _jsx("span", { className: "truncate", children: row })] }, row))) }));
    }
    return (_jsxs("div", { className: "flex h-[112px] flex-col justify-center gap-2 rounded-xl bg-[#F3EEE6] p-3", children: [_jsx("p", { className: "w-fit max-w-full rounded-xl bg-[#10243F] px-2.5 py-1.5 text-[12px] text-white", children: "Air sudah di teras. Kami pergi sekarang?" }), _jsx("p", { className: "rounded-xl bg-white px-2.5 py-1.5 text-[12px] leading-snug text-[#142033]", children: "Ya. Ikuti jalur ke aula, jangan tunggu air setinggi lutut." })] }));
}
