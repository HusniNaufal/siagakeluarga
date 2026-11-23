import { PageTransition } from "@/components/motion/PageTransition";
import { Outlet } from "react-router-dom";
import { PublicNavbar } from "@/components/layout/PublicNavbar";

export function PublicShell() {
  return (
    <div className="min-h-screen bg-base">
      <PublicNavbar />
      <PageTransition>
              <Outlet />
            </PageTransition>
    </div>
  );
}
