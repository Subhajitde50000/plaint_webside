import { create } from "zustand";

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setAccessToken: (token) => {
    (globalThis as any).__accessToken = token;  // used by Axios interceptor
    set({ isAuthenticated: true });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    (globalThis as any).__accessToken = null;
    set({ user: null, isAuthenticated: false });
  },
}));
