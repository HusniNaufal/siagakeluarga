import { useCallback, useEffect, useSyncExternalStore } from "react";

/**
 * Lokasi pengguna untuk landing page. Dibagikan lewat store kecil supaya Hero dan
 * section cuaca memakai lokasi yang sama tanpa meminta izin dua kali.
 *
 * Aturan izin: browser TIDAK ditanya otomatis saat halaman dibuka (mengganggu dan sering
 * ditolak). Lokasi dibaca otomatis hanya bila izin sudah pernah diberikan; selain itu
 * ditampilkan lokasi contoh dan pengguna menekan tombol "Pakai lokasiku".
 */

export type LokasiStatus =
  | "contoh" // belum ada lokasi pengguna; tidak ada data yang dimuat
  | "meminta" // sedang menunggu izin/GPS
  | "gps" // lokasi pengguna berhasil dibaca
  | "dipilih" // pengguna mencari dan memilih tempat sendiri
  | "ditolak" // izin ditolak
  | "gagal" // GPS gagal (timeout/tidak tersedia)
  | "tidak-didukung";

export interface LokasiState {
  status: LokasiStatus;
  lat: number;
  lng: number;
}

// Hanya nilai awal agar tipe state lengkap. TIDAK PERNAH dipakai untuk memuat data: cuaca baru diminta
// setelah status "gps" atau "dipilih".
export const LOKASI_CONTOH = { lat: -6.9847, lng: 107.6258 };

let state: LokasiState = { status: "contoh", ...LOKASI_CONTOH };
const listeners = new Set<() => void>();

function set(next: LokasiState) {
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function requestPosition() {
  if (!("geolocation" in navigator)) {
    set({ ...state, status: "tidak-didukung" });
    return;
  }
  set({ ...state, status: "meminta" });
  navigator.geolocation.getCurrentPosition(
    (pos) =>
      set({
        status: "gps",
        // ~1 km cukup untuk prakiraan per desa; tidak perlu menyimpan titik presisi.
        lat: Number(pos.coords.latitude.toFixed(3)),
        lng: Number(pos.coords.longitude.toFixed(3)),
      }),
    (err) =>
      set({
        ...LOKASI_CONTOH,
        status: err.code === err.PERMISSION_DENIED ? "ditolak" : "gagal",
      }),
    { enableHighAccuracy: false, timeout: 10_000, maximumAge: 10 * 60_000 },
  );
}

let autoTried = false;

export function useLokasi() {
  const lokasi = useSyncExternalStore(subscribe, () => state);

  // Baca otomatis hanya kalau izin sudah diberikan sebelumnya.
  useEffect(() => {
    if (autoTried) return;
    autoTried = true;
    if (!("permissions" in navigator) || !("geolocation" in navigator)) return;
    navigator.permissions
      .query({ name: "geolocation" })
      .then((p) => {
        if (p.state === "granted") requestPosition();
      })
      .catch(() => {});
  }, []);

  const minta = useCallback(() => requestPosition(), []);
  const pilih = useCallback((lat: number, lng: number) => {
    set({ status: "dipilih", lat: Number(lat.toFixed(3)), lng: Number(lng.toFixed(3)) });
  }, []);
  return { ...lokasi, minta, pilih };
}
