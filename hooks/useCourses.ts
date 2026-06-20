import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import { CoursesResponse } from "@/types/course";

const COURSES_URL = "director/courses/";

interface ListParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

export function useCourses({ page = 1, pageSize = 10, search = "" }: ListParams) {
    return useQuery({
        queryKey: ["courses", { page, pageSize, search }],
        queryFn: async () => {
            const res = await API.get<CoursesResponse>(COURSES_URL, {
                params: { page, page_size: pageSize, search: search || undefined },
            });
            return res.data;
        },
        placeholderData: (prev) => prev,
    });
}