import { API } from "@/services/api";

export interface AnalyticsSummary {
  total_revenue: number;
  month_revenue: number;
  month_revenue_change: number;
  active_centers: number;
  total_centers: number;
  pending_debts: number;
  pending_debts_students_count: number;
  pending_debts_change: number;
}

export interface ChartPoint {
  name: string;
  [key: string]: string | number;
}

export interface ChartSeriesMeta {
  label: string;
  color: string;
}

export interface AnalyticsChart {
  total_sum_formatted: string;
  chart: ChartPoint[];
  keys_definition: Record<string, ChartSeriesMeta>;
}

export interface AnalyticsCenter {
  id: number | string;
  name: string;
  students_count: number;
  month_revenue: number;
  total_revenue: number;
  status: string;
}

export interface AnalyticsCentersMeta {
  current_page: number;
  per_page: number;
  total: number;
}

export interface AnalyticsCentersResponse {
  data: AnalyticsCenter[];
  meta: AnalyticsCentersMeta;
}

export interface AnalyticsBranch {
  id: number | string;
  name: string;
  status: string;
}

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const res = await API.get("/director/analytics/summary/");
  const d = res.data;
  return d?.data ?? d;
}

export async function fetchAnalyticsChart(): Promise<AnalyticsChart> {
  const res = await API.get("/director/analytics/chart/");
  const d = res.data;
  return d?.data ?? d;
}

export async function fetchAnalyticsCenters(page = 1): Promise<AnalyticsCentersResponse> {
  const res = await API.get("/director/analytics/centers/", {
    params: { page },
  });
  const d = res.data;
  return d?.data ?? d;
}

export async function fetchAnalyticsBranches(): Promise<AnalyticsBranch[]> {
  const res = await API.get("/director/analytics/branches/");
  const d = res.data;
  return Array.isArray(d) ? d : d?.data ?? [];
}

export async function fetchAnalyticsTransactions(): Promise<any[]> {
  try {
    const res = await API.get("/director/analytics/transactions/");
    const d = res.data;
    return Array.isArray(d) ? d : d?.data ?? [];
  } catch {
    return [];
  }
}
