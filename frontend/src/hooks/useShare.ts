import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ShareCard } from "@/lib/types";

export function useShareCard(token: string | undefined) {
  return useQuery({
    queryKey: ["share", token],
    queryFn: () => api.get<ShareCard>(`/share/${token}`, undefined, false),
    enabled: !!token,
    retry: false,
  });
}
