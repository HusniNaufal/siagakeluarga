import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdminGuide, AssemblyPointWithRegion, HazardZoneWithRegion, JenisBencana, TingkatRisiko } from "@/lib/types";

// ---------- Panduan ----------
export function useAdminGuides() {
  return useQuery({ queryKey: ["admin", "guides"], queryFn: () => api.get<AdminGuide[]>("/admin/guides") });
}
export function useCreateGuide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { sumber: string; isi: string }) => api.post<AdminGuide>("/admin/guides", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "guides"] }),
  });
}
export function useDeleteGuide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<null>(`/admin/guides/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "guides"] }),
  });
}
export function useReindexGuides() {
  return useMutation({
    mutationFn: () => api.post<{ total: number; indexed: number; failed: { id: number; error: string }[] }>("/admin/reindex-guides"),
  });
}

// ---------- Zona bahaya ----------
export function useAdminHazardZones() {
  return useQuery({ queryKey: ["admin", "hazard-zones"], queryFn: () => api.get<HazardZoneWithRegion[]>("/admin/hazard-zones") });
}
export function useCreateHazardZone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { region_id: number; jenis_bencana: JenisBencana; tingkat: TingkatRisiko; sumber: string }) =>
      api.post<HazardZoneWithRegion>("/admin/hazard-zones", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "hazard-zones"] }),
  });
}
export function useDeleteHazardZone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<null>(`/admin/hazard-zones/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "hazard-zones"] }),
  });
}

// ---------- Titik kumpul ----------
export function useAdminAssemblyPoints() {
  return useQuery({ queryKey: ["admin", "assembly-points"], queryFn: () => api.get<AssemblyPointWithRegion[]>("/admin/assembly-points") });
}
export function useCreateAssemblyPoint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { region_id: number; nama: string; lat: number; lng: number }) =>
      api.post<AssemblyPointWithRegion>("/admin/assembly-points", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "assembly-points"] }),
  });
}
export function useDeleteAssemblyPoint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<null>(`/admin/assembly-points/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "assembly-points"] }),
  });
}
