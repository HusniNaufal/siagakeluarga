import { useState } from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { Link, Outlet } from "react-router-dom";
import { Award, Users } from "lucide-react";
import { Sidebar, MobileBottomNav } from "@/components/layout/Sidebar";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";
import { TanyaWidget } from "@/components/ai/TanyaWidget";
import { TopoBackground } from "@/components/layout/TopoBackground";
import { ProfileModal } from "@/components/profile/ProfileModal";

export function AppShell() {
  const { user } = useAuth();
  const [showMobileProfile, setShowMobileProfile] = useState(false);

  return (
    <div className="relative min-h-screen bg-paper text-ink">
      {/* Topographic Relief Background khas SiagaKeluarga */}
      <TopoBackground variant="light" className="fixed inset-0 opacity-[0.35] pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_50%_at_50%_-10%,rgba(194,65,12,0.04),transparent_70%)]" />

      <Sidebar />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col md:pl-[250px]">
        {/* Header ringkas khusus ponsel. Keluarga dan Latihan ada di sini karena bottom bar hanya muat lima tujuan. */}
        <header className="relative z-10 flex h-16 items-center justify-between border-b border-line bg-base px-4 md:hidden">
          <Link to="/beranda-saya" aria-label="SiagaKeluarga, beranda saya">
            <Logo />
          </Link>
          <div className="flex items-center gap-1">
            <Link
              to="/keluarga"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[14px] font-medium text-ink-3 hover:bg-tint hover:text-ink"
            >
              <Users className="size-4" strokeWidth={1.7} />
              Keluarga
            </Link>
            <Link
              to="/latihan"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[14px] font-medium text-ink-3 hover:bg-tint hover:text-ink"
            >
              <Award className="size-4" strokeWidth={1.7} />
              Latihan
            </Link>
            {user && (
              <button
                type="button"
                onClick={() => setShowMobileProfile(true)}
                aria-label="Buka profil"
                title="Buka profil"
                className="flex size-9 items-center justify-center rounded-full bg-tint text-[13px] font-semibold text-ink transition-colors hover:bg-surface cursor-pointer shadow-xs"
              >
                {(user.nama ?? "?")
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((s) => s[0]?.toUpperCase())
                  .join("")}
              </button>
            )}
          </div>
        </header>

        <ProfileModal isOpen={showMobileProfile} onClose={() => setShowMobileProfile(false)} />

        <main className="app-main relative z-10 min-w-0 flex-1 px-5 py-7 pb-28 md:px-12 md:py-10 md:pb-12">
          <div className="mx-auto max-w-[1104px]">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>

        <MobileBottomNav />
        <TanyaWidget />
      </div>
    </div>
  );
}
