const COOKIE_DOMAIN = ".edumrx.uz";
const LANG_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

// ─── Generic helper ──────────────────────────────────────
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

// ─── Auth cookie cleanup (used by logout flows) ──────────
export function clearAuthCookies() {
  const isLocal =
    typeof window !== "undefined" &&
    window.location.hostname.includes("localhost");
  const domainPart = isLocal ? "" : `domain=${COOKIE_DOMAIN}; `;
  ["access_token", "refresh_token", "user"].forEach((name) => {
    document.cookie = `${name}=; path=/; ${domainPart}max-age=0`;
  });
}

// ─── Language cookie (shared across subdomains) ──────────
export function getLangCookie(): string {
  return getCookie("lang") ?? "uz";
}

export function setLangCookie(lang: string): void {
  if (typeof window === "undefined") return;
  const isLocal = window.location.hostname.includes("localhost");
  const opts = isLocal
    ? `path=/; max-age=${LANG_MAX_AGE}; samesite=lax`
    : `path=/; domain=${COOKIE_DOMAIN}; secure; samesite=none; max-age=${LANG_MAX_AGE}`;
  document.cookie = `lang=${encodeURIComponent(lang)}; ${opts}`;
}

export function deleteLangCookie(): void {
  if (typeof window === "undefined") return;
  const isLocal = window.location.hostname.includes("localhost");
  const domainPart = isLocal ? "" : `domain=${COOKIE_DOMAIN}; `;
  document.cookie = `lang=; path=/; ${domainPart}max-age=0`;
}
