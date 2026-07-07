"use client";

import { useState } from "react";
import Link from "next/link";

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

/* 3 steps: email → new password → done */
type Step = "email" | "reset" | "done";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ chars", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const strength = checks.filter((c) => c.pass).length;
  const colors = ["#E05252", "#E09052", "#F5C842", "#4A7C40"];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", gap: 5, marginBottom: 7 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i < strength ? colors[strength - 1] : "#E0D8C8", transition: "background 0.3s" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.78rem", color: strength > 0 ? colors[strength - 1] : "#9EA8A0", fontWeight: 600 }}>
          {strength > 0 ? labels[strength - 1] : ""}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {checks.map((c) => (
            <span key={c.label} style={{ fontSize: "0.72rem", color: c.pass ? "#4A7C40" : "#B0B8B2", display: "flex", alignItems: "center", gap: 3 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill={c.pass ? "#4A7C40" : "#D0D0D0"}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [pwErrors, setPwErrors] = useState<{ new?: string; confirm?: string }>({});
  const [pwLoading, setPwLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setEmailError("Email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Enter a valid email address"); return; }
    setEmailError("");
    setEmailLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setEmailLoading(false);
    setStep("reset");
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { new?: string; confirm?: string } = {};
    if (!newPassword) errs.new = "New password is required";
    else if (newPassword.length < 8) errs.new = "Password must be at least 8 characters";
    if (!confirmPassword) errs.confirm = "Please confirm your password";
    else if (newPassword !== confirmPassword) errs.confirm = "Passwords do not match";
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setPwErrors({});
    setPwLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setPwLoading(false);
    setStep("done");
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(Math.max(b.length, 4)) + c);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Poppins:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');

        .auth-root { min-height: 100vh; display: flex; font-family: 'DM Sans', sans-serif; background: #F5F0E8; overflow: hidden; }

        /* Left */
        .auth-panel-left {
          flex: 1;
          background: linear-gradient(145deg, #1a3d16 0%, #2D5A27 40%, #4A7C40 80%, #3a6b30 100%);
          position: relative; display: flex; flex-direction: column;
          justify-content: center; align-items: center; padding: 60px 48px; overflow: hidden;
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

        .left-brand { position: relative; z-index: 2; text-align: center; color: white; margin-bottom: 36px; }
        .left-brand .logo-icon { width: 72px; height: 72px; background: rgba(255,255,255,0.12); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); }
        .left-brand h1 { font-family: 'Playfair Display', serif; font-size: 2.8rem; font-weight: 800; margin-bottom: 12px; }
        .left-brand p { font-size: 1.05rem; opacity: 0.8; max-width: 320px; line-height: 1.6; margin: 0 auto; }

        /* Steps visual */
        .fp-steps { position: relative; z-index: 2; width: 100%; max-width: 340px; }
        .fp-step-item { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 14px; margin-bottom: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s; color: white; }
        .fp-step-item.active { background: rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.35); }
        .fp-step-item.done { background: rgba(168,197,160,0.2); border-color: rgba(168,197,160,0.4); }
        .fp-step-num { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: 'Poppins', sans-serif; flex-shrink: 0; background: rgba(255,255,255,0.12); font-size: 0.95rem; }
        .fp-step-item.active .fp-step-num { background: white; color: #2D5A27; }
        .fp-step-item.done .fp-step-num { background: #A8C5A0; color: #1a3d16; }
        .fp-step-text { font-size: 0.88rem; font-weight: 500; }
        .fp-step-sub { font-size: 0.76rem; opacity: 0.65; margin-top: 2px; }

        /* Right */
        .auth-panel-right { width: 520px; display: flex; flex-direction: column; justify-content: center; padding: 60px 56px; position: relative; background: #FDFAF5; }
        .auth-back-link { display: flex; align-items: center; gap: 8px; color: #6B7C6D; font-size: 0.875rem; font-weight: 500; text-decoration: none; transition: color 0.2s; padding: 8px 12px; border-radius: 8px; margin-bottom: 36px; width: fit-content; }
        .auth-back-link:hover { color: #2D5A27; background: #EDE8D8; }

        /* Step content animation */
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .step-content { animation: slideUp 0.35s ease; }

        .form-header { margin-bottom: 32px; }
        .form-header .icon-wrap { width: 64px; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .form-header h2 { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 800; color: #1a2e1b; margin-bottom: 8px; }
        .form-header p { color: #6B7C6D; font-size: 0.93rem; line-height: 1.6; }

        .field-group { margin-bottom: 20px; }
        .field-label { display: block; font-size: 0.84rem; font-weight: 600; color: #2D3A2E; margin-bottom: 7px; }
        .field-wrapper { position: relative; }
        .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #9EA8A0; display: flex; align-items: center; }
        .field-input { width: 100%; padding: 13px 14px 13px 44px; border: 1.5px solid #E0D8C8; border-radius: 12px; font-size: 0.93rem; font-family: 'DM Sans', sans-serif; color: #2D3A2E; background: white; transition: all 0.2s; outline: none; }
        .field-input::placeholder { color: #B8C0B9; }
        .field-input:focus { border-color: #2D5A27; box-shadow: 0 0 0 3px rgba(45,90,39,0.1); }
        .field-input.error { border-color: #E05252; }
        .field-input.error:focus { box-shadow: 0 0 0 3px rgba(224,82,82,0.1); }
        .field-error { display: flex; align-items: center; gap: 5px; margin-top: 6px; font-size: 0.8rem; color: #E05252; font-weight: 500; }
        .toggle-pw { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9EA8A0; display: flex; align-items: center; padding: 4px; border-radius: 6px; transition: color 0.2s; }
        .toggle-pw:hover { color: #2D5A27; }

        /* Email sent card */
        .sent-card { background: linear-gradient(135deg, #F0F7EE, #EDE8D8); border: 1px solid #D4E8CE; border-radius: 16px; padding: 20px; margin-bottom: 28px; display: flex; gap: 14px; align-items: flex-start; }
        .sent-card .si { width: 40px; height: 40px; background: linear-gradient(135deg, #2D5A27, #4A7C40); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .sent-card-text { font-size: 0.88rem; color: #2D3A2E; line-height: 1.5; }
        .sent-card-text strong { font-weight: 700; color: #1a2e1b; }

        /* Success */
        .success-state { text-align: center; padding: 20px 0; }
        @keyframes popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        .success-circle { width: 88px; height: 88px; background: linear-gradient(135deg, #2D5A27, #4A7C40); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 8px 32px rgba(45,90,39,0.35); }
        .success-state h2 { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 800; color: #1a2e1b; margin-bottom: 12px; }
        .success-state p { color: #6B7C6D; font-size: 0.93rem; line-height: 1.6; margin-bottom: 8px; }
        .confetti-emoji { font-size: 2rem; display: block; margin-bottom: 8px; animation: bounce 1s ease infinite; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        /* Buttons */
        .btn-primary { width: 100%; padding: 14px; background: linear-gradient(135deg, #2D5A27, #4A7C40); color: white; border: none; border-radius: 12px; font-size: 1rem; font-weight: 700; font-family: 'Poppins', sans-serif; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 20px rgba(45,90,39,0.3); }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(45,90,39,0.4); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-outline { width: 100%; padding: 13px; background: white; color: #2D5A27; border: 2px solid #2D5A27; border-radius: 12px; font-size: 0.95rem; font-weight: 700; font-family: 'Poppins', sans-serif; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; }
        .btn-outline:hover { background: #F5F0E8; }
        .spinner { width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-switch { text-align: center; margin-top: 24px; font-size: 0.9rem; color: #6B7C6D; }
        .auth-switch a { color: #2D5A27; font-weight: 700; text-decoration: none; margin-left: 4px; }
        .auth-switch a:hover { text-decoration: underline; }

        /* Progress bar */
        .progress-steps { display: flex; gap: 8px; margin-bottom: 36px; }
        .ps { flex: 1; height: 4px; border-radius: 999px; background: #E0D8C8; transition: background 0.4s; }
        .ps.done { background: #4A7C40; }
        .ps.active { background: #2D5A27; }

        @media (max-width: 900px) { .auth-panel-left { display: none; } .auth-panel-right { width: 100%; padding: 40px 24px; } }
        @media (max-width: 480px) { .auth-panel-right { padding: 28px 18px; } .form-header h2 { font-size: 1.6rem; } }
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
            <p>Forgot your password? No worries — we&apos;ll get you back in your garden in minutes.</p>
          </div>

          <div className="fp-steps">
            {[
              { n: 1, label: "Enter Email", sub: "We'll send a reset link", s: "email" },
              { n: 2, label: "Reset Password", sub: "Create a new secure password", s: "reset" },
              { n: 3, label: "All Done!", sub: "Sign in with new password", s: "done" },
            ].map((item) => {
              const isDone = (item.s === "email" && (step === "reset" || step === "done")) ||
                (item.s === "reset" && step === "done");
              const isActive = item.s === step;
              return (
                <div key={item.n} className={`fp-step-item${isActive ? " active" : ""}${isDone ? " done" : ""}`}>
                  <div className="fp-step-num">
                    {isDone ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                    ) : item.n}
                  </div>
                  <div>
                    <div className="fp-step-text">{item.label}</div>
                    <div className="fp-step-sub">{item.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-panel-right">

          {/* ── STEP 1: Email ── */}
          {step === "email" && (
            <div className="step-content">
              <Link href="/auth/login" className="auth-back-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Back to Login
              </Link>

              <div className="progress-steps">
                <div className="ps active" />
                <div className="ps" />
                <div className="ps" />
              </div>

              <div className="form-header">
                <div className="icon-wrap" style={{ background: "linear-gradient(135deg, #EDE8D8, #D4E8CE)" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2D5A27" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <circle cx="12" cy="16" r="1" fill="#2D5A27" />
                  </svg>
                </div>
                <h2>Forgot password?</h2>
                <p>Enter your registered email and we&apos;ll send you a secure link to reset your password.</p>
              </div>

              <form onSubmit={handleEmailSubmit} noValidate>
                <div className="field-group">
                  <label className="field-label" htmlFor="forgot-email">Email Address</label>
                  <div className="field-wrapper">
                    <span className="field-icon">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      id="forgot-email"
                      type="email"
                      className={`field-input${emailError ? " error" : ""}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  {emailError && (
                    <div className="field-error">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                      {emailError}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-primary" disabled={emailLoading} id="forgot-email-btn">
                  {emailLoading ? (
                    <><div className="spinner" />Sending reset link...</>
                  ) : (
                    <>
                      Send Reset Link
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <p className="auth-switch">
                Remember your password?
                <Link href="/auth/login">Sign in</Link>
              </p>
            </div>
          )}

          {/* ── STEP 2: New Password ── */}
          {step === "reset" && (
            <div className="step-content">
              <button
                className="auth-back-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                onClick={() => setStep("email")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Back
              </button>

              <div className="progress-steps">
                <div className="ps done" />
                <div className="ps active" />
                <div className="ps" />
              </div>

              {/* Email sent confirmation card */}
              <div className="sent-card">
                <div className="si">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="sent-card-text">
                  Reset link sent to <strong>{maskedEmail}</strong>. Check your spam folder if you don&apos;t see it. For this demo, directly set your new password below.
                </div>
              </div>

              <div className="form-header">
                <div className="icon-wrap" style={{ background: "linear-gradient(135deg, #EDE8D8, #D4E8CE)" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2D5A27" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h2>Create new password</h2>
                <p>Your new password must be strong and different from your previous password.</p>
              </div>

              <form onSubmit={handlePasswordReset} noValidate>
                <div className="field-group">
                  <label className="field-label" htmlFor="new-password">New Password</label>
                  <div className="field-wrapper">
                    <span className="field-icon">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="new-password"
                      type={showNewPw ? "text" : "password"}
                      className={`field-input${pwErrors.new ? " error" : ""}`}
                      placeholder="Create a strong password"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setPwErrors((p) => ({ ...p, new: undefined })); }}
                      autoComplete="new-password"
                    />
                    <button type="button" className="toggle-pw" onClick={() => setShowNewPw(!showNewPw)}>
                      {showNewPw
                        ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  <PasswordStrength password={newPassword} />
                  {pwErrors.new && <div className="field-error" style={{ marginTop: 8 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>{pwErrors.new}</div>}
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="reset-confirm-pw">Confirm New Password</label>
                  <div className="field-wrapper">
                    <span className="field-icon">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    <input
                      id="reset-confirm-pw"
                      type={showCpw ? "text" : "password"}
                      className={`field-input${pwErrors.confirm ? " error" : ""}`}
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setPwErrors((p) => ({ ...p, confirm: undefined })); }}
                      autoComplete="new-password"
                    />
                    <button type="button" className="toggle-pw" onClick={() => setShowCpw(!showCpw)}>
                      {showCpw
                        ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {confirmPassword && newPassword === confirmPassword && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: "0.8rem", color: "#4A7C40", fontWeight: 500 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                      Passwords match!
                    </div>
                  )}
                  {pwErrors.confirm && <div className="field-error"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>{pwErrors.confirm}</div>}
                </div>

                <button type="submit" className="btn-primary" disabled={pwLoading} id="reset-password-btn">
                  {pwLoading ? <><div className="spinner" />Resetting password...</> : <>Reset Password</>}
                </button>
              </form>
            </div>
          )}

          {/* ── STEP 3: Done ── */}
          {step === "done" && (
            <div className="step-content">
              <div className="progress-steps" style={{ marginBottom: 48 }}>
                <div className="ps done" />
                <div className="ps done" />
                <div className="ps done" />
              </div>

              <div className="success-state">
                <span className="confetti-emoji">🎉</span>
                <div className="success-circle">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2>Password Reset!</h2>
                <p>Your password has been successfully reset. You can now sign in with your new password.</p>
                <p style={{ marginTop: 4, fontSize: "0.82rem", color: "#9EA8A0" }}>Keep your new password safe and never share it.</p>

                <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 12 }}>
                  <Link href="/auth/login" className="btn-primary" id="goto-login-btn" style={{ justifyContent: "center", textDecoration: "none" }}>
                    Sign In Now
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link href="/" className="btn-outline" id="goto-home-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Return to Homepage
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
