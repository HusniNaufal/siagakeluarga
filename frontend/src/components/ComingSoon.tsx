/** Placeholder sementara untuk halaman yang belum dibangun di fase ini. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 text-center">
      <p className="font-mono text-xs tracking-[0.08em] text-ink-3 uppercase">Segera hadir</p>
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      <p className="max-w-sm text-sm text-ink-3">Halaman ini sedang dikerjakan pada tahap berikutnya.</p>
    </div>
  );
}
