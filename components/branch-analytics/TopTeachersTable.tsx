"use client";

import { GraduationCap } from "lucide-react";
import type { TopTeacher } from "@/types/branchAnalytics";
import { avatarColor, initials } from "@/types/attendance";

function AttBadge({ pct }: { pct: number }) {
  const cls = pct >= 90 ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    : pct >= 80 ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
    : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400";
  return <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${cls}`}>{pct}%</span>;
}

interface Props {
  teachers: TopTeacher[];
  loading?: boolean;
}

export default function TopTeachersTable({ teachers, loading }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <GraduationCap className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">O'qituvchilar</h3>
      </div>

      {loading ? (
        <div className="p-4 space-y-3 animate-pulse">
          {[1,2,3,4].map((i) => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg" />)}
        </div>
      ) : !teachers.length ? (
        <div className="p-10 text-center text-slate-400 text-sm">
          <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-30" />
          O'qituvchilar topilmadi
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">O'qituvchi</th>
                <th className="px-3 py-3 text-center">Guruhlar</th>
                <th className="px-3 py-3 text-center">O'quvchilar</th>
                <th className="px-5 py-3 text-center">Davomat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${avatarColor(t.name)}`}>
                        {initials(t.name)}
                      </div>
                      <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-center text-slate-600 dark:text-slate-400">{t.groups_count}</td>
                  <td className="px-3 py-3.5 text-center text-slate-600 dark:text-slate-400">{t.students_count}</td>
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
