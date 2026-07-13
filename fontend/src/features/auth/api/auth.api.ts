import { api } from "@/lib/axios";

// ─── Register ─────────────────────────────────────────────────────────────────

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
  return res.data as { message: string };
};

// ─── Login (OAuth2 form-encoded) ──────────────────────────────────────────────

export const loginApi = async (email: string, password: string) => {
  // FastAPI OAuth2 requires application/x-www-form-urlencoded, NOT JSON
  const form = new URLSearchParams({ username: email, password });
  const res = await api.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data as { access_token: string; token_type: string };
};

// ─── Get current user profile ─────────────────────────────────────────────────

export const getMeApi = async () => {
  const res = await api.get("/customers/me");
  return res.data;
};

// ─── OTP Verification ─────────────────────────────────────────────────────────

export const verifyOtpApi = async (email: string, otp: string) => {
  const res = await api.post("/auth/verify-otp", { email, otp });
  return res.data as { message: string };
};

export const resendOtpApi = async (email: string) => {
  const res = await api.post("/auth/resend-otp", { email });
  return res.data as { message: string };
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPasswordApi = async (email: string) => {
  // NOTE: Always returns 200 even if email doesn't exist (security)
  const res = await api.post("/auth/forgot-password", { email });
  return res.data as { message: string };
};

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPasswordApi = async (token: string, newPassword: string) => {
  const res = await api.post("/auth/reset-password", {
    token,
    new_password: newPassword,
  });
  return res.data as { message: string };
};

// ─── Token Refresh (called by Axios interceptor automatically) ────────────────

export const refreshTokenApi = async () => {
  const res = await api.post("/auth/refresh");
  return res.data as { access_token: string };
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logoutApi = async () => {
  const res = await api.post("/auth/logout");
  return res.data as { message: string };
};
