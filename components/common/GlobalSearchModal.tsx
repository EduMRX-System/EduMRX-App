"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, Loader2, GraduationCap, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useStudentSearch } from "@/hooks/useStudents";
import { useAuthStore } from "@/store/authStore";
import type { IStudent } from "@/types/student";
import Skeleton from "@/components/common/Skeleton";

function getName(s: IStudent): string {
  return [s.user?.first_name, s.user?.last_name].filter(Boolean).join(" ") || "—";
}

function getPhone(s: IStudent): string {
  return s.user?.phone ?? "";
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ open, onClose }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Reset and focus on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setDebouncedQuery("");
      const id = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(id);
    }
  }, [open]);

  // Debounce 350ms
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(id);
  }, [query]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const role = (user?.role === "manager" ? "manager" : "director") as
    | "director"
    | "manager";

  const { data: results = [], isFetching } = useStudentSearch(
    debouncedQuery,
    role,
  );

  const handleSelect = (student: IStudent) => {
    onClose();
    router.push(`/${role}/students/${student.id}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9998] flex items-start justify-center pt-[10vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 bg-overlay backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-[680px] max-w-[96vw] bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
        {/* Context label */}
        <div className="flex items-center gap-2 px-5 pt-4 pb-1">
          <GraduationCap className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
            {t("header.search.title")}
          </span>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-3 px-5 h-[64px] border-b border-border group focus-within:border-primary/40">
          <Search className="w-5 h-5 text-foreground-subtle group-focus-within:text-primary transition-colors shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("header.search.placeholder")}
            className="flex-1 bg-transparent text-[17px] text-foreground placeholder:text-foreground-subtle outline-none"
          />
          {isFetching && (
            <Loader2 className="w-4 h-4 animate-spin text-foreground-subtle shrink-0" />
          )}
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-hover transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[min(540px,72vh)] overflow-y-auto overscroll-contain">
          {debouncedQuery.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2.5 py-14">
              <div className="w-11 h-11 rounded-full bg-hover flex items-center justify-center">
                <Search className="w-5 h-5 text-foreground-subtle" />
              </div>
              <p className="text-[13px] text-foreground-subtle">
                {t("header.search.type_hint")}
              </p>
            </div>
          ) : isFetching && results.length === 0 ? (
            <div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle last:border-0">
                  <Skeleton variant="circle" className="w-9 h-9" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <Skeleton variant="text" className="w-32" />
                    <Skeleton variant="text" className="w-20 h-2.5" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2.5 py-14">
              <div className="w-11 h-11 rounded-full bg-hover flex items-center justify-center">
                <SearchX className="w-5 h-5 text-foreground-subtle" />
              </div>
              <p className="text-[13px] text-foreground-subtle">
                {t("header.search.not_found")}
              </p>
            </div>
          ) : (
            results.map((student) => {
              const name = getName(student);
              const phone = getPhone(student);
              const avatar = student.user?.avatar;
              const groupName =
                (student as any).group_name ?? (student as any).group ?? null;
              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => handleSelect(student)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-hover transition-colors text-left border-b border-border-subtle last:border-0"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-soft text-primary text-[13px] font-bold flex items-center justify-center shrink-0 uppercase select-none overflow-hidden">
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      name[0] ?? <GraduationCap className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground truncate">
                      {name}
                    </p>
                    <p className="text-[12px] text-foreground-subtle font-mono">
                      {phone || "—"}
                    </p>
                  </div>
                  {groupName && (
                    <span className="text-[11px] bg-primary-soft text-primary rounded-lg px-2 py-0.5 shrink-0 max-w-[130px] truncate">
                      {groupName}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
