import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { Home, FileText, Users, Backpack, CloudLightning, MessageCircle, Award, LogOut, } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useHousehold } from "@/hooks/useHousehold";
import { cn } from "@/lib/utils";
const APP_NAV_ITEMS = [
    { to: "/beranda-saya", label: "Beranda saya", shortLabel: "Beranda", icon: Home },
    { to: "/rencana", label: "Rencana darurat", shortLabel: "Rencana", icon: FileText },
    { to: "/keluarga", label: "Profil keluarga", shortLabel: "Keluarga", icon: Users },
    { to: "/tas-siaga", label: "Tas siaga", shortLabel: "Tas siaga", icon: Backpack },
    { to: "/risiko", label: "Risiko dan cuaca", shortLabel: "Cuaca", icon: CloudLightning },
    { to: "/tanya", label: "Tanya AI", shortLabel: "Tanya AI", icon: MessageCircle },
    { to: "/latihan", label: "Latihan", shortLabel: "Latihan", icon: Award },
];
export function Sidebar() {
    const { user, logout } = useAuth();
    const { data: household } = useHousehold();
    const kelurahanLabel = household?.region?.kecamatan
        ? `Kel. ${household.region.kecamatan}`
        : "Kel. Dayeuhkolot";
    return (_jsxs("aside", { className: "sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-[#E2E8F0] bg-white px-4 py-8 md:flex", children: [_jsx("div", { className: "px-4 text-[18px] font-bold tracking-tight text-[#0B2545]", children: "SiagaKeluarga" }), _jsx("nav", { className: "mt-8 flex flex-1 flex-col gap-1", children: APP_NAV_ITEMS.map(({ to, label, icon: Icon }) => (_jsxs(NavLink, { to: to, className: ({ isActive }) => cn("flex h-[44px] items-center gap-2.5 rounded-[12px] px-4 text-[15px] transition-colors", isActive
                        ? "bg-[#F4F1EA] font-medium text-[#C2410C]"
                        : "font-normal text-[#475569] hover:bg-[#F4F1EA]/60 hover:text-[#0F172A]"), children: [_jsx(Icon, { className: "size-[18px] shrink-0", strokeWidth: 1.6 }), _jsx("span", { className: "truncate", children: label })] }, to))) }), _jsxs("div", { className: "mt-auto flex items-center gap-2.5 rounded-[14px] border border-[#E2E8F0] bg-[#F4F1EA] p-3", children: [_jsx("img", { src: "/images/avatar-budi.webp", alt: user?.nama ?? "Budi Pratama", className: "size-9 shrink-0 rounded-full object-cover" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "truncate text-[13px] font-semibold text-[#0B2545]", children: user?.nama ?? "Budi Pratama" }), _jsx("p", { className: "truncate text-[11px] text-[#475569]", children: kelurahanLabel })] }), user && (_jsx("button", { type: "button", onClick: logout, "aria-label": "Keluar dari akun", title: "Keluar", className: "flex size-7 shrink-0 items-center justify-center rounded-lg text-[#475569] transition-colors hover:bg-white hover:text-[#0F172A]", children: _jsx(LogOut, { className: "size-4", strokeWidth: 1.6 }) }))] })] }));
}
/** Bottom bar mobile untuk pengguna aplikasi di layar <768px (persis Node 464) */
export function MobileBottomNav() {
    return (_jsx("nav", { "aria-label": "Navigasi utama aplikasi", className: "fixed inset-x-0 bottom-0 z-40 flex h-[76px] items-center justify-around border-t border-[#E2E8F0] bg-white px-1.5 md:hidden", children: APP_NAV_ITEMS.slice(0, 5).map(({ to, shortLabel, icon: Icon }) => (_jsxs(NavLink, { to: to, className: ({ isActive }) => cn("flex flex-col items-center justify-center gap-1 rounded-xl px-2.5 py-1.5 text-[12px] transition-colors", isActive
                ? "font-semibold text-[#C2410C]"
                : "font-normal text-[#475569] hover:text-[#0F172A]"), children: [_jsx(Icon, { className: "size-4", strokeWidth: 1.7 }), _jsx("span", { children: shortLabel })] }, to))) }));
}
