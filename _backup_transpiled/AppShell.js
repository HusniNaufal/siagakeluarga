import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, Outlet } from "react-router-dom";
import { Award, LogOut } from "lucide-react";
import { Sidebar, MobileBottomNav } from "@/components/layout/Sidebar";
import { TopoBackground } from "@/components/layout/TopoBackground";
import { useAuth } from "@/context/AuthContext";
export function AppShell() {
    const { user, logout } = useAuth();
    return (_jsxs("div", { className: "flex min-h-screen bg-warm", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "relative flex min-w-0 flex-1 flex-col", children: [_jsx(TopoBackground, { variant: "warm" }), _jsxs("header", { className: "relative z-10 flex h-14 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur-md md:hidden", children: [_jsx(Link, { to: "/beranda-saya", className: "text-base font-bold tracking-tight text-[#0B2545]", children: "SiagaKeluarga" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Link, { to: "/latihan", className: "inline-flex items-center gap-1.5 rounded-full bg-warm px-3 py-1.5 text-xs font-medium text-accent-dark", children: [_jsx(Award, { className: "size-3.5" }), "Latihan"] }), user && (_jsx("button", { type: "button", onClick: logout, "aria-label": "Keluar", className: "flex size-8 items-center justify-center rounded-full text-ink-3 hover:bg-warm hover:text-ink", children: _jsx(LogOut, { className: "size-4" }) }))] })] }), _jsx("main", { className: "relative z-10 min-w-0 flex-1 px-5 py-7 pb-24 md:px-12 md:py-10 md:pb-12", children: _jsx("div", { className: "mx-auto max-w-[1104px]", children: _jsx(Outlet, {}) }) }), _jsx(MobileBottomNav, {})] })] }));
}
