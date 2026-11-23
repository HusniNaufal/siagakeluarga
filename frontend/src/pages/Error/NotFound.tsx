import { Link } from "react-router-dom";

export function NotFound() {
  return (
    /* 404 — Halaman Tidak Ditemukan (persis siagakeluarga.fig Node 4547) */
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#F1F5F9]">

      {/* Error Header (Node 4561) */}
      <header className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-3 px-6 pt-8 md:px-0">
        <Link
          to="/"
          className="text-[18px] font-semibold tracking-tight text-[#0B2545]"
        >
          SiagaKeluarga
        </Link>
        <p className="text-[13px] font-semibold text-[#9A3412]">
          Darurat Nasional 112
        </p>
      </header>

      {/* Content Card (Node 4552) */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-[600px] flex-col items-center gap-[18px] rounded-[24px] border border-[#E2E8F0] bg-white px-8 py-11 text-center md:px-12">
          <p className="text-[80px] leading-[1.28] font-normal text-[#C2410C]">
            404
          </p>
          <h1 className="text-[32px] leading-tight font-bold text-[#0B2545]">
            Halaman tidak ditemukan
          </h1>
          <p className="max-w-[480px] text-[17px] leading-[1.6] text-[#475569]">
            Halaman yang kamu cari mungkin sudah dipindahkan atau tidak tersedia.
          </p>
          <Link
            to="/"
            className="inline-flex h-[52px] items-center justify-center rounded-full bg-[#C2410C] px-7 text-[16px] font-medium text-white transition-colors hover:bg-[#A3360A]"
          >
            Kembali ke beranda
          </Link>

          {/* Akses Cepat (Node 4558) */}
          <div className="w-full rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] px-[18px] py-[14px] text-center">
            <p className="text-[13px] font-semibold text-[#0B2545]">
              Tautan cepat kesiapsiagaan
            </p>
            <p className="mt-1.5 text-[12px] text-[#475569]">
              <Link to="/panduan" className="hover:underline">
                Panduan Bencana BNPB
              </Link>
              ,{" "}
              <Link to="/rencana" className="hover:underline">
                Rencana Darurat Keluarga
              </Link>
              , dan{" "}
              <Link to="/risiko" className="hover:underline">
                Prakiraan Cuaca BMKG
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
