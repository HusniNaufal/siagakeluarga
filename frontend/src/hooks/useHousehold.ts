import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Household, KelompokUmur, Member } from "@/lib/types";

const HOUSEHOLD_KEY = ["household"] as const;

export function useHousehold() {
  return useQuery({
    queryKey: HOUSEHOLD_KEY,
    queryFn: () => api.get<Household>("/household"),
  });
}

export function useUpdateHousehold() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { region_id?: number | null; lat?: number | null; lng?: number | null; regenerate_share_token?: boolean }) =>
      api.put<Household>("/household", body),
    onSuccess: (data) => qc.setQueryData(HOUSEHOLD_KEY, data),
  });
}

export function useAddMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { panggilan: string; kelompok_umur: KelompokUmur; kebutuhan_khusus?: string | null }) =>
      api.post<Member>("/household/members", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: HOUSEHOLD_KEY }),
  });
}

export function useUpdateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; panggilan?: string; kelompok_umur?: KelompokUmur; kebutuhan_khusus?: string | null }) =>
      api.put<Member>(`/household/members/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: HOUSEHOLD_KEY }),
  });
}

export function useDeleteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<null>(`/household/members/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: HOUSEHOLD_KEY }),
  });
}
