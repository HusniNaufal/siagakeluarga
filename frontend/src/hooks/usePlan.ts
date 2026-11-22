import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { EmergencyPlan } from "@/lib/types";

export function useGeneratePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<EmergencyPlan>("/ai/plan"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["household"] }),
  });
}
