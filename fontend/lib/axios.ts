import axios from "axios";

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1",
  withCredentials: true,           // sends HttpOnly refresh cookie
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Load initial token from localStorage
if (typeof window !== "undefined") {
  const initialToken = window.localStorage.getItem("access_token");
  if (initialToken) {
    (globalThis as any).__accessToken = initialToken;
  }
}

let refreshPromise: Promise<string> | null = null;

// Attach access token on every request
api.interceptors.request.use((config) => {
  const token = (globalThis as any).__accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Silent refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const requestUrl = original?.url ?? "";
    const isAuthRefreshRequest = requestUrl.includes("/auth/refresh");
    const isAuthLoginRequest = requestUrl.includes("/auth/login");

    if (error.response?.status === 401 && !original._retry && !isAuthRefreshRequest && !isAuthLoginRequest) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = api
            .post("/auth/refresh")
            .then(({ data }) => data.access_token as string)
            .finally(() => {
              refreshPromise = null;
            });
        }

        const accessToken = await refreshPromise;
        (globalThis as any).__accessToken = accessToken;
        if (typeof window !== "undefined") {
          window.localStorage.setItem("access_token", accessToken);
        }
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        // Refresh failed → clear state
        (globalThis as any).__accessToken = null;
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("access_token");
          
          try {
            const { useAuthStore } = require("@/store/auth.store");
            useAuthStore.setState({ user: null, isAuthenticated: false });
          } catch (_) {}

          // Only redirect to login if we are on a protected route
          const protectedPaths = ["/profile", "/checkout", "/admin"];
          const currentPath = window.location.pathname;
          const isProtected = protectedPaths.some(path => currentPath.startsWith(path));
          if (isProtected) {
            window.location.href = `/login?returnTo=${encodeURIComponent(currentPath)}`;
          }
        }
      }
    }
    return Promise.reject(error);
  }
);
