import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";

const LINKS = [
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#fitur", label: "Fitur" },
  { href: "/panduan", label: "Panduan" },
  { href: "#data-bmkg", label: "Cuaca" },
];

interface PublicNavbarProps {
  /** "fixed" melayang di atas hero, "flow" menempel di atas halaman biasa. */
  placement?: "fixed" | "flow";
}

/**
 * Bar selalu solid (putih), tidak transparan: di atas foto terang maupun gelap kontrasnya tetap sama,
 * jadi tidak pernah tenggelam. Tidak ada varian gelap yang harus ditebak dari posisi scroll.
 */
export function PublicNavbar({ placement = "flow" }: PublicNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const floating = placement === "fixed";

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/panduan" ? location.pathname.startsWith("/panduan") : false;

  return (
    <>
      <header
        className={cn(
          "z-50 w-full",
          floating
            ? "fixed inset-x-0 top-0 px-4 pt-3 md:pt-5"
            : "sticky top-0 border-b border-line bg-paper/95 backdrop-blur-md",
        )}
      >
        <div
          className={cn(
            "mx-auto flex h-14 max-w-[1240px] items-center justify-between gap-4",
            floating &&
              "rounded-[18px] border border-line bg-white pr-2 pl-4 shadow-[0_10px_30px_-12px_rgba(6,11,20,0.45)]",
          )}
        >
          <Link to="/" aria-label="SiagaKeluarga, beranda" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Utama">
            {LINKS.map((link) => {
              const active = isActive(link.href);
              const className = cn(
                "rounded-full px-3.5 py-2 text-[15px] transition-colors",
                active
                  ? "bg-tint font-semibold text-ink"
                  : "text-ink-3 hover:bg-tint hover:text-ink",
              );

              if (link.href.startsWith("#") && location.pathname === "/") {
                return (
                  <a key={link.href} href={link.href} className={className}>
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.href}
                  to={link.href.startsWith("#") ? `/${link.href}` : link.href}
                  className={className}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              to="/masuk"
              className="hidden h-10 items-center rounded-full px-3.5 text-[15px] font-medium text-ink-3 transition-colors hover:text-ink md:inline-flex"
            >
              Masuk
            </Link>
            <Link
              to="/daftar"
              className="inline-flex h-10 items-center rounded-full bg-accent-dark px-4 text-[15px] font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-accent-hover active:scale-[0.99]"
            >
              Buat rencana
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileOpen}
              className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-tint md:hidden"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-white md:hidden">
          <div className="flex h-20 items-center justify-between px-5">
            <Logo />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Tutup menu"
              className="inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-tint"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 pt-4 pb-8" aria-label="Menu seluler">
            {LINKS.map((link) =>
              link.href.startsWith("#") && location.pathname === "/" ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-4 py-4 text-[19px] font-medium text-ink hover:bg-tint"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href.startsWith("#") ? `/${link.href}` : link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-4 py-4 text-[19px] font-medium text-ink hover:bg-tint"
                >
                  {link.label}
                </Link>
              ),
            )}
            <div className="mt-auto space-y-3 pt-8">
              <Link
                to="/daftar"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-full bg-accent-dark px-6 py-4 text-[17px] font-semibold text-white"
              >
                Buat rencana gratis
              </Link>
              <Link
                to="/masuk"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-full border border-line px-6 py-4 text-[17px] font-semibold text-ink"
              >
                Masuk
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
