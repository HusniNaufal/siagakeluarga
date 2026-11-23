import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
const KIT_KEY = ["kit"];
export function useKit() {
    return useQuery({
        queryKey: KIT_KEY,
        queryFn: () => api.get("/kit"),
    });
}
export function useAddKitItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body) => api.post("/kit", body),
        onSuccess: () => qc.invalidateQueries({ queryKey: KIT_KEY }),
    });
}
export function useUpdateKitItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...body }) => api.patch(`/kit/${id}`, body),
        onSuccess: () => qc.invalidateQueries({ queryKey: KIT_KEY }),
    });
}
export function useDeleteKitItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.delete(`/kit/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: KIT_KEY }),
    });
}
