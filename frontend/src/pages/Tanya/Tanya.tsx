import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useAsk } from "@/hooks/useAsk";
import { cn } from "@/lib/utils";
import { AppHero } from "@/components/app/AppHero";
import type { AskReferensi } from "@/lib/types";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  referensi?: AskReferensi[];
  galat?: boolean;
}

const CHIPS = [
  "Isi tas siaga banjir",
  "Titik kumpul terdekat",
  "Apa yang dilakukan saat gempa?",
  "Kapan boleh pulang setelah banjir?",
];

export function Tanya() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const ask = useAsk();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, ask.isPending]);

  async function sendMessage(text: string) {
    const isi = text.trim();
    if (!isi || ask.isPending) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: isi }]);
    setInput("");

    try {
      const res = await ask.mutateAsync(isi);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "ai", text: res.jawaban, referensi: res.referensi },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          galat: true,
          text: `${
            err instanceof Error && err.message ? err.message : "Asisten belum bisa menjawab sekarang."
          } Kalau keadaan darurat, hubungi 112 dan ikuti arahan petugas di tempat.`,
        },
      ]);
    }
  }

  return (
    <div className="mx-auto max-w-[760px] space-y-8">
      <AppHero variasi="gelombang">
        <h1>Tanya Siaga</h1>
        <p className="mt-1 max-w-[56ch] text-[16px] text-ink-3">
          Tanyakan langkah sebelum, saat, atau sesudah bencana.
        </p>
      </AppHero>

      <div className="rounded-2xl border border-line bg-base p-5 md:p-6">
        <div className="min-h-[240px] space-y-5" role="log" aria-label="Percakapan" aria-live="polite">
          {messages.length === 0 && (
            <p className="text-[16px] leading-[1.6] text-ink-3">
              Mulai dengan pertanyaan sendiri, atau pilih salah satu saran di bawah.
            </p>
          )}

          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[88%] rounded-2xl text-[16px] leading-[1.55]",
                  m.role === "user"
                    ? "rounded-br-md bg-ink px-5 py-3 text-white"
                    : "rounded-bl-md bg-surface px-5 py-4 text-ink",
                  m.galat && "border border-bahaya",
                )}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                {!!m.referensi?.length && (
                  <div className="mt-3 border-t border-line pt-3">
                    <p className="text-[14px] font-semibold text-ink">Sumber</p>
                    <ul className="mt-1.5 space-y-1">
                      {m.referensi.map((r) => (
                        <li key={r.id} className="text-[14px] leading-[1.45] text-ink-3">
                          {r.sumber}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {ask.isPending && (
            <div className="flex justify-start" role="status">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-surface px-5 py-4">
                <span className="sr-only">Tanya Siaga sedang mengetik</span>
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    aria-hidden="true"
                    className="size-2 animate-pulse rounded-full bg-muted"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            disabled={ask.isPending}
            onClick={() => sendMessage(c)}
            className="min-h-11 rounded-full border border-line bg-base px-4 text-[15px] text-ink-3 transition-colors hover:bg-tint hover:text-ink disabled:opacity-60"
          >
            {c}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="space-y-2"
      >
        <label htmlFor="tanya-input" className="block text-[15px] font-medium text-ink">
          Pertanyaanmu
        </label>
        <div className="flex h-14 items-center gap-2 rounded-2xl border border-line bg-base pr-2 pl-5 focus-within:border-ink">
          <input
            id="tanya-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya apa saja soal kesiapsiagaan"
            autoComplete="off"
            className="h-full flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={ask.isPending || !input.trim()}
            aria-label="Kirim pertanyaan"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-dark text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            <ArrowUp className="size-5" strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      </form>

      <p className="text-[14px] leading-[1.55] text-muted">
        Jawaban disusun dari panduan resmi, bukan pengganti arahan BPBD atau petugas.
      </p>
    </div>
  );
}
