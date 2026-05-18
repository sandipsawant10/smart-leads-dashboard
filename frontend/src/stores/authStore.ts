import { create } from "zustand";
import type { User } from "../types";
import { authApi } from "../api/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: string,
  ) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem("token"),

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await authApi.login({ email, password });
      const { user, token } = res.data!;
      localStorage.setItem("token", token);
      set({ user, token, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (
    name: string,
    email: string,
    password: string,
    role?: string,
  ) => {
    set({ isLoading: true });
    try {
      const res = await authApi.register({ name, email, password, role });
      const { user, token } = res.data!;
      localStorage.setItem("token", token);
      set({ user, token, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    try {
      const res = await authApi.getMe();
      set({ user: res.data?.user ?? null, isAuthenticated: true });
    } catch {
      localStorage.removeItem("token");
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
