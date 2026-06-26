import { useQuery } from "@tanstack/react-query";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import {
  fetchAnalyticsSummary,
  fetchAnalyticsChart,
  fetchAnalyticsCenters,
  fetchAnalyticsBranches,
  fetchAnalyticsTransactions,
} from "@/services/analyticsService";

export function useAnalyticsSummary() {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  return useQuery({
    queryKey: ["analytics", "summary", activeCenter],
    queryFn: fetchAnalyticsSummary,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsChart() {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  return useQuery({
    queryKey: ["analytics", "chart", activeCenter],
    queryFn: fetchAnalyticsChart,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsCenters(page = 1) {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  return useQuery({
    queryKey: ["analytics", "centers", page, activeCenter],
    queryFn: () => fetchAnalyticsCenters(page),
    placeholderData: (prev) => prev,
    staleTime: 3 * 60 * 1000,
  });
}

export function useAnalyticsBranches() {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  return useQuery({
    queryKey: ["analytics", "branches", activeCenter],
    queryFn: fetchAnalyticsBranches,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsTransactions() {
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);
  return useQuery({
    queryKey: ["analytics", "transactions", activeCenter],
    queryFn: fetchAnalyticsTransactions,
    staleTime: 3 * 60 * 1000,
  });
}
