import { cn } from "@/lib/utils";

/**
 * Grafis pengisi dari palet logo: navy, terakota, hijau. Datar, tanpa gradasi dan tanpa blob.
 * Semuanya dekoratif (aria-hidden) dan tanpa gerak.
 */
const NAVY = "#10264a";
const TERAKOTA = "#bc5b34";
const HIJAU = "#4f6b45";

/** Rumah keluarga: keluarga berlindung di bawah atap dan lengkung pelindung, di atas tanah hijau. */
export function GrafisRumah({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 330" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cn("pointer-events-none select-none", className)}>
      <path d="M36 170C46 76 128 28 220 36c60 5 112 28 164 12" stroke={TERAKOTA} strokeWidth={7} />
      <path d="m72 204 132-104 132 104M98 186v100h212V186" stroke={NAVY} strokeWidth={9} />
      <circle cx="160" cy="214" r="15" fill={NAVY} />
      <path d="M130 288c0-36 60-36 60 0Z" fill={NAVY} />
      <circle cx="250" cy="208" r="15" fill={TERAKOTA} />
      <path d="M220 288c0-36 60-36 60 0Z" fill={TERAKOTA} />
      <circle cx="205" cy="244" r="11" fill={HIJAU} />
      <path d="M185 288c0-26 40-26 40 0Z" fill={HIJAU} />
      <path d="M0 296c90-14 180-18 270-12s90 10 130 6" stroke={HIJAU} strokeWidth={7} />
      <path d="M44 320c90-22 190-18 300-8" stroke={HIJAU} strokeWidth={6} />
    </svg>
  );
}

/** Tepi gelombang air. Dipasang di tepi atas section gelap; warna isian mengikuti `text-*`. */
export function Gelombang({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" fill="currentColor" aria-hidden="true" className={cn("pointer-events-none block h-[60px] w-full md:h-[90px]", className)}>
      <path d="M0 46C120 14 240 12 360 40s240 40 360 12 240-44 360-22 240 44 360 18V90H0Z" />
    </svg>
  );
}

/** Siluet bukit berlapis (navy dan hijau tua) untuk tepi atas footer. */
export function Bukit({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true" className={cn("pointer-events-none block h-[80px] w-full md:h-[130px]", className)}>
      <path d="M0 78C160 20 300 28 440 70s260 36 420-8 300-44 580 20V140H0Z" fill="#12301f" />
      <path d="M0 104C180 62 320 76 500 104s300 8 460-22 330-18 480 22V140H0Z" fill="#0f2540" />
      <path d="M0 126C200 104 380 112 600 126s420 4 840-8V140H0Z" fill="#060b14" />
    </svg>
  );
}

/** Cincin pelindung: busur sepusat di sudut, gema dari lengkung pada logo. */
export function Cincin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 360" fill="none" strokeWidth={1.5} aria-hidden="true" className={cn("pointer-events-none select-none", className)}>
      <circle cx="360" cy="0" r="110" stroke={TERAKOTA} strokeOpacity={0.55} />
      <circle cx="360" cy="0" r="190" stroke={NAVY} strokeOpacity={0.25} />
      <circle cx="360" cy="0" r="270" stroke={HIJAU} strokeOpacity={0.4} />
      <circle cx="360" cy="0" r="350" stroke={NAVY} strokeOpacity={0.12} />
    </svg>
  );
}
