"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayoutShell } from "@/features/auth/components/AuthLayoutShell";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import { resetPasswordSchema, ResetPasswordInput } from "@/features/auth/schemas/auth.schema";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { resetPassword, isLoading, isSuccess, error } = useResetPassword();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") || "";
  const confirmPasswordValue = watch("confirmPassword") || "";

  // Password strength logic
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue);

  const rulesMet = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  let strengthLabel = "";
  let strengthColor = "#e5e7eb";
  let strengthWidth = "0%";

  if (passwordValue.length > 0) {
    if (rulesMet === 4) {
      strengthLabel = "Strong";
      strengthColor = "#22c55e";
      strengthWidth = "100%";
    } else if (rulesMet >= 2) {
      strengthLabel = "Medium";
      strengthColor = "#f59e0b";
      strengthWidth = "60%";
    } else {
      strengthLabel = "Weak";
      strengthColor = "#ef4444";
      strengthWidth = "25%";
    }
  }

  // Passwords match live check
  const passwordsMatch = passwordValue && confirmPasswordValue && passwordValue === confirmPasswordValue;
  const passwordsMismatch = passwordValue && confirmPasswordValue && passwordValue !== confirmPasswordValue;

  useEffect(() => {
    if (error && (error.toLowerCase().includes("expire") || error.toLowerCase().includes("invalid"))) {
      setTokenExpired(true);
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      const t = setTimeout(() => {
        router.push("/login");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, router]);

  const onSubmit = (data: ResetPasswordInput) => {
    if (!token) {
      setTokenExpired(true);
      return;
    }
    resetPassword({
      token,
      new_password: data.password,
    });
  };

  // 1. Success state card
  if (isSuccess) {
    return (
      <div className="success-screen">
        <style dangerouslySetInnerHTML={{ __html: `
          .success-screen {
            background: #fefcf9;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Outfit', sans-serif;
            padding: 24px;
          }

          .success-card {
            width: 100%;
            max-width: 480px;
            background: #ffffff;
            border: 1px solid rgb(202, 223, 212);
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 181, 102, 0.10);
            padding: 40px 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .success-icon-container {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: #f0fdf4;
            border: 2px solid #16a34a;
            color: #16a34a;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
          }

          .success-title {
            font-size: 20px;
            font-weight: 700;
            color: #1c1c1c;
            margin: 0 0 12px 0;
          }

          .success-desc {
            font-size: 13px;
            color: #6b7280;
            margin: 0 0 24px 0;
            line-height: 1.5;
          }

          .success-link-btn {
            height: 48px;
            width: 100%;
            background: #00b566;
            color: #ffffff;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 200ms;
          }

          .success-link-btn:hover {
            background: #009952;
          }
        `}} />
        <div className="success-card" role="status" aria-live="assertive">
          <div className="success-icon-container">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="success-title">Password updated!</h2>
          <p className="success-desc">
            Your password has been reset successfully. You've been signed out of all other devices.
          </p>
          <Link href="/login" className="success-link-btn">
            Sign in now →
          </Link>
        </div>
      </div>
    );
  }

  // 2. Expired state card
  if (tokenExpired || !token) {
    return (
      <div className="success-screen">
        <style dangerouslySetInnerHTML={{ __html: `
          .success-screen {
            background: #fefcf9;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Outfit', sans-serif;
            padding: 24px;
          }

          .success-card {
            width: 100%;
            max-width: 480px;
            background: #ffffff;
            border: 1px solid rgb(202, 223, 212);
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 181, 102, 0.10);
            padding: 40px 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .expired-icon-container {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: #fef3c7;
            color: #c69026;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
          }

          .success-title {
            font-size: 20px;
            font-weight: 700;
            color: #1c1c1c;
            margin: 0 0 12px 0;
          }

          .success-desc {
            font-size: 13px;
            color: #6b7280;
            margin: 0 0 24px 0;
            line-height: 1.5;
          }

          .success-link-btn {
            height: 48px;
            width: 100%;
            background: #00b566;
            color: #ffffff;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 200ms;
          }

          .success-link-btn:hover {
            background: #009952;
          }
        `}} />
        <div className="success-card" role="alert" aria-live="assertive">
          <div className="expired-icon-container">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h2 className="success-title">This link has expired</h2>
          <p className="success-desc">
            Password reset links are only valid for 1 hour.
          </p>
          <Link href="/forgot-password" className="success-link-btn">
            Request a new link →
          </Link>
        </div>
      </div>
    );
  }

  // 3. Normal form render
  return (
    <AuthLayoutShell title="Set a new password" subtitle="Choose something strong and memorable.">
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
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

        .strength-container {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .strength-bar-bg {
          height: 6px;
          width: 100%;
          background: var(--auth-divider);
          border-radius: 9999px;
          overflow: hidden;
        }

        .strength-bar-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 300ms ease, background-color 200ms ease;
        }

        .strength-label {
          font-size: 11px;
          font-weight: 600;
          align-self: flex-end;
        }

        .rules-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          margin-top: 4px;
        }

        .rule-item {
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--auth-muted);
        }

        .rule-item.met {
          color: var(--auth-success);
        }

        .match-indicator {
          font-size: 12px;
          font-weight: 600;
          margin-top: 4px;
        }

        .match-indicator.success {
          color: var(--auth-success);
        }

        .match-indicator.error {
          color: var(--auth-danger);
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

        .form-btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
      `}} />

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
        {/* Global error banner */}
        {error && (
          <div className="global-error" role="alert">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* New Password */}
        <div className="form-field">
          <label className="form-label">New Password *</label>
          <div className="form-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`form-input ${errors.password ? "error" : ""}`}
              disabled={isLoading}
              autoComplete="new-password"
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

          {/* Password strength meter */}
          {passwordValue.length > 0 && (
            <div className="strength-container" role="status" aria-live="polite">
              <div className="strength-bar-bg">
                <div
                  className="strength-bar-fill"
                  style={{ width: strengthWidth, backgroundColor: strengthColor }}
                />
              </div>
              <span className="strength-label" style={{ color: strengthColor }}>
                {strengthLabel}
              </span>
              
              <div className="rules-grid">
                <span className={`rule-item ${hasMinLength ? "met" : ""}`}>
                  {hasMinLength ? "✓" : "✗"} 8+ chars
                </span>
                <span className={`rule-item ${hasUppercase ? "met" : ""}`}>
                  {hasUppercase ? "✓" : "✗"} Uppercase
                </span>
                <span className={`rule-item ${hasNumber ? "met" : ""}`}>
                  {hasNumber ? "✓" : "✗"} Number
                </span>
                <span className={`rule-item ${hasSpecial ? "met" : ""}`}>
                  {hasSpecial ? "✓" : "✗"} Special char
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-field">
          <label className="form-label">Confirm Password *</label>
          <div className="form-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`form-input ${errors.confirmPassword ? "error" : ""}`}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
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
          {errors.confirmPassword && (
            <span className="error-message">
              <span>⚠</span> {errors.confirmPassword.message}
            </span>
          )}

          {/* Passwords match indicator */}
          {passwordsMatch && (
            <div className="match-indicator success" role="status" aria-live="polite">
              ✓ Passwords match
            </div>
          )}
          {passwordsMismatch && (
            <div className="match-indicator error" role="status" aria-live="polite">
              ⚠ Passwords don't match
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading || !passwordsMatch || rulesMet < 2}
          className="form-btn-submit"
        >
          {isLoading ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-spin" style={{ animation: "spin 1s linear infinite", marginRight: "4px" }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Updating password...
            </>
          ) : (
            "Set new password →"
          )}
        </button>
      </form>
    </AuthLayoutShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
