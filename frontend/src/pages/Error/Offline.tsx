import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { GrafisRumah } from "@/components/ui/Grafis";

export function Offline() {
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!retrying) return;
    const t = setTimeout(() => {
      window.location.reload();
    }, 600);
    return () => clearTimeout(t);
  }, [retrying]);

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
          <h1 className="t-h2 text-ink">Tidak ada koneksi</h1>
          <p className="t-lead mt-4 text-ink-3">
            Periksa koneksi internetmu lalu coba lagi. Aplikasi ini belum bisa dipakai tanpa
            internet. Cetak atau simpan rencana darurat sebagai PDF selagi online, dan simpan
            nomor darurat di ponselmu.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setRetrying(true)}
            disabled={retrying}
            className="inline-flex h-14 items-center justify-center rounded-full bg-accent-dark px-8 text-[17px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {retrying ? "Mencoba lagi..." : "Coba lagi"}
          </button>
          <Link
            to="/"
            className="inline-flex h-14 items-center justify-center rounded-full border border-line bg-base px-8 text-[17px] font-semibold text-ink transition-colors hover:bg-tint"
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
