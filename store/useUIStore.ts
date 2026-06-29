"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "@/i18n";
import {
  getLangCookie, setLangCookie,
  getThemeCookie, setThemeCookie,
  getAccentThemeCookie, setAccentThemeCookie,
  getDatePickerModeCookie, setDatePickerModeCookie,
  type AccentTheme,
  type DatePickerMode,
} from "@/lib/cookies";

interface UIState {
  theme: "light" | "dark";
  accentTheme: AccentTheme;
  datePickerMode: DatePickerMode;
  language: string;
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;

  setTheme: (theme: "light" | "dark") => void;
  setAccentTheme: (accent: AccentTheme) => void;
  setDatePickerMode: (mode: DatePickerMode) => void;
  setLanguage: (lang: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: getThemeCookie(),
      accentTheme: getAccentThemeCookie(),
      datePickerMode: getDatePickerModeCookie(),
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

      setAccentTheme: (accent) => {
        setAccentThemeCookie(accent);
        if (typeof window !== "undefined") {
          document.documentElement.setAttribute("data-theme", accent);
        }
        set({ accentTheme: accent });
      },

      setDatePickerMode: (mode) => {
        setDatePickerModeCookie(mode);
        set({ datePickerMode: mode });
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
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        isSidebarCollapsed:
          (persistedState as Partial<UIState>)?.isSidebarCollapsed ??
          currentState.isSidebarCollapsed,
      }),
    },
  ),
);
