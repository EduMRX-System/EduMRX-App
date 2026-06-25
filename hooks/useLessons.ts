import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { LessonsResponse } from "@/types/lesson";
import { useActiveCenterStore } from "@/store/activeCenterStore";

const LESSONS_URL = "director/lessons/";
const GROUPS_URL = "director/groups/";

interface ListParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

export function useLessons({ page = 1, pageSize = 10, search = "" }: ListParams = {}) {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);
    const activeBranch = useActiveCenterStore((s) => s.activeBranch);

    return useQuery<LessonsResponse>({
        queryKey: ["lessons", { page, pageSize, search, centerId: activeCenter, branchId: activeBranch }],
        queryFn: async () => {
            const res = await API.get<LessonsResponse>(LESSONS_URL, {
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

export interface GroupOption {
    id: string;
    label: string;
    description?: string;
}

export function useGroupOptions() {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);
    const activeBranch = useActiveCenterStore((s) => s.activeBranch);

    return useQuery<GroupOption[]>({
        queryKey: ["groups", "options", activeCenter, activeBranch],
        queryFn: async () => {
            const res = await API.get(GROUPS_URL, {
                params: {
                    page_size: 200,
                    center_id: activeCenter || undefined,
                    branch_id: activeBranch || undefined,
                },
            });
            const d: any = res.data;
            const list = Array.isArray(d) ? d : d?.results ?? d?.data ?? [];
            return list.map((g: any) => ({
                id: g.id,
                label: g.name,
                description: g.course_name,
            }));
        },
        staleTime: 5 * 60 * 1000,
    });
}
