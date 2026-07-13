"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayoutShell } from "@/features/auth/components/AuthLayoutShell";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/features/auth/schemas/auth.schema";

export default function ForgotPasswordPage() {
  const { sendResetLink, isLoading, isSuccess } = useForgotPassword();
  const [emailValue, setEmailValue] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setInterval(() => setResendCooldown((n) => n - 1), 1000);
      return () => clearInterval(t);
    }
  }, [resendCooldown]);

  const onSubmit = (data: ForgotPasswordInput) => {
    setEmailValue(data.email);
    sendResetLink(data.email);
  };

  const handleResend = () => {
    if (resendCount >= 3) return;
    sendResetLink(emailValue);
    setResendCount((c) => c + 1);
    setResendCooldown(60);
  };

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
            background: #f0faf5;
            color: #00b566;
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
            color: #212326;
            margin: 0 0 4px 0;
            line-height: 1.5;
          }

          .success-email {
            font-size: 16px;
            font-weight: 700;
            color: #00b566;
            margin-bottom: 8px;
            display: block;
          }

          .success-expiry {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 24px;
          }

          .success-mail-btn {
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
            margin-bottom: 20px;
            transition: background 200ms;
          }

          .success-mail-btn:hover {
            background: #009952;
          }

          .success-resend-text {
            font-size: 12px;
            color: #6b7280;
          }

          .success-resend-btn {
            background: none;
            border: none;
            color: #00b566;
            font-weight: 600;
            cursor: pointer;
            padding: 0;
            font-size: 12px;
          }

          .success-resend-btn:hover:not(:disabled) {
            text-decoration: underline;
          }

          .success-resend-btn:disabled {
            color: #6b7280;
            cursor: not-allowed;
          }

          .success-back-link {
            font-size: 13px;
            font-weight: 600;
            color: #6b7280;
            text-decoration: none;
            margin-top: 32px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: color 200ms;
          }

          .success-back-link:hover {
            color: #00b566;
          }
        `}} />
        <div className="success-card" role="status" aria-live="assertive">
          <div className="success-icon-container">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h2 className="success-title">Check your inbox</h2>
          <p className="success-desc">We've sent a password reset link to:</p>
          <span className="success-email">{emailValue}</span>
          <span className="success-expiry">The link expires in 1 hour.</span>

          <a href="mailto:" className="success-mail-btn">
            Open email app →
          </a>

          <div className="success-resend-text">
            Didn't receive it? Check spam ·{" "}
            {resendCooldown > 0 ? (
              <span>Resend in {resendCooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCount >= 3}
                className="success-resend-btn"
              >
                {resendCount >= 3 ? "Max resends reached" : "Resend link"}
              </button>
            )}
          </div>

          <Link href="/login" className="success-back-link">
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthLayoutShell title="Forgot your password?" subtitle="No worries — we'll send you a reset link.">
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

        .back-link-container {
          text-align: center;
          margin-top: 24px;
        }

        .back-link {
          font-size: 13px;
          font-weight: 600;
          color: var(--auth-muted);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 200ms;
        }

        .back-link:hover {
          color: var(--auth-accent);
        }
      `}} />

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
        {/* Email Address */}
        <div className="form-field">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            placeholder="priya@email.com"
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

        {/* Submit Button */}
        <button type="submit" disabled={isLoading} className="form-btn-submit">
          {isLoading ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-spin" style={{ animation: "spin 1s linear infinite", marginRight: "4px" }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Sending...
            </>
          ) : (
            "Send reset link →"
          )}
        </button>
      </form>

      <div className="back-link-container">
        <Link href="/login" className="back-link">
          ← Back to sign in
        </Link>
      </div>
    </AuthLayoutShell>
  );
}
