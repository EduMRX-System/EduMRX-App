"use client";

import { useEffect, useRef, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { API } from "@/services/api";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import { useDebts, useDebtSummary, useCreateDebt, useUpdateDebt, useDeleteDebt } from "@/hooks/useDebts";
import { type IDebt, type DebtPayload, DEBT_STATUS_OPTIONS, getDebtStatusOption, isOverdue } from "@/types/debt";
import { formatAmount, formatDate } from "@/types/payment";

const PAGE_SIZE = 10;
const PIE_COLORS = ["#f59e0b", "#10b981", "#ef4444"];

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
      <div onClick={() => setOpen((v) => !v)} className="border border-slate-200 dark:border-slate-700 rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 min-w-[140px]">
        <span className={selected ? "" : "text-slate-400"}>{selected?.label ?? placeholder ?? "—"}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 min-w-full overflow-hidden">
          <div className="py-1">
            {placeholder && (
              <div onClick={() => { onChange(""); setOpen(false); }} className="px-3 py-2 text-sm cursor-pointer text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/60">{placeholder}</div>
            )}
            {options.map((opt) => (
              <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }} className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${value === opt.value ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-medium" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"}`}>
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
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);

  const { data, isLoading } = useQuery({
    queryKey: ["student-options-debt", search, activeCenter],
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
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { if (value && label) setSelected({ id: value, name: label }); }, [value, label]);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((v) => !v)} className="border border-slate-200 dark:border-slate-700 rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
        <span className={selected.id ? "" : "text-slate-400"}>{selected.id ? selected.name : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Qidirish..." className="w-full h-8 px-3 text-sm rounded-md bg-slate-50 dark:bg-slate-900/50 border border-transparent outline-none focus:border-indigo-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-400" />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {isLoading ? (
              <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin text-slate-400" /></div>
            ) : !data?.length ? (
              <div className="px-3 py-3 text-xs text-center text-slate-400">Topilmadi</div>
            ) : data.map((item) => (
              <div key={item.id} onClick={() => { setSelected(item); onChange(item.id, item.name); setOpen(false); setSearch(""); }} className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${selected.id === item.id ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-medium" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"}`}>
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

// ── Group Select ──────────────────────────────────────────────────
function GroupSelect({ value, label, onChange, placeholder }: {
  value: string; label: string;
  onChange: (id: string, name: string) => void; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({ id: value, name: label });
  const ref = useRef<HTMLDivElement>(null);
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);

  const { data, isLoading } = useQuery({
    queryKey: ["group-options-debt", search, activeCenter],
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
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { if (value && label) setSelected({ id: value, name: label }); }, [value, label]);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((v) => !v)} className="border border-slate-200 dark:border-slate-700 rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
        <span className={selected.id ? "" : "text-slate-400"}>{selected.id ? selected.name : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Guruh qidirish..." className="w-full h-8 px-3 text-sm rounded-md bg-slate-50 dark:bg-slate-900/50 border border-transparent outline-none focus:border-indigo-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-400" />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {isLoading ? (
              <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin text-slate-400" /></div>
            ) : !data?.length ? (
              <div className="px-3 py-3 text-xs text-center text-slate-400">Topilmadi</div>
            ) : data.map((item) => (
              <div key={item.id} onClick={() => { setSelected(item); onChange(item.id, item.name); setOpen(false); setSearch(""); }} className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${selected.id === item.id ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-medium" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"}`}>
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
  amount: string; amountDisplay: string;
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
    amountDisplay: d?.amount ? formatAmountInput(d.amount) : "",
    due_date: d?.due_date ?? next30.toISOString().slice(0, 10),
    status: d?.status ?? "unpaid",
  };
}

function DebtFormModal({ debt, onClose }: { debt?: IDebt | null; onClose: () => void }) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<DebtForm>(() => initDebtForm(debt));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!debt;

  useEffect(() => { setMounted(true); }, []);

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

  const labelCls = "text-[13px] text-slate-600 dark:text-slate-300 mb-1 block font-semibold";
  const fieldCls = (err?: boolean) =>
    `border rounded-lg w-full h-10 px-3 text-sm outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 ${err ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-indigo-400"}`;
  const errCls = "text-red-400 text-[11px] mt-0.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className={`fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity ${mounted ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95"}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {isEdit ? t("director.debts.form.title_edit") : t("director.debts.form.title_add")}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
            <div>
              <label className={labelCls}>{t("director.debts.form.amount_label")}</label>
              <input
                value={form.amountDisplay}
                onChange={(e) => { const raw = parseAmountRaw(e.target.value); setForm((f) => ({ ...f, amount: raw, amountDisplay: formatAmountInput(raw) })); }}
                placeholder={t("director.debts.form.amount_placeholder")}
                className={fieldCls(!!errors.amount)}
              />
              {errors.amount && <p className={errCls}>{errors.amount}</p>}
            </div>
            <div>
              <label className={labelCls}>{t("director.debts.form.due_date_label")}</label>
              <input type="date" value={form.due_date} onChange={(e) => set("due_date", e.target.value)} className={fieldCls(!!errors.due_date)} />
              {errors.due_date && <p className={errCls}>{errors.due_date}</p>}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={labelCls}>{t("director.debts.form.status_label")}</label>
            <SimpleSelect value={form.status} onChange={(v) => set("status", v)} options={DEBT_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="h-10 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-sm font-semibold rounded-lg cursor-pointer transition-colors">{t("common.cancel")}</button>
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
function DeleteDebtModal({ debt, onClose }: { debt: IDebt; onClose: () => void }) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const deleteMut = useDeleteDebt();
  useEffect(() => { setMounted(true); }, []);

  async function handleDelete() {
    try {
      await deleteMut.mutateAsync(debt.id);
      toast.success(t("director.debts.toast.deleted"));
      onClose();
    } catch { toast.error(t("director.debts.toast.delete_error")); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className={`fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity ${mounted ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-6 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mb-4 mx-auto"><Trash2 className="w-6 h-6 text-rose-600" /></div>
        <h3 className="text-center text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">{t("director.debts.delete.title")}</h3>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">{t("director.debts.delete.desc")}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-10 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">{t("common.cancel")}</button>
          <button onClick={handleDelete} disabled={deleteMut.isPending} className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer inline-flex items-center justify-center gap-2">
            {deleteMut.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("common.delete") || "O'chirish"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Summary Card ──────────────────────────────────────────────────
function SummaryCard({ icon, title, value, sub, loading, accent }: {
  icon: React.ReactNode; title: string; value: string;
  sub?: string; loading?: boolean; accent?: "amber" | "rose" | "emerald";
}) {
  const bg = accent === "rose" ? "bg-rose-50 dark:bg-rose-950/30" : accent === "emerald" ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-amber-50 dark:bg-amber-950/30";
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        {loading ? <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /> : <p className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{value}</p>}
        {sub && !loading && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</p>
      <p className="text-amber-600 font-bold">{formatAmount(payload[0].value)}</p>
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
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t("director.debts.title")}</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{t("director.debts.count", { count })}</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> {t("director.debts.add_btn")}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          icon={<AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          title={t("director.debts.summary.total")}
          value={formatAmount(summary?.total_amount)}
          sub={summary?.total_count ? `${summary.total_count} ta` : undefined}
          loading={summaryLoading}
          accent="amber"
        />
        <SummaryCard
          icon={<AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
          title={t("director.debts.summary.unpaid")}
          value={formatAmount(summary?.unpaid_amount)}
          sub={summary?.unpaid_count ? `${summary.unpaid_count} ta` : undefined}
          loading={summaryLoading}
          accent="rose"
        />
        <SummaryCard
          icon={<AlertCircle className="w-5 h-5 text-rose-700 dark:text-rose-500" />}
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
            <div className="xl:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">{t("director.debts.chart_title")}</h2>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100 dark:stroke-slate-800" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(245,158,11,0.05)" }} />
                    <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {pieData.length > 0 && (
            <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">Status bo'yicha</h2>
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("director.debts.search_placeholder")} className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
          {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-4 w-4" /></button>}
        </div>
        <SimpleSelect value={filterStatus} onChange={(v) => { setFilterStatus(v); setPage(1); }} options={DEBT_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} placeholder={t("director.debts.all_statuses")} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <th className="py-3.5 px-4 font-semibold">{t("director.debts.table.student")}</th>
                <th className="py-3.5 px-4 font-semibold hidden md:table-cell">{t("director.debts.table.group")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("director.debts.table.amount")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("director.debts.table.due_date")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("director.debts.table.status")}</th>
                <th className="py-3.5 px-4 text-right font-semibold">{t("director.debts.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <AlertCircle className="mx-auto h-9 w-9 text-rose-500" />
                    <p className="mt-2 text-sm font-semibold text-rose-600">{t("common.error_failed")}</p>
                  </td>
                </tr>
              ) : debts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{t("director.debts.empty.title")}</p>
                    <p className="mt-1 text-sm text-slate-400">{t("director.debts.empty.desc")}</p>
                  </td>
                </tr>
              ) : (
                debts.map((d) => {
                  const overdue = isOverdue(d.due_date) && d.status !== "paid";
                  return (
                    <tr key={d.id} className={`transition-colors ${overdue ? "bg-rose-50/30 dark:bg-rose-950/10 hover:bg-rose-50/50" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100">{d.student_name ?? "—"}</div>
                        {d.student_phone && <div className="text-xs text-slate-400">{d.student_phone}</div>}
                      </td>
                      <td className="py-3.5 px-4 hidden md:table-cell text-slate-600 dark:text-slate-400">{d.group_name ?? "—"}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">{formatAmount(d.amount)}</td>
                      <td className="py-3.5 px-4">
                        <div className={`flex items-center gap-1.5 ${overdue ? "text-rose-600 dark:text-rose-400 font-semibold" : "text-slate-600 dark:text-slate-400"}`}>
                          {overdue && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                          {formatDate(d.due_date)}
                        </div>
                        {overdue && <div className="text-[10px] text-rose-500 font-semibold mt-0.5">{t("director.debts.overdue_badge")}</div>}
                      </td>
                      <td className="py-3.5 px-4"><StatusBadge status={d.status} display={d.status_display} /></td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setEditing(d)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => setDeleting(d)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
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
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
            <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!data?.previous} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                <ChevronLeft className="h-4 w-4" /> {t("common.prev")}
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={!data?.next} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                {t("common.next")} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {addOpen && <DebtFormModal onClose={() => setAddOpen(false)} />}
      {editing && <DebtFormModal debt={editing} onClose={() => setEditing(null)} />}
      {deleting && <DeleteDebtModal debt={deleting} onClose={() => setDeleting(null)} />}
    </div>
  );
}
