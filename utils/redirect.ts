export const ROLE_SUBDOMAIN: Record<string, string> = {
  director: "director",
  admin: "manager",       // backend "admin" = manager paneli
  manager: "manager",
  teacher: "teacher",
  student_user: "student",
  student: "student",
  parent: "parent",
  super_admin: "admin",   // super admin paneli (agar mavjud bo'lsa)
};

export function getSubdomainUrl(subdomain: string): string {
  const isLocal =
    typeof window !== "undefined" &&
    window.location.hostname.includes("localhost");
  return isLocal
    ? `http://${subdomain}.localhost:3000`
    : `https://${subdomain}.edumrx.uz`;
}

/** role → subdomain URL. Agar rol noma'lum bo'lsa null qaytaradi. */
export function getUrlForRole(role: string | undefined | null): string | null {
  if (!role || typeof role !== "string") return null;
  const normalized = role.toLowerCase().trim();
  const sub: string | undefined = ROLE_SUBDOMAIN[normalized] ?? ROLE_SUBDOMAIN[role.trim()];
  if (!sub || typeof sub !== "string") return null;
  return getSubdomainUrl(sub);
}

export function getCookieOptions(): string {
  const isLocal =
    typeof window !== "undefined" && window.location.hostname.includes("localhost");
  const maxAge = 7 * 24 * 60 * 60;
  return isLocal
    ? `path=/; max-age=${maxAge}; samesite=lax`
    : `path=/; domain=.edumrx.uz; secure; samesite=none; max-age=${maxAge}`;
}