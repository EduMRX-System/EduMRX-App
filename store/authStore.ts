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
  center_ids?: string[];
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

    // activeCenter ni me/ center_ids[0] dan initialize qil
    if (user.center_ids?.length) {
      import("@/store/activeCenterStore").then(({ useActiveCenterStore }) => {
        useActiveCenterStore.getState().initFromIds(user.center_ids!);
      });
    }
  },

  logout: () => {
    clearAuthCookies();
    // Lazy import to avoid circular dependency
    import("@/store/activeCenterStore").then(({ useActiveCenterStore }) => {
      useActiveCenterStore.getState().reset();
    });
    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isInitialized: true,
    });
    const isLocal =
      typeof window !== "undefined" &&
      window.location.hostname.includes("localhost");
    window.location.href = isLocal
      ? "http://login.localhost:3000"
      : "https://login.edumrx.uz";
  },

  initAuth: async () => {
    if (typeof window === "undefined") return;
    if (get().isInitialized) return;

    const access_token = getCookie("access_token");
    const refresh_token = getCookie("refresh_token");

    if (!access_token && !refresh_token) {
      set({ isInitialized: true, isAuthenticated: false, user: null });
      return;
    }

    const BASE = process.env.NEXT_PUBLIC_DataBaseURL;

    const fetchMe = async (token: string) => {
      const res = await axios.get(`${BASE}/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    };

    // 1. access_token bilan me/ ga urinib ko'r
    if (access_token) {
      try {
        const userData = await fetchMe(access_token);
        set({
          user: userData,
          tokens: { access_token, refresh_token: refresh_token ?? "" },
          isAuthenticated: true,
          isInitialized: true,
        });
        // activeCenter ni me/ center_ids[0] dan initialize qil
        if (userData.center_ids?.length) {
          const { useActiveCenterStore } = await import("@/store/activeCenterStore");
          useActiveCenterStore.getState().initFromIds(userData.center_ids);
        }
        return;
      } catch (err: any) {
        if (!err.response) {
          // Network xatosi — token mavjud deb hisoblaymiz, lekin serverga yetib bormadi
          set({ isInitialized: true, isAuthenticated: false, user: null });
          return;
        }
        // 401/403 → refresh token bilan urinib ko'ramiz (quyida)
        if (err.response.status !== 401 && err.response.status !== 403) {
          set({ isInitialized: true, isAuthenticated: false, user: null });
          return;
        }
      }
    }

    // 2. refresh_token bilan yangi access_token olamiz
    if (refresh_token) {
      try {
        const refreshRes = await axios.post(`${BASE}/auth/token/refresh/`, {
          refresh: refresh_token,
        });
        const newAccessToken: string =
          refreshRes.data.access ?? refreshRes.data.access_token;

        setCookie("access_token", newAccessToken);
        const userData = await fetchMe(newAccessToken);

        set({
          user: userData,
          tokens: { access_token: newAccessToken, refresh_token },
          isAuthenticated: true,
          isInitialized: true,
        });
        // activeCenter ni me/ center_ids[0] dan initialize qil
        if (userData.center_ids?.length) {
          const { useActiveCenterStore } = await import("@/store/activeCenterStore");
          useActiveCenterStore.getState().initFromIds(userData.center_ids);
        }
        return;
      } catch {
        // refresh ham ishlamadi — cookie'larni tozalaymiz
      }
    }

    clearAuthCookies();
    set({ user: null, tokens: null, isAuthenticated: false, isInitialized: true });
  },
}));
