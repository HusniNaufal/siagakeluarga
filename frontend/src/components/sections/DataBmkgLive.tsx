import { useState } from "react";
import { CloudRain, LocateFixed, MapPin, Search } from "lucide-react";
import { StatusMark } from "@/components/ui/StatusMark";
import { Gelombang } from "@/components/ui/Grafis";
import { EmptyIllustration } from "@/components/ui/EmptyIllustration";
import type { ReactNode } from "react";
import { ApiError } from "@/lib/api";
import { jamDari, namaHari, useCuaca, type CuacaData } from "@/hooks/useCuaca";
import { useLokasi, type LokasiStatus } from "@/hooks/useLokasi";
import { motion } from "motion/react";
import { useReveal } from "@/components/motion/Reveal";
import { useCariLokasi } from "@/hooks/useCariLokasi";

type Tersedia = Extract<CuacaData["cuaca"], { tersedia: true }>;

const STATUS = {
  aman: {
    judul: "Tidak ada hujan deras dalam 24 jam ke depan",
    isi: "Tetap cek lagi nanti. Prakiraan diperbarui tiap beberapa jam.",
  },
  waspada: {
    judul: "Hujan cukup deras diperkirakan",
    isi: "Waspada berarti bersiap: cek tas siaga dan jalur ke titik kumpul. Belum berarti harus mengungsi.",
  },
  bahaya: {
    judul: "Hujan sangat deras atau petir diperkirakan",
    isi: "Ikuti arahan BPBD dan petugas di tempatmu. Halaman ini bukan peringatan dini resmi.",
  },
} as const;

function lokasiCatatan(status: LokasiStatus) {
  switch (status) {
    case "gps":
      return "Memakai lokasimu saat ini.";
    case "dipilih":
      return "Memakai tempat yang kamu pilih.";
    case "meminta":
      return "Menunggu izin lokasi…";
    case "ditolak":
      return "Izin lokasi ditolak. Kamu bisa mencari nama tempatnya, atau mengizinkan lokasi lewat pengaturan situs di browser.";
    case "gagal":
      return "Lokasimu belum bisa dibaca. Coba cari nama tempatnya.";
    case "tidak-didukung":
      return "Browser ini tidak mendukung pembacaan lokasi. Cari nama tempatnya.";
    default:
      return "Belum ada lokasi. Pakai lokasimu atau cari tempatnya.";
  }
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[24px] border border-white/10 bg-storm p-6 ${className}`}>{children}</div>;
}

function Skeleton() {
  return (
    <div className="mt-12 grid gap-4 lg:grid-cols-[1.4fr_1fr]" aria-busy="true" aria-live="polite">
      <span className="sr-only">Memuat prakiraan cuaca dari BMKG…</span>
      <div className="h-[330px] animate-pulse rounded-[28px] bg-storm" />
      <div className="grid gap-4">
        <div className="h-[158px] animate-pulse rounded-[24px] bg-storm-2" />
        <div className="h-[158px] animate-pulse rounded-[24px] bg-storm-2" />
      </div>
    </div>
  );
}

function Hujan({ data }: { data: Tersedia }) {
  const jendela = data.prakiraan.slice(0, 8);
  // Skala minimal 10 mm supaya hujan ringan tidak tampak seperti banjir.
  const maks = Math.max(10, ...jendela.map((e) => e.curah_hujan_mm));
  const puncak = jendela.reduce((a, b) => (b.curah_hujan_mm > a.curah_hujan_mm ? b : a), jendela[0]);
  const TINGGI = 132;

  return (
    <Panel className="rounded-[28px] p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[18px] font-semibold">24 jam ke depan</p>
          <p className="mt-1 text-[14px] text-mist">
            Curah hujan per 3 jam, dalam milimeter. Ini hujan, bukan tinggi air.
          </p>
        </div>
        <CloudRain className="size-6 shrink-0 text-data-blue" strokeWidth={1.6} aria-hidden="true" />
      </div>

      <ul className="mt-8 grid grid-cols-8 gap-x-1 md:gap-x-3">
        {jendela.map((e) => {
          const ada = e.curah_hujan_mm > 0;
          const aktif = e === puncak && ada;
          return (
            <li key={e.waktu_lokal} className="flex flex-col items-center">
              <div
                className="flex w-full flex-col items-center justify-end border-b border-white/25"
                style={{ height: TINGGI + 22 }}
              >
                <span
                  className={`mb-1 tabular-nums text-[13px] leading-none ${
                    aktif ? "font-semibold text-[#ffb591]" : ada ? "text-white" : "text-white/35"
                  }`}
                >
                  {e.curah_hujan_mm}
                </span>
                <div
                  className={`w-[min(60%,28px)] rounded-t-[5px] ${aktif ? "bg-siaga" : "bg-data-blue"}`}
                  style={{ height: ada ? Math.max((e.curah_hujan_mm / maks) * TINGGI, 4) : 0 }}
                />
              </div>
              <span className="mt-3 tabular-nums text-[13px] text-white">{jamDari(e.waktu_lokal)}</span>
              <span className="tabular-nums text-[12px] text-mist">{e.suhu_c}°</span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function Konten({ data }: { data: CuacaData }) {
  const { wilayah, cuaca } = data;
  const reveal = useReveal();

  if (!cuaca.tersedia) {
    return (
      <Panel className="mt-12">
        <p className="text-[18px] font-semibold">Prakiraan BMKG belum bisa dimuat</p>
        <p className="mt-2 text-[15px] leading-[1.6] text-mist">
          {cuaca.alasan}. Coba lagi beberapa saat lagi. Data lokasi yang terbaca:{" "}
          {[wilayah.desa, wilayah.kecamatan, wilayah.kotkab].filter(Boolean).join(", ")}.
        </p>
      </Panel>
    );
  }

  const s = STATUS[cuaca.status.tingkat];
  const pemicu = cuaca.status.tingkat === "aman" ? null : cuaca.status;

  return (
    <>
      <div className="mt-12 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Hujan data={cuaca} />

        <div className="grid gap-4">
          <div className="rounded-[24px] border border-white/10 bg-storm-2 p-6">
            <StatusMark tingkat={cuaca.status?.tingkat ?? "aman"} tone="gelap" />
            <p className="mt-4 text-[19px] leading-snug font-semibold">{s.judul}</p>
            {pemicu && (
              <p className="mt-2 text-[15px] text-white/90">
                {pemicu.cuaca}, sekitar pukul {jamDari(pemicu.waktu_lokal)} ({pemicu.curah_hujan_mm} mm).
              </p>
            )}
            <p className="mt-2 text-[14px] leading-[1.6] text-mist">{s.isi}</p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-storm-2 p-6">
            <p className="flex items-center gap-2 text-[14px] text-mist">
              <MapPin className="size-4 text-[#ffb591]" aria-hidden="true" />
              Saat ini di {wilayah.desa}
            </p>
            <p className="font-display mt-3 tabular-nums text-[44px] leading-none font-semibold tracking-[-0.03em]">
              {cuaca.saat_ini.suhu_c}°
              <span className="ml-3 text-[17px] font-normal tracking-normal text-white/90">
                {cuaca.saat_ini.cuaca}
              </span>
            </p>
            <p className="mt-3 text-[14px] text-mist">
              Lembap {cuaca.saat_ini.kelembapan ?? "–"}% · Angin {cuaca.saat_ini.kecepatan_angin_kmj ?? "–"} km/jam
            </p>
          </div>
        </div>
      </div>

      <ul className="mt-4 grid gap-4 md:grid-cols-3">
        {cuaca.harian.map((hari, i) => (
          <motion.li
            {...reveal(i)}
            key={hari.tanggal}
            className={i === 0 ? "rounded-[24px] bg-white p-6 text-ink" : "rounded-[24px] border border-white/10 bg-storm p-6"}
          >
            <p className={i === 0 ? "text-[14px] text-ink-3" : "text-[14px] text-mist"}>
              {i === 0 ? "Hari ini" : namaHari(hari.tanggal)}
            </p>
            <p className="mt-2 tabular-nums text-[28px] font-semibold tracking-[-0.03em]">
              {hari.suhu_maks_c}° / {hari.suhu_min_c}°
            </p>
            <p className="mt-2 text-[16px]">{hari.cuaca}</p>
            <p className={i === 0 ? "mt-1 text-[14px] text-ink-3" : "mt-1 text-[14px] text-mist"}>
              Hujan {hari.curah_hujan_mm} mm
            </p>
          </motion.li>
        ))}
      </ul>

      <p className="mt-6 text-[13px] leading-[1.6] text-mist">
        Sumber: BMKG
        {cuaca.diperbarui ? `, analisis ${cuaca.diperbarui.slice(0, 10)}` : ""}. Status Aman/Waspada/Bahaya dihitung
        aplikasi dari curah hujan dan jenis cuaca, bukan peringatan dini resmi. Saat kejadian, ikuti BMKG dan BPBD.
      </p>
    </>
  );
}

function CariTempat({ onPilih }: { onPilih: (lat: number, lng: number) => void }) {
  const [q, setQ] = useState("");
  const cari = useCariLokasi();
  const hasil = cari.data ?? [];

  return (
    <div className="mt-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim().length >= 3) cari.mutate(q.trim());
        }}
        className="flex max-w-[460px] items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1.5 pl-4 focus-within:border-white/50"
      >
        <Search className="size-4 shrink-0 text-mist" aria-hidden="true" />
        <label htmlFor="cari-tempat" className="sr-only">
          Cari kelurahan atau kota
        </label>
        <input
          id="cari-tempat"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari kelurahan atau kota"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-white/45"
        />
        <button
          type="submit"
          disabled={q.trim().length < 3 || cari.isPending}
          className="h-9 shrink-0 rounded-full bg-white px-4 text-[14px] font-semibold text-ink disabled:opacity-50"
        >
          {cari.isPending ? "Mencari…" : "Cari"}
        </button>
      </form>

      <div role="status" aria-live="polite" className="max-w-[460px]">
        {cari.isError && (
          <p className="mt-3 text-[14px] text-mist">
            {cari.error instanceof Error ? cari.error.message : "Pencarian belum bisa dilakukan."}
          </p>
        )}
        {cari.isSuccess && hasil.length === 0 && (
          <p className="mt-3 text-[14px] text-mist">Tempat tidak ditemukan. Coba nama kelurahan atau kecamatan.</p>
        )}
        {hasil.length > 0 && (
          <ul className="mt-3 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
            {hasil.map((h) => (
              <li key={`${h.lat},${h.lng}`}>
                <button
                  type="button"
                  onClick={() => {
                    onPilih(h.lat, h.lng);
                    cari.reset();
                    setQ("");
                  }}
                  className="block w-full px-4 py-3 text-left text-[15px] text-white hover:bg-white/8"
                >
                  {h.nama}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function DataBmkgLive() {
  const lokasi = useLokasi();
  const adaLokasi = lokasi.status === "gps" || lokasi.status === "dipilih";
  const { data, isPending, isError, error, refetch } = useCuaca(lokasi.lat, lokasi.lng, adaLokasi);

  const namaLokasi = data
    ? [data.wilayah.desa, data.wilayah.kecamatan, data.wilayah.kotkab].filter(Boolean).join(", ")
    : null;

  return (
    <section id="data-bmkg" className="relative scroll-mt-20 bg-night py-20 text-white md:py-28">
      <Gelombang className="absolute inset-x-0 top-0 -translate-y-[calc(100%-1px)] text-night" />
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <h2 className="t-h2">
            Cuaca dibaca di kelurahan rumahmu, bukan di kota secara umum.
          </h2>
          <div>
            <p className="max-w-[52ch] t-lead text-mist">
              Prakiraan ini diambil langsung dari BMKG untuk desa atau kelurahan terdekat dengan lokasimu.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={lokasi.minta}
                disabled={lokasi.status === "meminta"}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[15px] font-semibold text-ink transition-transform hover:scale-[1.02] active:scale-[0.99] disabled:opacity-60"
              >
                <LocateFixed className="size-4" aria-hidden="true" />
                {lokasi.status === "gps" ? "Perbarui lokasiku" : "Pakai lokasiku"}
              </button>
              {namaLokasi && (
                <p className="text-[15px] font-medium text-white">{namaLokasi}</p>
              )}
            </div>
            <p className="mt-3 text-[14px] leading-[1.6] text-mist" role="status">
              {lokasiCatatan(lokasi.status)}
            </p>
            <CariTempat onPilih={lokasi.pilih} />
          </div>
        </div>

        {adaLokasi && isPending && <Skeleton />}

        {adaLokasi && isError && (
          <Panel className="mt-12">
            <p className="text-[18px] font-semibold">Prakiraan belum bisa dimuat</p>
            <p className="mt-2 text-[15px] leading-[1.6] text-mist">
              {error instanceof ApiError ? error.message : "Tidak bisa terhubung ke server. Periksa koneksimu."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 inline-flex h-11 items-center rounded-full border border-white/25 px-5 text-[15px] font-semibold text-white hover:bg-white/10"
            >
              Coba lagi
            </button>
          </Panel>
        )}

        {!adaLokasi && (
          <Panel className="mt-12 text-center">
            <EmptyIllustration className="text-white/30" />
            <p className="text-[18px] font-semibold">Pilih lokasimu untuk melihat prakiraan</p>
            <p className="mx-auto mt-2 max-w-[48ch] text-[15px] leading-[1.6] text-mist">
              Tekan "Pakai lokasiku" atau cari nama kelurahan atau kotamu di atas. Data BMKG ditampilkan untuk desa
              atau kelurahan terdekat.
            </p>
          </Panel>
        )}

        {adaLokasi && data && <Konten data={data} />}
      </div>
    </section>
  );
}
