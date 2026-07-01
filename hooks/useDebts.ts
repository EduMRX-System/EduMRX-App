import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { IDebt, DebtPayload } from "@/types/debt";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import { queryKeys } from "@/lib/queryKeys";

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
    queryKey: queryKeys.debts.list({ page, pageSize, search, status, centerId: activeCenter, branchId: branchId || activeBranch }),
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
    queryKey: queryKeys.debts.summary(activeCenter, activeBranch),
    queryFn: async () => {
      try {
        const res = await API.get("/payments/summary/", {
          params: {
            center_id: activeCenter || undefined,
            branch_id: activeBranch || undefined,
          },
        });
        const d: any = res.data ?? {};
        // PaymentSummaryView qaytargan fieldlarni DebtSummary'ga map qilish:
        // overdue/pending to'lovlar → qarz statistikasi
        return {
          total_amount: d.total_amount,
          unpaid_amount: d.pending_amount ?? d.pending,
          overdue_amount: d.overdue_amount ?? d.overdue,
          total_count: d.total_count,
          unpaid_count: d.pending_count,
          overdue_count: d.count_overdue ?? d.overdue_count,
          monthly_data: d.monthly_data,
          // by_status: /payments/summary/ da yo'q — pie chart ko'rinmaydi
        } as DebtSummary;
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
      qc.invalidateQueries({ queryKey: queryKeys.debts.listAll });
      qc.invalidateQueries({ queryKey: queryKeys.debts.summaryAll });
    },
  });
}

export function useUpdateDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<DebtPayload> & { id: string }) =>
      API.patch(`${DEBTS_URL}${id}/`, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.debts.listAll });
      qc.invalidateQueries({ queryKey: queryKeys.debts.summaryAll });
    },
  });
}

export function useDeleteDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => API.delete(`${DEBTS_URL}${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.debts.listAll });
      qc.invalidateQueries({ queryKey: queryKeys.debts.summaryAll });
    },
  });
}
