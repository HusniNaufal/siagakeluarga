import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { KesiapanTas, KitItem } from "@/lib/types";

const KIT_KEY = ["kit"] as const;

export function useKit() {
  return useQuery({
    queryKey: KIT_KEY,
    queryFn: () => api.get<{ items: KitItem[]; kesiapan: KesiapanTas }>("/kit"),
  });
}

export function useAddKitItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { nama_item: string; status?: boolean; kadaluarsa?: string | null }) =>
      api.post<KitItem>("/kit", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: KIT_KEY }),
  });
}

export function useUpdateKitItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; nama_item?: string; status?: boolean; kadaluarsa?: string | null }) =>
      api.patch<KitItem>(`/kit/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: KIT_KEY }),
  });
}

export function useDeleteKitItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<null>(`/kit/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KIT_KEY }),
  });
}
