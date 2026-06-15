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

function buildUrl(subdomain: string, path: string, host: string): string {
  const isLocal = host.includes("localhost");
  const port = isLocal ? ":3000" : "";
  const protocol = isLocal ? "http" : "https";
  const domain = isLocal ? "localhost" : "edumrx.uz";
  const fullHost = subdomain
    ? `${subdomain}.${domain}${port}`
    : `${domain}${port}`;
  return `${protocol}://${fullHost}${path}`;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  const subdomain = getSubdomain(host);
  const token = request.cookies.get("access_token")?.value;

  // DEBUG — keyin o'chirish kerak
  console.log("[MW]", {
    host,
    pathname,
    subdomain,
    hasToken: !!token,
    tokenValid: token ? isTokenValid(token) : null,
  });

  // 1. login subdomain
  if (subdomain === "login") {
    if (token && isTokenValid(token) && (pathname === "/" || pathname === "/staff")) {
      return NextResponse.redirect(new URL(buildUrl("", "/", host)));
    }
    if (pathname === "/staff") {
      return NextResponse.rewrite(new URL("/staff-login", request.url));
    }
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // 2. Main site
  if (!subdomain || !SUBDOMAIN_ROLE_MAP[subdomain]) {
    return NextResponse.next();
  }

  // 3. Token yo'q → login ga
  if (!token) {
    if (subdomain === "director" || subdomain === "manager") {
      return NextResponse.redirect(new URL(buildUrl("login", "/staff", host)));
    }
    return NextResponse.redirect(new URL(buildUrl("login", "/", host)));
  }

  // 4. Root → dashboard
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(buildUrl(subdomain, `/${subdomain}`, host)),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|images|api).*)"],
};
