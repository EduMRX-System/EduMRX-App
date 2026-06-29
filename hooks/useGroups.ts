import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { GroupsResponse } from "@/types/group";
import { useActiveCenterStore } from "@/store/activeCenterStore";

interface ListParams {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: "director" | "manager";
}

export function useGroups({ page = 1, pageSize = 10, search = "", role = "director" }: ListParams) {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);
    const activeBranch = useActiveCenterStore((s) => s.activeBranch);

    return useQuery({
        queryKey: ["groups", { page, pageSize, search, centerId: activeCenter, branchId: activeBranch, role }],
        queryFn: async () => {
            const res = await API.get<GroupsResponse>(`${role}/groups/`, {
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

export interface Option {
    id: string;
    label: string;
}

function mapOptions(results: any[]): Option[] {
    return (results ?? []).map((r) => ({
        id: r.id,
        label:
            r.name ??
            r.full_name ??
            [r.first_name, r.last_name].filter(Boolean).join(" ") ??
            r.title ??
            String(r.id),
    }));
}

function useOptions(key: string, url: string, enabled = true, role: "director" | "manager" = "director") {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);
    const activeBranch = useActiveCenterStore((s) => s.activeBranch);

    return useQuery({
        queryKey: [key, "options", activeCenter, activeBranch, role],
        queryFn: async () => {
            const res = await API.get(`${role}/${url}`, {
                params: {
                    page_size: 200,
                    center_id: activeCenter || undefined,
                    branch_id: activeBranch || undefined,
                },
            });
            const results = Array.isArray(res.data)
                ? res.data
                : res.data?.results ?? res.data?.data ?? [];
            return mapOptions(results);
        },
        enabled,
        staleTime: 5 * 60 * 1000,
    });
}

export const useCourseOptions = (enabled = true, role: "director" | "manager" = "director") => useOptions("course", "courses/", enabled, role);
export const useTeacherOptions = (enabled = true, role: "director" | "manager" = "director") => useOptions("teacher", "teachers/", enabled, role);
export const useRoomOptions = (enabled = true, role: "director" | "manager" = "director") => useOptions("room", "rooms/", enabled, role);
