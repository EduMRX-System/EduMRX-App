import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";

const BRANCHES_URL = "center/branches/";

export interface BranchOption {
    id: string;
    label: string;
    description?: string;
}

// Filiallar — { status, count, data: [...] } yoki DRF shaklini ham qo'llaydi
export function useBranchOptions() {
    return useQuery<BranchOption[]>({
        queryKey: ["branches", "options"],
        queryFn: async () => {
            const res = await API.get(BRANCHES_URL, { params: { page_size: 200 } });
            const d = res.data;
            const list = Array.isArray(d) ? d : d?.data ?? d?.results ?? [];
            return list.map((b: any) => ({ id: b.id, label: b.name, description: b.address }));
        },
        staleTime: 5 * 60 * 1000,
    });
}