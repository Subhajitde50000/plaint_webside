"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayoutShell } from "@/features/auth/components/AuthLayoutShell";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/features/auth/schemas/auth.schema";

// ─── Shared inline styles ────────────────────────────────────────────────────
const CARD_CSS = `
  .fp-screen {
    background: #fefcf9;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Outfit', sans-serif;
    padding: 24px;
  }
  .fp-card {
    width: 100%;
    max-width: 480px;
    background: #ffffff;
    border: 1px solid #d1ead9;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0,181,102,0.09);
    padding: 40px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .fp-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 22px;
    flex-shrink: 0;
  }
  .fp-icon-green  { background: #f0fdf4; color: #00b566; }
  .fp-icon-amber  { background: #fffbeb; color: #d97706; border: 2px solid #fcd34d; }
  .fp-title  { font-size: 20px; font-weight: 700; color: #1c1c1c; margin: 0 0 10px; }
  .fp-desc   { font-size: 13px; color: #6b7280; line-height: 1.55; margin: 0 0 6px; }
  .fp-email  { font-size: 16px; font-weight: 700; color: #00b566; margin-bottom: 6px; display: block; }
  .fp-expiry { font-size: 11px; color: #9ca3af; margin-bottom: 26px; }
  .fp-btn-primary {
    height: 48px; width: 100%;
    background: #00b566; color: #fff;
    border-radius: 9999px; font-size: 14px; font-weight: 700;
    border: none; cursor: pointer; text-decoration: none;
    display: flex; align-items: center; justify-content: center;
    transition: background 200ms; margin-bottom: 16px;
    font-family: inherit;
  }
  .fp-btn-primary:hover { background: #009952; }
  .fp-btn-outline {
    height: 48px; width: 100%;
    background: transparent; color: #00b566;
    border-radius: 9999px; font-size: 14px; font-weight: 700;
    border: 2px solid #00b566; cursor: pointer; text-decoration: none;
    display: flex; align-items: center; justify-content: center;
    transition: all 200ms; margin-bottom: 16px;
    font-family: inherit;
  }
  .fp-btn-outline:hover { background: #f0fdf4; }
  .fp-resend-text { font-size: 12px; color: #9ca3af; }
  .fp-resend-btn  {
    background: none; border: none; color: #00b566;
    font-weight: 600; cursor: pointer; padding: 0; font-size: 12px;
  }
  .fp-resend-btn:hover:not(:disabled) { text-decoration: underline; }
  .fp-resend-btn:disabled { color: #9ca3af; cursor: not-allowed; }
  .fp-back { font-size: 13px; font-weight: 600; color: #9ca3af; text-decoration: none;
    margin-top: 28px; display: inline-flex; align-items: center; gap: 6px; transition: color 200ms; }
  .fp-back:hover { color: #00b566; }
  .fp-warn-list {
    text-align: left; width: 100%;
    background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px;
    padding: 14px 16px; margin-bottom: 22px;
    font-size: 12px; color: #92400e; line-height: 1.7;
    list-style: none;
  }
  .fp-warn-list li::before { content: "•  "; font-weight: 700; }
`;

const FORM_CSS = `
  .fp-form-wrap { display: flex; flex-direction: column; gap: 20px; }
  .fp-field      { display: flex; flex-direction: column; gap: 6px; }
  .fp-label      { font-size: 12px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; color: #374151; }
  .fp-input {
    width: 100%; height: 52px;
    border-radius: 10px; border: 1.5px solid #d1d5db;
    background: #fff; padding: 0 16px;
    font-size: 16px; color: #1c1c1c; outline: none;
    transition: border 140ms, box-shadow 140ms; font-family: inherit;
    box-sizing: border-box;
  }
  .fp-input:focus { border-color: #00b566; box-shadow: 0 0 0 3px rgba(0,181,102,0.15); }
  .fp-input.err   { border-color: #ef4444; background: #fef2f2; }
  .fp-err-msg { font-size: 12px; font-weight: 500; color: #ef4444;
    display: flex; align-items: center; gap: 4px; }
  .fp-submit {
    height: 52px; width: 100%;
    background: #00b566; color: #fff;
    border-radius: 9999px; font-size: 16px; font-weight: 700;
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 200ms; font-family: inherit;
  }
  .fp-submit:hover:not(:disabled) { background: #009952; transform: scale(1.01);
    box-shadow: 0 4px 16px rgba(0,181,102,0.28); }
  .fp-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .fp-global-err {
    background: #fef2f2; border: 1px solid #fecaca;
    border-left: 4px solid #ef4444; border-radius: 8px;
    padding: 11px 14px; font-size: 12px; font-weight: 500; color: #dc2626;
    display: flex; align-items: center; gap: 8px;
  }
  .fp-footer-link { text-align: center; margin-top: 24px; font-size: 13px; color: #9ca3af; }
  .fp-footer-link a { color: #00b566; font-weight: 600; text-decoration: none; }
  .fp-footer-link a:hover { text-decoration: underline; }
  @keyframes fp-spin { to { transform: rotate(360deg); } }
`;

// ─── State: 1 — Email Sent success screen ────────────────────────────────────
function SuccessScreen({
  email,
  onResend,
  resendCooldown,
  resendCount,
}: {
  email: string;
  onResend: () => void;
  resendCooldown: number;
  resendCount: number;
}) {
  return (
    <div className="fp-screen">
      <style dangerouslySetInnerHTML={{ __html: CARD_CSS }} />
      <div className="fp-card" role="status" aria-live="assertive">
        <div className="fp-icon fp-icon-green">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h2 className="fp-title">Check your inbox</h2>
        <p className="fp-desc">We sent a password reset link to:</p>
        <span className="fp-email">{email}</span>
        <span className="fp-expiry">The link expires in 1 hour.</span>

        <a href="mailto:" className="fp-btn-primary" id="fp-open-mail-btn">
          Open email app →
        </a>

        <div className="fp-resend-text">
          Didn&apos;t receive it? Check spam ·{" "}
          {resendCooldown > 0 ? (
            <span>Resend in {resendCooldown}s</span>
          ) : resendCount >= 3 ? (
            <span className="fp-resend-btn" style={{ cursor: "default" }}>Max resends reached</span>
          ) : (
            <button type="button" id="fp-resend-btn" onClick={onResend} className="fp-resend-btn">
              Resend link
            </button>
          )}
        </div>

        <Link href="/login" className="fp-back" id="fp-back-to-login">← Back to sign in</Link>
      </div>
    </div>
  );
}

// ─── State: 2 — Unverified account screen (403 handler) ──────────────────────
function UnverifiedScreen({ email }: { email: string }) {
  const router = useRouter();

  return (
    <div className="fp-screen">
      <style dangerouslySetInnerHTML={{ __html: CARD_CSS }} />
      <div className="fp-card" role="alert" aria-live="assertive">
        <div className="fp-icon fp-icon-amber">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2 className="fp-title">Verify your email first</h2>
        <p className="fp-desc">
          Your account for <strong>{email}</strong> hasn&apos;t been verified yet.
          You need to complete email verification before you can reset your password.
        </p>

        <ul className="fp-warn-list">
          <li>We just re-sent a 6-digit verification code to <strong>{email}</strong></li>
          <li>Enter the code to activate your account</li>
          <li>After that, you can use Forgot Password normally</li>
        </ul>

        <button
          id="fp-go-verify-btn"
          type="button"
          className="fp-btn-primary"
          onClick={() => router.push(`/verify-otp?email=${encodeURIComponent(email)}`)}
        >
          Enter verification code →
        </button>

        <Link
          href="/signup"
          id="fp-new-account-link"
          className="fp-btn-outline"
        >
          Create a new account instead
        </Link>

        <Link href="/login" className="fp-back" id="fp-unverified-back">← Back to sign in</Link>
      </div>
    </div>
  );
}

// ─── State: 3 — The normal forgot-password form ───────────────────────────────
export default function ForgotPasswordPage() {
  const { sendResetLink, isLoading, isSuccess, isUnverified, pendingEmail, error } =
    useForgotPassword();

  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Cooldown timer for resend button on success screen
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((n) => n - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleResend = () => {
    if (!pendingEmail || resendCount >= 3) return;
    sendResetLink(pendingEmail);
    setResendCount((c) => c + 1);
    setResendCooldown(60);
  };

  const onSubmit = (data: ForgotPasswordInput) => {
    sendResetLink(data.email);
  };

  // ── 403: unverified account ────────────────────────────────────────────────
  if (isUnverified && pendingEmail) {
    return <UnverifiedScreen email={pendingEmail} />;
  }

  // ── 200: reset link sent ───────────────────────────────────────────────────
  if (isSuccess && pendingEmail) {
    return (
      <SuccessScreen
        email={pendingEmail}
        onResend={handleResend}
        resendCooldown={resendCooldown}
        resendCount={resendCount}
      />
    );
  }

  // ── Default: form ──────────────────────────────────────────────────────────
  return (
    <AuthLayoutShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <style dangerouslySetInnerHTML={{ __html: FORM_CSS }} />

      <form
        id="forgot-password-form"
        onSubmit={handleSubmit(onSubmit)}
        className="fp-form-wrap"
        noValidate
      >
        {/* Generic server error */}
        {error && (
          <div className="fp-global-err" role="alert">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Email field */}
        <div className="fp-field">
          <label htmlFor="fp-email" className="fp-label">Email Address *</label>
          <input
            id="fp-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isLoading}
            {...register("email")}
            className={`fp-input${errors.email ? " err" : ""}`}
          />
          {errors.email && (
            <span className="fp-err-msg" role="alert">
              <span>⚠</span>{errors.email.message}
            </span>
          )}
        </div>

        {/* Submit */}
        <button
          id="fp-submit-btn"
          type="submit"
          disabled={isLoading}
          className="fp-submit"
        >
          {isLoading ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                style={{ animation: "fp-spin 0.8s linear infinite" }}>
                <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Sending…
            </>
          ) : (
            "Send reset link →"
          )}
        </button>
      </form>

      <div className="fp-footer-link">
        <Link href="/login" id="fp-form-back">← Back to sign in</Link>
      </div>
    </AuthLayoutShell>
  );
}
