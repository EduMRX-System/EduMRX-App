import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { BranchInfo } from "@/store/activeCenterStore";
import { queryKeys } from "@/lib/queryKeys";

export function useBranchesForCenter(centerId: string | null | undefined) {
  return useQuery<BranchInfo[]>({
    queryKey: queryKeys.branches.forCenter(centerId ?? null),
    queryFn: async () => {
      if (!centerId) return [];
      const res = await API.get("center/branches/", {
        params: { center_id: centerId, page_size: 200 },
      });
      const d = res.data;
      const list: any[] = Array.isArray(d)
        ? d
        : d?.data ?? d?.results ?? [];
      return list.map((b: any) => ({
        id: String(b.id),
        name: String(b.name ?? ""),
        address: b.address ?? undefined,
      }));
    },
    enabled: !!centerId,
    staleTime: 5 * 60 * 1000,
  });
}
