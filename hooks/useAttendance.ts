/**
 * useAttendance — hozircha FAKE data qaytaradi.
 * API tayyor bo'lganda bu hookni real so'rovlarga almashtiriladi.
 *
 * API yo'llari (kelajak):
 *   GET director/groups/                             → guruhlar ro'yxati
 *   GET director/groups/{id}/students/               → guruh o'quvchilari
 *   GET director/groups/{id}/lessons/?month=&year=   → dars jadvali
 *   GET director/attendance/?group_id=&month=&year=  → davomat matritsa
 *   POST director/attendance/                        → saqlash
 */

import { useMemo } from "react";
import type {
  AttendanceGroup,
  AttendanceStudent,
  AttendanceLesson,
  AttendanceMap,
  AttendanceStatus,
} from "@/types/attendance";
import { attendanceKey } from "@/types/attendance";

// ── Fake Groups ───────────────────────────────────────────────────

export const FAKE_GROUPS: AttendanceGroup[] = [
  { id: "g-fe-01", name: "Frontend-01", course_name: "Frontend dasturlash", teacher_name: "Aziz Karimov" },
  { id: "g-py-02", name: "Python-02",   course_name: "Python dasturlash",   teacher_name: "Nodira Yusupova" },
  { id: "g-en-a1", name: "English-A1",  course_name: "Ingliz tili (A1)",    teacher_name: "Kamola Rahimova" },
];

// ── Fake Students ─────────────────────────────────────────────────

const FAKE_STUDENTS: Record<string, AttendanceStudent[]> = {
  "g-fe-01": [
    { id: "fe-01", name: "Alibek Toshmatov",   phone: "+998 90 123 4501" },
    { id: "fe-02", name: "Nodira Karimova",    phone: "+998 90 123 4502" },
    { id: "fe-03", name: "Jasur Rahimov",      phone: "+998 90 123 4503" },
    { id: "fe-04", name: "Malika Yusupova",    phone: "+998 90 123 4504" },
    { id: "fe-05", name: "Otabek Mirzayev",    phone: "+998 90 123 4505" },
    { id: "fe-06", name: "Zulfiya Hasanova",   phone: "+998 90 123 4506" },
    { id: "fe-07", name: "Bobur Ergashev",     phone: "+998 90 123 4507" },
    { id: "fe-08", name: "Dilorom Nazarova",   phone: "+998 90 123 4508" },
    { id: "fe-09", name: "Sanjar Qodirov",     phone: "+998 90 123 4509" },
    { id: "fe-10", name: "Gulnora Abdullayeva",phone: "+998 90 123 4510" },
  ],
  "g-py-02": [
    { id: "py-01", name: "Sherzod Normatov",   phone: "+998 91 234 5601" },
    { id: "py-02", name: "Barno Tursunova",    phone: "+998 91 234 5602" },
    { id: "py-03", name: "Ulugbek Ismoilov",   phone: "+998 91 234 5603" },
    { id: "py-04", name: "Feruza Xolmatova",   phone: "+998 91 234 5604" },
    { id: "py-05", name: "Doniyor Sobirov",    phone: "+998 91 234 5605" },
    { id: "py-06", name: "Sabohat Rajabova",   phone: "+998 91 234 5606" },
    { id: "py-07", name: "Behruz Xasanov",     phone: "+998 91 234 5607" },
    { id: "py-08", name: "Muazzam Yuldasheva", phone: "+998 91 234 5608" },
  ],
  "g-en-a1": [
    { id: "en-01", name: "Abdulaziz Qosimov",  phone: "+998 93 345 6701" },
    { id: "en-02", name: "Mahliyo Ergasheva",   phone: "+998 93 345 6702" },
    { id: "en-03", name: "Timur Sultonov",      phone: "+998 93 345 6703" },
    { id: "en-04", name: "Dilnoza Xoliqova",    phone: "+998 93 345 6704" },
    { id: "en-05", name: "Ravshan Tojiboyev",   phone: "+998 93 345 6705" },
    { id: "en-06", name: "Shahlo Inomova",      phone: "+998 93 345 6706" },
    { id: "en-07", name: "Mirzo Hasanov",       phone: "+998 93 345 6707" },
    { id: "en-08", name: "Zilola Qodirganova",  phone: "+998 93 345 6708" },
    { id: "en-09", name: "Eldor Nazarov",       phone: "+998 93 345 6709" },
    { id: "en-10", name: "Nasiba Mirzayeva",    phone: "+998 93 345 6710" },
    { id: "en-11", name: "Firdavs Umarov",      phone: "+998 93 345 6711" },
  ],
};

// ── Fake Lessons ──────────────────────────────────────────────────

const FAKE_LESSONS: Record<string, Record<string, AttendanceLesson[]>> = {
  "g-fe-01": {
    "2026-6": [
      { id: "l-fe-01", date: "2026-06-02", topic: "10.1 HTML asoslari" },
      { id: "l-fe-02", date: "2026-06-04", topic: "10.2 CSS Grid" },
      { id: "l-fe-03", date: "2026-06-06", topic: "10.3 Flexbox" },
      { id: "l-fe-04", date: "2026-06-09", topic: "Test 10" },
      { id: "l-fe-05", date: "2026-06-11", topic: "11.1 JavaScript" },
      { id: "l-fe-06", date: "2026-06-13", topic: "11.2 ES6+" },
      { id: "l-fe-07", date: "2026-06-16", topic: "11.3 DOM" },
      { id: "l-fe-08", date: "2026-06-18", topic: "Test 11" },
      { id: "l-fe-09", date: "2026-06-20", topic: "12.1 React" },
      { id: "l-fe-10", date: "2026-06-23", topic: "12.2 Hooks" },
      { id: "l-fe-11", date: "2026-06-25", topic: "12.3 State" },
      { id: "l-fe-12", date: "2026-06-27", topic: "Test 12" },
    ],
    "2026-5": [
      { id: "l-fe-m01", date: "2026-05-02", topic: "9.1 Kirish" },
      { id: "l-fe-m02", date: "2026-05-06", topic: "9.2 Terminal" },
      { id: "l-fe-m03", date: "2026-05-09", topic: "9.3 Git" },
      { id: "l-fe-m04", date: "2026-05-13", topic: "Test 9" },
      { id: "l-fe-m05", date: "2026-05-16", topic: "10.1 HTML" },
      { id: "l-fe-m06", date: "2026-05-20", topic: "10.2 CSS" },
      { id: "l-fe-m07", date: "2026-05-23", topic: "10.3 Layout" },
      { id: "l-fe-m08", date: "2026-05-27", topic: "Test 10" },
      { id: "l-fe-m09", date: "2026-05-30", topic: "11.1 JS" },
    ],
  },
  "g-py-02": {
    "2026-6": [
      { id: "l-py-01", date: "2026-06-03", topic: "5.1 Ro'yxatlar" },
      { id: "l-py-02", date: "2026-06-05", topic: "5.2 Lug'atlar" },
      { id: "l-py-03", date: "2026-06-10", topic: "5.3 To'plamlar" },
      { id: "l-py-04", date: "2026-06-12", topic: "Test 5" },
      { id: "l-py-05", date: "2026-06-17", topic: "6.1 Funksiyalar" },
      { id: "l-py-06", date: "2026-06-19", topic: "6.2 Lambda" },
      { id: "l-py-07", date: "2026-06-24", topic: "6.3 Dekoratorlar" },
      { id: "l-py-08", date: "2026-06-26", topic: "Test 6" },
    ],
    "2026-5": [
      { id: "l-py-m01", date: "2026-05-05", topic: "4.1 Tsikllar" },
      { id: "l-py-m02", date: "2026-05-07", topic: "4.2 Shart" },
      { id: "l-py-m03", date: "2026-05-12", topic: "4.3 Rekursiya" },
      { id: "l-py-m04", date: "2026-05-14", topic: "Test 4" },
      { id: "l-py-m05", date: "2026-05-19", topic: "5.1 Ro'yxat" },
      { id: "l-py-m06", date: "2026-05-21", topic: "5.2 Tuple" },
      { id: "l-py-m07", date: "2026-05-26", topic: "5.3 Dict" },
      { id: "l-py-m08", date: "2026-05-28", topic: "Test 5" },
    ],
  },
  "g-en-a1": {
    "2026-6": [
      { id: "l-en-01", date: "2026-06-01", topic: "U7 Vocabulary" },
      { id: "l-en-02", date: "2026-06-03", topic: "U7 Grammar" },
      { id: "l-en-03", date: "2026-06-06", topic: "U7 Reading" },
      { id: "l-en-04", date: "2026-06-08", topic: "U7 Listening" },
      { id: "l-en-05", date: "2026-06-10", topic: "U7 Speaking" },
      { id: "l-en-06", date: "2026-06-13", topic: "Test U7" },
      { id: "l-en-07", date: "2026-06-15", topic: "U8 Vocab" },
      { id: "l-en-08", date: "2026-06-20", topic: "U8 Grammar" },
      { id: "l-en-09", date: "2026-06-22", topic: "U8 Reading" },
      { id: "l-en-10", date: "2026-06-27", topic: "U8 Writing" },
      { id: "l-en-11", date: "2026-06-29", topic: "Test U8" },
    ],
    "2026-5": [
      { id: "l-en-m01", date: "2026-05-04", topic: "U5 Vocab" },
      { id: "l-en-m02", date: "2026-05-06", topic: "U5 Grammar" },
      { id: "l-en-m03", date: "2026-05-11", topic: "U5 Reading" },
      { id: "l-en-m04", date: "2026-05-13", topic: "Test U5" },
      { id: "l-en-m05", date: "2026-05-18", topic: "U6 Vocab" },
      { id: "l-en-m06", date: "2026-05-20", topic: "U6 Grammar" },
      { id: "l-en-m07", date: "2026-05-25", topic: "U6 Speaking" },
      { id: "l-en-m08", date: "2026-05-27", topic: "Test U6" },
    ],
  },
};

// ── Deterministic fake attendance ─────────────────────────────────
// Realistic distribution: ~70% present, ~12% absent, ~8% excused, ~10% null

const STATUS_POOL: AttendanceStatus[] = [
  "present", "present", "present", "present", "present", "present", "present",
  "absent",  "absent",
  "excused",
  null,      null,
];

const HOMEWORK_POOL: (number | null)[] = [100, 100, 95, 90, 85, 80, 75, 60, null, null];
const REASON_POOL = ["sick", "family", "transport", "unexcused", "permitted"];

function buildFakeAttendance(
  students: AttendanceStudent[],
  lessons: AttendanceLesson[],
): AttendanceMap {
  const map: AttendanceMap = {};
  students.forEach((s, si) => {
    lessons.forEach((l, li) => {
      const key = attendanceKey(s.id, l.id);
      const status = STATUS_POOL[(si * 7 + li * 3 + si + li) % STATUS_POOL.length];
      const hwPct = status !== null ? HOMEWORK_POOL[(si * 5 + li * 4) % HOMEWORK_POOL.length] : null;
      map[key] = {
        status,
        homework_percent: hwPct,
        reason: status === "excused" || status === "absent"
          ? REASON_POOL[(si + li) % REASON_POOL.length]
          : undefined,
      };
    });
  });
  return map;
}

// ── Exported hooks ────────────────────────────────────────────────

export function useFakeGroups(): AttendanceGroup[] {
  return FAKE_GROUPS;
}

export function useFakeStudents(groupId: string): AttendanceStudent[] {
  return useMemo(() => FAKE_STUDENTS[groupId] ?? [], [groupId]);
}

export function useFakeLessons(groupId: string, month: number, year: number): AttendanceLesson[] {
  return useMemo(() => {
    const key = `${year}-${month}`;
    return FAKE_LESSONS[groupId]?.[key] ?? [];
  }, [groupId, month, year]);
}

export function buildInitialAttendance(
  students: AttendanceStudent[],
  lessons: AttendanceLesson[],
): AttendanceMap {
  return buildFakeAttendance(students, lessons);
}
