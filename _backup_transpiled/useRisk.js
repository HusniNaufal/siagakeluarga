import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
export function useRisk(params) {
    return useQuery({
        queryKey: ["risk", params],
        queryFn: () => api.get("/risk", params),
    });
}
export function useRegions() {
    return useQuery({
        queryKey: ["regions"],
        queryFn: () => api.get("/regions", undefined, false),
    });
}
