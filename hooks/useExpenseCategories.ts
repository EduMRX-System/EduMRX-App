import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { IExpenseCategory } from "@/types/expense";
import { useActiveCenterStore } from "@/store/activeCenterStore";

const CAT_URL = "/expense-categories/";

export interface CategoriesResult {
  results: IExpenseCategory[];
  count: number;
  next: string | null;
  previous: string | null;
}

export function useExpenseCategories() {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);

  return useQuery<CategoriesResult>({
    queryKey: ["expense-categories", activeCenter],
    queryFn: async () => {
      const res = await API.get(CAT_URL, {
        params: { center_id: activeCenter || undefined, page_size: 100 },
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
    retry: false,
  });
}

export function useCreateExpenseCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; icon?: string }) =>
      API.post(CAT_URL, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expense-categories"] }),
  });
}

export function useUpdateExpenseCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; name: string; icon?: string }) =>
      API.patch(`${CAT_URL}${id}/`, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expense-categories"] }),
  });
}

export function useDeleteExpenseCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => API.delete(`${CAT_URL}${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expense-categories"] }),
  });
}
