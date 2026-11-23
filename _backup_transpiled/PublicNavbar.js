import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
const LINKS = [
    { href: "#cara-kerja", label: "Cara kerja" },
    { href: "#fitur", label: "Fitur" },
    { href: "/panduan", label: "Panduan" },
    { href: "#data-bmkg", label: "Cuaca" },
];
export function PublicNavbar({ placement = "fixed" }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const flow = placement === "flow";
    return (_jsxs("header", { className: cn("z-50", flow
            ? "sticky top-3 rounded-t-[28px] bg-[#FBF9F6]/95 px-4 py-4 backdrop-blur-md md:top-6 md:px-8"
            : "fixed inset-x-0 top-4 flex justify-center px-4 md:top-6 md:px-5"), children: [_jsxs("div", { className: cn("flex h-14 w-full items-center justify-between gap-4", flow
                    ? "max-w-none"
                    : "max-w-[1240px] rounded-full border border-[#E5DDD2] bg-[#FBF9F6] pr-2 pl-5 shadow-[0_8px_24px_rgba(16,36,63,0.08)]"), children: [_jsx(Link, { to: "/", className: "shrink-0 text-[17px] font-semibold tracking-[-0.02em] text-[#10243F]", children: "SiagaKeluarga" }), _jsx("nav", { className: "hidden items-center gap-7 text-[15px] md:flex", children: LINKS.map((link) => {
                            const active = link.href === "/panduan" && location.pathname.startsWith("/panduan");
                            const className = cn("rounded-full px-1 py-2 transition-colors hover:text-[#10243F]", active ? "font-semibold text-[#9A3412]" : "text-[#3E5168]");
                            return link.href.startsWith("#") && location.pathname === "/" ? (_jsx("a", { href: link.href, className: className, children: link.label }, link.href)) : (_jsx(Link, { to: link.href.startsWith("#") ? `/${link.href}` : link.href, className: className, children: link.label }, link.href));
                        }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Link, { to: "/masuk", className: "hidden h-11 items-center rounded-full px-3 text-[15px] font-medium text-[#3E5168] hover:text-[#10243F] md:inline-flex", children: "Masuk" }), _jsx(Link, { to: "/daftar", className: "inline-flex h-11 items-center rounded-full bg-[#9A3412] px-4 text-[15px] font-semibold text-white hover:bg-[#7C2D0C]", children: "Buat rencana" }), _jsx("button", { type: "button", onClick: () => setMobileOpen((v) => !v), "aria-label": mobileOpen ? "Tutup menu" : "Buka menu", "aria-expanded": mobileOpen, className: "inline-flex size-11 items-center justify-center rounded-full text-[#10243F] hover:bg-[#EFEAE2] md:hidden", children: mobileOpen ? _jsx(X, { className: "size-5" }) : _jsx(Menu, { className: "size-5" }) })] })] }), mobileOpen && (_jsxs("nav", { className: "mt-2 rounded-2xl border border-[#E5DDD2] bg-white p-2 md:hidden", children: [LINKS.map((link) => link.href.startsWith("#") && location.pathname === "/" ? (_jsx("a", { href: link.href, onClick: () => setMobileOpen(false), className: "block rounded-xl px-4 py-3 text-[16px] text-[#142033] hover:bg-[#F6F3EC]", children: link.label }, link.href)) : (_jsx(Link, { to: link.href.startsWith("#") ? `/${link.href}` : link.href, onClick: () => setMobileOpen(false), className: "block rounded-xl px-4 py-3 text-[16px] text-[#142033] hover:bg-[#F6F3EC]", children: link.label }, link.href))), _jsx(Link, { to: "/masuk", onClick: () => setMobileOpen(false), className: "block rounded-xl px-4 py-3 text-[16px] text-[#3E5168] hover:bg-[#F6F3EC]", children: "Masuk" })] }))] }));
}
