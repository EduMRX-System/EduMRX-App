import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isTokenValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(padded));
    if (!payload.exp) return true;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

const SUBDOMAIN_ROLE_MAP: Record<string, string> = {
  director: "director",
  manager: "manager",
  teacher: "teacher",
  student: "student",
  parent: "parent",
};

function getSubdomain(host: string): string | null {
  const hostname = host.split(":")[0];
  if (hostname.endsWith(".localhost")) {
    return hostname.replace(".localhost", "") || null;
  }
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return null;
  }
  const parts = hostname.split(".");
  if (parts.length >= 3) return parts[0];
  return null;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  const subdomain = getSubdomain(host);
  const token = request.cookies.get("access_token")?.value;
  const validToken = token ? isTokenValid(token) : false;

  // Token query param bilan kelyapti (TokenSync o'qiydi) — aralashmaymiz
  const hasTokenParam = request.nextUrl.searchParams.has("at");

  // ═══════════════════════════════════════════════════
  // 1. LOGIN subdomain (login.edumrx.uz / login.localhost)
  // ═══════════════════════════════════════════════════
  if (subdomain === "login") {
    // /staff → staff login, / → student login (URL o'zgarmaydi, rewrite)
    // Eslatma: token bor bo'lsa ham bu yerda redirect qilmaymiz —
    // login sahifasi o'zi (frontend) kerakli dashboardga yuboradi.
    // Bu loop oldini oladi.
    if (pathname === "/staff") {
      return NextResponse.rewrite(new URL("/staff-login", request.url));
    }
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // ═══════════════════════════════════════════════════
  // 2. Subdomain emas (edumrx.uz, localhost) → marketing sayt
  // ═══════════════════════════════════════════════════
  if (!subdomain || !SUBDOMAIN_ROLE_MAP[subdomain]) {
    return NextResponse.next();
  }

  // ═══════════════════════════════════════════════════
  // 3. Dashboard subdomain (director.edumrx.uz, student.localhost...)
  // ═══════════════════════════════════════════════════

  // Token query bilan kelyapti — TokenSync ishlasin, o'tkazib yubor
  if (hasTokenParam) {
    return NextResponse.next();
  }

  // Token yo'q → tegishli login sahifaga
  if (!validToken) {
    const isStaff = subdomain === "director" || subdomain === "manager";
    const loginHost = host.includes("localhost")
      ? "http://login.localhost:3000"
      : "https://login.edumrx.uz";
    return NextResponse.redirect(
      new URL(isStaff ? `${loginHost}/staff` : `${loginHost}/`),
    );
  }

  // Token bor → dashboard'ni ko'rsat (URL o'zgarmaydi, rewrite)
  // director.edumrx.uz/  →  ichki /director sahifasi
  // director.edumrx.uz/groups  →  ichki /director/groups
  if (!pathname.startsWith(`/${subdomain}`)) {
    return NextResponse.rewrite(
      new URL(`/${subdomain}${pathname === "/" ? "" : pathname}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|images|api).*)"],
};
