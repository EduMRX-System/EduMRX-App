import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { IStudent } from "@/types/student";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import { queryKeys } from "@/lib/queryKeys";

export function useStudentSearch(
  search: string,
  role: "director" | "manager" = "director",
  branchId?: string,
) {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  const activeBranch = useActiveCenterStore((s) => s.activeBranch);
  const effectiveBranch = branchId !== undefined ? branchId : activeBranch;

  return useQuery<IStudent[]>({
    queryKey: queryKeys.students.search({ search, centerId: activeCenter, branchId: effectiveBranch, role }),
    queryFn: async () => {
      const res = await API.get(`${role}/students/`, {
        params: {
          page_size: 50,
          search: search || undefined,
          center_id: activeCenter || undefined,
          branch_id: effectiveBranch || undefined,
        },
      });
      const d: any = res.data;
      return Array.isArray(d) ? d : (d?.results ?? d?.data ?? []);
    },
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev ?? [],
    enabled: search.length >= 1,
  });
}

// Payments/Debts kabi formalardagi "studentni tanlash" inline pickerlari uchun —
// bir xil search+center bo'yicha bir nechta joyda alohida-alohida so'ralmasin
// deb bitta umumiy key ostida ishlaydi (queryKeys.students.searchOptions).
export function useStudentSearchOptions(search: string, enabled: boolean, role: "director" | "manager" = "director") {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);

  return useQuery<{ id: string; name: string; phone: string }[]>({
    queryKey: queryKeys.students.searchOptions({ search, centerId: activeCenter, role }),
    queryFn: async () => {
      const res = await API.get(`${role}/students/`, {
        params: {
          search: search || undefined,
          center_id: activeCenter || undefined,
          page_size: 20,
        },
      });
      const d: any = res.data;
      const list = Array.isArray(d) ? d : (d?.results ?? []);
      return list.map((s: any) => ({
        id: String(s.id),
        name: `${s.user?.first_name ?? ""} ${s.user?.last_name ?? ""}`.trim() || String(s.id),
        phone: s.user?.phone ?? "",
      }));
    },
    enabled,
    staleTime: 30000,
  });
}

export function useStudentsByGroup(
  groupId: string | undefined,
  role: "director" | "manager" = "director",
  branchId?: string,
) {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  const activeBranch = useActiveCenterStore((s) => s.activeBranch);
  const effectiveBranch = branchId !== undefined ? branchId : activeBranch;
  return useQuery<IStudent[]>({
    queryKey: queryKeys.students.byGroup(groupId, role, activeCenter, effectiveBranch),
    queryFn: async () => {
      const res = await API.get(`${role}/students/`, {
        params: {
          group_id: groupId,
          page_size: 200,
          center_id: activeCenter || undefined,
          branch_id: effectiveBranch || undefined,
        },
      });
      const d = res.data;
      return Array.isArray(d) ? d : (d?.results ?? d?.data ?? []);
    },
    enabled: !!groupId,
    staleTime: 60 * 1000,
  });
}

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
  branchId?: string;
}

export function useStudents({
  page = 1,
  pageSize = 10,
  search = "",
  role = "director",
  branchId,
}: ListParams = {}) {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  const activeBranch = useActiveCenterStore((s) => s.activeBranch);
  const effectiveBranch = branchId !== undefined ? branchId : activeBranch;

  return useQuery<StudentsResult>({
    queryKey: queryKeys.students.list({
      page,
      pageSize,
      search,
      centerId: activeCenter,
      branchId: effectiveBranch,
      role,
    }),
    queryFn: async () => {
      const res = await API.get(`${role}/students/`, {
        params: {
          page,
          page_size: pageSize,
          search: search || undefined,
          center_id: activeCenter || undefined,
          branch_id: effectiveBranch || undefined,
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
