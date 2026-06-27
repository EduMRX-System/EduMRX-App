"use client";

import { BookOpen } from "lucide-react";
import type { GroupFill } from "@/types/branchAnalytics";
import { formatCompact } from "@/types/branchAnalytics";

function FillBar({ percent }: { percent: number }) {
  const color = percent >= 80 ? "bg-success" : percent >= 60 ? "bg-warning" : "bg-rose-400";
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 bg-hover rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className={`text-[11px] font-bold w-8 text-right shrink-0 ${
        percent >= 80 ? "text-success"
        : percent >= 60 ? "text-warning"
        : "text-danger"
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
    <div className="bg-surface border border-border-subtle rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-foreground-subtle" />
        <h3 className="text-sm font-bold text-foreground">Guruhlar to'ldirilishi</h3>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1,2,3,4,5].map((i) => <div key={i} className="h-10 bg-hover rounded-lg" />)}
        </div>
      ) : !groups.length ? (
        <div className="py-10 text-center text-foreground-subtle text-sm">Guruhlar topilmadi</div>
      ) : (
        <div className="space-y-2">
          {sorted.map((g) => (
            <div key={g.id} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-hover/50 transition-colors group">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-foreground truncate">{g.name}</div>
                <div className="text-[10px] text-foreground-subtle truncate">{g.teacher}</div>
              </div>
              <div className="shrink-0 text-[11px] text-foreground-muted w-10 text-center">
                {g.current}/{g.capacity}
              </div>
              <div className="w-24 shrink-0">
                <FillBar percent={g.fill_percent} />
              </div>
              <div className="shrink-0 text-[11px] font-semibold text-foreground-muted w-16 text-right hidden sm:block">
                {formatCompact(g.revenue)} UZS
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
