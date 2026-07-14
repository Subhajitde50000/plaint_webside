"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayoutShell } from "@/features/auth/components/AuthLayoutShell";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { loginSchema, LoginInput } from "@/features/auth/schemas/auth.schema";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const isVerified = searchParams.get("verified") === "true";

  const { login, isLoading, error, isSuccess } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: initialEmail,
      password: "",
    },
  });

  // Prefill email if it is in URL
  useEffect(() => {
    if (initialEmail) {
      setValue("email", initialEmail);
    }
  }, [initialEmail, setValue]);

  // Handle email_not_verified error - redirect to OTP page
  useEffect(() => {
    if (error === "email_not_verified") {
      const email = getValues("email");
      // Redirect to verify-otp page with email
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    }
  }, [error, router, getValues]);

  const onSubmit = (data: LoginInput) => {
    console.log(data)
    login(data);
  };

  return (
    <AuthLayoutShell title="Sign in to your account" subtitle="Welcome back, plant lover 🌿">
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .auth-social-btn {
          height: 52px;
          background: var(--auth-social-bg);
          border: 1px solid var(--auth-social-border);
          border-radius: 9999px;
          font-size: 16px;
          font-weight: 500;
          color: var(--auth-body);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          cursor: pointer;
          transition: all 200ms ease;
        }

        .auth-social-btn:hover {
          background: #f3f4f6;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .auth-social-btn:focus-visible {
          outline: 2px solid var(--auth-accent);
          outline-offset: 2px;
        }

        .divider-container {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 24px 0;
          color: var(--auth-muted);
          font-size: 12px;
          font-weight: 500;
        }

        .divider-container::before,
        .divider-container::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--auth-divider);
        }

        .divider-container:not(:empty)::before {
          margin-right: 16px;
        }

        .divider-container:not(:empty)::after {
          margin-left: 16px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--auth-body);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .forgot-link {
          font-size: 12px;
          color: var(--auth-accent);
          text-transform: none;
          font-weight: 600;
          text-decoration: none;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .form-input-container {
          position: relative;
          width: 100%;
        }

        .form-input {
          width: 100%;
          height: 52px;
          border-radius: 8px;
          border: 1px solid var(--auth-input-border);
          background: #ffffff;
          padding: 0 16px;
          font-size: 16px;
          color: var(--auth-body);
          transition: all 150ms ease;
          outline: none;
        }

        .form-input:focus {
          border: 2px solid var(--auth-input-active);
          box-shadow: 0 0 0 4px rgba(0,181,102,0.15);
        }

        .form-input.error {
          border: 2px solid var(--auth-danger);
          background: var(--auth-danger-bg);
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--auth-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }

        .password-toggle:hover {
          background: rgba(0,0,0,0.05);
        }

        .error-message {
          font-size: 12px;
          font-weight: 500;
          color: var(--auth-danger);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
        }

        .form-btn-submit {
          height: 52px;
          width: 100%;
          background: var(--auth-accent);
          color: #ffffff;
          border-radius: 9999px;
          font-size: 16px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 200ms ease;
        }

        .form-btn-submit:hover:not(:disabled) {
          background: var(--auth-accent-hover);
          transform: scale(1.01);
          box-shadow: 0 4px 16px rgba(0, 181, 102, 0.30);
        }

        .form-btn-submit:active:not(:disabled) {
          transform: scale(0.98);
        }

        .form-btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .auth-redirect-link {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: var(--auth-muted);
        }

        .auth-redirect-link a {
          color: var(--auth-accent);
          font-weight: 600;
          text-decoration: none;
        }

        .auth-redirect-link a:hover {
          text-decoration: underline;
        }

        .global-error {
          background: var(--auth-danger-bg);
          border: 1px solid var(--auth-danger-border);
          border-left: 4px solid var(--auth-danger);
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 12px;
          font-weight: 500;
          color: var(--auth-danger);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .verified-banner {
          background: var(--auth-accent-light);
          border: 1px solid rgb(202, 223, 212);
          border-left: 4px solid var(--auth-accent);
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 12px;
          font-weight: 600;
          color: rgb(0, 146, 82);
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}} />

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
        {/* Google OAuth Button */}
        <button className="auth-social-btn" type="button">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.59c-.28 1.5-.1.8 1.48 2.58l3.12 2.42c1.82-1.68 2.55-4.16 2.55-6.85Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.12-2.42c-.86.58-1.97.93-3.08.93-3.1 0-5.74-2.1-6.68-4.93L3.89 17.4C5.87 21.32 9.77 24 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.32 14.67a7.22 7.22 0 0 1 0-4.6l-3.17-2.46c-.95 1.9-1.5 4.04-1.5 6.3 0 2.25.55 4.4 1.5 6.3l3.17-3.54Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.44-3.44C17.96 1.19 15.24 0 12 0 9.77 0 5.87 2.68 3.89 6.6L7.06 9.06C8 6.23 10.64 4.75 12 4.75Z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="divider-container" role="separator" aria-label="Or">or</div>

        {/* Email verified banner */}
        {isVerified && !error && (
          <div className="verified-banner" role="status">
            <span>✓</span>
            <span>Email verified! Please sign in to continue.</span>
          </div>
        )}

        {/* Global error banner */}
        {error && error !== "email_not_verified" && (
          <div className="global-error" role="alert">
            <span>⚠</span>
            <span>{error || "Something went wrong. Please check your credentials."}</span>
          </div>
        )}

        {/* Email Address */}
        <div className="form-field">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            placeholder="Sutanu@email.com"
            {...register("email")}
            className={`form-input ${errors.email ? "error" : ""}`}
            disabled={isLoading}
            autoComplete="email"
          />
          {errors.email && (
            <span className="error-message">
              <span>⚠</span> {errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="form-field">
          <div className="form-label">
            <span>Password *</span>
            <Link href="/forgot-password" className="forgot-link">Forgot password?</Link>
          </div>
          <div className="form-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`form-input ${errors.password ? "error" : ""}`}
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <span className="error-message">
              <span>⚠</span> {errors.password.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading} className="form-btn-submit">
          {isLoading ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-spin" style={{ animation: "spin 1s linear infinite", marginRight: "4px" }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Signing in...
            </>
          ) : (
            "Sign in →"
          )}
        </button>
      </form>

      <div className="auth-redirect-link">
        Don't have an account? <Link href="/signup">Sign up →</Link>
      </div>
    </AuthLayoutShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
