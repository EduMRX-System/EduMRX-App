import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { GroupsResponse } from "@/types/group";

// ⚠️ MUHIM: director/courses/ aslida KURSLAR. Guruhlar boshqa endpointda —
// ehtimol "director/groups/". Swagger'dan tasdiqlab, shu yerni to'g'rilang.
const GROUPS_URL = "director/groups/"; // ← TODO: tasdiqlang (courses EMAS)

// Dropdown manbalari:
const COURSES_URL = "director/courses/"; // ✅ tasdiqlandi — kurs katalogi
const TEACHERS_URL = "director/teachers/"; // ← TODO: tasdiqlang
const ROOMS_URL = "director/rooms/";       // ← TODO: tasdiqlang

interface ListParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

export function useGroups({ page = 1, pageSize = 10, search = "" }: ListParams) {
    return useQuery({
        queryKey: ["groups", { page, pageSize, search }],
        queryFn: async () => {
            const res = await API.get<GroupsResponse>(GROUPS_URL, {
                params: { page, page_size: pageSize, search: search || undefined },
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

// Universal option-loader: turli endpointlarning {id, name/full_name/...} ni {id,label} ga keltiradi
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

function useOptions(key: string, url: string, enabled = true) {
    return useQuery({
        queryKey: [key, "options"],
        queryFn: async () => {
            const res = await API.get(url, { params: { page_size: 200 } });
            // DRF paginated yoki to'g'ridan-to'g'ri massiv bo'lishi mumkin
            const results = Array.isArray(res.data) ? res.data : res.data?.results ?? res.data?.data ?? [];
            return mapOptions(results);
        },
        enabled,
        staleTime: 5 * 60 * 1000,
    });
}

export const useCourseOptions = (enabled = true) => useOptions("course", COURSES_URL, enabled);
export const useTeacherOptions = (enabled = true) => useOptions("teacher", TEACHERS_URL, enabled);
export const useRoomOptions = (enabled = true) => useOptions("room", ROOMS_URL, enabled);