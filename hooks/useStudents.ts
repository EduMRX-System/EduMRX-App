import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { IStudent } from "@/types/student";

const STUDENTS_URL = "director/students/";

export interface StudentsResult {
    results: IStudent[];
    count: number;
    next: string | null;
    previous: string | null;
}

interface ListParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

export function useStudents({ page = 1, pageSize = 10, search = "" }: ListParams = {}) {
    return useQuery<StudentsResult>({
        queryKey: ["students-list", { page, pageSize, search }],
        queryFn: async () => {
            const res = await API.get(STUDENTS_URL, {
                params: { page, page_size: pageSize, search: search || undefined },
            });
            const d: any = res.data;
            if (Array.isArray(d)) return { results: d, count: d.length, next: null, previous: null };
            return {
                results: d?.results ?? d?.data ?? [],
                count: d?.count ?? (d?.results?.length ?? d?.data?.length ?? 0),
                next: d?.next ?? null,
                previous: d?.previous ?? null,
            };
        },
        placeholderData: (prev) => prev,
    });
}