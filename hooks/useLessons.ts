import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { LessonsResponse } from "@/types/lesson";

const LESSONS_URL = "director/lessons/";
const GROUPS_URL = "director/groups/"; // guruh dropdown manbasi (tasdiqlang)

interface ListParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

export function useLessons({ page = 1, pageSize = 10, search = "" }: ListParams = {}) {
    return useQuery<LessonsResponse>({
        queryKey: ["lessons", { page, pageSize, search }],
        queryFn: async () => {
            const res = await API.get<LessonsResponse>(LESSONS_URL, {
                params: { page, page_size: pageSize, search: search || undefined },
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
    return useQuery<GroupOption[]>({
        queryKey: ["groups", "options"],
        queryFn: async () => {
            const res = await API.get(GROUPS_URL, { params: { page_size: 200 } });
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