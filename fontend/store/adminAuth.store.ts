import { create } from "zustand";

export interface AdminUser {
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  avatar_url?: string;
}

interface AdminAuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  setAdminToken: (token: string) => void;
  setAdmin: (admin: AdminUser | null) => void;
  logoutAdmin: () => void;
}

const getInitialAdminAuthStatus = () => {
  if (typeof window !== "undefined") {
    return !!window.localStorage.getItem("admin_access_token");
  }
  return false;
};

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  admin: null,
  isAuthenticated: getInitialAdminAuthStatus(),
  setAdminToken: (token: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("admin_access_token", token);
    }
    (globalThis as any).__adminAccessToken = token;
    set({ isAuthenticated: true });
  },
  setAdmin: (admin) => set({ admin, isAuthenticated: !!admin }),
  logoutAdmin: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("admin_access_token");
    }
    (globalThis as any).__adminAccessToken = null;
    set({ admin: null, isAuthenticated: false });
  },
}));
