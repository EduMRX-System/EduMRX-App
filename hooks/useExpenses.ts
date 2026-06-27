import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { IExpense, ExpensePayload, ExpenseSummary } from "@/types/expense";
import { useActiveCenterStore } from "@/store/activeCenterStore";

const EXPENSES_URL = "/expenses/";

interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  category?: string;
  branchId?: string;
}

export interface ExpensesResult {
  results: IExpense[];
  count: number;
  next: string | null;
  previous: string | null;
}

export function useExpenses({
  page = 1,
  pageSize = 10,
  search = "",
  status = "",
  category = "",
  branchId = "",
}: ListParams = {}) {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  const activeBranch = useActiveCenterStore((s) => s.activeBranch);

  return useQuery<ExpensesResult>({
    queryKey: [
      "expenses-list",
      { page, pageSize, search, status, category, centerId: activeCenter, branchId: branchId || activeBranch },
    ],
    queryFn: async () => {
      const res = await API.get(EXPENSES_URL, {
        params: {
          page,
          page_size: pageSize,
          search: search || undefined,
          status: status || undefined,
          category: category || undefined,
          center_id: activeCenter || undefined,
          branch_id: branchId || activeBranch || undefined,
        },
      });
      const d: any = res.data;
      if (Array.isArray(d)) return { results: d, count: d.length, next: null, previous: null };
      return {
        results: d?.results ?? d?.data ?? [],
        count: d?.count ?? 0,
        next: d?.next ?? null,
        previous: d?.previous ?? null,
      };
    },
    placeholderData: (prev) => prev,
  });
}

export function useExpenseSummary() {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  const activeBranch = useActiveCenterStore((s) => s.activeBranch);

  return useQuery<ExpenseSummary>({
    queryKey: ["expenses-summary", { centerId: activeCenter, branchId: activeBranch }],
    queryFn: async () => {
      try {
        const res = await API.get("/expenses/summary/", {
          params: {
            center_id: activeCenter || undefined,
            branch_id: activeBranch || undefined,
          },
        });
        return (res.data as ExpenseSummary) ?? {};
      } catch {
        return {};
      }
    },
    retry: false,
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ExpensePayload) =>
      API.post(EXPENSES_URL, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses-list"] });
      qc.invalidateQueries({ queryKey: ["expenses-summary"] });
    },
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<ExpensePayload> & { id: string }) =>
      API.patch(`${EXPENSES_URL}${id}/`, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses-list"] });
      qc.invalidateQueries({ queryKey: ["expenses-summary"] });
    },
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => API.delete(`${EXPENSES_URL}${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses-list"] });
      qc.invalidateQueries({ queryKey: ["expenses-summary"] });
    },
  });
}
