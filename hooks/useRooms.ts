import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import { RoomsResponse } from "@/types/room";
import { useActiveCenterStore } from "@/store/activeCenterStore";

const ROOMS_URL = "director/rooms/";

interface ListParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

export function useRooms({ page = 1, pageSize = 10, search = "" }: ListParams = {}) {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);
    const activeBranch = useActiveCenterStore((s) => s.activeBranch);

    return useQuery<RoomsResponse>({
        queryKey: ["rooms", { page, pageSize, search, centerId: activeCenter, branchId: activeBranch }],
        queryFn: async () => {
            const res = await API.get<RoomsResponse>(ROOMS_URL, {
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
