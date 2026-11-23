import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { CaraKerja } from "@/components/sections/CaraKerja";
import { Fitur } from "@/components/sections/Fitur";
import { DataBmkgLive } from "@/components/sections/DataBmkgLive";
import { Penutup } from "@/components/sections/Penutup";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";

export function Beranda() {
  return (
    <div className="min-h-svh bg-paper text-ink">
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
    </div>
  );
}
