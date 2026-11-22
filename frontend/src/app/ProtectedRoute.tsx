import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/masuk" state={{ from: location }} replace />;

  return <Outlet />;
}

export function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/masuk" state={{ from: location }} replace />;
  if (user?.role !== "ADMIN") return <Navigate to="/beranda-saya" replace />;

  return <Outlet />;
}

/** Dipakai di /masuk, /daftar: kalau sudah login, jangan tampilkan form lagi. */
export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/beranda-saya" replace />;
  return <Outlet />;
}
