import React from "react";
import Link from "next/link";

interface AuthLayoutShellProps {
  title: string;
  subtitle?: string;
  showLogoMark?: boolean;
  children: React.ReactNode;
}

export function AuthLayoutShell({
  title,
  subtitle,
  showLogoMark = true,
  children,
}: AuthLayoutShellProps) {
  return (
    <div className="auth-page">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        
        .auth-page {
          --auth-bg: #fefcf9;
          --auth-card-bg: #ffffff;
          --auth-card-border: rgb(202, 223, 212);
          --auth-card-shadow: 0 8px 32px rgba(0, 181, 102, 0.10);
          --auth-heading: #1c1c1c;
          --auth-body: #212326;
          --auth-muted: #6b7280;
          --auth-accent: #00b566;
          --auth-accent-hover: #009952;
          --auth-accent-light: #f0faf5;
          --auth-danger: #dc2626;
          --auth-danger-bg: #fef2f2;
          --auth-danger-border: #fca5a5;
          --auth-input-border: rgb(212, 212, 212);
          --auth-input-active: rgb(0, 146, 82);
          --auth-divider: #e5e7eb;
          --auth-social-bg: #f9fafb;
          --auth-social-border: #e5e7eb;
          --auth-success: #16a34a;
          --auth-success-bg: #f0fdf4;
          
          font-family: 'Outfit', sans-serif;
          background: var(--auth-bg);
          color: var(--auth-body);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .auth-page * {
          box-sizing: border-box;
          font-family: 'Outfit', sans-serif;
        }

        /* Header */
        .auth-header {
          position: sticky;
          top: 0;
          height: 60px;
          background: var(--auth-bg);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          border-bottom: 1px solid var(--auth-divider);
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 700;
          color: var(--auth-accent);
          text-decoration: none;
        }

        .auth-header-nav {
          display: flex;
          gap: 16px;
        }

        .auth-header-link {
          font-size: 13px;
          font-weight: 600;
          color: var(--auth-muted);
          text-decoration: none;
          transition: color 200ms;
        }

        .auth-header-link:hover {
          color: var(--auth-accent);
        }

        /* Container */
        .auth-content-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        /* Card */
        .auth-card {
          width: 100%;
          max-width: 480px;
          background: var(--auth-card-bg);
          border: 1px solid var(--auth-card-border);
          border-radius: 20px;
          box-shadow: var(--auth-card-shadow);
          padding: 32px;
          display: flex;
          flex-direction: column;
        }

        /* Brand Mark Header inside Card */
        .auth-brand-mark {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
          text-align: center;
        }

        .auth-brand-name {
          font-size: 18px;
          font-weight: 700;
          color: var(--auth-heading);
          margin-top: 4px;
        }

        .auth-brand-tagline {
          font-size: 12px;
          font-weight: 500;
          color: var(--auth-accent);
          margin-top: 2px;
        }

        .auth-title-section {
          text-align: center;
          margin-bottom: 28px;
        }

        .auth-page-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--auth-heading);
          margin: 0;
        }

        .auth-page-subtitle {
          font-size: 12px;
          font-weight: 500;
          color: var(--auth-muted);
          margin-top: 4px;
        }

        /* Footer */
        .auth-footer {
          padding: 24px;
          text-align: center;
          font-size: 11px;
          color: var(--auth-muted);
          border-top: 1px solid var(--auth-divider);
          margin-top: auto;
        }

        .auth-footer-links {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .auth-footer-link {
          color: var(--auth-muted);
          text-decoration: none;
        }

        .auth-footer-link:hover {
          text-decoration: underline;
        }

        /* Mobile adaptation */
        @media (max-width: 520px) {
          .auth-header {
            padding: 0 16px;
          }
          .auth-header-nav {
            display: none; /* simplified header on mobile */
          }
          .auth-content-container {
            padding: 0;
            align-items: flex-start;
          }
          .auth-card {
            border-radius: 0;
            border: none;
            box-shadow: none;
            min-height: calc(100vh - 120px);
            padding: 24px 16px;
          }
        }
      `}} />
      
      {/* Sticky Header */}
      <header className="auth-header">
        <Link href="/" className="auth-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(-10deg)" }}>
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8a7 7 0 0 1-9 10Z" />
            <path d="M9 22v-4" />
          </svg>
          <span>Hero Plants</span>
        </Link>
        <nav className="auth-header-nav">
          <Link href="/login" className="auth-header-link">Sign In</Link>
          <Link href="/signup" className="auth-header-link">Sign Up</Link>
        </nav>
      </header>

      {/* Card Shell */}
      <main className="auth-content-container">
        <div className="auth-card">
          {showLogoMark && (
            <div className="auth-brand-mark">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--auth-accent)", transform: "rotate(-10deg)" }}>
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8a7 7 0 0 1-9 10Z" />
                <path d="M9 22v-4" />
              </svg>
              <div className="auth-brand-name">Hero Plants</div>
              <div className="auth-brand-tagline">Your green companion</div>
            </div>
          )}

          <div className="auth-title-section">
            <h1 className="auth-page-title">{title}</h1>
            {subtitle && <p className="auth-page-subtitle">{subtitle}</p>}
          </div>

          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <div className="auth-footer-links">
          <Link href="/privacy" className="auth-footer-link">Privacy Policy</Link>
          <span>·</span>
          <Link href="/terms" className="auth-footer-link">Terms of Service</Link>
        </div>
        <div>© 2026 Hero Plants</div>
      </footer>
    </div>
  );
}
