import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import { RoomsResponse } from "@/types/room";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import { queryKeys } from "@/lib/queryKeys";

export function useRoomCapacities(role: "director" | "manager" = "director") {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);
    const activeBranch = useActiveCenterStore((s) => s.activeBranch);

    return useQuery<Record<string, number>>({
        queryKey: queryKeys.rooms.capacities(activeCenter, activeBranch, role),
        queryFn: async () => {
            const res = await API.get<RoomsResponse>(`${role}/rooms/`, {
                params: {
                    page_size: 200,
                    center_id: activeCenter || undefined,
                    branch_id: activeBranch || undefined,
                },
            });
            const rooms = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
            return Object.fromEntries(rooms.map((r) => [r.id, r.capacity]));
        },
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
    });
}

interface ListParams {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: "director" | "manager";
}

export function useRooms({ page = 1, pageSize = 10, search = "", role = "director" }: ListParams = {}) {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);
    const activeBranch = useActiveCenterStore((s) => s.activeBranch);

    return useQuery<RoomsResponse>({
        queryKey: queryKeys.rooms.list({ page, pageSize, search, centerId: activeCenter, branchId: activeBranch, role }),
        queryFn: async () => {
            const res = await API.get<RoomsResponse>(`${role}/rooms/`, {
                params: {
                    page,
                    page_size: pageSize,
                    search: search || undefined,
                    center_id: activeCenter || undefined,
                    branch_id: activeBranch || undefined,
                },
            });
            return res.data;
        },
        placeholderData: (prev) => prev,
    });
}
