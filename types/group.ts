export type GroupStatus = "active" | "inactive" | "completed";

// GET /api/v1/director/courses/  (DRF pagination) — "courses" = guruhlar
export interface Group {
  id: string;
  name: string;
  course: string; // FK id
  course_name: string;
  teacher: string; // FK id
  teacher_name: string;
  room: string; // FK id
  room_name: string;
  status: GroupStatus;
  student_count: number;
  start_date: string; // "2026-06-20"
  end_date: string;
  lesson_days: string; // GET'da string qaytadi
  lesson_start_time: string; // "08:21:42.965Z"
  lesson_end_time: string;
}

export interface GroupsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Group[];
}

// POST / PATCH payload
export interface GroupPayload {
  name: string;
  course: string;
  teacher: string;
  room: string;
  status: GroupStatus;
  start_date: string;
  end_date: string;
  lesson_days: number[]; // [1,3,5]
  lesson_start_time: string; // "HH:MM"
  lesson_end_time: string;
  center?: string;
  branch?: string;
}

export const STATUS_OPTIONS: {
  value: GroupStatus;
  label: string;
  color: string;
}[] = [
  { value: "active", label: "Faol", color: "bg-emerald-500" },
  { value: "inactive", label: "Nofaol", color: "bg-rose-500" },
  { value: "completed", label: "Tugagan", color: "bg-blue-500" },
];

// Backend hafta kun raqamlari (1=Du ... 7=Ya). Agar 0-6 bo'lsa — value'larni moslang.
export const WEEKDAYS: { value: number; short: string; full: string }[] = [
  { value: 1, short: "Du", full: "Dushanba" },
  { value: 2, short: "Se", full: "Seshanba" },
  { value: 3, short: "Ch", full: "Chorshanba" },
  { value: 4, short: "Pa", full: "Payshanba" },
  { value: 5, short: "Ju", full: "Juma" },
  { value: 6, short: "Sha", full: "Shanba" },
  { value: 7, short: "Ya", full: "Yakshanba" },
];

// "08:21:42.965Z" / "08:21" -> "08:21"
export function toHHMM(raw?: string | null): string {
  if (!raw) return "";
  return raw.slice(0, 5);
}

// GET lesson_days (string) -> number[]  (masalan "1,3,5")
export function parseLessonDays(raw?: string | number[] | null): number[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return raw
    .split(",")
    .map((p) => Number(p.trim()))
    .filter((n) => !Number.isNaN(n));
}

export function lessonDaysLabel(days: number[]): string {
  return days
    .map((d) => WEEKDAYS.find((w) => w.value === d)?.short)
    .filter(Boolean)
    .join(", ");
}
