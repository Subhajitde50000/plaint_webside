import axios from "axios";

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1",
  withCredentials: true,           // sends HttpOnly refresh cookie
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

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
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        (globalThis as any).__accessToken = data.access_token;
        original.headers.Authorization = `Bearer ${data.access_token}`;
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
