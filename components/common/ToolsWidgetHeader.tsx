"use client";

import { useState, useEffect, useRef, useReducer, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, CalendarDays, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

type Tab = "calculator" | "calendar";

interface CalcState {
  display: string;
  operand1: number | null;
  operator: string | null;
  waitingForSecond: boolean;
  history: string;
  isError: boolean;
}

type CalcAction =
  | { type: "DIGIT"; digit: string }
  | { type: "DOT" }
  | { type: "OPERATOR"; op: string }
  | { type: "EQUALS" }
  | { type: "CLEAR" }
  | { type: "BACKSPACE" }
  | { type: "PERCENT" };

function compute(a: number, op: string, b: number): number | "error" {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? "error" : a / b;
    default: return b;
  }
}

function fmt(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "Xato";
  const s = parseFloat(n.toPrecision(12)).toString();
  return s.length > 14 ? n.toExponential(6) : s;
}

const CALC_INIT: CalcState = {
  display: "0",
  operand1: null,
  operator: null,
  waitingForSecond: false,
  history: "",
  isError: false,
};

function calcReducer(state: CalcState, action: CalcAction): CalcState {
  if (state.isError) {
    if (action.type === "CLEAR") return CALC_INIT;
    if (action.type === "DIGIT") return { ...CALC_INIT, display: action.digit };
    if (action.type === "BACKSPACE") return CALC_INIT;
    return state;
  }

  switch (action.type) {
    case "DIGIT": {
      if (state.waitingForSecond)
        return { ...state, display: action.digit, waitingForSecond: false };
      if (state.display === "0") return { ...state, display: action.digit };
      if (state.display.length >= 12) return state;
      return { ...state, display: state.display + action.digit };
    }
    case "DOT": {
      if (state.waitingForSecond)
        return { ...state, display: "0.", waitingForSecond: false };
      if (state.display.includes(".")) return state;
      return { ...state, display: state.display + "." };
    }
    case "OPERATOR": {
      const cur = parseFloat(state.display);
      if (state.operator && !state.waitingForSecond) {
        const res = compute(state.operand1!, state.operator, cur);
        if (res === "error") return { ...CALC_INIT, display: "Xato", isError: true };
        const numStr = fmt(res);
        return { ...state, display: numStr, operand1: res, operator: action.op, waitingForSecond: true, history: `${numStr} ${action.op}` };
      }
      return { ...state, operand1: cur, operator: action.op, waitingForSecond: true, history: `${state.display} ${action.op}` };
    }
    case "EQUALS": {
      if (!state.operator || state.operand1 === null) return state;
      const b = state.waitingForSecond ? state.operand1 : parseFloat(state.display);
      const res = compute(state.operand1, state.operator, b);
      if (res === "error") return { ...CALC_INIT, display: "Xato", isError: true };
      const numStr = fmt(res);
      return { display: numStr, operand1: null, operator: null, waitingForSecond: false, history: `${state.operand1} ${state.operator} ${state.waitingForSecond ? state.operand1 : state.display} =`, isError: false };
    }
    case "CLEAR":
      return CALC_INIT;
    case "BACKSPACE": {
      if (state.waitingForSecond) return state;
      const next = state.display.length > 1 ? state.display.slice(0, -1) : "0";
      return { ...state, display: next };
    }
    case "PERCENT": {
      const val = parseFloat(state.display) / 100;
      return { ...state, display: fmt(val) };
    }
    default:
      return state;
  }
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstWeekday(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

export default function ToolsWidgetHeader() {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("calculator");
  const [isMobile, setIsMobile] = useState(false);
  const [calc, dispatch] = useReducer(calcReducer, CALC_INIT);
  const wrapRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleOpen = useCallback((newTab: Tab) => {
    if (isOpen && tab === newTab) setIsOpen(false);
    else { setTab(newTab); setIsOpen(true); }
  }, [isOpen, tab]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isOpen || isMobile) return;
    const handle = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, isOpen]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const inInput = el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable;

      if (e.key === "Escape") { setIsOpen(false); return; }

      if (isOpen && tab === "calculator" && !inInput) {
        if (/^[0-9]$/.test(e.key)) { dispatch({ type: "DIGIT", digit: e.key }); return; }
        if (e.key === ".") { dispatch({ type: "DOT" }); return; }
        if (e.key === "+") { dispatch({ type: "OPERATOR", op: "+" }); return; }
        if (e.key === "-") { dispatch({ type: "OPERATOR", op: "-" }); return; }
        if (e.key === "*") { dispatch({ type: "OPERATOR", op: "×" }); return; }
        if (e.key === "/") { e.preventDefault(); dispatch({ type: "OPERATOR", op: "÷" }); return; }
        if (e.key === "Enter" || e.key === "=") { dispatch({ type: "EQUALS" }); return; }
        if (e.key === "Backspace") { dispatch({ type: "BACKSPACE" }); return; }
        if (e.key === "Delete") { dispatch({ type: "CLEAR" }); return; }
      }

      if (inInput) return;
      if (e.key === "c") { setTab("calculator"); setIsOpen(true); }
      if (e.key === "k") { setTab("calendar"); setIsOpen(true); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isOpen, tab]);

  const monthsRaw = t("director.tools.months", { returnObjects: true });
  const months: string[] = Array.isArray(monthsRaw) ? monthsRaw : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const weekdaysRaw = t("director.tools.weekdays", { returnObjects: true });
  const weekdays: string[] = Array.isArray(weekdaysRaw) ? weekdaysRaw : ["Mo","Tu","We","Th","Fr","Sa","Su"];
  const totalDays = daysInMonth(calYear, calMonth);
  const startOffset = firstWeekday(calYear, calMonth);

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); } else setCalMonth((m) => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); } else setCalMonth((m) => m + 1); };

  const base = "flex items-center justify-center h-[50px] rounded-xl text-[15px] font-semibold transition-all duration-100 active:scale-95 select-none cursor-pointer";
  const btnNum = `${base} bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700`;
  const btnOp = (active: boolean) => `${base} border ${active ? "bg-indigo-600 text-white border-indigo-600" : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"}`;
  const btnAction = `${base} bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600`;
  const btnEquals = `${base} bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white border border-indigo-600`;
  const showAC = calc.display === "0" && !calc.operand1 && !calc.history;

  const panelCls = isMobile
    ? "fixed bottom-0 inset-x-0 z-[71] bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh]"
    : "absolute right-0 top-full mt-2 w-[316px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden origin-top-right";

  const btnCls = (active: boolean) =>
    `w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
      active
        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
    }`;

  return (
    <div className="relative flex items-center gap-0.5" ref={wrapRef}>
      <button
        onClick={() => handleOpen("calculator")}
        className={btnCls(isOpen && tab === "calculator")}
        title={`${t("director.tools.calculator")} (C)`}
        aria-label={t("director.tools.calculator")}
      >
        <Calculator className="w-[18px] h-[18px]" />
      </button>

      <button
        onClick={() => handleOpen("calendar")}
        className={btnCls(isOpen && tab === "calendar")}
        title={`${t("director.tools.calendar")} (K)`}
        aria-label={t("director.tools.calendar")}
      >
        <CalendarDays className="w-[18px] h-[18px]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]"
                onClick={() => setIsOpen(false)}
              />
            )}

            <motion.div
              initial={isMobile ? { y: "100%" } : { opacity: 0, y: -6, scale: 0.97 }}
              animate={isMobile ? { y: 0 }       : { opacity: 1, y: 0,  scale: 1    }}
              exit={isMobile    ? { y: "100%" }  : { opacity: 0, y: -6, scale: 0.97 }}
              transition={isMobile
                ? { duration: 0.28, ease: [0.32, 0.72, 0, 1] }
                : { duration: 0.16, ease: "easeOut" }
              }
              className={panelCls}
            >
              {isMobile && (
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                  <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                </div>
              )}

              {/* Tab bar */}
              <div className="flex items-center border-b border-slate-100 dark:border-slate-800 px-1 pt-1 gap-0.5 shrink-0">
                {(["calculator", "calendar"] as Tab[]).map((tabName) => (
                  <button
                    key={tabName}
                    onClick={() => setTab(tabName)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-semibold rounded-t-lg transition-colors cursor-pointer ${
                      tab === tabName
                        ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 -mb-px"
                        : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    {tabName === "calculator"
                      ? <Calculator className="w-3.5 h-3.5" />
                      : <CalendarDays className="w-3.5 h-3.5" />}
                    {t(`director.tools.${tabName}`)}
                  </button>
                ))}
                <button
                  onClick={() => setIsOpen(false)}
                  className="ml-auto mr-1.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-y-auto overscroll-contain">
                {/* ── CALCULATOR ──────────────────────────── */}
                {tab === "calculator" && (
                  <div className="p-3 space-y-2">
                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl px-4 py-3 min-h-[70px] flex flex-col justify-end items-end border border-slate-100 dark:border-slate-700">
                      {calc.history && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-1 truncate w-full text-right">
                          {calc.history}
                        </p>
                      )}
                      <p className={`text-[26px] font-semibold truncate w-full text-right leading-tight ${calc.isError ? "text-red-500" : "text-slate-900 dark:text-slate-100"}`}>
                        {calc.display}
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      <button onClick={() => dispatch({ type: "CLEAR" })} className={`${btnAction} col-span-2 ${calc.isError ? "text-red-500 dark:text-red-400" : "text-orange-500 dark:text-orange-400"}`}>
                        {showAC ? "AC" : "C"}
                      </button>
                      <button onClick={() => dispatch({ type: "BACKSPACE" })} className={btnAction}>⌫</button>
                      <button onClick={() => dispatch({ type: "OPERATOR", op: "÷" })} className={btnOp(calc.operator === "÷" && calc.waitingForSecond)}>÷</button>

                      {["7", "8", "9"].map((d) => (
                        <button key={d} onClick={() => dispatch({ type: "DIGIT", digit: d })} className={btnNum}>{d}</button>
                      ))}
                      <button onClick={() => dispatch({ type: "OPERATOR", op: "×" })} className={btnOp(calc.operator === "×" && calc.waitingForSecond)}>×</button>

                      {["4", "5", "6"].map((d) => (
                        <button key={d} onClick={() => dispatch({ type: "DIGIT", digit: d })} className={btnNum}>{d}</button>
                      ))}
                      <button onClick={() => dispatch({ type: "OPERATOR", op: "-" })} className={btnOp(calc.operator === "-" && calc.waitingForSecond)}>−</button>

                      {["1", "2", "3"].map((d) => (
                        <button key={d} onClick={() => dispatch({ type: "DIGIT", digit: d })} className={btnNum}>{d}</button>
                      ))}
                      <button onClick={() => dispatch({ type: "OPERATOR", op: "+" })} className={btnOp(calc.operator === "+" && calc.waitingForSecond)}>+</button>

                      <button onClick={() => dispatch({ type: "PERCENT" })} className={btnAction}>%</button>
                      <button onClick={() => dispatch({ type: "DIGIT", digit: "0" })} className={btnNum}>0</button>
                      <button onClick={() => dispatch({ type: "DOT" })} className={btnNum}>.</button>
                      <button onClick={() => dispatch({ type: "EQUALS" })} className={btnEquals}>=</button>
                    </div>
                  </div>
                )}

                {/* ── CALENDAR ────────────────────────────── */}
                {tab === "calendar" && (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-100">
                        {months[calMonth]} {calYear}
                      </span>
                      <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 mb-1">
                      {weekdays.map((d) => (
                        <div key={d} className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 text-center py-1">{d}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-0.5">
                      {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
                      {Array.from({ length: totalDays }).map((_, i) => {
                        const day = i + 1;
                        const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate();
                        const isSel = !!selectedDate && selectedDate.getFullYear() === calYear && selectedDate.getMonth() === calMonth && selectedDate.getDate() === day;
                        return (
                          <button
                            key={day}
                            onClick={() => setSelectedDate(new Date(calYear, calMonth, day))}
                            className={`w-full aspect-square flex items-center justify-center text-[12px] rounded-lg transition-colors cursor-pointer font-medium ${
                              isSel
                                ? "bg-indigo-600 text-white"
                                : isToday
                                ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold ring-1 ring-indigo-200 dark:ring-indigo-800"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => { setCalYear(today.getFullYear()); setCalMonth(today.getMonth()); }}
                        className="text-[12px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                      >
                        {t("director.tools.today")}
                      </button>
                      {selectedDate && (
                        <span className="text-[12px] text-slate-500 dark:text-slate-400">
                          {selectedDate.getDate()} {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
