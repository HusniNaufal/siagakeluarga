import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AskResponse } from "@/lib/types";

export function useAsk() {
  return useMutation({
    mutationFn: (pertanyaan: string) => api.post<AskResponse>("/ai/ask", { pertanyaan }),
  });
}
