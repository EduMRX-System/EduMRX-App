"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { FinancePoint } from "@/types/branchAnalytics";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-xl shadow-xl p-3 text-sm min-w-[160px]">
      <p className="font-semibold text-foreground-muted mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-foreground-muted text-[11px]">{p.name}</span>
          </div>
          <span className="font-bold text-foreground text-[11px]">{p.value}M</span>
        </div>
      ))}
    </div>
  );
}

interface Props {
  data: FinancePoint[];
  loading?: boolean;
}

export default function FinanceChart({ data, loading }: Props) {
  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-4 h-4 text-foreground-subtle" />
        <h3 className="text-sm font-bold text-foreground">Daromad / Xarajat</h3>
      </div>

      {loading ? (
        <div className="h-52 animate-pulse bg-hover rounded-xl" />
      ) : !data.length ? (
        <div className="h-52 flex items-center justify-center text-foreground-subtle text-sm">Ma'lumot yo'q</div>
      ) : (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 0, left: -22, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border-subtle dark:stroke-border" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `${v}M`} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ paddingTop: 12, fontSize: 11 }} />
              <Bar dataKey="revenue"  name="Daromad"  fill="#b8860b" radius={[3, 3, 0, 0]} barSize={data.length > 6 ? 14 : 22} />
              <Bar dataKey="expenses" name="Xarajat"  fill="#f97316" radius={[3, 3, 0, 0]} barSize={data.length > 6 ? 14 : 22} opacity={0.8} />
              <Bar dataKey="profit"   name="Sof foyda" fill="#059669" radius={[3, 3, 0, 0]} barSize={data.length > 6 ? 14 : 22} opacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
