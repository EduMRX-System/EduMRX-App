"use client";

import { useState } from "react";
import {
  type AttendanceStudent,
  type AttendanceLesson,
  type AttendanceMap,
  type AttendanceMark,
  type ViewMode,
  attendanceKey,
  avatarColor,
  initials,
  formatLessonDate,
} from "@/types/attendance";

function isLessonFuture(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d > today;
}
import AttendanceCell from "./AttendanceCell";
import ReasonPopover from "./ReasonPopover";
import HomeworkPopover from "./HomeworkPopover";

interface ActiveCell {
  studentId: string;
  lessonId: string;
}

interface Props {
  students: AttendanceStudent[];
  lessons: AttendanceLesson[];
  attendanceMap: AttendanceMap;
  mode: ViewMode;
  onUpdate: (key: string, mark: AttendanceMark) => void;
}

function Avatar({ name }: { name: string }) {
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${avatarColor(name)}`}>
      {initials(name)}
    </div>
  );
}

function LessonHeader({ lesson }: { lesson: AttendanceLesson }) {
  const { day, month } = formatLessonDate(lesson.date);
  const topicShort = lesson.topic.length > 6 ? lesson.topic.slice(0, 6) : lesson.topic;
  const future = isLessonFuture(lesson.date);

  return (
    <th
      className={`sticky top-0 z-20 bg-surface px-0 py-0 border-b border-r border-border-subtle min-w-[48px] w-[48px] ${future ? "opacity-40" : ""}`}
      title={`${day} ${month} — ${lesson.topic}${future ? " (hali bo'lmagan)" : ""}`}
    >
      <div className="flex flex-col items-center justify-center py-2 gap-0">
        <span className="text-[13px] font-bold text-foreground leading-none">{day}</span>
        <span className="text-[10px] text-foreground-subtle dark:text-foreground-muted leading-none mt-0.5">{month}</span>
        <span className="text-[9px] text-foreground-subtle dark:text-foreground-subtle leading-none mt-1 px-0.5 text-center truncate w-full">{topicShort}</span>
      </div>
    </th>
  );
}

function StatSummary({ students, lessons, attendanceMap, mode }: {
  students: AttendanceStudent[];
  lessons: AttendanceLesson[];
  attendanceMap: AttendanceMap;
  mode: ViewMode;
}) {
  if (!lessons.length || !students.length) return null;

  if (mode === "attendance") {
    const total = students.length * lessons.length;
    const present = Object.values(attendanceMap).filter((m) => m.status === "present").length;
    const absent = Object.values(attendanceMap).filter((m) => m.status === "absent").length;
    const excused = Object.values(attendanceMap).filter((m) => m.status === "excused").length;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;

    return (
      <div className="flex flex-wrap gap-3 px-4 py-2 bg-hover/50 border-t border-border-subtle text-[12px]">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-success" /><span className="text-foreground-muted font-medium">Keldi: <b>{present}</b></span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-danger" /><span className="text-foreground-muted font-medium">Kelmadi: <b>{absent}</b></span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-warning" /><span className="text-foreground-muted font-medium">Sababli: <b>{excused}</b></span></div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-foreground-subtle dark:text-foreground-muted">Davomat:</span>
          <span className={`font-bold ${pct >= 80 ? "text-success" : pct >= 60 ? "text-warning" : "text-danger"}`}>{pct}%</span>
        </div>
      </div>
    );
  }

  const marks = Object.values(attendanceMap).filter((m) => m.homework_percent != null);
  const avg = marks.length > 0 ? Math.round(marks.reduce((s, m) => s + (m.homework_percent ?? 0), 0) / marks.length) : null;

  return (
    <div className="flex flex-wrap gap-3 px-4 py-2 bg-hover/50 border-t border-border-subtle text-[12px]">
      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-success" /><span className="text-foreground-muted">90–100%</span></div>
      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-warning" /><span className="text-foreground-muted">80–89%</span></div>
      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-danger" /><span className="text-foreground-muted">0–79%</span></div>
      {avg != null && (
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-foreground-subtle dark:text-foreground-muted">O'rtacha:</span>
          <span className={`font-bold ${avg >= 80 ? "text-success" : avg >= 60 ? "text-warning" : "text-danger"}`}>{avg}%</span>
        </div>
      )}
    </div>
  );
}

export default function AttendanceGrid({ students, lessons, attendanceMap, mode, onUpdate }: Props) {
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);

  if (!students.length) {
    return (
      <div className="flex items-center justify-center py-20 text-foreground-subtle dark:text-foreground-subtle text-sm">
        O'quvchilar topilmadi
      </div>
    );
  }

  if (!lessons.length) {
    return (
      <div className="flex items-center justify-center py-20 text-foreground-subtle dark:text-foreground-subtle text-sm">
        Bu oyda dars mavjud emas
      </div>
    );
  }

  const activeStudent = activeCell ? students.find((s) => s.id === activeCell.studentId) : null;
  const activeLesson  = activeCell ? lessons.find((l) => l.id === activeCell.lessonId)  : null;
  const activeMark    = activeCell ? attendanceMap[attendanceKey(activeCell.studentId, activeCell.lessonId)] : undefined;

  function handleCellClick(studentId: string, lessonId: string, lessonDate: string) {
    if (isLessonFuture(lessonDate)) return;
    setActiveCell({ studentId, lessonId });
  }

  function handleSaveAttendance(status: import("@/types/attendance").AttendanceStatus, reason?: string) {
    if (!activeCell) return;
    const key = attendanceKey(activeCell.studentId, activeCell.lessonId);
    const existing = attendanceMap[key] ?? {};
    onUpdate(key, { ...existing, status, reason });
    setActiveCell(null);
  }

  function handleSaveHomework(percent: number | null) {
    if (!activeCell) return;
    const key = attendanceKey(activeCell.studentId, activeCell.lessonId);
    const existing = attendanceMap[key] ?? {};
    onUpdate(key, { ...existing, homework_percent: percent });
    setActiveCell(null);
  }

  // Per-student stat helpers
  function studentStats(student: AttendanceStudent) {
    const marks = lessons.map((l) => attendanceMap[attendanceKey(student.id, l.id)]);
    if (mode === "attendance") {
      const total = marks.filter((m) => m?.status != null).length;
      const present = marks.filter((m) => m?.status === "present").length;
      const pct = total > 0 ? Math.round((present / total) * 100) : null;
      return pct != null ? `${pct}%` : null;
    } else {
      const hw = marks.filter((m) => m?.homework_percent != null);
      if (!hw.length) return null;
      const avg = Math.round(hw.reduce((s, m) => s + (m?.homework_percent ?? 0), 0) / hw.length);
      return `${avg}%`;
    }
  }

  return (
    <>
      <div className="relative  overflow-auto rounded-xl border border-border-subtle bg-surface" style={{ maxHeight: "calc(100vh - 300px)" }}>
        <table className="w-full border-separate border-spacing-0 text-sm" style={{ minWidth: `${220 + lessons.length * 48}px` }}>
          <thead>
            <tr>
              {/* Corner cell */}
              <th className="sticky top-0 left-0 z-30 bg-surface border-b border-r border-border-subtle w-[220px] min-w-[220px]">
                <div className="px-4 py-3 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider text-left">
                  O'quvchi
                </div>
              </th>
              {/* Lesson date headers */}
              {lessons.map((lesson) => (
                <LessonHeader key={lesson.id} lesson={lesson} />
              ))}
              {/* Stat column header */}
              <th className="sticky top-0 z-20 bg-surface border-b border-l border-border-subtle min-w-[52px] w-[52px] px-1 py-2">
                <div className="text-[10px] text-center font-semibold text-foreground-subtle dark:text-foreground-muted uppercase">Jami</div>
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, si) => (
              <tr key={student.id} className="group/row">
                {/* Sticky student name cell */}
                <td className="sticky left-0 z-10 bg-surface border-b border-r border-border-subtle px-3 py-2 group-hover/row:bg-primary-soft/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-foreground-subtle dark:text-foreground-muted font-medium w-4 shrink-0 text-right">{si + 1}</span>
                    <Avatar name={student.name} />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-foreground truncate leading-tight">{student.name}</div>
                      {student.phone && <div className="text-[10px] text-foreground-subtle truncate">{student.phone}</div>}
                    </div>
                  </div>
                </td>

                {/* Attendance cells */}
                {lessons.map((lesson) => {
                  const key = attendanceKey(student.id, lesson.id);
                  const mark = attendanceMap[key];
                  const future = isLessonFuture(lesson.date);
                  return (
                    <td
                      key={lesson.id}
                      className={`border-b border-r border-border-subtle/50 p-0 text-center transition-colors ${future ? "" : "group-hover/row:bg-primary-soft/20"}`}
                    >
                      <div className="flex items-center justify-center p-1">
                        <AttendanceCell
                          mark={mark}
                          mode={mode}
                          disabled={future}
                          onClick={() => handleCellClick(student.id, lesson.id, lesson.date)}
                        />
                      </div>
                    </td>
                  );
                })}

                {/* Stat cell */}
                <td className="border-b border-l border-border-subtle px-1 py-2 text-center group-hover/row:bg-primary-soft/20 transition-colors">
                  {(() => {
                    const stat = studentStats(student);
                    if (!stat) return <span className="text-[11px] text-foreground-subtle">—</span>;
                    const num = parseInt(stat);
                    const color = num >= 80 ? "text-success" : num >= 60 ? "text-warning" : "text-danger";
                    return <span className={`text-[11px] font-bold ${color}`}>{stat}</span>;
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary bar */}
      <StatSummary students={students} lessons={lessons} attendanceMap={attendanceMap} mode={mode} />

      {/* Modals */}
      {activeCell && activeStudent && activeLesson && mode === "attendance" && (
        <ReasonPopover
          initialStatus={activeMark?.status}
          initialReason={activeMark?.reason}
          studentName={activeStudent.name}
          lessonTopic={activeLesson.topic}
          onSave={handleSaveAttendance}
          onClose={() => setActiveCell(null)}
        />
      )}
      {activeCell && activeStudent && activeLesson && mode === "homework" && (
        <HomeworkPopover
          initialPercent={activeMark?.homework_percent}
          studentName={activeStudent.name}
          lessonTopic={activeLesson.topic}
          onSave={handleSaveHomework}
          onClose={() => setActiveCell(null)}
        />
      )}
    </>
  );
}
