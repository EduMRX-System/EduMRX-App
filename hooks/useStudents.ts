import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { IStudent } from "@/types/student";
import { useActiveCenterStore } from "@/store/activeCenterStore";

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
  role?: "director" | "manager";
}

export function useStudents({
  page = 1,
  pageSize = 10,
  search = "",
  role = "director",
}: ListParams = {}) {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  const activeBranch = useActiveCenterStore((s) => s.activeBranch);

  return useQuery<StudentsResult>({
    queryKey: [
      "students-list",
      {
        page,
        pageSize,
        search,
        centerId: activeCenter,
        branchId: activeBranch,
        role,
      },
    ],
    queryFn: async () => {
      const res = await API.get(`${role}/students/`, {
        params: {
          page,
          page_size: pageSize,
          search: search || undefined,
          center_id: activeCenter || undefined,
          branch_id: activeBranch || undefined,
        },
      });
      const d: any = res.data;
      if (Array.isArray(d))
        return { results: d, count: d.length, next: null, previous: null };
      return {
        results: d?.results ?? d?.data ?? [],
        count: d?.count ?? d?.results?.length ?? d?.data?.length ?? 0,
        next: d?.next ?? null,
        previous: d?.previous ?? null,
      };
    },
    placeholderData: (prev) => prev,
  });
}
