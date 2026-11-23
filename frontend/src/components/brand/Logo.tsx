import { cn } from "@/lib/utils";

/** Warna dari logo resmi SiagaKeluarga. */
const NAVY = "#10264a";
const TERAKOTA = "#bc5b34";

/**
 * Simbol logo: keluarga berlindung di bawah atap, dinaungi telapak tangan. Dekoratif,
 * jadi selalu dipasangkan dengan nama di sebelahnya.
 */
export function LogoMark({ className, terang = false }: { className?: string; terang?: boolean }) {
  return (
    <img
      src={terang ? "/brand/logo-mark-terang.png" : "/brand/logo-mark.png"}
      alt=""
      width={200}
      height={184}
      className={cn("h-9 w-auto shrink-0", className)}
    />
  );
}

/** Simbol + nama dua warna seperti di logo. Nama diketik (bukan gambar) agar tajam dan terbaca. */
export function Logo({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "white";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark terang={tone === "white"} />
      <span className="text-[19px] leading-none font-bold tracking-[-0.02em]">
        <span style={{ color: tone === "white" ? "#f5f7fa" : NAVY }}>Siaga</span>
        <span style={{ color: TERAKOTA }}>Keluarga</span>
      </span>
    </span>
  );
}
