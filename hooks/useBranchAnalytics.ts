/**
 * useBranchAnalytics — hozircha FAKE data qaytaradi.
 * API yo'llari yuqoridagi types/branchAnalytics.ts da izoh sifatida.
 */

import { useMemo } from "react";
import type {
  BranchSummary, BranchAnalyticsData, BranchKpi, FinancePoint,
  StudentGrowthPoint, PaymentStatusData, GroupFill, TopTeacher,
  RecentPayment, Period,
} from "@/types/branchAnalytics";

// ── Fake branches ─────────────────────────────────────────────────

export const FAKE_BRANCHES: BranchSummary[] = [
  { id: "b-chilonzor",   name: "Chilonzor filiali",       status: "active" },
  { id: "b-yunusobod",   name: "Yunusobod filiali",       status: "active" },
  { id: "b-mirzo",       name: "Mirzo Ulug'bek filiali",  status: "active" },
];

const MONTHS = ["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avg","Sen","Okt","Noy","Iyn"];

// ── Per-branch fake analytics ─────────────────────────────────────

const DATA: Record<string, BranchAnalyticsData> = {
  "b-chilonzor": {
    kpi: {
      students_count: 142, students_change: 12.3,
      monthly_revenue: 85_000_000, revenue_change: 8.5,
      total_debt: 12_500_000, debtors_count: 18,
      avg_attendance: 88, min_attendance_group: "Python Beginner",
      teachers_count: 8, groups_count: 12, active_groups: 10, avg_fill_percent: 78,
    },
    finance: [
      { month: "Yan", revenue: 55, expenses: 30, profit: 25 },
      { month: "Fev", revenue: 58, expenses: 32, profit: 26 },
      { month: "Mar", revenue: 62, expenses: 34, profit: 28 },
      { month: "Apr", revenue: 60, expenses: 33, profit: 27 },
      { month: "May", revenue: 72, expenses: 38, profit: 34 },
      { month: "Iyn", revenue: 78, expenses: 40, profit: 38 },
      { month: "Iyl", revenue: 65, expenses: 35, profit: 30 },
      { month: "Avg", revenue: 68, expenses: 36, profit: 32 },
      { month: "Sen", revenue: 80, expenses: 42, profit: 38 },
      { month: "Okt", revenue: 82, expenses: 43, profit: 39 },
      { month: "Noy", revenue: 83, expenses: 44, profit: 39 },
      { month: "Dek", revenue: 85, expenses: 45, profit: 40 },
    ],
    student_growth: [
      { month: "Yan", total: 115, new_students: 8 },
      { month: "Fev", total: 118, new_students: 5 },
      { month: "Mar", total: 122, new_students: 7 },
      { month: "Apr", total: 120, new_students: 3 },
      { month: "May", total: 125, new_students: 9 },
      { month: "Iyn", total: 130, new_students: 11 },
      { month: "Iyl", total: 128, new_students: 4 },
      { month: "Avg", total: 132, new_students: 7 },
      { month: "Sen", total: 136, new_students: 8 },
      { month: "Okt", total: 139, new_students: 5 },
      { month: "Noy", total: 141, new_students: 6 },
      { month: "Dek", total: 142, new_students: 4 },
    ],
    payment_status: {
      paid_amount: 68_500_000, pending_amount: 12_000_000, overdue_amount: 12_500_000,
      paid_count: 85, pending_count: 15, overdue_count: 18,
    },
    groups: [
      { id: "g1", name: "React Pro",         teacher: "Aziz Karimov",    current: 15, capacity: 15, fill_percent: 100, revenue: 15_000_000 },
      { id: "g2", name: "Frontend Advanced", teacher: "Aziz Karimov",    current: 14, capacity: 15, fill_percent: 93, revenue: 14_000_000 },
      { id: "g3", name: "English B2",        teacher: "Kamola Rahimova", current: 12, capacity: 15, fill_percent: 80, revenue: 9_600_000 },
      { id: "g4", name: "UI/UX Design",      teacher: "Bobur Ergashev",  current: 13, capacity: 15, fill_percent: 87, revenue: 11_700_000 },
      { id: "g5", name: "Data Science",      teacher: "Malika Tursunova",current: 11, capacity: 15, fill_percent: 73, revenue: 9_900_000 },
      { id: "g6", name: "Python Beginner",   teacher: "Nodira Yusupova", current:  8, capacity: 15, fill_percent: 53, revenue: 6_400_000 },
    ],
    teachers: [
      { id: "t1", name: "Aziz Karimov",    groups_count: 2, students_count: 29, avg_attendance: 91 },
      { id: "t2", name: "Kamola Rahimova", groups_count: 2, students_count: 26, avg_attendance: 89 },
      { id: "t3", name: "Bobur Ergashev",  groups_count: 2, students_count: 24, avg_attendance: 87 },
      { id: "t4", name: "Nodira Yusupova", groups_count: 2, students_count: 22, avg_attendance: 83 },
      { id: "t5", name: "Malika Tursunova",groups_count: 2, students_count: 21, avg_attendance: 85 },
    ],
    recent_payments: [
      { id: "p1", student_name: "Alibek Toshmatov",  amount: 800_000, date: "2026-06-27", status: "paid",    method: "Karta" },
      { id: "p2", student_name: "Nodira Karimova",   amount: 600_000, date: "2026-06-26", status: "paid",    method: "Naqd" },
      { id: "p3", student_name: "Jasur Rahimov",     amount: 750_000, date: "2026-06-25", status: "pending", method: "Transfer" },
      { id: "p4", student_name: "Malika Yusupova",   amount: 600_000, date: "2026-06-24", status: "paid",    method: "Karta" },
      { id: "p5", student_name: "Otabek Mirzayev",   amount: 800_000, date: "2026-06-23", status: "overdue", method: "Naqd" },
      { id: "p6", student_name: "Zulfiya Hasanova",  amount: 600_000, date: "2026-06-22", status: "paid",    method: "Karta" },
      { id: "p7", student_name: "Bobur Ergashev",    amount: 750_000, date: "2026-06-21", status: "paid",    method: "Naqd" },
      { id: "p8", student_name: "Sanjar Qodirov",    amount: 800_000, date: "2026-06-20", status: "pending", method: "Transfer" },
    ],
  },

  "b-yunusobod": {
    kpi: {
      students_count: 98, students_change: 5.1,
      monthly_revenue: 58_000_000, revenue_change: 3.2,
      total_debt: 8_200_000, debtors_count: 11,
      avg_attendance: 91, min_attendance_group: "Web Design Pro",
      teachers_count: 6, groups_count: 8, active_groups: 7, avg_fill_percent: 82,
    },
    finance: [
      { month: "Yan", revenue: 38, expenses: 22, profit: 16 },
      { month: "Fev", revenue: 40, expenses: 23, profit: 17 },
      { month: "Mar", revenue: 43, expenses: 25, profit: 18 },
      { month: "Apr", revenue: 42, expenses: 24, profit: 18 },
      { month: "May", revenue: 50, expenses: 28, profit: 22 },
      { month: "Iyn", revenue: 54, expenses: 30, profit: 24 },
      { month: "Iyl", revenue: 46, expenses: 26, profit: 20 },
      { month: "Avg", revenue: 49, expenses: 27, profit: 22 },
      { month: "Sen", revenue: 55, expenses: 31, profit: 24 },
      { month: "Okt", revenue: 57, expenses: 32, profit: 25 },
      { month: "Noy", revenue: 57, expenses: 32, profit: 25 },
      { month: "Dek", revenue: 58, expenses: 33, profit: 25 },
    ],
    student_growth: [
      { month: "Yan", total: 80, new_students: 5 },
      { month: "Fev", total: 82, new_students: 4 },
      { month: "Mar", total: 85, new_students: 6 },
      { month: "Apr", total: 84, new_students: 2 },
      { month: "May", total: 88, new_students: 7 },
      { month: "Iyn", total: 91, new_students: 6 },
      { month: "Iyl", total: 90, new_students: 3 },
      { month: "Avg", total: 93, new_students: 5 },
      { month: "Sen", total: 95, new_students: 4 },
      { month: "Okt", total: 97, new_students: 4 },
      { month: "Noy", total: 97, new_students: 3 },
      { month: "Dek", total: 98, new_students: 3 },
    ],
    payment_status: {
      paid_amount: 45_000_000, pending_amount: 9_000_000, overdue_amount: 8_200_000,
      paid_count: 62, pending_count: 12, overdue_count: 11,
    },
    groups: [
      { id: "g7",  name: "Python Pro",       teacher: "Sherzod Normatov", current: 15, capacity: 15, fill_percent: 100, revenue: 15_000_000 },
      { id: "g8",  name: "English C1",       teacher: "Barno Tursunova",  current: 13, capacity: 15, fill_percent: 87, revenue: 10_400_000 },
      { id: "g9",  name: "Frontend Start",   teacher: "Ulugbek Ismoilov", current: 12, capacity: 15, fill_percent: 80, revenue: 9_600_000 },
      { id: "g10", name: "English B1",       teacher: "Barno Tursunova",  current: 13, capacity: 15, fill_percent: 87, revenue: 7_800_000 },
      { id: "g11", name: "Web Design Pro",   teacher: "Feruza Xolmatova", current: 9,  capacity: 15, fill_percent: 60, revenue: 7_200_000 },
      { id: "g12", name: "Mobile Dev",       teacher: "Ulugbek Ismoilov", current: 11, capacity: 15, fill_percent: 73, revenue: 8_800_000 },
    ],
    teachers: [
      { id: "t6", name: "Sherzod Normatov", groups_count: 2, students_count: 26, avg_attendance: 93 },
      { id: "t7", name: "Barno Tursunova",  groups_count: 2, students_count: 24, avg_attendance: 91 },
      { id: "t8", name: "Ulugbek Ismoilov", groups_count: 2, students_count: 23, avg_attendance: 88 },
      { id: "t9", name: "Feruza Xolmatova", groups_count: 1, students_count: 9,  avg_attendance: 85 },
    ],
    recent_payments: [
      { id: "p9",  student_name: "Sherzod Normatov",  amount: 700_000, date: "2026-06-27", status: "paid",    method: "Karta" },
      { id: "p10", student_name: "Barno Tursunova",   amount: 550_000, date: "2026-06-26", status: "paid",    method: "Naqd" },
      { id: "p11", student_name: "Ulugbek Ismoilov",  amount: 650_000, date: "2026-06-25", status: "paid",    method: "Karta" },
      { id: "p12", student_name: "Feruza Xolmatova",  amount: 700_000, date: "2026-06-24", status: "pending", method: "Transfer" },
      { id: "p13", student_name: "Doniyor Sobirov",   amount: 550_000, date: "2026-06-22", status: "overdue", method: "Naqd" },
      { id: "p14", student_name: "Sabohat Rajabova",  amount: 650_000, date: "2026-06-21", status: "paid",    method: "Karta" },
    ],
  },

  "b-mirzo": {
    kpi: {
      students_count: 67, students_change: -2.1,
      monthly_revenue: 41_000_000, revenue_change: -4.1,
      total_debt: 15_300_000, debtors_count: 23,
      avg_attendance: 82, min_attendance_group: "English A2",
      teachers_count: 5, groups_count: 7, active_groups: 6, avg_fill_percent: 64,
    },
    finance: [
      { month: "Yan", revenue: 30, expenses: 20, profit: 10 },
      { month: "Fev", revenue: 32, expenses: 21, profit: 11 },
      { month: "Mar", revenue: 35, expenses: 22, profit: 13 },
      { month: "Apr", revenue: 34, expenses: 22, profit: 12 },
      { month: "May", revenue: 42, expenses: 25, profit: 17 },
      { month: "Iyn", revenue: 44, expenses: 26, profit: 18 },
      { month: "Iyl", revenue: 38, expenses: 24, profit: 14 },
      { month: "Avg", revenue: 40, expenses: 25, profit: 15 },
      { month: "Sen", revenue: 44, expenses: 27, profit: 17 },
      { month: "Okt", revenue: 43, expenses: 27, profit: 16 },
      { month: "Noy", revenue: 42, expenses: 27, profit: 15 },
      { month: "Dek", revenue: 41, expenses: 27, profit: 14 },
    ],
    student_growth: [
      { month: "Yan", total: 72, new_students: 4 },
      { month: "Fev", total: 71, new_students: 2 },
      { month: "Mar", total: 73, new_students: 5 },
      { month: "Apr", total: 72, new_students: 2 },
      { month: "May", total: 70, new_students: 3 },
      { month: "Iyn", total: 69, new_students: 2 },
      { month: "Iyl", total: 68, new_students: 1 },
      { month: "Avg", total: 69, new_students: 3 },
      { month: "Sen", total: 70, new_students: 4 },
      { month: "Okt", total: 69, new_students: 2 },
      { month: "Noy", total: 68, new_students: 1 },
      { month: "Dek", total: 67, new_students: 2 },
    ],
    payment_status: {
      paid_amount: 22_000_000, pending_amount: 8_000_000, overdue_amount: 15_300_000,
      paid_count: 34, pending_count: 14, overdue_count: 23,
    },
    groups: [
      { id: "g13", name: "Python Basic",   teacher: "Abdulaziz Qosimov", current: 12, capacity: 15, fill_percent: 80, revenue: 9_600_000 },
      { id: "g14", name: "JS Starter",     teacher: "Timur Sultonov",    current: 11, capacity: 15, fill_percent: 73, revenue: 8_800_000 },
      { id: "g15", name: "English B1",     teacher: "Dilnoza Xoliqova",  current: 10, capacity: 15, fill_percent: 67, revenue: 6_000_000 },
      { id: "g16", name: "English A2",     teacher: "Dilnoza Xoliqova",  current:  7, capacity: 15, fill_percent: 47, revenue: 4_200_000 },
      { id: "g17", name: "Web Basics",     teacher: "Ravshan Tojiboyev", current: 9,  capacity: 15, fill_percent: 60, revenue: 7_200_000 },
      { id: "g18", name: "MS Office Pro",  teacher: "Shahlo Inomova",    current: 9,  capacity: 15, fill_percent: 60, revenue: 5_400_000 },
    ],
    teachers: [
      { id: "t10", name: "Abdulaziz Qosimov", groups_count: 1, students_count: 12, avg_attendance: 84 },
      { id: "t11", name: "Dilnoza Xoliqova",  groups_count: 2, students_count: 17, avg_attendance: 82 },
      { id: "t12", name: "Timur Sultonov",     groups_count: 1, students_count: 11, avg_attendance: 85 },
      { id: "t13", name: "Ravshan Tojiboyev",  groups_count: 1, students_count: 9,  avg_attendance: 80 },
      { id: "t14", name: "Shahlo Inomova",     groups_count: 1, students_count: 9,  avg_attendance: 81 },
    ],
    recent_payments: [
      { id: "p15", student_name: "Abdulaziz Qosimov", amount: 600_000, date: "2026-06-26", status: "paid",    method: "Karta" },
      { id: "p16", student_name: "Mahliyo Ergasheva",  amount: 450_000, date: "2026-06-24", status: "overdue", method: "Naqd" },
      { id: "p17", student_name: "Timur Sultonov",     amount: 550_000, date: "2026-06-23", status: "paid",    method: "Transfer" },
      { id: "p18", student_name: "Dilnoza Xoliqova",   amount: 600_000, date: "2026-06-22", status: "pending", method: "Karta" },
      { id: "p19", student_name: "Ravshan Tojiboyev",  amount: 450_000, date: "2026-06-21", status: "overdue", method: "Naqd" },
      { id: "p20", student_name: "Shahlo Inomova",     amount: 550_000, date: "2026-06-20", status: "paid",    method: "Karta" },
    ],
  },
};

// Period affects how many chart points to show and applies KPI multiplier
const PERIOD_CONFIG: Record<Period, { months: number; revenueMultiplier: number; label: string }> = {
  this_month:  { months: 1,  revenueMultiplier: 1,   label: "Bu oy" },
  last_month:  { months: 1,  revenueMultiplier: 0.93, label: "O'tgan oy" },
  "3_months":  { months: 3,  revenueMultiplier: 2.9,  label: "So'nggi 3 oy" },
  year:        { months: 12, revenueMultiplier: 10.8,  label: "Bu yil" },
};

// ── Exported hooks ────────────────────────────────────────────────

export function useFakeBranches(): BranchSummary[] {
  return FAKE_BRANCHES;
}

export function useBranchAnalytics(branchId: string, period: Period): BranchAnalyticsData {
  return useMemo(() => {
    const base = DATA[branchId] ?? DATA["b-chilonzor"];
    const cfg = PERIOD_CONFIG[period];

    const kpi: BranchKpi = {
      ...base.kpi,
      monthly_revenue: Math.round(base.kpi.monthly_revenue * cfg.revenueMultiplier),
      revenue_change: period === "last_month"
        ? -(base.kpi.revenue_change * 0.4)
        : base.kpi.revenue_change,
    };

    const chartSlice = cfg.months === 1
      ? base.finance.slice(-1)
      : cfg.months === 3
      ? base.finance.slice(-3)
      : base.finance;

    const growthSlice = cfg.months === 1
      ? base.student_growth.slice(-1)
      : cfg.months === 3
      ? base.student_growth.slice(-3)
      : base.student_growth;

    return { ...base, kpi, finance: chartSlice, student_growth: growthSlice };
  }, [branchId, period]);
}
