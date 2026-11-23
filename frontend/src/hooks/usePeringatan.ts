import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface TelegramStatus {
  tersedia: boolean;
  terhubung: boolean;
  bot: string | null;
}

export type PeringatanData =
  | {
      tersedia: true;
      tingkat: "aman" | "waspada" | "bahaya";
      ringkasan: string;
      /** Kalimat siap kirim; null bila tidak ada yang perlu dikirim (status aman). */
      kalimat: string | null;
      wilayah: string;
      telegram: TelegramStatus;
    }
  | { tersedia: false; alasan: string; telegram: TelegramStatus };

/** Pengingat bersiap untuk rumah pengguna, dari prakiraan BMKG di lokasinya. */
export function usePeringatan(lat?: number | null, lng?: number | null) {
  return useQuery({
    queryKey: ["peringatan", lat, lng],
    queryFn: () => api.get<PeringatanData>("/peringatan"),
    staleTime: 30_000,
  });
}

export function useKodeTelegram() {
  return useMutation({
    mutationFn: () => api.post<{ kode: string; bot: string | null }>("/peringatan/telegram/kode"),
  });
}

export function usePutuskanTelegram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete<null>("/peringatan/telegram"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["peringatan"] }),
  });
}
