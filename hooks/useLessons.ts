import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { LessonsResponse } from "@/types/lesson";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import { queryKeys } from "@/lib/queryKeys";

interface ListParams {
    page?: number;
    pageSize?: number;
    search?: string;
    date?: string;
    role?: "director" | "manager";
}

export function useLessons({ page = 1, pageSize = 10, search = "", date, role = "director" }: ListParams = {}) {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);
    const activeBranch = useActiveCenterStore((s) => s.activeBranch);

    return useQuery<LessonsResponse>({
        queryKey: queryKeys.lessons.list({ page, pageSize, search, date, centerId: activeCenter, branchId: activeBranch, role }),
        queryFn: async () => {
            const res = await API.get<LessonsResponse>(`${role}/lessons/`, {
                params: {
                    page,
                    page_size: pageSize,
                    search: search || undefined,
                    date: date || undefined,
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

export function useGroupOptions(role: "director" | "manager" = "director") {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);
    const activeBranch = useActiveCenterStore((s) => s.activeBranch);

    return useQuery<GroupOption[]>({
        queryKey: queryKeys.groups.options(activeCenter, activeBranch, role),
        queryFn: async () => {
            const res = await API.get(`${role}/groups/`, {
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
