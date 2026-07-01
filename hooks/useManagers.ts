import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { IManager } from "@/types/manager";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import { queryKeys } from "@/lib/queryKeys";

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
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);
    const activeBranch = useActiveCenterStore((s) => s.activeBranch);

    return useQuery<ManagersResult>({
        queryKey: queryKeys.managers.list({ page, pageSize, search, centerId: activeCenter, branchId: activeBranch }),
        queryFn: async () => {
            const res = await API.get(MANAGERS_URL, {
                params: {
                    page,
                    page_size: pageSize,
                    search: search || undefined,
                    center_id: activeCenter || undefined,
                    branch_id: activeBranch || undefined,
                },
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
