import { Link, NavLink } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  Backpack,
  CloudLightning,
  MessageCircle,
  Award,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useHousehold } from "@/hooks/useHousehold";
import { Logo } from "@/components/brand/Logo";
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

/** Lima tujuan utama untuk bottom bar. Keluarga dan Latihan ada di header ponsel (AppShell). */
const MOBILE_NAV = APP_NAV_ITEMS.filter((i) =>
  ["/beranda-saya", "/rencana", "/tas-siaga", "/risiko", "/tanya"].includes(i.to),
);

export function Sidebar() {
  const { user, logout } = useAuth();
  const { data: household } = useHousehold();
  const kelurahanLabel = household?.region?.kecamatan
    ? `Kec. ${household.region.kecamatan}`
    : "Lokasi belum diisi";

  return (
    <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-line bg-base px-4 py-8 md:flex">
      <Link to="/beranda-saya" aria-label="SiagaKeluarga, beranda saya" className="px-2">
        <Logo />
      </Link>

      <nav aria-label="Navigasi utama aplikasi" className="mt-8 flex flex-1 flex-col gap-1">
        {APP_NAV_ITEMS.map(({ to, label, icon: Icon }) => (
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
          {(user?.nama ?? "?")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => s[0]?.toUpperCase())
            .join("")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-ink">{user?.nama ?? "Tamu"}</p>
          <p className="truncate text-[13px] text-ink-3">{kelurahanLabel}</p>
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
  );
}

/** Bottom bar ponsel (di bawah 768px). Item aktif ditandai latar, teks tebal, dan garis atas, bukan warna saja. */
export function MobileBottomNav() {
  return (
    <nav
      aria-label="Navigasi utama aplikasi seluler"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-base px-1 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {MOBILE_NAV.map(({ to, shortLabel, icon: Icon }) => (
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
              <span className="max-w-full truncate">{shortLabel}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
