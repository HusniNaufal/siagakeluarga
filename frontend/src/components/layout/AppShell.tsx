import { Link, Outlet } from "react-router-dom";
import { Award, LogOut } from "lucide-react";
import { Sidebar, MobileBottomNav } from "@/components/layout/Sidebar";
import { TopoBackground } from "@/components/layout/TopoBackground";
import { useAuth } from "@/context/AuthContext";

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-warm">
      <Sidebar />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <TopoBackground variant="warm" />

        {/* Header ringkas khusus mobile */}
        <header className="relative z-10 flex h-14 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur-md md:hidden">
          <Link to="/beranda-saya" className="text-base font-bold tracking-tight text-[#0B2545]">
            SiagaKeluarga
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/latihan"
              className="inline-flex items-center gap-1.5 rounded-full bg-warm px-3 py-1.5 text-xs font-medium text-accent-dark"
            >
              <Award className="size-3.5" />
              Latihan
            </Link>
            {user && (
              <button
                type="button"
                onClick={logout}
                aria-label="Keluar"
                className="flex size-8 items-center justify-center rounded-full text-ink-3 hover:bg-warm hover:text-ink"
              >
                <LogOut className="size-4" />
              </button>
            )}
          </div>
        </header>

        <main className="relative z-10 min-w-0 flex-1 px-5 py-7 pb-24 md:px-12 md:py-10 md:pb-12">
          <div className="mx-auto max-w-[1104px]">
            <Outlet />
          </div>
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
}
