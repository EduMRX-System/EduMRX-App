"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { useAnalyticsSummary, useAnalyticsChart } from "@/hooks/useAnalytics";
import { usePayments } from "@/hooks/usePayments";
import { useDebts, useDebtSummary } from "@/hooks/useDebts";
import { useLessons } from "@/hooks/useLessons";
import { useBranches } from "@/hooks/useBranches";
import { toHHMM } from "@/types/lesson";
import {
  Users, Wallet, AlertCircle, BarChart3, BookOpen,
  Building2, ArrowUpRight, ChevronDown, GraduationCap,
  UserPlus, DollarSign, CalendarDays,
} from "lucide-react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

// ── Helpers ───────────────────────────────────────────────────────────
function fmtM(n: number | string | undefined): string {
  const num = Number(n) || 0;
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
  return String(Math.round(num));
}

function fmtUZS(n: number | string | undefined): string {
  const num = Number(n) || 0;
  return new Intl.NumberFormat("uz-UZ").format(Math.round(num)) + " UZS";
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

// ── Skeleton ─────────────────────────────────────────────────────────
function Skel({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-hover  rounded-xl ${className}`} />;
}

// ── Section header ────────────────────────────────────────────────────
function SectionHead({ title, sub, href }: { title: string; sub?: string; href?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-[14px] font-bold text-foreground">{title}</h3>
        {sub && <p className="text-[11px] text-foreground-subtle mt-0.5">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-0.5 text-[11px] font-semibold text-primary hover:text-primary transition-colors group shrink-0">
          {t("director.dashboard.see_all")}
          <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// KPI CARD
// ══════════════════════════════════════════════════════════════════════
interface KpiProps {
  icon: React.ReactNode;
  iconCls: string;
  title: string;
  value: React.ReactNode;
  badge?: string;
  badgeUp?: boolean;
  sub?: string;
  loading?: boolean;
}

function KpiCard({ icon, iconCls, title, value, badge, badgeUp, sub, loading }: KpiProps) {
  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-5">
        <Skel className="w-10 h-10 mb-4" />
        <Skel className="w-3/4 h-7 mb-2" />
        <Skel className="w-1/2 h-4" />
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 hover:border-border-subtle transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconCls}`}>
          {icon}
        </div>
        {badge !== undefined && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
            badgeUp
              ? "bg-success-bg text-success"
              : "bg-danger-bg text-danger"
          }`}>
            {badgeUp ? "↑" : "↓"} {badge}
          </span>
        )}
      </div>
      <p className="text-[22px] font-black text-foreground mt-3 leading-none tracking-tight">
        {value}
      </p>
      <p className="text-[12px] font-medium text-foreground-muted mt-1.5">{title}</p>
      {sub && <p className="text-[11px] text-foreground-subtle mt-0.5">{sub}</p>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// INCOME / EXPENSE CHART
// ══════════════════════════════════════════════════════════════════════
const FAKE_MONTHLY = [
  { name: "Yan", income: 48, expense: 32 },
  { name: "Fev", income: 52, expense: 35 },
  { name: "Mar", income: 60, expense: 40 },
  { name: "Apr", income: 58, expense: 39 },
  { name: "May", income: 72, expense: 48 },
  { name: "Iyun", income: 78, expense: 52 },
  { name: "Iyul", income: 85, expense: 56 },
  { name: "Avg", income: 82, expense: 54 },
  { name: "Sen", income: 90, expense: 60 },
  { name: "Okt", income: 95, expense: 63 },
  { name: "Noy", income: 102, expense: 68 },
  { name: "Dek", income: 108, expense: 72 },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-xl shadow-xl p-3 text-[12px]">
      <p className="font-bold text-foreground-muted mb-2 uppercase tracking-wide text-[10px]">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color ?? p.stroke }} />
          <span className="text-foreground-muted flex-1">{p.name}</span>
          <span className="font-bold text-foreground ml-3">{p.value}M</span>
        </div>
      ))}
    </div>
  );
}

function IncomeExpenseChart() {
  const { t } = useTranslation();
  const { data, isLoading } = useAnalyticsChart();

  const chartData = useMemo(() => {
    if (!data?.chart?.length) return FAKE_MONTHLY.map((d) => ({ ...d, net: d.income - d.expense }));
    return data.chart.map((point) => {
      const keys = Object.keys(point).filter((k) => k !== "name");
      const totalIncome = keys.reduce((s, k) => s + (Number(point[k]) || 0), 0);
      const inMil = Math.round(totalIncome / 1_000_000) || 0;
      const expMil = Math.round(inMil * 0.68);
      return { name: String(point.name), income: inMil, expense: expMil, net: inMil - expMil };
    });
  }, [data]);

  const totalIncome = chartData.reduce((s, d) => s + d.income, 0);
  const totalExpense = chartData.reduce((s, d) => s + d.expense, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h3 className="text-[14px] font-bold text-foreground">{t("director.dashboard.income_expense_chart")}</h3>
          <p className="text-[11px] text-foreground-subtle mt-0.5">{t("director.dashboard.income_expense_desc")}</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-success shrink-0" />
            <span className="text-foreground-muted">{t("director.dashboard.income")}: <strong className="text-foreground">{totalIncome}M</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-danger shrink-0" />
            <span className="text-foreground-muted">{t("director.dashboard.expense")}: <strong className="text-foreground">{totalExpense}M</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-soft0 shrink-0" />
            <span className="text-foreground-muted">{t("director.dashboard.net_profit")}: <strong className="text-primary">{netProfit}M</strong></span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Skel className="h-[240px]" />
      ) : (
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border-subtle dark:stroke-border" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#78716c", fontSize: 11, fontWeight: 500 }} dy={6} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#78716c", fontSize: 11, fontWeight: 500 }} tickFormatter={(v) => `${v}M`} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148,163,184,0.05)" }} />
              <Bar dataKey="income" name={t("director.dashboard.income")} fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="expense" name={t("director.dashboard.expense")} fill="#e11d48" radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Line type="monotone" dataKey="net" name={t("director.dashboard.net_profit")} stroke="#b8860b" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// PAYMENT STATUS DONUT
// ══════════════════════════════════════════════════════════════════════
function DonutTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="bg-surface border border-border rounded-xl shadow-xl p-2.5 text-[12px]">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.payload.fill }} />
        <span className="font-semibold text-foreground">{p.name}</span>
      </div>
      <p className="text-foreground-muted mt-0.5">{p.payload.count} ta · {fmtM(p.value)} UZS</p>
    </div>
  );
}

const DONUT_FAKE = [
  { name: "To'langan", value: 85_000_000, count: 42, fill: "#059669" },
  { name: "Kutilayotgan", value: 25_000_000, count: 18, fill: "#d97706" },
  { name: "Muddati o'tgan", value: 12_000_000, count: 8, fill: "#e11d48" },
];

function PaymentStatusDonut() {
  const { t } = useTranslation();
  const { data, isLoading } = useDebtSummary();

  const pieData = useMemo(() => {
    if (data?.by_status?.length) {
      const FILLS = ["#059669", "#d97706", "#e11d48"];
      return data.by_status.map((s, i) => ({
        name: s.status === "paid" ? "To'langan" : s.status === "unpaid" ? "Kutilayotgan" : "Muddati o'tgan",
        value: s.amount,
        count: s.count,
        fill: FILLS[i % 3],
      }));
    }
    return DONUT_FAKE;
  }, [data]);

  const total = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <h3 className="text-[14px] font-bold text-foreground mb-0.5">{t("director.dashboard.payment_status_chart")}</h3>
      <p className="text-[11px] text-foreground-subtle mb-4">Jami: {fmtM(total)} UZS</p>

      {isLoading ? (
        <Skel className="h-[160px]" />
      ) : (
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={44} outerRadius={66} paddingAngle={3} dataKey="value" nameKey="name">
                {pieData.map((d, i) => <Cell key={i} fill={d.fill} stroke="none" />)}
              </Pie>
              <Tooltip content={<DonutTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border-subtle">
        {pieData.map((d) => (
          <div key={d.name} className="text-center">
            <p className="text-[15px] font-black" style={{ color: d.fill }}>{d.count}</p>
            <p className="text-[10px] text-foreground-subtle mt-0.5 leading-tight">{d.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// TODAY LESSONS
// ══════════════════════════════════════════════════════════════════════
function TodayLessons() {
  const { t } = useTranslation();
  const { data, isLoading } = useLessons({ pageSize: 6, date: todayStr() });
  const lessons = data?.results ?? [];

  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <SectionHead title={t("director.dashboard.today_lessons")} href="/director/lessons" />
      {isLoading ? (
        <div className="space-y-2">{[0, 1, 2].map((i) => <Skel key={i} className="h-14" />)}</div>
      ) : lessons.length === 0 ? (
        <div className="py-8 flex flex-col items-center gap-2 text-center">
          <div className="w-11 h-11 rounded-xl bg-hover  flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-foreground-subtle" />
          </div>
          <p className="text-[12px] text-foreground-subtle">{t("director.dashboard.today_lessons_empty")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.slice(0, 5).map((lesson) => (
            <div key={lesson.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-raised/60 border border-border-subtle hover:bg-hover transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary-soft  flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-primary " />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-foreground truncate">{lesson.group_name}</p>
                <p className="text-[11px] text-foreground-subtle mt-0.5">
                  {toHHMM(lesson.start_time)} – {toHHMM(lesson.end_time)}
                  {lesson.topic ? ` · ${lesson.topic}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// RECENT PAYMENTS
// ══════════════════════════════════════════════════════════════════════
function RecentPayments() {
  const { t } = useTranslation();
  const { data, isLoading } = usePayments({ pageSize: 5 });
  const payments = data?.results ?? [];

  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <SectionHead title={t("director.dashboard.recent_payments")} href="/director/payments" />
      {isLoading ? (
        <div className="space-y-2">{[0, 1, 2].map((i) => <Skel key={i} className="h-14" />)}</div>
      ) : payments.length === 0 ? (
        <div className="py-8 flex flex-col items-center gap-2 text-center">
          <div className="w-11 h-11 rounded-xl bg-hover  flex items-center justify-center">
            <Wallet className="w-5 h-5 text-foreground-subtle" />
          </div>
          <p className="text-[12px] text-foreground-subtle">{t("director.dashboard.no_payments")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-raised/60 border border-border-subtle hover:bg-hover transition-colors">
              <div className="w-8 h-8 rounded-lg bg-success-bg flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-foreground truncate">{p.student_name || "—"}</p>
                <p className="text-[11px] text-foreground-subtle mt-0.5 truncate">{p.group_name || p.branch_name || "—"}</p>
              </div>
              <span className="text-[12px] font-bold text-success shrink-0 tabular-nums">
                +{fmtM(p.final_amount ?? p.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// DEBTORS LIST
// ══════════════════════════════════════════════════════════════════════
function DebtorsList() {
  const { t } = useTranslation();
  const { data, isLoading } = useDebts({ status: "unpaid", pageSize: 5 });
  const debts = data?.results ?? [];

  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <SectionHead title={t("director.dashboard.debtors")} href="/director/debts" />
      {isLoading ? (
        <div className="space-y-2">{[0, 1, 2].map((i) => <Skel key={i} className="h-14" />)}</div>
      ) : debts.length === 0 ? (
        <div className="py-8 flex flex-col items-center gap-2 text-center">
          <div className="w-11 h-11 rounded-xl bg-hover  flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-foreground-subtle" />
          </div>
          <p className="text-[12px] text-foreground-subtle">{t("director.dashboard.debtors_empty")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {debts.map((d) => (
            <div key={d.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-raised/60 border border-border-subtle hover:bg-hover transition-colors">
              <div className="w-8 h-8 rounded-lg bg-danger-bg flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-danger" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-foreground truncate">{d.student_name || "—"}</p>
                <p className="text-[11px] text-foreground-subtle mt-0.5 truncate">{d.group_name || "—"}</p>
              </div>
              <span className="text-[12px] font-bold text-danger shrink-0 tabular-nums">
                {fmtM(d.amount)} UZS
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// QUICK ACTIONS
// ══════════════════════════════════════════════════════════════════════
function QuickActions() {
  const { t } = useTranslation();

  const actions = [
    { icon: <UserPlus className="w-4 h-4" />, label: t("director.dashboard.add_student"), href: "/director/students", cls: "text-success bg-success-bg border-success/20 hover:bg-success-bg" },
    { icon: <Users className="w-4 h-4" />, label: t("director.dashboard.add_group"), href: "/director/groups", cls: "text-primary  bg-primary-soft  border-primary/30 hover:bg-primary-soft " },
    { icon: <DollarSign className="w-4 h-4" />, label: t("director.dashboard.add_payment"), href: "/director/payments", cls: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 hover:bg-warning-bg dark:hover:bg-amber-950/50" },
    { icon: <BookOpen className="w-4 h-4" />, label: t("director.dashboard.add_lesson"), href: "/director/lessons", cls: "text-foreground-muted bg-hover border-border hover:bg-border" },
  ];

  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <h3 className="text-[14px] font-bold text-foreground mb-4">{t("director.dashboard.quick_actions")}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((a) => (
          <Link key={a.label} href={a.href} className={`flex items-center gap-2.5 p-3.5 rounded-xl border font-semibold text-[13px] transition-colors ${a.cls}`}>
            {a.icon}
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// BRANCHES STATUS
// ══════════════════════════════════════════════════════════════════════
function BranchesStatus() {
  const { t } = useTranslation();
  const { data, isLoading } = useBranches({ pageSize: 20 });
  const branches = data?.data ?? [];

  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <SectionHead title={t("director.dashboard.branch_status")} href="/director/branches" />
      {isLoading ? (
        <div className="space-y-2">{[0, 1, 2].map((i) => <Skel key={i} className="h-14" />)}</div>
      ) : branches.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-[12px] text-foreground-subtle">{t("director.dashboard.no_branches")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {branches.map((b) => (
            <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-raised/60 border border-border-subtle hover:bg-hover transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary-soft  flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-primary " />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-foreground truncate">{b.name}</p>
                <p className="text-[11px] text-foreground-subtle mt-0.5">
                  {b.stats?.students_count ?? 0} {t("director.dashboard.kpi.students")}
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                b.status === "active"
                  ? "bg-success-bg text-success"
                  : "bg-hover text-foreground-muted"
              }`}>
                {b.status === "active" ? "Faol" : "Nofaol"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// QUICK STATS
// ══════════════════════════════════════════════════════════════════════
function QuickStats() {
  const { t } = useTranslation();

  const stats = [
    { label: t("director.dashboard.new_students"), value: "24", icon: <GraduationCap className="w-4 h-4" />, cls: "text-success bg-success-bg" },
    { label: t("director.dashboard.active_groups"), value: "18", icon: <Users className="w-4 h-4" />, cls: "text-primary bg-primary-soft" },
    { label: t("director.dashboard.teachers_stat"), value: "12", icon: <BookOpen className="w-4 h-4" />, cls: "text-warning bg-warning-bg" },
    { label: t("director.dashboard.avg_fill"), value: "78%", icon: <BarChart3 className="w-4 h-4" />, cls: "text-foreground-muted bg-hover" },
  ];

  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <h3 className="text-[14px] font-bold text-foreground mb-4">{t("director.dashboard.quick_stats")}</h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`p-3.5 rounded-xl flex items-center gap-3 ${s.cls}`}>
            {s.icon}
            <div>
              <p className="text-[18px] font-black leading-none">{s.value}</p>
              <p className="text-[11px] mt-1 leading-tight opacity-80">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════
export default function DashboardView() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [period, setPeriod] = useState<"this_month" | "last_month">("this_month");

  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary();

  return (
    <div className="space-y-5 pb-6">
      {/* ── Greeting ─────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-black text-foreground leading-tight">
            {t("director.dashboard.greeting", { name: user?.first_name || "Director" })} 👋
          </h1>
          <p className="text-[13px] text-foreground-muted mt-1">
            {t("director.dashboard.greeting_sub")}
          </p>
        </div>
        <div className="relative shrink-0">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as "this_month" | "last_month")}
            className="appearance-none pl-3 pr-8 h-9 text-[12px] font-semibold bg-surface border border-border rounded-xl text-foreground focus:outline-none focus:border-primary cursor-pointer transition-colors"
          >
            <option value="this_month">{t("director.dashboard.period_this_month")}</option>
            <option value="last_month">{t("director.dashboard.period_last_month")}</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-subtle pointer-events-none" />
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<Users className="w-5 h-5" />}
          iconCls="bg-primary-soft text-primary"
          title={t("director.dashboard.kpi.students")}
          value="850"
          badge="8.2%"
          badgeUp={true}
          sub={t("director.dashboard.kpi.vs_prev")}
          loading={summaryLoading}
        />
        <KpiCard
          icon={<Wallet className="w-5 h-5" />}
          iconCls="bg-success-bg text-success"
          title={t("director.dashboard.kpi.revenue")}
          value={summary?.month_revenue ? fmtUZS(summary.month_revenue) : "—"}
          badge={summary?.month_revenue_change !== undefined ? `${Math.abs(Math.round(summary.month_revenue_change))}%` : undefined}
          badgeUp={summary ? summary.month_revenue_change >= 0 : undefined}
          loading={summaryLoading}
        />
        <KpiCard
          icon={<AlertCircle className="w-5 h-5" />}
          iconCls="bg-danger-bg text-danger"
          title={t("director.dashboard.kpi.debt")}
          value={summary?.pending_debts ? fmtUZS(summary.pending_debts) : "—"}
          badge={summary?.pending_debts_change !== undefined ? `${Math.abs(Math.round(summary.pending_debts_change))}%` : undefined}
          badgeUp={summary ? summary.pending_debts_change <= 0 : undefined}
          sub={summary?.pending_debts_students_count ? t("director.dashboard.kpi.debt_count", { count: summary.pending_debts_students_count }) : undefined}
          loading={summaryLoading}
        />
        <KpiCard
          icon={<BarChart3 className="w-5 h-5" />}
          iconCls="bg-warning-bg text-warning"
          title={t("director.dashboard.kpi.attendance")}
          value="87%"
          badge="2.1%"
          badgeUp={true}
          sub={t("director.dashboard.kpi.avg")}
          loading={summaryLoading}
        />
      </div>

      {/* ── Charts ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <IncomeExpenseChart />
        </div>
        <PaymentStatusDonut />
      </div>

      {/* ── Data Lists ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TodayLessons />
        <RecentPayments />
        <DebtorsList />
      </div>

      {/* ── Quick Actions ────────────────────────────────── */}
      <QuickActions />

      {/* ── Branch Status + Quick Stats ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BranchesStatus />
        <QuickStats />
      </div>
    </div>
  );
}
