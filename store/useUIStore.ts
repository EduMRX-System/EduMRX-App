"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "@/i18n";
import {
  getLangCookie, setLangCookie,
  getThemeCookie, setThemeCookie,
  getAccentThemeCookie, setAccentThemeCookie,
  getDatePickerModeCookie, setDatePickerModeCookie,
  getDatePickerVariantCookie, setDatePickerVariantCookie,
  getModalVariantCookie, setModalVariantCookie,
  type AccentTheme,
  type DatePickerMode,
  type DatePickerVariant,
  type ModalVariant,
} from "@/lib/cookies";

interface UIState {
  theme: "light" | "dark";
  accentTheme: AccentTheme;
  datePickerMode: DatePickerMode;
  datePickerVariant: DatePickerVariant;
  modalVariant: ModalVariant;
  language: string;
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  groupViewMode: "grid" | "list";

  setTheme: (theme: "light" | "dark") => void;
  setAccentTheme: (accent: AccentTheme) => void;
  setDatePickerMode: (mode: DatePickerMode) => void;
  setDatePickerVariant: (variant: DatePickerVariant) => void;
  setModalVariant: (variant: ModalVariant) => void;
  setLanguage: (lang: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;
  setGroupViewMode: (mode: "grid" | "list") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: getThemeCookie(),
      accentTheme: getAccentThemeCookie(),
      datePickerMode: getDatePickerModeCookie(),
      datePickerVariant: getDatePickerVariantCookie(),
      modalVariant: getModalVariantCookie(),
      language: getLangCookie(),
      isSidebarOpen: false,
      isSidebarCollapsed: false,
      groupViewMode: "grid" as const,

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

      setDatePickerVariant: (variant) => {
        setDatePickerVariantCookie(variant);
        set({ datePickerVariant: variant });
      },

      setModalVariant: (variant) => {
        setModalVariantCookie(variant);
        set({ modalVariant: variant });
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
      setGroupViewMode: (mode) => set({ groupViewMode: mode }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        isSidebarCollapsed: state.isSidebarCollapsed,
        groupViewMode: state.groupViewMode,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        isSidebarCollapsed:
          (persistedState as Partial<UIState>)?.isSidebarCollapsed ??
          currentState.isSidebarCollapsed,
        groupViewMode:
          (persistedState as Partial<UIState>)?.groupViewMode ??
          currentState.groupViewMode,
      }),
    },
  ),
);
