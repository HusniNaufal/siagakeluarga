import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface HasilLokasi {
  nama: string;
  lengkap: string;
  lat: number;
  lng: number;
}

/** Cari tempat di Indonesia berdasarkan nama. Dipanggil saat pengguna menekan cari, bukan per ketikan. */
export function useCariLokasi() {
  return useMutation({
    mutationFn: (q: string) => api.get<HasilLokasi[]>("/lokasi/cari", { q }, false),
  });
}
