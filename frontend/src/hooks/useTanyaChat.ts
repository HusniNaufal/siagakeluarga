import { useCallback, useSyncExternalStore } from "react";
import { api } from "@/lib/api";
import type { AskResponse, AskRiwayat, PesanTanya } from "@/lib/types";

// Store percakapan bersama: halaman /tanya dan widget melayang memakai riwayat yang sama,
// disimpan di sessionStorage supaya tidak hilang saat pindah halaman.
const KEY = "siagakeluarga.tanya";

function muat(): PesanTanya[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PesanTanya[]) : [];
  } catch {
    return [];
  }
}

interface State {
  messages: PesanTanya[];
  pending: boolean;
}

let state: State = { messages: muat(), pending: false };
const listeners = new Set<() => void>();

function setState(next: Partial<State>) {
  state = { ...state, ...next };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state.messages.slice(-30)));
  } catch {
    // penyimpanan penuh / mode privat: abaikan
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const id = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

export function useTanyaChat() {
  const snap = useSyncExternalStore(subscribe, () => state);

  const send = useCallback(async (text: string) => {
    const pertanyaan = text.trim();
    if (!pertanyaan || state.pending) return;

    const riwayat: AskRiwayat[] = state.messages
      .filter((m) => !m.galat)
      .slice(-10)
      .map((m) => ({ role: m.role, text: m.text }));

    setState({ messages: [...state.messages, { id: id(), role: "user", text: pertanyaan }], pending: true });

    try {
      const res = await api.post<AskResponse>("/ai/ask", { pertanyaan, riwayat });
      setState({
        messages: [...state.messages, { id: id(), role: "ai", text: res.jawaban, referensi: res.referensi }],
        pending: false,
      });
    } catch (err) {
      const pesan = err instanceof Error && err.message ? err.message : "Asisten belum bisa menjawab sekarang.";
      setState({
        messages: [
          ...state.messages,
          {
            id: id(),
            role: "ai",
            galat: true,
            text: `${pesan} Kalau keadaan darurat, hubungi 112 dan ikuti arahan petugas di tempat.`,
          },
        ],
        pending: false,
      });
    }
  }, []);

  const reset = useCallback(() => setState({ messages: [] }), []);

  return { messages: snap.messages, pending: snap.pending, send, reset };
}
