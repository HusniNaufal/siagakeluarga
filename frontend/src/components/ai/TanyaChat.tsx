import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PesanTanya } from "@/lib/types";

export const SARAN_PERTANYAAN = [
  "Isi tas siaga banjir",
  "Apa yang dilakukan saat gempa?",
  "Tanda-tanda tsunami",
  "Kapan boleh pulang setelah banjir?",
];

/* ---------- Markdown ringan untuk jawaban AI (tanpa dependensi) ---------- */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part.replace(/(^|\s)\*(\S[^*]*\S|\S)\*(?=\s|$|[.,!?])/g, "$1$2")}</Fragment>
    ),
  );
}

export function JawabanAI({ text }: { text: string }) {
  const blok: ReactNode[] = [];
  let daftar: { tipe: "ul" | "ol"; isi: string[] } | null = null;

  const tutupDaftar = () => {
    if (!daftar) return;
    const { tipe, isi } = daftar;
    const Tag = tipe;
    blok.push(
      <Tag
        key={blok.length}
        className={cn("space-y-1.5 pl-5", tipe === "ul" ? "list-disc" : "list-decimal", "marker:text-ink-3")}
      >
        {isi.map((li, i) => (
          <li key={i}>{inline(li)}</li>
        ))}
      </Tag>,
    );
    daftar = null;
  };

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const ul = line.match(/^[-*•]\s+(.*)$/);
    const ol = line.match(/^\d+[.)]\s+(.*)$/);
    if (ul || ol) {
      const tipe = ul ? "ul" : "ol";
      if (daftar && daftar.tipe !== tipe) tutupDaftar();
      daftar ??= { tipe, isi: [] };
      daftar.isi.push((ul ?? ol)![1]);
      continue;
    }
    tutupDaftar();
    if (!line) continue;
    const judul = line.match(/^#{1,6}\s+(.*)$/);
    blok.push(
      judul ? (
        <p key={blok.length} className="font-semibold text-ink">
          {inline(judul[1])}
        </p>
      ) : (
        <p key={blok.length}>{inline(line)}</p>
      ),
    );
  }
  tutupDaftar();

  return <div className="space-y-2.5">{blok}</div>;
}

/* ---------- Daftar pesan ---------- */
export function DaftarPesan({
  messages,
  pending,
  kosong,
  ringkas = false,
}: {
  messages: PesanTanya[];
  pending: boolean;
  kosong?: ReactNode;
  ringkas?: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, pending]);

  const ukuran = ringkas ? "text-[15px] px-4 py-3" : "text-[16px] px-5 py-4";

  return (
    <div className="space-y-4" role="log" aria-label="Percakapan" aria-live="polite">
      {messages.length === 0 && kosong}

      {messages.map((m) => (
        <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
          <div
            className={cn(
              "max-w-[88%] rounded-2xl leading-[1.55]",
              ukuran,
              m.role === "user" ? "rounded-br-md bg-ink text-white" : "rounded-bl-md bg-surface text-ink",
              m.galat && "border border-bahaya",
            )}
          >
            {m.role === "ai" && !m.galat ? (
              <JawabanAI text={m.text} />
            ) : (
              <p className="whitespace-pre-wrap">{m.text}</p>
            )}
            {!!m.referensi?.length && (
              <div className="mt-3 border-t border-line pt-3">
                <p className="text-[13px] font-semibold text-ink">Rujukan panduan</p>
                <ul className="mt-1 space-y-0.5">
                  {m.referensi.map((r) => (
                    <li key={r.id} className="text-[13px] leading-[1.45] text-ink-3">
                      {r.sumber}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}

      {pending && (
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
  );
}

/* ---------- Kolom input ---------- */
export function InputTanya({
  value,
  onChange,
  onSubmit,
  disabled,
  id,
  autoFocus,
  ringkas = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  id: string;
  autoFocus?: boolean;
  ringkas?: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor={id} className="sr-only">
        Pertanyaanmu
      </label>
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border border-line bg-base pr-2 pl-4 focus-within:border-ink",
          ringkas ? "h-12" : "h-14 pl-5",
        )}
      >
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tanya soal bencana & kesiapsiagaan"
          autoComplete="off"
          maxLength={1000}
          autoFocus={autoFocus}
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Kirim pertanyaan"
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-accent-dark text-white transition-colors hover:bg-accent-hover disabled:opacity-50",
            ringkas ? "size-9" : "size-11",
          )}
        >
          <ArrowUp className="size-5" strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
