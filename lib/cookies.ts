// lib/cookies.ts
export function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  }
  
  export function clearAuthCookies() {
    const opts = "path=/; domain=.edumrx.uz; max-age=0";
    document.cookie = `access_token=; ${opts}`;
    document.cookie = `refresh_token=; ${opts}`;
    document.cookie = `user=; ${opts}`;
  }