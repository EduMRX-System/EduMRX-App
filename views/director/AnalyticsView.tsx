"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Building2,
  AlertCircle,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  useAnalyticsSummary,
  useAnalyticsChart,
  useAnalyticsCenters,
  useAnalyticsBranches,
  useAnalyticsTransactions,
} from "@/hooks/useAnalytics";
import Title from "@/components/ui/Title";
import Text from "@/components/ui/Text";

const CHART_COLORS = ["#b8860b", "#059669", "#d97706", "#e11d48", "#d4a017", "#78716c"];

function fmtCompact(n: number): string {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  return new Intl.NumberFormat("uz-UZ").format(n);
}

function ChangeBadge({ value }: { value: number | undefined }) {
  if (value === null || value === undefined) return null;
  const pos = value >= 0;
  const Icon = pos ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
        pos ? "bg-success-bg text-success" : "bg-danger-bg text-danger"
      }`}
    >
      <Icon className="w-3 h-3" />
      {pos ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
        active ? "bg-success-bg text-success" : "bg-hover text-foreground-muted"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-success" : "bg-foreground-subtle"}`} />
      {status}
    </span>
  );
}

function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-surface border border-border rounded-2xl p-5 h-36">
          <div className="w-10 h-10 rounded-xl bg-hover mb-3" />
          <div className="h-3 bg-hover rounded w-1/2 mb-2" />
          <div className="h-7 bg-hover rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}

function RowSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="p-5 space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-11 bg-hover rounded-xl" />
      ))}
    </div>
  );
}

export default function AnalyticsView() {
  const { t } = useTranslation();
  const [centersPage, setCentersPage] = useState(1);

  const summaryQ = useAnalyticsSummary();
  const chartQ = useAnalyticsChart();
  const centersQ = useAnalyticsCenters(centersPage);
  const branchesQ = useAnalyticsBranches();
  const transactionsQ = useAnalyticsTransactions();

  const summary = summaryQ.data;
  const chartData = chartQ.data;
  const centers = centersQ.data;
  const branches = branchesQ.data ?? [];
  const transactions = transactionsQ.data ?? [];

  // Build dynamic chart series
  const chartSeries: Array<{ key: string; label: string; color: string }> = [];
  if (chartData) {
    const def = chartData.keys_definition ?? {};
    if (Object.keys(def).length > 0) {
      Object.entries(def).forEach(([key, meta], i) => {
        chartSeries.push({
          key,
          label: meta.label ?? key,
          color: meta.color ?? CHART_COLORS[i % CHART_COLORS.length],
        });
      });
    } else if (chartData?.chart?.length > 0) {
      Object.keys(chartData.chart[0])
        .filter((k) => k !== "name")
        .forEach((key, i) => {
          chartSeries.push({ key, label: key, color: CHART_COLORS[i % CHART_COLORS.length] });
        });
    }
  }

  const totalPages = centers?.meta
    ? Math.ceil(centers.meta.total / centers.meta.per_page)
    : 1;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <Title text={t("director.analytics.overview_title")} />
        <Text text={t("director.analytics.overview_subtitle")} />
      </div>

      {/* Stat cards */}
      {summaryQ.isLoading ? (
        <CardSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total revenue */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-3">
              <Wallet className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-foreground-subtle uppercase tracking-wide">
              {t("director.analytics.stat.total_revenue")}
            </p>
            <h3 className="text-2xl font-black text-foreground mt-1">
              {fmtCompact(summary?.total_revenue ?? 0)}{" "}
              <span className="text-base font-semibold">UZS</span>
            </h3>
          </div>

          {/* Monthly revenue */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-success-bg text-success flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-foreground-subtle uppercase tracking-wide">
              {t("director.analytics.stat.monthly_revenue")}
            </p>
            <div className="flex items-end gap-2 mt-1">
              <h3 className="text-2xl font-black text-foreground">
                {fmtCompact(summary?.month_revenue ?? 0)}{" "}
                <span className="text-base font-semibold">UZS</span>
              </h3>
              <ChangeBadge value={summary?.month_revenue_change} />
            </div>
          </div>

          {/* Centers */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-foreground-subtle uppercase tracking-wide">
              {t("director.analytics.stat.centers")}
            </p>
            <h3 className="text-2xl font-black text-foreground mt-1">
              {summary?.active_centers ?? 0}
              <span className="text-base font-semibold text-foreground-subtle ml-1">
                / {summary?.total_centers ?? 0}
              </span>
            </h3>
            <p className="text-[11px] text-foreground-subtle mt-0.5">{t("director.analytics.stat.active")}</p>
          </div>

          {/* Debts */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-warning-bg text-warning flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-foreground-subtle uppercase tracking-wide">
              {t("director.analytics.stat.debts")}
            </p>
            <div className="flex items-end gap-2 mt-1">
              <h3 className="text-2xl font-black text-foreground">
                {fmtCompact(summary?.pending_debts ?? 0)}{" "}
                <span className="text-base font-semibold">UZS</span>
              </h3>
              <ChangeBadge value={summary?.pending_debts_change} />
            </div>
            {(summary?.pending_debts_students_count ?? 0) > 0 && (
              <p className="text-[11px] text-foreground-subtle mt-0.5">
                {summary?.pending_debts_students_count} {t("director.analytics.stat.debtors")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main revenue bar chart */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-foreground-subtle" />
            <h3 className="text-sm font-bold text-foreground">
              {t("director.analytics.chart_section.title")}
            </h3>
          </div>
          {chartData?.total_sum_formatted && (
            <span className="text-xs font-semibold text-foreground-muted bg-surface-raised px-3 py-1 rounded-full">
              {t("director.analytics.chart_section.total")} {chartData.total_sum_formatted}
            </span>
          )}
        </div>

        {chartQ.isLoading ? (
          <div className="h-72 animate-pulse bg-hover rounded-xl" />
        ) : !chartData || chartData?.chart?.length === 0 || chartSeries?.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center gap-3 text-foreground-subtle">
            <TrendingUp className="w-10 h-10 opacity-30" />
            <p className="text-sm">{t("director.analytics.chart_section.no_data")}</p>
          </div>
        ) : (
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.chart}
                margin={{ top: 10, right: 10, left: -5, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#44403c"
                  opacity={0.25}
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  stroke="#a8a29e"
                  fontSize={11}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="#a8a29e"
                  fontSize={11}
                  width={48}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
                />
                <Tooltip
                  cursor={{ fill: "#44403c", opacity: 0.12 }}
                  contentStyle={{
                    backgroundColor: "#1c1917",
                    borderRadius: "12px",
                    border: "1px solid #292524",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: any, name: any) => {
                    const s = chartSeries.find((x) => x.key === name);
                    return [`${fmtCompact(value)} UZS`, s?.label ?? name];
                  }}
                />
                {chartSeries?.length > 1 && (
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ paddingTop: "14px", fontSize: "11px" }}
                  />
                )}
                {chartSeries.map((s) => (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    name={s.label}
                    fill={s.color}
                    radius={[4, 4, 0, 0]}
                    barSize={chartSeries?.length === 1 ? 30 : 16}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Bottom 2-column: centers table + transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Centers table (2/3) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl shadow-xs overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border-subtle">
            <Building2 className="w-4 h-4 text-foreground-subtle" />
            <h3 className="text-sm font-bold text-foreground">
              {t("director.analytics.centers_table.title")}
            </h3>
          </div>

          {centersQ.isLoading ? (
            <RowSkeleton rows={4} />
          ) : !centers?.data?.length ? (
            <div className="p-10 text-center">
              <Building2 className="w-8 h-8 text-foreground-muted mx-auto mb-2" />
              <p className="text-sm text-foreground-subtle">
                {t("director.analytics.centers_table.empty")}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[11px] font-bold text-foreground-subtle uppercase tracking-wide">
                      <th className="px-5 py-3 text-left">
                        {t("director.analytics.centers_table.name")}
                      </th>
                      <th className="px-3 py-3 text-right">
                        {t("director.analytics.centers_table.students")}
                      </th>
                      <th className="px-3 py-3 text-right">
                        {t("director.analytics.centers_table.monthly")}
                      </th>
                      <th className="px-3 py-3 text-right">
                        {t("director.analytics.centers_table.total")}
                      </th>
                      <th className="px-5 py-3 text-center">
                        {t("director.analytics.centers_table.status")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {centers.data.map((c) => (
                      <tr key={c.id} className="hover:bg-hover transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-foreground">
                          {c.name}
                        </td>
                        <td className="px-3 py-3.5 text-right">
                          <span className="inline-flex items-center justify-end gap-1 text-foreground-muted">
                            <Users className="w-3.5 h-3.5 opacity-60" />
                            {c.students_count}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-right text-foreground-muted whitespace-nowrap text-xs">
                          {fmtCompact(c.month_revenue)} UZS
                        </td>
                        <td className="px-3 py-3.5 text-right font-semibold text-foreground whitespace-nowrap text-xs">
                          {fmtCompact(c.total_revenue)} UZS
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <StatusDot status={c.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {centers.meta && totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-border-subtle">
                  <span className="text-xs text-foreground-subtle">
                    {t("common.page_of", {
                      page: centers.meta.current_page,
                      total: totalPages,
                    })}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCentersPage((p) => Math.max(1, p - 1))}
                      disabled={centersPage === 1}
                      className="p-1.5 rounded-lg border border-border text-foreground-muted hover:bg-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCentersPage((p) => Math.min(totalPages, p + 1))}
                      disabled={centersPage >= totalPages}
                      className="p-1.5 rounded-lg border border-border text-foreground-muted hover:bg-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Transactions (1/3) — safe empty state */}
        <div className="bg-surface border border-border rounded-2xl shadow-xs overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border-subtle">
            <Wallet className="w-4 h-4 text-foreground-subtle" />
            <h3 className="text-sm font-bold text-foreground">
              {t("director.analytics.transactions_section.title")}
            </h3>
          </div>

          {transactionsQ.isLoading ? (
            <RowSkeleton rows={5} />
          ) : transactions?.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-8 h-8 text-foreground-muted mx-auto mb-2" />
              <p className="text-sm text-foreground-subtle">
                {t("director.analytics.transactions_section.empty")}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border-subtle max-h-80 overflow-y-auto">
              {transactions.map((tx: any, i: number) => (
                <div
                  key={tx.id ?? i}
                  className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-hover transition-colors"
                >
                  <span className="text-sm text-foreground truncate">
                    {tx.name ?? tx.description ?? tx.title ?? `#${i + 1}`}
                  </span>
                  <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                    {fmtCompact(tx.amount ?? 0)} UZS
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Branches chips */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-foreground-subtle" />
          <h3 className="text-sm font-bold text-foreground">
            {t("director.analytics.branches_section.title")}
          </h3>
        </div>

        {branchesQ.isLoading ? (
          <div className="flex gap-2 flex-wrap animate-pulse">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-7 w-24 bg-hover rounded-full" />
            ))}
          </div>
        ) : branches?.length === 0 ? (
          <p className="text-sm text-foreground-subtle">{t("director.analytics.branches_section.empty")}</p>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {branches.map((b) => (
              <span
                key={b.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-border text-foreground bg-surface-raised"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    b.status === "active" ? "bg-success" : "bg-foreground-subtle"
                  }`}
                />
                {b.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
