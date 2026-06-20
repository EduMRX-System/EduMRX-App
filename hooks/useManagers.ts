import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { IManager } from "@/types/manager";

const MANAGERS_URL = "director/admins/";

export interface ManagersResult {
    results: IManager[];
    count: number;
    next: string | null;
    previous: string | null;
}

interface ListParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

export function useManagers({ page = 1, pageSize = 10, search = "" }: ListParams = {}) {
    return useQuery<ManagersResult>({
        queryKey: ["managers", { page, pageSize, search }],
        queryFn: async () => {
            const res = await API.get(MANAGERS_URL, {
                params: { page, page_size: pageSize, search: search || undefined },
            });
            const d: any = res.data;
            if (Array.isArray(d)) return { results: d, count: d.length, next: null, previous: null };
            return {
                results: d?.results ?? d?.data ?? [],
                count: d?.count ?? (d?.results?.length ?? d?.data?.length ?? 0),
                next: d?.next ?? null,
                previous: d?.previous ?? null,
            };
        },
        placeholderData: (prev) => prev,
    });
}