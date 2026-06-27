export type DebtStatus = "unpaid" | "paid" | "overdue" | string;

export interface IDebt {
  id: string;
  student?: string;
  student_name?: string;
  student_phone?: string;
  group?: string;
  group_name?: string;
  amount: string;
  due_date?: string;
  status?: DebtStatus;
  status_display?: string;
}

export interface DebtPayload {
  student: string;
  group: string;
  amount: string;
  due_date: string;
  status: DebtStatus;
}

export const DEBT_STATUS_OPTIONS: {
  value: string;
  label: string;
  color: string;
  bg: string;
  dot: string;
}[] = [
  { value: "unpaid", label: "To'lanmagan", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", dot: "bg-amber-500" },
  { value: "paid", label: "To'langan", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", dot: "bg-emerald-500" },
  { value: "overdue", label: "Muddati o'tgan", color: "text-rose-700 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", dot: "bg-rose-500" },
];

export function getDebtStatusOption(status?: string) {
  return (
    DEBT_STATUS_OPTIONS.find((s) => s.value === status) ?? {
      value: status ?? "",
      label: status ?? "—",
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-100 dark:bg-slate-800",
      dot: "bg-slate-400",
    }
  );
}

export function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}
