"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Users } from "lucide-react";
import type { StudentGrowthPoint } from "@/types/branchAnalytics";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">{p.name}</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px]">{p.value} ta</span>
        </div>
      ))}
    </div>
  );
}

interface Props {
  data: StudentGrowthPoint[];
  loading?: boolean;
}

export default function StudentGrowthChart({ data, loading }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <Users className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">O'quvchilar o'sishi</h3>
      </div>

      {loading ? (
        <div className="h-52 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />
      ) : !data.length ? (
        <div className="h-52 flex items-center justify-center text-slate-400 text-sm">Ma'lumot yo'q</div>
      ) : (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100 dark:stroke-slate-800" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#94a3b8", strokeDasharray: "4 4", strokeWidth: 1 }} />
              <Area type="monotone" dataKey="total"        name="Jami"       stroke="#6366f1" strokeWidth={2} fill="url(#gradTotal)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="new_students" name="Yangi"      stroke="#10b981" strokeWidth={2} fill="url(#gradNew)"   dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
