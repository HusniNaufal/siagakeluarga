import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#fitur", label: "Fitur" },
  { href: "/panduan", label: "Panduan" },
  { href: "#data-bmkg", label: "Data BMKG" },
];

/**
 * Navbar kartu melayang (persis siagakeluarga.fig Node 482 untuk terang & Node 540 untuk gelap #13345D).
 */
export function PublicNavbar({ dark = false }: { dark?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex flex-col items-center px-4 md:top-8 md:px-5">
      <div
        className={cn(
          "flex h-[72px] w-full max-w-[1240px] items-center justify-between rounded-[20px] pr-3 pl-7 transition-all duration-300",
          dark
            ? "border border-white/10 bg-[#13345D] text-[#F5F5F4]"
            : scrolled
              ? "border border-[#E2E8F0] bg-white/95 text-[#0F172A] shadow-[0_10px_30px_rgba(11,37,69,0.08)] backdrop-blur-md"
              : "bg-white text-[#0F172A] shadow-[0_10px_30px_rgba(11,37,69,0.08)]",
        )}
      >
        <Link
          to="/"
          className={cn(
            "text-[18px] font-semibold tracking-[-0.01em] transition-colors",
            dark ? "text-[#F5F5F4]" : "text-[#0B2545]",
          )}
        >
          SiagaKeluarga
        </Link>

        <nav className="hidden items-center gap-8 text-[15px] font-normal md:flex">
          {LINKS.map((link) => {
            const isActive =
              link.href === "/panduan" && location.pathname.startsWith("/panduan");
            return link.href.startsWith("#") && location.pathname === "/" ? (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors",
                  dark
                    ? "text-[#9AA4B2] hover:text-white"
                    : "text-[#475569] hover:text-[#0B2545]",
                )}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href.startsWith("#") ? `/${link.href}` : link.href}
                className={cn(
                  "transition-colors",
                  isActive
                    ? "font-semibold text-[#C2410C]"
                    : dark
                      ? "text-[#9AA4B2] hover:text-white"
                      : "text-[#475569] hover:text-[#0B2545]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            to="/daftar"
            className="flex h-[44px] items-center justify-center rounded-full bg-[#C2410C] px-5 text-[15px] font-semibold text-white transition-all duration-150 hover:scale-[1.02] hover:bg-[#9A3412]"
          >
            Buat rencana
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className={cn(
              "flex size-10 items-center justify-center rounded-xl transition-colors md:hidden",
              dark
                ? "text-white hover:bg-white/10"
                : "text-[#0B2545] hover:bg-[#F4F1EA]",
            )}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Drawer menu mobile */}
      {mobileOpen && (
        <div className="mt-2 w-full max-w-[1240px] rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_50px_rgba(11,37,69,0.16)] md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) =>
              link.href.startsWith("#") && location.pathname === "/" ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-[15px] font-medium text-[#0F172A] transition-colors hover:bg-[#F4F1EA]"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href.startsWith("#") ? `/${link.href}` : link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-[15px] font-medium text-[#0F172A] transition-colors hover:bg-[#F4F1EA]"
                >
                  {link.label}
                </Link>
              ),
            )}
            <div className="my-2 h-px bg-[#E2E8F0]" />
            <Link
              to="/masuk"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-[15px] font-medium text-[#475569] transition-colors hover:bg-[#F4F1EA]"
            >
              Masuk ke akun
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
