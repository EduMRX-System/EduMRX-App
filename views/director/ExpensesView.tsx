"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus, Search, X, ChevronLeft, ChevronRight, Loader2, AlertCircle,
  TrendingDown, TrendingUp, Check, ChevronDown, Trash2, Edit2,
  LayoutGrid, Receipt, Building2, Tag,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import {
  useExpenses, useExpenseSummary, useCreateExpense, useUpdateExpense, useDeleteExpense,
} from "@/hooks/useExpenses";
import {
  useExpenseCategories, useCreateExpenseCategory, useUpdateExpenseCategory, useDeleteExpenseCategory,
} from "@/hooks/useExpenseCategories";
import {
  type IExpense, type IExpenseCategory, type ExpensePayload,
  EXPENSE_STATUS_OPTIONS, EXPENSE_METHOD_OPTIONS, MONTHS_UZ,
  getExpenseStatusOption,
} from "@/types/expense";
import { formatAmount, formatDate } from "@/types/payment";
import AsyncBranchSelect from "@/components/common/AsyncBranchSelect";

const PAGE_SIZE = 10;
const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#8b5cf6", "#ef4444"];

function formatAmountInput(raw: string): string {
  const n = raw.replace(/[^0-9]/g, "");
  if (!n) return "";
  return Number(n).toLocaleString("uz-UZ");
}

function parseAmountRaw(formatted: string): string {
  return formatted.replace(/[^0-9]/g, "");
}

// ── Simple Select ─────────────────────────────────────────────────
function SimpleSelect({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((v) => !v)} className="border border-border rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer bg-surface text-foreground min-w-[140px]">
        <span className={selected ? "" : "text-foreground-subtle"}>{selected?.label ?? placeholder ?? "—"}</span>
        <ChevronDown className={`w-4 h-4 text-foreground-subtle ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute left-0 mt-1 bg-surface border border-border rounded-lg shadow-xl z-50 min-w-full overflow-hidden">
          <div className="py-1">
            {placeholder && (
              <div onClick={() => { onChange(""); setOpen(false); }} className="px-3 py-2 text-sm cursor-pointer text-foreground-subtle hover:bg-surface-raised ">{placeholder}</div>
            )}
            {options.map((opt) => (
              <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }} className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${value === opt.value ? "bg-primary-soft  text-primary font-medium" : "text-foreground hover:bg-surface-raised "}`}>
                {opt.label}
                {value === opt.value && <Check className="w-3.5 h-3.5 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────
function StatusBadge({ status, display }: { status?: string; display?: string }) {
  const opt = getExpenseStatusOption(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${opt.bg} ${opt.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${opt.dot}`} />
      {display ?? opt.label}
    </span>
  );
}

// ── Category Form Modal ───────────────────────────────────────────
function CategoryFormModal({ cat, onClose }: { cat?: IExpenseCategory | null; onClose: () => void }) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(cat?.name ?? "");
  const [icon, setIcon] = useState(cat?.icon ?? "");
  const [err, setErr] = useState("");
  const isEdit = !!cat;

  const createMut = useCreateExpenseCategory();
  const updateMut = useUpdateExpenseCategory();
  const isPending = createMut.isPending || updateMut.isPending;

  useEffect(() => { setMounted(true); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setErr("Nom kiritilmagan"); return; }
    try {
      if (isEdit && cat) {
        await updateMut.mutateAsync({ id: cat.id, name, icon });
        toast.success(t("director.expenses.toast.cat_updated"));
      } else {
        await createMut.mutateAsync({ name, icon });
        toast.success(t("director.expenses.toast.cat_created"));
      }
      onClose();
    } catch {
      toast.error(t("director.expenses.toast.error_generic"));
    }
  }

  const fieldCls = "border border-border rounded-lg w-full h-10 px-3 text-sm outline-none transition-all bg-surface text-foreground focus:border-primary focus:ring-2 focus:ring-primary-ring/50";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className={`fixed inset-0 bg-overlay backdrop-blur-sm transition-opacity ${mounted ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`bg-surface rounded-xl max-w-sm w-full p-6 relative z-10 shadow-2xl border border-border-subtle transition-all duration-300 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">
            {isEdit ? t("director.expenses.categories.form_edit") : t("director.expenses.categories.form_add")}
          </h3>
          <button onClick={onClose} className="text-foreground-subtle hover:text-foreground-muted p-1.5 rounded-lg hover:bg-hover cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[13px] text-foreground-muted mb-1 block font-semibold">{t("director.expenses.categories.name_label")}</label>
            <input value={name} onChange={(e) => { setName(e.target.value); setErr(""); }} placeholder={t("director.expenses.categories.name_placeholder")} className={fieldCls} />
            {err && <p className="text-red-400 text-[11px] mt-0.5">{err}</p>}
          </div>
          <div>
            <label className="text-[13px] text-foreground-muted mb-1 block font-semibold">{t("director.expenses.categories.icon_label")}</label>
            <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder={t("director.expenses.categories.icon_placeholder")} className={fieldCls} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-10 border border-border text-foreground text-sm font-semibold rounded-lg hover:bg-surface-raised dark:hover:bg-hover cursor-pointer">{t("common.cancel")}</button>
            <button type="submit" disabled={isPending} className="flex-1 h-10 bg-primary hover:bg-primary-hover text-primary-fg text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer inline-flex items-center justify-center gap-2">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? t("common.save") : t("common.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Expense Form Modal ────────────────────────────────────────────
interface ExpenseForm {
  title: string;
  amount: string; amountDisplay: string;
  method: string; status: string;
  category: string; branch: string;
  expense_date: string;
  period_month: number; period_year: number;
  comment: string;
}

function initExpenseForm(e?: IExpense | null): ExpenseForm {
  const now = new Date();
  return {
    title: e?.title ?? "",
    amount: e?.amount ?? "",
    amountDisplay: e?.amount ? formatAmountInput(e.amount) : "",
    method: e?.method ?? "cash",
    status: e?.status ?? "planned",
    category: e?.category ?? "",
    branch: e?.branch ?? "",
    expense_date: e?.expense_date ?? now.toISOString().slice(0, 10),
    period_month: e?.period_month ?? now.getMonth() + 1,
    period_year: e?.period_year ?? now.getFullYear(),
    comment: e?.comment ?? "",
  };
}

function ExpenseFormModal({ expense, categories, onClose }: {
  expense?: IExpense | null;
  categories: IExpenseCategory[];
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<ExpenseForm>(() => initExpenseForm(expense));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!expense;
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);

  useEffect(() => { setMounted(true); }, []);

  const createMut = useCreateExpense();
  const updateMut = useUpdateExpense();
  const isPending = createMut.isPending || updateMut.isPending;

  const set = (k: keyof ExpenseForm, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Sarlavha kiriting";
    if (!form.amount || form.amount === "0") e.amount = "Summani kiriting";
    if (!form.category) e.category = "Kategoriya tanlang";
    if (!form.branch) e.branch = "Filial tanlang";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    const payload: ExpensePayload = {
      title: form.title,
      amount: form.amount,
      method: form.method,
      status: form.status,
      category: form.category,
      branch: form.branch,
      expense_date: form.expense_date,
      period_month: form.period_month,
      period_year: form.period_year,
      comment: form.comment || undefined,
    } as ExpensePayload;

    try {
      if (isEdit && expense) {
        await updateMut.mutateAsync({ id: expense.id, ...payload });
        toast.success(t("director.expenses.toast.updated"));
      } else {
        await createMut.mutateAsync(payload);
        toast.success(t("director.expenses.toast.created"));
      }
      onClose();
    } catch (err: any) {
      const d = err?.response?.data;
      if (d && typeof d === "object") {
        const key = Object.keys(d)[0];
        if (key) {
          const msg = Array.isArray(d[key]) ? d[key][0] : d[key];
          return toast.error(`${key}: ${msg}`);
        }
      }
      toast.error(t("director.expenses.toast.error_generic"));
    }
  }

  const labelCls = "text-[13px] text-foreground-muted mb-1 block font-semibold";
  const fieldCls = (err?: boolean) =>
    `border rounded-lg w-full h-10 px-3 text-sm outline-none transition-all bg-surface text-foreground focus:ring-2 focus:ring-primary-ring/50 ${err ? "border-danger/50" : "border-border focus:border-primary"}`;
  const errCls = "text-red-400 text-[11px] mt-0.5";
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className={`fixed inset-0 bg-overlay backdrop-blur-sm transition-opacity ${mounted ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`bg-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl border border-border-subtle transition-all duration-300 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95"}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-soft  flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {isEdit ? t("director.expenses.form.title_edit") : t("director.expenses.form.title_add")}
            </h3>
          </div>
          <button onClick={onClose} className="text-foreground-subtle hover:text-foreground-muted p-1.5 rounded-lg hover:bg-hover cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className={labelCls}>{t("director.expenses.form.title_label")}</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder={t("director.expenses.form.title_placeholder")} className={fieldCls(!!errors.title)} />
            {errors.title && <p className={errCls}>{errors.title}</p>}
          </div>

          {/* Amount + Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t("director.expenses.form.amount_label")}</label>
              <input
                value={form.amountDisplay}
                onChange={(e) => { const raw = parseAmountRaw(e.target.value); setForm((f) => ({ ...f, amount: raw, amountDisplay: formatAmountInput(raw) })); }}
                placeholder={t("director.expenses.form.amount_placeholder")}
                className={fieldCls(!!errors.amount)}
              />
              {errors.amount && <p className={errCls}>{errors.amount}</p>}
            </div>
            <div>
              <label className={labelCls}>{t("director.expenses.form.method_label")}</label>
              <SimpleSelect value={form.method} onChange={(v) => set("method", v)} options={EXPENSE_METHOD_OPTIONS} />
            </div>
          </div>

          {/* Status + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t("director.expenses.form.status_label")}</label>
              <SimpleSelect value={form.status} onChange={(v) => set("status", v)} options={EXPENSE_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
            </div>
            <div>
              <label className={labelCls}>{t("director.expenses.form.category_label")}</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={fieldCls(!!errors.category)}
              >
                <option value="">{t("director.expenses.form.category_placeholder")}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className={errCls}>{errors.category}</p>}
            </div>
          </div>

          {/* Branch */}
          <div>
            <AsyncBranchSelect
              centerId={activeCenter}
              value={form.branch}
              onChange={(id) => set("branch", id)}
              label={t("director.expenses.form.branch_label")}
              required
              error={errors.branch}
            />
          </div>

          {/* Date + Period */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>{t("director.expenses.form.date_label")}</label>
              <input type="date" value={form.expense_date} onChange={(e) => set("expense_date", e.target.value)} className={fieldCls()} />
            </div>
            <div>
              <label className={labelCls}>{t("director.expenses.form.period_month_label")}</label>
              <select value={form.period_month} onChange={(e) => set("period_month", Number(e.target.value))} className={fieldCls()}>
                {MONTHS_UZ.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t("director.expenses.form.period_year_label")}</label>
              <select value={form.period_year} onChange={(e) => set("period_year", Number(e.target.value))} className={fieldCls()}>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className={labelCls}>{t("director.expenses.form.comment_label")}</label>
            <input value={form.comment} onChange={(e) => set("comment", e.target.value)} placeholder={t("director.expenses.form.comment_placeholder")} className={fieldCls()} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <button type="button" onClick={onClose} className="h-10 px-4 border border-border bg-surface text-foreground hover:bg-surface-raised text-sm font-semibold rounded-lg cursor-pointer transition-colors">{t("common.cancel")}</button>
            <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 h-10 px-5 bg-primary hover:bg-primary-hover text-primary-fg text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? t("common.save") : t("common.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Expense Modal ──────────────────────────────────────────
function DeleteExpenseModal({ expense, onClose }: { expense: IExpense; onClose: () => void }) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const deleteMut = useDeleteExpense();
  useEffect(() => { setMounted(true); }, []);

  async function handleDelete() {
    try {
      await deleteMut.mutateAsync(expense.id);
      toast.success(t("director.expenses.toast.deleted"));
      onClose();
    } catch { toast.error(t("director.expenses.toast.delete_error")); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className={`fixed inset-0 bg-overlay backdrop-blur-sm transition-opacity ${mounted ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`bg-surface rounded-xl max-w-sm w-full p-6 relative z-10 shadow-2xl border border-border-subtle transition-all duration-300 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <div className="w-12 h-12 rounded-full bg-danger-bg flex items-center justify-center mb-4 mx-auto"><Trash2 className="w-6 h-6 text-danger" /></div>
        <h3 className="text-center text-base font-semibold text-foreground mb-2">{t("director.expenses.delete.title")}</h3>
        <p className="text-center text-sm text-foreground-muted mb-6">{t("director.expenses.delete.desc")}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-10 border border-border text-foreground text-sm font-semibold rounded-lg hover:bg-surface-raised dark:hover:bg-hover cursor-pointer">{t("common.cancel")}</button>
          <button onClick={handleDelete} disabled={deleteMut.isPending} className="flex-1 h-10 bg-danger hover:bg-danger/90 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer inline-flex items-center justify-center gap-2">
            {deleteMut.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("common.delete") || "O'chirish"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Summary Card ──────────────────────────────────────────────────
function SummaryCard({ icon, title, value, loading }: { icon: React.ReactNode; title: string; value: string; loading?: boolean }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-danger-bg flex items-center justify-center shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-foreground-muted mb-1">{title}</p>
        {loading ? <div className="h-6 w-28 bg-border  rounded animate-pulse" /> : <p className="text-lg font-bold text-foreground truncate">{value}</p>}
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-xl shadow-xl p-3 text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-danger font-bold">{formatAmount(payload[0].value)}</p>
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────
export default function ExpensesView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<IExpense | null>(null);
  const [deleting, setDeleting] = useState<IExpense | null>(null);
  const [editingCat, setEditingCat] = useState<IExpenseCategory | null>(null);
  const [addCatOpen, setAddCatOpen] = useState(false);
  const deleteCatMut = useDeleteExpenseCategory();

  useEffect(() => {
    const h = setTimeout(() => { setDebounced(search.trim()); setPage(1); }, 500);
    return () => clearTimeout(h);
  }, [search]);

  const { data, isLoading, isError, isFetching } = useExpenses({
    page, pageSize: PAGE_SIZE, search: debounced, status: filterStatus, category: filterCategory,
  });
  const { data: summary, isLoading: summaryLoading } = useExpenseSummary();
  const { data: catData } = useExpenseCategories();

  const expenses = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const categories = catData?.results ?? [];

  const monthlyData = summary?.monthly_data ?? [];
  const pieData = summary?.by_category?.filter((c) => c.amount > 0) ?? [];
  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  async function handleDeleteCat(id: string) {
    try {
      await deleteCatMut.mutateAsync(id);
      toast.success(t("director.expenses.toast.cat_deleted"));
    } catch { toast.error(t("director.expenses.toast.error_generic")); }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t("director.expenses.title")}</h1>
          <p className="mt-0.5 text-sm text-foreground-muted">{t("director.expenses.count", { count })}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategories((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-raised dark:hover:bg-hover"
          >
            <LayoutGrid className="h-4 w-4" /> {t("director.expenses.categories_btn")}
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" /> {t("director.expenses.add_btn")}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard icon={<TrendingDown className="w-5 h-5 text-danger" />} title={t("director.expenses.summary.total")} value={formatAmount(summary?.total_amount)} loading={summaryLoading} />
        <SummaryCard icon={<Receipt className="w-5 h-5 text-warning" />} title={t("director.expenses.summary.monthly")} value={formatAmount(summary?.monthly_amount)} loading={summaryLoading} />
        <SummaryCard icon={<TrendingUp className="w-5 h-5 text-foreground-muted" />} title={t("director.expenses.summary.planned")} value={formatAmount(summary?.planned_amount)} loading={summaryLoading} />
      </div>

      {/* Charts */}
      {(monthlyData.length > 0 || pieData.length > 0) && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Monthly Bar Chart */}
          {monthlyData.length > 0 && (
            <div className="xl:col-span-3 bg-surface border border-border-subtle rounded-2xl p-6">
              <h2 className="text-base font-semibold text-foreground mb-4">{t("director.expenses.chart_title_monthly")}</h2>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border-subtle dark:stroke-border" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(99,102,241,0.04)" }} />
                    <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {/* Pie Chart */}
          {pieData.length > 0 && (
            <div className="xl:col-span-2 bg-surface border border-border-subtle rounded-2xl p-6">
              <h2 className="text-base font-semibold text-foreground mb-4">{t("director.expenses.chart_title_category")}</h2>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="amount" nameKey="name" paddingAngle={3}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatAmount(v)} />
                    <Legend iconType="circle" iconSize={8} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Categories Section */}
      {showCategories && (
        <div className="bg-surface border border-border-subtle rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              {t("director.expenses.categories.title")}
            </h2>
            <button onClick={() => setAddCatOpen(true)} className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-semibold cursor-pointer">
              <Plus className="w-4 h-4" /> {t("director.expenses.categories.add_btn")}
            </button>
          </div>
          {categories.length === 0 ? (
            <p className="text-sm text-foreground-subtle text-center py-6">{t("director.expenses.categories.empty")}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <div key={cat.id} className="border border-border-subtle rounded-xl p-3 flex flex-col items-center gap-2 relative group">
                  <div className="w-9 h-9 rounded-lg bg-primary-soft  flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground text-center line-clamp-1">{cat.name}</span>
                  {cat.is_system && (
                    <span className="text-[10px] font-semibold text-foreground-subtle bg-hover  px-1.5 py-0.5 rounded">{t("director.expenses.categories.system_badge")}</span>
                  )}
                  {!cat.is_system && (
                    <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                      <button onClick={() => setEditingCat(cat)} className="p-1 rounded text-foreground-subtle hover:text-primary hover:bg-primary-soft  cursor-pointer"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDeleteCat(cat.id)} className="p-1 rounded text-foreground-subtle hover:text-danger hover:bg-danger-bg cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("director.expenses.search_placeholder")} className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-8 text-sm text-foreground outline-none transition placeholder:text-foreground-subtle focus:border-primary focus:ring-2 focus:ring-primary/20" />
          {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground-muted cursor-pointer"><X className="h-4 w-4" /></button>}
        </div>
        <SimpleSelect value={filterStatus} onChange={(v) => { setFilterStatus(v); setPage(1); }} options={EXPENSE_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} placeholder={t("director.expenses.all_statuses")} />
        {categoryOptions.length > 0 && (
          <SimpleSelect value={filterCategory} onChange={(v) => { setFilterCategory(v); setPage(1); }} options={categoryOptions} placeholder={t("director.expenses.all_categories")} />
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-raised text-xs uppercase tracking-wider text-foreground-muted">
                <th className="py-3.5 px-4 font-semibold">{t("director.expenses.table.title")}</th>
                <th className="py-3.5 px-4 font-semibold hidden sm:table-cell">{t("director.expenses.table.category")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("director.expenses.table.amount")}</th>
                <th className="py-3.5 px-4 font-semibold hidden md:table-cell">{t("director.expenses.table.method")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("director.expenses.table.status")}</th>
                <th className="py-3.5 px-4 font-semibold hidden lg:table-cell">{t("director.expenses.table.date")}</th>
                <th className="py-3.5 px-4 font-semibold hidden xl:table-cell">{t("director.expenses.table.by")}</th>
                <th className="py-3.5 px-4 text-right font-semibold">{t("director.expenses.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle dark:divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 w-32 bg-border  rounded" /></td>
                    <td className="py-4 px-4 hidden sm:table-cell"><div className="h-4 w-20 bg-border  rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-24 bg-border  rounded" /></td>
                    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 w-16 bg-border  rounded" /></td>
                    <td className="py-4 px-4"><div className="h-6 w-24 bg-border  rounded-full" /></td>
                    <td className="py-4 px-4 hidden lg:table-cell"><div className="h-4 w-20 bg-border  rounded" /></td>
                    <td className="py-4 px-4 hidden xl:table-cell"><div className="h-4 w-24 bg-border  rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-12 bg-border  rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <AlertCircle className="mx-auto h-9 w-9 text-danger" />
                    <p className="mt-2 text-sm font-semibold text-danger">{t("common.error_failed")}</p>
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <TrendingDown className="mx-auto mb-3 h-10 w-10 text-foreground-muted" />
                    <p className="text-sm font-medium text-foreground-muted">{t("director.expenses.empty.title")}</p>
                    <p className="mt-1 text-sm text-foreground-subtle">{t("director.expenses.empty.desc")}</p>
                  </td>
                </tr>
              ) : (
                expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-surface-raised dark:hover:bg-hover/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground">{e.title ?? "—"}</div>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-foreground-subtle shrink-0" />
                        <span className="text-foreground-muted text-sm">{e.category_name ?? "—"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">{formatAmount(e.amount)}</td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-foreground-muted">
                      {EXPENSE_METHOD_OPTIONS.find((m) => m.value === e.method)?.label ?? e.method_display ?? e.method ?? "—"}
                    </td>
                    <td className="py-3.5 px-4"><StatusBadge status={e.status} display={e.status_display} /></td>
                    <td className="py-3.5 px-4 hidden lg:table-cell text-foreground-muted">{formatDate(e.expense_date)}</td>
                    <td className="py-3.5 px-4 hidden xl:table-cell text-foreground-muted">{e.performed_by_name ?? "—"}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(e)} className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary-soft  transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleting(e)} className="p-1.5 rounded-lg text-foreground-subtle hover:text-danger hover:bg-danger-bg transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && expenses.length > 0 && (
          <div className="flex items-center justify-between border-t border-border-subtle px-5 py-3 ">
            <span className="flex items-center gap-2 text-sm text-foreground-muted">
              {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!data?.previous} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40   dark:hover:bg-hover">
                <ChevronLeft className="h-4 w-4" /> {t("common.prev")}
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={!data?.next} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40   dark:hover:bg-hover">
                {t("common.next")} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {addOpen && <ExpenseFormModal categories={categories} onClose={() => setAddOpen(false)} />}
      {editing && <ExpenseFormModal expense={editing} categories={categories} onClose={() => setEditing(null)} />}
      {deleting && <DeleteExpenseModal expense={deleting} onClose={() => setDeleting(null)} />}
      {addCatOpen && <CategoryFormModal onClose={() => setAddCatOpen(false)} />}
      {editingCat && <CategoryFormModal cat={editingCat} onClose={() => setEditingCat(null)} />}
    </div>
  );
}
