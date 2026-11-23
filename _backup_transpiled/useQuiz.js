import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
export function useGenerateQuiz() {
    return useMutation({
        mutationFn: (jenis_bencana) => api.post("/ai/quiz", { jenis_bencana }),
    });
}
