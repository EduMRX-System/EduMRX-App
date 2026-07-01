import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import { CoursesResponse } from "@/types/course";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import { queryKeys } from "@/lib/queryKeys";

interface ListParams {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: "director" | "manager";
}

export function useCourses({ page = 1, pageSize = 10, search = "", role = "director" }: ListParams) {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);
    const activeBranch = useActiveCenterStore((s) => s.activeBranch);

    return useQuery({
        queryKey: queryKeys.courses.list({ page, pageSize, search, centerId: activeCenter, branchId: activeBranch, role }),
        queryFn: async () => {
            const res = await API.get<CoursesResponse>(`${role}/courses/`, {
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
