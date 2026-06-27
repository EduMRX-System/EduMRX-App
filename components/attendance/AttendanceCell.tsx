"use client";

import { Check, X } from "lucide-react";
import type { AttendanceStatus, ViewMode, AttendanceMark } from "@/types/attendance";

interface Props {
  mark: AttendanceMark | undefined;
  mode: ViewMode;
  onClick: () => void;
  /** true = kelajak dars yoki dars mavjud emas → bosilmaydi */
  disabled?: boolean;
}

const CIRCLE = "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 select-none";

export default function AttendanceCell({ mark, mode, onClick, disabled }: Props) {
  // ── Disabled (future / no-lesson) ────────────────────────────────
  if (disabled) {
    return (
      <div
        className={`${CIRCLE} bg-slate-100/70 dark:bg-slate-800/25 cursor-not-allowed`}
        aria-hidden
      />
    );
  }

  // ── Homework mode ─────────────────────────────────────────────────
  if (mode === "homework") {
    const pct = mark?.homework_percent;

    if (pct == null) {
      return (
        <button
          onClick={onClick}
          title="Belgilanmagan — bosing"
          className={`${CIRCLE} border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 cursor-pointer hover:scale-110 active:scale-95`}
        />
      );
    }

    const color =
      pct >= 90 ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-600/25 text-emerald-700 dark:text-emerald-400"
      : pct >= 80 ? "bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 text-amber-700 dark:text-amber-400"
      : "bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/25 text-rose-600 dark:text-rose-400";

    return (
      <button
        onClick={onClick}
        title={`${pct}%`}
        className={`${CIRCLE} ${color} text-[11px] font-bold cursor-pointer hover:scale-110 active:scale-95`}
      >
        {pct}
      </button>
    );
  }

  // ── Attendance mode ───────────────────────────────────────────────
  const status: AttendanceStatus = mark?.status ?? null;

  if (status === null) {
    return (
      <button
        onClick={onClick}
        title="Belgilanmagan — bosing"
        className={`${CIRCLE} border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 cursor-pointer hover:scale-110 active:scale-95`}
      />
    );
  }

  if (status === "present") {
    return (
      <button
        onClick={onClick}
        title="Keldi"
        className={`${CIRCLE} bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-600/30 cursor-pointer hover:scale-110 active:scale-95`}
      >
        <Check className="w-[15px] h-[15px] text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
      </button>
    );
  }

  if (status === "absent") {
    return (
      <button
        onClick={onClick}
        title="Kelmadi"
        className={`${CIRCLE} bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 cursor-pointer hover:scale-110 active:scale-95`}
      >
        <X className="w-[15px] h-[15px] text-rose-500 dark:text-rose-400" strokeWidth={2.5} />
      </button>
    );
  }

  // excused
  return (
    <button
      onClick={onClick}
      title="Sababli"
      className={`${CIRCLE} bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 cursor-pointer hover:scale-110 active:scale-95`}
    >
      <X className="w-[15px] h-[15px] text-amber-500 dark:text-amber-400" strokeWidth={2.5} />
    </button>
  );
}
