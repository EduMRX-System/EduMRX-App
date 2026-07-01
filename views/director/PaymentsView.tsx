"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Plus, Search, X, ChevronLeft, ChevronRight, Loader2, AlertCircle,
  CreditCard, Wallet, TrendingUp, TrendingDown, Check, ChevronDown,
  Trash2, Edit2, Receipt,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import {
  usePayments, usePaymentSummary, useCreatePayment, useUpdatePayment, useDeletePayment,
} from "@/hooks/usePayments";
import { useStudentSearchOptions } from "@/hooks/useStudents";
import { useGroupSearchOptions } from "@/hooks/useGroups";
import {
  type IPayment, type PaymentPayload, type PaymentPatchPayload,
  PAYMENT_METHOD_OPTIONS, PAYMENT_STATUS_OPTIONS,
  formatAmount, formatDate, formatPeriod, getPaymentStatusOption, getMethodLabel,
} from "@/types/payment";
import AsyncBranchSelect from "@/components/common/AsyncBranchSelect";
import DatePicker, { MonthYearPicker } from "@/components/ui/DatePicker";
import MoneyInput from "@/components/ui/MoneyInput";
import FormModalShell from "@/components/common/FormModalShell";
import { getFormDraft, useFormDraftSave, clearFormDraft } from "@/hooks/useFormDraft";

const PAGE_SIZE = 10;

// ── Inline async student search select ────────────────────────────
function StudentSelect({
  value, label, onChange, placeholder,
}: {
  value: string;
  label: string;
  onChange: (id: string, name: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({ id: value, name: label });
  const ref = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useStudentSearchOptions(search, open);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (value && label) setSelected({ id: value, name: label });
  }, [value, label]);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen((v) => !v)}
        className="border border-border rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer bg-surface text-foreground"
      >
        <span className={selected.id ? "" : "text-foreground-subtle"}>{selected.id ? selected.name : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-foreground-subtle transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-border-subtle">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qidirish..."
              className="w-full h-8 px-3 text-sm rounded-md bg-surface-raised /50 border border-transparent outline-none focus:border-primary text-foreground placeholder:text-foreground-subtle"
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {isLoading ? (
              <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin text-foreground-subtle" /></div>
            ) : !data?.length ? (
              <div className="px-3 py-3 text-xs text-center text-foreground-subtle">Topilmadi</div>
            ) : data.map((item) => (
              <div
                key={item.id}
                onClick={() => { setSelected(item); onChange(item.id, item.name); setOpen(false); setSearch(""); }}
                className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${selected.id === item.id ? "bg-primary-soft  text-primary font-medium" : "text-foreground hover:bg-surface-raised "}`}
              >
                <div>
                  <div className="font-medium">{item.name}</div>
                  {item.phone && <div className="text-xs text-foreground-subtle">{item.phone}</div>}
                </div>
                {selected.id === item.id && <Check className="w-4 h-4 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Inline group select ────────────────────────────────────────────
function GroupSelect({
  value, label, onChange, placeholder,
}: {
  value: string;
  label: string;
  onChange: (id: string, name: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({ id: value, name: label });
  const ref = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGroupSearchOptions(search, open);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (value && label) setSelected({ id: value, name: label });
  }, [value, label]);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen((v) => !v)}
        className="border border-border rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer bg-surface text-foreground"
      >
        <span className={selected.id ? "" : "text-foreground-subtle"}>{selected.id ? selected.name : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-foreground-subtle transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-border-subtle">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Guruh qidirish..."
              className="w-full h-8 px-3 text-sm rounded-md bg-surface-raised /50 border border-transparent outline-none focus:border-primary text-foreground placeholder:text-foreground-subtle"
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {isLoading ? (
              <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin text-foreground-subtle" /></div>
            ) : !data?.length ? (
              <div className="px-3 py-3 text-xs text-center text-foreground-subtle">Topilmadi</div>
            ) : data.map((item) => (
              <div
                key={item.id}
                onClick={() => { setSelected(item); onChange(item.id, item.name); setOpen(false); setSearch(""); }}
                className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${selected.id === item.id ? "bg-primary-soft  text-primary font-medium" : "text-foreground hover:bg-surface-raised "}`}
              >
                <span>{item.name}</span>
                {selected.id === item.id && <Check className="w-4 h-4 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────
function StatusBadge({ status, display }: { status?: string; display?: string }) {
  const opt = getPaymentStatusOption(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${opt.bg} ${opt.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${opt.dot}`} />
      {display ?? opt.label}
    </span>
  );
}

// ── Inline SimpleSelect ────────────────────────────────────────────
function SimpleSelect({
  value, onChange, options, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen((v) => !v)}
        className="border border-border rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer bg-surface text-foreground min-w-[140px]"
      >
        <span className={selected ? "" : "text-foreground-subtle"}>{selected?.label ?? placeholder ?? "—"}</span>
        <ChevronDown className={`w-4 h-4 text-foreground-subtle ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute left-0 mt-1 bg-surface border border-border rounded-lg shadow-xl z-50 min-w-full overflow-hidden">
          <div className="py-1">
            {placeholder && (
              <div
                onClick={() => { onChange(""); setOpen(false); }}
                className="px-3 py-2 text-sm cursor-pointer text-foreground-subtle hover:bg-surface-raised "
              >
                {placeholder}
              </div>
            )}
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${value === opt.value ? "bg-primary-soft  text-primary font-medium" : "text-foreground hover:bg-surface-raised "}`}
              >
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

// ── Payment Form Modal ────────────────────────────────────────────
interface FormState {
  student: string; studentName: string;
  group: string; groupName: string;
  branch: string;
  amount: string;
  discount: string;
  method: string;
  status: string;
  period_month: number; period_year: number;
  due_date: string;
  receipt_number: string;
  comment: string;
}

function initForm(p?: IPayment | null): FormState {
  const now = new Date();
  return {
    student: p?.student ?? "",
    studentName: p?.student_name ?? "",
    group: p?.group ?? "",
    groupName: p?.group_name ?? "",
    branch: p?.branch ?? "",
    amount: p?.amount ?? "",
    discount: p?.discount ?? "",
    method: p?.method ?? "cash",
    status: p?.status ?? "pending",
    period_month: p?.period_month ?? now.getMonth() + 1,
    period_year: p?.period_year ?? now.getFullYear(),
    due_date: p?.due_date ?? "",
    receipt_number: p?.receipt_number ?? "",
    comment: p?.comment ?? "",
  };
}

function PaymentFormModal({ payment, onClose }: { payment?: IPayment | null; onClose: () => void }) {
  const { t } = useTranslation();
  const isEdit = !!payment;
  const draftKey = isEdit ? `edit-payment-${payment!.id}-draft` : "payment-form-draft";
  const draft = getFormDraft<FormState>(draftKey);
  const [form, setForm] = useState<FormState>(() => ({ ...initForm(payment), ...draft }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);

  useFormDraftSave(draftKey, form);

  const createMut = useCreatePayment();
  const updateMut = useUpdatePayment();
  const isPending = createMut.isPending || updateMut.isPending;

  const set = (k: keyof FormState, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.student) e.student = "O'quvchini tanlang";
    if (!form.group) e.group = "Guruhni tanlang";
    if (!form.branch) e.branch = "Filialni tanlang";
    if (!form.amount || form.amount === "0") e.amount = "Summani kiriting";
    if (!form.method) e.method = "Usulni tanlang";
    if (!form.status) e.status = "Holatni tanlang";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const payload: PaymentPayload = {
      student: form.student,
      group: form.group,
      branch: form.branch,
      amount: form.amount,
      discount: form.discount || undefined,
      method: form.method,
      status: form.status,
      period_month: form.period_month,
      period_year: form.period_year,
      due_date: form.due_date || undefined,
      receipt_number: form.receipt_number || undefined,
      comment: form.comment || undefined,
    } as PaymentPayload;

    try {
      if (isEdit && payment) {
        const patch: PaymentPatchPayload & { id: string } = {
          id: payment.id,
          discount: form.discount || undefined,
          method: form.method,
          status: form.status,
          due_date: form.due_date || undefined,
          receipt_number: form.receipt_number || undefined,
          comment: form.comment || undefined,
        };
        await updateMut.mutateAsync(patch);
        toast.success(t("director.payments.toast.updated"));
      } else {
        await createMut.mutateAsync(payload);
        toast.success(t("director.payments.toast.created"));
      }
      clearFormDraft(draftKey);
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
      toast.error(t("director.payments.toast.error_generic"));
    }
  }

  const labelCls = "text-[13px] text-foreground-muted mb-1 block font-semibold";
  const fieldCls = (err?: boolean) =>
    `border rounded-lg w-full h-10 px-3 text-sm outline-none transition-all bg-surface text-foreground focus:ring-2 focus:ring-primary-ring/50 ${err ? "border-danger/50" : "border-border focus:border-primary"}`;
  const errCls = "text-red-400 text-[11px] mt-0.5";

  return (
    <FormModalShell onClose={onClose} maxWidth="max-w-2xl">
        <div className="sticky top-0 z-50 h-0 w-full flex justify-end items-start pointer-events-none">
          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto -mt-2 -mr-2 text-foreground-subtle hover:text-foreground p-1.5 rounded-lg bg-surface/90 backdrop-blur-sm border border-border shadow-md cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-[10px] border border-border shadow-sm w-[44px] h-[44px] rounded-lg flex justify-center items-center text-primary bg-primary-soft/10">
          <CreditCard className="w-6 h-6" />
        </div>

        <h3 className="text-foreground text-[18px] font-semibold mb-4">
          {isEdit ? t("director.payments.form.title_edit") : t("director.payments.form.title_add")}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student + Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t("director.payments.form.student_label")}</label>
              <StudentSelect
                value={form.student}
                label={form.studentName}
                placeholder={t("director.payments.form.student_placeholder")}
                onChange={(id, name) => { set("student", id); set("studentName", name); }}
              />
              {errors.student && <p className={errCls}>{errors.student}</p>}
            </div>
            <div>
              <label className={labelCls}>{t("director.payments.form.group_label")}</label>
              <GroupSelect
                value={form.group}
                label={form.groupName}
                placeholder={t("director.payments.form.group_placeholder")}
                onChange={(id, name) => { set("group", id); set("groupName", name); }}
              />
              {errors.group && <p className={errCls}>{errors.group}</p>}
            </div>
          </div>

          {/* Branch */}
          {!isEdit && (
            <div>
              <AsyncBranchSelect
                centerId={activeCenter}
                value={form.branch}
                onChange={(id) => set("branch", id)}
                label={t("director.payments.form.branch_label")}
                required
                error={errors.branch}
              />
            </div>
          )}

          {/* Amount + Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MoneyInput
              label={t("director.payments.form.amount_label")}
              value={form.amount}
              onChange={(raw) => set("amount", raw)}
              placeholder={t("director.payments.form.amount_placeholder")}
              error={errors.amount}
              required
            />
            <MoneyInput
              label={t("director.payments.form.discount_label")}
              value={form.discount}
              onChange={(raw) => set("discount", raw)}
              placeholder="0"
            />
          </div>

          {/* Method + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t("director.payments.form.method_label")}</label>
              <SimpleSelect
                value={form.method}
                onChange={(v) => set("method", v)}
                options={PAYMENT_METHOD_OPTIONS}
                placeholder={t("director.payments.form.method_label")}
              />
            </div>
            <div>
              <label className={labelCls}>{t("director.payments.form.status_label")}</label>
              <SimpleSelect
                value={form.status}
                onChange={(v) => set("status", v)}
                options={PAYMENT_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              />
            </div>
          </div>

          {/* Period + Due date */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <MonthYearPicker
                label={`${t("director.payments.form.period_month_label")} / ${t("director.payments.form.period_year_label")}`}
                month={form.period_month}
                year={form.period_year}
                onChangeMonth={(m) => set("period_month", m)}
                onChangeYear={(y) => set("period_year", y)}
              />
            </div>
            <div className="col-span-2">
              <DatePicker
                label={t("director.payments.form.due_date_label")}
                value={form.due_date}
                onChange={(v) => set("due_date", v)}
              />
            </div>
          </div>

          {/* Receipt + Comment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t("director.payments.form.receipt_label")}</label>
              <input
                value={form.receipt_number}
                onChange={(e) => set("receipt_number", e.target.value)}
                placeholder="CHK-001"
                className={fieldCls()}
              />
            </div>
            <div>
              <label className={labelCls}>{t("director.payments.form.comment_label")}</label>
              <input
                value={form.comment}
                onChange={(e) => set("comment", e.target.value)}
                placeholder={t("director.payments.form.comment_placeholder")}
                className={fieldCls()}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <button type="button" onClick={onClose} className="h-10 px-4 border border-border bg-surface text-foreground hover:bg-surface-raised text-sm font-semibold rounded-lg cursor-pointer transition-colors">
              {t("common.cancel")}
            </button>
            <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 h-10 px-5 bg-primary hover:bg-primary-hover text-primary-fg text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? t("common.save") : t("common.create")}
            </button>
          </div>
        </form>
    </FormModalShell>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────
function DeletePaymentModal({ payment, onClose }: { payment: IPayment; onClose: () => void }) {
  const { t } = useTranslation();
  const deleteMut = useDeletePayment();

  async function handleDelete() {
    try {
      await deleteMut.mutateAsync(payment.id);
      toast.success(t("director.payments.toast.deleted"));
      onClose();
    } catch {
      toast.error(t("director.payments.toast.delete_error"));
    }
  }

  return (
    <FormModalShell onClose={onClose} variant="center" maxWidth="max-w-sm">
        <div className="w-12 h-12 rounded-full bg-danger-bg flex items-center justify-center mb-4 mx-auto">
          <Trash2 className="w-6 h-6 text-danger" />
        </div>
        <h3 className="text-center text-base font-semibold text-foreground mb-2">{t("director.payments.delete.title")}</h3>
        <p className="text-center text-sm text-foreground-muted mb-6">{t("director.payments.delete.desc")}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-10 border border-border text-foreground text-sm font-semibold rounded-lg hover:bg-surface-raised dark:hover:bg-hover cursor-pointer transition-colors">
            {t("common.cancel")}
          </button>
          <button onClick={handleDelete} disabled={deleteMut.isPending} className="flex-1 h-10 bg-danger hover:bg-danger/90 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors inline-flex items-center justify-center gap-2">
            {deleteMut.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("common.delete") || "O'chirish"}
          </button>
        </div>
    </FormModalShell>
  );
}

// ── Summary Card ──────────────────────────────────────────────────
function SummaryCard({
  icon, title, value, sub, change, loading,
}: {
  icon: React.ReactNode; title: string; value: string;
  sub?: string; change?: number; loading?: boolean;
}) {
  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-primary-soft  flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-foreground-muted mb-1">{title}</p>
        {loading ? (
          <div className="h-6 w-28 bg-border  rounded animate-pulse" />
        ) : (
          <p className="text-lg font-bold text-foreground truncate">{value}</p>
        )}
        {sub && !loading && <p className="text-xs text-foreground-subtle mt-0.5">{sub}</p>}
        {change !== undefined && !loading && (
          <div className={`inline-flex items-center gap-1 text-xs font-semibold mt-1 ${change >= 0 ? "text-success" : "text-danger"}`}>
            {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-xl shadow-xl p-3 text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-primary font-bold">{formatAmount(payload[0].value)}</p>
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────
export default function PaymentsView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<IPayment | null>(null);
  const [deleting, setDeleting] = useState<IPayment | null>(null);

  useEffect(() => {
    const h = setTimeout(() => { setDebounced(search.trim()); setPage(1); }, 500);
    return () => clearTimeout(h);
  }, [search]);

  const { data, isLoading, isError, isFetching } = usePayments({
    page, pageSize: PAGE_SIZE, search: debounced, status: filterStatus, method: filterMethod,
  });
  const { data: summary, isLoading: summaryLoading } = usePaymentSummary();

  const payments = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const chartData = summary?.monthly_data ?? [];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t("director.payments.title")}</h1>
          <p className="mt-0.5 text-sm text-foreground-muted">{t("director.payments.count", { count })}</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" /> {t("director.payments.add_btn")}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Wallet className="w-5 h-5 text-primary" />}
          title={t("director.payments.summary.total")}
          value={formatAmount(summary?.total_amount)}
          change={summary?.total_change}
          loading={summaryLoading}
        />
        <SummaryCard
          icon={<CreditCard className="w-5 h-5 text-success" />}
          title={t("director.payments.summary.monthly")}
          value={formatAmount(summary?.monthly_amount)}
          change={summary?.monthly_change}
          loading={summaryLoading}
        />
        <SummaryCard
          icon={<Receipt className="w-5 h-5 text-warning" />}
          title={t("director.payments.summary.pending")}
          value={formatAmount(summary?.pending_amount)}
          loading={summaryLoading}
        />
        <SummaryCard
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          title={t("director.payments.summary.count")}
          value={summaryLoading ? "—" : String(summary?.total_count ?? count)}
          sub={summary?.monthly_count ? `Bu oy: ${summary.monthly_count}` : undefined}
          loading={summaryLoading}
        />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-surface border border-border-subtle rounded-2xl p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">{t("director.payments.chart_title")}</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b8860b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#b8860b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border-subtle dark:stroke-border" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#78716c", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#78716c", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#a8a29e", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area type="monotone" dataKey="amount" stroke="#b8860b" strokeWidth={2.5} fillOpacity={1} fill="url(#payGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("director.payments.search_placeholder")}
            className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-8 text-sm text-foreground outline-none transition placeholder:text-foreground-subtle focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground-muted cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <SimpleSelect
          value={filterStatus}
          onChange={(v) => { setFilterStatus(v); setPage(1); }}
          options={PAYMENT_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          placeholder={t("director.payments.all_statuses")}
        />
        <SimpleSelect
          value={filterMethod}
          onChange={(v) => { setFilterMethod(v); setPage(1); }}
          options={PAYMENT_METHOD_OPTIONS}
          placeholder={t("director.payments.all_methods")}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-raised text-xs uppercase tracking-wider text-foreground-muted">
                <th className="py-3.5 px-4 font-semibold">{t("director.payments.table.student")}</th>
                <th className="py-3.5 px-4 font-semibold hidden md:table-cell">{t("director.payments.table.group")}</th>
                <th className="py-3.5 px-4 font-semibold hidden lg:table-cell">{t("director.payments.table.period")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("director.payments.table.amount")}</th>
                <th className="py-3.5 px-4 font-semibold hidden sm:table-cell">{t("director.payments.table.method")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("director.payments.table.status")}</th>
                <th className="py-3.5 px-4 font-semibold hidden xl:table-cell">{t("director.payments.table.due_date")}</th>
                <th className="py-3.5 px-4 text-right font-semibold">{t("director.payments.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle dark:divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 w-32 bg-border  rounded" /></td>
                    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 w-24 bg-border  rounded" /></td>
                    <td className="py-4 px-4 hidden lg:table-cell"><div className="h-4 w-20 bg-border  rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-28 bg-border  rounded" /></td>
                    <td className="py-4 px-4 hidden sm:table-cell"><div className="h-4 w-16 bg-border  rounded" /></td>
                    <td className="py-4 px-4"><div className="h-6 w-24 bg-border  rounded-full" /></td>
                    <td className="py-4 px-4 hidden xl:table-cell"><div className="h-4 w-20 bg-border  rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-16 bg-border  rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <AlertCircle className="mx-auto h-9 w-9 text-danger" />
                    <p className="mt-2 text-sm font-semibold text-danger">{t("common.error_failed")}</p>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <CreditCard className="mx-auto mb-3 h-10 w-10 text-foreground-muted" />
                    <p className="text-sm font-medium text-foreground-muted">{t("director.payments.empty.title")}</p>
                    <p className="mt-1 text-sm text-foreground-subtle">{t("director.payments.empty.desc")}</p>
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-raised dark:hover:bg-hover/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground">{p.student_name ?? "—"}</div>
                      {p.student_phone && <div className="text-xs text-foreground-subtle">{p.student_phone}</div>}
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-foreground-muted">{p.group_name ?? "—"}</td>
                    <td className="py-3.5 px-4 hidden lg:table-cell text-foreground-muted">{formatPeriod(p.period_month, p.period_year)}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground">{formatAmount(p.final_amount ?? p.amount)}</div>
                      {p.discount && Number(p.discount) > 0 && (
                        <div className="text-xs text-foreground-subtle">Chegirma: {formatAmount(p.discount)}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell text-foreground-muted">
                      {getMethodLabel(p.method, p.method_display)}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} display={p.status_display} />
                    </td>
                    <td className="py-3.5 px-4 hidden xl:table-cell text-foreground-muted">{formatDate(p.due_date)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditing(p)}
                          className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary-soft  transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(p)}
                          className="p-1.5 rounded-lg text-foreground-subtle hover:text-danger hover:bg-danger-bg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && payments.length > 0 && (
          <div className="flex items-center justify-between border-t border-border-subtle px-5 py-3 ">
            <span className="flex items-center gap-2 text-sm text-foreground-muted">
              {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data?.previous}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40   dark:hover:bg-hover"
              >
                <ChevronLeft className="h-4 w-4" /> {t("common.prev")}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={!data?.next}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40   dark:hover:bg-hover"
              >
                {t("common.next")} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {addOpen && <PaymentFormModal key="add" onClose={() => setAddOpen(false)} />}
        {editing && <PaymentFormModal key="edit" payment={editing} onClose={() => setEditing(null)} />}
        {deleting && <DeletePaymentModal key="delete" payment={deleting} onClose={() => setDeleting(null)} />}
      </AnimatePresence>
    </div>
  );
}
