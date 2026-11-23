import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Region, RiskData } from "@/lib/types";

export function useRisk(
  params?: { region_id?: number; lat?: number; lng?: number },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["risk", params],
    queryFn: () => api.get<RiskData>("/risk", params),
    enabled: options?.enabled ?? true,
  });
}

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: () => api.get<Region[]>("/regions", undefined, false),
  });
}
