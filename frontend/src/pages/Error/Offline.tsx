import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    /* Error Koneksi (persis siagakeluarga.fig Node 4564) */
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#F1F5F9]">

      {/* Error Header (Node 4581) */}
      <header className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-3 px-6 pt-8 md:px-0">
        <Link
          to="/"
          className="text-[18px] font-semibold tracking-tight text-[#0B2545]"
        >
          SiagaKeluarga
        </Link>
        <p className="text-[13px] font-semibold text-[#9A3412]">
          Mode Luring | Darurat Nasional 112
        </p>
      </header>

      {/* Content Card (Node 4569) */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-[600px] flex-col items-center gap-[18px] rounded-[24px] border border-[#E2E8F0] bg-white px-8 py-11 text-center md:px-12">
          {/* Icon Lingkaran Merah Tanda Seru (Node 4570) */}
          <div className="flex size-[72px] items-center justify-center rounded-full border-2 border-[#DC2626]">
            <div className="flex flex-col items-center gap-1.5">
              <span className="h-5 w-0.5 rounded-full bg-[#DC2626]" />
              <span className="size-1 rounded-full bg-[#DC2626]" />
            </div>
          </div>

          <h1 className="text-[32px] leading-tight font-bold text-[#0B2545]">
            Tidak ada koneksi
          </h1>
          <p className="max-w-[480px] text-[17px] leading-[1.6] text-[#475569]">
            Periksa koneksi internetmu. Rencana darurat tersimpan tetap bisa dibuka tanpa internet.
          </p>
          <button
            type="button"
            onClick={() => setRetrying(true)}
            disabled={retrying}
            className="inline-flex h-[52px] items-center justify-center rounded-full bg-[#C2410C] px-7 text-[16px] font-medium text-white transition-colors hover:bg-[#A3360A] disabled:opacity-60"
          >
            {retrying ? "Mencoba lagi..." : "Coba lagi"}
          </button>

          {/* Akses Luring (Node 4578) */}
          <div className="w-full rounded-[12px] border border-[#FDBA74] bg-[#FFF7ED] px-[18px] py-[14px] text-center">
            <p className="text-[13px] font-semibold text-[#9A3412]">
              Saat sinyal hilang
            </p>
            <p className="mt-1.5 text-[12px] text-[#475569]">
              Halaman ini belum bisa dibuka tanpa internet. Cetak atau simpan rencana sebagai PDF
              sebelum bencana, dan simpan nomor darurat di ponselmu.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
