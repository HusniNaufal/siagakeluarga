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
    <div>
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
