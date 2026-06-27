"use client";

import { useEffect, useRef, useState } from "react";
import {
  Building2, ChevronDown, Check, BarChart3,
} from "lucide-react";
import { type Period, PERIOD_OPTIONS } from "@/types/branchAnalytics";
import { FAKE_BRANCHES, useBranchAnalytics } from "@/hooks/useBranchAnalytics";

import BranchKpiCards      from "./BranchKpiCards";
import FinanceChart         from "./FinanceChart";
import StudentGrowthChart   from "./StudentGrowthChart";
import PaymentStatusChart   from "./PaymentStatusChart";
import GroupsFillChart      from "./GroupsFillChart";
import TopTeachersTable     from "./TopTeachersTable";
import RecentPaymentsList   from "./RecentPaymentsList";

// ── Branch Dropdown ───────────────────────────────────────────────
function BranchDropdown({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = FAKE_BRANCHES.find((b) => b.id === value);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-10 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-indigo-400 transition-colors shadow-sm cursor-pointer min-w-[200px]"
      >
        <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
        <span className="flex-1 text-left truncate">{selected?.name ?? "Filial tanlang..."}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-40 min-w-[220px] overflow-hidden py-1">
          {FAKE_BRANCHES.map((b) => (
            <button
              key={b.id}
              onClick={() => { onChange(b.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/60 ${b.id === value ? "text-indigo-600 dark:text-indigo-400 font-semibold" : "text-slate-700 dark:text-slate-300"}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${b.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
              <span className="flex-1 truncate">{b.name}</span>
              {b.id === value && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Period Dropdown ───────────────────────────────────────────────
function PeriodDropdown({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = PERIOD_OPTIONS.find((p) => p.value === value);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-10 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-indigo-400 transition-colors shadow-sm cursor-pointer"
      >
        <span className="text-slate-700 dark:text-slate-300">{selected?.label}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-40 min-w-[160px] overflow-hidden py-1">
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p.value}
              onClick={() => { onChange(p.value); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/60 ${p.value === value ? "text-indigo-600 dark:text-indigo-400 font-semibold" : "text-slate-700 dark:text-slate-300"}`}
            >
              {p.label}
              {p.value === value && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────
function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h2>
  );
}

// ── Main View ─────────────────────────────────────────────────────
export default function BranchAnalyticsView() {
  const [branchId, setBranchId] = useState(FAKE_BRANCHES[0].id);
  const [period, setPeriod]     = useState<Period>("this_month");

  const data    = useBranchAnalytics(branchId, period);
  const branch  = FAKE_BRANCHES.find((b) => b.id === branchId);

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Filial analitikasi</h1>
            {branch && <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{branch.name}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <BranchDropdown value={branchId} onChange={setBranchId} />
          <PeriodDropdown value={period} onChange={setPeriod} />
        </div>
      </div>

      {/* KPI Cards */}
      <div>
        <SectionTitle title="Asosiy ko'rsatkichlar" />
        <div className="mt-3">
          <BranchKpiCards kpi={data.kpi} />
        </div>
      </div>

      {/* Charts row 1: Finance + Growth */}
      <div>
        <SectionTitle title="Moliyaviy tahlil" />
        <div className="mt-3 grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3"><FinanceChart data={data.finance} /></div>
          <div className="xl:col-span-2"><StudentGrowthChart data={data.student_growth} /></div>
        </div>
      </div>

      {/* Charts row 2: Payment status + Groups fill */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2"><PaymentStatusChart data={data.payment_status} /></div>
        <div className="xl:col-span-3"><GroupsFillChart groups={data.groups} /></div>
      </div>

      {/* Tables row: Teachers + Recent payments */}
      <div>
        <SectionTitle title="Batafsil ma'lumot" />
        <div className="mt-3 grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3"><TopTeachersTable teachers={data.teachers} /></div>
          <div className="xl:col-span-2"><RecentPaymentsList payments={data.recent_payments} /></div>
        </div>
      </div>
    </div>
  );
}
