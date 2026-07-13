import { api } from "@/lib/axios";
import { SignUpInput, LoginInput } from "../schemas/auth.schema";

export const registerApi = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email.toLowerCase().trim(),
    phone: data.phone || undefined,
    password: data.password,
  });
  return res.data;
};

export const loginApi = async (data: LoginInput) => {
  const res = await api.post("/auth/login", {
    email: data.email.toLowerCase().trim(),
    password: data.password,
  });
  return res.data;
};

export const verifyOtpApi = async (email: string, otp: string) => {
  const res = await api.post("/auth/verify-otp", {
    email: email.toLowerCase().trim(),
    otp,
  });
  return res.data;
};

export const resendOtpApi = async (email: string) => {
  const res = await api.post("/auth/resend-otp", {
    email: email.toLowerCase().trim(),
  });
  return res.data;
};

export const forgotPasswordApi = async (email: string) => {
  const res = await api.post("/auth/forgot-password", {
    email: email.toLowerCase().trim(),
  });
  return res.data;
};

export const resetPasswordApi = async (data: {
  token: string;
  new_password: string;
}) => {
  const res = await api.post("/auth/reset-password", {
    token: data.token,
    new_password: data.new_password,
  });
  return res.data;
};

export const getMeApi = async () => {
  const res = await api.get("/customers/me");
  return res.data;
};

export const logoutApi = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const refreshTokenApi = async () => {
  const res = await api.post("/auth/refresh");
  return res.data;
};
