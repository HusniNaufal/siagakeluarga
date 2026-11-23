import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { KelompokUmur } from "@/lib/types";

export type StatusKabar = "AMAN" | "BUTUH_BANTUAN";

export interface KabarItem {
  status: StatusKabar;
  waktu: string;
  lat: number | null;
  lng: number | null;
  pesan: string | null;
}

export interface KabarAnggota {
  id: string;
  panggilan: string;
  kelompok_umur: KelompokUmur;
  kabar: KabarItem | null;
}

export interface KabarRingkas {
  anggota: KabarAnggota[];
  lainnya: { nama: string; kabar: KabarItem | null }[];
  ringkasan: { aman: number; butuh_bantuan: number; belum: number };
}

export interface KirimKabarBody {
  member_id?: string;
  nama?: string;
  status: StatusKabar;
  lat?: number;
  lng?: number;
  pesan?: string;
}

/** Kabar keluarga di halaman tautan publik. Disegarkan tiap 15 detik agar yang lain terlihat tanpa memuat ulang. */
export function useKabarPublik(token: string | undefined) {
  return useQuery({
    queryKey: ["kabar", token],
    queryFn: () => api.get<KabarRingkas>(`/share/${token}/kabar`, undefined, false),
    enabled: !!token,
    refetchInterval: 15_000,
    retry: false,
  });
}

export function useKirimKabar(token: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: KirimKabarBody) => api.post<KabarRingkas>(`/share/${token}/checkin`, body, false),
    onSuccess: (data) => qc.setQueryData(["kabar", token], data),
  });
}

/** Kabar keluarga untuk pemilik rencana (butuh login). */
export function useKabarSaya() {
  return useQuery({
    queryKey: ["kabar-saya"],
    queryFn: () => api.get<KabarRingkas>("/kabar"),
    refetchInterval: 30_000,
  });
}

export function useKosongkanKabar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete<KabarRingkas>("/kabar"),
    onSuccess: (data) => qc.setQueryData(["kabar-saya"], data),
  });
}

/** "5 menit lalu", "2 jam lalu", dst. */
export function waktuRelatif(iso: string) {
  const selisih = Date.now() - new Date(iso).getTime();
  const menit = Math.round(selisih / 60_000);
  const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });
  if (menit < 1) return "baru saja";
  if (menit < 60) return rtf.format(-menit, "minute");
  const jam = Math.round(menit / 60);
  if (jam < 24) return rtf.format(-jam, "hour");
  return rtf.format(-Math.round(jam / 24), "day");
}
