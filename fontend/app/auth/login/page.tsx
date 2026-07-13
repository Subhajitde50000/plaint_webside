"use client";

import { useState } from "react";
import Link from "next/link";
import { useLogin } from "@/features/auth/hooks/useLogin";

/* ── Floating leaf SVG decoration ── */
function LeafDecor({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 60 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.18, ...style }}
    >
      <path
        d="M30 2C30 2 5 18 5 42C5 60 16 76 30 78C44 76 55 60 55 42C55 18 30 2 30 2Z"
        fill="#2D5A27"
      />
      <path d="M30 78V30" stroke="#A8C5A0" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 55L18 43" stroke="#A8C5A0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 44L42 32" stroke="#A8C5A0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [rememberMe, setRememberMe] = useState(false);

  // ── Real API hook ──────────────────────────────────────────────────────────
  const { login, isLoading: loading, error: apiError, isUnverified, isBlocked } = useLogin();

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    // Call real API — useLogin handles token storage, profile fetch, and redirect
    login(email, password);
  };

  // Alias for backward compat with existing JSX that uses `errors`
  const errors = fieldErrors;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Poppins:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');

        .auth-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #F5F0E8;
          position: relative;
          overflow: hidden;
        }

        /* Left panel */
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
        .left-brand {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
        }
        .left-brand .logo-icon {
          width: 72px;
          height: 72px;
          background: rgba(255,255,255,0.12);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .left-brand h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 12px;
          line-height: 1.1;
        }
        .left-brand p {
          font-size: 1.05rem;
          opacity: 0.8;
          max-width: 320px;
          line-height: 1.6;
          margin: 0 auto 40px;
        }
        .left-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          max-width: 340px;
          position: relative;
          z-index: 2;
        }
        .feature-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 14px 18px;
          backdrop-filter: blur(8px);
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .feature-pill .icon {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.15);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.1rem;
        }
        .bg-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }
        .bc1 { width: 300px; height: 300px; top: -80px; right: -80px; }
        .bc2 { width: 200px; height: 200px; bottom: 40px; left: -60px; }
        .bc3 { width: 140px; height: 140px; top: 45%; right: 20px; }

        /* Right panel */
        .auth-panel-right {
          width: 520px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 56px;
          position: relative;
          background: #FDFAF5;
        }
        .auth-back-link {
          position: absolute;
          top: 28px;
          left: 28px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6B7C6D;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
          padding: 8px 12px;
          border-radius: 8px;
        }
        .auth-back-link:hover { color: #2D5A27; background: #EDE8D8; }

        .auth-form-header { margin-bottom: 36px; }
        .auth-form-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 800;
          color: #1a2e1b;
          margin-bottom: 8px;
        }
        .auth-form-header p { color: #6B7C6D; font-size: 0.95rem; }

        /* Social buttons */
        .social-btns {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
        }
        .social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          border: 1.5px solid #E0D8C8;
          border-radius: 12px;
          background: white;
          color: #2D3A2E;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .social-btn:hover {
          border-color: #2D5A27;
          background: #F5F0E8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(45,90,39,0.1);
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
          color: #9EA8A0;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #E0D8C8;
        }

        /* Form fields */
        .field-group { margin-bottom: 20px; }
        .field-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #2D3A2E;
          margin-bottom: 8px;
        }
        .field-wrapper {
          position: relative;
        }
        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9EA8A0;
          display: flex;
          align-items: center;
        }
        .field-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          border: 1.5px solid #E0D8C8;
          border-radius: 12px;
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          color: #2D3A2E;
          background: white;
          transition: all 0.2s;
          outline: none;
        }
        .field-input::placeholder { color: #B8C0B9; }
        .field-input:focus {
          border-color: #2D5A27;
          box-shadow: 0 0 0 3px rgba(45,90,39,0.1);
        }
        .field-input.error { border-color: #E05252; }
        .field-input.error:focus { box-shadow: 0 0 0 3px rgba(224,82,82,0.1); }
        .field-error {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
          font-size: 0.8rem;
          color: #E05252;
          font-weight: 500;
        }
        .toggle-pw {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9EA8A0;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 6px;
          transition: color 0.2s;
        }
        .toggle-pw:hover { color: #2D5A27; }

        .form-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          margin-top: -4px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          color: #6B7C6D;
          user-select: none;
        }
        .checkbox-label input[type=checkbox] { 
          accent-color: #2D5A27; 
          width: 16px; 
          height: 16px; 
          cursor: pointer;
        }
        .forgot-link {
          font-size: 0.875rem;
          color: #2D5A27;
          font-weight: 600;
          text-decoration: none;
        }
        .forgot-link:hover { text-decoration: underline; }

        /* Submit button */
        .btn-primary {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #2D5A27, #4A7C40);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(45,90,39,0.3);
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(45,90,39,0.4);
        }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .btn-primary:hover::before { opacity: 1; }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-switch {
          text-align: center;
          margin-top: 24px;
          font-size: 0.9rem;
          color: #6B7C6D;
        }
        .auth-switch a {
          color: #2D5A27;
          font-weight: 700;
          text-decoration: none;
          margin-left: 4px;
        }
        .auth-switch a:hover { text-decoration: underline; }

        /* Float animations for leaves */
        @keyframes leafFloat1 { 0%,100%{transform:translateY(0) rotate(-5deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
        @keyframes leafFloat2 { 0%,100%{transform:translateY(0) rotate(8deg)} 50%{transform:translateY(-12px) rotate(-2deg)} }
        .leaf-1 { animation: leafFloat1 7s ease-in-out infinite; }
        .leaf-2 { animation: leafFloat2 9s ease-in-out infinite 2s; }
        .leaf-3 { animation: leafFloat1 11s ease-in-out infinite 4s; }

        @media (max-width: 900px) {
          .auth-panel-left { display: none; }
          .auth-panel-right { width: 100%; padding: 48px 28px; }
        }
        @media (max-width: 480px) {
          .auth-panel-right { padding: 32px 20px; }
          .auth-form-header h2 { font-size: 1.6rem; }
          .social-btns { flex-direction: column; }
        }
      `}</style>

      <div className="auth-root">
        {/* Left decorative panel */}
        <div className="auth-panel-left">
          <div className="bg-circle bc1" />
          <div className="bg-circle bc2" />
          <div className="bg-circle bc3" />

          <LeafDecor style={{ width: 120, height: 160, top: 60, right: 40 }} />
          <LeafDecor style={{ width: 80, height: 100, bottom: 120, left: 20 }} />
          <LeafDecor style={{ width: 60, height: 80, top: "40%", left: 60 }} />

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
            <p>Your green paradise awaits. Sign in to explore thousands of plants & expert care tips.</p>
          </div>

          <div className="left-features">
            {[
              { icon: "🌿", text: "1000+ curated plants & seeds" },
              { icon: "🤖", text: "AI-powered plant care assistant" },
              { icon: "🚚", text: "Free delivery on orders ₹499+" },
              { icon: "⭐", text: "Trusted by 50,000+ plant lovers" },
            ].map((f) => (
              <div className="feature-pill" key={f.text}>
                <div className="icon">{f.icon}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-panel-right">
          <Link href="/" className="auth-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Home
          </Link>

          <div className="auth-form-header">
            <h2>Welcome back 👋</h2>
            <p>Sign in to your GreenLeaf account</p>
          </div>

          {/* Social Login */}
          <div className="social-btns">
            <button className="social-btn" id="google-login-btn" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="social-btn" id="apple-login-btn" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Apple
            </button>
          </div>

          <div className="divider">or sign in with email</div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label className="field-label" htmlFor="login-email">Email Address</label>
              <div className="field-wrapper">
                <span className="field-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="login-email"
                  type="email"
                  className={`field-input${errors.email ? " error" : ""}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <div className="field-error">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  {errors.email}
                </div>
              )}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="login-password">Password</label>
              <div className="field-wrapper">
                <span className="field-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className={`field-input${errors.password ? " error" : ""}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="field-error">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  {errors.password}
                </div>
              )}
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  id="remember-me"
                />
                Remember me
              </label>
              <Link href="/auth/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account?
            <Link href="/auth/signup">Create one free</Link>
          </p>
        </div>
      </div>
    </>
  );
}
