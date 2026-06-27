"use client";

import { BookOpen } from "lucide-react";
import type { GroupFill } from "@/types/branchAnalytics";
import { formatCompact } from "@/types/branchAnalytics";

function FillBar({ percent }: { percent: number }) {
  const color = percent >= 80 ? "bg-emerald-500" : percent >= 60 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className={`text-[11px] font-bold w-8 text-right shrink-0 ${
        percent >= 80 ? "text-emerald-600 dark:text-emerald-400"
        : percent >= 60 ? "text-amber-600 dark:text-amber-400"
        : "text-rose-600 dark:text-rose-400"
      }`}>{percent}%</span>
    </div>
  );
}

interface Props {
  groups: GroupFill[];
  loading?: boolean;
}

export default function GroupsFillChart({ groups, loading }: Props) {
  const sorted = [...groups].sort((a, b) => b.fill_percent - a.fill_percent);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Guruhlar to'ldirilishi</h3>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1,2,3,4,5].map((i) => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg" />)}
        </div>
      ) : !groups.length ? (
        <div className="py-10 text-center text-slate-400 text-sm">Guruhlar topilmadi</div>
      ) : (
        <div className="space-y-2">
          {sorted.map((g) => (
            <div key={g.id} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 truncate">{g.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{g.teacher}</div>
              </div>
              <div className="shrink-0 text-[11px] text-slate-500 dark:text-slate-400 w-10 text-center">
                {g.current}/{g.capacity}
              </div>
              <div className="w-24 shrink-0">
                <FillBar percent={g.fill_percent} />
              </div>
              <div className="shrink-0 text-[11px] font-semibold text-slate-600 dark:text-slate-400 w-16 text-right hidden sm:block">
                {formatCompact(g.revenue)} UZS
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
