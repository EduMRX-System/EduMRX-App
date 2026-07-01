import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { GroupDetail, GroupsResponse } from "@/types/group";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import { queryKeys } from "@/lib/queryKeys";

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
        queryKey: queryKeys.groups.list({ page, pageSize, search, centerId: activeCenter, branchId: activeBranch, role }),
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

export function useGroupDetail(id: string | undefined, role: "director" | "manager" = "director") {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);
    return useQuery<GroupDetail>({
        queryKey: queryKeys.groups.detail(id, role, activeCenter),
        queryFn: async () => {
            const res = await API.get<GroupDetail>(`${role}/groups/${id}/`);
            return res.data;
        },
        enabled: !!id,
        staleTime: 60 * 1000,
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

// Teacher response: { id, user: { full_name, phone, first_name, last_name }, ... }
function mapTeacherOptions(results: any[]): Option[] {
    return (results ?? []).map((r) => {
        const nameParts = [r.user?.first_name ?? r.first_name, r.user?.last_name ?? r.last_name]
            .filter(Boolean)
            .join(" ");
        const fullName =
            r.user?.full_name ??
            r.full_name ??
            (nameParts || String(r.id));
        const phone = r.user?.phone ?? r.phone ?? "";
        return {
            id: r.id,
            label: phone ? `${fullName} — ${phone}` : fullName,
        };
    });
}

function useOptions(
    key: string,
    url: string,
    enabled = true,
    role: "director" | "manager" = "director",
    branchId?: string,
    mapper: (results: any[]) => Option[] = mapOptions,
) {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);
    const activeBranch = useActiveCenterStore((s) => s.activeBranch);
    const effectiveBranch = branchId !== undefined ? branchId : activeBranch;

    return useQuery({
        queryKey: [key, "options", activeCenter, effectiveBranch, role],
        queryFn: async () => {
            const res = await API.get(`${role}/${url}`, {
                params: {
                    page_size: 200,
                    center_id: activeCenter || undefined,
                    branch_id: effectiveBranch || undefined,
                },
            });
            const results = Array.isArray(res.data)
                ? res.data
                : res.data?.results ?? res.data?.data ?? [];
            return mapper(results);
        },
        enabled,
        staleTime: 5 * 60 * 1000,
    });
}

export const useCourseOptions = (enabled = true, role: "director" | "manager" = "director", branchId?: string) => useOptions("course", "courses/", enabled, role, branchId);
export const useTeacherOptions = (enabled = true, role: "director" | "manager" = "director", branchId?: string) => useOptions("teacher", "teachers/", enabled, role, branchId, mapTeacherOptions);
export const useRoomOptions = (enabled = true, role: "director" | "manager" = "director", branchId?: string) => useOptions("room", "rooms/", enabled, role, branchId);

// Payments/Debts kabi formalardagi "guruhni tanlash" inline pickerlari uchun —
// bir xil search+center bo'yicha alohida-alohida so'ralmasin deb bitta umumiy
// key ostida ishlaydi (queryKeys.groups.searchOptions).
export function useGroupSearchOptions(search: string, enabled: boolean, role: "director" | "manager" = "director") {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);

    return useQuery<{ id: string; name: string }[]>({
        queryKey: queryKeys.groups.searchOptions({ search, centerId: activeCenter, role }),
        queryFn: async () => {
            const res = await API.get(`${role}/groups/`, {
                params: { search: search || undefined, center_id: activeCenter || undefined, page_size: 30 },
            });
            const d: any = res.data;
            const list = Array.isArray(d) ? d : d?.results ?? [];
            return list.map((g: any) => ({ id: String(g.id), name: g.name ?? String(g.id) }));
        },
        enabled,
        staleTime: 30000,
    });
}
