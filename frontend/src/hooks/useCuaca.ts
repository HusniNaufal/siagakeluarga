import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CuacaEntri {
  waktu_lokal: string;
  suhu_c: number;
  cuaca: string;
  kelembapan: number | null;
  kecepatan_angin_kmj: number | null;
  curah_hujan_mm: number;
}

export interface CuacaHarian {
  tanggal: string;
  suhu_min_c: number | null;
  suhu_maks_c: number | null;
  curah_hujan_mm: number;
  cuaca: string;
}

export interface CuacaStatus {
  tingkat: "aman" | "waspada" | "bahaya";
  waktu_lokal: string | null;
  cuaca: string | null;
  curah_hujan_mm: number | null;
}

export interface CuacaData {
  wilayah: {
    kode: string;
    desa: string | null;
    kecamatan: string | null;
    kotkab: string | null;
    provinsi: string | null;
    tepat: boolean;
  };
  cuaca:
    | {
        tersedia: true;
        sumber: "BMKG";
        diperbarui: string | null;
        status: CuacaStatus;
        saat_ini: CuacaEntri;
        prakiraan: CuacaEntri[];
        harian: CuacaHarian[];
      }
    | { tersedia: false; alasan: string; sumber: "BMKG" };
}

/** Prakiraan BMKG untuk desa/kelurahan di sekitar koordinat. Publik, tanpa login. */
export function useCuaca(lat: number, lng: number, enabled = true) {
  return useQuery({
    queryKey: ["cuaca", lat, lng],
    queryFn: () => api.get<CuacaData>("/cuaca", { lat, lng }, false),
    staleTime: 10 * 60_000,
    retry: 1,
    enabled,
  });
}

/** "2026-11-23 09:00:00" -> "09:00" */
export function jamDari(waktuLokal: string | null | undefined) {
  return waktuLokal ? waktuLokal.slice(11, 16) : "";
}

/** "2026-11-23" -> "Senin" */
export function namaHari(tanggal: string) {
  return new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(new Date(`${tanggal}T12:00:00`));
}
