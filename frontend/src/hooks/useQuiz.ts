import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { JenisBencana, QuizShape } from "@/lib/types";

export function useGenerateQuiz() {
  return useMutation({
    mutationFn: (jenis_bencana?: JenisBencana) => api.post<QuizShape>("/ai/quiz", { jenis_bencana }),
  });
}
