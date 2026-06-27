/**
 * types/branchAnalytics.ts
 * API javobiga mos struktura — fake → real almashtirilganda tip o'zgarmaydi.
 *
 * API yo'llari (kelajak):
 *   GET director/branches/{id}/analytics/summary/?period=this_month
 *   GET director/branches/{id}/analytics/finance/?period=year
 *   GET director/branches/{id}/analytics/students-growth/?period=year
 *   GET director/branches/{id}/analytics/payment-status/?period=this_month
 *   GET director/branches/{id}/analytics/groups/?period=this_month
 *   GET director/branches/{id}/analytics/teachers/?period=this_month
 *   GET director/branches/{id}/analytics/recent-payments/?period=this_month
 */

export interface BranchSummary {
  id: string;
  name: string;
  status: "active" | "inactive";
}

export type Period = "this_month" | "last_month" | "3_months" | "year";

export const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "this_month", label: "Bu oy" },
  { value: "last_month", label: "O'tgan oy" },
  { value: "3_months", label: "So'nggi 3 oy" },
  { value: "year", label: "Bu yil" },
];

export interface BranchKpi {
  students_count: number;
  students_change: number;
  monthly_revenue: number;
  revenue_change: number;
  total_debt: number;
  debtors_count: number;
  avg_attendance: number;
  min_attendance_group: string;
  teachers_count: number;
  groups_count: number;
  active_groups: number;
  avg_fill_percent: number;
}

export interface FinancePoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface StudentGrowthPoint {
  month: string;
  total: number;
  new_students: number;
}

export interface PaymentStatusData {
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  paid_count: number;
  pending_count: number;
  overdue_count: number;
}

export interface GroupFill {
  id: string;
  name: string;
  teacher: string;
  current: number;
  capacity: number;
  fill_percent: number;
  revenue: number;
}

export interface TopTeacher {
  id: string;
  name: string;
  groups_count: number;
  students_count: number;
  avg_attendance: number;
}

export interface RecentPayment {
  id: string;
  student_name: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
  method: string;
}

export interface BranchAnalyticsData {
  kpi: BranchKpi;
  finance: FinancePoint[];
  student_growth: StudentGrowthPoint[];
  payment_status: PaymentStatusData;
  groups: GroupFill[];
  teachers: TopTeacher[];
  recent_payments: RecentPayment[];
}

// ── Formatting helpers ────────────────────────────────────────────

export function formatCompact(v: number | null | undefined): string {
  const n = Number(v ?? 0);
  if (isNaN(n)) return "0";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function formatMoney(v: number): string {
  return new Intl.NumberFormat("uz-UZ").format(v) + " UZS";
}
