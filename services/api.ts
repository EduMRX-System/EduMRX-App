import axios from "axios";

const DataBaseURL = process.env.NEXT_PUBLIC_DataBaseURL;

const isLocal =
  typeof window !== "undefined" &&
  window.location.hostname.includes("localhost");

export const API = axios.create({
  baseURL:  DataBaseURL,
});

function getAccessToken(): string | null {
  const storedTokens = localStorage.getItem("tokens");
  if (storedTokens) {
    try {
      const tokens = JSON.parse(storedTokens);
      if (tokens?.access_token) return tokens.access_token;
    } catch {
      // ignore
    }
  }

  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(^| )access_token=([^;]+)/);
    if (match) return decodeURIComponent(match[2]);
  }

  return null;
}

API.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("tokens");

      if (typeof document !== "undefined") {
        const isLocalHost = window.location.hostname.includes("localhost");
        const domainPart = isLocalHost ? "" : "domain=.edumrx.uz; ";
        ["access_token", "refresh_token", "user"].forEach((name) => {
          document.cookie = `${name}=; path=/; ${domainPart}max-age=0`;
        });
      }

      const isLocalHost = window.location.hostname.includes("localhost");
      window.location.href = isLocalHost
        ? "http://login.localhost:3000/staff"
        : "https://login.edumrx.uz/staff";
    }
    return Promise.reject(error);
  },
);
