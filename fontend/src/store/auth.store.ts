"use client";
import { create } from "zustand";

export interface UserProfile {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  is_email_verified: boolean;
  loyalty_tier?: string;
  loyalty_points?: number;
  avatar_url?: string;
  is_admin?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAccessToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  setAccessToken: (token: string) => {
    // Store in memory for Axios interceptor — never in localStorage (XSS-safe)
    (globalThis as any).__accessToken = token;
    set({ isAuthenticated: true });
  },

  setUser: (user: UserProfile) => set({ user }),

  logout: () => {
    (globalThis as any).__accessToken = null;
    set({ user: null, isAuthenticated: false });
  },

  setHydrated: () => set({ isHydrated: true }),
}));
