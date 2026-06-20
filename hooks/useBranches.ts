import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { BranchesResponse } from "@/types/branch";

// Barcha branch so'rovlari shu yerda — yagona manba
const BRANCHES_URL = "center/branches/";

// ───────────────────────────────────────────────
// LIST (BranchesView uchun) — { status, count, data: [...] }
// ───────────────────────────────────────────────
interface BranchListParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

export function useBranches({ page = 1, pageSize = 10, search = "" }: BranchListParams = {}) {
    return useQuery<BranchesResponse>({
        queryKey: ["branches", { page, pageSize, search }],
        queryFn: async () => {
            const res = await API.get<BranchesResponse>(BRANCHES_URL, {
                params: { page, page_size: pageSize, search: search || undefined },
            });
            return res.data;
        },
        placeholderData: (prev) => prev,
    });
}

// ───────────────────────────────────────────────
// OPTIONS (dropdown uchun: teacher / student / groups)
// nom + manzil bilan chiroyli ko'rinadi
// ───────────────────────────────────────────────
export interface BranchOption {
    id: string;
    label: string;
    description?: string;
}

export function useBranchOptions() {
    return useQuery<BranchOption[]>({
        queryKey: ["branches", "options"],
        queryFn: async () => {
            const res = await API.get(BRANCHES_URL, { params: { page_size: 200 } });
            const d: any = res.data;
            const list = Array.isArray(d) ? d : d?.data ?? d?.results ?? [];
            return list.map((b: any) => ({
                id: b.id,
                label: b.name,
                description: b.address,
            }));
        },
        staleTime: 5 * 60 * 1000,
    });
}