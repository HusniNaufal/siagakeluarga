import { cn } from "@/lib/utils";

/**
 * Pengisi area kosong: motif logo (lengkung pelindung, atap, rumah, tanah) dalam satu garis tipis
 * dengan opasitas rendah. Satu warna, tanpa isian, tanpa gerak. Hanya dipasang di area yang sepi.
 */
export function GarisLatar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("pointer-events-none text-ink/12 select-none", className)}
    >
      <path d="M30 150C42 62 122 20 212 28c58 5 108 27 160 12" />
      <path d="m70 190 130-100 130 100" />
      <path d="M95 172v90h210v-90" />
      <path d="M175 262v-57h50v57" />
      <path d="M0 262c80-12 160-16 240-10s120 10 160 6" />
      <path d="M40 284c80-20 180-16 290-6" />
    </svg>
  );
}
