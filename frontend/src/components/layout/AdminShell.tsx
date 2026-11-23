import { PageTransition } from "@/components/motion/PageTransition";
import { Link, NavLink, Outlet } from "react-router-dom";
import { BookOpen, AlertTriangle, MapPin, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/admin/panduan", label: "Panduan", icon: BookOpen },
  { to: "/admin/zona-bahaya", label: "Zona bahaya", icon: AlertTriangle },
  { to: "/admin/titik-kumpul", label: "Titik kumpul", icon: MapPin },
];

export function AdminShell() {
  const { user, logout } = useAuth();
  const inisial = (user?.nama ?? "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-line bg-base px-4 py-8 md:flex">
        <Link to="/admin/panduan" aria-label="SiagaKeluarga, admin" className="px-2">
          <Logo />
        </Link>

        <nav aria-label="Navigasi admin" className="mt-8 flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] transition-colors",
                  isActive
                    ? "bg-tint font-semibold text-ink"
                    : "font-normal text-ink-3 hover:bg-surface hover:text-ink",
                )
              }
            >
              <Icon className="size-[18px] shrink-0" strokeWidth={1.6} />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-base text-[14px] font-semibold text-ink"
          >
            {inisial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-ink">{user?.nama || "Admin"}</p>
            <p className="truncate text-[13px] text-ink-3">Pengelola data</p>
          </div>
          {user && (
            <button
              type="button"
              onClick={logout}
              aria-label="Keluar dari akun"
              title="Keluar"
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-base hover:text-ink"
            >
              <LogOut className="size-[18px]" strokeWidth={1.6} />
            </button>
          )}
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-line bg-base px-4 md:hidden">
          <Link to="/admin/panduan" aria-label="SiagaKeluarga, admin">
            <Logo />
          </Link>
          {user && (
            <button
              type="button"
              onClick={logout}
              aria-label="Keluar dari akun"
              className="flex size-11 items-center justify-center rounded-full text-ink-3 hover:bg-tint hover:text-ink"
            >
              <LogOut className="size-[18px]" strokeWidth={1.7} />
            </button>
          )}
        </header>

        <main className="relative z-10 min-w-0 flex-1 px-5 py-7 pb-28 md:px-12 md:py-10 md:pb-10">
          <div className="mx-auto max-w-[1104px]">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>

        <nav
          aria-label="Navigasi admin seluler"
          className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-base px-1 pb-[env(safe-area-inset-bottom)] md:hidden"
        >
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "relative flex min-h-[60px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[12px] transition-colors",
                  isActive ? "bg-tint font-semibold text-ink" : "font-normal text-ink-3 hover:text-ink",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span aria-hidden="true" className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-accent-dark" />
                  )}
                  <Icon className="size-5 shrink-0" strokeWidth={1.7} />
                  <span className="max-w-full truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
