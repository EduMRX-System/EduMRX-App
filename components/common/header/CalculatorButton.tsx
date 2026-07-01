"use client";

import { useState, useEffect, useReducer } from "react";
import { Calculator } from "lucide-react";
import { useTranslation } from "react-i18next";
import RightDrawer from "@/components/common/RightDrawer";

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
const INIT: CalcState = { display: "0", operand1: null, operator: null, waitingForSecond: false, history: "", isError: false };

function calcReducer(state: CalcState, action: CalcAction): CalcState {
  if (state.isError) {
    if (action.type === "CLEAR") return INIT;
    if (action.type === "DIGIT") return { ...INIT, display: action.digit };
    if (action.type === "BACKSPACE") return INIT;
    return state;
  }
  switch (action.type) {
    case "DIGIT": {
      if (state.waitingForSecond) return { ...state, display: action.digit, waitingForSecond: false };
      if (state.display === "0") return { ...state, display: action.digit };
      if (state.display.length >= 12) return state;
      return { ...state, display: state.display + action.digit };
    }
    case "DOT": {
      if (state.waitingForSecond) return { ...state, display: "0.", waitingForSecond: false };
      if (state.display.includes(".")) return state;
      return { ...state, display: state.display + "." };
    }
    case "OPERATOR": {
      const cur = parseFloat(state.display);
      if (state.operator && !state.waitingForSecond) {
        const res = compute(state.operand1!, state.operator, cur);
        if (res === "error") return { ...INIT, display: "Xato", isError: true };
        const s = fmt(res);
        return { ...state, display: s, operand1: res, operator: action.op, waitingForSecond: true, history: `${s} ${action.op}` };
      }
      return { ...state, operand1: cur, operator: action.op, waitingForSecond: true, history: `${state.display} ${action.op}` };
    }
    case "EQUALS": {
      if (!state.operator || state.operand1 === null) return state;
      const b = state.waitingForSecond ? state.operand1 : parseFloat(state.display);
      const res = compute(state.operand1, state.operator, b);
      if (res === "error") return { ...INIT, display: "Xato", isError: true };
      const s = fmt(res);
      return { display: s, operand1: null, operator: null, waitingForSecond: false, history: `${state.operand1} ${state.operator} ${state.waitingForSecond ? state.operand1 : state.display} =`, isError: false };
    }
    case "CLEAR": return INIT;
    case "BACKSPACE": {
      if (state.waitingForSecond) return state;
      return { ...state, display: state.display.length > 1 ? state.display.slice(0, -1) : "0" };
    }
    case "PERCENT": {
      return { ...state, display: fmt(parseFloat(state.display) / 100) };
    }
    default: return state;
  }
}

interface CalcButtonProps {
  externalOpen?: boolean;
  onExternalClose?: () => void;
}

export default function CalculatorButton({ externalOpen, onExternalClose }: CalcButtonProps = {}) {
  const { t } = useTranslation();
  const isControlled = externalOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? externalOpen! : internalOpen;
  const [calc, dispatch] = useReducer(calcReducer, INIT);

  const handleClose = () => {
    if (isControlled) onExternalClose?.();
    else setInternalOpen(false);
  };

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const inInput = el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable;
      if (e.key === "Escape") { handleClose(); return; }
      if (isOpen && !inInput) {
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
      if (!isControlled && !inInput && e.key === "c") { setInternalOpen(true); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isOpen, isControlled]); // eslint-disable-line react-hooks/exhaustive-deps

  const base = "flex items-center justify-center h-[50px] rounded-xl text-[15px] font-semibold transition-all duration-100 active:scale-95 select-none cursor-pointer";
  const btnNum = `${base} bg-surface text-foreground border border-border hover:bg-hover`;
  const btnOp = (active: boolean) => `${base} border ${active ? "bg-primary text-primary-fg border-primary" : "bg-primary-soft text-primary border-primary-soft hover:bg-primary/10"}`;
  const btnAction = `${base} bg-hover text-foreground-muted border border-border hover:bg-border-subtle`;
  const btnEquals = `${base} bg-primary hover:bg-primary-hover active:bg-primary-hover text-primary-fg border border-primary`;
  const showAC = calc.display === "0" && !calc.operand1 && !calc.history;

  const btnCls = `w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
    isOpen ? "bg-hover text-foreground" : "text-foreground-muted hover:bg-hover hover:text-foreground"
  }`;

  return (
    <>
      {!isControlled && (
        <button
          onClick={() => setInternalOpen((o) => !o)}
          className={btnCls}
          title={`${t("director.tools.calculator")} (C)`}
          aria-label={t("director.tools.calculator")}
        >
          <Calculator className="w-[18px] h-[18px]" />
        </button>
      )}

      <RightDrawer isOpen={isOpen} onClose={handleClose} title={t("director.tools.calculator")}>
        <div className="p-3 space-y-2 overflow-y-auto flex-1">
          <div className="bg-surface-raised rounded-xl px-4 py-3 min-h-[70px] flex flex-col justify-end items-end border border-border-subtle">
            {calc.history && (
              <p className="text-[11px] text-foreground-subtle mb-1 truncate w-full text-right">{calc.history}</p>
            )}
            <p className={`text-[26px] font-semibold truncate w-full text-right leading-tight ${calc.isError ? "text-danger" : "text-foreground"}`}>
              {calc.display}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <button onClick={() => dispatch({ type: "CLEAR" })} className={`${btnAction} col-span-2 ${calc.isError ? "text-danger" : "text-orange-500"}`}>
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
      </RightDrawer>
    </>
  );
}
