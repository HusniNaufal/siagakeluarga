import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Maximize2, MessageCircle, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useTanyaChat } from "@/hooks/useTanyaChat";
import { DaftarPesan, InputTanya, SARAN_PERTANYAAN } from "@/components/ai/TanyaChat";

/** Tombol chat AI melayang, tersedia di semua halaman (kecuali /tanya yang sudah layar penuh). */
export function TanyaWidget() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { messages, pending, send, reset } = useTanyaChat();
  const [buka, setBuka] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!buka) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBuka(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [buka]);

  if (pathname.startsWith("/tanya") || pathname.startsWith("/admin")) return null;

  const kirim = (text: string) => {
    if (!text.trim() || pending) return;
    setInput("");
    void send(text);
  };

  // Di area aplikasi ponsel ada bottom nav setinggi ~60px
  const bawah = user ? "bottom-24 md:bottom-6" : "bottom-5 md:bottom-6";

  return (
    <>
      {buka && (
        <section
          role="dialog"
          aria-label="Tanya Siaga, asisten AI kebencanaan"
          className={cn(
            "fixed right-4 z-50 flex h-[min(600px,calc(100dvh-8rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-line bg-base shadow-2xl animate-in fade-in slide-in-from-bottom-4 md:right-6",
            user ? "bottom-40 md:bottom-24" : "bottom-24",
          )}
        >
          <header className="flex items-center gap-3 border-b border-line bg-ink px-4 py-3 text-white">
            <span className="flex size-9 items-center justify-center rounded-full bg-white/15">
              <MessageCircle className="size-5" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold leading-tight">Tanya Siaga</p>
              <p className="text-[12px] text-white/70">Asisten AI kesiapsiagaan bencana</p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={reset}
                disabled={pending}
                aria-label="Mulai percakapan baru"
                title="Percakapan baru"
                className="flex size-9 items-center justify-center rounded-full hover:bg-white/15 disabled:opacity-50"
              >
                <RotateCcw className="size-4" strokeWidth={1.8} />
              </button>
            )}
            {user && (
              <Link
                to="/tanya"
                onClick={() => setBuka(false)}
                aria-label="Buka layar penuh"
                title="Layar penuh"
                className="flex size-9 items-center justify-center rounded-full hover:bg-white/15"
              >
                <Maximize2 className="size-4" strokeWidth={1.8} />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setBuka(false)}
              aria-label="Tutup"
              className="flex size-9 items-center justify-center rounded-full hover:bg-white/15"
            >
              <X className="size-5" strokeWidth={1.8} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4" data-lenis-prevent>
            <DaftarPesan
              ringkas
              messages={messages}
              pending={pending}
              kosong={
                <div className="space-y-3">
                  <p className="text-[15px] leading-[1.55] text-ink-3">
                    Halo! Tanyakan apa saja soal gempa, banjir, tsunami, longsor, atau cara menyiapkan keluarga.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SARAN_PERTANYAAN.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => kirim(c)}
                        className="rounded-full border border-line px-3 py-1.5 text-[13px] text-ink-3 transition-colors hover:bg-tint hover:text-ink"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              }
            />
          </div>

          <div className="border-t border-line p-3">
            <InputTanya
              ringkas
              autoFocus
              id="tanya-widget-input"
              value={input}
              onChange={setInput}
              onSubmit={() => kirim(input)}
              disabled={pending}
            />
            <p className="mt-2 text-center text-[11px] text-muted">
              Jawaban AI bisa keliru. Darurat? Hubungi <strong>112</strong>.
            </p>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setBuka((v) => !v)}
        aria-expanded={buka}
        aria-label={buka ? "Tutup Tanya Siaga" : "Buka Tanya Siaga, asisten AI"}
        className={cn(
          "fixed right-4 z-50 flex h-14 items-center gap-2 rounded-full bg-accent-dark pr-5 pl-4 text-white shadow-xl transition-all hover:bg-accent-hover md:right-6",
          bawah,
          buka && "w-14 justify-center p-0",
        )}
      >
        {buka ? (
          <X className="size-6" strokeWidth={2} aria-hidden="true" />
        ) : (
          <>
            <MessageCircle className="size-6" strokeWidth={1.9} aria-hidden="true" />
            <span className="text-[15px] font-semibold">Tanya AI</span>
          </>
        )}
      </button>
    </>
  );
}
