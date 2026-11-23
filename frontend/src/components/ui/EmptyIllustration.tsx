import { cn } from "@/lib/utils";

/**
 * Ilustrasi garis tunggal untuk keadaan kosong: rumah di bawah satu lengkung, gema dari logo.
 * Sengaja tipis dan abu-abu: hanya penanda, bukan hiasan.
 */
export function EmptyIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("mx-auto mb-4 size-14 text-ink/40", className)}
    >
      <path d="M17 9c8-5 22-5 30 0" />
      <path d="M10 31 32 14l22 17" />
      <path d="M16 28v24h32V28" />
      <path d="M28 52V40h8v12" className="stroke-accent-dark" />
      <path d="M5 52h54" />
    </svg>
  );
}
