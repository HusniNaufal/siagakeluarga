import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { GrafisRumah } from "@/components/ui/Grafis";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="mx-auto w-full max-w-[1240px] px-6 pt-8">
        <Link to="/" aria-label="SiagaKeluarga, beranda" className="inline-block">
          <Logo />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col items-center justify-center gap-10 px-6 py-12 text-center">
        <GrafisRumah className="w-[220px] md:w-[280px]" />
        <div className="max-w-[560px]">
          <h1 className="t-h2 text-ink">Halaman tidak ditemukan</h1>
          <p className="t-lead mt-4 text-ink-3">
            Halaman yang kamu cari mungkin sudah dipindahkan atau alamatnya salah.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-14 items-center justify-center rounded-full bg-accent-dark px-8 text-[17px] font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Kembali ke beranda
          </Link>
          <a
            href="tel:112"
            className="inline-flex h-14 items-center justify-center rounded-full border border-line bg-base px-8 text-[17px] font-semibold text-ink transition-colors hover:bg-tint"
          >
            Darurat nasional: telepon 112
          </a>
        </div>
      </main>
    </div>
  );
}
