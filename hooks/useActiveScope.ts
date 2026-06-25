import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { API } from "@/services/api";
import {
  useActiveCenterStore,
  type CenterInfo,
  type BranchInfo,
} from "@/store/activeCenterStore";
import { useAuthStore } from "@/store/authStore";

export const CENTERS_QUERY_KEY = ["director-centers"] as const;

// ─── Centers ──────────────────────────────────────────────
async function fetchCenters(): Promise<CenterInfo[]> {
  const res = await API.get("director/analytics/centers/");
  const d = res.data;
  const list: any[] = Array.isArray(d)
    ? d
    : d?.results ?? d?.data ?? (d?.id ? [d] : []);
  return list.map((c: any) => ({
    id: String(c.id),
    name: String(c.name ?? ""),
    students_count: c.students_count ?? c.student_count ?? undefined,
    revenue: c.revenue ?? c.total_revenue ?? undefined,
    is_active: c.is_active ?? true,
  }));
}

// ─── Branches for a given center ─────────────────────────
async function fetchBranchesForCenter(centerId: string): Promise<BranchInfo[]> {
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
}

export function useActiveScope() {
  const { user } = useAuthStore();
  const {
    activeCenter, centers, isCentersLoaded,
    setCenters, initFromIds, setActiveCenter,
    activeBranch, branches, isBranchesLoaded,
    initBranchFromList, setActiveBranch, resetBranch,
  } = useActiveCenterStore();
  const qc = useQueryClient();

  // ── Centers query ────────────────────────────────────────
  const centersQuery = useQuery<CenterInfo[]>({
    queryKey: CENTERS_QUERY_KEY,
    queryFn: fetchCenters,
    enabled: !!user,
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  // Analytics centers faqat display uchun — activeCenter'ni o'zgartirmaydi
  useEffect(() => {
    if (centersQuery.data && centersQuery.data.length > 0) {
      setCenters(centersQuery.data);
    }
  }, [centersQuery.data, setCenters]);

  // me/ center_ids — yagona manba activeCenter uchun
  useEffect(() => {
    if (user?.center_ids?.length) {
      initFromIds(user.center_ids);
    }
  }, [user?.center_ids, initFromIds]);

  // ── Branches query (active center o'zgarganda qayta yukladi) ──
  const branchesQuery = useQuery<BranchInfo[]>({
    queryKey: ["scope-branches", activeCenter],
    queryFn: () => fetchBranchesForCenter(activeCenter!),
    enabled: !!activeCenter,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (branchesQuery.data !== undefined) {
      initBranchFromList(branchesQuery.data);
    }
  }, [branchesQuery.data, initBranchFromList]);

  // ── Actions ──────────────────────────────────────────────
  const handleSetActiveCenter = (id: string) => {
    setActiveCenter(id); // store branch'ni reset qiladi
    // Branches query'ni invalidate — yangi center uchun qayta yuklanadi
    qc.invalidateQueries({ queryKey: ["scope-branches"] });
    // Barcha listlarni ham yangilash
    qc.invalidateQueries();
  };

  const allCenters = centersQuery.data ?? centers;
  const activeCenterInfo = allCenters.find((c) => c.id === activeCenter) ?? null;
  const activeBranchInfo = branches.find((b) => b.id === activeBranch) ?? null;

  return {
    // Centers
    centers: allCenters,
    activeCenter,
    activeCenterInfo,
    isCentersLoading: centersQuery.isLoading,
    isCentersLoaded,
    setActiveCenter: handleSetActiveCenter,
    // Branches
    branches,
    activeBranch,
    activeBranchInfo,
    isBranchesLoading: branchesQuery.isLoading,
    isBranchesLoaded,
    setActiveBranch,
  };
}

// ─── Old hook alias — mavjud `useActiveCenters` importlarini saqlash ──
export { useActiveScope as useActiveCenters };
