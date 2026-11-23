import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, MessageCircle, Send } from "lucide-react";
import { StatusMark } from "@/components/ui/StatusMark";
import { useKodeTelegram, usePeringatan, usePutuskanTelegram } from "@/hooks/usePeringatan";

/**
 * Pengingat bersiap untuk grup keluarga. Saat prakiraan BMKG menunjukkan hujan deras di lokasi rumah,
 * pesan siap kirim ke grup WhatsApp. Pengiriman otomatis lewat Telegram bersifat opsional.
 * Ini pengingat dari aplikasi, BUKAN peringatan dini resmi.
 */
export function PeringatanKeluarga({ shareToken }: { shareToken: string }) {
  const { data, isLoading, isError } = usePeringatan();
  const kode = useKodeTelegram();
  const putuskan = usePutuskanTelegram();
  const [tersalin, setTersalin] = useState(false);

  const tautan = `${window.location.origin}/r/${shareToken}`;
  const pesan = data?.tersedia && data.kalimat ? `${data.kalimat}\n\nRencana keluarga: ${tautan}` : null;

  async function salin() {
    if (!pesan) return;
    await navigator.clipboard.writeText(pesan).catch(() => undefined);
    setTersalin(true);
    setTimeout(() => setTersalin(false), 2000);
  }

  return (
    <section aria-labelledby="judul-peringatan" className="rounded-2xl border border-line bg-base p-5 md:p-6">
      <h2 id="judul-peringatan" className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
        Pengingat untuk grup keluarga
      </h2>

      {isLoading && <div className="mt-4 h-16 animate-pulse rounded-xl bg-muted" aria-busy="true" />}
      {isError && <p className="mt-3 text-[15px] text-ink-3">Pengingat belum bisa dimuat. Coba muat ulang halaman.</p>}

      {data && !data.tersedia && (
        <p className="mt-3 text-[15px] leading-[1.55] text-ink-3">
          {data.alasan}{" "}
          <Link to="/keluarga" className="font-semibold text-ink underline underline-offset-4">
            Atur lokasi rumah
          </Link>
        </p>
      )}

      {data?.tersedia && (
        <>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <p className="text-[16px] leading-[1.5] text-ink">{data.ringkasan}</p>
              {data.tingkat === "aman" && (
                <p className="mt-2 text-[15px] text-ink-3">Tidak ada pengingat yang perlu dikirim sekarang.</p>
              )}
            </div>
            <StatusMark tingkat={data.tingkat} className="md:w-[220px]" />
          </div>

          {pesan && (
            <div className="mt-5 flex flex-wrap gap-2.5">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(pesan)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent-dark px-6 text-[16px] font-semibold text-white hover:bg-accent-hover"
              >
                <MessageCircle className="size-5" aria-hidden="true" />
                Kirim ke grup WhatsApp
              </a>
              <button
                type="button"
                onClick={salin}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-base px-5 text-[15px] font-semibold text-ink hover:bg-tint"
              >
                <Copy className="size-4" aria-hidden="true" />
                {tersalin ? "Pesan tersalin" : "Salin pesan"}
              </button>
            </div>
          )}
          <p className="mt-3 text-[13px] leading-[1.55] text-muted">
            Ini pengingat bersiap dari aplikasi, bukan peringatan dini resmi. Ikuti arahan BMKG dan BPBD.
          </p>
        </>
      )}

      {data && (
        <div className="mt-6 border-t border-line pt-5">
          <h3 className="text-[16px] font-semibold text-ink">Kirim otomatis lewat Telegram</h3>
          {!data.telegram.tersedia && (
            <p className="mt-1 text-[14px] leading-[1.55] text-ink-3">
              Pengiriman otomatis belum diaktifkan di server ini. Tombol WhatsApp di atas tetap bisa dipakai.
            </p>
          )}
          {data.telegram.tersedia && data.telegram.terhubung && (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-[15px] text-ink">Grup Telegram sudah terhubung. Pengingat dikirim otomatis saat status naik ke waspada atau bahaya.</p>
              <button
                type="button"
                onClick={() => putuskan.mutate()}
                disabled={putuskan.isPending}
                className="h-11 rounded-full border border-line px-4 text-[14px] font-semibold text-ink hover:bg-tint"
              >
                Putuskan grup
              </button>
            </div>
          )}
          {data.telegram.tersedia && !data.telegram.terhubung && (
            <div className="mt-2">
              <p className="text-[14px] leading-[1.55] text-ink-3">
                Pengingat dikirim sendiri ke grup keluarga saat cuaca perlu diwaspadai, tanpa kamu perlu membuka aplikasi.
              </p>
              {!kode.data ? (
                <button
                  type="button"
                  onClick={() => kode.mutate()}
                  disabled={kode.isPending}
                  className="mt-3 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-base px-4 text-[15px] font-semibold text-ink hover:bg-tint disabled:opacity-60"
                >
                  <Send className="size-4" aria-hidden="true" />
                  {kode.isPending ? "Membuat kode…" : "Hubungkan grup Telegram"}
                </button>
              ) : (
                <ol role="status" className="mt-3 list-decimal space-y-1.5 pl-5 text-[15px] leading-[1.55] text-ink">
                  <li>Tambahkan {data.telegram.bot ? `@${data.telegram.bot}` : "bot SiagaKeluarga"} ke grup Telegram keluarga.</li>
                  <li>
                    Kirim di grup: <code className="rounded bg-surface px-1.5 py-0.5 font-semibold">/hubungkan {kode.data.kode}</code>
                  </li>
                  <li>Bot akan membalas bila sudah terhubung. Muat ulang halaman ini untuk melihat statusnya.</li>
                </ol>
              )}
              {kode.isError && (
                <p role="alert" className="mt-2 text-[14px] text-bahaya">
                  {kode.error instanceof Error ? kode.error.message : "Kode belum bisa dibuat."}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
