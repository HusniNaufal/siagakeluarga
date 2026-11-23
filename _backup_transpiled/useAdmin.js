import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
// ---------- Panduan ----------
export function useAdminGuides() {
    return useQuery({ queryKey: ["admin", "guides"], queryFn: () => api.get("/admin/guides") });
}
export function useCreateGuide() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body) => api.post("/admin/guides", body),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "guides"] }),
    });
}
export function useDeleteGuide() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.delete(`/admin/guides/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "guides"] }),
    });
}
export function useReindexGuides() {
    return useMutation({
        mutationFn: () => api.post("/admin/reindex-guides"),
    });
}
// ---------- Zona bahaya ----------
export function useAdminHazardZones() {
    return useQuery({ queryKey: ["admin", "hazard-zones"], queryFn: () => api.get("/admin/hazard-zones") });
}
export function useCreateHazardZone() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body) => api.post("/admin/hazard-zones", body),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "hazard-zones"] }),
    });
}
export function useDeleteHazardZone() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.delete(`/admin/hazard-zones/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "hazard-zones"] }),
    });
}
// ---------- Titik kumpul ----------
export function useAdminAssemblyPoints() {
    return useQuery({ queryKey: ["admin", "assembly-points"], queryFn: () => api.get("/admin/assembly-points") });
}
export function useCreateAssemblyPoint() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body) => api.post("/admin/assembly-points", body),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "assembly-points"] }),
    });
}
export function useDeleteAssemblyPoint() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.delete(`/admin/assembly-points/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "assembly-points"] }),
    });
}
