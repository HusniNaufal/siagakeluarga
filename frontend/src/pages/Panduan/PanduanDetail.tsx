import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { FASE_LABEL, findGuide, type Fase } from "@/content/panduan";
import { cn } from "@/lib/utils";
import type { JenisBencana } from "@/lib/types";

const FASES: Fase[] = ["sebelum", "saat", "sesudah"];

const BATANG: Record<JenisBencana, string> = {
  BANJIR: "bg-banjir",
  GEMPA: "bg-gempa",
  LONGSOR: "bg-longsor",
  CUACA_EKSTREM: "bg-cuaca",
  TSUNAMI: "bg-tsunami",
};

export function PanduanDetail() {
  const { jenis } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const guide = findGuide(jenis);
  const param = params.get("fase");
  const fase: Fase = FASES.includes(param as Fase) ? (param as Fase) : "sebelum";

  if (!guide) {
    return (
      <div className="mx-auto max-w-[680px] px-6 pt-32 pb-24 text-center">
        <h1 className="t-h2 text-ink">Panduan tidak ditemukan</h1>
        <p className="mt-3 text-[16px] text-ink-3">Jenis bencana yang kamu cari belum ada di daftar panduan.</p>
        <Link
          to="/panduan"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-accent-dark px-6 text-[15px] font-semibold text-white hover:bg-accent-hover"
        >
          Kembali ke daftar panduan
        </Link>
      </div>
    );
  }

  const content = guide.fase[fase];

  return (
    <div className="bg-paper px-6 pt-32 pb-24 md:px-10">
      <div className="mx-auto max-w-[1100px]">
        <Link to="/panduan" className="inline-flex min-h-11 items-center text-[15px] font-medium text-ink-3 hover:text-ink">
          ← Panduan bencana
        </Link>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className={cn("mb-4 block h-1 w-12 rounded-full", BATANG[guide.jenis])} aria-hidden="true" />
            <h1 className="t-h2 text-ink">{guide.label}</h1>
            <p className="mt-3 max-w-[56ch] text-[17px] leading-[1.6] text-ink-3">{guide.deskripsi}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="h-14 rounded-full bg-accent-dark px-7 text-[16px] font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Tambahkan ke rencana saya
          </button>
        </div>

        <div
          role="tablist"
          aria-label="Fase bencana"
          className="mt-10 flex w-full max-w-[360px] gap-1.5 rounded-full border border-line bg-base p-1.5"
        >
          {FASES.map((f) => {
            const active = fase === f;
            return (
              <button
                key={f}
                type="button"
                role="tab"
                id={`tab-${f}`}
                aria-selected={active}
                aria-controls="panel-fase"
                onClick={() => setParams({ fase: f })}
                className={cn(
                  "h-11 flex-1 rounded-full text-[15px] transition-colors",
                  active ? "bg-ink font-semibold text-white" : "font-medium text-ink-3 hover:bg-tint hover:text-ink",
                )}
              >
                {FASE_LABEL[f]}
              </button>
            );
          })}
        </div>

        <div id="panel-fase" role="tabpanel" aria-labelledby={`tab-${fase}`} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">{content.ringkasan}</h2>
            <ol className="space-y-3">
              {content.langkah.map((step, i) => (
                <li key={step} className="flex items-start gap-5 rounded-2xl border border-line bg-base p-5 md:p-6">
                  <span className="font-display w-8 shrink-0 text-[26px] leading-none font-semibold tracking-[-0.03em] text-ink">
                    {i + 1}
                  </span>
                  <p className="text-[17px] leading-[1.55] text-ink-3">{step}</p>
                </li>
              ))}
            </ol>

            <div className="rounded-2xl bg-surface p-5 md:p-6">
              <h3 className="text-[16px] font-semibold text-ink">Yang perlu dihindari dan kontak cepat</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-ink-3">{guide.kontak}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-base p-6">
              <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Yang perlu disiapkan</h2>
              <ul className="mt-4 space-y-3.5">
                {content.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[16px] leading-[1.45] text-ink">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-accent-dark text-white">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-base p-6">
              <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-ink">Masih bingung?</h2>
              <p className="mt-2 text-[15px] leading-[1.6] text-ink-3">
                Tanya Siaga bisa menjelaskan panduan ini dengan bahasa yang lebih sederhana.
              </p>
              <Link
                to="/tanya"
                className="mt-4 inline-flex h-11 items-center rounded-full border border-line bg-base px-5 text-[15px] font-semibold text-ink hover:bg-tint"
              >
                Tanya Siaga sekarang
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-10 text-[14px] leading-[1.55] text-muted">
          Instruksi resmi petugas dan BPBD tetap menjadi acuan utama.
        </p>
      </div>

      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tambahkan panduan ke rencana"
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/60 p-4"
        >
          <div className="w-full max-w-[520px] rounded-2xl border border-line bg-base p-6 md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Tambahkan panduan ke rencana</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Tutup"
                className="flex size-11 items-center justify-center rounded-full text-[22px] leading-none text-muted hover:bg-tint hover:text-ink"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-[16px] leading-[1.6] text-ink-3">
              Langkah untuk skenario {guide.label.toLowerCase()} (sebelum, saat, dan sesudah) akan terlihat di halaman
              rencana keluargamu.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="h-12 rounded-full border border-line bg-base px-6 text-[15px] font-semibold text-ink hover:bg-tint"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  navigate("/rencana");
                }}
                className="h-12 rounded-full bg-accent-dark px-6 text-[15px] font-semibold text-white hover:bg-accent-hover"
              >
                Buka rencana saya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
