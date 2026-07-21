"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayoutShell } from "@/features/auth/components/AuthLayoutShell";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { loginSchema, LoginInput } from "@/features/auth/schemas/auth.schema";

// ---------------------------------------------------------------------------
// Eye icons
// ---------------------------------------------------------------------------
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const EyeOn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ---------------------------------------------------------------------------
// Spinner icon
// ---------------------------------------------------------------------------
const Spinner = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" style={{ animation: "lf-spin 0.8s linear infinite" }}>
    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

// ---------------------------------------------------------------------------
// Google SVG logo
// ---------------------------------------------------------------------------
const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.59c-.28 1.5-1.1 2.8-2.35 3.66v3.04h3.8c2.22-2.05 3.51-5.07 3.51-8.55Z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.8-2.95c-1.07.72-2.44 1.14-4.16 1.14-3.2 0-5.91-2.16-6.88-5.07H1.2v3.05C3.18 21.3 7.31 24 12 24Z" />
    <path fill="#FBBC05" d="M5.12 14.21a7.26 7.26 0 0 1 0-4.42V6.74H1.2a12 12 0 0 0 0 10.52l3.92-3.05Z" />
    <path fill="#EA4335" d="M12 4.75c1.8 0 3.42.62 4.7 1.84l3.52-3.52C18.01 1.19 15.24 0 12 0 7.31 0 3.18 2.7 1.2 6.74l3.92 3.05C6.09 6.91 8.8 4.75 12 4.75Z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Main LoginForm component
// Receives initialEmail, isVerified, and returnTo from the page.
// ---------------------------------------------------------------------------
interface LoginFormProps {
  initialEmail?: string;
  isVerified?: boolean;
  returnTo?: string;
}

export function LoginForm({ initialEmail = "", isVerified = false, returnTo = "/" }: LoginFormProps) {
  const router = useRouter();
  const { login, isLoading, error } = useLogin(returnTo);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: initialEmail, password: "" },
  });

  // Pre-fill email from URL param
  useEffect(() => {
    if (initialEmail) setValue("email", initialEmail);
  }, [initialEmail, setValue]);

  // If backend says email_not_verified, redirect to OTP page with the email
  useEffect(() => {
    if (error === "email_not_verified") {
      const email = getValues("email");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    }
  }, [error, router, getValues]);

  const onSubmit = (data: LoginInput) => login(data);

  return (
    <AuthLayoutShell title="Sign in to your account" subtitle="Welcome back, plant lover 🌿">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes lf-spin { to { transform: rotate(360deg); } }

        .lf-form   { display: flex; flex-direction: column; gap: 20px; }

        /* ── Social button ── */
        .lf-social {
          height: 52px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 9999px;
          font-size: 15px;
          font-weight: 500;
          color: #1c1c1c;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          cursor: pointer;
          transition: box-shadow 180ms ease, background 180ms ease;
          font-family: inherit;
        }
        .lf-social:hover   { background: #f9fafb; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .lf-social:focus-visible { outline: 2px solid var(--auth-accent); outline-offset: 2px; }

        /* ── Divider ── */
        .lf-divider {
          display: flex; align-items: center; gap: 12px;
          font-size: 12px; font-weight: 500; color: var(--auth-muted);
          margin: 4px 0;
        }
        .lf-divider::before,
        .lf-divider::after { content: ''; flex: 1; height: 1px; background: var(--auth-divider); }

        /* ── Banners ── */
        .lf-banner {
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.4;
        }
        .lf-banner-success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-left: 4px solid #16a34a;
          color: #15803d;
        }
        .lf-banner-error {
          background: var(--auth-danger-bg);
          border: 1px solid var(--auth-danger-border);
          border-left: 4px solid var(--auth-danger);
          color: var(--auth-danger);
        }

        /* ── Field ── */
        .lf-field   { display: flex; flex-direction: column; gap: 6px; }
        .lf-label   {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #374151;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .lf-forgot  {
          font-size: 12px;
          font-weight: 600;
          color: var(--auth-accent);
          text-decoration: none;
          text-transform: none;
          letter-spacing: 0;
        }
        .lf-forgot:hover { text-decoration: underline; }

        .lf-input-wrap { position: relative; }
        .lf-input {
          width: 100%;
          height: 52px;
          padding: 0 48px 0 16px;
          border-radius: 10px;
          border: 1.5px solid #d1d5db;
          background: #fff;
          font-size: 16px;
          color: #1c1c1c;
          outline: none;
          transition: border 140ms, box-shadow 140ms;
          font-family: inherit;
          box-sizing: border-box;
        }
        .lf-input:focus {
          border-color: var(--auth-accent);
          box-shadow: 0 0 0 3px rgba(0,181,102,0.15);
        }
        .lf-input.lf-input-err {
          border-color: var(--auth-danger);
          background: var(--auth-danger-bg);
        }
        .lf-eye {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          padding: 0;
          transition: color 140ms, background 140ms;
        }
        .lf-eye:hover { color: #4b5563; background: rgba(0,0,0,0.05); }

        .lf-error-msg {
          font-size: 12px;
          font-weight: 500;
          color: var(--auth-danger);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ── Submit ── */
        .lf-submit {
          height: 52px;
          width: 100%;
          background: var(--auth-accent);
          color: #fff;
          border-radius: 9999px;
          font-size: 16px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 180ms, transform 120ms, box-shadow 180ms;
          font-family: inherit;
        }
        .lf-submit:hover:not(:disabled) {
          background: var(--auth-accent-hover);
          transform: scale(1.01);
          box-shadow: 0 4px 18px rgba(0,181,102,0.28);
        }
        .lf-submit:active:not(:disabled) { transform: scale(0.98); }
        .lf-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Footer link ── */
        .lf-footer {
          text-align: center;
          margin-top: 22px;
          font-size: 13px;
          color: var(--auth-muted);
        }
        .lf-footer a {
          color: var(--auth-accent);
          font-weight: 600;
          text-decoration: none;
        }
        .lf-footer a:hover { text-decoration: underline; }
      `}} />

      {/* ── Google OAuth ── */}
      <button id="login-google-btn" type="button" className="lf-social" aria-label="Continue with Google">
        <GoogleLogo />
        Continue with Google
      </button>

      <div className="lf-divider" role="separator" aria-label="Or sign in with email">or</div>

      <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="lf-form" noValidate>

        {/* Verified success banner */}
        {isVerified && !error && (
          <div className="lf-banner lf-banner-success" role="status" aria-live="polite">
            <span>✓</span>
            <span>Email verified! You can sign in now.</span>
          </div>
        )}

        {/* Error banner — skip for email_not_verified (handled by redirect) */}
        {error && error !== "email_not_verified" && (
          <div className="lf-banner lf-banner-error" role="alert" aria-live="assertive">
            <span>⚠</span>
            <span>
              {error === "Invalid email or password."
                ? "Incorrect email or password. Please try again."
                : error === "Account is blocked. Contact support."
                  ? "Your account has been blocked. Please contact support."
                  : "Something went wrong. Please try again."}
            </span>
          </div>
        )}

        {/* Email */}
        <div className="lf-field">
          <label htmlFor="login-email" className="lf-label">Email Address *</label>
          <div className="lf-input-wrap">
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isLoading}
              {...register("email")}
              className={`lf-input${errors.email ? " lf-input-err" : ""}`}
            />
          </div>
          {errors.email && (
            <span className="lf-error-msg" role="alert"><span>⚠</span>{errors.email.message}</span>
          )}
        </div>

        {/* Password */}
        <div className="lf-field">
          <label htmlFor="login-password" className="lf-label">
            <span>Password *</span>
            <Link href="/forgot-password" className="lf-forgot" tabIndex={0}>Forgot password?</Link>
          </label>
          <div className="lf-input-wrap">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              {...register("password")}
              className={`lf-input${errors.password ? " lf-input-err" : ""}`}
            />
            <button
              type="button"
              className="lf-eye"
              id="login-toggle-password"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff /> : <EyeOn />}
            </button>
          </div>
          {errors.password && (
            <span className="lf-error-msg" role="alert"><span>⚠</span>{errors.password.message}</span>
          )}
        </div>

        {/* Submit */}
        <button
          id="login-submit-btn"
          type="submit"
          disabled={isLoading}
          className="lf-submit"
        >
          {isLoading ? <><Spinner /> Signing in...</> : "Sign in →"}
        </button>
      </form>

      <div className="lf-footer">
        Don&apos;t have an account?{" "}
        <Link href="/signup" id="login-signup-link">Sign up free →</Link>
      </div>
    </AuthLayoutShell>
  );
}
