import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
const LINKS = [
    { href: "#cara-kerja", label: "Cara kerja" },
    { href: "/panduan", label: "Panduan bencana" },
    { href: "#data-bmkg", label: "Contoh cuaca" },
    { href: "/masuk", label: "Masuk" },
    { href: "/daftar", label: "Daftar" },
];
export function Footer() {
    return (_jsxs("footer", { className: "px-4 pt-10 pb-8 md:px-8", children: [_jsxs("div", { className: "flex flex-col gap-8 border-t border-[#E5DDD2] pt-8 md:flex-row md:items-start md:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[18px] font-semibold text-[#10243F]", children: "SiagaKeluarga" }), _jsx("p", { className: "mt-2 max-w-[36ch] text-[14px] leading-[1.55] text-[#3E5168]", children: "Rencana darurat keluarga untuk banjir, gempa, longsor, cuaca ekstrem, dan tsunami." })] }), _jsx("nav", { className: "flex flex-wrap gap-x-6 gap-y-2 text-[15px]", children: LINKS.map((link) => link.href.startsWith("#") ? (_jsx("a", { href: link.href, className: "text-[#3E5168] hover:text-[#10243F]", children: link.label }, link.href)) : (_jsx(Link, { to: link.href, className: "text-[#3E5168] hover:text-[#10243F]", children: link.label }, link.href))) })] }), _jsx("p", { className: "mt-8 text-[13px] leading-[1.5] text-[#5C6B7C]", children: "Data cuaca: BMKG. Data bencana: BNPB. IT RUSH 2026. Saat kejadian, arahan petugas di tempat lebih utama daripada halaman ini." })] }));
}
