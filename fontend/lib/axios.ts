import axios from "axios";

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1",
  withCredentials: true,           // sends HttpOnly refresh cookie
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

let refreshPromise: Promise<string> | null = null;

// Attach access token on every request
api.interceptors.request.use((config) => {
  // Token is stored in memory via Zustand
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
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        // Refresh failed → clear state, go to login
        (globalThis as any).__accessToken = null;
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);
