"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MOCK_REVIEWS,
  KPI_DATA,
  Review,
  ReviewStatus,
  REJECTION_REASONS,
  REPLY_TEMPLATES,
  countByStatus,
} from "./data";

/* ─── Design Tokens ─────────────────────────────────────────────────────────── */
const T = {
  bg: "#0f1117",
  card: "#1c2128",
  elevated: "#22272e",
  overlay: "#2d333b",
  text: "#cdd9e5",
  muted: "#768390",
  label: "#adbac7",
  placeholder: "#545d68",
  border: "#444c56",
  borderMuted: "rgba(68,76,86,0.5)",
  borderActive: "#00b566",
  accent: "#00b566",
  accentBg: "rgba(0,181,102,0.12)",
  success: "#57ab5a",
  successBg: "rgba(87,171,90,0.15)",
  warning: "#c69026",
  warningBg: "rgba(198,144,38,0.15)",
  error: "#e5534b",
  errorBg: "rgba(229,83,75,0.15)",
  info: "#539bf5",
  infoBg: "rgba(83,159,245,0.15)",
  purple: "#986ee2",
  purpleBg: "rgba(152,110,226,0.15)",
  starFill: "#c8a84b",
  shadow: "0 2px 8px rgba(0,0,0,0.35)",
  focus: "0 0 0 3px rgba(0,181,102,0.25)",
};

/* ─── Icon Library ───────────────────────────────────────────────────────────── */
const Icon = {
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
  Filter: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  Star: ({ filled }: { filled: boolean }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? T.starFill : "none"} stroke={filled ? T.starFill : T.border} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  StarLg: ({ filled }: { filled: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? T.starFill : "none"} stroke={filled ? T.starFill : T.border} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  ),
  XLg: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  ),
  MoreVert: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  ),
  Reply: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Flag: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Settings: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  ),
  Feature: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Analytics: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><path d="M2 20h20" />
    </svg>
  ),
  Edit: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  User: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  ArrowUpRight: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7h10v10" /><path d="M7 17 17 7" />
    </svg>
  ),
  Clock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Mail: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
  ),
};

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/* ─── Star Rating Component ─────────────────────────────────────────────────── */
function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const StarComp = size === "lg" ? Icon.StarLg : Icon.Star;
  return (
    <span className="rev-stars" aria-label={`${rating} out of 5 stars`} style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} aria-hidden="true">
          <StarComp filled={s <= rating} />
        </span>
      ))}
    </span>
  );
}

/* ─── Status Badge ───────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: ReviewStatus | "featured" }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    published: { bg: T.successBg, color: T.success, label: "Published" },
    pending:   { bg: T.warningBg, color: T.warning, label: "Pending" },
    rejected:  { bg: T.errorBg,   color: T.error,   label: "Rejected" },
    flagged:   { bg: T.errorBg,   color: T.error,   label: "Flagged" },
    featured:  { bg: T.purpleBg,  color: T.purple,  label: "Featured" },
  };
  const c = cfg[status] ?? cfg.pending;
  return (
    <span
      aria-label={`Status: ${c.label}`}
      style={{
        background: c.bg,
        color: c.color,
        fontSize: 11,
        fontWeight: 700,
        borderRadius: 9999,
        padding: "2px 8px",
        display: "inline-block",
        letterSpacing: "0.02em",
      }}
    >
      {c.label}
    </span>
  );
}

/* ─── Toast ──────────────────────────────────────────────────────────────────── */
interface ToastMsg { id: number; text: string; type: "success" | "error" | "info" }
function Toast({ toasts, remove }: { toasts: ToastMsg[]; remove: (id: number) => void }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: T.overlay,
            border: `1px solid ${t.type === "success" ? T.success : t.type === "error" ? T.error : T.info}`,
            borderRadius: 8,
            padding: "12px 16px",
            color: T.text,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            animation: "slideInRight 0.2s ease",
            minWidth: 280,
          }}
        >
          <span style={{ color: t.type === "success" ? T.success : t.type === "error" ? T.error : T.info, fontSize: 16 }}>
            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
          </span>
          <span style={{ flex: 1 }}>{t.text}</span>
          <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", padding: 2 }}>
            <Icon.X />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Bulk Confirm Modal ─────────────────────────────────────────────────────── */
function BulkModal({
  type,
  count,
  onCancel,
  onConfirm,
}: {
  type: "approve" | "reject" | "delete";
  count: number;
  onCancel: () => void;
  onConfirm: (extra?: { reason?: string; notify?: boolean; feature?: boolean }) => void;
}) {
  const [reason, setReason] = useState("");
  const [notify, setNotify] = useState(false);
  const [feature, setFeature] = useState(false);
  const [reasonError, setReasonError] = useState(false);

  const isDestruct = type === "reject" || type === "delete";
  const titles = {
    approve: `Approve ${count} Review${count > 1 ? "s" : ""}?`,
    reject: `Reject ${count} Review${count > 1 ? "s" : ""}?`,
    delete: `Delete ${count} Review${count > 1 ? "s" : ""} Permanently?`,
  };

  function handleConfirm() {
    if (type === "reject" && !reason) {
      setReasonError(true);
      return;
    }
    onConfirm({ reason, notify, feature });
  }

  return (
    <div
      role={isDestruct ? "alertdialog" : "dialog"}
      aria-modal="true"
      aria-label={titles[type]}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(15,17,23,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.overlay, border: `1px solid ${T.border}`, borderRadius: 12,
          padding: 28, width: 440, boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <h3 style={{ color: type === "delete" ? T.error : T.text, fontSize: 16, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            {type === "delete" && <Icon.AlertTriangle />}
            {titles[type]}
          </h3>
          <button onClick={onCancel} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer" }}>
            <Icon.XLg />
          </button>
        </div>

        <p style={{ color: T.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
          {type === "approve" && "These reviews will be published immediately and become visible on their product pages."}
          {type === "reject" && "Select a reason that applies to all selected reviews."}
          {type === "delete" && "This cannot be undone. Reviews are removed entirely, not just unpublished."}
        </p>

        {type === "approve" && (
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 20 }}>
            <input type="checkbox" checked={feature} onChange={(e) => setFeature(e.target.checked)} style={{ accentColor: T.accent }} />
            <span style={{ color: T.label, fontSize: 13 }}>Feature all selected reviews</span>
          </label>
        )}

        {type === "reject" && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              Rejection Reason (required)
            </label>
            <select
              aria-required="true"
              value={reason}
              onChange={(e) => { setReason(e.target.value); setReasonError(false); }}
              style={{
                width: "100%", background: T.elevated, border: `1px solid ${reasonError ? T.error : T.border}`,
                borderRadius: 6, padding: "8px 12px", color: reason ? T.text : T.placeholder, fontSize: 13,
                outline: "none",
              }}
            >
              <option value="">Select a reason</option>
              {REJECTION_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {reasonError && <p style={{ color: T.error, fontSize: 12, marginTop: 4 }}>Select a reason before rejecting.</p>}
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 12 }}>
              <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} style={{ accentColor: T.accent }} />
              <span style={{ color: T.label, fontSize: 13 }}>Notify customers of rejection via email</span>
            </label>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              background: "none", border: `1px solid ${T.border}`, borderRadius: 6,
              padding: "8px 18px", color: T.text, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              background: type === "approve" ? T.accent : T.error, border: "none", borderRadius: 6,
              padding: "8px 18px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}
          >
            {type === "approve" ? `Approve ${count} Review${count > 1 ? "s" : ""}` :
              type === "reject" ? `Reject ${count} Review${count > 1 ? "s" : ""}` :
                `Delete ${count} Review${count > 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Review Detail Drawer ───────────────────────────────────────────────────── */
function ReviewDrawer({
  review,
  onClose,
  onApprove,
  onReject,
  onReply,
  onFeatureToggle,
  onDelete,
}: {
  review: Review;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string, notify: boolean) => void;
  onReply: (id: string, text: string) => void;
  onFeatureToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [notifyCustomer, setNotifyCustomer] = useState(false);
  const [reasonError, setReasonError] = useState(false);

  const [replyText, setReplyText] = useState(review.adminReply ?? "");
  const [replyTemplate, setReplyTemplate] = useState<keyof typeof REPLY_TEMPLATES>("Thank You");
  const [approveState, setApproveState] = useState<"idle" | "loading" | "success">("idle");
  const [rejectState, setRejectState] = useState<"idle" | "loading">("idle");
  const [replyState, setReplyState] = useState<"idle" | "loading" | "success">("idle");

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const MAX_REPLY = 1000;
  const replyLen = replyText.length;

  useEffect(() => {
    closeRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleApprove() {
    setApproveState("loading");
    setTimeout(() => {
      onApprove(review.id);
      setApproveState("success");
      setTimeout(onClose, 800);
    }, 600);
  }

  function handleReject() {
    if (!rejectReason) { setReasonError(true); return; }
    setRejectState("loading");
    setTimeout(() => {
      onReject(review.id, rejectReason, notifyCustomer);
      onClose();
    }, 600);
  }

  function handleReply() {
    if (!replyText.trim() || replyLen > MAX_REPLY) return;
    setReplyState("loading");
    setTimeout(() => {
      onReply(review.id, replyText);
      setReplyState("success");
      setTimeout(onClose, 600);
    }, 600);
  }

  function applyTemplate(tpl: keyof typeof REPLY_TEMPLATES) {
    setReplyTemplate(tpl);
    const fn = REPLY_TEMPLATES[tpl];
    setReplyText(fn(review.reviewerName.split(" ")[0]));
  }

  const canApprove = review.status === "pending" || review.status === "rejected" || review.status === "flagged";
  const canReject = review.status === "pending" || review.status === "flagged";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 8000,
          background: "rgba(15,17,23,0.70)",
          animation: "fadeIn 0.2s ease",
        }}
      />
      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Review detail"
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: 480,
          background: T.card, borderLeft: `1px solid ${T.border}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          zIndex: 8100, overflowY: "auto",
          animation: "slideInRight 0.25s ease",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: `1px solid ${T.borderMuted}`,
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          position: "sticky", top: 0, background: T.card, zIndex: 1,
        }}>
          <div>
            <h2 id="drawer-heading" style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>
              Review Detail
            </h2>
            <p style={{ fontSize: 12, color: T.muted, margin: "2px 0 0" }}>{review.id}</p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close review detail"
            style={{
              background: "none", border: "none", color: T.muted, cursor: "pointer",
              padding: 6, borderRadius: 6, transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
          >
            <Icon.XLg />
          </button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Reviewer & Product Info */}
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: T.accentBg, border: `1px solid ${T.borderActive}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: T.accent, flexShrink: 0,
              }}>
                {review.reviewerAvatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{review.reviewerName}</span>
                  {review.isVerifiedPurchase && (
                    <span aria-label="Verified purchase" style={{ fontSize: 11, color: T.success, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                      <Icon.Check /> Verified Purchase
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: T.muted, margin: "2px 0 6px", display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon.Mail /> {review.reviewerEmail}
                </p>
                <button style={{
                  background: "none", border: "none", color: T.accent, fontSize: 12, cursor: "pointer",
                  padding: 0, display: "flex", alignItems: "center", gap: 4,
                }}>
                  <Icon.User /> View Customer Profile <Icon.ArrowUpRight />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 14px", background: T.elevated, borderRadius: 8, border: `1px solid ${T.borderMuted}` }}>
              {[
                { label: "Product", value: `${review.productName} — ${review.productVariant}`, link: true },
                { label: "Order", value: `#${review.orderId}`, link: true },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", gap: 8, fontSize: 13 }}>
                  <span style={{ color: T.muted, width: 60, flexShrink: 0 }}>{row.label}:</span>
                  <span style={{ color: T.text, fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, fontSize: 13 }}>
                <span style={{ color: T.muted, width: 60, flexShrink: 0 }}>Submitted:</span>
                <span style={{ color: T.muted, display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon.Clock /> {formatDateTime(review.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Rating & Review Text */}
          <div style={{ padding: "14px 16px", background: T.elevated, borderRadius: 8, border: `1px solid ${T.borderMuted}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <StarRating rating={review.rating} size="lg" />
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{review.rating} / 5</span>
              <span style={{ marginLeft: "auto" }}>
                <StatusBadge status={review.isFeatured ? "featured" : review.status} />
              </span>
            </div>
            {review.title && (
              <p style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 6 }}>&ldquo;{review.title}&rdquo;</p>
            )}
            <p style={{ fontSize: 13, color: T.text, lineHeight: 1.7, margin: 0 }}>
              {review.body || <em style={{ color: T.muted }}>(No written review)</em>}
            </p>
          </div>

          {/* Flag / Report Details */}
          {review.flagCount > 0 && (
            <div
              role="region"
              aria-label={`Reported ${review.flagCount} times`}
              style={{
                background: T.errorBg, border: `1px solid ${T.error}`, borderRadius: 8, padding: "12px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ color: T.error }}><Icon.Flag /></span>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.error }}>Reported {review.flagCount} time{review.flagCount > 1 ? "s" : ""}</span>
              </div>
              {review.flags.map((flag, i) => (
                <div key={i}>
                  {i > 0 && <div style={{ height: 1, background: T.borderMuted, margin: "8px 0" }} />}
                  <p style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: 0 }}>Report {i + 1}: &ldquo;{flag.reason}&rdquo;</p>
                  <p style={{ fontSize: 12, color: T.muted, margin: "2px 0 0" }}>Reported by: {flag.reportedBy} · {formatDate(flag.date)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Moderation Actions */}
          <div style={{ background: T.elevated, border: `1px solid ${T.borderMuted}`, borderRadius: 8, padding: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
              Moderation
            </h3>

            {canApprove && (
              <button
                onClick={handleApprove}
                aria-busy={approveState === "loading"}
                disabled={approveState !== "idle"}
                style={{
                  width: "100%", height: 44, background: approveState === "success" ? T.success : T.accent,
                  border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 700,
                  cursor: approveState === "idle" ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  marginBottom: 10, transition: "all 0.2s",
                  opacity: approveState !== "idle" ? 0.8 : 1,
                }}
              >
                {approveState === "loading" ? (
                  <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                ) : approveState === "success" ? (
                  <><Icon.Check /> Published</>
                ) : (
                  <><Icon.Check /> Approve &amp; Publish</>
                )}
              </button>
            )}

            {canReject && !rejectOpen && (
              <button
                onClick={() => setRejectOpen(true)}
                style={{
                  width: "100%", height: 40, background: "none",
                  border: `1px solid ${T.error}`, borderRadius: 6,
                  color: T.error, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <Icon.X /> Reject
              </button>
            )}

            {canReject && rejectOpen && (
              <div style={{ marginTop: 4, animation: "slideDown 0.2s ease" }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                  Rejection Reason (required)
                </label>
                <select
                  aria-required="true"
                  value={rejectReason}
                  onChange={(e) => { setRejectReason(e.target.value); setReasonError(false); }}
                  style={{
                    width: "100%", background: T.bg, border: `1px solid ${reasonError ? T.error : T.border}`,
                    borderRadius: 6, padding: "8px 12px",
                    color: rejectReason ? T.text : T.placeholder, fontSize: 13, outline: "none", marginBottom: 8,
                  }}
                >
                  <option value="">Select a reason</option>
                  {REJECTION_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                {reasonError && <p style={{ color: T.error, fontSize: 12, marginBottom: 8 }}>Select a reason before rejecting this review.</p>}
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 10 }}>
                  <input type="checkbox" checked={notifyCustomer} onChange={(e) => setNotifyCustomer(e.target.checked)} style={{ accentColor: T.accent }} />
                  <span style={{ color: T.label, fontSize: 12 }}>Notify customer of rejection via email</span>
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => { setRejectOpen(false); setRejectReason(""); }}
                    style={{
                      flex: 1, height: 36, background: "none", border: `1px solid ${T.border}`,
                      borderRadius: 6, color: T.muted, fontSize: 13, cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    aria-busy={rejectState === "loading"}
                    style={{
                      flex: 2, height: 36, background: T.error, border: "none",
                      borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 700,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    {rejectState === "loading" ? (
                      <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    ) : <><Icon.X /> Confirm Rejection</>}
                  </button>
                </div>
              </div>
            )}

            {/* Feature toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.borderMuted}` }}>
              <span style={{ fontSize: 13, color: T.label }}>Feature this review</span>
              <button
                role="switch"
                aria-checked={review.isFeatured}
                onClick={() => {
                  if (review.status !== "published") return;
                  onFeatureToggle(review.id);
                }}
                disabled={review.status !== "published"}
                style={{
                  width: 44, height: 24, borderRadius: 12,
                  background: review.isFeatured ? T.accent : T.border,
                  border: "none", cursor: review.status === "published" ? "pointer" : "not-allowed",
                  position: "relative", transition: "background 0.2s",
                  opacity: review.status !== "published" ? 0.4 : 1,
                }}
              >
                <span style={{
                  position: "absolute", top: 3, left: review.isFeatured ? 23 : 3,
                  width: 18, height: 18, borderRadius: "50%", background: "#fff",
                  transition: "left 0.2s",
                }} />
              </button>
            </div>
          </div>

          {/* Admin Reply Composer */}
          <div style={{ background: T.elevated, border: `1px solid ${T.borderMuted}`, borderRadius: 8, padding: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
              Store Reply
            </h3>

            <div style={{ marginBottom: 10 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                Template
              </label>
              <select
                value={replyTemplate}
                onChange={(e) => applyTemplate(e.target.value as keyof typeof REPLY_TEMPLATES)}
                style={{
                  width: "100%", background: T.bg, border: `1px solid ${T.border}`,
                  borderRadius: 6, padding: "7px 10px", color: T.text, fontSize: 13, outline: "none",
                }}
              >
                {(Object.keys(REPLY_TEMPLATES) as Array<keyof typeof REPLY_TEMPLATES>).map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <textarea
              aria-label="Store reply to review"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={5}
              style={{
                width: "100%", background: T.bg, border: `1px solid ${replyLen > MAX_REPLY ? T.error : T.border}`,
                borderRadius: 6, padding: "10px 12px", color: T.text, fontSize: 13,
                resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6,
                boxSizing: "border-box",
              }}
              placeholder="Write a reply visible to all customers on this review..."
            />
            <div style={{
              display: "flex", justifyContent: "flex-end", marginTop: 4,
              fontSize: 12,
              color: replyLen > MAX_REPLY * 0.9 ? (replyLen > MAX_REPLY ? T.error : T.warning) : T.muted,
            }}
              aria-live="polite"
            >
              {replyLen} / {MAX_REPLY}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                style={{
                  flex: 1, height: 36, background: "none", border: `1px solid ${T.border}`,
                  borderRadius: 6, color: T.muted, fontSize: 13, cursor: "pointer",
                }}
              >
                Save as Draft
              </button>
              <button
                onClick={handleReply}
                disabled={!replyText.trim() || replyLen > MAX_REPLY || replyState !== "idle"}
                style={{
                  flex: 2, height: 36, background: T.accent, border: "none",
                  borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 700,
                  cursor: (!replyText.trim() || replyLen > MAX_REPLY) ? "not-allowed" : "pointer",
                  opacity: (!replyText.trim() || replyLen > MAX_REPLY) ? 0.5 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                {replyState === "loading" ? (
                  <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                ) : replyState === "success" ? "✓ Posted!" : (
                  <><Icon.Reply /> Post Reply</>
                )}
              </button>
            </div>
          </div>

          {/* Moderation History */}
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
              History
            </h3>
            <div role="log" aria-label="Moderation history" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[...review.moderationHistory].reverse().map((entry, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 12 }}>
                  <span style={{ color: T.muted, flexShrink: 0, minWidth: 120 }}>{formatDateTime(entry.at)}</span>
                  <span style={{ color: T.text, fontWeight: 500, flexShrink: 0, minWidth: 80 }}>{entry.by}</span>
                  <span style={{ color: T.muted }}>{entry.action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div style={{ paddingTop: 16, borderTop: `1px solid ${T.borderMuted}` }}>
            <button
              onClick={() => { onDelete(review.id); onClose(); }}
              style={{
                width: "100%", height: 36, background: "none", border: `1px solid ${T.error}`,
                borderRadius: 6, color: T.error, fontSize: 13, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <Icon.Trash /> Delete Permanently
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Main Page Component ────────────────────────────────────────────────────── */
const PAGE_SIZE = 10;
type TabStatus = "pending" | "all" | "published" | "rejected" | "flagged";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [activeTab, setActiveTab] = useState<TabStatus>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerReview, setDrawerReview] = useState<Review | null>(null);
  const [bulkModal, setBulkModal] = useState<"approve" | "reject" | "delete" | null>(null);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const toastIdRef = useRef(0);

  /* --- Helpers --- */
  function addToast(text: string, type: ToastMsg["type"] = "success") {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }

  /* --- Filtered / sorted reviews --- */
  const filtered = useMemo(() => {
    let r = reviews;
    if (activeTab !== "all") r = r.filter((x) => x.status === activeTab || (activeTab === "flagged" && x.flagCount > 0));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(
        (x) =>
          x.reviewerName.toLowerCase().includes(q) ||
          x.reviewerEmail.toLowerCase().includes(q) ||
          x.productName.toLowerCase().includes(q) ||
          x.body.toLowerCase().includes(q)
      );
    }
    const sortMap: Record<string, (a: Review, b: Review) => number> = {
      newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      oldest: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      "highest-rating": (a, b) => b.rating - a.rating,
      "lowest-rating": (a, b) => a.rating - b.rating,
    };
    return [...r].sort(sortMap[sortBy] ?? sortMap.newest);
  }, [reviews, activeTab, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  /* --- Counts --- */
  const counts = useMemo(() => ({
    pending: reviews.filter((r) => r.status === "pending").length,
    all: reviews.length,
    published: reviews.filter((r) => r.status === "published").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
    flagged: reviews.filter((r) => r.flagCount > 0).length,
  }), [reviews]);

  /* --- Selection --- */
  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }
  function toggleSelectAll() {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((r) => r.id)));
    }
  }

  /* --- Actions --- */
  function handleApprove(id: string) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "published" as ReviewStatus, moderationHistory: [...r.moderationHistory, { action: "Approved & published", at: new Date().toISOString(), by: "Admin" }] }
          : r
      )
    );
    addToast("Review approved and published.");
  }

  function handleReject(id: string, reason: string, notify: boolean) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "rejected" as ReviewStatus, moderationHistory: [...r.moderationHistory, { action: `Rejected (${reason})`, at: new Date().toISOString(), by: "Admin" }] }
          : r
      )
    );
    addToast("Review rejected." + (notify ? " Customer notified." : ""));
  }

  function handleReply(id: string, text: string) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, adminReply: text, adminReplyAt: new Date().toISOString(), adminReplyBy: "Admin", moderationHistory: [...r.moderationHistory, { action: "Admin reply posted", at: new Date().toISOString(), by: "Admin" }] }
          : r
      )
    );
    addToast("Reply posted.");
  }

  function handleFeatureToggle(id: string) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, isFeatured: !r.isFeatured, status: !r.isFeatured ? "featured" as ReviewStatus : "published" as ReviewStatus }
          : r
      )
    );
    const rev = reviews.find((r) => r.id === id);
    addToast(rev?.isFeatured ? "Review removed from featured." : "Review featured on product page.");
  }

  function handleDelete(id: string) {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    addToast("Review deleted permanently.", "info");
  }

  function handleBulkConfirm(extra?: { reason?: string; notify?: boolean; feature?: boolean }) {
    const ids = Array.from(selectedIds);
    if (bulkModal === "approve") {
      ids.forEach((id) => handleApprove(id));
      addToast(`${ids.length} review${ids.length > 1 ? "s" : ""} approved and published.`);
    } else if (bulkModal === "reject") {
      ids.forEach((id) => handleReject(id, extra?.reason ?? "", extra?.notify ?? false));
      addToast(`${ids.length} review${ids.length > 1 ? "s" : ""} rejected.`);
    } else if (bulkModal === "delete") {
      setReviews((prev) => prev.filter((r) => !selectedIds.has(r.id)));
      addToast(`${ids.length} review${ids.length > 1 ? "s" : ""} deleted permanently.`, "info");
    }
    setSelectedIds(new Set());
    setBulkModal(null);
  }

  /* --- Close menus on outside click --- */
  useEffect(() => {
    function handle() { setOpenMenuId(null); setFilterOpen(false); setSortOpen(false); }
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, []);

  const TABS: { key: TabStatus; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "all", label: "All" },
    { key: "published", label: "Published" },
    { key: "rejected", label: "Rejected" },
    { key: "flagged", label: "Flagged" },
  ];

  const SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "highest-rating", label: "Highest Rating" },
    { value: "lowest-rating", label: "Lowest Rating" },
  ];

  return (
    <>
      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        * { box-sizing: border-box; }
        :focus-visible { outline: 2px solid #00b566 !important; outline-offset: 2px; box-shadow: 0 0 0 3px rgba(0,181,102,0.25); }
        select, textarea { -webkit-appearance: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0f1117; }
        ::-webkit-scrollbar-thumb { background: #444c56; border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Outfit', 'Inter', sans-serif", padding: 24 }}>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: T.muted, display: "flex", alignItems: "center", gap: 6 }}>
            <Link href="/admin" style={{ color: T.muted, textDecoration: "none" }}>Admin</Link>
            <span>/</span>
            <span style={{ color: T.text }} aria-current="page">Reviews</span>
          </span>
        </nav>

        {/* Page Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>Reviews</h1>
            <p style={{ fontSize: 13, color: T.muted, margin: "4px 0 0" }}>
              {KPI_DATA.totalReviews.toLocaleString()} total reviews &middot; {KPI_DATA.avgRating} average rating &middot; {counts.pending} pending
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/admin/reviews/analytics" style={{ textDecoration: "none" }}>
              <button style={{
                background: "none", border: `1px solid ${T.border}`, borderRadius: 6,
                padding: "8px 14px", color: T.label, fontSize: 13, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              }}>
                <Icon.Analytics /> Analytics
              </button>
            </Link>
            <button style={{
              background: "none", border: `1px solid ${T.border}`, borderRadius: 6,
              padding: "8px 14px", color: T.label, fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}>
              <Icon.Download /> Export
            </button>
            <button style={{
              background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 6,
              padding: "8px 14px", color: T.label, fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}>
              <Icon.Settings /> Settings
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div
          role="region"
          aria-label="Review metrics"
          style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}
        >
          {[
            { label: "Average Rating", value: `${KPI_DATA.avgRating} ★`, sub: `↑ ${KPI_DATA.ratingChange} (30d)`, accent: false },
            { label: "Total Reviews", value: KPI_DATA.totalReviews.toLocaleString(), sub: `↑ ${KPI_DATA.totalChange} (30d)`, accent: false },
            { label: "Pending", value: counts.pending, sub: "Needs review", accent: "warning" as const },
            { label: "Flagged", value: counts.flagged, sub: "Needs review", accent: "error" as const },
            { label: "Response Rate", value: `${KPI_DATA.responseRate}%`, sub: "of reviews", accent: false },
          ].map((kpi) => (
            <button
              key={kpi.label}
              aria-label={`${kpi.label}: ${kpi.value}`}
              onClick={() => {
                if (kpi.label === "Pending") setActiveTab("pending");
                else if (kpi.label === "Flagged") setActiveTab("flagged");
              }}
              style={{
                background: T.card,
                border: `1px solid ${kpi.accent === "warning" ? `rgba(198,144,38,0.4)` : kpi.accent === "error" ? `rgba(229,83,75,0.4)` : T.borderMuted}`,
                borderLeft: kpi.accent === "warning" ? `3px solid ${T.warning}` : kpi.accent === "error" ? `3px solid ${T.error}` : `1px solid ${T.borderMuted}`,
                borderRadius: 8, padding: "20px 18px",
                textAlign: "left", cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.elevated)}
              onMouseLeave={(e) => (e.currentTarget.style.background = T.card)}
            >
              <p style={{ fontSize: 12, fontWeight: 500, color: T.muted, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{kpi.label}</p>
              <p style={{
                fontSize: 28, fontWeight: 800, margin: "0 0 4px",
                color: kpi.accent === "warning" ? T.warning : kpi.accent === "error" ? T.error : T.text,
              }}>
                {kpi.value}
              </p>
              <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>{kpi.sub}</p>
            </button>
          ))}
        </div>

        {/* Status Filter Tabs */}
        <div
          role="tablist"
          aria-label="Review status filter"
          style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const isFlagged = tab.key === "flagged" && counts.flagged > 0;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => { setActiveTab(tab.key); setCurrentPage(1); setSelectedIds(new Set()); }}
                style={{
                  height: 36, padding: "0 14px", borderRadius: 6,
                  border: `1px solid ${isActive ? T.accent : T.border}`,
                  background: isActive ? (tab.key === "flagged" ? T.error : T.accent) : "transparent",
                  color: isActive ? "#fff" : isFlagged ? T.error : T.muted,
                  fontSize: 13, fontWeight: isActive ? 700 : 500,
                  cursor: "pointer", transition: "all 0.15s",
                  animation: isFlagged && !isActive ? "pulse 2s ease-in-out 3" : "none",
                }}
              >
                {tab.label} ({counts[tab.key]})
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "0 0 320px" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.muted, pointerEvents: "none" }}>
              <Icon.Search />
            </span>
            <input
              type="search"
              aria-label="Search reviews"
              placeholder="Search reviews, products, customers..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{
                width: "100%", height: 36, background: T.elevated,
                border: `1px solid ${T.border}`, borderRadius: 6,
                paddingLeft: 34, paddingRight: 12, color: T.text, fontSize: 13, outline: "none",
              }}
            />
          </div>

          {/* Filter */}
          <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setFilterOpen((o) => !o)}
              style={{
                height: 36, padding: "0 12px", background: T.elevated,
                border: `1px solid ${T.border}`, borderRadius: 6,
                color: T.label, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <Icon.Filter /> Filter <Icon.ChevronDown />
            </button>
            {filterOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0,
                background: T.overlay, border: `1px solid ${T.border}`, borderRadius: 8,
                padding: 16, zIndex: 100, width: 220, boxShadow: T.shadow,
                animation: "slideDown 0.15s ease",
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>Rating</p>
                {[5, 4, 3, 2, 1].map((r) => (
                  <label key={r} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
                    <input type="checkbox" style={{ accentColor: T.accent }} />
                    <StarRating rating={r} />
                    <span style={{ fontSize: 12, color: T.muted }}>{r} star</span>
                  </label>
                ))}
                <div style={{ height: 1, background: T.borderMuted, margin: "10px 0" }} />
                {["Has Photos", "Verified Purchase Only", "Has Reply"].map((f) => (
                  <label key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
                    <input type="checkbox" style={{ accentColor: T.accent }} />
                    <span style={{ fontSize: 12, color: T.label }}>{f}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Sort */}
          <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSortOpen((o) => !o)}
              style={{
                height: 36, padding: "0 12px", background: T.elevated,
                border: `1px solid ${T.border}`, borderRadius: 6,
                color: T.label, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              Sort: {SORT_OPTIONS.find((s) => s.value === sortBy)?.label} <Icon.ChevronDown />
            </button>
            {sortOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0,
                background: T.overlay, border: `1px solid ${T.border}`, borderRadius: 8,
                padding: 6, zIndex: 100, width: 200, boxShadow: T.shadow,
                animation: "slideDown 0.15s ease",
              }}>
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => { setSortBy(s.value); setSortOpen(false); }}
                    style={{
                      width: "100%", padding: "8px 12px", background: sortBy === s.value ? T.accentBg : "none",
                      border: "none", borderRadius: 6, color: sortBy === s.value ? T.accent : T.text,
                      fontSize: 13, cursor: "pointer", textAlign: "left",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {(["cards", "table"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                aria-pressed={viewMode === v}
                style={{
                  height: 36, padding: "0 10px", background: viewMode === v ? T.accentBg : "none",
                  border: `1px solid ${viewMode === v ? T.accent : T.border}`, borderRadius: 6,
                  color: viewMode === v ? T.accent : T.muted, fontSize: 12, cursor: "pointer",
                }}
              >
                {v === "cards" ? "⊞ Cards" : "☰ Table"}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.size > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
            background: T.accentBg, border: `1px solid ${T.accent}`, borderRadius: 8,
            marginBottom: 14, flexWrap: "wrap",
            animation: "slideDown 0.2s ease",
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }} aria-live="polite">
              ☑ {selectedIds.size} selected
            </span>
            <button onClick={() => setBulkModal("approve")} style={{ height: 32, padding: "0 12px", background: T.accent, border: "none", borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Approve
            </button>
            <button onClick={() => setBulkModal("reject")} style={{ height: 32, padding: "0 12px", background: "none", border: `1px solid ${T.error}`, borderRadius: 6, color: T.error, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Reject
            </button>
            <button onClick={() => setBulkModal("delete")} style={{ height: 32, padding: "0 12px", background: "none", border: `1px solid ${T.error}`, borderRadius: 6, color: T.error, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Delete
            </button>
            <button onClick={() => setSelectedIds(new Set())} style={{ marginLeft: "auto", background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 13 }}>
              ✕ Clear
            </button>
          </div>
        )}

        {/* Reviews List */}
        {filtered.length === 0 ? (
          /* Empty State */
          <div style={{ textAlign: "center", padding: "80px 24px", color: T.muted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{activeTab === "pending" ? "✅" : "📭"}</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 8 }}>
              {activeTab === "pending" ? "No reviews pending" : "No reviews found"}
            </h2>
            <p style={{ fontSize: 14, marginBottom: 20 }}>
              {activeTab === "pending" ? "All reviews have been moderated. Nice work!" : "Try adjusting your filters or search."}
            </p>
            {activeTab !== "pending" && (
              <button
                onClick={() => { setSearchQuery(""); setActiveTab("all"); }}
                style={{
                  background: T.accent, border: "none", borderRadius: 6,
                  padding: "8px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : viewMode === "cards" ? (
          /* Card View */
          <div role="list" aria-label="Reviews" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {paginated.map((review) => {
              const isFlagged = review.flagCount > 0;
              const isSelected = selectedIds.has(review.id);
              return (
                <div
                  key={review.id}
                  role="listitem"
                  style={{
                    background: T.card,
                    border: `1px solid ${isFlagged ? T.error : T.borderMuted}`,
                    borderLeft: isFlagged ? `4px solid ${T.error}` : `1px solid ${T.borderMuted}`,
                    borderRadius: 8, padding: 16,
                    backgroundColor: isFlagged ? `rgba(229,83,75,0.05)` : isSelected ? T.accentBg : T.card,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && !isFlagged) (e.currentTarget as HTMLDivElement).style.background = T.elevated;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = isFlagged ? "rgba(229,83,75,0.05)" : isSelected ? T.accentBg : T.card;
                  }}
                >
                  {/* Card Header Row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(review.id)}
                      aria-label={`Select review by ${review.reviewerName}`}
                      style={{ width: 18, height: 18, accentColor: T.accent, cursor: "pointer", flexShrink: 0 }}
                    />
                    <StarRating rating={review.rating} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{review.reviewerName}</span>
                    {review.isVerifiedPurchase && (
                      <span aria-label="Verified purchase" style={{ fontSize: 11, color: T.success, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                        <Icon.Check /> Verified
                      </span>
                    )}
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                      <StatusBadge status={review.isFeatured ? "featured" : review.status} />
                    </div>
                  </div>

                  {/* Review Body */}
                  <ReviewBodyClamp body={review.body} />

                  {/* Flag Indicator */}
                  {isFlagged && (
                    <div style={{
                      background: T.errorBg, border: `1px solid ${T.error}`, borderRadius: 4,
                      padding: "6px 10px", marginTop: 10, display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <span style={{ color: T.error }}><Icon.Flag /></span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.error }}>
                        Reported {review.flagCount} time{review.flagCount > 1 ? "s" : ""} — &ldquo;{review.flags[0]?.reason}&rdquo;
                      </span>
                    </div>
                  )}

                  {/* Admin Reply Indicator */}
                  {review.adminReply && (
                    <div style={{
                      borderLeft: `2px solid ${T.info}`, paddingLeft: 10,
                      marginTop: 10, background: T.infoBg, borderRadius: "0 4px 4px 0",
                      padding: "8px 10px 8px 12px",
                    }}>
                      <p style={{ fontSize: 13, fontStyle: "italic", color: T.text, margin: 0 }}>
                        ↳ Store reply: &ldquo;{review.adminReply}&rdquo;
                      </p>
                      <p style={{ fontSize: 11, color: T.muted, margin: "2px 0 0" }}>
                        {review.adminReplyBy} · {review.adminReplyAt ? formatDate(review.adminReplyAt) : ""}
                      </p>
                    </div>
                  )}

                  {/* Meta Row */}
                  <p style={{ fontSize: 12, color: T.muted, margin: "10px 0 12px", display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 500, color: T.label }}>{review.productName} — {review.productVariant}</span>
                    <span>&middot;</span>
                    <span>Order #{review.orderId}</span>
                    <span>&middot;</span>
                    <span>{formatDate(review.createdAt)}</span>
                  </p>

                  {/* Action Row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {(review.status === "pending" || review.status === "flagged") && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        style={{
                          height: 32, padding: "0 14px", background: T.accent, border: "none",
                          borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 5,
                        }}
                      >
                        <Icon.Check /> Approve
                      </button>
                    )}
                    {(review.status === "pending" || review.status === "flagged") && (
                      <button
                        onClick={() => { setDrawerReview(review); }}
                        style={{
                          height: 32, padding: "0 12px", background: "none",
                          border: `1px solid ${T.error}`, borderRadius: 6,
                          color: T.error, fontSize: 12, fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        Reject
                      </button>
                    )}
                    {review.status === "rejected" && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        style={{
                          height: 32, padding: "0 12px", background: "none",
                          border: `1px solid ${T.accent}`, borderRadius: 6,
                          color: T.accent, fontSize: 12, fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        Re-approve
                      </button>
                    )}
                    <button
                      onClick={() => setDrawerReview(review)}
                      style={{
                        height: 32, padding: "0 12px", background: "none",
                        border: `1px solid ${T.border}`, borderRadius: 6,
                        color: T.label, fontSize: 12, fontWeight: 500, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 5,
                      }}
                    >
                      <Icon.Reply /> Reply
                    </button>
                    <button
                      onClick={() => setDrawerReview(review)}
                      style={{
                        height: 32, padding: "0 12px", background: "none", border: "none",
                        color: T.muted, fontSize: 12, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 5,
                      }}
                    >
                      <Icon.Eye /> View Full
                    </button>

                    {/* Overflow menu */}
                    <div style={{ marginLeft: "auto", position: "relative" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenMenuId((o) => (o === review.id ? null : review.id))}
                        style={{
                          width: 32, height: 32, background: "none", border: `1px solid ${T.border}`,
                          borderRadius: 6, color: T.muted, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                        aria-label="More options"
                      >
                        <Icon.MoreVert />
                      </button>
                      {openMenuId === review.id && (
                        <div
                          role="menu"
                          style={{
                            position: "absolute", right: 0, top: "calc(100% + 4px)",
                            background: T.overlay, border: `1px solid ${T.border}`,
                            borderRadius: 8, padding: 6, zIndex: 200, width: 190,
                            boxShadow: T.shadow, animation: "slideDown 0.15s ease",
                          }}
                        >
                          {[
                            { label: "View Full Review", action: () => setDrawerReview(review), danger: false },
                            { label: "Reply to Review", action: () => setDrawerReview(review), danger: false },
                            null,
                            { label: review.isFeatured ? "Remove from Featured" : "Feature this Review", action: () => handleFeatureToggle(review.id), danger: false },
                            { label: "Mark as Spam", action: () => handleReject(review.id, "Spam/promotional content", false), danger: false },
                            null,
                            { label: "Delete Permanently", action: () => handleDelete(review.id), danger: true },
                          ].map((item, i) =>
                            item === null ? (
                              <div key={i} style={{ height: 1, background: T.borderMuted, margin: "4px 0" }} />
                            ) : (
                              <button
                                key={item.label}
                                role="menuitem"
                                onClick={() => { item.action(); setOpenMenuId(null); }}
                                style={{
                                  width: "100%", padding: "7px 12px", background: "none", border: "none",
                                  borderRadius: 4, color: item.danger ? T.error : T.text,
                                  fontSize: 13, cursor: "pointer", textAlign: "left",
                                  display: "flex", alignItems: "center", gap: 7,
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = item.danger ? T.errorBg : T.elevated)}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                              >
                                {item.danger && <Icon.Trash />}
                                {item.label}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ padding: "10px 12px", textAlign: "left", width: 40 }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.size === paginated.length && paginated.length > 0}
                      onChange={toggleSelectAll}
                      style={{ accentColor: T.accent }}
                    />
                  </th>
                  {["Stars", "Reviewer", "Product", "Date", "Status", ""].map((col) => (
                    <th key={col} style={{
                      padding: "10px 12px", textAlign: "left",
                      fontSize: 11, fontWeight: 700, color: T.label,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                      borderBottom: `1px solid ${T.borderMuted}`,
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((review) => (
                  <tr
                    key={review.id}
                    onClick={() => setDrawerReview(review)}
                    style={{
                      borderBottom: `1px solid ${T.borderMuted}`,
                      cursor: "pointer", transition: "background 0.12s",
                      background: review.flagCount > 0 ? "rgba(229,83,75,0.05)" : "transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = T.elevated)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = review.flagCount > 0 ? "rgba(229,83,75,0.05)" : "transparent")}
                  >
                    <td style={{ padding: "10px 12px" }} onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={selectedIds.has(review.id)} onChange={() => toggleSelect(review.id)} style={{ accentColor: T.accent }} />
                    </td>
                    <td style={{ padding: "10px 12px" }}><StarRating rating={review.rating} /></td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontWeight: 600, color: T.text }}>{review.reviewerName}</div>
                      {review.isVerifiedPurchase && <div style={{ fontSize: 11, color: T.success }}>✓ Verified</div>}
                    </td>
                    <td style={{ padding: "10px 12px", color: T.label }}>{review.productName}</td>
                    <td style={{ padding: "10px 12px", color: T.muted, fontSize: 12 }}>{formatDate(review.createdAt)}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <StatusBadge status={review.isFeatured ? "featured" : review.status} />
                    </td>
                    <td style={{ padding: "10px 12px" }} onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setDrawerReview(review)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer" }}>
                        <Icon.MoreVert />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 20, padding: "14px 0", borderTop: `1px solid ${T.borderMuted}`,
            flexWrap: "wrap", gap: 10,
          }}>
            <span style={{ fontSize: 13, color: T.muted }}>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  width: 32, height: 32, background: T.elevated, border: `1px solid ${T.border}`,
                  borderRadius: 6, color: T.muted, cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  opacity: currentPage === 1 ? 0.4 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Icon.ChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | "…")[]>((acc, p, i, arr) => {
                  if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span key={`ellipsis-${i}`} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted, fontSize: 13 }}>…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p as number)}
                      style={{
                        width: 32, height: 32, background: currentPage === p ? T.accent : T.elevated,
                        border: `1px solid ${currentPage === p ? T.accent : T.border}`, borderRadius: 6,
                        color: currentPage === p ? "#fff" : T.text, fontSize: 13, cursor: "pointer",
                      }}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  width: 32, height: 32, background: T.elevated, border: `1px solid ${T.border}`,
                  borderRadius: 6, color: T.muted, cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage === totalPages ? 0.4 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Icon.ChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {drawerReview && (
        <ReviewDrawer
          review={drawerReview}
          onClose={() => setDrawerReview(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onReply={handleReply}
          onFeatureToggle={handleFeatureToggle}
          onDelete={handleDelete}
        />
      )}

      {/* Bulk Modal */}
      {bulkModal && (
        <BulkModal
          type={bulkModal}
          count={selectedIds.size}
          onCancel={() => setBulkModal(null)}
          onConfirm={handleBulkConfirm}
        />
      )}

      {/* Toasts */}
      <Toast toasts={toasts} remove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </>
  );
}

/* ─── Review Body Clamp ──────────────────────────────────────────────────────── */
function ReviewBodyClamp({ body }: { body: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = body.length > 200;
  return (
    <div style={{ marginBottom: 6 }}>
      <p style={{
        fontSize: 13, color: "#cdd9e5", lineHeight: 1.6, margin: 0,
        display: "-webkit-box",
        WebkitLineClamp: expanded ? "unset" : 3,
        WebkitBoxOrient: "vertical",
        overflow: expanded ? "visible" : "hidden",
      }}>
        {body || <em style={{ color: "#768390" }}>(No written review)</em>}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{ background: "none", border: "none", color: "#00b566", fontSize: 12, cursor: "pointer", padding: "2px 0" }}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
