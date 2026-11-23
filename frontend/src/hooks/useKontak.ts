import { useCallback, useSyncExternalStore } from "react";

/**
 * Kontak darurat yang diisi pengguna (RT, puskesmas, BPBD setempat, keluarga besar).
 *
 * SEMENTARA disimpan di perangkat ini saja (localStorage), karena backend belum punya
 * model kontak. Akibatnya kontak tidak ikut ke perangkat lain dan tidak muncul di tautan
 * bagikan. Pindahkan ke backend (model Contact + endpoint) untuk perilaku penuh.
 */
export interface KontakKeluarga {
  id: string;
  nama: string;
  nomor: string;
}

const KEY = "siagakeluarga.kontak";
const listeners = new Set<() => void>();
let cache: KontakKeluarga[] | null = null;

function read(): KontakKeluarga[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: KontakKeluarga[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Penyimpanan penuh/dimatikan: kontak tetap ada selama halaman terbuka.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Nomor untuk href tel: hanya angka dan tanda +. */
export function telHref(nomor: string) {
  return `tel:${nomor.replace(/[^\d+]/g, "")}`;
}

export function useKontakKeluarga() {
  const kontak = useSyncExternalStore(subscribe, read, () => []);

  const tambah = useCallback((nama: string, nomor: string) => {
    write([...read(), { id: crypto.randomUUID(), nama: nama.trim(), nomor: nomor.trim() }]);
  }, []);

  const hapus = useCallback((id: string) => {
    write(read().filter((k) => k.id !== id));
  }, []);

  return { kontak, tambah, hapus };
}
