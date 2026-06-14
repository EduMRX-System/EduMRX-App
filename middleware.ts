import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUBDOMAIN_ROLE_MAP: Record<string, string> = {
  director: "director",
  manager: "manager",
  teacher: "teacher",
  student: "student",
  parent: "parent",
};

function getSubdomain(host: string): string | null {
  if (host.includes("localhost")) return null;
  const parts = host.split(".");
  if (parts.length >= 3) return parts[0];
  return null;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  const subdomain = getSubdomain(host);
  const token = request.cookies.get("access_token")?.value;

  // ==================
  // 1. login.edumrx.uz
  // ==================
  if (subdomain === "login") {
    // Token bor bo'lsa — dashboard ga (login kerak emas)
    if (token) {
      return NextResponse.redirect(new URL("https://edumrx.uz", request.url));
    }
    // Root → /login pageni ko'rsat (URL o'zgarmaydi)
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // ==================
  // 2. Main site (edumrx.uz)
  // ==================
  if (!subdomain || !SUBDOMAIN_ROLE_MAP[subdomain]) {
    return NextResponse.next();
  }

  // ==================
  // 3. Token yo'q → login.edumrx.uz ga
  // ==================
  if (!token) {
    return NextResponse.redirect(
      new URL("https://login.edumrx.uz", request.url),
    );
  }

  // ==================
  // 4. Root → subdomain dashboard ga
  // ==================
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${subdomain}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|images|api).*)"],
};
