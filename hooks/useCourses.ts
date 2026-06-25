import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import { CoursesResponse } from "@/types/course";
import { useActiveCenterStore } from "@/store/activeCenterStore";

const COURSES_URL = "director/courses/";

interface ListParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

export function useCourses({ page = 1, pageSize = 10, search = "" }: ListParams) {
    const activeCenter = useActiveCenterStore((s) => s.activeCenter);
    const activeBranch = useActiveCenterStore((s) => s.activeBranch);

    return useQuery({
        queryKey: ["courses", { page, pageSize, search, centerId: activeCenter, branchId: activeBranch }],
        queryFn: async () => {
            const res = await API.get<CoursesResponse>(COURSES_URL, {
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
