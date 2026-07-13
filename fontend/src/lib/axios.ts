import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api/v1",
  withCredentials: true, // sends HttpOnly refresh cookie
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach access token on every request
api.interceptors.request.use((config) => {
  const token = (globalThis as any).__accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Track if we're currently refreshing to avoid infinite loops
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

function processQueue(error: any, token: string | null = null) {
  refreshQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  refreshQueue = [];
}

// Silent refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh");
        const newToken = data.access_token;
        (globalThis as any).__accessToken = newToken;
        original.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        (globalThis as any).__accessToken = null;
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
