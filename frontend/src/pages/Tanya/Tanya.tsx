import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { AppHero } from "@/components/app/AppHero";
import { DaftarPesan, InputTanya, SARAN_PERTANYAAN } from "@/components/ai/TanyaChat";
import { useTanyaChat } from "@/hooks/useTanyaChat";

export function Tanya() {
  const { messages, pending, send, reset } = useTanyaChat();
  const [input, setInput] = useState("");

  const kirim = (text: string) => {
    if (!text.trim() || pending) return;
    setInput("");
    void send(text);
  };

  return (
    <div className="mx-auto max-w-[760px] space-y-8">
      <AppHero variasi="gelombang">
        <h1>Tanya Siaga</h1>
        <p className="mt-1 max-w-[56ch] text-[16px] text-ink-3">
          Asisten AI (Gemini) untuk langkah sebelum, saat, dan sesudah bencana. Jawaban disesuaikan dengan
          profil keluargamu.
        </p>
      </AppHero>

      <div className="rounded-3xl border border-line/80 bg-base/95 p-5 shadow-sm backdrop-blur-sm md:p-7">
        {messages.length > 0 && (
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={reset}
              disabled={pending}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[14px] text-ink-3 hover:bg-tint hover:text-ink disabled:opacity-50"
            >
              <RotateCcw className="size-4" strokeWidth={1.8} aria-hidden="true" />
              Percakapan baru
            </button>
          </div>
        )}
        <div className="min-h-[240px]">
          <DaftarPesan
            messages={messages}
            pending={pending}
            kosong={
              <p className="text-[16px] leading-[1.6] text-ink-3">
                Mulai dengan pertanyaan sendiri, atau pilih salah satu saran di bawah.
              </p>
            }
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {SARAN_PERTANYAAN.map((c) => (
          <button
            key={c}
            type="button"
            disabled={pending}
            onClick={() => kirim(c)}
            className="min-h-11 rounded-full border border-line bg-base px-4 text-[15px] text-ink-3 transition-colors hover:bg-tint hover:text-ink disabled:opacity-60"
          >
            {c}
          </button>
        ))}
      </div>

      <InputTanya id="tanya-input" value={input} onChange={setInput} onSubmit={() => kirim(input)} disabled={pending} />

      <p className="text-[14px] leading-[1.55] text-muted">
        Jawaban dibuat AI berdasarkan panduan resmi BNPB/BMKG, bukan pengganti arahan BPBD atau petugas. Dalam
        keadaan darurat, hubungi 112.
      </p>
    </div>
  );
}
