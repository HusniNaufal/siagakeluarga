import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading)
        return null;
    if (!isAuthenticated)
        return _jsx(Navigate, { to: "/masuk", state: { from: location }, replace: true });
    return _jsx(Outlet, {});
}
export function AdminRoute() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading)
        return null;
    if (!isAuthenticated)
        return _jsx(Navigate, { to: "/masuk", state: { from: location }, replace: true });
    if (user?.role !== "ADMIN")
        return _jsx(Navigate, { to: "/beranda-saya", replace: true });
    return _jsx(Outlet, {});
}
/** Dipakai di /masuk, /daftar: kalau sudah login, jangan tampilkan form lagi. */
export function GuestRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading)
        return null;
    if (isAuthenticated)
        return _jsx(Navigate, { to: "/beranda-saya", replace: true });
    return _jsx(Outlet, {});
}
