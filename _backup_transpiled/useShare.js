import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
export function useShareCard(token) {
    return useQuery({
        queryKey: ["share", token],
        queryFn: () => api.get(`/share/${token}`, undefined, false),
        enabled: !!token,
        retry: false,
    });
}
