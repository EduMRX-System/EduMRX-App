"use client";

import { useEffect, useRef } from "react";

/** Reads a saved draft for `key`, or null if none exists / sessionStorage is unavailable. */
export function getFormDraft<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearFormDraft(key: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(key);
}

/**
 * Persists `values` to sessionStorage (debounced) so a form modal closed without
 * submitting can restore its unsaved input on reopen. Pass `key: null` to disable,
 * e.g. while the modal is closed.
 */
export function useFormDraftSave<T>(key: string | null, values: T, debounceMs = 400): void {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!key) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        sessionStorage.setItem(key, JSON.stringify(values));
      } catch {
        // best-effort — ignore quota/availability errors
      }
    }, debounceMs);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, JSON.stringify(values), debounceMs]);
}
