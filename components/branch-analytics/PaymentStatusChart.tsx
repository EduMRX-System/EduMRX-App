"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Wallet } from "lucide-react";
import type { PaymentStatusData } from "@/types/branchAnalytics";
import { formatCompact } from "@/types/branchAnalytics";

const COLORS = ["#059669", "#d97706", "#ef4444"];
const LABELS = ["To'langan", "Kutilayotgan", "Qarzdor"];

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="bg-surface border border-border rounded-xl shadow-xl p-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.payload.fill }} />
        <span className="font-semibold text-foreground">{p.name}</span>
      </div>
      <p className="text-foreground-muted text-[11px] mt-1">{formatCompact(p.value)} UZS · {p.payload.count} ta</p>
    </div>
  );
}

interface Props {
  data: PaymentStatusData | null;
  loading?: boolean;
}

export default function PaymentStatusChart({ data, loading }: Props) {
  const pieData = data ? [
    { name: "To'langan",     value: data.paid_amount,    count: data.paid_count,    fill: COLORS[0] },
    { name: "Kutilayotgan",  value: data.pending_amount, count: data.pending_count, fill: COLORS[1] },
    { name: "Qarzdor",       value: data.overdue_amount, count: data.overdue_count, fill: COLORS[2] },
  ].filter((d) => d.value > 0) : [];

  const total = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <Wallet className="w-4 h-4 text-foreground-subtle" />
        <h3 className="text-sm font-bold text-foreground">To'lov holati</h3>
        {total > 0 && !loading && (
          <span className="ml-auto text-[11px] text-foreground-subtle font-medium">{formatCompact(total)} UZS jami</span>
        )}
      </div>

      {loading ? (
        <div className="h-52 animate-pulse bg-hover rounded-xl" />
      ) : !pieData.length ? (
        <div className="h-52 flex items-center justify-center text-foreground-subtle text-sm">Ma'lumot yo'q</div>
      ) : (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="45%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value" nameKey="name">
                {pieData.map((d, i) => <Cell key={i} fill={d.fill} stroke="none" />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats row */}
      {!loading && data && (
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border-subtle">
          {[
            { label: "To'langan", count: data.paid_count, color: "text-success" },
            { label: "Kutilayotgan", count: data.pending_count, color: "text-warning" },
            { label: "Qarzdor", count: data.overdue_count, color: "text-danger" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className={`text-base font-black ${s.color}`}>{s.count}</p>
              <p className="text-[10px] text-foreground-subtle mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
