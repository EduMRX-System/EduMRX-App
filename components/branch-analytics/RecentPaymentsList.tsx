"use client";

import { CreditCard } from "lucide-react";
import type { RecentPayment } from "@/types/branchAnalytics";
import { formatCompact } from "@/types/branchAnalytics";
import { initials, avatarColor } from "@/types/attendance";

function StatusBadge({ status }: { status: RecentPayment["status"] }) {
  const cls = status === "paid"
    ? "bg-success-bg dark:bg-success/10 text-success dark:text-success"
    : status === "pending"
    ? "bg-warning-bg dark:bg-warning-bg0/10 text-amber-700 dark:text-warning"
    : "bg-danger-bg dark:bg-danger/10 text-danger";
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
    <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border-subtle">
        <CreditCard className="w-4 h-4 text-foreground-subtle" />
        <h3 className="text-sm font-bold text-foreground">So'nggi to'lovlar</h3>
      </div>

      {loading ? (
        <div className="p-4 space-y-3 animate-pulse">
          {[1,2,3,4,5].map((i) => <div key={i} className="h-12 bg-hover rounded-lg" />)}
        </div>
      ) : !payments.length ? (
        <div className="p-10 text-center text-foreground-subtle text-sm">
          <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
          To'lovlar topilmadi
        </div>
      ) : (
        <div className="divide-y divide-border-subtle dark:divide-border max-h-80 overflow-y-auto">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-hover/40 transition-colors">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${avatarColor(p.student_name)}`}>
                {initials(p.student_name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-foreground truncate">{p.student_name}</p>
                <p className="text-[10px] text-foreground-subtle truncate">{p.date} · {p.method}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[12px] font-bold text-foreground">{formatCompact(p.amount)}</p>
                <StatusBadge status={p.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
