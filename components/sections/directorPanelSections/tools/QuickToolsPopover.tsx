"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  StickyNote, CheckSquare2, Percent, X, Plus, Trash2, Check,
  ArrowLeftRight, RefreshCw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

// ── Types ─────────────────────────────────────────────────────────
type QTab = "notes" | "todos" | "calc";
interface Note { id: string; text: string; }
interface Todo { id: string; text: string; done: boolean; }

const CURRENCIES = ["USD", "UZS", "RUB", "EUR"] as const;
type Currency = (typeof CURRENCIES)[number];

// ── Cookie storage ────────────────────────────────────────────────
// TODO: Replace with backend API (GET/POST /api/v1/director/notes/, /todos/)
// Cookies used (not localStorage) so data persists across *.edumrx.uz subdomains.
function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  const isLocal = window.location.hostname.includes("localhost");
  const opts = isLocal
    ? `path=/; max-age=${365 * 24 * 3600}; samesite=lax`
    : `path=/; domain=.edumrx.uz; secure; samesite=none; max-age=${365 * 24 * 3600}`;
  try { document.cookie = `${name}=${encodeURIComponent(value)}; ${opts}`; } catch {}
}
function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[2]) : null;
}
function saveData<T>(key: string, data: T) {
  try { writeCookie(key, JSON.stringify(data)); } catch {}
}
function loadData<T>(key: string, fallback: T): T {
  try {
    const raw = readCookie(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

// ── Currency API ──────────────────────────────────────────────────
interface RatesResult {
  date: string;
  rates: Record<string, number>;
}

async function fetchRates(): Promise<RatesResult> {
  const PRIMARY = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";
  const FALLBACK = "https://latest.currency-api.pages.dev/v1/currencies/usd.json";

  let data: unknown;
  try {
    const res = await fetch(PRIMARY);
    if (!res.ok) throw new Error("primary failed");
    data = await res.json();
  } catch {
    const res = await fetch(FALLBACK);
    if (!res.ok) throw new Error("both endpoints failed");
    data = await res.json();
  }

  const d = data as Record<string, unknown>;
  const usdRates = d?.usd;
  if (!usdRates || typeof usdRates !== "object") throw new Error("invalid response format");

  return {
    date: typeof d.date === "string" ? d.date : new Date().toISOString().slice(0, 10),
    rates: { usd: 1, ...(usdRates as Record<string, number>) },
  };
}

// ── Number formatting helpers ─────────────────────────────────────
function parseRawInput(val: string): string {
  const stripped = val.replace(/[^0-9.]/g, "");
  const firstDot = stripped.indexOf(".");
  if (firstDot === -1) return stripped;
  return stripped.slice(0, firstDot + 1) + stripped.slice(firstDot + 1).replace(/\./g, "");
}

function applyThousands(raw: string): string {
  if (!raw) return "";
  const [intPart, decPart] = raw.split(".");
  const intNum = parseInt(intPart || "0", 10);
  const intFmt = isNaN(intNum) ? "0" : new Intl.NumberFormat("en-US").format(intNum);
  return decPart !== undefined ? `${intFmt}.${decPart}` : intFmt;
}

function fmtUZS(n: number): string {
  return n.toLocaleString("uz-UZ", { maximumFractionDigits: 0 });
}

function fmtResult(n: number, currency: Currency): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: currency === "UZS" ? 0 : 4,
    minimumFractionDigits: 0,
  }).format(n);
}

// Cross-rate calculation via USD base
// amount_target = amount_from * (rate_target / rate_from)
// where rate_X = units of X per 1 USD
function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  rates: Record<string, number>
): number | null {
  const rateFrom = rates[from.toLowerCase()];
  const rateTo   = rates[to.toLowerCase()];
  if (!rateFrom || !rateTo) return null;
  return amount * (rateTo / rateFrom);
}

// ── Component ─────────────────────────────────────────────────────
export default function QuickToolsPopover() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const userId = user?.id ?? "guest";

  const [isOpen, setIsOpen]     = useState(false);
  const [tab, setTab]           = useState<QTab>("notes");
  const [isMobile, setIsMobile] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // ── Notes ────────────────────────────────────────────────────
  const [notes, setNotes]           = useState<Note[]>([]);
  const [noteInput, setNoteInput]   = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  // ── Todos ────────────────────────────────────────────────────
  const [todos, setTodos]         = useState<Todo[]>([]);
  const [todoInput, setTodoInput] = useState("");

  // ── Percentage calc ──────────────────────────────────────────
  const [pctRaw, setPctRaw]       = useState("");
  const [pctDisplay, setPctDisplay] = useState("");
  const [percent, setPercent]     = useState("");
  const [mode, setMode]           = useState<"add" | "sub">("sub");

  // ── Currency converter ───────────────────────────────────────
  const [fromCurrency, setFromCurrency] = useState<Currency>("UZS");
  const [toCurrency, setToCurrency]     = useState<Currency>("USD");
  const [convRaw, setConvRaw]           = useState("");
  const [convDisplay, setConvDisplay]   = useState("");

  // ── Currency rates (TanStack Query, 1-hour cache) ────────────
  const {
    data: ratesData,
    isLoading: ratesLoading,
    isError: ratesError,
    refetch: refetchRates,
  } = useQuery({
    queryKey: ["currency-rates"],
    queryFn: fetchRates,
    staleTime: 60 * 60 * 1000,
  });

  // Detect mobile (< 640px)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Load from cookies
  useEffect(() => {
    if (!user) return;
    setNotes(loadData<Note[]>(`director_notes_${userId}`, []));
    setTodos(loadData<Todo[]>(`director_todos_${userId}`, []));
  }, [userId, user]);

  // Auto-save notes (debounced) + flash indicator
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      saveData(`director_notes_${userId}`, notes);
      setSavedFlash(true);
      const clear = setTimeout(() => setSavedFlash(false), 1500);
      return () => clearTimeout(clear);
    }, 400);
    return () => clearTimeout(timer);
  }, [notes, userId, user]);

  // Save todos immediately
  useEffect(() => {
    if (!user) return;
    saveData(`director_todos_${userId}`, todos);
  }, [todos, userId, user]);

  // Click-outside → close (desktop only; mobile uses overlay)
  useEffect(() => {
    if (!isOpen || isMobile) return;
    const handle = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isOpen, isMobile]);

  // Prevent body scroll when mobile sheet is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, isOpen]);

  // ── Notes handlers ────────────────────────────────────────────
  const addNote = () => {
    const text = noteInput.trim();
    if (!text) return;
    setNotes((prev) => [{ id: Date.now().toString(), text }, ...prev].slice(0, 20));
    setNoteInput("");
  };
  const deleteNote = (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id));

  // ── Todo handlers ─────────────────────────────────────────────
  const addTodo = () => {
    const text = todoInput.trim();
    if (!text) return;
    setTodos((prev) => [{ id: Date.now().toString(), text, done: false }, ...prev].slice(0, 30));
    setTodoInput("");
  };
  const toggleTodo = (id: string) =>
    setTodos((prev) => prev.map((item) => item.id === id ? { ...item, done: !item.done } : item));
  const deleteTodo = (id: string) =>
    setTodos((prev) => prev.filter((item) => item.id !== id));

  const pendingCount = todos.filter((item) => !item.done).length;

  // ── Percentage calc ───────────────────────────────────────────
  const handlePctInput = (val: string) => {
    const raw = parseRawInput(val);
    setPctRaw(raw);
    setPctDisplay(applyThousands(raw));
  };

  const amtNum     = parseFloat(pctRaw) || 0;
  const pctNum     = parseFloat(percent.replace(",", ".")) || 0;
  const diff       = (amtNum * pctNum) / 100;
  const calcResult = mode === "add" ? amtNum + diff : amtNum - diff;
  const hasCalc    = amtNum > 0 && pctNum > 0;

  // ── Currency converter ────────────────────────────────────────
  const handleConvInput = (val: string) => {
    const raw = parseRawInput(val);
    setConvRaw(raw);
    setConvDisplay(applyThousands(raw));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convAmtNum  = parseFloat(convRaw) || 0;
  const convResult  = ratesData && convAmtNum > 0
    ? convertCurrency(convAmtNum, fromCurrency, toCurrency, ratesData.rates)
    : null;

  // ── Tabs ──────────────────────────────────────────────────────
  const TABS: { id: QTab; icon: React.ReactNode; label: string }[] = [
    { id: "notes", icon: <StickyNote   className="w-4 h-4 shrink-0" />, label: t("director.tools.notes")   },
    { id: "todos", icon: <CheckSquare2 className="w-4 h-4 shrink-0" />, label: t("director.tools.todos")   },
    { id: "calc",  icon: <Percent      className="w-4 h-4 shrink-0" />, label: t("director.tools.percent") },
  ];

  // ── Shared classes ────────────────────────────────────────────
  const inputCls =
    "w-full bg-surface border border-border " +
    "rounded-lg px-3 py-2.5 text-[13px] text-foreground " +
    "placeholder:text-foreground-subtle dark:placeholder:text-foreground-muted outline-none " +
    "focus:border-primary dark:focus:border-primary focus:ring-2 " +
    "focus:ring-primary-ring/50 transition-colors";

  const selectCls =
    "flex-1 bg-surface border border-border " +
    "rounded-lg px-3 py-2.5 text-[13px] font-semibold text-foreground " +
    "outline-none focus:border-primary dark:focus:border-primary " +
    "focus:ring-2 focus:ring-primary-ring/50 transition-colors cursor-pointer";

  const panelCls = isMobile
    ? "fixed bottom-0 inset-x-0 z-[71] bg-surface rounded-t-2xl shadow-2xl flex flex-col max-h-[88vh]"
    : "absolute right-0 mt-2 w-[380px] bg-surface rounded-xl border border-border shadow-2xl z-50 flex flex-col max-h-[540px] origin-top-right";

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="relative" ref={wrapRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={t("director.tools.quick_tools")}
        className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
          isOpen
            ? "bg-hover  text-foreground"
            : "text-foreground-muted hover:bg-hover hover:text-foreground dark:hover:text-white"
        }`}
      >
        <StickyNote className="w-5 h-5" />
        {pendingCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[14px] h-3.5 px-0.5 rounded-full bg-primary text-primary-fg text-[9px] font-bold flex items-center justify-center border-2 border-surface">
            {pendingCount > 9 ? "9+" : pendingCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile full-screen overlay */}
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

            {/* Panel — bottom-sheet on mobile, popover on desktop */}
            <motion.div
              initial={isMobile ? { y: "100%" } : { opacity: 0, y: -6, scale: 0.97 }}
              animate={isMobile ? { y: 0 }       : { opacity: 1, y: 0,  scale: 1    }}
              exit={isMobile    ? { y: "100%" } : { opacity: 0, y: -6, scale: 0.97 }}
              transition={isMobile
                ? { duration: 0.28, ease: [0.32, 0.72, 0, 1] }
                : { duration: 0.16, ease: "easeOut" }
              }
              className={panelCls}
            >
              {/* Mobile drag handle */}
              {isMobile && (
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                  <div className="w-10 h-1 rounded-full bg-border" />
                </div>
              )}

              {/* Tab bar */}
              <div className="flex items-center border-b border-border-subtle shrink-0 px-1 gap-0.5">
                {TABS.map(({ id, icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`flex items-center justify-center gap-1.5 flex-1 sm:flex-none sm:justify-start px-3 h-11 text-[12px] font-semibold transition-colors cursor-pointer border-b-2 -mb-px whitespace-nowrap ${
                      tab === id
                        ? "text-primary border-primary"
                        : "text-foreground-subtle border-transparent hover:text-foreground dark:hover:text-foreground-subtle"
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                    {id === "todos" && pendingCount > 0 && (
                      <span className="min-w-[16px] h-4 px-1 rounded-full bg-primary-soft text-primary text-[10px] font-bold flex items-center justify-center">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onClick={() => setIsOpen(false)}
                  className="ml-auto mr-1.5 p-2 rounded-lg text-foreground-subtle hover:text-foreground-muted dark:hover:text-foreground hover:bg-hover transition-colors cursor-pointer shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable content area */}
              <div className="overflow-y-auto flex-1 overscroll-contain">

                {/* ── NOTES ──────────────────────────────────── */}
                {tab === "notes" && (
                  <div className="p-4 space-y-3">
                    {/* Input area */}
                    <div className="space-y-2">
                      <div className="relative">
                        <textarea
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value.slice(0, 300))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addNote(); }
                          }}
                          placeholder={t("director.tools.notes_placeholder")}
                          rows={3}
                          className={`${inputCls} resize-none pr-10`}
                        />
                        <span className="absolute bottom-2.5 right-2.5 text-[10px] text-foreground-muted pointer-events-none">
                          {noteInput.length}/300
                        </span>
                      </div>
                      <button
                        onClick={addNote}
                        disabled={!noteInput.trim()}
                        className="w-full h-9 bg-primary hover:bg-primary-hover active:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-primary-fg text-[12px] font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {t("director.tools.notes_add")}
                      </button>
                    </div>

                    {/* Status row */}
                    {notes.length > 0 && (
                      <div className="flex items-center justify-between px-0.5">
                        <span className="text-[11px] text-foreground-subtle">
                          {notes.length} ta eslatma
                        </span>
                        <AnimatePresence>
                          {savedFlash && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-1 text-[11px] font-medium text-success"
                            >
                              <Check className="w-3 h-3" />
                              Saqlandi
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Notes list */}
                    <div className="space-y-2">
                      {notes.length === 0 ? (
                        <div className="py-10 flex flex-col items-center gap-2.5 text-center">
                          <div className="w-11 h-11 rounded-xl bg-hover  flex items-center justify-center">
                            <StickyNote className="w-5 h-5 text-foreground-subtle" />
                          </div>
                          <p className="text-[12px] text-foreground-subtle">
                            {t("director.tools.notes_empty")}
                          </p>
                        </div>
                      ) : (
                        notes.map((note) => (
                          <div
                            key={note.id}
                            className="group flex gap-2 bg-surface-raised /60 rounded-xl px-3 py-2.5 border border-border-subtle/60"
                          >
                            <p className="text-[12px] text-foreground flex-1 whitespace-pre-wrap break-words leading-relaxed">
                              {note.text}
                            </p>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="shrink-0 mt-0.5 p-1.5 rounded-md text-foreground-muted hover:text-danger dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                              aria-label="Delete note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* ── TODOS ──────────────────────────────────── */}
                {tab === "todos" && (
                  <div className="p-4 space-y-3">
                    {/* Input row */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={todoInput}
                        onChange={(e) => setTodoInput(e.target.value.slice(0, 200))}
                        onKeyDown={(e) => { if (e.key === "Enter") addTodo(); }}
                        placeholder={t("director.tools.todos_placeholder")}
                        className={`${inputCls} flex-1`}
                      />
                      <button
                        onClick={addTodo}
                        disabled={!todoInput.trim()}
                        className="h-[42px] w-11 bg-primary hover:bg-primary-hover active:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-primary-fg rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                        aria-label="Add todo"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Status */}
                    {todos.length > 0 && (
                      <p className={`text-[11px] font-semibold px-0.5 ${
                        pendingCount > 0
                          ? "text-primary"
                          : "text-success"
                      }`}>
                        {pendingCount > 0
                          ? t("director.tools.todos_pending", { count: pendingCount })
                          : t("director.tools.todos_all_done")}
                      </p>
                    )}

                    {/* List */}
                    <div>
                      {todos.length === 0 ? (
                        <div className="py-10 flex flex-col items-center gap-2.5 text-center">
                          <div className="w-11 h-11 rounded-xl bg-hover  flex items-center justify-center">
                            <CheckSquare2 className="w-5 h-5 text-foreground-subtle" />
                          </div>
                          <p className="text-[12px] text-foreground-subtle">
                            {t("director.tools.todos_empty")}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          {/* Pending */}
                          {todos.filter((item) => !item.done).map((todo) => (
                            <div
                              key={todo.id}
                              className="group flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-surface-raised dark:hover:bg-surface-raised/60 transition-colors"
                            >
                              <button
                                onClick={() => toggleTodo(todo.id)}
                                className="w-5 h-5 rounded-md border-2 border-border hover:border-primary flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                                aria-label="Mark done"
                              />
                              <span className="text-[13px] text-foreground flex-1 break-words leading-relaxed">
                                {todo.text}
                              </span>
                              <button
                                onClick={() => deleteTodo(todo.id)}
                                className="p-1.5 rounded-md text-foreground-muted hover:text-danger dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer shrink-0 sm:opacity-0 sm:group-hover:opacity-100"
                                aria-label="Delete task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}

                          {/* Done — separator only if both sections have items */}
                          {pendingCount > 0 && todos.some((item) => item.done) && (
                            <div className="py-1 flex items-center gap-2 px-2">
                              <div className="flex-1 h-px bg-hover " />
                              <span className="text-[10px] text-foreground-muted uppercase tracking-wide">
                                bajarildi
                              </span>
                              <div className="flex-1 h-px bg-hover " />
                            </div>
                          )}

                          {todos.filter((item) => item.done).map((todo) => (
                            <div
                              key={todo.id}
                              className="group flex items-center gap-2.5 py-2 px-2 rounded-lg opacity-50 hover:opacity-70 transition-opacity"
                            >
                              <button
                                onClick={() => toggleTodo(todo.id)}
                                className="w-5 h-5 rounded-md border-2 border-primary bg-primary-soft  flex items-center justify-center shrink-0 cursor-pointer"
                                aria-label="Mark undone"
                              >
                                <Check className="w-3 h-3 text-primary" />
                              </button>
                              <span className="text-[13px] text-foreground-muted dark:text-foreground-muted flex-1 line-through break-words leading-relaxed">
                                {todo.text}
                              </span>
                              <button
                                onClick={() => deleteTodo(todo.id)}
                                className="p-1.5 rounded-md text-foreground-muted hover:text-danger dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer shrink-0 sm:opacity-0 sm:group-hover:opacity-100"
                                aria-label="Delete task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── CALC ───────────────────────────────────── */}
                {tab === "calc" && (
                  <div className="p-4 space-y-4">

                    {/* ── FOIZ HISOBLAGICH ──────────────────── */}
                    {/* Amount */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
                        {t("director.tools.calc_amount")} (UZS)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={pctDisplay}
                        onChange={(e) => handlePctInput(e.target.value)}
                        placeholder="1,000,000"
                        className={inputCls}
                      />
                    </div>

                    {/* Mode + percent row */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
                        Foiz (%)
                      </label>
                      <div className="flex gap-2">
                        <div className="flex rounded-lg border border-border overflow-hidden shrink-0">
                          <button
                            onClick={() => setMode("add")}
                            className={`px-4 h-10 text-[13px] font-bold transition-colors cursor-pointer ${
                              mode === "add"
                                ? "bg-primary text-primary-fg"
                                : "bg-surface text-foreground-muted hover:bg-surface-raised dark:hover:bg-surface-raised"
                            }`}
                          >
                            +%
                          </button>
                          <button
                            onClick={() => setMode("sub")}
                            className={`px-4 h-10 text-[13px] font-bold transition-colors cursor-pointer ${
                              mode === "sub"
                                ? "bg-primary text-primary-fg"
                                : "bg-surface text-foreground-muted hover:bg-surface-raised dark:hover:bg-surface-raised"
                            }`}
                          >
                            −%
                          </button>
                        </div>
                        <div className="relative flex-1">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={percent}
                            onChange={(e) => setPercent(e.target.value.replace(/[^0-9.,]/g, ""))}
                            placeholder="10"
                            className={inputCls}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-foreground-subtle pointer-events-none">
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Result block */}
                    {hasCalc ? (
                      <div className="bg-primary-soft  rounded-xl border border-primary/20  p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-[12px]">
                          <span className="text-foreground-muted">
                            {fmtUZS(amtNum)} {mode === "add" ? "+" : "−"} {pctNum}%
                          </span>
                          <span className={`font-semibold ${
                            mode === "add" ? "text-success" : "text-danger"
                          }`}>
                            {mode === "add" ? "+" : "−"}{fmtUZS(diff)} UZS
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-primary/20 dark:border-primary/20 pt-2.5">
                          <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wide">
                            {t("director.tools.calc_result")}
                          </span>
                          <span className="text-[22px] font-bold text-primary tabular-nums leading-none">
                            {fmtUZS(calcResult)}
                            <span className="text-[13px] font-semibold ml-1.5 text-primary">
                              UZS
                            </span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-surface-raised /40 rounded-xl border border-border-subtle/60 px-4 py-3.5 text-center">
                        <p className="text-[12px] text-foreground-subtle">
                          Masalan: 100,000 dan 10% chegirma ={" "}
                          <span className="font-semibold text-foreground-muted">90,000</span>
                        </p>
                      </div>
                    )}

                    {/* ── VALYUTA KONVERTOR ─────────────────── */}
                    <div className="border-t border-border-subtle pt-4 space-y-3">

                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
                          {t("director.tools.currency")}
                        </span>
                        <button
                          onClick={() => refetchRates()}
                          disabled={ratesLoading}
                          title={t("director.tools.currency_retry")}
                          className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary  hover:bg-hover transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${ratesLoading ? "animate-spin" : ""}`} />
                        </button>
                      </div>

                      {/* From / swap / To selects */}
                      <div className="flex items-center gap-2">
                        <select
                          value={fromCurrency}
                          onChange={(e) => setFromCurrency(e.target.value as Currency)}
                          className={selectCls}
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <button
                          onClick={swapCurrencies}
                          className="p-2 rounded-lg text-foreground-subtle hover:text-primary  hover:bg-hover transition-colors cursor-pointer shrink-0"
                          aria-label="Swap currencies"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                        </button>
                        <select
                          value={toCurrency}
                          onChange={(e) => setToCurrency(e.target.value as Currency)}
                          className={selectCls}
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Conversion amount input */}
                      <input
                        type="text"
                        inputMode="decimal"
                        value={convDisplay}
                        onChange={(e) => handleConvInput(e.target.value)}
                        placeholder="1,000,000"
                        className={inputCls}
                      />

                      {/* Loading skeleton */}
                      {ratesLoading && (
                        <div className="bg-surface-raised /40 rounded-xl border border-border-subtle/60 px-4 py-3 flex items-center gap-2.5">
                          <div className="w-4 h-4 rounded-full border-2 border-primary-ring border-t-primary animate-spin shrink-0" />
                          <span className="text-[12px] text-foreground-subtle">
                            {t("director.tools.currency_loading")}
                          </span>
                        </div>
                      )}

                      {/* Error state */}
                      {ratesError && !ratesLoading && (
                        <div className="bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/40 px-4 py-3 flex items-center justify-between gap-2">
                          <span className="text-[12px] text-danger">
                            {t("director.tools.currency_error")}
                          </span>
                          <button
                            onClick={() => refetchRates()}
                            className="text-[12px] font-semibold text-primary hover:underline cursor-pointer shrink-0"
                          >
                            {t("director.tools.currency_retry")}
                          </button>
                        </div>
                      )}

                      {/* Result */}
                      {ratesData && !ratesError && (
                        convAmtNum > 0 && convResult !== null ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between bg-primary-soft  rounded-xl border border-primary/20  px-4 py-3">
                              <span className="text-[12px] text-foreground-muted">
                                {fmtResult(convAmtNum, fromCurrency)}{" "}{fromCurrency}
                              </span>
                              <span className="text-[18px] font-bold text-primary tabular-nums">
                                {fmtResult(convResult, toCurrency)}
                                <span className="text-[12px] font-semibold ml-1.5 text-primary">
                                  {toCurrency}
                                </span>
                              </span>
                            </div>
                            <p className="text-[11px] text-foreground-subtle px-0.5">
                              {t("director.tools.currency_rate", { date: ratesData.date })}
                            </p>
                          </div>
                        ) : (
                          <p className="text-[11px] text-foreground-subtle px-0.5">
                            {t("director.tools.currency_enter_amount")}
                          </p>
                        )
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
