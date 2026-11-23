import type { ReactNode } from "react";
import { Cincin, GrafisRumah } from "@/components/ui/Grafis";
import { cn } from "@/lib/utils";

/**
 * Kepala halaman aplikasi: panel bernada tint dengan satu grafis merek di sisi kanan, supaya halaman tidak
 * terasa polos. Judul halaman (<h1>) dan teks pengantar masuk lewat `children`; tombol aksi lewat `aksi`.
 *
 * variasi: "rumah" (keluarga di bawah atap), "cincin" (busur pelindung), "gelombang" (air dan bukit).
 * Pakai variasi berbeda di halaman berbeda supaya tidak monoton.
 */
export function AppHero({
  children,
  aksi,
  variasi = "rumah",
  className,
}: {
  children: ReactNode;
  aksi?: ReactNode;
  variasi?: "rumah" | "cincin" | "gelombang";
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden rounded-3xl bg-tint px-6 py-7 md:px-9 md:py-9", className)}>
      {variasi === "rumah" && (
        <GrafisRumah className="absolute -right-2 -bottom-1 hidden w-[230px] lg:block xl:right-6 xl:w-[260px]" />
      )}
      {variasi === "cincin" && <Cincin className="absolute top-0 right-0 hidden w-[340px] lg:block" />}
      {variasi === "gelombang" && (
        <svg
          viewBox="0 0 600 160"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[110px] w-full md:block"
          fill="none"
        >
          <path d="M0 96C90 56 170 56 260 92s170 38 250-4c40-20 70-26 90-24V160H0Z" fill="#10264a" fillOpacity="0.06" />
          <path d="M0 122C110 92 200 96 300 122s190 20 300-8V160H0Z" fill="#4f6b45" fillOpacity="0.14" />
          <path d="M0 144c120-18 240-16 360-4s170 8 240-6V160H0Z" fill="#bc5b34" fillOpacity="0.16" />
        </svg>
      )}
      <div className={cn("relative", variasi === "rumah" && "lg:max-w-[calc(100%-260px)]", variasi === "cincin" && "lg:max-w-[calc(100%-300px)]")}>
        {children}
        {aksi && <div className="mt-5 flex flex-wrap items-center gap-2.5">{aksi}</div>}
        {variasi === "gelombang" && <div className="hidden h-8 md:block" aria-hidden="true" />}
      </div>
    </section>
  );
}
