import { Link } from "react-router-dom";
import { TopoBackground } from "@/components/layout/TopoBackground";

const LINKS = [
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "/panduan", label: "Panduan bencana" },
  { href: "#data-bmkg", label: "Data BMKG" },
  { href: "/masuk", label: "Masuk" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0B2545] px-6 py-24 text-white md:px-[100px]">
      <TopoBackground variant="dark" />

      <div className="relative z-10 mx-auto max-w-[1240px]">
        <p className="text-[36px] font-bold tracking-[-0.025em] text-[#F5F5F4]">
          SiagaKeluarga
        </p>

        <div className="mt-10 flex flex-wrap gap-12">
          <div>
            <p className="text-[32px] font-semibold text-[#FB923C]">5 Bencana</p>
            <p className="mt-1 text-[12px] text-[#94A3B8]">
              Banjir, Gempa, Longsor, Cuaca, Tsunami
            </p>
          </div>
          <div>
            <p className="text-[32px] font-semibold text-white">Tiap 3 Jam</p>
            <p className="mt-1 text-[12px] text-[#94A3B8]">
              Pembaruan otomatis data cuaca
            </p>
          </div>
        </div>

        <nav className="mt-10 flex flex-wrap gap-10 text-[15px] text-[#9AA4B2]">
          {LINKS.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-2 text-[13px] text-[#9AA4B2] md:flex-row md:justify-between">
            <p>Data cuaca BMKG &amp; data bencana BNPB, IT RUSH 2026</p>
            <p>Dayeuhkolot, Kab. Bandung, 21 Nov 2026, 14:00 WIB</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
