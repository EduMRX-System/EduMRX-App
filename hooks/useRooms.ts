import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import { RoomsResponse } from "@/types/room";

const ROOMS_URL = "director/rooms/";

interface ListParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

export function useRooms({ page = 1, pageSize = 10, search = "" }: ListParams = {}) {
    return useQuery<RoomsResponse>({
        queryKey: ["rooms", { page, pageSize, search }],
        queryFn: async () => {
            const res = await API.get<RoomsResponse>(ROOMS_URL, {
                params: { page, page_size: pageSize, search: search || undefined },
            });
            return res.data;
        },
        placeholderData: (prev) => prev,
    });
}