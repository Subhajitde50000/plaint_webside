"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignUp } from "@/features/auth/hooks/useSignUp";

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

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special char", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const strength = checks.filter((c) => c.pass).length;
  const colors = ["#E05252", "#E09052", "#F5C842", "#4A7C40"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  if (!password) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            flex: 1,
            height: 4,
            borderRadius: 999,
            background: i < strength ? colors[strength - 1] : "#E0D8C8",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.78rem", color: strength > 0 ? colors[strength - 1] : "#9EA8A0", fontWeight: 600 }}>
          {strength > 0 ? labels[strength - 1] : ""}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {checks.map((c) => (
            <span key={c.label} style={{ fontSize: "0.72rem", color: c.pass ? "#4A7C40" : "#9EA8A0", display: "flex", alignItems: "center", gap: 3 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill={c.pass ? "#4A7C40" : "#D0D0D0"}>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState(1); // 1 = personal, 2 = security

  const update = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validateStep1 = () => {
    const errs: Errors = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) errs.phone = "Enter a valid 10-digit phone number";
    return errs;
  };

  const validateStep2 = () => {
    const errs: Errors = {};
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!agreed) errs.confirmPassword = (errs.confirmPassword || "") + " | Please agree to terms";
    return errs;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
  };

  // ── Real API hook ──────────────────────────────────────────────────────────
  const { signUp, isLoading: apiLoading, isEmailTaken, error: apiError } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    // Show email-taken error inline
    if (isEmailTaken) {
      setErrors({ email: "An account with this email already exists." });
      return;
    }
    // Call real API — useSignUp redirects to /auth/verify-otp?email=... on success
    signUp({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone || undefined,
      password: form.password,
    });
  };

  // Expose loading state (real API or local)
  const loading = apiLoading;

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
        .left-brand { position: relative; z-index: 2; text-align: center; color: white; }
        .left-brand .logo-icon { width: 72px; height: 72px; background: rgba(255,255,255,0.12); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); }
        .left-brand h1 { font-family: 'Playfair Display', serif; font-size: 2.8rem; font-weight: 800; margin-bottom: 12px; }
        .left-brand p { font-size: 1.05rem; opacity: 0.8; max-width: 320px; line-height: 1.6; margin: 0 auto 40px; }
        .left-steps { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 340px; position: relative; z-index: 2; }
        .step-pill { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 14px 18px; backdrop-filter: blur(8px); color: white; font-size: 0.9rem; font-weight: 500; }
        .step-pill .snum { width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 700; font-family: 'Poppins', sans-serif; }
        .step-pill.active { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.4); }
        .step-pill.done .snum { background: #A8C5A0; color: #1a3d16; }

        .auth-panel-right { width: 560px; display: flex; flex-direction: column; justify-content: center; padding: 48px 56px; position: relative; background: #FDFAF5; overflow-y: auto; }
        .auth-back-link { position: absolute; top: 28px; left: 28px; display: flex; align-items: center; gap: 8px; color: #6B7C6D; font-size: 0.875rem; font-weight: 500; text-decoration: none; transition: color 0.2s; padding: 8px 12px; border-radius: 8px; }
        .auth-back-link:hover { color: #2D5A27; background: #EDE8D8; }

        .progress-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; margin-top: 20px; }
        .prog-step { flex: 1; height: 4px; border-radius: 999px; background: #E0D8C8; transition: background 0.4s; }
        .prog-step.active { background: #2D5A27; }
        .prog-step.done { background: #4A7C40; }
        .prog-label { font-size: 0.78rem; color: #9EA8A0; font-weight: 600; white-space: nowrap; }

        .auth-form-header { margin-bottom: 28px; }
        .auth-form-header h2 { font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 800; color: #1a2e1b; margin-bottom: 6px; }
        .auth-form-header p { color: #6B7C6D; font-size: 0.93rem; }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .field-group { margin-bottom: 18px; }
        .field-label { display: block; font-size: 0.84rem; font-weight: 600; color: #2D3A2E; margin-bottom: 7px; }
        .field-wrapper { position: relative; }
        .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #9EA8A0; display: flex; align-items: center; }
        .field-input { width: 100%; padding: 12px 14px 12px 42px; border: 1.5px solid #E0D8C8; border-radius: 12px; font-size: 0.93rem; font-family: 'DM Sans', sans-serif; color: #2D3A2E; background: white; transition: all 0.2s; outline: none; }
        .field-input::placeholder { color: #B8C0B9; }
        .field-input:focus { border-color: #2D5A27; box-shadow: 0 0 0 3px rgba(45,90,39,0.1); }
        .field-input.error { border-color: #E05252; }
        .field-input.error:focus { box-shadow: 0 0 0 3px rgba(224,82,82,0.1); }
        .field-error { display: flex; align-items: center; gap: 5px; margin-top: 5px; font-size: 0.78rem; color: #E05252; font-weight: 500; }
        .toggle-pw { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9EA8A0; display: flex; align-items: center; padding: 4px; border-radius: 6px; transition: color 0.2s; }
        .toggle-pw:hover { color: #2D5A27; }

        .terms-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 24px; }
        .terms-row input[type=checkbox] { accent-color: #2D5A27; width: 16px; height: 16px; margin-top: 2px; cursor: pointer; flex-shrink: 0; }
        .terms-text { font-size: 0.84rem; color: #6B7C6D; line-height: 1.5; }
        .terms-text a { color: #2D5A27; font-weight: 600; text-decoration: none; }
        .terms-text a:hover { text-decoration: underline; }

        .btn-primary { width: 100%; padding: 14px; background: linear-gradient(135deg, #2D5A27, #4A7C40); color: white; border: none; border-radius: 12px; font-size: 1rem; font-weight: 700; font-family: 'Poppins', sans-serif; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 20px rgba(45,90,39,0.3); }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(45,90,39,0.4); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-secondary { width: 100%; padding: 13px; background: white; color: #2D5A27; border: 2px solid #2D5A27; border-radius: 12px; font-size: 0.95rem; font-weight: 700; font-family: 'Poppins', sans-serif; cursor: pointer; transition: all 0.2s; margin-bottom: 12px; }
        .btn-secondary:hover { background: #F5F0E8; }
        .spinner { width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .social-btns { display: flex; gap: 12px; margin-bottom: 24px; }
        .social-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 11px; border: 1.5px solid #E0D8C8; border-radius: 12px; background: white; color: #2D3A2E; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .social-btn:hover { border-color: #2D5A27; background: #F5F0E8; transform: translateY(-1px); }
        .divider { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; color: #9EA8A0; font-size: 0.8rem; font-weight: 500; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #E0D8C8; }

        .auth-switch { text-align: center; margin-top: 20px; font-size: 0.9rem; color: #6B7C6D; }
        .auth-switch a { color: #2D5A27; font-weight: 700; text-decoration: none; margin-left: 4px; }
        .auth-switch a:hover { text-decoration: underline; }

        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .step-content { animation: slideIn 0.3s ease; }

        @media (max-width: 900px) { .auth-panel-left { display: none; } .auth-panel-right { width: 100%; padding: 48px 28px; } }
        @media (max-width: 480px) { .auth-panel-right { padding: 28px 18px; } .field-row { grid-template-columns: 1fr; } }
      `}</style>

      <div className="auth-root">
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
            <p>Join 50,000+ plant lovers. Create your account and start your green journey today.</p>
          </div>

          <div className="left-steps">
            {[
              { n: 1, label: "Personal Info", sub: "Name, email & phone" },
              { n: 2, label: "Set Password", sub: "Secure your account" },
              { n: 3, label: "Verify OTP", sub: "Confirm your email" },
            ].map((s) => (
              <div key={s.n} className={`step-pill${step === s.n ? " active" : ""}${step > s.n ? " done" : ""}`}>
                <div className="snum">
                  {step > s.n ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                  ) : s.n}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{s.label}</div>
                  <div style={{ fontSize: "0.78rem", opacity: 0.75 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-panel-right">
          <Link href="/" className="auth-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Home
          </Link>

          <div className="progress-bar">
            <div className={`prog-step${step >= 1 ? " active" : ""}`} />
            <div className={`prog-step${step >= 2 ? " active" : ""}`} />
            <span className="prog-label">Step {step} of 2</span>
          </div>

          {step === 1 && (
            <div className="step-content">
              <div className="auth-form-header">
                <h2>Create your account 🌱</h2>
                <p>Start your plant journey — it takes less than a minute</p>
              </div>

              {/* Social Signup */}
              <div className="social-btns">
                <button className="social-btn" id="google-signup-btn" type="button">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </div>
              <div className="divider">or fill in your details</div>

              <form onSubmit={handleNext} noValidate>
                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label" htmlFor="first-name">First Name *</label>
                    <div className="field-wrapper">
                      <span className="field-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input id="first-name" type="text" className={`field-input${errors.firstName ? " error" : ""}`} placeholder="John" value={form.firstName} onChange={update("firstName")} />
                    </div>
                    {errors.firstName && <div className="field-error"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>{errors.firstName}</div>}
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="last-name">Last Name *</label>
                    <div className="field-wrapper">
                      <span className="field-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input id="last-name" type="text" className={`field-input${errors.lastName ? " error" : ""}`} placeholder="Doe" value={form.lastName} onChange={update("lastName")} />
                    </div>
                    {errors.lastName && <div className="field-error"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>{errors.lastName}</div>}
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="signup-email">Email Address *</label>
                  <div className="field-wrapper">
                    <span className="field-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input id="signup-email" type="email" className={`field-input${errors.email ? " error" : ""}`} placeholder="you@example.com" value={form.email} onChange={update("email")} autoComplete="email" />
                  </div>
                  {errors.email && <div className="field-error"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>{errors.email}</div>}
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="signup-phone">Phone Number <span style={{color:"#9EA8A0",fontWeight:400}}>(optional)</span></label>
                  <div className="field-wrapper">
                    <span className="field-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.07 6.07l1.16-1.42a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </span>
                    <input id="signup-phone" type="tel" className={`field-input${errors.phone ? " error" : ""}`} placeholder="+91 98765 43210" value={form.phone} onChange={update("phone")} />
                  </div>
                  {errors.phone && <div className="field-error"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>{errors.phone}</div>}
                </div>

                <button type="submit" className="btn-primary" id="signup-next-btn">
                  Continue
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <div className="auth-form-header">
                <h2>Secure your account 🔐</h2>
                <p>Create a strong password to protect your GreenLeaf account</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="field-group">
                  <label className="field-label" htmlFor="signup-password">Password *</label>
                  <div className="field-wrapper">
                    <span className="field-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input id="signup-password" type={showPw ? "text" : "password"} className={`field-input${errors.password ? " error" : ""}`} placeholder="Create a strong password" value={form.password} onChange={update("password")} autoComplete="new-password" />
                    <button type="button" className="toggle-pw" onClick={() => setShowPw(!showPw)}>
                      {showPw ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                       : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                    </button>
                  </div>
                  <PasswordStrength password={form.password} />
                  {errors.password && <div className="field-error" style={{marginTop:8}}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>{errors.password}</div>}
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="confirm-password">Confirm Password *</label>
                  <div className="field-wrapper">
                    <span className="field-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                      </svg>
                    </span>
                    <input id="confirm-password" type={showCpw ? "text" : "password"} className={`field-input${errors.confirmPassword ? " error" : ""}`} placeholder="Repeat your password" value={form.confirmPassword} onChange={update("confirmPassword")} autoComplete="new-password" />
                    <button type="button" className="toggle-pw" onClick={() => setShowCpw(!showCpw)}>
                      {showCpw ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                       : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                    </button>
                  </div>
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <div style={{display:'flex',alignItems:'center',gap:6,marginTop:6,fontSize:'0.8rem',color:'#4A7C40',fontWeight:500}}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      Passwords match!
                    </div>
                  )}
                  {errors.confirmPassword && <div className="field-error"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>{errors.confirmPassword}</div>}
                </div>

                <div className="terms-row">
                  <input type="checkbox" id="agree-terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                  <label htmlFor="agree-terms" className="terms-text" style={{cursor:'pointer'}}>
                    I agree to GreenLeaf&apos;s <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. I consent to receiving emails about my orders and plant care tips.
                  </label>
                </div>

                <button type="button" className="btn-secondary" onClick={() => setStep(1)} id="signup-back-btn">
                  ← Back
                </button>
                <button type="submit" className="btn-primary" disabled={loading} id="signup-submit-btn">
                  {loading ? <><div className="spinner" />Creating account...</> : <>Create Account 🌱</>}
                </button>
              </form>
            </div>
          )}

          <p className="auth-switch">
            Already have an account?
            <Link href="/auth/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
