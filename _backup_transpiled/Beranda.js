import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { CaraKerja } from "@/components/sections/CaraKerja";
import { Fitur } from "@/components/sections/Fitur";
import { DataBmkgLive } from "@/components/sections/DataBmkgLive";
import { Penutup } from "@/components/sections/Penutup";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
export function Beranda() {
    return (_jsx("div", { className: "min-h-screen bg-[#10243F] px-3 py-3 md:px-6 md:py-6", children: _jsxs("div", { className: "mx-auto max-w-[1240px] rounded-[28px] bg-[#FBF9F6] text-[#142033]", children: [_jsx(PublicNavbar, { placement: "flow" }), _jsx(Hero, {}), _jsx(Stats, {}), _jsx(CaraKerja, {}), _jsx(Fitur, {}), _jsx(DataBmkgLive, {}), _jsx(Penutup, {}), _jsx(Faq, {}), _jsx(Footer, {})] }) }));
}
