import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
export function PublicShell() {
    return (_jsxs("div", { className: "min-h-screen bg-base", children: [_jsx(PublicNavbar, {}), _jsx(Outlet, {})] }));
}
