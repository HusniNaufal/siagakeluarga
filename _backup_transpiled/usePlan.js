import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export function useGeneratePlan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => api.post("/ai/plan"),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["household"] }),
    });
}
