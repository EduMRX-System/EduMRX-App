import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { BranchesResponse } from "@/types/branch";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import { queryKeys } from "@/lib/queryKeys";

const BRANCHES_URL = "center/branches/";

interface BranchListParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

export function useBranches({ page = 1, pageSize = 10, search = "" }: BranchListParams = {}) {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);

    return useQuery<BranchesResponse>({
        queryKey: queryKeys.branches.list({ page, pageSize, search, centerId: activeCenter }),
        queryFn: async () => {
            const res = await API.get<BranchesResponse>(BRANCHES_URL, {
                params: {
                    page,
                    page_size: pageSize,
                    search: search || undefined,
                    center_id: activeCenter || undefined,
                },
            });
            return res.data;
        },
        placeholderData: (prev) => prev,
    });
}

export interface BranchOption {
    id: string;
    label: string;
    description?: string;
}

export function useBranchOptions() {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);

    return useQuery<BranchOption[]>({
        queryKey: queryKeys.branches.options(activeCenter),
        queryFn: async () => {
            const res = await API.get(BRANCHES_URL, {
                params: {
                    page_size: 200,
                    center_id: activeCenter || undefined,
                },
            });
            const d: any = res.data;
            const list = Array.isArray(d) ? d : d?.data ?? d?.results ?? [];
            return list.map((b: any) => ({
                id: b.id,
                label: b.name,
                description: b.address,
            }));
        },
        staleTime: 5 * 60 * 1000,
    });
}
