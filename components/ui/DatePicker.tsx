"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useUIStore } from "@/store/useUIStore";

export type PickerMode = "calendar" | "select" | "text";
export type DatePickerVariant = "anchor" | "center" | "right";

interface DatePickerProps {
  value: string;           // "YYYY-MM-DD"
  onChange: (v: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  min?: string;            // "YYYY-MM-DD"
  max?: string;            // "YYYY-MM-DD"
  className?: string;
  placeholder?: string;
  /** "anchor" — small dropdown next to the trigger, unchanged legacy behavior.
   *  "center" — opens as a centered modal overlay (fade+scale).
   *  "right" — opens as a right-side slide-in drawer.
   *  Omit to follow the user's global setting (Profile → DatePicker ko'rinishi, defaults to "center"). */
  variant?: DatePickerVariant;
}

// ── helpers ──────────────────────────────────────────────────────────
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstWeekday(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }
function parseDateStr(s?: string) {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, mo, d] = s.split("-").map(Number);
  return { y, m: mo - 1, d };
}
function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function fmtDisplay(v: string) {
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return "";
  const [y, m, d] = v.split("-");
  return `${d}.${m}.${y}`;
}
function todayISO() {
  const t = new Date();
  return toISO(t.getFullYear(), t.getMonth(), t.getDate());
}
function applyMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

// ── Scrollable column for Select mode ───────────────────────────────
function ScrollColumn({ value, options, onChange }: {
  value: number;
  options: { value: number; label: string }[];
  onChange: (v: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const sel = container.querySelector("[data-selected]") as HTMLElement | null;
    if (sel) container.scrollTop = sel.offsetTop - container.offsetHeight / 2 + sel.offsetHeight / 2;
  }, [value]);

  return (
    <div ref={ref} className="flex-1 border border-border rounded-lg max-h-[120px] overflow-y-auto bg-surface scroll-smooth">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          {...(o.value === value ? { "data-selected": "" } : {})}
          onClick={() => onChange(o.value)}
          className={`w-full text-left px-2 py-1.5 text-[12px] cursor-pointer transition-colors flex items-center justify-between gap-1 ${
            o.value === value
              ? "bg-primary-soft text-primary font-semibold"
              : "text-foreground hover:bg-hover"
          }`}
        >
          <span className="truncate">{o.label}</span>
          {o.value === value && <Check className="w-2.5 h-2.5 shrink-0" />}
        </button>
      ))}
    </div>
  );
}

// ── Main DatePicker ───────────────────────────────────────────────────
export default function DatePicker({
  value, onChange, label, error, required,
  min, max, className = "", placeholder,
  variant: variantProp,
}: DatePickerProps) {
  const { t } = useTranslation();
  const mode = useUIStore((s) => s.datePickerMode) as PickerMode;
  const globalVariant = useUIStore((s) => s.datePickerVariant) as DatePickerVariant;
  // explicit prop always wins (per-instance override); otherwise follow the user's global setting
  const variant = variantProp ?? globalVariant;

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [popupStyle, setPopupStyle] = useState<CSSProperties>({});
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // popup is portaled to document.body, so it's a separate DOM subtree from `ref`
  // (needed so it never inherits a transformed/overflow-clipped ancestor, e.g. a modal's
  // enter-transition — position:fixed is otherwise relative to that ancestor, not the viewport)
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const today = new Date();
  const parsed = parseDateStr(value);

  // calendar nav
  const [calYear, setCalYear] = useState(parsed?.y ?? today.getFullYear());
  const [calMonth, setCalMonth] = useState(parsed?.m ?? today.getMonth());

  // select columns
  const [selY, setSelY] = useState(parsed?.y ?? today.getFullYear());
  const [selM, setSelM] = useState(parsed?.m ?? today.getMonth());
  const [selD, setSelD] = useState(parsed?.d ?? today.getDate());

  // text mode
  const [textVal, setTextVal] = useState(fmtDisplay(value));
  const [textErr, setTextErr] = useState("");

  // sync from outside
  useEffect(() => {
    const p = parseDateStr(value);
    if (p) {
      setCalYear(p.y); setCalMonth(p.m);
      setSelY(p.y); setSelM(p.m); setSelD(p.d);
      setTextVal(fmtDisplay(value));
    }
  }, [value]);

  // click-outside — popup is portaled to document.body, so it's not a DOM descendant of
  // `ref`; both the trigger wrapper and the portaled popup must be checked
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (popupRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // close on scroll — popup position is computed once via getBoundingClientRect at open time,
  // so it drifts away from the trigger if an ancestor (e.g. a scrollable modal body) scrolls.
  // Scrolling inside the popup itself (e.g. the select-mode columns) must not close it.
  useEffect(() => {
    if (!open) return;
    const handler = (e: Event) => {
      if (popupRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener("scroll", handler, true);
    return () => window.removeEventListener("scroll", handler, true);
  }, [open]);

  const handleOpen = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const POPUP_W = 300;
      const POPUP_H = 340;
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - POPUP_W - 8));
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const top = spaceBelow >= POPUP_H || rect.top < POPUP_H
        ? rect.bottom + 6
        : Math.max(8, rect.top - POPUP_H - 4);
      setPopupStyle({ top, left });
    }
    setOpen((o) => !o);
  };

  const isDateDisabled = (y: number, m: number, d: number) => {
    const iso = toISO(y, m, d);
    return !!(min && iso < min) || !!(max && iso > max);
  };

  // calendar
  const prevCal = () => calMonth === 0 ? (setCalMonth(11), setCalYear((y) => y - 1)) : setCalMonth((m) => m - 1);
  const nextCal = () => calMonth === 11 ? (setCalMonth(0), setCalYear((y) => y + 1)) : setCalMonth((m) => m + 1);
  const pickDay = (day: number) => {
    if (isDateDisabled(calYear, calMonth, day)) return;
    onChange(toISO(calYear, calMonth, day)); setOpen(false);
  };
  const pickToday = () => {
    const t = new Date();
    if (!isDateDisabled(t.getFullYear(), t.getMonth(), t.getDate())) onChange(todayISO());
    setCalYear(t.getFullYear()); setCalMonth(t.getMonth()); setOpen(false);
  };

  // select
  const minParsed = parseDateStr(min);
  const maxParsed = parseDateStr(max);
  const minYear = minParsed?.y ?? Math.max(1900, (maxParsed?.y ?? today.getFullYear()) - 120);
  const maxYear = maxParsed?.y ?? today.getFullYear() + 10;
  const maxDayForSel = daysInMonth(selY, selM);
  const clampedD = Math.min(selD, maxDayForSel);

  const handleSelect = (nextY: number, nextM: number, nextD: number) => {
    const maxD = daysInMonth(nextY, nextM);
    const d = Math.min(nextD, maxD);
    setSelY(nextY); setSelM(nextM); setSelD(d);
    if (!isDateDisabled(nextY, nextM, d)) onChange(toISO(nextY, nextM, d));
  };

  // text
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyMask(e.target.value);
    setTextVal(masked);
    setTextErr("");
    if (masked.length === 10) {
      const [dd, mm, yyyy] = masked.split(".");
      const d = Number(dd), m = Number(mm), y = Number(yyyy);
      if (m >= 1 && m <= 12 && d >= 1 && y >= 1000) {
        const dmax = daysInMonth(y, m - 1);
        if (d <= dmax) {
          const iso = toISO(y, m - 1, d);
          if (isDateDisabled(y, m - 1, d)) {
            setTextErr(t("common.datepicker.text_out_of_range"));
          } else {
            onChange(iso);
          }
        } else {
          setTextErr(t("common.datepicker.text_invalid"));
        }
      } else {
        setTextErr(t("common.datepicker.text_invalid"));
      }
    }
  };

  // i18n
  const monthsRaw = t("director.tools.months", { returnObjects: true });
  const MONTHS: string[] = Array.isArray(monthsRaw)
    ? monthsRaw
    : ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];
  const weekdaysRaw = t("director.tools.weekdays", { returnObjects: true });
  const WDAYS: string[] = Array.isArray(weekdaysRaw)
    ? weekdaysRaw
    : ["Du", "Se", "Cho", "Pa", "Ju", "Sh", "Ya"];

  const TODAY_ISO = todayISO();
  const totalDays = daysInMonth(calYear, calMonth);
  const startOffset = firstWeekday(calYear, calMonth);

  // column options
  const dayOptions = Array.from({ length: maxDayForSel }, (_, i) => ({ value: i + 1, label: String(i + 1) }));
  const monthOptions = MONTHS.map((name, i) => ({ value: i, label: name }));
  const yearOptions = Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({ value: maxYear - i, label: String(maxYear - i) }));

  const triggerCls = `flex items-center justify-between h-[40px] w-full px-3 rounded-lg border text-[14px] transition-all bg-surface text-foreground cursor-pointer outline-none select-none ${
    error
      ? "border-danger/50"
      : "border-border hover:border-primary/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-ring"
  }`;

  // ── shared body — same calendar/select/text content for all variants ──
  const pickerBody = (
    <>
      {/* ── CALENDAR ─────────────────────────────────────────── */}
      {mode === "calendar" && (
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={prevCal} className="p-1.5 rounded-lg hover:bg-hover text-foreground-muted cursor-pointer transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[14px] font-bold text-foreground">{MONTHS[calMonth]} {calYear}</span>
            <button type="button" onClick={nextCal} className="p-1.5 rounded-lg hover:bg-hover text-foreground-muted cursor-pointer transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {WDAYS.map((d) => (
              <div key={d} className="text-[10px] font-bold text-foreground-subtle text-center py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-0.5">
            {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1;
              const iso = toISO(calYear, calMonth, day);
              const isSel = value === iso;
              const isToday = iso === TODAY_ISO;
              const disabled = isDateDisabled(calYear, calMonth, day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => pickDay(day)}
                  className={`w-full aspect-square flex items-center justify-center text-[12px] rounded-lg transition-colors font-medium ${
                    disabled
                      ? "text-foreground-subtle opacity-30 cursor-not-allowed"
                      : isSel
                      ? "bg-primary text-primary-fg cursor-pointer"
                      : isToday
                      ? "ring-1 ring-primary text-primary font-bold cursor-pointer hover:bg-primary-soft"
                      : "text-foreground hover:bg-hover cursor-pointer"
                  }`}
                >{day}</button>
              );
            })}
          </div>
          <div className="mt-2.5 pt-2 border-t border-border-subtle">
            <button
              type="button"
              onClick={pickToday}
              disabled={!!(min && todayISO() < min) || !!(max && todayISO() > max)}
              className="text-[12px] font-semibold text-primary hover:text-primary-hover px-2 py-1 rounded-lg hover:bg-primary-soft transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >{t("common.datepicker.today")}</button>
          </div>
        </div>
      )}

      {/* ── SELECT ───────────────────────────────────────────── */}
      {mode === "select" && (
        <div className="p-3 space-y-2">
          <div className="flex gap-1.5">
            <div className="flex flex-col gap-1 w-[52px] shrink-0">
              <span className="text-[10px] font-bold text-foreground-subtle uppercase tracking-wide text-center">
                {t("common.datepicker.day")}
              </span>
              <ScrollColumn value={clampedD} options={dayOptions} onChange={(d) => handleSelect(selY, selM, d)} />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-[10px] font-bold text-foreground-subtle uppercase tracking-wide text-center">
                {t("common.datepicker.month")}
              </span>
              <ScrollColumn value={selM} options={monthOptions} onChange={(m) => handleSelect(selY, m, selD)} />
            </div>
            <div className="flex flex-col gap-1 w-[64px] shrink-0">
              <span className="text-[10px] font-bold text-foreground-subtle uppercase tracking-wide text-center">
                {t("common.datepicker.year")}
              </span>
              <ScrollColumn value={selY} options={yearOptions} onChange={(y) => handleSelect(y, selM, selD)} />
            </div>
          </div>
          {value && (
            <p className="text-center text-[13px] font-semibold text-foreground-muted pt-1 border-t border-border-subtle">
              {fmtDisplay(value)}
            </p>
          )}
        </div>
      )}

      {/* ── TEXT ─────────────────────────────────────────────── */}
      {mode === "text" && (
        <div className="p-3 space-y-2">
          <p className="text-[11px] text-foreground-subtle">{t("common.datepicker.text_hint")}</p>
          <input
            type="text"
            inputMode="numeric"
            value={textVal}
            onChange={handleTextChange}
            placeholder="26.06.2026"
            maxLength={10}
            autoFocus
            className="border border-border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-surface text-foreground focus:border-primary focus:ring-2 focus:ring-primary-ring placeholder:text-foreground-subtle"
          />
          {textErr && <p className="text-danger text-[11px]">{textErr}</p>}
          {value && !textErr && (
            <p className="text-center text-[13px] font-semibold text-foreground-muted">
              {fmtDisplay(value)}
            </p>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className={className} ref={ref}>
      {label && (
        <label className="text-[14px] text-foreground-muted mb-1 block font-semibold">
          {label}{required && " *"}
        </label>
      )}

      <button ref={triggerRef} type="button" onClick={handleOpen} className={triggerCls} aria-expanded={open}>
        <span className={value ? "text-foreground" : "text-foreground-subtle"}>
          {fmtDisplay(value) || placeholder || t("common.datepicker.placeholder")}
        </span>
        <Calendar className="w-4 h-4 text-foreground-subtle shrink-0" />
      </button>

      {error && <p className="text-danger text-[11px] mt-1">{error}</p>}

      {/* ── ANCHOR variant (default, legacy) — fixed popup, doesn't affect modal scroll height ── */}
      {variant === "anchor" && open && mounted && createPortal(
        <div ref={popupRef} style={popupStyle} className="fixed z-[9999] w-[300px] bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
          {pickerBody}
        </div>,
        document.body
      )}

      {/* ── CENTER variant — modal overlay, fade+scale. Backdrop does not close (X only) ── */}
      {variant === "center" && mounted && createPortal(
        <AnimatePresence>
          {open && (
            <div ref={popupRef} className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-overlay backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="relative z-10 w-[300px] bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-3 pt-3">
                  <span className="text-[13px] font-bold text-foreground">
                    {label || t("common.datepicker.placeholder")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="p-1 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-hover transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {pickerBody}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ── RIGHT variant — drawer sliding in from the right edge. Backdrop does not close (X only) ── */}
      {variant === "right" && mounted && createPortal(
        <AnimatePresence>
          {open && (
            <div ref={popupRef} className="fixed inset-0 z-[9999]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-overlay backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-y-0 right-0 w-[300px] max-w-full bg-surface border-l border-border shadow-2xl overflow-y-auto"
              >
                <div className="flex items-center justify-between px-3 pt-3">
                  <span className="text-[13px] font-bold text-foreground">
                    {label || t("common.datepicker.placeholder")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="p-1 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-hover transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {pickerBody}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

// ── MonthYearPicker (for payment/expense period fields) ──────────────
interface MonthYearPickerProps {
  month: number;        // 1–12
  year: number;
  onChangeMonth: (m: number) => void;
  onChangeYear: (y: number) => void;
  label?: string;
  minYear?: number;
  maxYear?: number;
  className?: string;
}

export function MonthYearPicker({
  month, year, onChangeMonth, onChangeYear,
  label, minYear, maxYear, className = "",
}: MonthYearPickerProps) {
  const { t } = useTranslation();
  const today = new Date();
  const min = minYear ?? today.getFullYear() - 5;
  const max = maxYear ?? today.getFullYear() + 3;

  const monthsRaw = t("director.tools.months", { returnObjects: true });
  const MONTHS: string[] = Array.isArray(monthsRaw)
    ? monthsRaw
    : ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];

  const monthOptions = MONTHS.map((name, i) => ({ value: i + 1, label: name }));
  const yearOptions = Array.from({ length: max - min + 1 }, (_, i) => ({ value: max - i, label: String(max - i) }));

  return (
    <div className={className}>
      {label && (
        <label className="text-[14px] text-foreground-muted mb-1 block font-semibold">{label}</label>
      )}
      <div className="flex gap-2">
        <div className="flex-1 border border-border rounded-lg max-h-[120px] overflow-y-auto bg-surface">
          {monthOptions.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => onChangeMonth(o.value)}
              className={`w-full text-left px-2 py-1.5 text-[12px] cursor-pointer transition-colors flex items-center justify-between gap-1 ${
                o.value === month
                  ? "bg-primary-soft text-primary font-semibold"
                  : "text-foreground hover:bg-hover"
              }`}
            >
              <span>{o.label}</span>
              {o.value === month && <Check className="w-2.5 h-2.5 shrink-0" />}
            </button>
          ))}
        </div>
        <div className="w-[72px] border border-border rounded-lg max-h-[120px] overflow-y-auto bg-surface">
          {yearOptions.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => onChangeYear(o.value)}
              className={`w-full text-left px-2 py-1.5 text-[12px] cursor-pointer transition-colors flex items-center justify-between gap-1 ${
                o.value === year
                  ? "bg-primary-soft text-primary font-semibold"
                  : "text-foreground hover:bg-hover"
              }`}
            >
              <span>{o.label}</span>
              {o.value === year && <Check className="w-2.5 h-2.5 shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
