"use client";

import { useEffect, useRef, useState } from "react";
import { X, Check, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { type AttendanceStatus, type ReasonValue, REASON_OPTIONS } from "@/types/attendance";

interface Props {
  initialStatus?: AttendanceStatus;
  initialReason?: string;
  studentName: string;
  lessonTopic: string;
  onSave: (status: AttendanceStatus, reason?: string) => void;
  onClose: () => void;
}

export default function ReasonPopover({
  initialStatus, initialReason, studentName, lessonTopic, onSave, onClose,
}: Props) {
  const [status, setStatus] = useState<AttendanceStatus>(initialStatus ?? null);
  const [reason, setReason] = useState<string>(initialReason ?? "");
  const [customText, setCustomText] = useState(
    initialReason && !REASON_OPTIONS.find((r) => r.value === initialReason) ? initialReason : ""
  );
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSave() {
    const finalReason = status === "absent" || status === "excused"
      ? (reason === "other" ? customText.trim() : reason) || undefined
      : undefined;
    onSave(status, finalReason);
    onClose();
  }

  const statusBtns: { value: AttendanceStatus; label: string; icon: React.ReactNode; cls: string; active: string }[] = [
    {
      value: "present",
      label: "Keldi",
      icon: <CheckCircle className="w-4 h-4" />,
      cls: "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600",
      active: "bg-emerald-500 border-emerald-500 text-white",
    },
    {
      value: "absent",
      label: "Kelmadi",
      icon: <AlertCircle className="w-4 h-4" />,
      cls: "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-400 hover:text-rose-600",
      active: "bg-rose-500 border-rose-500 text-white",
    },
    {
      value: "excused",
      label: "Sababli",
      icon: <Clock className="w-4 h-4" />,
      cls: "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400 hover:text-amber-600",
      active: "bg-amber-400 border-amber-400 text-white",
    },
  ];

  const showReason = status === "absent" || status === "excused";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`fixed inset-0 bg-slate-900/30 dark:bg-slate-950/50 backdrop-blur-[2px] transition-opacity ${mounted ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        ref={ref}
        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-sm relative z-10 transition-all duration-200 ${mounted ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">{studentName}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{lessonTopic}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Status toggle */}
          <div className="grid grid-cols-3 gap-2">
            {statusBtns.map((btn) => (
              <button
                key={btn.value}
                onClick={() => { setStatus(btn.value); if (btn.value === "present") setReason(""); }}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 text-[12px] font-semibold transition-all cursor-pointer ${status === btn.value ? btn.active : btn.cls}`}
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>

          {/* Reason (only for absent/excused) */}
          {showReason && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sabab</p>
              <div className="grid grid-cols-2 gap-1.5">
                {REASON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setReason(opt.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[12px] font-medium transition-all cursor-pointer text-left ${reason === opt.value ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300 hover:bg-indigo-50/50"}`}
                  >
                    {reason === opt.value && <Check className="w-3 h-3 shrink-0 text-indigo-600" />}
                    {opt.label}
                  </button>
                ))}
              </div>
              {reason === "other" && (
                <input
                  autoFocus
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Sababni kiriting..."
                  className="w-full h-9 px-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 placeholder:text-slate-400 transition-all"
                />
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 h-9 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              Bekor
            </button>
            <button
              onClick={handleSave}
              disabled={status === null}
              className="flex-1 h-9 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer"
            >
              Saqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
