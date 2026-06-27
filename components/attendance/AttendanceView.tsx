"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft, ChevronRight, Check, Percent,
  GraduationCap, Users, ChevronDown,
} from "lucide-react";
import {
  type ViewMode, type AttendanceMap, type AttendanceMark, type AttendanceGroup,
  FULL_MONTHS_UZ,
} from "@/types/attendance";
import {
  FAKE_GROUPS,
  useFakeStudents,
  useFakeLessons,
  buildInitialAttendance,
} from "@/hooks/useAttendance";
import AttendanceGrid from "./AttendanceGrid";

// ── Group Dropdown ────────────────────────────────────────────────
function GroupDropdown({ groups, value, onChange }: {
  groups: AttendanceGroup[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = groups.find((g) => g.id === value);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-10 pl-3 pr-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-indigo-400 transition-colors shadow-sm cursor-pointer min-w-[200px]"
      >
        <GraduationCap className="w-4 h-4 text-indigo-500 shrink-0" />
        <span className="flex-1 text-left truncate">
          {selected ? selected.name : "Guruh tanlang..."}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-40 min-w-[240px] overflow-hidden">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => { onChange(g.id); setOpen(false); }}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/40 ${g.id === value ? "bg-indigo-50 dark:bg-indigo-950/30" : ""}`}
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <div className={`text-[13px] font-semibold ${g.id === value ? "text-indigo-700 dark:text-indigo-300" : "text-slate-800 dark:text-slate-100"}`}>{g.name}</div>
                {g.course_name && <div className="text-[11px] text-slate-400 truncate">{g.course_name}</div>}
                {g.teacher_name && <div className="text-[11px] text-slate-400 truncate">{g.teacher_name}</div>}
              </div>
              {g.id === value && <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Mode Toggle ───────────────────────────────────────────────────
function ModeToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-0.5 border border-slate-200 dark:border-slate-700">
      <button
        onClick={() => onChange("attendance")}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${mode === "attendance" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
      >
        <Check className="w-3.5 h-3.5" />
        Davomat
      </button>
      <button
        onClick={() => onChange("homework")}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${mode === "homework" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
      >
        <Percent className="w-3.5 h-3.5" />
        Uy ishi
      </button>
    </div>
  );
}

// ── Month Navigator ───────────────────────────────────────────────
function MonthNav({ month, year, onChange }: {
  month: number; year: number; onChange: (m: number, y: number) => void;
}) {
  function prev() {
    if (month === 1) onChange(12, year - 1);
    else onChange(month - 1, year);
  }
  function next() {
    if (month === 12) onChange(1, year + 1);
    else onChange(month + 1, year);
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={prev} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer shadow-sm">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div className="px-3 h-8 flex items-center text-[13px] font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm min-w-[130px] justify-center">
        {FULL_MONTHS_UZ[month - 1]} {year}
      </div>
      <button onClick={next} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer shadow-sm">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────
export default function AttendanceView() {
  const today = new Date();
  const [groupId, setGroupId] = useState<string>(FAKE_GROUPS[0].id);
  const [month, setMonth]     = useState<number>(today.getMonth() + 1);
  const [year, setYear]       = useState<number>(today.getFullYear());
  const [mode, setMode]       = useState<ViewMode>("attendance");
  const [attendanceMap, setAttendanceMap] = useState<AttendanceMap>({});

  const students = useFakeStudents(groupId);
  const lessons  = useFakeLessons(groupId, month, year);

  // Re-initialize map when group / month / year changes
  const mapKey = `${groupId}-${year}-${month}`;
  useEffect(() => {
    setAttendanceMap(buildInitialAttendance(students, lessons));
  }, [mapKey]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleUpdate(key: string, mark: AttendanceMark) {
    setAttendanceMap((prev) => ({ ...prev, [key]: mark }));
  }

  const selectedGroup = FAKE_GROUPS.find((g) => g.id === groupId);

  return (
    <div className="w-full space-y-4">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Davomat</h1>
          {selectedGroup && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {selectedGroup.course_name ?? selectedGroup.name}
              {selectedGroup.teacher_name ? ` · ${selectedGroup.teacher_name}` : ""}
            </p>
          )}
        </div>
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <GroupDropdown groups={FAKE_GROUPS} value={groupId} onChange={(id) => setGroupId(id)} />
        <MonthNav month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
        <div className="ml-auto text-[12px] text-slate-400 dark:text-slate-600 hidden sm:block">
          {students.length} o'quvchi · {lessons.length} dars
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <AttendanceGrid
          students={students}
          lessons={lessons}
          attendanceMap={attendanceMap}
          mode={mode}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
