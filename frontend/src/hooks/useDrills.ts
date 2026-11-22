import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Drill } from "@/lib/types";

const DRILLS_KEY = ["drills"] as const;

export function useDrills() {
  return useQuery({
    queryKey: DRILLS_KEY,
    queryFn: () => api.get<{ drills: Drill[]; rata_rata_skor: number | null }>("/drills"),
  });
}

export function useCreateDrill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { jadwal: string; skor?: number | null }) => api.post<Drill>("/drills", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: DRILLS_KEY }),
  });
}

export function useUpdateDrill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; jadwal?: string; skor?: number | null }) =>
      api.patch<Drill>(`/drills/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: DRILLS_KEY }),
  });
}
