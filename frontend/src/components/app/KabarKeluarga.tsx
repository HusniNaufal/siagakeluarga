import { useState } from "react";
import { Link2, RotateCcw } from "lucide-react";
import { useKabarSaya, useKosongkanKabar } from "@/hooks/useKabar";
import { KabarStatus, petaHref } from "@/components/app/KabarStatus";
import { telHref } from "@/hooks/useKontak";
import { NOMOR_UTAMA } from "@/content/kontak";

/**
 * Kabar keluarga untuk pemilik rencana. Setelah kejadian, anggota keluarga membuka tautan rencana dan
 * menekan "Saya aman"; statusnya muncul di sini tanpa perlu menelepon satu per satu.
 */
export function KabarKeluarga({ shareToken }: { shareToken: string }) {
  const { data, isLoading, isError } = useKabarSaya();
  const kosongkan = useKosongkanKabar();
  const [tersalin, setTersalin] = useState(false);

  const tautan = `${window.location.origin}/r/${shareToken}`;
  async function salin() {
    await navigator.clipboard.writeText(tautan).catch(() => undefined);
    setTersalin(true);
    setTimeout(() => setTersalin(false), 2000);
  }

  const butuh = data
    ? [
        ...data.anggota.filter((a) => a.kabar?.status === "BUTUH_BANTUAN").map((a) => ({ nama: a.panggilan, kabar: a.kabar! })),
        ...data.lainnya.filter((l) => l.kabar?.status === "BUTUH_BANTUAN").map((l) => ({ nama: l.nama, kabar: l.kabar! })),
      ]
    : [];

  return (
    <section aria-labelledby="judul-kabar" className="rounded-2xl border border-line bg-base p-5 md:p-6">
      <h2 id="judul-kabar" className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
        Kabar keluarga
      </h2>
      <p className="mt-1 max-w-[58ch] text-[15px] leading-[1.55] text-ink-3">
        Setelah kejadian, anggota keluarga membuka tautan rencana dan menekan "Saya aman". Kabarnya muncul di sini.
      </p>

      {isLoading && <div className="mt-5 h-24 animate-pulse rounded-xl bg-muted" aria-busy="true" />}
      {isError && <p className="mt-4 text-[15px] text-ink-3">Kabar belum bisa dimuat. Coba muat ulang halaman.</p>}

      {data && (
        <>
          <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              ["Aman", data.ringkasan.aman],
              ["Butuh bantuan", data.ringkasan.butuh_bantuan],
              ["Belum ada kabar", data.ringkasan.belum],
            ].map(([label, n]) => (
              <div key={label} className="rounded-xl bg-surface px-2 py-3">
                <dd className="font-display text-[28px] leading-none font-semibold tracking-[-0.03em] text-ink">{n}</dd>
                <dt className="mt-1 text-[13px] text-ink-3">{label}</dt>
              </div>
            ))}
          </dl>

          {butuh.length > 0 && (
            <div role="alert" className="mt-4 rounded-xl border border-bahaya/40 p-4">
              <p className="text-[16px] font-semibold text-bahaya">
                {butuh.map((b) => b.nama).join(", ")} meminta bantuan.
              </p>
              {butuh.map((b) => (
                <p key={b.nama} className="mt-1 text-[15px] text-ink">
                  {b.nama}
                  {b.kabar.pesan ? `: ${b.kabar.pesan}` : ""}{" "}
                  {b.kabar.lat != null && b.kabar.lng != null && (
                    <a
                      href={petaHref(b.kabar.lat, b.kabar.lng)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-ink underline underline-offset-4"
                    >
                      Lihat lokasi
                    </a>
                  )}
                </p>
              ))}
              <a
                href={telHref(NOMOR_UTAMA.nomor)}
                className="mt-3 inline-flex h-11 items-center rounded-full bg-bahaya px-5 text-[15px] font-semibold text-white"
              >
                Telepon {NOMOR_UTAMA.nomor}
              </a>
            </div>
          )}

          {data.anggota.length === 0 ? (
            <p className="mt-4 text-[15px] text-ink-3">Tambahkan anggota keluarga dulu agar kabarnya bisa dipantau.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {data.anggota.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                  <span className="text-[16px] font-medium text-ink">{a.panggilan}</span>
                  <KabarStatus kabar={a.kabar} />
                </li>
              ))}
              {data.lainnya.map((l) => (
                <li key={l.nama} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                  <span className="text-[16px] font-medium text-ink">
                    {l.nama} <span className="text-[13px] font-normal text-muted">(bukan anggota terdaftar)</span>
                  </span>
                  <KabarStatus kabar={l.kabar} />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={salin}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-base px-4 text-[15px] font-semibold text-ink hover:bg-tint"
            >
              <Link2 className="size-4" aria-hidden="true" />
              {tersalin ? "Tautan tersalin" : "Salin tautan untuk keluarga"}
            </button>
            <button
              type="button"
              disabled={kosongkan.isPending || (data.ringkasan.aman + data.ringkasan.butuh_bantuan === 0)}
              onClick={() => {
                if (window.confirm("Kosongkan semua kabar? Lakukan ini setelah kejadian selesai, sebelum pendataan berikutnya.")) kosongkan.mutate();
              }}
              className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[15px] font-medium text-ink-3 hover:text-ink disabled:opacity-40"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Mulai pendataan baru
            </button>
          </div>
        </>
      )}
    </section>
  );
}
