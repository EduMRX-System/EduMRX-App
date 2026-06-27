"use client";

import { GraduationCap } from "lucide-react";
import type { TopTeacher } from "@/types/branchAnalytics";
import { avatarColor, initials } from "@/types/attendance";

function AttBadge({ pct }: { pct: number }) {
  const cls = pct >= 90 ? "bg-success-bg dark:bg-success/10 text-success dark:text-success"
    : pct >= 80 ? "bg-warning-bg dark:bg-warning-bg0/10 text-amber-700 dark:text-warning"
    : "bg-danger-bg dark:bg-danger/10 text-danger dark:text-danger";
  return <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${cls}`}>{pct}%</span>;
}

interface Props {
  teachers: TopTeacher[];
  loading?: boolean;
}

export default function TopTeachersTable({ teachers, loading }: Props) {
  return (
    <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border-subtle">
        <GraduationCap className="w-4 h-4 text-foreground-subtle" />
        <h3 className="text-sm font-bold text-foreground">O'qituvchilar</h3>
      </div>

      {loading ? (
        <div className="p-4 space-y-3 animate-pulse">
          {[1,2,3,4].map((i) => <div key={i} className="h-10 bg-hover rounded-lg" />)}
        </div>
      ) : !teachers.length ? (
        <div className="p-10 text-center text-foreground-subtle text-sm">
          <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-30" />
          O'qituvchilar topilmadi
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-semibold text-foreground-subtle dark:text-foreground-muted uppercase tracking-wider">
                <th className="px-5 py-3 text-left">O'qituvchi</th>
                <th className="px-3 py-3 text-center">Guruhlar</th>
                <th className="px-3 py-3 text-center">O'quvchilar</th>
                <th className="px-5 py-3 text-center">Davomat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle dark:divide-border">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-hover/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${avatarColor(t.name)}`}>
                        {initials(t.name)}
                      </div>
                      <span className="text-[13px] font-semibold text-foreground">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-center text-foreground-muted">{t.groups_count}</td>
                  <td className="px-3 py-3.5 text-center text-foreground-muted">{t.students_count}</td>
                  <td className="px-5 py-3.5 text-center"><AttBadge pct={t.avg_attendance} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
