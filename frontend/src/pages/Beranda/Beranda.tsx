import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { CaraKerja } from "@/components/sections/CaraKerja";
import { Fitur } from "@/components/sections/Fitur";
import { DataBmkgLive } from "@/components/sections/DataBmkgLive";
import { Penutup } from "@/components/sections/Penutup";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { TanyaWidget } from "@/components/ai/TanyaWidget";
import { TopoBackground } from "@/components/layout/TopoBackground";

export function Beranda() {
  return (
    <div className="relative min-h-svh bg-paper text-ink selection:bg-accent-soft selection:text-accent-hover">
      {/* Latar kontur topografi & gradien lembut khas kesiapsiagaan bencana */}
      <TopoBackground variant="light" className="fixed inset-0 opacity-[0.22] pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(194,65,12,0.05),transparent_70%)]" />

      {/* Di luar Hero: Hero membuat lapisan tumpukan sendiri, jadi navbar di dalamnya bisa tertutup section di bawahnya. */}
      <PublicNavbar placement="fixed" />
      <Hero />
      <Stats />
      <CaraKerja />
      <Fitur />
      <DataBmkgLive />
      <Penutup />
      <Faq />
      <Footer />
      <TanyaWidget />
    </div>
  );
}
