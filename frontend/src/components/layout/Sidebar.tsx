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

export function Sidebar() {
  const { user, logout } = useAuth();
  const { data: household } = useHousehold();
  const kelurahanLabel = household?.region?.kecamatan
    ? `Kec. ${household.region.kecamatan}`
    : "Lokasi belum diisi";

  return (
    <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-[#E2E8F0] bg-white px-4 py-8 md:flex">
      <Link to="/beranda-saya" aria-label="SiagaKeluarga, beranda saya" className="px-2">
        <Logo />
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {APP_NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center gap-3 rounded-[10px] px-3 text-[15px] transition-colors",
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

      {/* Kartu profil bawah sesuai siagakeluarga.fig Node 1850 */}
      <div className="mt-auto flex items-center gap-2.5 rounded-[14px] border border-[#E2E8F0] bg-[#F1F5F9] p-3">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-semibold text-[#0B2545]"
        >
          {(user?.nama ?? "?")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => s[0]?.toUpperCase())
            .join("")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-[#0B2545]">
            {user?.nama ?? "Tamu"}
          </p>
          <p className="truncate text-[11px] text-[#475569]">{kelurahanLabel}</p>
        </div>
        {user && (
          <button
            type="button"
            onClick={logout}
            aria-label="Keluar dari akun"
            title="Keluar"
            className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#475569] transition-colors hover:bg-white hover:text-[#0B2545]"
          >
            <LogOut className="size-4" strokeWidth={1.6} />
          </button>
        )}
      </div>
    </aside>
  );
}

/** Bottom bar mobile untuk pengguna aplikasi di layar <768px (persis Node 464) */
export function MobileBottomNav() {
  return (
    <nav
      aria-label="Navigasi utama aplikasi"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[76px] items-center justify-around border-t border-[#E2E8F0] bg-white px-1.5 md:hidden"
    >
      {APP_NAV_ITEMS.slice(0, 5).map(({ to, shortLabel, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl px-2.5 py-1.5 text-[12px] transition-colors",
              isActive
                ? "font-semibold text-[#C2410C]"
                : "font-normal text-[#475569] hover:text-[#0B2545]",
            )
          }
        >
          <Icon className="size-4" strokeWidth={1.7} />
          <span>{shortLabel}</span>
        </NavLink>
      ))}
    </nav>
  );
}
