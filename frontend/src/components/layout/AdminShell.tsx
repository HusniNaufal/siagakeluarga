import { PageTransition } from "@/components/motion/PageTransition";
import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, AlertTriangle, MapPin, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/admin/panduan", label: "Panduan", icon: BookOpen },
  { to: "/admin/zona-bahaya", label: "Zona bahaya", icon: AlertTriangle },
  { to: "/admin/titik-kumpul", label: "Titik kumpul", icon: MapPin },
];

export function AdminShell() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-[#E2E8F0] bg-white px-4 py-8 md:flex">
        <div className="px-4 text-[18px] font-bold tracking-tight text-[#0B2545]">
          SiagaKeluarga
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex h-[44px] items-center gap-2.5 rounded-[12px] px-4 text-[15px] transition-colors",
                  isActive
                    ? "bg-[#F1F5F9] font-medium text-[#C2410C]"
                    : "font-normal text-[#475569] hover:bg-[#F1F5F9]/60 hover:text-[#0B2545]",
                )
              }
            >
              <Icon className="size-[18px]" strokeWidth={1.6} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-2.5 rounded-[14px] border border-[#E2E8F0] bg-[#F1F5F9] p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0B2545] text-[12px] font-semibold text-white">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-[#0B2545]">
              {user?.nama || "Admin BPBD"}
            </p>
            <p className="truncate text-[11px] text-[#475569]">Kab. Bandung</p>
          </div>
          {user && (
            <button
              type="button"
              onClick={logout}
              aria-label="Keluar"
              className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#475569] hover:bg-white hover:text-[#0B2545]"
            >
              <LogOut className="size-4" strokeWidth={1.6} />
            </button>
          )}
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <main className="relative z-10 min-w-0 flex-1 px-5 py-7 md:px-12 md:py-10">
          <div className="mx-auto max-w-[1104px]">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
