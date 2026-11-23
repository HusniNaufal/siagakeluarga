import { cn } from "@/lib/utils";

/**
 * Tiga ilustrasi garis tipis untuk langkah Cara kerja. Garis abu-abu kebiruan, dengan satu detail
 * beraksen (anak, rute, penerima) sebagai satu-satunya warna. Dekoratif, jadi disembunyikan dari pembaca layar.
 */
const dasar = {
  viewBox: "0 0 120 80",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function GambarKeluarga({ className }: { className?: string }) {
  return (
    <svg {...dasar} className={cn("h-20 w-[120px] text-ink/30", className)}>
      <path d="M22 16C42 2 78 2 98 16" />
      <circle cx="34" cy="30" r="7" />
      <path d="M20 62c0-16 28-16 28 0" />
      <circle cx="86" cy="30" r="7" />
      <path d="M72 62c0-16 28-16 28 0" />
      <circle cx="60" cy="41" r="5" className="stroke-accent-dark" />
      <path d="M51 62c0-10 18-10 18 0" className="stroke-accent-dark" />
      <path d="M10 66h100" />
    </svg>
  );
}

export function GambarRute({ className }: { className?: string }) {
  return (
    <svg {...dasar} className={cn("h-20 w-[120px] text-ink/30", className)}>
      <path d="M10 58 24 46l14 12" />
      <path d="M14 55v13h20V55" />
      <path d="M42 66c14 0 18-14 32-14 12 0 14-8 18-14" strokeDasharray="3 4" className="stroke-accent-dark" />
      <path d="M92 38c-9-8-12-13-12-19a12 12 0 0 1 24 0c0 6-3 11-12 19Z" />
      <circle cx="92" cy="19" r="4" />
      <path d="M6 70h108" />
    </svg>
  );
}

export function GambarBagikan({ className }: { className?: string }) {
  return (
    <svg {...dasar} className={cn("h-20 w-[120px] text-ink/30", className)}>
      <circle cx="24" cy="40" r="8" />
      <circle cx="92" cy="20" r="8" className="stroke-accent-dark" />
      <circle cx="92" cy="60" r="8" />
      <path d="m31 36 54-13M31 44l54 13" />
      <path d="m88 20 3 3 5-6" className="stroke-accent-dark" />
    </svg>
  );
}

/** Pembatas section: garis tipis dengan atap kecil di tengah, gema dari logo. */
export function Pembatas({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-5 text-ink/30", className)} aria-hidden="true">
      <span className="h-px flex-1 bg-line" />
      <svg viewBox="0 0 40 28" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-10">
        <path d="M6 7c8-6 20-6 28 0" />
        <path d="m7 17 13-10 13 10" />
        <path d="M11 15v10h18V15" />
      </svg>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
