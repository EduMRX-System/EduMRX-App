"use client";

import { create } from "zustand";
import axios from "axios";

interface Tokens {
  access_token: string;
  refresh_token: string;
}

interface User {
  id: string;
  phone: string;
  email: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  avatar: string | null;
  is_active: boolean;
  is_staff: boolean;
}

interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (user: User, tokens: Tokens) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

// ─── Cookie helpers ───────────────────────────────────────
const COOKIE_DOMAIN = ".edumrx.uz";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 kun

function setCookie(name: string, value: string) {
  const isLocal = window.location.hostname.includes("localhost");
  const cookieOptions = isLocal
    ? `path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
    : `path=/; domain=.edumrx.uz; secure; samesite=none; max-age=${COOKIE_MAX_AGE}`;
  document.cookie = `${name}=${encodeURIComponent(value)}; ${cookieOptions}`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name: string) {
  const isLocal =
    typeof window !== "undefined" &&
    window.location.hostname.includes("localhost");
  const domainPart = isLocal ? "" : `domain=${COOKIE_DOMAIN}; `;
  document.cookie = `${name}=; path=/; ${domainPart}max-age=0`;
}

function clearAuthCookies() {
  deleteCookie("access_token");
  deleteCookie("refresh_token");
  deleteCookie("user");
}
// ─────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isInitialized: false,

  login: (user, tokens) => {
    setCookie("access_token", tokens.access_token);
    setCookie("refresh_token", tokens.refresh_token);
    setCookie("user", JSON.stringify(user));

    set({ user, tokens, isAuthenticated: true, isInitialized: true });
  },

  logout: () => {
    clearAuthCookies();
    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isInitialized: true,
    });
    window.location.href = "https://edumrx.uz/login";
  },

  initAuth: async () => {
    if (typeof window === "undefined") return;
    if (get().isInitialized) return;

    const access_token = getCookie("access_token");
    const refresh_token = getCookie("refresh_token");

    if (!access_token) {
      set({ isInitialized: true, isAuthenticated: false, user: null });
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DataBaseURL}/me/`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const tokens: Tokens = {
        access_token,
        refresh_token: refresh_token ?? "",
      };

      set({
        user: response.data,
        tokens,
        isAuthenticated: true,
        isInitialized: true,
      });
    } catch (error: any) {
      console.error("Auth initialization error:", error);

      if (!error.response) {
        console.warn("Backend serverga ulanib bo'lmadi.");
        set({ isInitialized: true, isAuthenticated: false, user: null });
        return;
      }

      if (error.response.status === 401 || error.response.status === 403) {
        clearAuthCookies();
      }

      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    }
  },
}));
