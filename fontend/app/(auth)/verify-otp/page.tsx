"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayoutShell } from "@/features/auth/components/AuthLayoutShell";
import { OtpInput } from "@/features/auth/components/OtpInput";
import { useVerifyOtp } from "@/features/auth/hooks/useVerifyOtp";

function VerifyOtpFormContent() {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState<string[]>(Array(6).fill(""));
  
  const {
    email,
    verify,
    resend,
    isVerifying,
    isResending,
    isSuccess,
    isExpired,
    verifyError,
    verifyErrorCode,
    resendSuccess,
    resendError,
    formattedTime,
    canResend,
    resendIn,
  } = useVerifyOtp();

  // Handle redirect after successful verification
  useEffect(() => {
    if (isSuccess) {
      const t = setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(email)}&verified=true`);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, router, email]);

  const handleOtpChange = (newVal: string[]) => {
    setOtpValue(newVal);
  };

  const handleComplete = (otp: string) => {
    verify(otp);
  };

  const handleManualVerify = () => {
    const code = otpValue.join("");
    if (code.length === 6) {
      verify(code);
    }
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
            animation: scaleBounce 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .success-title {
            font-size: 20px;
            font-weight: 700;
            color: #1c1c1c;
            margin: 0 0 8px 0;
          }

          .success-desc {
            font-size: 13px;
            color: #212326;
            margin: 0 0 24px 0;
          }

          .success-redirect-msg {
            font-size: 12px;
            color: #6b7280;
            font-style: italic;
          }

          .success-manual-btn {
            height: 48px;
            padding: 0 24px;
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
            margin-top: 16px;
            transition: background 200ms;
          }

          .success-manual-btn:hover {
            background: #009952;
          }

          @keyframes scaleBounce {
            0% { transform: scale(0.5); opacity: 0; }
            80% { transform: scale(1.08); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}} />
        <div className="success-card" role="status" aria-live="assertive">
          <div className="success-icon-container">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="success-title">Email verified!</h2>
          <p className="success-desc">Welcome to Hero Plants 🌿</p>
          <p className="success-redirect-msg">Taking you to your account...</p>
          <Link href={`/login?email=${encodeURIComponent(email)}&verified=true`} className="success-manual-btn">
            Go to my account →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthLayoutShell title="Verify your email" showLogoMark={true}>
      <style dangerouslySetInnerHTML={{ __html: `
        .otp-desc {
          font-size: 13px;
          color: var(--auth-body);
          text-align: center;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .otp-email-display {
          font-weight: 700;
          display: block;
          margin-top: 4px;
        }

        .otp-change-link {
          font-size: 12px;
          color: var(--auth-accent);
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          margin-top: 4px;
        }

        .otp-change-link:hover {
          text-decoration: underline;
        }

        .otp-btn-submit {
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
          margin-top: 12px;
        }

        .otp-btn-submit:hover:not(:disabled) {
          background: var(--auth-accent-hover);
          transform: scale(1.01);
          box-shadow: 0 4px 16px rgba(0, 181, 102, 0.30);
        }

        .otp-btn-submit:active:not(:disabled) {
          transform: scale(0.98);
        }

        .otp-btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .otp-resend-section {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: var(--auth-muted);
        }

        .otp-timer {
          font-weight: 600;
          color: var(--auth-accent);
          margin-left: 4px;
        }

        .otp-resend-btn {
          background: none;
          border: none;
          color: var(--auth-accent);
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          font-size: 13px;
          transition: color 200ms;
        }

        .otp-resend-btn:hover:not(:disabled) {
          text-decoration: underline;
          color: var(--auth-accent-hover);
        }

        .otp-resend-btn:disabled {
          color: var(--auth-muted);
          cursor: not-allowed;
        }

        .otp-error-msg {
          font-size: 12px;
          font-weight: 500;
          color: var(--auth-danger);
          background: var(--auth-danger-bg);
          border: 1px solid var(--auth-danger-border);
          border-left: 4px solid var(--auth-danger);
          border-radius: 8px;
          padding: 12px 16px;
          margin: 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .otp-success-msg {
          font-size: 12px;
          font-weight: 500;
          color: var(--auth-success);
          background: var(--auth-success-bg);
          border: 1px solid rgb(202, 223, 212);
          border-left: 4px solid var(--auth-success);
          border-radius: 8px;
          padding: 12px 16px;
          margin: 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}} />

      <p className="otp-desc">
        We sent a 6-digit code to
        <span className="otp-email-display">{email || "your email"}</span>
        <Link href="/signup" className="otp-change-link">Change email →</Link>
      </p>

      {/* Verification Error */}
      {verifyError && (
        <div className="otp-error-msg" role="alert">
          <span>⚠</span>
          <span>
            {verifyErrorCode === 429
              ? "Too many attempts. Please resend a new code."
              : verifyError}
          </span>
        </div>
      )}

      {/* Resend success notice */}
      {resendSuccess && !resendError && (
        <div className="otp-success-msg" role="status" aria-live="polite">
          <span>✓</span>
          <span>A new code has been sent.</span>
        </div>
      )}

      {/* Resend failure notice */}
      {resendError && (
        <div className="otp-error-msg" role="alert">
          <span>⚠</span>
          <span>{resendError}</span>
        </div>
      )}

      {/* OTP inputs */}
      <OtpInput
        value={otpValue}
        onChange={handleOtpChange}
        onComplete={handleComplete}
        hasError={!!verifyError}
        disabled={isVerifying || isExpired}
      />

      {/* Manual verification fallback button */}
      <button
        type="button"
        onClick={handleManualVerify}
        disabled={otpValue.join("").length < 6 || isVerifying || isExpired}
        className="otp-btn-submit"
      >
        {isVerifying ? (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-spin" style={{ animation: "spin 1s linear infinite", marginRight: "4px" }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Verifying...
          </>
        ) : (
          "Verify email →"
        )}
      </button>

      {/* Timer / Resend triggers */}
      <div className="otp-resend-section">
        {!isExpired ? (
          <p aria-live="polite">
            Didn't receive the code? Resend in
            <span className="otp-timer">{formattedTime}</span>
          </p>
        ) : (
          <p>
            Code expired.{" "}
            <button
              onClick={() => resend()}
              disabled={isResending || !canResend}
              className="otp-resend-btn"
              aria-label="Resend verification code"
            >
              {isResending ? "Resending..." : "Resend code →"}
            </button>
          </p>
        )}

        {isExpired && !canResend && resendIn > 0 && (
          <p style={{ fontSize: "11px", color: "var(--auth-danger)", marginTop: "4px" }}>
            Too many resends. Please wait {formattedTime} minutes.
          </p>
        )}
      </div>
    </AuthLayoutShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpFormContent />
    </Suspense>
  );
}
