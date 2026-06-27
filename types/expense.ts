export type ExpenseMethod = "cash" | "card" | "transfer" | string;
export type ExpenseStatus = "planned" | "completed" | "cancelled" | string;

export interface IExpenseCategory {
  id: string;
  name: string;
  icon?: string;
  is_system?: boolean;
  is_active?: boolean;
}

export interface IExpense {
  id: string;
  title?: string;
  amount: string;
  method?: ExpenseMethod;
  method_display?: string;
  status?: ExpenseStatus;
  status_display?: string;
  category?: string;
  category_name?: string;
  category_icon?: string;
  branch?: string;
  branch_name?: string;
  expense_date?: string;
  period_month?: number;
  period_year?: number;
  receipt_image?: string;
  comment?: string;
  performed_by_name?: string;
}

export interface ExpensePayload {
  title: string;
  amount: string;
  method: ExpenseMethod;
  status: ExpenseStatus;
  category: string;
  branch: string;
  expense_date: string;
  period_month: number;
  period_year: number;
  receipt_image?: string;
  comment?: string;
}

export interface ExpenseSummary {
  total_amount?: string | number;
  monthly_amount?: string | number;
  planned_amount?: string | number;
  by_category?: { name: string; amount: number; icon?: string; color?: string }[];
  monthly_data?: { month: string; amount: number }[];
}

export const EXPENSE_STATUS_OPTIONS: {
  value: string;
  label: string;
  color: string;
  bg: string;
  dot: string;
}[] = [
  { value: "planned", label: "Rejalashtirilgan", color: "text-sky-700 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-500/10", dot: "bg-sky-500" },
  { value: "completed", label: "Bajarildi", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", dot: "bg-emerald-500" },
  { value: "cancelled", label: "Bekor qilindi", color: "text-rose-700 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", dot: "bg-rose-500" },
];

export const EXPENSE_METHOD_OPTIONS: { value: string; label: string }[] = [
  { value: "cash", label: "Naqd" },
  { value: "card", label: "Karta" },
  { value: "transfer", label: "O'tkazma" },
];

export const MONTHS_UZ = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

export function getExpenseStatusOption(status?: string) {
  return (
    EXPENSE_STATUS_OPTIONS.find((s) => s.value === status) ?? {
      value: status ?? "",
      label: status ?? "—",
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-100 dark:bg-slate-800",
      dot: "bg-slate-400",
    }
  );
}
