import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
const HOUSEHOLD_KEY = ["household"];
export function useHousehold() {
    return useQuery({
        queryKey: HOUSEHOLD_KEY,
        queryFn: () => api.get("/household"),
    });
}
export function useUpdateHousehold() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body) => api.put("/household", body),
        onSuccess: (data) => qc.setQueryData(HOUSEHOLD_KEY, data),
    });
}
export function useAddMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body) => api.post("/household/members", body),
        onSuccess: () => qc.invalidateQueries({ queryKey: HOUSEHOLD_KEY }),
    });
}
export function useUpdateMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...body }) => api.put(`/household/members/${id}`, body),
        onSuccess: () => qc.invalidateQueries({ queryKey: HOUSEHOLD_KEY }),
    });
}
export function useDeleteMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.delete(`/household/members/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: HOUSEHOLD_KEY }),
    });
}
