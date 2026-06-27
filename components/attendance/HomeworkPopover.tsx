"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { getHomeworkBg } from "@/types/attendance";

interface Props {
  initialPercent?: number | null;
  studentName: string;
  lessonTopic: string;
  onSave: (percent: number | null) => void;
  onClose: () => void;
}

export default function HomeworkPopover({
  initialPercent, studentName, lessonTopic, onSave, onClose,
}: Props) {
  const [value, setValue] = useState<string>(
    initialPercent != null ? String(initialPercent) : ""
  );
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => inputRef.current?.select(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") handleSave();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function handleSave() {
    const num = parseInt(value, 10);
    if (value.trim() === "" || value.trim() === "—") {
      onSave(null);
    } else if (!isNaN(num) && num >= 0 && num <= 100) {
      onSave(num);
    } else {
      onSave(null);
    }
    onClose();
  }

  const presets = [100, 90, 80, 70, 50, 0];
  const num = parseInt(value, 10);
  const preview = !isNaN(num) ? num : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`fixed inset-0 bg-slate-900/30 dark:bg-slate-950/50 backdrop-blur-[2px] transition-opacity ${mounted ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-xs relative z-10 transition-all duration-200 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{studentName}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{lessonTopic} — Uy ishi</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ml-2"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-4 space-y-3">
          {/* Preview circle + input */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${getHomeworkBg(preview)} ${preview != null ? "text-white" : "bg-slate-200 dark:bg-slate-700"}`}>
              {preview != null ? `${preview}` : "—"}
            </div>
            <div className="flex-1">
              <input
                ref={inputRef}
                type="number" min="0" max="100"
                value={value}
                onChange={(e) => {
                  const raw = e.target.value;
                  const n = parseInt(raw, 10);
                  if (raw === "" || (!isNaN(n) && n >= 0 && n <= 100)) setValue(raw);
                }}
                placeholder="0 – 100"
                className="w-full h-10 px-3 text-base font-semibold border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setValue(String(p))}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${String(p) === value ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300"}`}
              >
                {p}%
              </button>
            ))}
            <button
              onClick={() => setValue("")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${value === "" ? "border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-700" : "border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-400"}`}
            >
              Bo'sh
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 h-9 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">Bekor</button>
            <button onClick={handleSave} className="flex-1 h-9 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer">Saqlash</button>
          </div>
        </div>
      </div>
    </div>
  );
}
