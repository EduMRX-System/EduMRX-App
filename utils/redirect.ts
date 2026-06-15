export function getSubdomainUrl(subdomain: string): string {
  const isLocal =
    typeof window !== "undefined" &&
    window.location.hostname.includes("localhost");
  return isLocal
    ? `http://${subdomain}.localhost:3000`
    : `https://${subdomain}.edumrx.uz`;
}

export function getCookieOptions(): string {
  const isLocal = window.location.hostname.includes("localhost");
  const maxAge = 7 * 24 * 60 * 60;
  return isLocal
    ? `path=/; domain=.localhost; max-age=${maxAge}; samesite=lax`
    : `path=/; domain=.edumrx.uz; secure; samesite=none; max-age=${maxAge}`;
}
