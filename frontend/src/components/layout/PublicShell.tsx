import { PageTransition } from "@/components/motion/PageTransition";
import { Outlet } from "react-router-dom";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { TanyaWidget } from "@/components/ai/TanyaWidget";
import { TopoBackground } from "@/components/layout/TopoBackground";

export function PublicShell() {
  return (
    <div className="relative min-h-screen bg-paper text-ink overflow-x-hidden">
      <TopoBackground variant="light" className="fixed inset-0 opacity-[0.22] pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(194,65,12,0.05),transparent_70%)]" />

      <PublicNavbar />
      <div className="relative z-10">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>
      <TanyaWidget />
    </div>
  );
}
