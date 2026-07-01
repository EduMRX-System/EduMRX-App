"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Plus, Search, X, ChevronLeft, ChevronRight, Loader2, AlertCircle,
  Check, ChevronDown, Trash2, Edit2, AlertTriangle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { useDebts, useDebtSummary, useCreateDebt, useUpdateDebt, useDeleteDebt } from "@/hooks/useDebts";
import { useStudentSearchOptions } from "@/hooks/useStudents";
import { useGroupSearchOptions } from "@/hooks/useGroups";
import { type IDebt, type DebtPayload, DEBT_STATUS_OPTIONS, getDebtStatusOption, isOverdue } from "@/types/debt";
import { formatAmount, formatDate } from "@/types/payment";
import DatePicker from "@/components/ui/DatePicker";
import MoneyInput from "@/components/ui/MoneyInput";
import FormModalShell from "@/components/common/FormModalShell";
import { getFormDraft, useFormDraftSave, clearFormDraft } from "@/hooks/useFormDraft";

const PAGE_SIZE = 10;
const PIE_COLORS = ["#f59e0b", "#10b981", "#ef4444"];

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
  const opt = getDebtStatusOption(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${opt.bg} ${opt.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${opt.dot}`} />
      {display ?? opt.label}
    </span>
  );
}

// ── Student Select ────────────────────────────────────────────────
function StudentSelect({ value, label, onChange, placeholder }: {
  value: string; label: string;
  onChange: (id: string, name: string) => void; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({ id: value, name: label });
  const ref = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useStudentSearchOptions(search, open);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { if (value && label) setSelected({ id: value, name: label }); }, [value, label]);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((v) => !v)} className="border border-border rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer bg-surface text-foreground">
        <span className={selected.id ? "" : "text-foreground-subtle"}>{selected.id ? selected.name : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-foreground-subtle transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-border-subtle">
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Qidirish..." className="w-full h-8 px-3 text-sm rounded-md bg-surface-raised /50 border border-transparent outline-none focus:border-primary text-foreground placeholder:text-foreground-subtle" />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {isLoading ? (
              <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin text-foreground-subtle" /></div>
            ) : !data?.length ? (
              <div className="px-3 py-3 text-xs text-center text-foreground-subtle">Topilmadi</div>
            ) : data.map((item) => (
              <div key={item.id} onClick={() => { setSelected(item); onChange(item.id, item.name); setOpen(false); setSearch(""); }} className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${selected.id === item.id ? "bg-primary-soft  text-primary font-medium" : "text-foreground hover:bg-surface-raised "}`}>
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

// ── Group Select ──────────────────────────────────────────────────
function GroupSelect({ value, label, onChange, placeholder }: {
  value: string; label: string;
  onChange: (id: string, name: string) => void; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({ id: value, name: label });
  const ref = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGroupSearchOptions(search, open);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { if (value && label) setSelected({ id: value, name: label }); }, [value, label]);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((v) => !v)} className="border border-border rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer bg-surface text-foreground">
        <span className={selected.id ? "" : "text-foreground-subtle"}>{selected.id ? selected.name : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-foreground-subtle transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-border-subtle">
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Guruh qidirish..." className="w-full h-8 px-3 text-sm rounded-md bg-surface-raised /50 border border-transparent outline-none focus:border-primary text-foreground placeholder:text-foreground-subtle" />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {isLoading ? (
              <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin text-foreground-subtle" /></div>
            ) : !data?.length ? (
              <div className="px-3 py-3 text-xs text-center text-foreground-subtle">Topilmadi</div>
            ) : data.map((item) => (
              <div key={item.id} onClick={() => { setSelected(item); onChange(item.id, item.name); setOpen(false); setSearch(""); }} className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${selected.id === item.id ? "bg-primary-soft  text-primary font-medium" : "text-foreground hover:bg-surface-raised "}`}>
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

// ── Debt Form Modal ───────────────────────────────────────────────
interface DebtForm {
  student: string; studentName: string;
  group: string; groupName: string;
  amount: string;
  due_date: string; status: string;
}

function initDebtForm(d?: IDebt | null): DebtForm {
  const next30 = new Date(); next30.setDate(next30.getDate() + 30);
  return {
    student: d?.student ?? "",
    studentName: d?.student_name ?? "",
    group: d?.group ?? "",
    groupName: d?.group_name ?? "",
    amount: d?.amount ?? "",
    due_date: d?.due_date ?? next30.toISOString().slice(0, 10),
    status: d?.status ?? "unpaid",
  };
}

function DebtFormModal({ debt, onClose }: { debt?: IDebt | null; onClose: () => void }) {
  const { t } = useTranslation();
  const isEdit = !!debt;
  const draftKey = isEdit ? `edit-debt-${debt!.id}-draft` : "debt-form-draft";
  const draft = getFormDraft<DebtForm>(draftKey);
  const [form, setForm] = useState<DebtForm>(() => ({ ...initDebtForm(debt), ...draft }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useFormDraftSave(draftKey, form);

  const createMut = useCreateDebt();
  const updateMut = useUpdateDebt();
  const isPending = createMut.isPending || updateMut.isPending;

  const set = (k: keyof DebtForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function validate() {
    const e: Record<string, string> = {};
    if (!form.student) e.student = "O'quvchini tanlang";
    if (!form.group) e.group = "Guruhni tanlang";
    if (!form.amount || form.amount === "0") e.amount = "Summani kiriting";
    if (!form.due_date) e.due_date = "Muddatni kiriting";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    const payload: DebtPayload = {
      student: form.student,
      group: form.group,
      amount: form.amount,
      due_date: form.due_date,
      status: form.status as DebtPayload["status"],
    };
    try {
      if (isEdit && debt) {
        await updateMut.mutateAsync({ id: debt.id, ...payload });
        toast.success(t("director.debts.toast.updated"));
      } else {
        await createMut.mutateAsync(payload);
        toast.success(t("director.debts.toast.created"));
      }
      clearFormDraft(draftKey);
      onClose();
    } catch (err: any) {
      const d = err?.response?.data;
      if (d && typeof d === "object") {
        const key = Object.keys(d)[0];
        if (key) { const msg = Array.isArray(d[key]) ? d[key][0] : d[key]; return toast.error(`${key}: ${msg}`); }
      }
      toast.error(t("director.debts.toast.error_generic"));
    }
  }

  const labelCls = "text-[13px] text-foreground-muted mb-1 block font-semibold";
  const fieldCls = (err?: boolean) =>
    `border rounded-lg w-full h-10 px-3 text-sm outline-none transition-all bg-surface text-foreground focus:ring-2 focus:ring-primary-ring/50 ${err ? "border-danger/50" : "border-border focus:border-primary"}`;
  const errCls = "text-red-400 text-[11px] mt-0.5";

  return (
    <FormModalShell onClose={onClose} maxWidth="max-w-lg">
        <div className="sticky top-0 z-50 h-0 w-full flex justify-end items-start pointer-events-none">
          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto -mt-2 -mr-2 text-foreground-subtle hover:text-foreground p-1.5 rounded-lg bg-surface/90 backdrop-blur-sm border border-border shadow-md cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-[10px] border border-border shadow-sm w-[44px] h-[44px] rounded-lg flex justify-center items-center text-warning bg-warning-bg">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-foreground text-[18px] font-semibold mb-4">
          {isEdit ? t("director.debts.form.title_edit") : t("director.debts.form.title_add")}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student + Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t("director.debts.form.student_label")}</label>
              <StudentSelect value={form.student} label={form.studentName} placeholder={t("director.debts.form.student_placeholder")} onChange={(id, name) => { set("student", id); set("studentName", name); }} />
              {errors.student && <p className={errCls}>{errors.student}</p>}
            </div>
            <div>
              <label className={labelCls}>{t("director.debts.form.group_label")}</label>
              <GroupSelect value={form.group} label={form.groupName} placeholder={t("director.debts.form.group_placeholder")} onChange={(id, name) => { set("group", id); set("groupName", name); }} />
              {errors.group && <p className={errCls}>{errors.group}</p>}
            </div>
          </div>

          {/* Amount + Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MoneyInput
              label={t("director.debts.form.amount_label")}
              value={form.amount}
              onChange={(raw) => set("amount", raw)}
              placeholder={t("director.debts.form.amount_placeholder")}
              error={errors.amount}
              required
            />
            <DatePicker
              label={t("director.debts.form.due_date_label")}
              value={form.due_date}
              onChange={(v) => set("due_date", v)}
              error={errors.due_date}
            />
          </div>

          {/* Status */}
          <div>
            <label className={labelCls}>{t("director.debts.form.status_label")}</label>
            <SimpleSelect value={form.status} onChange={(v) => set("status", v)} options={DEBT_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <button type="button" onClick={onClose} className="h-10 px-4 border border-border bg-surface text-foreground hover:bg-surface-raised text-sm font-semibold rounded-lg cursor-pointer transition-colors">{t("common.cancel")}</button>
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
function DeleteDebtModal({ debt, onClose }: { debt: IDebt; onClose: () => void }) {
  const { t } = useTranslation();
  const deleteMut = useDeleteDebt();

  async function handleDelete() {
    try {
      await deleteMut.mutateAsync(debt.id);
      toast.success(t("director.debts.toast.deleted"));
      onClose();
    } catch { toast.error(t("director.debts.toast.delete_error")); }
  }

  return (
    <FormModalShell onClose={onClose} variant="center" maxWidth="max-w-sm">
        <div className="w-12 h-12 rounded-full bg-danger-bg flex items-center justify-center mb-4 mx-auto"><Trash2 className="w-6 h-6 text-danger" /></div>
        <h3 className="text-center text-base font-semibold text-foreground mb-2">{t("director.debts.delete.title")}</h3>
        <p className="text-center text-sm text-foreground-muted mb-6">{t("director.debts.delete.desc")}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-10 border border-border text-foreground text-sm font-semibold rounded-lg hover:bg-surface-raised dark:hover:bg-hover cursor-pointer">{t("common.cancel")}</button>
          <button onClick={handleDelete} disabled={deleteMut.isPending} className="flex-1 h-10 bg-danger hover:bg-danger/90 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer inline-flex items-center justify-center gap-2">
            {deleteMut.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("common.delete") || "O'chirish"}
          </button>
        </div>
    </FormModalShell>
  );
}

// ── Summary Card ──────────────────────────────────────────────────
function SummaryCard({ icon, title, value, sub, loading, accent }: {
  icon: React.ReactNode; title: string; value: string;
  sub?: string; loading?: boolean; accent?: "amber" | "rose" | "emerald";
}) {
  const bg = accent === "rose" ? "bg-danger-bg" : accent === "emerald" ? "bg-success-bg" : "bg-warning-bg";
  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-foreground-muted mb-1">{title}</p>
        {loading ? <div className="h-6 w-28 bg-border  rounded animate-pulse" /> : <p className="text-lg font-bold text-foreground truncate">{value}</p>}
        {sub && !loading && <p className="text-xs text-foreground-subtle mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-xl shadow-xl p-3 text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-warning font-bold">{formatAmount(payload[0].value)}</p>
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────
export default function DebtsView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<IDebt | null>(null);
  const [deleting, setDeleting] = useState<IDebt | null>(null);

  useEffect(() => {
    const h = setTimeout(() => { setDebounced(search.trim()); setPage(1); }, 500);
    return () => clearTimeout(h);
  }, [search]);

  const { data, isLoading, isError, isFetching } = useDebts({
    page, pageSize: PAGE_SIZE, search: debounced, status: filterStatus,
  });
  const { data: summary, isLoading: summaryLoading } = useDebtSummary();

  const debts = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const monthlyData = summary?.monthly_data ?? [];
  const byStatus = summary?.by_status ?? [];
  const pieData = byStatus.length > 0
    ? byStatus.map((s) => ({ name: DEBT_STATUS_OPTIONS.find((o) => o.value === s.status)?.label ?? s.status, value: s.count }))
    : [];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t("director.debts.title")}</h1>
          <p className="mt-0.5 text-sm text-foreground-muted">{t("director.debts.count", { count })}</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" /> {t("director.debts.add_btn")}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          icon={<AlertTriangle className="w-5 h-5 text-warning" />}
          title={t("director.debts.summary.total")}
          value={formatAmount(summary?.total_amount)}
          sub={summary?.total_count ? `${summary.total_count} ta` : undefined}
          loading={summaryLoading}
          accent="amber"
        />
        <SummaryCard
          icon={<AlertCircle className="w-5 h-5 text-danger" />}
          title={t("director.debts.summary.unpaid")}
          value={formatAmount(summary?.unpaid_amount)}
          sub={summary?.unpaid_count ? `${summary.unpaid_count} ta` : undefined}
          loading={summaryLoading}
          accent="rose"
        />
        <SummaryCard
          icon={<AlertCircle className="w-5 h-5 text-danger" />}
          title={t("director.debts.summary.overdue")}
          value={formatAmount(summary?.overdue_amount)}
          sub={summary?.overdue_count ? `${summary.overdue_count} ta` : undefined}
          loading={summaryLoading}
          accent="rose"
        />
      </div>

      {/* Charts */}
      {(monthlyData.length > 0 || pieData.length > 0) && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {monthlyData.length > 0 && (
            <div className="xl:col-span-3 bg-surface border border-border-subtle rounded-2xl p-6">
              <h2 className="text-base font-semibold text-foreground mb-4">{t("director.debts.chart_title")}</h2>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border-subtle dark:stroke-border" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#78716c", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#78716c", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(245,158,11,0.05)" }} />
                    <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {pieData.length > 0 && (
            <div className="xl:col-span-2 bg-surface border border-border-subtle rounded-2xl p-6">
              <h2 className="text-base font-semibold text-foreground mb-4">Status bo'yicha</h2>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" nameKey="name" paddingAngle={3}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" iconSize={8} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("director.debts.search_placeholder")} className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-8 text-sm text-foreground outline-none transition placeholder:text-foreground-subtle focus:border-primary focus:ring-2 focus:ring-primary/20" />
          {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground-muted cursor-pointer"><X className="h-4 w-4" /></button>}
        </div>
        <SimpleSelect value={filterStatus} onChange={(v) => { setFilterStatus(v); setPage(1); }} options={DEBT_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} placeholder={t("director.debts.all_statuses")} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-raised text-xs uppercase tracking-wider text-foreground-muted">
                <th className="py-3.5 px-4 font-semibold">{t("director.debts.table.student")}</th>
                <th className="py-3.5 px-4 font-semibold hidden md:table-cell">{t("director.debts.table.group")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("director.debts.table.amount")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("director.debts.table.due_date")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("director.debts.table.status")}</th>
                <th className="py-3.5 px-4 text-right font-semibold">{t("director.debts.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle dark:divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 w-32 bg-border  rounded" /></td>
                    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 w-24 bg-border  rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-28 bg-border  rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-20 bg-border  rounded" /></td>
                    <td className="py-4 px-4"><div className="h-6 w-24 bg-border  rounded-full" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-12 bg-border  rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <AlertCircle className="mx-auto h-9 w-9 text-danger" />
                    <p className="mt-2 text-sm font-semibold text-danger">{t("common.error_failed")}</p>
                  </td>
                </tr>
              ) : debts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-foreground-muted" />
                    <p className="text-sm font-medium text-foreground-muted">{t("director.debts.empty.title")}</p>
                    <p className="mt-1 text-sm text-foreground-subtle">{t("director.debts.empty.desc")}</p>
                  </td>
                </tr>
              ) : (
                debts.map((d) => {
                  const overdue = isOverdue(d.due_date) && d.status !== "paid";
                  return (
                    <tr key={d.id} className={`transition-colors ${overdue ? "bg-danger-bg/20 hover:bg-danger-bg/30" : "hover:bg-surface-raised dark:hover:bg-hover/40"}`}>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-foreground">{d.student_name ?? "—"}</div>
                        {d.student_phone && <div className="text-xs text-foreground-subtle">{d.student_phone}</div>}
                      </td>
                      <td className="py-3.5 px-4 hidden md:table-cell text-foreground-muted">{d.group_name ?? "—"}</td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">{formatAmount(d.amount)}</td>
                      <td className="py-3.5 px-4">
                        <div className={`flex items-center gap-1.5 ${overdue ? "text-danger font-semibold" : "text-foreground-muted"}`}>
                          {overdue && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                          {formatDate(d.due_date)}
                        </div>
                        {overdue && <div className="text-[10px] text-danger font-semibold mt-0.5">{t("director.debts.overdue_badge")}</div>}
                      </td>
                      <td className="py-3.5 px-4"><StatusBadge status={d.status} display={d.status_display} /></td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setEditing(d)} className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary-soft  transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => setDeleting(d)} className="p-1.5 rounded-lg text-foreground-subtle hover:text-danger hover:bg-danger-bg transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && debts.length > 0 && (
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
      <AnimatePresence>
        {addOpen && <DebtFormModal key="add" onClose={() => setAddOpen(false)} />}
        {editing && <DebtFormModal key="edit" debt={editing} onClose={() => setEditing(null)} />}
        {deleting && <DeleteDebtModal key="delete" debt={deleting} onClose={() => setDeleting(null)} />}
      </AnimatePresence>
    </div>
  );
}
