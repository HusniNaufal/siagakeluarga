import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AskResponse, AskRiwayat } from "@/lib/types";

export function useAsk() {
  return useMutation({
    mutationFn: ({ pertanyaan, riwayat }: { pertanyaan: string; riwayat?: AskRiwayat[] }) =>
      api.post<AskResponse>("/ai/ask", { pertanyaan, riwayat }),
  });
}
