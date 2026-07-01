"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, AlertTriangle, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IStudent } from "@/types/student";
import { useStudents } from "@/hooks/useStudents";

interface Props {
  selected: IStudent[];
  onChange: (students: IStudent[]) => void;
  role?: "director" | "manager";
  branchId?: string;
  roomCapacity?: number;
}

function getName(s: IStudent): string {
  return [s.user?.first_name, s.user?.last_name].filter(Boolean).join(" ") || "—";
}

function getPhone(s: IStudent): string {
  return s.user?.phone ?? "";
}

const PAGE_SIZE = 10;

// Pagination with ellipsis: e.g. [1, 2, "…", 8, 9, 10]
function buildPages(current: number, total: number): (number | "…")[] {
  const pages: (number | "…")[] = [];
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - current) <= 1) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return pages;
}

export default function StudentMultiSelect({
  selected,
  onChange,
  role = "director",
  branchId,
  roomCapacity,
}: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(id);
  }, [search]);

  const { data, isFetching } = useStudents({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch,
    role,
    branchId,
  });

  const students = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const selectedIds = new Set(selected.map((s) => s.id));

  const toggle = (student: IStudent) => {
    if (selectedIds.has(student.id)) {
      onChange(selected.filter((s) => s.id !== student.id));
    } else {
      onChange([...selected, student]);
    }
  };

  const overBy =
    roomCapacity && selected.length > roomCapacity
      ? selected.length - roomCapacity
      : 0;

  const labelCls = "text-[14px] text-foreground-muted font-semibold";

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-1.5">
        <label className={labelCls}>{t("director.groups.students.label")}</label>
        {selected.length > 0 && (
          <span className="text-[12px] text-primary font-semibold">
            {t("director.groups.students.selected_count", { count: selected.length })}
          </span>
        )}
      </div>

      {/* Search input */}
      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-subtle pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("director.groups.students.search_placeholder")}
          className="w-full h-9 pl-9 pr-9 text-[13px] border border-border rounded-lg bg-surface text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-foreground-subtle transition-all"
        />
        {isFetching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-foreground-subtle" />
        )}
      </div>

      {/* Student list */}
      <div className="border border-border rounded-xl overflow-hidden">
        {isFetching && students.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-foreground-subtle" />
          </div>
        ) : students.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-foreground-subtle">
            {t("director.groups.students.not_found")}
          </p>
        ) : (
          students.map((student) => {
            const isSel = selectedIds.has(student.id);
            const name = getName(student);
            const phone = getPhone(student);
            return (
              <label
                key={student.id}
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-hover transition-colors border-b border-border-subtle last:border-0"
              >
                <input
                  type="checkbox"
                  checked={isSel}
                  onChange={() => toggle(student)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer shrink-0"
                />
                <div className="w-8 h-8 rounded-full bg-primary-soft text-primary text-[12px] font-bold flex items-center justify-center shrink-0 uppercase select-none">
                  {name[0] ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{name}</p>
                  <p className="text-[11px] text-foreground-subtle">{phone || "—"}</p>
                </div>
                {isSel && <Check className="w-4 h-4 text-primary shrink-0" />}
              </label>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2 px-0.5">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-1.5 rounded-lg border border-border text-foreground-muted hover:bg-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {buildPages(page, totalPages).map((item, idx) =>
              item === "…" ? (
                <span
                  key={`dots-${idx}`}
                  className="w-7 text-center text-[12px] text-foreground-subtle select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPage(item)}
                  className={`w-7 h-7 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
                    page === item
                      ? "bg-primary text-primary-fg"
                      : "text-foreground-muted hover:bg-hover"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-1.5 rounded-lg border border-border text-foreground-muted hover:bg-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Capacity warning */}
      {overBy > 0 && (
        <p className="flex items-center gap-1.5 mt-2 text-[12px] text-warning px-0.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {t("director.groups.students.over_capacity", {
            capacity: roomCapacity,
            selected: selected.length,
            over: overBy,
          })}
        </p>
      )}
    </div>
  );
}
