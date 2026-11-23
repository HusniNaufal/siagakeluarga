import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
const DRILLS_KEY = ["drills"];
export function useDrills() {
    return useQuery({
        queryKey: DRILLS_KEY,
        queryFn: () => api.get("/drills"),
    });
}
export function useCreateDrill() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body) => api.post("/drills", body),
        onSuccess: () => qc.invalidateQueries({ queryKey: DRILLS_KEY }),
    });
}
export function useUpdateDrill() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...body }) => api.patch(`/drills/${id}`, body),
        onSuccess: () => qc.invalidateQueries({ queryKey: DRILLS_KEY }),
    });
}
