"use client";

import {
  Users, Wallet, AlertCircle, ClipboardCheck, GraduationCap, BookOpen,
  TrendingUp, TrendingDown,
} from "lucide-react";
import type { BranchKpi } from "@/types/branchAnalytics";
import { formatCompact } from "@/types/branchAnalytics";

function ChangeBadge({ value }: { value: number }) {
  const pos = value >= 0;
  const Icon = pos ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${pos ? "bg-success-bg dark:bg-success/10 text-success" : "bg-danger-bg dark:bg-danger/10 text-danger"}`}>
      <Icon className="w-3 h-3" />
      {pos ? "+" : ""}{value.toFixed(1)}%
    </span>
  );
}

function KpiCard({ icon, iconBg, label, value, unit, sub, change, loading }: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  change?: number;
  loading?: boolean;
}) {
  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
        {change !== undefined && !loading && <ChangeBadge value={change} />}
      </div>
      <p className="text-[11px] font-semibold text-foreground-subtle dark:text-foreground-muted uppercase tracking-wide mb-1">{label}</p>
      {loading ? (
        <div className="h-7 w-32 bg-hover rounded animate-pulse" />
      ) : (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-foreground">{value}</span>
          {unit && <span className="text-sm font-semibold text-foreground-subtle">{unit}</span>}
        </div>
      )}
      {sub && !loading && <p className="text-[11px] text-foreground-subtle dark:text-foreground-muted mt-1">{sub}</p>}
    </div>
  );
}

interface Props {
  kpi: BranchKpi | null;
  loading?: boolean;
}

export default function BranchKpiCards({ kpi, loading }: Props) {
  const k = kpi ?? {
    students_count: 0, students_change: 0, monthly_revenue: 0, revenue_change: 0,
    total_debt: 0, debtors_count: 0, avg_attendance: 0, min_attendance_group: "",
    teachers_count: 0, groups_count: 0, active_groups: 0, avg_fill_percent: 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <KpiCard
        icon={<Users className="w-5 h-5 text-primary" />}
        iconBg="bg-primary-soft"
        label="Faol o'quvchilar"
        value={String(k.students_count)}
        sub="Jami ro'yxatdagi"
        change={k.students_change}
        loading={loading}
      />
      <KpiCard
        icon={<Wallet className="w-5 h-5 text-success" />}
        iconBg="bg-success-bg dark:bg-success/10"
        label="Daromad"
        value={formatCompact(k.monthly_revenue)}
        unit="UZS"
        change={k.revenue_change}
        loading={loading}
      />
      <KpiCard
        icon={<AlertCircle className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-bg dark:bg-danger/10"
        label="Qarzdorlik"
        value={formatCompact(k.total_debt)}
        unit="UZS"
        sub={k.debtors_count ? `${k.debtors_count} ta qarzdor` : undefined}
        loading={loading}
      />
      <KpiCard
        icon={<ClipboardCheck className="w-5 h-5 text-warning" />}
        iconBg="bg-warning-bg dark:bg-warning-bg0/10"
        label="O'rtacha davomat"
        value={`${k.avg_attendance}%`}
        sub={k.min_attendance_group ? `Eng past: ${k.min_attendance_group}` : undefined}
        loading={loading}
      />
      <KpiCard
        icon={<GraduationCap className="w-5 h-5 text-primary" />}
        iconBg="bg-primary-soft"
        label="O'qituvchilar"
        value={String(k.teachers_count)}
        sub={`${k.groups_count} ta guruh`}
        loading={loading}
      />
      <KpiCard
        icon={<BookOpen className="w-5 h-5 text-foreground-muted" />}
        iconBg="bg-hover"
        label="Faol guruhlar"
        value={String(k.active_groups)}
        sub={`O'rtacha to'ldirilish: ${k.avg_fill_percent}%`}
        loading={loading}
      />
    </div>
  );
}
