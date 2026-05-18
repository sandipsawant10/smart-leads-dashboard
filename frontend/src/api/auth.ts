import api from "./axios";
import type { ApiResponse, User } from "../types";

interface AuthData {
  user: User;
  token: string;
}

export const authApi = {
  register: async (payload: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<ApiResponse<AuthData>> => {
    const { data } = await api.post<ApiResponse<AuthData>>(
      "/auth/register",
      payload,
    );
    return data;
  },

  login: async (payload: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthData>> => {
    const { data } = await api.post<ApiResponse<AuthData>>(
      "/auth/login",
      payload,
    );
    return data;
  },
  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const { data } = await api.get<ApiResponse<{ user: User }>>("/auth/me");
    return data;
  },
};
