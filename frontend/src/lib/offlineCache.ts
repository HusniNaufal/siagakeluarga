// Cache lokal (localStorage) untuk Mode Darurat.
//
// Gunanya: layar "Bencana Sekarang" harus tetap berfungsi ketika jaringan mati.
// Data yang diambil dari backend (titik kumpul, anggota keluarga) disimpan ke
// perangkat setiap kali berhasil dimuat, lalu dipakai sebagai cadangan saat
// offline atau server tidak terjangkau.
//
// Yang disimpan HANYA data yang sudah ada di perangkat pengguna — tidak ada
// kredensial di sini. Token JWT tetap diurus oleh lib/api.ts.

const PREFIX = "siagakeluarga.offline.";

export interface CacheEntry<T> {
  data: T;
  /** Epoch ms saat data ini disimpan. */
  savedAt: number;
}

export function readOffline<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (!parsed || typeof parsed.savedAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeOffline<T>(key: string, data: T) {
  try {
    const entry: CacheEntry<T> = { data, savedAt: Date.now() };
    localStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // Kuota penuh atau storage diblokir — mode darurat tetap jalan tanpa cache.
  }
}

export function clearOffline(key: string) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // diabaikan
  }
}

/** Kunci cache yang dipakai aplikasi (tetap sentral supaya tidak typo). */
export const CACHE_KEYS = {
  titikKumpul: "titik-kumpul",
  anggota: "anggota-keluarga",
  checklist: "checklist-darurat",
} as const;
