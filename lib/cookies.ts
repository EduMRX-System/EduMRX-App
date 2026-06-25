const PROD_DOMAIN = ".edumrx.uz";
const LOCAL_DOMAIN = ".localhost";
const SHARED_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

// ─── Generic read ─────────────────────────────────────────
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

// ─── Shared cookie options (prod vs localhost) ────────────
function sharedOpts(maxAge = SHARED_MAX_AGE): string {
  if (typeof window === "undefined") return "";
  const isLocal = window.location.hostname.includes("localhost");
  return isLocal
    ? `path=/; domain=${LOCAL_DOMAIN}; max-age=${maxAge}; samesite=lax`
    : `path=/; domain=${PROD_DOMAIN}; secure; samesite=none; max-age=${maxAge}`;
}

function deleteOpts(): string {
  if (typeof window === "undefined") return "";
  const isLocal = window.location.hostname.includes("localhost");
  const domain = isLocal ? LOCAL_DOMAIN : PROD_DOMAIN;
  return `path=/; domain=${domain}; max-age=0`;
}

// ─── Auth cookie cleanup ──────────────────────────────────
export function clearAuthCookies() {
  if (typeof document === "undefined") return;
  ["access_token", "refresh_token", "user"].forEach((name) => {
    document.cookie = `${name}=; ${deleteOpts()}`;
  });
}

// ─── Language cookie ──────────────────────────────────────
export function getLangCookie(): string {
  return getCookie("lang") ?? "uz";
}

export function setLangCookie(lang: string): void {
  if (typeof window === "undefined") return;
  document.cookie = `lang=${encodeURIComponent(lang)}; ${sharedOpts()}`;
}

export function deleteLangCookie(): void {
  if (typeof window === "undefined") return;
  document.cookie = `lang=; ${deleteOpts()}`;
}

// ─── Theme cookie ─────────────────────────────────────────
export function getThemeCookie(): "light" | "dark" {
  return getCookie("theme") === "dark" ? "dark" : "light";
}

export function setThemeCookie(theme: "light" | "dark"): void {
  if (typeof window === "undefined") return;
  document.cookie = `theme=${theme}; ${sharedOpts()}`;
}

export function deleteThemeCookie(): void {
  if (typeof window === "undefined") return;
  document.cookie = `theme=; ${deleteOpts()}`;
}

// ─── Active Center cookie ─────────────────────────────────
export function getActiveCenterCookie(): string | null {
  return getCookie("active_center");
}

export function setActiveCenterCookie(id: string): void {
  if (typeof window === "undefined") return;
  document.cookie = `active_center=${encodeURIComponent(id)}; ${sharedOpts()}`;
}

export function deleteActiveCenterCookie(): void {
  if (typeof window === "undefined") return;
  document.cookie = `active_center=; ${deleteOpts()}`;
}

// ─── Active Branch cookie ─────────────────────────────────
export function getActiveBranchCookie(): string | null {
  return getCookie("active_branch");
}

export function setActiveBranchCookie(id: string): void {
  if (typeof window === "undefined") return;
  document.cookie = `active_branch=${encodeURIComponent(id)}; ${sharedOpts()}`;
}

export function deleteActiveBranchCookie(): void {
  if (typeof window === "undefined") return;
  document.cookie = `active_branch=; ${deleteOpts()}`;
}
