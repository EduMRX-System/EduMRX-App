"use client";

import { CreditCard } from "lucide-react";
import type { RecentPayment } from "@/types/branchAnalytics";
import { formatCompact } from "@/types/branchAnalytics";
import { initials, avatarColor } from "@/types/attendance";

function StatusBadge({ status }: { status: RecentPayment["status"] }) {
  const cls = status === "paid"
    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    : status === "pending"
    ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
    : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400";
  const label = status === "paid" ? "To'langan" : status === "pending" ? "Kutilayotgan" : "Qarzdor";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls}`}>{label}</span>
  );
}

interface Props {
  payments: RecentPayment[];
  loading?: boolean;
}

export default function RecentPaymentsList({ payments, loading }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <CreditCard className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">So'nggi to'lovlar</h3>
      </div>

      {loading ? (
        <div className="p-4 space-y-3 animate-pulse">
          {[1,2,3,4,5].map((i) => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg" />)}
        </div>
      ) : !payments.length ? (
        <div className="p-10 text-center text-slate-400 text-sm">
          <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
          To'lovlar topilmadi
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${avatarColor(p.student_name)}`}>
                {initials(p.student_name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-slate-900 dark:text-slate-100 truncate">{p.student_name}</p>
                <p className="text-[10px] text-slate-400 truncate">{p.date} · {p.method}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[12px] font-bold text-slate-900 dark:text-slate-100">{formatCompact(p.amount)}</p>
                <StatusBadge status={p.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
