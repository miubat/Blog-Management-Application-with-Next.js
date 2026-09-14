import api from "@/lib/api";

export const register = (payload) => api.post("/auth/register", payload);

export const login = (payload) => api.post("/auth/login", payload);

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (token, password) =>
  api.patch(`/auth/reset-password/${token}`, { password });
