export type AttendanceStatus = "present" | "absent" | "excused" | null;
export type ViewMode = "attendance" | "homework";

export interface AttendanceStudent {
  id: string;
  name: string;
  phone?: string;
}

export interface AttendanceLesson {
  id: string;
  date: string; // "2026-06-02"
  topic: string;
}

export interface AttendanceGroup {
  id: string;
  name: string;
  course_name?: string;
  teacher_name?: string;
}

export interface AttendanceMark {
  status: AttendanceStatus;
  reason?: string;
  homework_percent?: number | null;
}

/** Key format: `${studentId}__${lessonId}` */
export type AttendanceMap = Record<string, AttendanceMark>;

export const REASON_OPTIONS = [
  { value: "sick", label: "Kasal" },
  { value: "family", label: "Oilaviy sabab" },
  { value: "permitted", label: "Ruxsat bilan" },
  { value: "transport", label: "Transport" },
  { value: "unexcused", label: "Sababsiz" },
  { value: "other", label: "Boshqa" },
] as const;

export type ReasonValue = (typeof REASON_OPTIONS)[number]["value"];

export function attendanceKey(studentId: string, lessonId: string): string {
  return `${studentId}__${lessonId}`;
}

// ── Visual helpers ────────────────────────────────────────────────

export function getStatusBg(status: AttendanceStatus): string {
  switch (status) {
    case "present": return "bg-emerald-500";
    case "absent": return "bg-rose-500";
    case "excused": return "bg-amber-400";
    default: return "bg-slate-200 dark:bg-slate-700";
  }
}

export function getStatusRing(status: AttendanceStatus): string {
  switch (status) {
    case "present": return "ring-2 ring-emerald-300 dark:ring-emerald-700";
    case "absent": return "ring-2 ring-rose-300 dark:ring-rose-700";
    case "excused": return "ring-2 ring-amber-300 dark:ring-amber-600";
    default: return "";
  }
}

export function getHomeworkBg(pct: number | null | undefined): string {
  if (pct == null) return "bg-slate-200 dark:bg-slate-700";
  if (pct >= 90) return "bg-emerald-500";
  if (pct >= 80) return "bg-amber-400";
  return "bg-rose-500";
}

export function getHomeworkTextColor(pct: number | null | undefined): string {
  if (pct == null) return "text-slate-400 dark:text-slate-500";
  if (pct >= 90) return "text-white";
  if (pct >= 80) return "text-white";
  return "text-white";
}

export function avatarColor(name: string): string {
  const palette = [
    "bg-indigo-500", "bg-violet-500", "bg-emerald-500", "bg-sky-500",
    "bg-rose-500", "bg-amber-500", "bg-pink-500", "bg-teal-500",
    "bg-cyan-500", "bg-orange-500",
  ];
  return palette[name.charCodeAt(0) % palette.length];
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export const SHORT_MONTHS_UZ = [
  "Yan", "Fev", "Mar", "Apr", "May", "Iyn",
  "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek",
];

export const FULL_MONTHS_UZ = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

export function formatLessonDate(dateStr: string): { day: string; month: string } {
  const d = new Date(dateStr);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: SHORT_MONTHS_UZ[d.getMonth()] ?? "",
  };
}
