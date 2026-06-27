import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { IDebt, DebtPayload } from "@/types/debt";
import { useActiveCenterStore } from "@/store/activeCenterStore";

const DEBTS_URL = "/debts/";

interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  branchId?: string;
}

export interface DebtsResult {
  results: IDebt[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface DebtSummary {
  total_amount?: string | number;
  unpaid_amount?: string | number;
  overdue_amount?: string | number;
  total_count?: number;
  unpaid_count?: number;
  overdue_count?: number;
  monthly_data?: { month: string; amount: number }[];
  by_status?: { status: string; count: number; amount: number }[];
}

export function useDebts({
  page = 1,
  pageSize = 10,
  search = "",
  status = "",
  branchId = "",
}: ListParams = {}) {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  const activeBranch = useActiveCenterStore((s) => s.activeBranch);

  return useQuery<DebtsResult>({
    queryKey: [
      "debts-list",
      { page, pageSize, search, status, centerId: activeCenter, branchId: branchId || activeBranch },
    ],
    queryFn: async () => {
      const res = await API.get(DEBTS_URL, {
        params: {
          page,
          page_size: pageSize,
          search: search || undefined,
          status: status || undefined,
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

export function useDebtSummary() {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  const activeBranch = useActiveCenterStore((s) => s.activeBranch);

  return useQuery<DebtSummary>({
    queryKey: ["debts-summary", { centerId: activeCenter, branchId: activeBranch }],
    queryFn: async () => {
      try {
        const res = await API.get("/debts/summary/", {
          params: {
            center_id: activeCenter || undefined,
            branch_id: activeBranch || undefined,
          },
        });
        return (res.data as DebtSummary) ?? {};
      } catch {
        return {};
      }
    },
    retry: false,
  });
}

export function useCreateDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DebtPayload) =>
      API.post(DEBTS_URL, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["debts-list"] });
      qc.invalidateQueries({ queryKey: ["debts-summary"] });
    },
  });
}

export function useUpdateDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<DebtPayload> & { id: string }) =>
      API.patch(`${DEBTS_URL}${id}/`, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["debts-list"] });
      qc.invalidateQueries({ queryKey: ["debts-summary"] });
    },
  });
}

export function useDeleteDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => API.delete(`${DEBTS_URL}${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["debts-list"] });
      qc.invalidateQueries({ queryKey: ["debts-summary"] });
    },
  });
}
