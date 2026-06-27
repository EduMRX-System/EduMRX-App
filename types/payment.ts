export type PaymentMethod = "cash" | "card" | "transfer" | "online" | string;
export type PaymentStatus = "pending" | "paid" | "overdue" | string;

export interface IPayment {
  id: string;
  student?: string;
  student_name?: string;
  student_phone?: string;
  group?: string;
  group_name?: string;
  branch?: string;
  branch_name?: string;
  amount: string;
  discount?: string;
  final_amount?: string;
  method?: PaymentMethod;
  method_display?: string;
  status?: PaymentStatus;
  status_display?: string;
  period_month?: number;
  period_year?: number;
  due_date?: string;
  receipt_number?: string;
  comment?: string;
  paid_at?: string;
  created_at?: string;
}

export interface PaymentPayload {
  student: string;
  group: string;
  branch: string;
  amount: string;
  discount?: string;
  method: PaymentMethod;
  status: PaymentStatus;
  period_month: number;
  period_year: number;
  due_date?: string;
  receipt_number?: string;
  comment?: string;
}

export interface PaymentPatchPayload {
  discount?: string;
  method?: PaymentMethod;
  status?: PaymentStatus;
  due_date?: string;
  receipt_number?: string;
  comment?: string;
}

export interface PaymentSummary {
  total_amount?: string | number;
  monthly_amount?: string | number;
  pending_amount?: string | number;
  total_count?: number;
  monthly_count?: number;
  pending_count?: number;
  total_change?: number;
  monthly_change?: number;
  monthly_data?: { month: string; amount: number }[];
}

export const PAYMENT_METHOD_OPTIONS: { value: string; label: string }[] = [
  { value: "cash", label: "Naqd" },
  { value: "card", label: "Karta" },
  { value: "transfer", label: "O'tkazma" },
  { value: "online", label: "Online" },
];

export const PAYMENT_STATUS_OPTIONS: {
  value: string;
  label: string;
  color: string;
  bg: string;
  dot: string;
}[] = [
  { value: "pending", label: "Kutilmoqda", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", dot: "bg-amber-500" },
  { value: "paid", label: "To'langan", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", dot: "bg-emerald-500" },
  { value: "overdue", label: "Muddati o'tgan", color: "text-rose-700 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", dot: "bg-rose-500" },
];

export const MONTHS_UZ = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

export function formatPeriod(month?: number, year?: number): string {
  if (!month || !year) return "—";
  return `${MONTHS_UZ[(month - 1) % 12]} ${year}`;
}

export function formatAmount(v?: string | number | null): string {
  if (v == null || v === "") return "—";
  const n = Number(v);
  if (isNaN(n)) return "—";
  return new Intl.NumberFormat("uz-UZ").format(Math.abs(n)) + " UZS";
}

export function formatDate(d?: string | null): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return d;
  }
}

export function getPaymentStatusOption(status?: string) {
  return (
    PAYMENT_STATUS_OPTIONS.find((s) => s.value === status) ?? {
      value: status ?? "",
      label: status ?? "—",
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-100 dark:bg-slate-800",
      dot: "bg-slate-400",
    }
  );
}

export function getMethodLabel(method?: string, display?: string): string {
  if (display) return display;
  return PAYMENT_METHOD_OPTIONS.find((m) => m.value === method)?.label ?? method ?? "—";
}
