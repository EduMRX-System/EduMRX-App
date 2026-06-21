"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "@/i18n";
import { getLangCookie, setLangCookie } from "@/lib/cookies";

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
      theme: "light",
      // Language comes from the shared cookie, not localStorage
      language: getLangCookie(),
      isSidebarOpen: false,
      isSidebarCollapsed: false,

      setTheme: (theme) => {
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
        set({ theme });
      },

      setLanguage: (language) => {
        // Cookie is the single source of truth (shared across subdomains)
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
      // language is intentionally excluded — it lives in the cookie
      partialize: (state) => ({
        theme: state.theme,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    },
  ),
);
