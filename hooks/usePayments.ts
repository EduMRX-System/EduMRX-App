import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { IPayment, PaymentPayload, PaymentPatchPayload, PaymentSummary } from "@/types/payment";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import { queryKeys } from "@/lib/queryKeys";

const PAYMENTS_URL = "/payments/";

interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  method?: string;
  branchId?: string;
}

export interface PaymentsResult {
  results: IPayment[];
  count: number;
  next: string | null;
  previous: string | null;
}

export function usePayments({
  page = 1,
  pageSize = 10,
  search = "",
  status = "",
  method = "",
  branchId = "",
}: ListParams = {}) {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  const activeBranch = useActiveCenterStore((s) => s.activeBranch);

  return useQuery<PaymentsResult>({
    queryKey: queryKeys.payments.list({ page, pageSize, search, status, method, centerId: activeCenter, branchId: branchId || activeBranch }),
    queryFn: async () => {
      const res = await API.get(PAYMENTS_URL, {
        params: {
          page,
          page_size: pageSize,
          search: search || undefined,
          status: status || undefined,
          method: method || undefined,
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

export function usePaymentSummary() {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  const activeBranch = useActiveCenterStore((s) => s.activeBranch);

  return useQuery<PaymentSummary>({
    queryKey: queryKeys.payments.summary(activeCenter, activeBranch),
    queryFn: async () => {
      try {
        const res = await API.get("/payments/summary/", {
          params: {
            center_id: activeCenter || undefined,
            branch_id: activeBranch || undefined,
          },
        });
        return (res.data as PaymentSummary) ?? {};
      } catch {
        return {};
      }
    },
    retry: false,
  });
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PaymentPayload) =>
      API.post(PAYMENTS_URL, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.payments.listAll });
      qc.invalidateQueries({ queryKey: queryKeys.payments.summaryAll });
    },
  });
}

export function useUpdatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: PaymentPatchPayload & { id: string }) =>
      API.patch(`${PAYMENTS_URL}${id}/`, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.payments.listAll });
      qc.invalidateQueries({ queryKey: queryKeys.payments.summaryAll });
    },
  });
}

export function useDeletePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => API.delete(`${PAYMENTS_URL}${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.payments.listAll });
      qc.invalidateQueries({ queryKey: queryKeys.payments.summaryAll });
    },
  });
}
