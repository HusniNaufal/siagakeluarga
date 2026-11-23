import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { Bukit } from "@/components/ui/Grafis";

const COLUMNS = [
  {
    title: "Produk",
    links: [
      { href: "/#cara-kerja", label: "Cara kerja" },
      { href: "/#fitur", label: "Panduan bencana" },
      { href: "/#data-bmkg", label: "Contoh cuaca" },
    ],
  },
  {
    title: "Akun",
    links: [
      { href: "/masuk", label: "Masuk" },
      { href: "/daftar", label: "Daftar" },
      { href: "/panduan", label: "Semua panduan" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-night text-white">
      <Bukit className="absolute inset-x-0 top-0 -translate-y-[calc(100%-1px)]" />
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo tone="white" />
            <p className="mt-5 max-w-[38ch] text-[15px] leading-[1.65] text-mist">
              Rencana darurat keluarga untuk banjir, gempa, longsor, cuaca
              ekstrem, dan tsunami.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[14px] text-mist">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    {link.href.includes("#") ? (
                      <a href={link.href} className="text-[16px] text-white/90 hover:text-white">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-[16px] text-white/90 hover:text-white">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[13px] leading-[1.6] text-mist md:flex-row md:items-center md:justify-between">
          <p>
            Data cuaca: BMKG. Data bencana: BNPB. Foto: Iqro Rinaldi dan Haikal Vivar di Unsplash.
            Saat kejadian, arahan petugas di tempat lebih utama daripada halaman ini.
          </p>
          <p className="shrink-0">IT RUSH 2026</p>
        </div>
      </div>
    </footer>
  );
}
