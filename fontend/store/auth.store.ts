import { create } from "zustand";

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

const getInitialAuthStatus = () => {
  if (typeof window !== "undefined") {
    return !!window.localStorage.getItem("access_token");
  }
  return false;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: getInitialAuthStatus(),
  setAccessToken: (token) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("access_token", token);
    }
    (globalThis as any).__accessToken = token;  // used by Axios interceptor
    set({ isAuthenticated: true });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("access_token");
    }
    (globalThis as any).__accessToken = null;
    set({ user: null, isAuthenticated: false });
  },
}));
