import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, AlertTriangle, MapPin, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { TopoBackground } from "@/components/layout/TopoBackground";
import { cn } from "@/lib/utils";
const NAV_ITEMS = [
    { to: "/admin/panduan", label: "Panduan", icon: BookOpen },
    { to: "/admin/zona-bahaya", label: "Zona bahaya", icon: AlertTriangle },
    { to: "/admin/titik-kumpul", label: "Titik kumpul", icon: MapPin },
];
export function AdminShell() {
    const { user, logout } = useAuth();
    return (_jsxs("div", { className: "flex min-h-screen bg-[#F4F1EA]", children: [_jsxs("aside", { className: "sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-[#E2E8F0] bg-white px-4 py-8 md:flex", children: [_jsx("div", { className: "px-4 text-[18px] font-bold tracking-tight text-[#0B2545]", children: "SiagaKeluarga" }), _jsx("nav", { className: "mt-8 flex flex-1 flex-col gap-1", children: NAV_ITEMS.map(({ to, label, icon: Icon }) => (_jsxs(NavLink, { to: to, className: ({ isActive }) => cn("flex h-[44px] items-center gap-2.5 rounded-[12px] px-4 text-[15px] transition-colors", isActive
                                ? "bg-[#F4F1EA] font-medium text-[#C2410C]"
                                : "font-normal text-[#475569] hover:bg-[#F4F1EA]/60 hover:text-[#0F172A]"), children: [_jsx(Icon, { className: "size-[18px]", strokeWidth: 1.6 }), label] }, to))) }), _jsxs("div", { className: "mt-auto flex items-center gap-2.5 rounded-[14px] border border-[#E2E8F0] bg-[#F4F1EA] p-3", children: [_jsx("div", { className: "flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0B2545] text-[12px] font-semibold text-white", children: "AD" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "truncate text-[13px] font-semibold text-[#0B2545]", children: user?.nama || "Admin BPBD" }), _jsx("p", { className: "truncate text-[11px] text-[#475569]", children: "Kab. Bandung" })] }), user && (_jsx("button", { type: "button", onClick: logout, "aria-label": "Keluar", className: "flex size-7 shrink-0 items-center justify-center rounded-lg text-[#475569] hover:bg-white hover:text-[#0F172A]", children: _jsx(LogOut, { className: "size-4", strokeWidth: 1.6 }) }))] })] }), _jsxs("div", { className: "relative flex min-w-0 flex-1 flex-col", children: [_jsx(TopoBackground, { variant: "warm" }), _jsx("main", { className: "relative z-10 min-w-0 flex-1 px-5 py-7 md:px-12 md:py-10", children: _jsx("div", { className: "mx-auto max-w-[1104px]", children: _jsx(Outlet, {}) }) })] })] }));
}
