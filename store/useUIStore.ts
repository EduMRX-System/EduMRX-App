"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "@/i18n";
import { getLangCookie, setLangCookie, getThemeCookie, setThemeCookie } from "@/lib/cookies";

interface UIState {
  theme: "light" | "dark";
  language: string;
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;

  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (lang: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Both theme and language come from shared cookies (not localStorage)
      theme: getThemeCookie(),
      language: getLangCookie(),
      isSidebarOpen: false,
      isSidebarCollapsed: false,

      setTheme: (theme) => {
        setThemeCookie(theme);
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
        set({ theme });
      },

      setLanguage: (language) => {
        setLangCookie(language);
        i18n.changeLanguage(language);
        if (typeof window !== "undefined") {
          document.documentElement.lang = language;
        }
        set({ language });
      },

      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      setSidebarCollapsed: (isCollapsed) => set({ isSidebarCollapsed: isCollapsed }),
    }),
    {
      name: "ui-storage",
      // Only isSidebarCollapsed lives in localStorage; theme/language are in cookies
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
      // Custom merge: only apply isSidebarCollapsed from old localStorage data.
      // Prevents stale theme/language values from a previous localStorage entry
      // from overwriting the cookie-based initial values.
      merge: (persistedState, currentState) => ({
        ...currentState,
        isSidebarCollapsed:
          (persistedState as Partial<UIState>)?.isSidebarCollapsed ??
          currentState.isSidebarCollapsed,
      }),
    },
  ),
);
