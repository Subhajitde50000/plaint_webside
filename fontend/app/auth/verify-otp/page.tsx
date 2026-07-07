"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LeafDecor({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.18, ...style }}>
      <path d="M30 2C30 2 5 18 5 42C5 60 16 76 30 78C44 76 55 60 55 42C55 18 30 2 30 2Z" fill="#2D5A27" />
      <path d="M30 78V30" stroke="#A8C5A0" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 55L18 43" stroke="#A8C5A0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 44L42 32" stroke="#A8C5A0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Animated check mark on success ── */
function SuccessCheck() {
  return (
    <div style={{
      width: 80, height: 80,
      background: "linear-gradient(135deg, #2D5A27, #4A7C40)",
      borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      margin: "0 auto 24px",
      animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      boxShadow: "0 8px 32px rgba(45,90,39,0.35)",
    }}>
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

function OTPContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your@email.com";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* countdown timer */
  useEffect(() => {
    if (resendTimer <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setResendTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = cleaned;
    setOtp(next);
    setError("");
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const next = [...otp];
      pasted.split("").forEach((ch, i) => { if (i < 6) next[i] = ch; });
      setOtp(next);
      const focusIdx = Math.min(pasted.length, 5);
      inputRefs.current[focusIdx]?.focus();
    }
  };

  const handleVerify = useCallback(async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the complete 6-digit code"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    // Simulate success (in real app, verify against backend)
    if (code === "123456") {
      setError("Invalid OTP. Please try again.");
      return;
    }
    setSuccess(true);
    setTimeout(() => { window.location.href = "/"; }, 2500);
  }, [otp]);

  const handleResend = async () => {
    setResending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setResending(false);
    setCanResend(false);
    setResendTimer(59);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(Math.max(b.length, 3)) + c);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Poppins:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');

        .auth-root { min-height: 100vh; display: flex; font-family: 'DM Sans', sans-serif; background: #F5F0E8; overflow: hidden; }

        .auth-panel-left {
          flex: 1;
          background: linear-gradient(145deg, #1a3d16 0%, #2D5A27 40%, #4A7C40 80%, #3a6b30 100%);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 48px;
          overflow: hidden;
        }
        .auth-panel-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .bg-circle { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.04); }
        .bc1 { width: 300px; height: 300px; top: -80px; right: -80px; }
        .bc2 { width: 200px; height: 200px; bottom: 40px; left: -60px; }

        .left-brand { position: relative; z-index: 2; text-align: center; color: white; margin-bottom: 40px; }
        .left-brand .logo-icon { width: 72px; height: 72px; background: rgba(255,255,255,0.12); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); }
        .left-brand h1 { font-family: 'Playfair Display', serif; font-size: 2.8rem; font-weight: 800; margin-bottom: 12px; }
        .left-brand p { font-size: 1.05rem; opacity: 0.8; max-width: 320px; line-height: 1.6; margin: 0 auto; }

        .otp-illustration {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 340px;
        }
        .otp-card {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(12px);
          text-align: center;
          color: white;
        }
        .otp-card .mail-icon {
          width: 64px; height: 64px;
          background: rgba(255,255,255,0.15);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .otp-card h3 { font-family: 'Playfair Display', serif; font-size: 1.3rem; margin-bottom: 8px; }
        .otp-card p { font-size: 0.88rem; opacity: 0.75; line-height: 1.5; }
        .otp-dots { display: flex; justify-content: center; gap: 8px; margin-top: 20px; }
        .otp-dot { width: 32px; height: 12px; border-radius: 6px; background: rgba(255,255,255,0.2); }
        .otp-dot.active { background: rgba(255,255,255,0.7); }
        .security-note { display: flex; align-items: center; gap: 10px; margin-top: 16px; background: rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 14px; }
        .security-note span { font-size: 0.82rem; opacity: 0.8; text-align: left; }

        /* Right panel */
        .auth-panel-right { width: 520px; display: flex; flex-direction: column; justify-content: center; padding: 60px 56px; position: relative; background: #FDFAF5; }
        .auth-back-link { display: flex; align-items: center; gap: 8px; color: #6B7C6D; font-size: 0.875rem; font-weight: 500; text-decoration: none; transition: color 0.2s; padding: 8px 12px; border-radius: 8px; margin-bottom: 32px; width: fit-content; }
        .auth-back-link:hover { color: #2D5A27; background: #EDE8D8; }

        /* Success state */
        .success-state { text-align: center; padding: 20px 0; }
        .success-state h2 { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 800; color: #1a2e1b; margin-bottom: 12px; }
        .success-state p { color: #6B7C6D; font-size: 0.95rem; line-height: 1.6; }
        @keyframes popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        .redirect-bar { margin: 24px auto 0; max-width: 200px; height: 4px; background: #E0D8C8; border-radius: 999px; overflow: hidden; }
        .redirect-fill { height: 100%; background: linear-gradient(90deg,#2D5A27,#4A7C40); border-radius: 999px; animation: fillBar 2.5s linear forwards; }
        @keyframes fillBar { from{width:0%} to{width:100%} }

        /* Normal state header */
        .otp-header { text-align: center; margin-bottom: 32px; }
        .otp-header .email-icon-wrap { width: 72px; height: 72px; background: linear-gradient(135deg,#EDE8D8,#D4E8CE); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .otp-header h2 { font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 800; color: #1a2e1b; margin-bottom: 8px; }
        .otp-header p { color: #6B7C6D; font-size: 0.92rem; line-height: 1.6; }
        .email-badge { display: inline-flex; align-items: center; gap: 6px; background: #EDE8D8; color: #2D5A27; font-size: 0.85rem; font-weight: 700; padding: 5px 14px; border-radius: 999px; margin: 10px 0 0; }

        /* OTP inputs */
        .otp-inputs { display: flex; gap: 10px; justify-content: center; margin-bottom: 10px; }
        .otp-input-box {
          width: 52px; height: 60px;
          border: 2px solid #E0D8C8;
          border-radius: 14px;
          font-size: 1.6rem;
          font-weight: 800;
          font-family: 'Poppins', sans-serif;
          text-align: center;
          color: #1a2e1b;
          background: white;
          outline: none;
          transition: all 0.2s;
          caret-color: #2D5A27;
        }
        .otp-input-box:focus { border-color: #2D5A27; box-shadow: 0 0 0 3px rgba(45,90,39,0.12); transform: scale(1.05); }
        .otp-input-box.filled { border-color: #4A7C40; background: #F0F7EE; }
        .otp-input-box.error-box { border-color: #E05252; animation: shake 0.4s; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }

        .otp-error { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 10px; font-size: 0.83rem; color: #E05252; font-weight: 500; }

        /* Timer */
        .resend-section { text-align: center; margin-top: 28px; }
        .timer-display { font-size: 0.88rem; color: #9EA8A0; margin-bottom: 8px; }
        .timer-num { font-weight: 700; color: #4A7C40; font-family: 'Poppins', sans-serif; }
        .resend-btn { background: none; border: none; color: #2D5A27; font-size: 0.9rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 6px 12px; border-radius: 8px; transition: background 0.2s; }
        .resend-btn:hover:not(:disabled) { background: #EDE8D8; }
        .resend-btn:disabled { color: #9EA8A0; cursor: not-allowed; }

        /* Verify button */
        .btn-primary { width: 100%; padding: 14px; background: linear-gradient(135deg, #2D5A27, #4A7C40); color: white; border: none; border-radius: 12px; font-size: 1rem; font-weight: 700; font-family: 'Poppins', sans-serif; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 20px rgba(45,90,39,0.3); margin-top: 28px; }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(45,90,39,0.4); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .spinner { width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .change-email-link { display: block; text-align: center; margin-top: 16px; font-size: 0.87rem; color: #6B7C6D; }
        .change-email-link a { color: #2D5A27; font-weight: 600; text-decoration: none; }
        .change-email-link a:hover { text-decoration: underline; }

        .progress-dots { display: flex; justify-content: center; gap: 6px; margin-bottom: 32px; }
        .pdot { width: 8px; height: 8px; border-radius: 50%; background: #E0D8C8; transition: all 0.3s; }
        .pdot.active { background: #2D5A27; width: 24px; border-radius: 4px; }
        .pdot.done { background: #4A7C40; }

        @media (max-width: 900px) { .auth-panel-left { display: none; } .auth-panel-right { width: 100%; padding: 40px 24px; } }
        @media (max-width: 480px) { .otp-input-box { width: 44px; height: 54px; font-size: 1.4rem; } .otp-inputs { gap: 7px; } }
      `}</style>

      <div className="auth-root">
        {/* Left Panel */}
        <div className="auth-panel-left">
          <div className="bg-circle bc1" />
          <div className="bg-circle bc2" />
          <LeafDecor style={{ width: 120, height: 160, top: 60, right: 40 }} />
          <LeafDecor style={{ width: 80, height: 100, bottom: 120, left: 20 }} />

          <div className="left-brand">
            <div className="logo-icon">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M18 3C18 3 6 9 6 20C6 27 11 33 18 33C25 33 30 27 30 20C30 9 18 3 18 3Z" fill="white" opacity="0.9" />
                <path d="M18 33V14" stroke="#4A7C40" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 24L12 18" stroke="#4A7C40" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M18 19L24 13" stroke="#4A7C40" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h1>GreenLeaf</h1>
            <p>One last step! Verify your email to start exploring our green world.</p>
          </div>

          <div className="otp-illustration">
            <div className="otp-card">
              <div className="mail-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h3>Check your inbox</h3>
              <p>We&apos;ve sent a 6-digit verification code to your email address.</p>
              <div className="otp-dots">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`otp-dot${otp[i] ? " active" : ""}`} />
                ))}
              </div>
            </div>
            <div className="security-note">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Your code expires in 10 minutes. Never share it with anyone.</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-panel-right">
          {success ? (
            <div className="success-state">
              <SuccessCheck />
              <h2>Email Verified! 🎉</h2>
              <p>Your account has been successfully verified.<br />Welcome to the GreenLeaf family!</p>
              <div className="redirect-bar"><div className="redirect-fill" /></div>
              <p style={{ marginTop: 12, fontSize: "0.82rem", color: "#9EA8A0" }}>Redirecting to homepage...</p>
            </div>
          ) : (
            <>
              <Link href="/auth/signup" className="auth-back-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Back
              </Link>

              {/* Progress dots */}
              <div className="progress-dots">
                <div className="pdot done" />
                <div className="pdot done" />
                <div className="pdot active" />
              </div>

              <div className="otp-header">
                <div className="email-icon-wrap">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D5A27" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h2>Verify your email</h2>
                <p>Enter the 6-digit code we&apos;ve sent to</p>
                <div className="email-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {maskedEmail}
                </div>
              </div>

              {/* OTP Input Boxes */}
              <div className="otp-inputs" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    id={`otp-input-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`otp-input-box${digit ? " filled" : ""}${error ? " error-box" : ""}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    autoFocus={i === 0}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
              {error && (
                <div className="otp-error">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                  {error}
                </div>
              )}

              {/* Resend section */}
              <div className="resend-section">
                {canResend ? (
                  <button
                    className="resend-btn"
                    onClick={handleResend}
                    disabled={resending}
                    id="resend-otp-btn"
                  >
                    {resending ? "Sending..." : "↺ Resend Code"}
                  </button>
                ) : (
                  <p className="timer-display">
                    Resend code in <span className="timer-num">0:{String(resendTimer).padStart(2, "0")}</span>
                  </p>
                )}
              </div>

              {/* Verify Button */}
              <button
                className="btn-primary"
                onClick={handleVerify}
                disabled={loading || otp.join("").length < 6}
                id="verify-otp-btn"
              >
                {loading ? (
                  <><div className="spinner" /> Verifying...</>
                ) : (
                  <>
                    Verify & Continue
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              <p className="change-email-link">
                Wrong email? <Link href="/auth/signup">Change email address</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',fontFamily:'DM Sans, sans-serif',color:'#6B7C6D'}}>Loading...</div>}>
      <OTPContent />
    </Suspense>
  );
}
