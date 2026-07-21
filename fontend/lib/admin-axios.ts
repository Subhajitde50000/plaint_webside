import axios from "axios";
import { api } from "./axios";

// Dedicated admin API instance, re-using base URL & intercepors or configured for admin endpoints
export const adminApi = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1",
  withCredentials: true,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach admin access token
adminApi.interceptors.request.use((config) => {
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = (globalThis as any).__adminAccessToken || window.localStorage.getItem("admin_access_token");
  } else {
    token = (globalThis as any).__adminAccessToken || (globalThis as any).__accessToken || null;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: delegate 401 refresh to main axios interceptor or refresh logic
adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await api.post("/admin/auth/refresh");
        const accessToken = data.access_token;
        (globalThis as any).__adminAccessToken = accessToken;
        if (typeof window !== "undefined") {
          window.localStorage.setItem("admin_access_token", accessToken);
        }
        original.headers.Authorization = `Bearer ${accessToken}`;
        return adminApi(original);
      } catch (err) {
        if (typeof window !== "undefined") {
          (globalThis as any).__adminAccessToken = null;
          window.localStorage.removeItem("admin_access_token");
          if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
            window.location.href = `/admin/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
          }
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
