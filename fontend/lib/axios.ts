import axios from "axios";

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1",
  withCredentials: true,           // sends HttpOnly refresh cookie
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Load initial tokens from localStorage
if (typeof window !== "undefined") {
  const initialToken = window.localStorage.getItem("access_token");
  if (initialToken) (globalThis as any).__accessToken = initialToken;

  const initialAdminToken = window.localStorage.getItem("admin_access_token");
  if (initialAdminToken) (globalThis as any).__adminAccessToken = initialAdminToken;
}

let refreshPromise: Promise<string> | null = null;
let adminRefreshPromise: Promise<string> | null = null;

// Attach access token on every request
api.interceptors.request.use((config) => {
  const isAdminRequest = config.url?.includes("/admin");
  let token: string | null = null;

  if (typeof window !== "undefined") {
    if (isAdminRequest) {
      token = (globalThis as any).__adminAccessToken || window.localStorage.getItem("admin_access_token");
    } else {
      token = (globalThis as any).__accessToken || window.localStorage.getItem("access_token");
    }
  } else {
    token = isAdminRequest
      ? (globalThis as any).__adminAccessToken || (globalThis as any).__accessToken
      : (globalThis as any).__accessToken;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Silent refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const requestUrl = original?.url ?? "";
    const isAdmin = requestUrl.includes("/admin");
    const isAuthRefreshRequest = requestUrl.includes("/auth/refresh");
    const isAuthLoginRequest = requestUrl.includes("/auth/login");

    if (error.response?.status === 401 && !original._retry && !isAuthRefreshRequest && !isAuthLoginRequest) {
      original._retry = true;
      try {
        if (isAdmin) {
          if (!adminRefreshPromise) {
            adminRefreshPromise = api
              .post("/admin/auth/refresh")
              .then(({ data }) => data.access_token as string)
              .finally(() => {
                adminRefreshPromise = null;
              });
          }
          const accessToken = await adminRefreshPromise;
          (globalThis as any).__adminAccessToken = accessToken;
          if (typeof window !== "undefined") {
            window.localStorage.setItem("admin_access_token", accessToken);
          }
          original.headers.Authorization = `Bearer ${accessToken}`;
          return api(original);
        } else {
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
        }
      } catch {
        // Refresh failed → clear state
        if (isAdmin) {
          (globalThis as any).__adminAccessToken = null;
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("admin_access_token");
            try {
              const { useAdminAuthStore } = require("@/store/adminAuth.store");
              useAdminAuthStore.setState({ admin: null, isAuthenticated: false });
            } catch (_) {}

            const currentPath = window.location.pathname;
            if (currentPath.startsWith("/admin") && currentPath !== "/admin/login") {
              window.location.href = `/admin/login?returnTo=${encodeURIComponent(currentPath)}`;
            }
          }
        } else {
          (globalThis as any).__accessToken = null;
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("access_token");
            
            try {
              const { useAuthStore } = require("@/store/auth.store");
              useAuthStore.setState({ user: null, isAuthenticated: false });
            } catch (_) {}

            const protectedPaths = ["/profile", "/checkout"];
            const currentPath = window.location.pathname;
            const isProtected = protectedPaths.some((path) => currentPath.startsWith(path));
            if (isProtected) {
              window.location.href = `/login?returnTo=${encodeURIComponent(currentPath)}`;
            }
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

