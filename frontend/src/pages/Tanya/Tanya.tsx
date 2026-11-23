import { useEffect, useRef, useState } from "react";
import { useAsk } from "@/hooks/useAsk";
import { cn } from "@/lib/utils";
import type { AskReferensi } from "@/lib/types";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  referensi?: AskReferensi[];
}

interface Thread {
  id: string;
  title: string;
  timeLabel: string;
  messages: Message[];
}

const CHIPS = ["Isi tas siaga banjir", "Titik kumpul terdekat"];

const NEW_THREAD: Thread = {
  id: "t-baru",
  title: "Percakapan baru",
  timeLabel: "Sekarang",
  messages: [],
};

export function Tanya() {
  const [threads, setThreads] = useState<Thread[]>([NEW_THREAD]);
  const [activeId, setActiveId] = useState<string>(NEW_THREAD.id);
  const [input, setInput] = useState("");
  const ask = useAsk();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, threads]);

  const active = threads.find((t) => t.id === activeId) ?? threads[0];

  async function sendMessage(text: string) {
    if (!text.trim() || ask.isPending) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === active.id
          ? { ...t, messages: [...t.messages, userMsg] }
          : t,
      ),
    );
    setInput("");

    try {
      const res = await ask.mutateAsync(text);
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        text: res.jawaban,
        referensi: res.referensi,
      };
      setThreads((prev) =>
        prev.map((t) =>
          t.id === active.id
            ? { ...t, messages: [...t.messages, aiMsg] }
            : t,
        ),
      );
    } catch (err) {
      const fallbackMsg: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        text: `${
          err instanceof Error && err.message
            ? err.message
            : "Asisten belum bisa menjawab sekarang."
        } Kalau keadaan darurat, hubungi 112 dan ikuti arahan petugas di tempat.`,
      };
      setThreads((prev) =>
        prev.map((t) =>
          t.id === active.id
            ? { ...t, messages: [...t.messages, fallbackMsg] }
            : t,
        ),
      );
    }
  }

  return (
    /* Row 2 Kolom: Chat Column + Riwayat Percakapan (persis siagakeluarga.fig Node 3608..3642) */
    <div className="grid gap-7 lg:grid-cols-[1fr_240px]">
      {/* Chat Column (Node 3609) */}
      <div className="space-y-4">
        <h1 className="text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0B2545]">
          Tanya Siaga
        </h1>

        {/* Chat Panel (Node 3611) */}
        <div className="flex flex-col rounded-[20px] border border-[#E2E8F0] bg-white p-7">
          <div className="space-y-4">
            {active.messages.length === 0 && (
              <p className="text-[15px] leading-[1.6] text-[#475569]">
                Tanyakan langkah yang perlu dilakukan sebelum, saat, atau sesudah bencana. Jawaban
                disusun dari panduan dan bukan pengganti arahan BPBD atau petugas di tempatmu.
              </p>
            )}
            {active.messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[540px] rounded-[16px] text-[15px] leading-[1.5]",
                    m.role === "user"
                      ? "bg-[#0B2545] px-4 py-3 text-white"
                      : "bg-[#F1F5F9] px-[18px] py-4 text-[#0B2545]",
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {!!m.referensi?.length && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {m.referensi.map((r) => (
                        <span key={r.id} className="text-[12px] text-[#C2410C]">
                          {r.sumber}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {ask.isPending && (
              <div className="flex justify-start">
                <div className="rounded-[16px] bg-[#F1F5F9] px-[18px] py-4 text-[15px] text-[#475569]">
                  Tanya Siaga sedang mengetik...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Chip Saran (Node 3622) */}
        <div className="flex flex-wrap gap-2.5">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => sendMessage(c)}
              className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2.5 text-[14px] text-[#475569] transition-colors hover:border-[#C2410C] hover:text-[#0B2545]"
            >
              {c}
            </button>
          ))}
        </div>

        {/* Input Chat (Node 3627) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex h-14 items-center gap-3 rounded-full border border-[#E2E8F0] bg-white pr-2.5 pl-[22px]"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya apa saja soal kesiapsiagaan…"
            className="h-full flex-1 bg-transparent text-[15px] text-[#0B2545] outline-none placeholder:text-[#475569]"
          />
          <button
            type="submit"
            disabled={ask.isPending}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#C2410C] text-[18px] font-bold text-white disabled:opacity-60"
          >
            ↑
          </button>
        </form>

        {/* Disclaimer (Node 3631) */}
        <p className="text-[13px] text-[#475569]">
          Tanya Siaga membantu menjelaskan panduan resmi, tapi bukan pengganti
          instruksi petugas BPBD saat kondisi darurat.
        </p>
      </div>

      {/* Riwayat Percakapan (persis Node 3632) */}
      <aside className="hidden h-fit rounded-[16px] border border-[#E2E8F0] bg-white p-5 lg:block">
        <p className="text-[15px] font-semibold text-[#0B2545]">
          Riwayat percakapan
        </p>
        <div className="mt-3.5 space-y-2.5">
          {threads.map((t) => {
            const isActive = t.id === activeId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveId(t.id)}
                className={cn(
                  "block w-full rounded-[12px] p-3 text-left transition-colors",
                  isActive ? "bg-[#F1F5F9]" : "hover:bg-[#F8FAFC]",
                )}
              >
                <p
                  className={cn(
                    "truncate text-[13px]",
                    isActive
                      ? "font-semibold text-[#0B2545]"
                      : "font-normal text-[#475569]",
                  )}
                >
                  {t.title}
                </p>
                <p
                  className={cn(
                    "mt-1 text-[11px]",
                    isActive ? "text-[#C2410C]" : "text-[#475569]",
                  )}
                >
                  {t.timeLabel}
                </p>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
