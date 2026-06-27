"use client";

import { useEffect, useRef, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import {
  usePayments, usePaymentSummary, useCreatePayment, useUpdatePayment, useDeletePayment,
} from "@/hooks/usePayments";
import {
  type IPayment, type PaymentPayload, type PaymentPatchPayload,
  PAYMENT_METHOD_OPTIONS, PAYMENT_STATUS_OPTIONS, MONTHS_UZ,
  formatAmount, formatDate, formatPeriod, getPaymentStatusOption, getMethodLabel,
} from "@/types/payment";
import AsyncBranchSelect from "@/components/common/AsyncBranchSelect";

const PAGE_SIZE = 10;

// ── Helpers ───────────────────────────────────────────────────────
function formatAmountInput(raw: string): string {
  const n = raw.replace(/[^0-9]/g, "");
  if (!n) return "";
  return Number(n).toLocaleString("uz-UZ");
}

function parseAmountRaw(formatted: string): string {
  return formatted.replace(/[^0-9]/g, "");
}

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
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);

  const { data, isLoading } = useQuery({
    queryKey: ["student-options", search, activeCenter],
    queryFn: async () => {
      const res = await API.get("director/students/", {
        params: { search: search || undefined, center_id: activeCenter || undefined, page_size: 20 },
      });
      const d: any = res.data;
      const list = Array.isArray(d) ? d : d?.results ?? [];
      return list.map((s: any) => ({
        id: String(s.id),
        name: s.user?.full_name ?? s.full_name ?? `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim() ?? String(s.id),
        phone: s.user?.phone ?? s.phone ?? "",
      }));
    },
    enabled: open,
    staleTime: 30000,
  });

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
        className="border border-slate-200 dark:border-slate-700 rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
      >
        <span className={selected.id ? "" : "text-slate-400"}>{selected.id ? selected.name : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qidirish..."
              className="w-full h-8 px-3 text-sm rounded-md bg-slate-50 dark:bg-slate-900/50 border border-transparent outline-none focus:border-indigo-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {isLoading ? (
              <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin text-slate-400" /></div>
            ) : !data?.length ? (
              <div className="px-3 py-3 text-xs text-center text-slate-400">Topilmadi</div>
            ) : data.map((item) => (
              <div
                key={item.id}
                onClick={() => { setSelected(item); onChange(item.id, item.name); setOpen(false); setSearch(""); }}
                className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${selected.id === item.id ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-medium" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"}`}
              >
                <div>
                  <div className="font-medium">{item.name}</div>
                  {item.phone && <div className="text-xs text-slate-400">{item.phone}</div>}
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
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);

  const { data, isLoading } = useQuery({
    queryKey: ["group-options-pay", search, activeCenter],
    queryFn: async () => {
      const res = await API.get("director/groups/", {
        params: { search: search || undefined, center_id: activeCenter || undefined, page_size: 30 },
      });
      const d: any = res.data;
      const list = Array.isArray(d) ? d : d?.results ?? [];
      return list.map((g: any) => ({ id: String(g.id), name: g.name ?? String(g.id) }));
    },
    enabled: open,
    staleTime: 30000,
  });

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
        className="border border-slate-200 dark:border-slate-700 rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
      >
        <span className={selected.id ? "" : "text-slate-400"}>{selected.id ? selected.name : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Guruh qidirish..."
              className="w-full h-8 px-3 text-sm rounded-md bg-slate-50 dark:bg-slate-900/50 border border-transparent outline-none focus:border-indigo-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {isLoading ? (
              <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin text-slate-400" /></div>
            ) : !data?.length ? (
              <div className="px-3 py-3 text-xs text-center text-slate-400">Topilmadi</div>
            ) : data.map((item) => (
              <div
                key={item.id}
                onClick={() => { setSelected(item); onChange(item.id, item.name); setOpen(false); setSearch(""); }}
                className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${selected.id === item.id ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-medium" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"}`}
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
        className="border border-slate-200 dark:border-slate-700 rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 min-w-[140px]"
      >
        <span className={selected ? "" : "text-slate-400"}>{selected?.label ?? placeholder ?? "—"}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 min-w-full overflow-hidden">
          <div className="py-1">
            {placeholder && (
              <div
                onClick={() => { onChange(""); setOpen(false); }}
                className="px-3 py-2 text-sm cursor-pointer text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/60"
              >
                {placeholder}
              </div>
            )}
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${value === opt.value ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-medium" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"}`}
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
  amount: string; amountDisplay: string;
  discount: string; discountDisplay: string;
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
    amountDisplay: p?.amount ? formatAmountInput(p.amount) : "",
    discount: p?.discount ?? "",
    discountDisplay: p?.discount ? formatAmountInput(p.discount) : "",
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
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<FormState>(() => initForm(payment));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!payment;
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);

  useEffect(() => { setMounted(true); }, []);

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

  const labelCls = "text-[13px] text-slate-600 dark:text-slate-300 mb-1 block font-semibold";
  const fieldCls = (err?: boolean) =>
    `border rounded-lg w-full h-10 px-3 text-sm outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 ${err ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-indigo-400"}`;
  const errCls = "text-red-400 text-[11px] mt-0.5";

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity ${mounted ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div className={`bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95"}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {isEdit ? t("director.payments.form.title_edit") : t("director.payments.form.title_add")}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
            <div>
              <label className={labelCls}>{t("director.payments.form.amount_label")}</label>
              <input
                value={form.amountDisplay}
                onChange={(e) => {
                  const raw = parseAmountRaw(e.target.value);
                  setForm((f) => ({ ...f, amount: raw, amountDisplay: formatAmountInput(raw) }));
                }}
                placeholder={t("director.payments.form.amount_placeholder")}
                className={fieldCls(!!errors.amount)}
              />
              {errors.amount && <p className={errCls}>{errors.amount}</p>}
            </div>
            <div>
              <label className={labelCls}>{t("director.payments.form.discount_label")}</label>
              <input
                value={form.discountDisplay}
                onChange={(e) => {
                  const raw = parseAmountRaw(e.target.value);
                  setForm((f) => ({ ...f, discount: raw, discountDisplay: formatAmountInput(raw) }));
                }}
                placeholder="0"
                className={fieldCls()}
              />
            </div>
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

          {/* Period */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>{t("director.payments.form.period_month_label")}</label>
              <select
                value={form.period_month}
                onChange={(e) => set("period_month", Number(e.target.value))}
                className={fieldCls()}
              >
                {MONTHS_UZ.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t("director.payments.form.period_year_label")}</label>
              <select
                value={form.period_year}
                onChange={(e) => set("period_year", Number(e.target.value))}
                className={fieldCls()}
              >
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>{t("director.payments.form.due_date_label")}</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => set("due_date", e.target.value)}
                className={fieldCls()}
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="h-10 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-sm font-semibold rounded-lg cursor-pointer transition-colors">
              {t("common.cancel")}
            </button>
            <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? t("common.save") : t("common.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────
function DeletePaymentModal({ payment, onClose }: { payment: IPayment; onClose: () => void }) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const deleteMut = useDeletePayment();

  useEffect(() => { setMounted(true); }, []);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className={`fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity ${mounted ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-6 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mb-4 mx-auto">
          <Trash2 className="w-6 h-6 text-rose-600 dark:text-rose-400" />
        </div>
        <h3 className="text-center text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">{t("director.payments.delete.title")}</h3>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">{t("director.payments.delete.desc")}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-10 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
            {t("common.cancel")}
          </button>
          <button onClick={handleDelete} disabled={deleteMut.isPending} className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors inline-flex items-center justify-center gap-2">
            {deleteMut.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("common.delete") || "O'chirish"}
          </button>
        </div>
      </div>
    </div>
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
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        {loading ? (
          <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        ) : (
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{value}</p>
        )}
        {sub && !loading && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        {change !== undefined && !loading && (
          <div className={`inline-flex items-center gap-1 text-xs font-semibold mt-1 ${change >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</p>
      <p className="text-indigo-600 font-bold">{formatAmount(payload[0].value)}</p>
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
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t("director.payments.title")}</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{t("director.payments.count", { count })}</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> {t("director.payments.add_btn")}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          title={t("director.payments.summary.total")}
          value={formatAmount(summary?.total_amount)}
          change={summary?.total_change}
          loading={summaryLoading}
        />
        <SummaryCard
          icon={<CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          title={t("director.payments.summary.monthly")}
          value={formatAmount(summary?.monthly_amount)}
          change={summary?.monthly_change}
          loading={summaryLoading}
        />
        <SummaryCard
          icon={<Receipt className="w-5 h-5 text-amber-500" />}
          title={t("director.payments.summary.pending")}
          value={formatAmount(summary?.pending_amount)}
          loading={summaryLoading}
        />
        <SummaryCard
          icon={<TrendingUp className="w-5 h-5 text-violet-600 dark:text-violet-400" />}
          title={t("director.payments.summary.count")}
          value={summaryLoading ? "—" : String(summary?.total_count ?? count)}
          sub={summary?.monthly_count ? `Bu oy: ${summary.monthly_count}` : undefined}
          loading={summaryLoading}
        />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">{t("director.payments.chart_title")}</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100 dark:stroke-slate-800" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#payGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("director.payments.search_placeholder")}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
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
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
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
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-4 hidden lg:table-cell"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-4 hidden sm:table-cell"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                    <td className="py-4 px-4 hidden xl:table-cell"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <AlertCircle className="mx-auto h-9 w-9 text-rose-500" />
                    <p className="mt-2 text-sm font-semibold text-rose-600">{t("common.error_failed")}</p>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <CreditCard className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{t("director.payments.empty.title")}</p>
                    <p className="mt-1 text-sm text-slate-400">{t("director.payments.empty.desc")}</p>
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 dark:text-slate-100">{p.student_name ?? "—"}</div>
                      {p.student_phone && <div className="text-xs text-slate-400">{p.student_phone}</div>}
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-slate-600 dark:text-slate-400">{p.group_name ?? "—"}</td>
                    <td className="py-3.5 px-4 hidden lg:table-cell text-slate-600 dark:text-slate-400">{formatPeriod(p.period_month, p.period_year)}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{formatAmount(p.final_amount ?? p.amount)}</div>
                      {p.discount && Number(p.discount) > 0 && (
                        <div className="text-xs text-slate-400">Chegirma: {formatAmount(p.discount)}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell text-slate-600 dark:text-slate-400">
                      {getMethodLabel(p.method, p.method_display)}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} display={p.status_display} />
                    </td>
                    <td className="py-3.5 px-4 hidden xl:table-cell text-slate-600 dark:text-slate-400">{formatDate(p.due_date)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditing(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
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
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
            <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data?.previous}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" /> {t("common.prev")}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={!data?.next}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t("common.next")} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {addOpen && <PaymentFormModal onClose={() => setAddOpen(false)} />}
      {editing && <PaymentFormModal payment={editing} onClose={() => setEditing(null)} />}
      {deleting && <DeletePaymentModal payment={deleting} onClose={() => setDeleting(null)} />}
    </div>
  );
}
