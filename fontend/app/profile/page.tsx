"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  useMe, useUpdateProfile,
  useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress,
  useLoyalty,
  useWishlist, useAddToWishlist, useRemoveWishlist,
  useMyPlants, useAddPlant, useAddPlantLog,
} from "@/features/profile";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { logoutApi } from "@/features/auth/api/auth.api";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMyOrders } from "@/features/orders/hooks/useMyOrders";
import { cancelOrderApi, returnOrderApi } from "@/features/orders/api/orders.api";
/* ─────────────────────────────────────────────
   DESIGN TOKENS (CSS-in-JS via style injection)
───────────────────────────────────────────── */
const TOKENS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
  :root {
    --color-surface-raised: #00b566;
    --color-surface-strong: #fefcf9;
    --color-surface-base: #000000;
    --color-text-secondary: #1c1c1c;
    --color-text-tertiary: #ffffff;
    --color-text-inverse: #212326;
    --profile-page-bg: #fefcf9;
    --profile-sidebar-bg: #fefcf9;
    --profile-sidebar-active-bg: rgba(0,181,102,0.10);
    --profile-sidebar-active-text: #00b566;
    --profile-sidebar-active-bar: #00b566;
    --profile-sidebar-hover-bg: rgba(0,181,102,0.06);
    --profile-card-bg: #fefcf9;
    --profile-card-border: rgba(28,28,28,0.10);
    --profile-heading: #1c1c1c;
    --profile-body: #212326;
    --profile-meta: rgba(28,28,28,0.45);
    --profile-cta-bg: #00b566;
    --profile-cta-text: #ffffff;
    --profile-input-bg: #fefcf9;
    --profile-input-border: rgba(28,28,28,0.20);
    --profile-input-focus: #00b566;
    --profile-divider: rgba(28,28,28,0.10);
    --profile-focus-ring: #00b566;
    --profile-avatar-bg: #00b566;
    --profile-avatar-text: #ffffff;
    --profile-star-fill: #c8a84b;
    --profile-status-delivered: #16a34a;
    --profile-status-processing: #d97706;
    --profile-status-shipped: #2563eb;
    --profile-status-cancelled: #dc2626;
    --profile-status-returned: #7c3aed;
    --profile-danger-text: #dc2626;
    --profile-danger-border: #dc2626;
    --profile-points-bg: rgba(0,181,102,0.08);
    --profile-overlay-bg: rgba(0,0,0,0.55);
    --profile-skeleton-base: rgba(28,28,28,0.08);
    --profile-skeleton-shine: rgba(255,255,255,0.60);
    --radius-xs: 4px;
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 20px;
    --radius-pill: 50px;
    --radius-full: 9999px;
    --shadow-card: 0 4px 20px rgba(28,28,28,0.06);
    --shadow-modal: 0 20px 60px rgba(0,0,0,0.18);
    --shadow-avatar: 0 4px 16px rgba(0,181,102,0.25);
    --shadow-sidebar: 2px 0 16px rgba(28,28,28,0.06);
    --motion-instant: 200ms;
    --motion-fast: 250ms;
    --motion-normal: 300ms;
    --motion-slow: 500ms;
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes modalOpen {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseRing {
    0% { box-shadow: 0 0 0 0 rgba(0,181,102,0.4); }
    70% { box-shadow: 0 0 0 8px rgba(0,181,102,0); }
    100% { box-shadow: 0 0 0 0 rgba(0,181,102,0); }
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes toastOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(20px); }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  .profile-page * {
    font-family: 'Outfit', sans-serif;
    box-sizing: border-box;
  }
  .profile-page {
    background: var(--profile-page-bg);
    min-height: 100vh;
  }
  /* ── Scrollbar ── */
  .profile-page ::-webkit-scrollbar { width: 5px; }
  .profile-page ::-webkit-scrollbar-track { background: transparent; }
  .profile-page ::-webkit-scrollbar-thumb { background: var(--profile-divider); border-radius: var(--radius-full); }
  /* ── Focus rings ── */
  .profile-page *:focus-visible {
    outline: 2px solid var(--profile-focus-ring);
    outline-offset: 2px;
  }
  /* ── Skeleton shimmer ── */
  .skeleton {
    background: linear-gradient(90deg, var(--profile-skeleton-base) 25%, var(--profile-skeleton-shine) 50%, var(--profile-skeleton-base) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: var(--radius-sm);
  }
  /* ── Screen reader only ── */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
  }
  /* ── Profile Buttons ── */
  .btn-profile-primary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--profile-cta-bg);
    color: var(--profile-cta-text);
    font-size: 16px;
    font-weight: 600;
    height: 44px;
    padding: 0 20px;
    border-radius: var(--radius-full);
    border: none;
    cursor: pointer;
    transition: all var(--motion-instant) ease;
    white-space: nowrap;
  }
  .btn-profile-primary:hover {
    background: #009952;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,181,102,0.30);
  }
  .btn-profile-outline {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    color: var(--profile-heading);
    font-size: 15px;
    font-weight: 600;
    height: 40px;
    padding: 0 16px;
    border-radius: var(--radius-full);
    border: 1px solid var(--profile-input-border);
    cursor: pointer;
    transition: all var(--motion-instant) ease;
    white-space: nowrap;
  }
  .btn-profile-outline:hover {
    border-color: var(--color-surface-raised);
    color: var(--color-surface-raised);
  }
  .btn-profile-danger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    color: var(--profile-danger-text);
    font-size: 14px;
    font-weight: 600;
    height: 40px;
    padding: 0 16px;
    border-radius: var(--radius-full);
    border: 1px solid var(--profile-danger-border);
    cursor: pointer;
    transition: all var(--motion-instant) ease;
  }
  .btn-profile-danger:hover {
    background: rgba(220,38,38,0.08);
  }
  /* ── Form inputs ── */
  .profile-input {
    width: 100%;
    height: 48px;
    padding: 0 14px;
    font-size: 16px;
    color: var(--profile-heading);
    background: var(--profile-input-bg);
    border: 1px solid var(--profile-input-border);
    border-radius: var(--radius-sm);
    outline: none;
    transition: border-color var(--motion-instant) ease;
  }
  .profile-input:hover { border-color: rgba(28,28,28,0.35); }
  .profile-input:focus { border-color: var(--profile-input-focus); box-shadow: 0 0 0 3px rgba(0,181,102,0.12); }
  .profile-input::placeholder { color: var(--profile-meta); }
  .profile-input.error { border-color: var(--profile-danger-text); }
  .profile-textarea {
    width: 100%;
    padding: 12px 14px;
    font-size: 16px;
    color: var(--profile-heading);
    background: var(--profile-input-bg);
    border: 1px solid var(--profile-input-border);
    border-radius: var(--radius-sm);
    outline: none;
    resize: vertical;
    min-height: 100px;
    font-family: 'Outfit', sans-serif;
    transition: border-color var(--motion-instant) ease;
  }
  .profile-textarea:focus { border-color: var(--profile-input-focus); box-shadow: 0 0 0 3px rgba(0,181,102,0.12); }
  .profile-textarea::placeholder { color: var(--profile-meta); }
  .profile-select {
    width: 100%;
    height: 48px;
    padding: 0 14px;
    font-size: 16px;
    color: var(--profile-heading);
    background: var(--profile-input-bg);
    border: 1px solid var(--profile-input-border);
    border-radius: var(--radius-sm);
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%231c1c1c' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
    transition: border-color var(--motion-instant) ease;
  }
  .profile-select:focus { border-color: var(--profile-input-focus); box-shadow: 0 0 0 3px rgba(0,181,102,0.12); }
  /* ── Toggle switch ── */
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
  }
  .toggle-switch input { opacity: 0; width: 0; height: 0; }
  .toggle-track {
    position: absolute;
    inset: 0;
    background: var(--profile-divider);
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: background var(--motion-instant) ease;
  }
  .toggle-track::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    left: 2px;
    top: 2px;
    background: white;
    border-radius: 50%;
    transition: transform var(--motion-instant) ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  }
  .toggle-switch input:checked + .toggle-track { background: var(--color-surface-raised); }
  .toggle-switch input:checked + .toggle-track::before { transform: translateX(20px); }
  .toggle-switch input:focus-visible + .toggle-track { outline: 2px solid var(--profile-focus-ring); outline-offset: 2px; }
  /* ── Status badges ── */
  .badge-status {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: var(--radius-full);
  }
  /* ── Card shell ── */
  .profile-card {
    background: var(--profile-card-bg);
    border: 1px solid var(--profile-card-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    padding: 16px;
    transition: box-shadow var(--motion-instant) ease;
  }
  .profile-card:hover { box-shadow: 0 8px 32px rgba(28,28,28,0.10); }
  /* ── Section header ── */
  .section-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 12px;
    flex-wrap: wrap;
  }
  .section-title-lg {
    font-size: 24px;
    font-weight: 700;
    color: var(--profile-heading);
    line-height: 1.3;
  }
  .section-count {
    color: var(--profile-meta);
    font-weight: 400;
  }
  /* ── Empty state ── */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
    text-align: center;
    gap: 12px;
  }
  .empty-state-icon { font-size: 48px; opacity: 0.5; }
  .empty-state h3 { font-size: 16px; font-weight: 700; color: var(--profile-heading); }
  .empty-state p { font-size: 14px; color: var(--profile-meta); max-width: 300px; line-height: 1.6; }
  /* ── Modal ── */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: var(--profile-overlay-bg);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .modal-shell {
    background: var(--profile-card-bg);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-modal);
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    animation: modalOpen var(--motion-normal) ease;
  }
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--profile-divider);
  }
  .modal-title { font-size: 18px; font-weight: 700; color: var(--profile-heading); }
  .modal-close {
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    border: 1px solid var(--profile-divider);
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    color: var(--profile-meta);
    transition: all var(--motion-instant) ease;
    flex-shrink: 0;
  }
  .modal-close:hover { background: var(--profile-divider); color: var(--profile-heading); }
  .modal-body { padding: 24px; }
  .modal-footer {
    display: flex;
    gap: 12px;
    padding: 16px 24px 20px;
    border-top: 1px solid var(--profile-divider);
  }
  .modal-footer .btn-profile-primary { flex: 1; justify-content: center; }
  /* ── Sidebar ── */
  .sidebar-nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 48px;
    padding: 0 16px;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--profile-body);
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    position: relative;
    transition: all var(--motion-instant) ease;
    border-left: 3px solid transparent;
  }
  .sidebar-nav-item:hover {
    background: var(--profile-sidebar-hover-bg);
    color: var(--profile-heading);
  }
  .sidebar-nav-item.active {
    background: var(--profile-sidebar-active-bg);
    color: var(--profile-sidebar-active-text);
    font-weight: 700;
    border-left-color: var(--profile-sidebar-active-bar);
  }
  .sidebar-nav-item.active .nav-icon { color: var(--color-surface-raised); }
  .sidebar-nav-item:hover .nav-icon { color: var(--color-surface-raised); }
  .nav-icon { font-size: 18px; flex-shrink: 0; color: var(--profile-meta); transition: color var(--motion-instant); }
  .nav-badge {
    margin-left: auto;
    background: var(--color-surface-raised);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: var(--radius-full);
    min-width: 20px;
    text-align: center;
  }
  /* ── Filter tabs ── */
  .filter-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
  .filter-tab {
    height: 38px;
    padding: 0 16px;
    border-radius: var(--radius-full);
    border: 1px solid var(--profile-input-border);
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    color: var(--profile-body);
    cursor: pointer;
    transition: all var(--motion-instant) ease;
    white-space: nowrap;
  }
  .filter-tab:hover { border-color: var(--color-surface-raised); color: var(--color-surface-raised); }
  .filter-tab.active { background: var(--color-surface-raised); color: #fff; font-weight: 700; border-color: var(--color-surface-raised); }
  /* ── Order card ── */
  .order-status-delivered { background: rgba(22,163,74,0.12); color: #16a34a; }
  .order-status-processing { background: rgba(217,119,6,0.12); color: #d97706; }
  .order-status-shipped { background: rgba(37,99,235,0.12); color: #2563eb; }
  .order-status-cancelled { background: rgba(220,38,38,0.12); color: #dc2626; }
  .order-status-returned { background: rgba(124,58,237,0.12); color: #7c3aed; }
  /* ── Loyalty progress bar ── */
  .loyalty-progress-track {
    width: 100%;
    height: 8px;
    background: rgba(0,181,102,0.15);
    border-radius: var(--radius-full);
    overflow: hidden;
  }
  .loyalty-progress-fill {
    height: 100%;
    background: var(--color-surface-raised);
    border-radius: var(--radius-full);
    transition: width var(--motion-slow) ease;
  }
  /* ── Star rating ── */
  .star-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 28px;
    padding: 2px;
    color: var(--profile-divider);
    transition: color var(--motion-instant) ease, transform var(--motion-instant) ease;
    line-height: 1;
  }
  .star-btn.filled { color: var(--profile-star-fill); }
  .star-btn:hover { transform: scale(1.15); }
  /* ── Notification item ── */
  .notif-item {
    display: flex;
    gap: 14px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--profile-divider);
    transition: background var(--motion-instant) ease;
    cursor: pointer;
  }
  .notif-item:last-child { border-bottom: none; }
  .notif-item.unread {
    background: rgba(0,181,102,0.06);
    border-left: 3px solid var(--color-surface-raised);
  }
  .notif-item.read { border-left: 3px solid transparent; }
  /* ── Mobile bottom tab bar ── */
  @media (min-width: 768px) { .mobile-tab-bar { display: none !important; } }
  @media (max-width: 767px) {
    .sidebar-desktop { display: none !important; }
    .mobile-tab-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: var(--color-surface-strong);
      border-top: 1px solid var(--profile-divider);
      display: flex;
      align-items: center;
      z-index: 100;
      padding-bottom: env(safe-area-inset-bottom);
    }
    .mobile-tab-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      height: 100%;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 9px;
      font-weight: 500;
      color: var(--profile-meta);
      transition: color var(--motion-instant) ease;
      font-family: 'Outfit', sans-serif;
      border-top: 2px solid transparent;
      padding-top: 2px;
    }
    .mobile-tab-btn.active {
      color: var(--color-surface-raised);
      border-top-color: var(--color-surface-raised);
    }
    .mobile-tab-btn span { font-size: 22px; }
    .profile-main-content { padding-bottom: 80px !important; }
  }
  /* ── Responsive grid ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  @media (max-width: 1023px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
  .wishlist-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  @media (max-width: 1023px) { .wishlist-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 640px) { .wishlist-grid { grid-template-columns: repeat(2, 1fr); } }
  .address-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  @media (max-width: 640px) { .address-grid { grid-template-columns: 1fr; } }
  .form-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 640px) { .form-grid-2 { grid-template-columns: 1fr; } }
  /* Tracking step */
  .track-step {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    position: relative;
  }
  .track-step:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 11px;
    top: 24px;
    width: 2px;
    bottom: -16px;
    background: var(--profile-divider);
  }
  .track-step.completed:not(:last-child)::after { background: var(--color-surface-raised); }
  .track-dot {
    width: 24px; height: 24px;
    border-radius: 50%;
    border: 2px solid var(--profile-divider);
    background: white;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    z-index: 1;
  }
  .track-dot.completed { background: var(--color-surface-raised); border-color: var(--color-surface-raised); color: white; }
  .track-dot.current { background: var(--color-surface-raised); border-color: var(--color-surface-raised); color: white; animation: pulseRing 2s infinite; }
  /* Password strength */
  .pwd-strength-bar {
    display: flex;
    gap: 4px;
    margin-top: 6px;
  }
  .pwd-seg {
    flex: 1;
    height: 4px;
    border-radius: var(--radius-full);
    background: var(--profile-divider);
    transition: background var(--motion-fast) ease;
  }
  /* Toast */
  .toast-container {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 300;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    pointer-events: none;
  }
  .toast-item {
    background: #1c1c1c;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    padding: 12px 20px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: toastIn var(--motion-fast) ease;
    pointer-events: all;
    max-width: 380px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }
  .toast-success { border-left: 4px solid var(--color-surface-raised); }
  .toast-error { border-left: 4px solid var(--profile-danger-text); }
  .toast-info { border-left: 4px solid rgba(0,181,102,0.6); }
  .toast-undo-btn { background: none; border: none; color: var(--color-surface-raised); font-weight: 700; cursor: pointer; padding: 0 4px; font-size: 13px; font-family: 'Outfit', sans-serif; }
  /* Announcement bar */
  .announcement-bar {
    background: var(--color-surface-raised);
    color: #fff;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    padding: 9px 16px;
    letter-spacing: 0.01em;
  }
  /* Breadcrumb */
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--profile-body);
    margin: 16px 0 8px;
  }
  .breadcrumb a { color: var(--profile-body); text-decoration: none; }
  .breadcrumb a:hover { color: var(--color-surface-raised); }
  .breadcrumb-sep { color: var(--profile-meta); }
  .breadcrumb-current { font-weight: 600; color: var(--profile-heading); }
  /* Navbar (minimal profile version) */
  .profile-navbar {
    height: 64px;
    background: var(--color-surface-strong);
    border-bottom: 1px solid var(--profile-divider);
    display: flex;
    align-items: center;
    padding: 0 48px;
    gap: 24px;
    position: sticky;
    top: 0;
    z-index: 50;
  }
  @media (max-width: 768px) { .profile-navbar { padding: 0 20px; } }
  .profile-navbar-brand { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 800; color: var(--profile-heading); text-decoration: none; }
  .profile-navbar-brand span { color: var(--color-surface-raised); }
  .profile-navbar-actions { margin-left: auto; display: flex; align-items: center; gap: 16px; }
  .avatar-chip {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: var(--profile-avatar-bg);
    color: var(--profile-avatar-text);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700;
    cursor: pointer;
    flex-shrink: 0;
  }
`;
/* ─────────────────────────────────────────────
   DATA (mock)
───────────────────────────────────────────── */
// ── Static fallbacks (used only before real API data arrives) ─────────────────
const NOTIFICATIONS = [
  { id: 1, icon: "🚚", title: "Your order has been shipped!", body: "Check your orders for details.", time: "recently", read: false },
  { id: 2, icon: "💧", title: "Time to water a plant!", body: "Check your plant diary.", time: "1 day ago", read: false },
];
const REVIEWS_WRITTEN = [
  { id: 1, product: "Monstera Deliciosa", ordered: "15 Jun 2026", rating: 5, img: "🌿", text: "Absolutely beautiful plant! Arrived in perfect condition and the packaging was excellent." },
  { id: 2, product: "Peace Lily", ordered: "08 Jun 2026", rating: 4, img: "🌸", text: "Healthy plant with great instructions. Arrived a day early!" },
];
const REVIEWS_PENDING = [
  { id: 3, product: "Pothos Golden", ordered: "28 May 2026", img: "🍃" },
];
/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function getStatusStyle(status: string) {
  switch (status) {
    case "delivered": return { cls: "order-status-delivered", icon: "✓", label: "Delivered" };
    case "processing": return { cls: "order-status-processing", icon: "⏳", label: "Processing" };
    case "shipped": return { cls: "order-status-shipped", icon: "🚚", label: "Shipped" };
    case "cancelled": return { cls: "order-status-cancelled", icon: "✕", label: "Cancelled" };
    case "returned": return { cls: "order-status-returned", icon: "↩", label: "Returned" };
    default: return { cls: "", icon: "", label: status };
  }
}
function getWaterColor(status: string) {
  if (status === "overdue") return { color: "#dc2626", label: "Overdue!" };
  if (status === "today") return { color: "#d97706", label: "Due today" };
  return { color: "#00b566", label: "Water in 2 days" };
}
type ToastType = { id: number; msg: string; type: "success" | "error" | "info"; onUndo?: () => void };
/* ─────────────────────────────────────────────
   TOAST HOOK
───────────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const counter = useRef(0);
  const addToast = useCallback((msg: string, type: ToastType["type"] = "success", onUndo?: () => void) => {
    const id = ++counter.current;
    setToasts(t => [...t, { id, msg, type, onUndo }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, addToast };
}
/* ─────────────────────────────────────────────
   ICON COMPONENTS
───────────────────────────────────────────── */
function LeafLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 4 5 4 13C4 17.4 7.6 21 12 21C16.4 21 20 17.4 20 13C20 5 12 2 12 2Z" fill="#00b566" />
      <path d="M12 21V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 15L8 11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 12L16 8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
/* ─────────────────────────────────────────────
   MODAL SHELL COMPONENT
───────────────────────────────────────────── */
interface ModalProps { title: string; onClose: () => void; maxWidth?: number; children: React.ReactNode; footer?: React.ReactNode; }
function Modal({ title, onClose, maxWidth = 520, children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-shell" style={{ maxWidth }} ref={dialogRef} tabIndex={-1}>
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
/* ─────────────────────────────────────────────
   STAR RATING COMPONENT
───────────────────────────────────────────── */
function StarRating({ value, onChange, size = 24 }: { value: number; onChange?: (v: number) => void; size?: number; }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div role={onChange ? "radiogroup" : "img"} aria-label={`${value} out of 5 stars`} style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          className={`star-btn ${(onChange ? hovered || value : value) >= i ? "filled" : ""}`}
          style={{ fontSize: size }}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHovered(i)}
          onMouseLeave={() => onChange && setHovered(0)}
          role={onChange ? "radio" : undefined}
          aria-checked={onChange ? value === i : undefined}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          type="button"
          disabled={!onChange}
        >
          ★
        </button>
      ))}
    </div>
  );
}
/* ─────────────────────────────────────────────
   TOGGLE SWITCH COMPONENT
───────────────────────────────────────────── */
function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string; }) {
  return (
    <label className="toggle-switch" aria-label={label}>
      <input type="checkbox" role="switch" aria-checked={checked} checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-track" />
    </label>
  );
}
/* ─────────────────────────────────────────────
   SECTION: OVERVIEW DASHBOARD
───────────────────────────────────────────── */
function OverviewSection({
  onNavigate, firstName, points, plantsCount, wishlistItems, ordersCount, recentOrder,
}: {
  onNavigate: (s: string) => void;
  firstName: string;
  points: number;
  plantsCount: number;
  wishlistItems: any[];
  ordersCount: number;
  recentOrder: any | null;
}) {
  const stats = [
    { value: ordersCount, label: "Orders", section: "orders", icon: "📦" },
    { value: plantsCount, label: "Plants", section: "plants", icon: "🌿" },
    { value: points, label: "Points", section: "loyalty", icon: "🏅" },
    { value: 0, label: "Reviews", section: "reviews", icon: "⭐" },
  ];
  return (
    <section aria-label="Overview" style={{ animation: "slideUp var(--motion-normal) ease" }}>
      {/* Welcome header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--profile-heading)", marginBottom: 6 }}>
          Welcome back, {firstName || "there"} 🌿
        </h2>
        <p style={{ fontSize: 14, color: "var(--profile-meta)" }}>Here&apos;s what&apos;s growing in your account.</p>
      </div>
      {/* Quick stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {stats.map(s => (
          <button key={s.section} onClick={() => onNavigate(s.section)} aria-label={`${s.value} ${s.label}`}
            style={{ background: "var(--profile-card-bg)", border: "1px solid var(--profile-card-border)", borderRadius: "var(--radius-md)", padding: 20, textAlign: "center", cursor: "pointer", boxShadow: "var(--shadow-card)", transition: "all var(--motion-fast) ease", display: "block" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(28,28,28,0.12)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)"; }}
          >
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--color-surface-raised)", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--profile-meta)", marginTop: 4 }}>{s.label}</div>
          </button>
        ))}
      </div>
      {/* Recent order placeholder */}
      {recentOrder ? (
        <div className="profile-card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--profile-heading)" }}>Recent Order</h3>
            <button onClick={() => onNavigate("orders")} style={{ background: "none", border: "none", color: "var(--color-surface-raised)", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }}>View All Orders →</button>
          </div>
          <p style={{ fontSize: 14, color: "var(--profile-meta)" }}>Order #{recentOrder.order_number || recentOrder.id}</p>
        </div>
      ) : (
        <div className="profile-card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--profile-heading)" }}>Recent Order</h3>
            <button onClick={() => onNavigate("orders")} style={{ background: "none", border: "none", color: "var(--color-surface-raised)", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }}>View All Orders →</button>
          </div>
          <p style={{ fontSize: 14, color: "var(--profile-meta)" }}>No orders yet. Start shopping! 🌱</p>
        </div>
      )}
      {/* Wishlist preview */}
      <div className="profile-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--profile-heading)" }}>Wishlist <span style={{ color: "var(--profile-meta)", fontWeight: 400 }}>({wishlistItems.length})</span></h3>
          <button onClick={() => onNavigate("wishlist")} style={{ background: "none", border: "none", color: "var(--color-surface-raised)", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }}>View All →</button>
        </div>
        {wishlistItems.length === 0 ? (
          <p style={{ fontSize: 14, color: "var(--profile-meta)" }}>No wishlist items yet. Browse plants! 🌿</p>
        ) : (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {wishlistItems.slice(0, 4).map(item => (
              <div key={item.id} style={{ width: 64, textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "var(--radius-sm)", background: "rgba(0,181,102,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 4, border: "1px solid var(--profile-divider)" }}>🌿</div>
                <p style={{ fontSize: 10, color: "var(--profile-meta)", lineHeight: 1.3 }}>{item.product_title ?? `Product #${item.product_id}`}</p>
              </div>
            ))}
            {wishlistItems.length > 4 && (
              <div style={{ width: 64, height: 64, borderRadius: "var(--radius-sm)", background: "var(--profile-divider)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--profile-meta)" }}>+{wishlistItems.length - 4}</div>
            )}
          </div>
        )}
      </div>
      {/* Loyalty card */}
      <div style={{ background: "var(--profile-points-bg)", border: "1px solid var(--color-surface-raised)", borderRadius: "var(--radius-xl)", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 12, color: "var(--profile-meta)", marginBottom: 4 }}>🏅 Green Points</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: "var(--color-surface-raised)" }}>{points}</span>
              <span style={{ fontSize: 14, color: "var(--profile-meta)" }}>points</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 13, color: "var(--profile-meta)" }}>Next: Silver at 500 pts</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-surface-raised)", marginTop: 4 }}>{Math.min(Math.round((points / 500) * 100), 100)}% to Silver</p>
          </div>
        </div>
        <div className="loyalty-progress-track" style={{ marginBottom: 6 }}>
          <div className="loyalty-progress-fill" style={{ width: `${Math.min((points / 500) * 100, 100)}%` }} role="progressbar" aria-label={`${points} of 500 points to Silver tier`} aria-valuenow={points} aria-valuemin={0} aria-valuemax={500} />
        </div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-surface-raised)", textAlign: "right" }}>{points} / 500</p>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn-profile-primary" style={{ flex: 1, justifyContent: "center", height: 40, fontSize: 14 }} onClick={() => onNavigate("loyalty")}>Redeem Points</button>
          <button className="btn-profile-outline" style={{ flex: 1, justifyContent: "center", height: 40, fontSize: 14 }}>How it Works</button>
        </div>
      </div>
    </section>
  );
}
/* ─────────────────────────────────────────────
   SECTION: MY ORDERS
───────────────────────────────────────────── */
function normalizeOrderStatus(status: string): string {
  if (status === "cancelled") return "cancelled";
  if (status === "return_received" || status === "refunded") return "returned";
  if (status === "dispatched" || status === "in_transit" || status === "out_for_delivery") return "shipped";
  if (status === "delivered") return "delivered";
  return "processing"; // order_placed, payment_confirmed, processing, packed
}

function OrdersSection({ onToast }: { onToast: (msg: string, t?: ToastType["type"]) => void }) {
  const { orders, isLoading } = useMyOrders(1);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);
  
  const qc = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: ({ uuid, reason }: { uuid: string; reason: string }) => cancelOrderApi(uuid, reason),
    onSuccess: () => {
      onToast("Order cancelled successfully.", "success");
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: any) => {
      onToast(err?.response?.data?.detail || "Failed to cancel order.", "error");
    }
  });

  const returnMutation = useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: any }) => returnOrderApi(uuid, payload),
    onSuccess: () => {
      onToast("Return request submitted successfully.", "success");
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: any) => {
      onToast(err?.response?.data?.detail || "Failed to request return.", "error");
    }
  });

  const handleCancelOrder = (uuid: string) => {
    const reason = prompt("Please enter a reason for cancelling this order:");
    if (reason === null) return;
    if (!reason.trim()) {
      onToast("A reason is required to cancel the order.", "error");
      return;
    }
    cancelMutation.mutate({ uuid, reason });
  };

  const handleReturnOrder = (uuid: string) => {
    const reason = prompt("Please enter a reason for returning this order:");
    if (reason === null) return;
    if (!reason.trim()) {
      onToast("A reason is required to request a return.", "error");
      return;
    }
    returnMutation.mutate({ uuid, payload: { reason, return_type: "refund" } });
  };

  const tabs = ["all", "active", "delivered", "cancelled"];

  const normalizedOrders = orders.map((o: any) => {
    const status = normalizeOrderStatus(o.status);
    const dateFormatted = new Date(o.created_at).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    
    return {
      id: o.order_number,
      uuid: o.uuid,
      status,
      date: dateFormatted,
      delivery: o.shipping_amount === "0.00" || o.shipping_amount === "0" ? "₹0" : `₹${parseFloat(o.shipping_amount)}`,
      total: `₹${parseFloat(o.total).toLocaleString("en-IN")}`,
      tracking_number: o.tracking_number,
      shipping_carrier: o.shipping_carrier,
      tracking_url: o.tracking_url,
      items: (o.items || []).map((item: any) => ({
        name: item.title,
        variant: item.variant_title || "Standard",
        price: `₹${parseFloat(item.unit_price).toLocaleString("en-IN")}`,
        qty: item.quantity,
        img: "🌱",
        imageUrl: item.image_url
      }))
    };
  });

  const filtered = normalizedOrders.filter((o: any) => {
    if (activeTab === "active") return o.status === "processing" || o.status === "shipped";
    if (activeTab !== "all") return o.status === activeTab;
    return true;
  }).filter((o: any) => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.items.some((i: any) => i.name.toLowerCase().includes(search.toLowerCase()))
  ).slice(0, 5);

  const TRACKING_STEPS = [
    { label: "Order Placed", time: "Completed", status: "completed" },
    { label: "Packed", time: "Completed", status: "completed" },
    { label: "Dispatched", time: trackingOrder?.shipping_carrier ? `Carrier: ${trackingOrder.shipping_carrier}` : "Completed", status: "completed" },
    { label: "Out for Delivery", time: "In Transit", status: "current" },
    { label: "Delivered", time: "Pending", status: "pending" },
  ];

  return (
    <section aria-label="My Orders" style={{ animation: "slideUp var(--motion-normal) ease" }}>
      <div className="section-hdr">
        <h2 className="section-title-lg">Recent Orders <span className="section-count">(last 5)</span></h2>
      </div>
      {/* Filter tabs */}
      <div className="filter-tabs" role="tablist" aria-label="Order filters" style={{ marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t} className={`filter-tab ${activeTab === t ? "active" : ""}`} role="tab" aria-selected={activeTab === t} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {/* Search + sort */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "var(--profile-meta)" }}>🔍</span>
          <input className="profile-input" style={{ paddingLeft: 38 }} placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search orders" />
        </div>
        <select className="profile-select" style={{ width: 160 }} aria-label="Sort orders">
          <option>Newest First</option>
          <option>Oldest First</option>
          <option>Highest Value</option>
          <option>Lowest Value</option>
        </select>
      </div>
      {/* Order cards */}
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40, color: "var(--profile-meta)" }}>Loading your orders...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Start exploring our plants and bring green into your space.</p>
          <Link href="/"><button className="btn-profile-primary">Shop Plants</button></Link>
        </div>
      ) : (
        filtered.map((order: any) => {
          const si = getStatusStyle(order.status);
          const isExpanded = expandedItems[order.id];
          const visibleItems = isExpanded ? order.items : order.items.slice(0, 2);
          return (
            <div key={order.id} className="profile-card" style={{ marginBottom: 16 }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 8, flexWrap: "wrap" }}>
                <a href={`/orders/${order.uuid}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-surface-raised)", cursor: "pointer" }}>Order #{order.id} ↗</span>
                </a>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 9, color: "var(--profile-meta)" }}>{order.date}</span>
                  <span className={`badge-status ${si.cls}`} aria-label={`Order status: ${si.label}`}>{si.icon} {si.label}</span>
                </div>
              </div>
              {/* Items */}
              {visibleItems.map((item: any, i: number) => (
                <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 12, borderBottom: i < visibleItems.length - 1 ? "1px solid var(--profile-divider)" : "none", marginBottom: i < visibleItems.length - 1 ? 12 : 0, alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "var(--radius-sm)", background: "rgba(0,181,102,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, border: "1px solid var(--profile-divider)", overflow: "hidden" }}>
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : item.img}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--profile-heading)" }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: "var(--profile-meta)" }}>— {item.variant}</p>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--profile-body)" }}>{item.price} × {item.qty}</p>
                </div>
              ))}
              {order.items.length > 2 && (
                <button onClick={() => setExpandedItems(e => ({ ...e, [order.id]: !e[order.id] }))} aria-expanded={isExpanded}
                  style={{ background: "none", border: "none", color: "var(--color-surface-raised)", fontWeight: 600, fontSize: 12, cursor: "pointer", marginTop: 8, fontFamily: "Outfit" }}>
                  {isExpanded ? "Show less" : `+ ${order.items.length - 2} more items`}
                </button>
              )}
              {/* Total */}
              <div style={{ borderTop: "1px solid var(--profile-divider)", marginTop: 14, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--profile-heading)" }}>Total: {order.total}</span>
                <span style={{ fontSize: 12, color: "var(--profile-meta)" }}>incl. {order.delivery === "₹0" ? "free" : order.delivery} delivery</span>
              </div>
              {/* Actions */}
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
                {(order.status === "delivered" || order.status === "shipped") && (
                  <button className="btn-profile-primary" style={{ height: 38, fontSize: 13 }} onClick={() => setTrackingOrder(order)}>Track Order →</button>
                )}
                {order.status === "delivered" && <button className="btn-profile-outline" style={{ height: 38, fontSize: 13 }} onClick={() => onToast("Review submitted! Thank you.", "success")}>Write a Review</button>}
                <button className="btn-profile-outline" style={{ height: 38, fontSize: 13 }} onClick={() => onToast("Items added to cart!", "success")}>Buy Again</button>
                {order.status === "delivered" && <button style={{ background: "none", border: "none", color: "var(--profile-danger-text)", fontSize: 13, cursor: "pointer", fontFamily: "Outfit", fontWeight: 500, padding: "0 8px" }} onClick={() => handleReturnOrder(order.uuid)}>Return / Exchange</button>}
                {order.status === "processing" && <button style={{ background: "none", border: "none", color: "var(--profile-danger-text)", fontSize: 13, cursor: "pointer", fontFamily: "Outfit", fontWeight: 500, padding: "0 8px" }} onClick={() => handleCancelOrder(order.uuid)}>Cancel Order</button>}
              </div>
            </div>
          );
        })
      )}
      {/* View All Orders Button */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <a href="/orders" style={{ textDecoration: "none" }}>
          <button className="btn-profile-outline" style={{ padding: "10px 24px", display: "flex", alignItems: "center", gap: 8 }}>
            View All Orders
          </button>
        </a>
      </div>
      {/* Tracking Modal */}
      {trackingOrder && (
        <Modal title={`Order #${trackingOrder.id} — Tracking`} onClose={() => setTrackingOrder(null)} maxWidth={520}>
          <p style={{ fontSize: 13, color: "var(--profile-meta)", marginBottom: 20 }}>Estimated delivery: <strong style={{ color: "var(--profile-heading)" }}>18 Jun 2026</strong></p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {TRACKING_STEPS.map((step, i) => (
              <div key={i} className={`track-step ${step.status}`}>
                <div className={`track-dot ${step.status}`}>{step.status === "completed" ? "✓" : ""}</div>
                <div style={{ flex: 1, paddingBottom: i < TRACKING_STEPS.length - 1 ? 16 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: 14, fontWeight: step.status !== "pending" ? 600 : 400, color: step.status !== "pending" ? "var(--profile-heading)" : "var(--profile-meta)" }}>{step.label}</p>
                    {step.status === "current" && <span style={{ background: "var(--color-surface-raised)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-full)" }}>← Current</span>}
                  </div>
                  <p style={{ fontSize: 9, color: "var(--profile-meta)", marginTop: 2 }}>{step.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--profile-divider)" }}>
            <p style={{ fontSize: 13, color: "var(--profile-meta)", marginBottom: 10 }}>
              Carrier: <strong style={{ color: "var(--profile-heading)" }}>{trackingOrder.shipping_carrier || "Shiprocket"}</strong>
              <br />
              Tracking ID: <strong style={{ color: "var(--profile-heading)" }}>{trackingOrder.tracking_number || "Pending"}</strong>
            </p>
            {trackingOrder.tracking_url && (
              <a href={trackingOrder.tracking_url} target="_blank" rel="noopener noreferrer">
                <button className="btn-profile-outline" style={{ marginTop: 10, fontSize: 13 }}>View on Carrier Site ↗</button>
              </a>
            )}
          </div>
        </Modal>
      )}
    </section>
  );
}
/* ─────────────────────────────────────────────
   SECTION: WISHLIST
───────────────────────────────────────────── */
function WishlistSection({
  onToast, wishlistItems, onRemove,
}: {
  onToast: (msg: string, t?: ToastType["type"], onUndo?: () => void) => void;
  wishlistItems: any[];
  onRemove: (id: number) => void;
}) {
  const [items, setItems] = useState<any[]>(wishlistItems);
  useEffect(() => { setItems(wishlistItems); }, [wishlistItems]);
  const handleRemove = (productId: number) => {
    const prev = [...items];
    setItems(p => p.filter(x => x.product_id !== productId));
    onRemove(productId);
    onToast("Removed from wishlist", "success", () => setItems(prev));
  };
  const [selected, setSelected] = useState<number[]>([]);
  const allSelected = selected.length === items.length && items.length > 0;
  const toggleSelect = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  const toggleAll = () => setSelected(allSelected ? [] : items.map(i => i.product_id));
  return (
    <section aria-label="Wishlist" style={{ animation: "slideUp var(--motion-normal) ease" }}>
      <div className="section-hdr">
        <h2 className="section-title-lg">Wishlist <span className="section-count">({items.length})</span></h2>
        <select className="profile-select" style={{ width: 160 }}>
          <option>Recently Added</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>
      {/* Bulk actions bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--profile-body)" }}>
          <input type="checkbox" aria-label="Select all wishlist items" checked={allSelected} onChange={toggleAll}
            style={{ width: 18, height: 18, accentColor: "var(--color-surface-raised)", cursor: "pointer" }} />
          Select All
        </label>
        <button
          disabled={selected.length === 0}
          aria-disabled={selected.length === 0}
          onClick={() => { onToast(`${selected.length} items added to cart!`, "success"); setSelected([]); }}
          style={{ height: 36, fontSize: 13, opacity: selected.length === 0 ? 0.4 : 1, background: "var(--profile-cta-bg)", color: "#fff", borderRadius: "var(--radius-full)", border: "none", cursor: selected.length === 0 ? "not-allowed" : "pointer", padding: "0 16px", fontWeight: 600, fontFamily: "Outfit", display: "inline-flex", alignItems: "center", gap: 6 }}>
          🛒 Add Selected ({selected.length})
        </button>
        <button
          disabled={selected.length === 0}
          aria-disabled={selected.length === 0}
          onClick={() => { setItems(prev => prev.filter(i => !selected.includes(i.product_id))); setSelected([]); onToast("Selected items removed", "success"); }}
          style={{ height: 36, fontSize: 13, opacity: selected.length === 0 ? 0.4 : 1, background: "transparent", color: "var(--profile-danger-text)", borderRadius: "var(--radius-full)", border: "1px solid var(--profile-danger-border)", cursor: selected.length === 0 ? "not-allowed" : "pointer", padding: "0 16px", fontWeight: 600, fontFamily: "Outfit", display: "inline-flex", alignItems: "center", gap: 6 }}>
          🗑 Remove ({selected.length})
        </button>
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">♡</div>
          <h3>Your wishlist is empty</h3>
          <p>Save plants you love and find them here later.</p>
          <Link href="/"><button className="btn-profile-primary">Explore Plants</button></Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map(item => (
            <div key={item.product_id} style={{ position: "relative", background: "var(--profile-card-bg)", border: `1px solid ${selected.includes(item.product_id) ? "var(--color-surface-raised)" : "var(--profile-card-border)"}`, borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-card)", transition: "all var(--motion-fast) ease" }}>
              {/* Checkbox overlay */}
              <div style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}>
                <input type="checkbox" checked={selected.includes(item.product_id)} onChange={() => toggleSelect(item.product_id)}
                  style={{ width: 18, height: 18, accentColor: "var(--color-surface-raised)", cursor: "pointer" }} aria-label={`Select ${item.product_title}`} />
              </div>
              {/* Remove btn */}
              <button onClick={() => handleRemove(item.product_id)} aria-label={`Remove ${item.product_title} from wishlist`}
                style={{ position: "absolute", top: 8, right: 8, zIndex: 2, width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "1px solid var(--profile-divider)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "var(--profile-meta)" }}>
                ✕
              </button>
              {/* Image */}
              <div style={{ height: 120, background: "rgba(0,181,102,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, position: "relative" }}>
                {!item.inStock && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--profile-meta)" }}>Out of Stock</span>
                  </div>
                )}
                {item.img}
              </div>
              {/* Info */}
              <div style={{ padding: "12px 12px 14px" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 4 }}>{item.product_title}</p>
                <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginBottom: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-surface-raised)" }}>{item.price}</span>
                  {item.originalPrice && <span style={{ fontSize: 12, color: "var(--profile-meta)", textDecoration: "line-through" }}>{item.originalPrice}</span>}
                </div>
                {item.inStock ? (
                  <button className="btn-profile-primary" style={{ width: "100%", justifyContent: "center", height: 36, fontSize: 13 }} onClick={() => onToast(`${item.product_title} added to cart!`, "success")}>
                    🛒 Move to Cart
                  </button>
                ) : (
                  <button className="btn-profile-outline" style={{ width: "100%", justifyContent: "center", height: 36, fontSize: 13 }}>
                    Notify Me
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
/* ─────────────────────────────────────────────
   SECTION: MY PLANTS
───────────────────────────────────────────── */
function PlantsSection({ onToast, plants, onAddPlant, onLogCare }: { onToast: (msg: string, t?: ToastType["type"]) => void; plants: any[]; onAddPlant: (p: any) => void; onLogCare: (id: number, p: any) => void }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlant, setNewPlant] = useState({ name: "", nickname: "", location: "", date: "" });
  const handleAddPlant = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPlant({ name: newPlant.name, location: newPlant.location, added: newPlant.date });
    setShowAddModal(false);
    setNewPlant({ name: "", nickname: "", location: "", date: "" });
  };
  return (
    <section aria-label="My Plants" style={{ animation: "slideUp var(--motion-normal) ease" }}>
      <div className="section-hdr">
        <h2 className="section-title-lg">My Plants <span className="section-count">({plants.length})</span></h2>
        <button className="btn-profile-primary" onClick={() => setShowAddModal(true)}>+ Add a Plant</button>
      </div>
      {plants.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🌱</div>
          <h3>No plants yet</h3>
          <p>Add the plants you own and we&apos;ll help you care for them.</p>
          <button className="btn-profile-primary" onClick={() => setShowAddModal(true)}>+ Add Your First Plant</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {plants.map(plant => {
            const waterInfo = getWaterColor(plant.waterStatus);
            return (
              <div key={plant.id} className="profile-card">
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  {/* Plant image */}
                  <div style={{ width: 100, height: 100, borderRadius: "var(--radius-md)", background: "rgba(0,181,102,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, flexShrink: 0, border: "1px solid var(--profile-divider)" }}>{plant.img}</div>
                  {/* Plant info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--profile-heading)", marginBottom: 3 }}>{plant.name}</h3>
                        <p style={{ fontSize: 9, color: "var(--profile-meta)" }}>Added: {plant.added}</p>
                        <p style={{ fontSize: 12, color: "var(--profile-meta)", marginTop: 2 }}>📍 {plant.location}</p>
                      </div>
                      <button style={{ background: "none", border: "1px solid var(--profile-divider)", borderRadius: "var(--radius-sm)", width: 32, height: 32, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="More options" aria-haspopup="menu">⋮</button>
                    </div>
                    {/* Care indicators */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", marginTop: 10 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: waterInfo.color }}>💧 {waterInfo.label}</p>
                      <p style={{ fontSize: 12, color: "var(--profile-meta)" }}>☀️ {plant.light}</p>
                      <p style={{ fontSize: 12, color: "var(--profile-meta)" }}>🌡 {plant.temp}</p>
                      <p style={{ fontSize: 12, color: "var(--profile-meta)" }}>🪴 Repot: {plant.repot}</p>
                    </div>
                  </div>
                </div>
                {/* Card actions */}
                <div style={{ borderTop: "1px solid var(--profile-divider)", marginTop: 14, paddingTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="btn-profile-outline" style={{ height: 36, fontSize: 13 }} onClick={() => onLogCare(plant.id, { action: "water" })}>💧 Log Watering</button>
                  <button className="btn-profile-outline" style={{ height: 36, fontSize: 13 }} onClick={() => onToast("Note added!", "success")}>📝 Add Note</button>
                  <button style={{ background: "none", border: "none", color: "var(--color-surface-raised)", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Outfit", textDecoration: "underline" }}>View Care Guide</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Add Plant Modal */}
      {showAddModal && (
        <Modal title="Add a Plant" onClose={() => setShowAddModal(false)} maxWidth={480}
          footer={<><button type="button" className="btn-profile-outline" onClick={() => setShowAddModal(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</button><button type="submit" form="add-plant-form" className="btn-profile-primary" style={{ flex: 1, justifyContent: "center" }}>Save Plant</button></>}>
          <form id="add-plant-form" onSubmit={handleAddPlant}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Plant Name *</label>
                <input className="profile-input" placeholder="Monstera Deliciosa" value={newPlant.name} onChange={e => setNewPlant(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Nickname</label>
                <input className="profile-input" placeholder="My Monstera" value={newPlant.nickname} onChange={e => setNewPlant(p => ({ ...p, nickname: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Date Added *</label>
                <input className="profile-input" type="date" value={newPlant.date} onChange={e => setNewPlant(p => ({ ...p, date: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Location</label>
                <input className="profile-input" placeholder="Living Room" value={newPlant.location} onChange={e => setNewPlant(p => ({ ...p, location: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Photo</label>
                <button type="button" className="btn-profile-outline" style={{ width: "100%", justifyContent: "center" }}>📷 Take Photo / Upload</button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
/* ─────────────────────────────────────────────
   SECTION: PERSONAL INFO
───────────────────────────────────────────── */
function PersonalInfoSection({
  onToast, profile, onSave, isSaving,
}: {
  onToast: (msg: string, t?: ToastType["type"]) => void;
  profile: any;
  onSave: (data: any) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    firstName: profile?.first_name ?? "",
    lastName: profile?.last_name ?? "",
    email: profile?.email ?? "",
    email_verified: profile.email_verified ?? false,
    phone: profile?.phone ?? "",
    phone_verified: profile.phone_verified ?? false,
    dob: "", gender: "", about: "", language: "English", currency: "INR",
  });
  useEffect(() => {
    if (profile) {
      setForm(f => ({
        ...f,
        firstName: profile.first_name ?? "",
        lastName: profile.last_name ?? "",
        email: profile.email ?? "",
        email_verified: profile.email_verified ?? false,
        phone: profile.phone ?? "",
        phone_verified: profile.phone_verified ?? false,
      }));
    }
  }, [profile]);
  const initials = (form.firstName?.[0] ?? "") + (form.lastName?.[0] ?? "");
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };
  const aboutLength = form.about.length;
  return (
    <section aria-label="Personal Information" style={{ animation: "slideUp var(--motion-normal) ease" }}>
      <div className="section-hdr">
        <h2 className="section-title-lg">Personal Information</h2>
      </div>
      {/* Avatar section */}
      <div className="profile-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 16 }}>Profile Photo</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--profile-avatar-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "var(--profile-avatar-text)" }}>{initials.toUpperCase() || "?"}</div>
            <button aria-label="Change profile photo"
              style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, opacity: 0, transition: "opacity var(--motion-instant)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0"; }}>
              📷
            </button>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn-profile-outline" style={{ height: 36, fontSize: 13 }}>Change Photo</button>
            <button style={{ background: "none", border: "none", color: "var(--profile-danger-text)", fontWeight: 500, fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }}>Remove Photo</button>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "var(--profile-meta)", marginTop: 10 }}>JPG, PNG or WebP. Max 5MB.</p>
      </div>
      {/* Email verification banner (shown when email is not verified) */}
      {!form.email_verified && (
        <div role="alert" aria-live="assertive" style={{ background: "rgba(217,119,6,0.08)", borderLeft: "4px solid #d97706", borderRadius: "var(--radius-sm)", padding: "12px 16px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span>⚠️</span>
          <p style={{ fontSize: 14, color: "var(--profile-heading)", flex: 1 }}>Verify your email — We sent a link to {form.email}</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ background: "none", border: "none", color: "var(--color-surface-raised)", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }} onClick={() => onToast("Verification email resent!", "info")}>Resend Email</button>
            <button style={{ background: "none", border: "none", color: "var(--profile-meta)", fontWeight: 500, fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }}>Change Email</button>
          </div>
        </div>
      )}
      <form onSubmit={handleSave}>
        <div className="profile-card">
          <div className="form-grid-2" style={{ gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>First Name *</label>
              <input className="profile-input" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required maxLength={50} aria-required="true" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Last Name *</label>
              <input className="profile-input" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required maxLength={50} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Email Address *</label>
              <input className="profile-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Phone Number</label>
              <input className="profile-input" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Date of Birth</label>
              <input className="profile-input" type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Gender</label>
              <select className="profile-select" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>About Me</label>
            <textarea className="profile-textarea" value={form.about} onChange={e => setForm(f => ({ ...f, about: e.target.value }))} maxLength={240} placeholder="Describe yourself as a plant lover..." aria-live="polite" />
            <p style={{ fontSize: 9, textAlign: "right", color: aboutLength >= 192 ? (aboutLength >= 240 ? "var(--profile-danger-text)" : "var(--profile-status-processing)") : "var(--profile-meta)", marginTop: 4 }}>{aboutLength} / 240</p>
          </div>
          <div className="form-grid-2" style={{ marginTop: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Preferred Language</label>
              <select className="profile-select" value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
                <option>English</option><option>Hindi</option><option>Marathi</option><option>Telugu</option><option>Tamil</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Currency</label>
              <select className="profile-select" value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                <option>INR (₹)</option><option>USD ($)</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 24, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button type="button" style={{ background: "none", border: "none", color: "var(--profile-meta)", cursor: "pointer", fontSize: 14, fontFamily: "Outfit" }}>Cancel</button>
            <button type="submit" className="btn-profile-primary" style={{ minWidth: 140, justifyContent: "center" }} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
/* ─────────────────────────────────────────────
   SECTION: ADDRESSES
───────────────────────────────────────────── */
function AddressesSection({
  onToast, addresses, onAdd, onUpdate, onDelete
}: {
  onToast: (msg: string, t?: ToastType["type"]) => void;
  addresses: any[];
  onAdd: (a: any) => void;
  onUpdate: (id: number, a: any) => void;
  onDelete: (id: number) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [editAddr, setEditAddr] = useState<any | null>(null);
  const [form, setForm] = useState({ type: "Home", name: "", phone: "", pin: "", city: "", line1: "", line2: "", state: "", country: "India", isDefault: false });

  const openAdd = () => {
    setEditAddr(null);
    setForm({ type: "Home", name: "", phone: "", pin: "", city: "", line1: "", line2: "", state: "", country: "India", isDefault: false });
    setShowModal(true);
  };

  const openEdit = (addr: any) => {
    setEditAddr(addr);
    setForm({
      type: addr.label || "Home",
      name: addr.recipient_name || "",
      phone: addr.phone || "",
      pin: addr.pincode || "",
      city: addr.city || "",
      line1: addr.line1 || "",
      line2: addr.line2 || "",
      state: addr.state || "",
      country: addr.country || "India",
      isDefault: addr.is_default || false,
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      label: form.type,
      recipient_name: form.name,
      phone: form.phone,
      line1: form.line1,
      line2: form.line2 || undefined,
      city: form.city,
      state: form.state,
      pincode: form.pin,
      country: form.country,
      is_default: form.isDefault,
    };

    if (editAddr) {
      onUpdate(editAddr.id, payload);
    } else {
      onAdd(payload);
    }
    setShowModal(false);
  };

  return (
    <section aria-label="Saved Addresses" style={{ animation: "slideUp var(--motion-normal) ease" }}>
      <div className="section-hdr">
        <h2 className="section-title-lg">Saved Addresses <span className="section-count">({addresses.length})</span></h2>
        <button className="btn-profile-primary" onClick={openAdd}>+ Add New Address</button>
      </div>
      {addresses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📍</div>
          <h3>No addresses saved</h3>
          <p>Add a delivery address to speed up your checkout.</p>
          <button className="btn-profile-primary" onClick={openAdd}>+ Add First Address</button>
        </div>
      ) : (
        <div className="address-grid">
          {addresses.map((addr: any) => {
            const isDefault = addr.is_default;
            const icon = addr.label === "Home" ? "🏠" : addr.label === "Work" ? "🏢" : "📍";
            const fullName = addr.recipient_name || "";
            return (
              <div key={addr.id} className="profile-card" style={{ borderColor: isDefault ? "var(--color-surface-raised)" : "var(--profile-card-border)", borderWidth: isDefault ? 2 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "flex-start" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--profile-heading)" }}>{icon} {addr.label || "Address"}</p>
                  {isDefault && <span style={{ background: "var(--color-surface-raised)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-full)" }}>Default</span>}
                </div>
                <div style={{ borderTop: "1px solid var(--profile-divider)", paddingTop: 10 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--profile-heading)" }}>{fullName}</p>
                  <p style={{ fontSize: 14, color: "var(--profile-body)", lineHeight: 1.6 }}>{addr.line1}</p>
                  {addr.line2 && <p style={{ fontSize: 14, color: "var(--profile-body)", lineHeight: 1.6 }}>{addr.line2}</p>}
                  <p style={{ fontSize: 14, color: "var(--profile-body)", lineHeight: 1.6 }}>{addr.city} — {addr.pincode}</p>
                  <p style={{ fontSize: 14, color: "var(--profile-body)", lineHeight: 1.6 }}>{addr.state}, {addr.country}</p>
                  <p style={{ fontSize: 14, color: "var(--profile-meta)", marginTop: 6 }}>📞 {addr.phone}</p>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
                  <button className="btn-profile-outline" style={{ height: 34, fontSize: 13 }} onClick={() => openEdit(addr)}>Edit</button>
                  <button style={{ background: "none", border: "none", color: "var(--profile-danger-text)", fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }} onClick={() => onDelete(addr.id)}>Delete</button>
                  {!isDefault && (
                    <button
                      style={{ background: "none", border: "none", color: "var(--color-surface-raised)", fontSize: 13, cursor: "pointer", fontFamily: "Outfit", fontWeight: 600 }}
                      onClick={() => onUpdate(addr.id, {
                        label: addr.label,
                        recipient_name: addr.recipient_name,
                        phone: addr.phone,
                        line1: addr.line1,
                        line2: addr.line2 || undefined,
                        city: addr.city,
                        state: addr.state,
                        pincode: addr.pincode,
                        country: addr.country,
                        is_default: true
                      })}
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editAddr ? "Edit Address" : "Add New Address"} onClose={() => setShowModal(false)} maxWidth={560}
          footer={<><button type="button" className="btn-profile-outline" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</button><button type="submit" form="addr-form" className="btn-profile-primary" style={{ flex: 1, justifyContent: "center" }}>Save Address</button></>}>
          <form id="addr-form" onSubmit={handleSave}>
            {/* Address type */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {["Home", "Work", "Other"].map(t => (
                <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                  style={{ flex: 1, height: 40, borderRadius: "var(--radius-sm)", border: `1px solid ${form.type === t ? "var(--color-surface-raised)" : "var(--profile-input-border)"}`, background: form.type === t ? "var(--profile-sidebar-active-bg)" : "transparent", color: form.type === t ? "var(--color-surface-raised)" : "var(--profile-body)", fontWeight: form.type === t ? 700 : 500, cursor: "pointer", fontFamily: "Outfit", fontSize: 14 }}>
                  {t === "Home" ? "🏠" : t === "Work" ? "🏢" : "☆"} {t}
                </button>
              ))}
            </div>
            <div className="form-grid-2">
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Full Name *</label>
                <input className="profile-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Phone Number *</label>
                <input className="profile-input" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Pincode *</label>
                <input className="profile-input" value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value }))} required maxLength={6} placeholder="6-digit pincode" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>City *</label>
                <input className="profile-input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Address Line 1 *</label>
              <input className="profile-input" value={form.line1} onChange={e => setForm(f => ({ ...f, line1: e.target.value }))} required />
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Address Line 2</label>
              <input className="profile-input" value={form.line2} onChange={e => setForm(f => ({ ...f, line2: e.target.value }))} />
            </div>
            <div className="form-grid-2" style={{ marginTop: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>State *</label>
                <select className="profile-select" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required>
                  <option value="">Select state</option>
                  <option>Maharashtra</option><option>Karnataka</option><option>Tamil Nadu</option><option>Delhi</option><option>Gujarat</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Country</label>
                <input className="profile-input" value={form.country} readOnly />
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, cursor: "pointer", fontSize: 14, color: "var(--profile-body)" }}>
              <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} style={{ width: 18, height: 18, accentColor: "var(--color-surface-raised)" }} />
              Set as default address
            </label>
          </form>
        </Modal>
      )}
    </section>
  );
}
/* ─────────────────────────────────────────────
   SECTION: LOYALTY REWARDS
───────────────────────────────────────────── */
function LoyaltySection({
  onToast, loyalty, tierMeta, pointsHistory,
}: {
  onToast: (msg: string, t?: ToastType["type"]) => void;
  loyalty: any;
  tierMeta: any;
  pointsHistory: any[];
}) {
  const pts = loyalty?.points_balance ?? 0;
  const maxRedeem = pts;
  const [showRedeem, setShowRedeem] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState(100);
  const tiers = [
    { name: "🌿 Plant Lover", range: "0–499 pts", current: true, benefits: ["1 point per ₹10 spent", "Birthday discount"] },
    { name: "🥈 Silver", range: "500–999 pts", current: false, benefits: ["1.5× points", "Free delivery on ₹399+"] },
    { name: "🥇 Gold", range: "1000+ pts", current: false, benefits: ["2× points", "Free delivery always", "Early sale access"] },
  ];
  return (
    <section aria-label="Loyalty Rewards" style={{ animation: "slideUp var(--motion-normal) ease" }}>
      <div className="section-hdr">
        <h2 className="section-title-lg">Loyalty Rewards</h2>
      </div>
      {/* Points summary card */}
      <div style={{ background: "var(--profile-points-bg)", border: "1px solid var(--color-surface-raised)", borderRadius: "var(--radius-xl)", padding: 24, marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: "var(--profile-meta)", marginBottom: 12 }}>🏅 Green Points</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          <div>
            <span style={{ fontSize: 36, fontWeight: 800, color: "var(--color-surface-raised)" }}>{pts}</span>
            <span style={{ fontSize: 14, color: "var(--profile-meta)", marginLeft: 6 }}>points</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--profile-meta)" }}>{tierMeta?.emoji ?? "🌱"} {tierMeta?.label ?? "Plant Lover"}</p>
        </div>
        <div className="loyalty-progress-track" style={{ marginBottom: 8 }}>
          <div className="loyalty-progress-fill" style={{ width: `${Math.min((pts / 500) * 100, 100)}%` }} role="progressbar" aria-label={`${pts} of 500 points`} aria-valuenow={pts} aria-valuemin={0} aria-valuemax={500} />
        </div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-surface-raised)", textAlign: "right", marginBottom: 16 }}>{pts} / 500</p>
        {/* Tier journey */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-surface-raised)" }}>🌿 Plant Lover</span>
          <span style={{ color: "var(--profile-meta)", fontSize: 12 }}>——→</span>
          <span style={{ fontSize: 13, color: "var(--profile-meta)" }}>🥈 Silver</span>
          <span style={{ color: "var(--profile-meta)", fontSize: 12 }}>——→</span>
          <span style={{ fontSize: 13, color: "var(--profile-meta)" }}>🥇 Gold</span>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn-profile-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowRedeem(true)}>Redeem Points</button>
          <button className="btn-profile-outline" style={{ flex: 1, justifyContent: "center" }}>Points History</button>
        </div>
      </div>
      {/* Tier benefits table */}
      <div className="profile-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--profile-heading)", marginBottom: 16 }}>Tier Benefits</h3>
        <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--profile-divider)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }} role="table">
            <thead>
              <tr style={{ background: "rgba(0,181,102,0.08)" }}>
                <th style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: "var(--profile-heading)", textAlign: "left", borderBottom: "1px solid var(--profile-divider)" }}>Tier</th>
                <th style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: "var(--profile-heading)", textAlign: "left", borderBottom: "1px solid var(--profile-divider)" }}>Points</th>
                <th style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: "var(--profile-heading)", textAlign: "left", borderBottom: "1px solid var(--profile-divider)" }}>Benefits</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier, i) => (
                <tr key={i} aria-selected={tier.current}
                  style={{ background: tier.current ? "rgba(0,181,102,0.06)" : "transparent", borderLeft: tier.current ? "3px solid var(--color-surface-raised)" : "3px solid transparent" }}>
                  <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: tier.current ? 700 : 400, color: tier.current ? "var(--color-surface-raised)" : "var(--profile-heading)", borderBottom: i < tiers.length - 1 ? "1px solid var(--profile-divider)" : "none" }}>{tier.name}</td>
                  <td style={{ padding: "12px 14px", fontSize: 14, color: "var(--profile-meta)", borderBottom: i < tiers.length - 1 ? "1px solid var(--profile-divider)" : "none" }}>{tier.range}</td>
                  <td style={{ padding: "12px 14px", fontSize: 14, color: "var(--profile-body)", borderBottom: i < tiers.length - 1 ? "1px solid var(--profile-divider)" : "none" }}>{tier.benefits.join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Points history */}
      <div className="profile-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--profile-heading)", marginBottom: 16 }}>Points History</h3>
        <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--profile-divider)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(0,181,102,0.08)" }}>
                <th style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: "var(--profile-heading)", textAlign: "left", borderBottom: "1px solid var(--profile-divider)" }}>Date</th>
                <th style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: "var(--profile-heading)", textAlign: "left", borderBottom: "1px solid var(--profile-divider)" }}>Description</th>
                <th style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: "var(--profile-heading)", textAlign: "right", borderBottom: "1px solid var(--profile-divider)" }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {pointsHistory.map((h, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(28,28,28,0.02)" }}>
                  <td style={{ padding: "10px 14px", fontSize: 14, color: "var(--profile-meta)", borderBottom: i < pointsHistory.length - 1 ? "1px solid var(--profile-divider)" : "none" }}>{h.date}</td>
                  <td style={{ padding: "10px 14px", fontSize: 14, color: "var(--profile-body)", borderBottom: i < pointsHistory.length - 1 ? "1px solid var(--profile-divider)" : "none" }}>{h.desc}</td>
                  <td style={{ padding: "10px 14px", fontSize: 14, fontWeight: 600, color: h.positive ? "var(--profile-status-delivered)" : "var(--profile-status-cancelled)", textAlign: "right", borderBottom: i < pointsHistory.length - 1 ? "1px solid var(--profile-divider)" : "none" }}>
                    {h.positive ? "+" : ""}{h.points} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button style={{ display: "block", width: "100%", marginTop: 14, background: "none", border: "none", color: "var(--color-surface-raised)", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Outfit", textAlign: "center" }}>Load more history</button>
      </div>
      {/* Redeem Modal */}
      {showRedeem && (
        <Modal title="Redeem Green Points" onClose={() => setShowRedeem(false)} maxWidth={440}
          footer={<button className="btn-profile-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setShowRedeem(false); onToast(`${redeemPoints} points redeemed! Code: GREEN-${Math.floor(redeemPoints * 0.1)}`, "success"); }}>Apply to Next Order</button>}>
          <p style={{ fontSize: 14, color: "var(--profile-meta)", marginBottom: 20 }}>Available: <strong style={{ color: "var(--profile-heading)" }}>{pts} pts = ₹{Math.floor(pts * 0.1)} off</strong></p>
          <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 10 }}>Points to redeem:</label>
          <input type="range" min={100} max={maxRedeem} step={10} value={redeemPoints} onChange={e => setRedeemPoints(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--color-surface-raised)", marginBottom: 8 }} aria-label="Points to redeem" />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-surface-raised)" }}>{redeemPoints} pts</span>
            <span style={{ fontSize: 14, color: "var(--profile-meta)" }}>= ₹{Math.floor(redeemPoints * 0.1)} off</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--profile-meta)", marginTop: 12 }}>Value: ₹{Math.floor(redeemPoints * 0.1)} off your next order</p>
        </Modal>
      )}
    </section>
  );
}
/* ─────────────────────────────────────────────
   SECTION: PAYMENT METHODS
───────────────────────────────────────────── */
function PaymentSection({ onToast }: { onToast: (msg: string, t?: ToastType["type"]) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [cards] = useState([
    { id: 1, network: "Visa", last4: "4821", expiry: "09/28", isDefault: true },
    { id: 2, network: "Mastercard", last4: "1234", expiry: "12/25", isDefault: false },
  ]);
  return (
    <section aria-label="Payment Methods" style={{ animation: "slideUp var(--motion-normal) ease" }}>
      <div className="section-hdr">
        <h2 className="section-title-lg">Payment Methods</h2>
        <button className="btn-profile-primary" onClick={() => setShowAdd(true)}>+ Add Card</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {cards.map(card => (
          <div key={card.id} className="profile-card" style={{ borderColor: card.isDefault ? "var(--color-surface-raised)" : "var(--profile-card-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 30, background: "rgba(0,181,102,0.08)", borderRadius: "var(--radius-xs)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--profile-heading)", border: "1px solid var(--profile-divider)" }}>
                  {card.network === "Visa" ? "VISA" : "MC"}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--profile-heading)" }}>•••• •••• •••• {card.last4}</p>
                  <p style={{ fontSize: 12, color: "var(--profile-meta)" }}>Expires: {card.expiry}</p>
                </div>
              </div>
              {card.isDefault && <span style={{ background: "var(--color-surface-raised)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-full)" }}>Default</span>}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ background: "none", border: "none", color: "var(--profile-danger-text)", fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }} onClick={() => onToast("Card removed", "info")}>Remove</button>
              {!card.isDefault && <button style={{ background: "none", border: "none", color: "var(--color-surface-raised)", fontSize: 13, cursor: "pointer", fontFamily: "Outfit", fontWeight: 600 }} onClick={() => onToast("Default card updated ✓", "success")}>Set as Default</button>}
            </div>
          </div>
        ))}
      </div>
      {showAdd && (
        <Modal title="Add New Card" onClose={() => setShowAdd(false)} maxWidth={480}
          footer={<><button type="button" className="btn-profile-outline" onClick={() => setShowAdd(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</button><button type="button" className="btn-profile-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setShowAdd(false); onToast("Card added securely!", "success"); }}>Save Card</button></>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Card Number</label>
              <input className="profile-input" placeholder="1234 5678 9012 3456" maxLength={19} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Name on Card</label>
              <input className="profile-input" placeholder="PRIYA KUMAR" />
            </div>
            <div className="form-grid-2">
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Expiry (MM/YY)</label>
                <input className="profile-input" placeholder="09/28" maxLength={5} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>CVV</label>
                <input className="profile-input" type="password" placeholder="•••" maxLength={4} />
              </div>
            </div>
            <div style={{ background: "rgba(0,181,102,0.06)", borderRadius: "var(--radius-sm)", padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "var(--color-surface-raised)", fontSize: 14 }}>🔒</span>
              <p style={{ fontSize: 12, color: "var(--profile-meta)" }}>Your card details are encrypted and stored securely. We never store your CVV.</p>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
/* ─────────────────────────────────────────────
   SECTION: REVIEWS
───────────────────────────────────────────── */
function ReviewsSection({ onToast }: { onToast: (msg: string, t?: ToastType["type"]) => void }) {
  const [tab, setTab] = useState<"written" | "pending">("written");
  const [showModal, setShowModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  return (
    <section aria-label="My Reviews" style={{ animation: "slideUp var(--motion-normal) ease" }}>
      <div className="section-hdr">
        <h2 className="section-title-lg">My Reviews <span className="section-count">({REVIEWS_WRITTEN.length + REVIEWS_PENDING.length})</span></h2>
      </div>
      {/* Tabs */}
      <div className="filter-tabs" role="tablist" style={{ marginBottom: 20 }}>
        <button className={`filter-tab ${tab === "written" ? "active" : ""}`} role="tab" aria-selected={tab === "written"} onClick={() => setTab("written")}>Written ({REVIEWS_WRITTEN.length})</button>
        <button className={`filter-tab ${tab === "pending" ? "active" : ""}`} role="tab" aria-selected={tab === "pending"} onClick={() => setTab("pending")}>Pending ({REVIEWS_PENDING.length})</button>
      </div>
      {tab === "written" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {REVIEWS_WRITTEN.map(review => (
            <div key={review.id} className="profile-card">
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 56, height: 56, borderRadius: "var(--radius-sm)", background: "rgba(0,181,102,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, border: "1px solid var(--profile-divider)" }}>{review.img}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>{review.product}</p>
                  <StarRating value={review.rating} size={18} />
                  <p style={{ fontSize: 9, color: "var(--profile-meta)", marginTop: 4 }}>Ordered: {review.ordered}</p>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "var(--profile-body)", lineHeight: 1.6, marginTop: 12, fontStyle: "italic" }}>&ldquo;{review.text}&rdquo;</p>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button className="btn-profile-outline" style={{ height: 34, fontSize: 13 }} onClick={() => { setReviewProduct(review.product); setRating(review.rating); setReviewText(review.text); setShowModal(true); }}>Edit Review</button>
                <button style={{ background: "none", border: "none", color: "var(--profile-danger-text)", fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }} onClick={() => onToast("Review deleted", "info")}>Delete Review</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "pending" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {REVIEWS_PENDING.map(p => (
            <div key={p.id} className="profile-card">
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "var(--radius-sm)", background: "rgba(0,181,102,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: "1px solid var(--profile-divider)" }}>{p.img}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 4 }}>{p.product}</p>
                  <p style={{ fontSize: 9, color: "var(--profile-meta)" }}>Ordered: {p.ordered}</p>
                  <p style={{ fontSize: 13, color: "var(--profile-meta)", marginTop: 8 }}>How was this plant?</p>
                  <StarRating value={0} onChange={setRating} size={24} />
                </div>
              </div>
              <button className="btn-profile-primary" style={{ marginTop: 14, height: 38, fontSize: 14 }} onClick={() => { setReviewProduct(p.product); setRating(0); setReviewText(""); setShowModal(true); }}>Write a Review</button>
            </div>
          ))}
        </div>
      )}
      {/* Review Modal */}
      {showModal && (
        <Modal title={`Review: ${reviewProduct}`} onClose={() => setShowModal(false)} maxWidth={560}
          footer={<><button type="button" className="btn-profile-outline" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</button><button type="button" className="btn-profile-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setShowModal(false); onToast("Review submitted! Thank you ⭐", "success"); }}>Submit Review</button></>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 8 }}>Rating *</label>
              <StarRating value={rating} onChange={setRating} size={32} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Review Title</label>
              <input className="profile-input" placeholder="Great plant!" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Your Review *</label>
              <textarea className="profile-textarea" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Arrived in perfect condition..." minLength={50} maxLength={2000} style={{ minHeight: 120 }} />
              <p style={{ fontSize: 9, textAlign: "right", color: reviewText.length >= 1600 ? "var(--profile-status-processing)" : "var(--profile-meta)", marginTop: 4 }}>50–2000 characters · {reviewText.length} / 2000</p>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Add Photos (optional)</label>
              <button type="button" className="btn-profile-outline" style={{ fontSize: 13 }}>📷 Add up to 3 photos</button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
/* ─────────────────────────────────────────────
   SECTION: NOTIFICATIONS
───────────────────────────────────────────── */
function NotificationsSection({ onToast }: { onToast: (msg: string, t?: ToastType["type"]) => void }) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [prefs, setPrefs] = useState({
    orderUpdates: { email: true, push: true, sms: false },
    watering: { email: false, push: true, sms: false },
    priceDrops: { email: true, push: false, sms: false },
    offers: { email: true, push: false, sms: false },
    loyalty: { email: true, push: true, sms: false },
  });
  const markAllRead = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); onToast("All notifications marked as read", "success"); };
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const togglePref = (category: keyof typeof prefs, channel: "email" | "push" | "sms") => {
    setPrefs(p => ({ ...p, [category]: { ...p[category], [channel]: !p[category][channel] } }));
    onToast("Notification preference saved ✓", "success");
  };
  const unreadCount = notifications.filter(n => !n.read).length;
  const prefRows = [
    { key: "orderUpdates", label: "Order Updates" },
    { key: "watering", label: "Watering Reminders" },
    { key: "priceDrops", label: "Wishlist price drops" },
    { key: "offers", label: "New arrivals & offers" },
    { key: "loyalty", label: "Loyalty rewards" },
  ] as const;
  return (
    <section aria-label="Notifications" style={{ animation: "slideUp var(--motion-normal) ease" }}>
      <div className="section-hdr">
        <h2 className="section-title-lg">Notifications {unreadCount > 0 && <span style={{ fontSize: 14, background: "var(--color-surface-raised)", color: "#fff", padding: "2px 8px", borderRadius: "var(--radius-full)", marginLeft: 8 }}>{unreadCount}</span>}</h2>
        <button className="btn-profile-outline" style={{ height: 36, fontSize: 13 }} onClick={markAllRead}>Mark All as Read</button>
      </div>
      <div className="profile-card" style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
        {notifications.map(n => (
          <div key={n.id} className={`notif-item ${n.read ? "read" : "unread"}`} onClick={() => markRead(n.id)} aria-label={`${n.title}. ${n.time}. ${n.read ? "Read" : "Unread"}`}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{n.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: n.read ? 400 : 600, color: n.read ? "var(--profile-body)" : "var(--profile-heading)", marginBottom: 2 }}>{n.title}</p>
              <p style={{ fontSize: 13, color: "var(--profile-meta)" }}>{n.body}</p>
            </div>
            <span style={{ fontSize: 9, color: "var(--profile-meta)", whiteSpace: "nowrap", flexShrink: 0 }}>{n.time}</span>
          </div>
        ))}
      </div>
      {/* Notification preferences */}
      <div className="profile-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--profile-heading)", marginBottom: 16 }}>Notification Preferences</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", gap: 8, paddingBottom: 10, borderBottom: "1px solid var(--profile-divider)", marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--profile-meta)" }}></span>
            {["Email", "Push", "SMS"].map(ch => <span key={ch} style={{ fontSize: 12, fontWeight: 700, color: "var(--profile-meta)", textAlign: "center" }}>{ch}</span>)}
          </div>
          {prefRows.map(row => (
            <div key={row.key} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", gap: 8, alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--profile-divider)" }}>
              <span style={{ fontSize: 14, color: "var(--profile-body)" }}>{row.label}</span>
              {(["email", "push", "sms"] as const).map(ch => (
                <div key={ch} style={{ display: "flex", justifyContent: "center" }}>
                  <ToggleSwitch checked={prefs[row.key][ch]} onChange={() => togglePref(row.key, ch)} label={`${row.label} ${ch} notifications`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ─────────────────────────────────────────────
   SECTION: SECURITY
───────────────────────────────────────────── */
function SecuritySection({ onToast }: { onToast: (msg: string, t?: ToastType["type"]) => void }) {
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [pwd, setPwd] = useState({ current: "", newPwd: "", confirm: "" });
  const [showPwd, setShowPwd] = useState({ current: false, newPwd: false, confirm: false });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const getStrength = (p: string): number => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strengthInfo = [
    { color: "var(--profile-status-cancelled)", label: "Weak" },
    { color: "var(--profile-status-processing)", label: "Fair" },
    { color: "#2563eb", label: "Good" },
    { color: "var(--profile-status-delivered)", label: "Strong" },
  ];
  const strength = getStrength(pwd.newPwd);
  const securityItems = [
    {
      icon: "🔑", title: "Password", desc: "Last changed: 45 days ago",
      action: <button className="btn-profile-outline" style={{ height: 36, fontSize: 13 }} onClick={() => setShowChangePwd(true)}>Change Password</button>
    },
    {
      icon: "📱", title: "Two-Factor Authentication", desc: "Add extra security to your account",
      action: <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 13, color: "var(--profile-meta)" }}>{twoFA ? "ON" : "OFF"}</span>
        <ToggleSwitch checked={twoFA} onChange={v => { setTwoFA(v); setShow2FA(v); onToast(v ? "2FA enabled!" : "2FA disabled", v ? "success" : "info"); }} label="Two-factor authentication" />
      </div>
    },
  ];
  const sessions = [
    { device: "Chrome", location: "Mumbai, MH", time: "2 mins ago", current: true },
    { device: "Safari", location: "Pune, MH", time: "3 days ago", current: false },
  ];
  return (
    <section aria-label="Security" style={{ animation: "slideUp var(--motion-normal) ease" }}>
      <div className="section-hdr">
        <h2 className="section-title-lg">Security</h2>
      </div>
      {/* Security items */}
      <div className="profile-card" style={{ marginBottom: 16, padding: 0, overflow: "hidden" }}>
        {securityItems.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: i < securityItems.length - 1 ? "1px solid var(--profile-divider)" : "none", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--profile-heading)" }}>{item.title}</p>
                <p style={{ fontSize: 13, color: "var(--profile-meta)" }}>{item.desc}</p>
              </div>
            </div>
            {item.action}
          </div>
        ))}
      </div>
      {/* Active sessions */}
      <div className="profile-card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--profile-heading)", marginBottom: 14 }}>💻 Active Sessions</h3>
        {sessions.map((session, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < sessions.length - 1 ? "1px solid var(--profile-divider)" : "none" }}>
            <div>
              <p style={{ fontSize: 14, color: "var(--profile-heading)", fontWeight: 500 }}>{session.device} · {session.location}</p>
              <p style={{ fontSize: 12, color: "var(--profile-meta)" }}>{session.time} {session.current ? "· Current" : ""}</p>
            </div>
            {!session.current && <button style={{ background: "none", border: "none", color: "var(--profile-danger-text)", fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }} onClick={() => onToast("Session signed out", "info")}>Sign Out</button>}
          </div>
        ))}
      </div>
      {/* Delete account */}
      <div className="profile-card">
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontSize: 24 }}>🗑</span>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--profile-heading)", marginBottom: 4 }}>Delete Account</h3>
            <p style={{ fontSize: 13, color: "var(--profile-meta)", marginBottom: 14 }}>Permanently delete your account and all data</p>
            <button className="btn-profile-danger" style={{ height: 40, fontSize: 14 }} aria-label="Delete your account permanently" onClick={() => setShowDeleteConfirm(true)}>Delete Account</button>
          </div>
        </div>
      </div>
      {/* Change Password Modal */}
      {showChangePwd && (
        <Modal title="Change Password" onClose={() => setShowChangePwd(false)} maxWidth={480}
          footer={<><button type="button" className="btn-profile-outline" onClick={() => setShowChangePwd(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</button><button type="button" className="btn-profile-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => { if (pwd.newPwd !== pwd.confirm) { onToast("Passwords don't match. Try again.", "error"); return; } setShowChangePwd(false); onToast("Password changed successfully!", "success"); }}>Save Password</button></>}>
          {(["current", "newPwd", "confirm"] as const).map(field => (
            <div key={field} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>
                {field === "current" ? "Current Password" : field === "newPwd" ? "New Password" : "Confirm New Password"}
              </label>
              <div style={{ position: "relative" }}>
                <input className="profile-input" type={showPwd[field] ? "text" : "password"} value={pwd[field]} onChange={e => setPwd(p => ({ ...p, [field]: e.target.value }))} style={{ paddingRight: 48 }} />
                <button type="button" onClick={() => setShowPwd(p => ({ ...p, [field]: !p[field] }))} aria-label={`${showPwd[field] ? "Hide" : "Show"} password`} aria-pressed={showPwd[field]}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--profile-meta)" }}>
                  {showPwd[field] ? "🙈" : "👁"}
                </button>
              </div>
              {field === "newPwd" && pwd.newPwd && (
                <div>
                  <div className="pwd-strength-bar">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="pwd-seg" style={{ background: i < strength ? strengthInfo[strength - 1].color : "var(--profile-divider)" }} />
                    ))}
                  </div>
                  <p role="status" aria-live="polite" style={{ fontSize: 12, color: strengthInfo[Math.max(0, strength - 1)].color, marginTop: 4 }}>{strength > 0 ? strengthInfo[strength - 1].label : ""}</p>
                </div>
              )}
            </div>
          ))}
        </Modal>
      )}
      {/* Delete Account Modal */}
      {showDeleteConfirm && (
        <Modal title="Delete Account" onClose={() => setShowDeleteConfirm(false)} maxWidth={480}>
          <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 8 }}>This action is permanent and cannot be undone</p>
            <p style={{ fontSize: 13, color: "var(--profile-meta)", marginBottom: 24 }}>All your orders, plants, reviews, and data will be deleted.</p>
            <div style={{ textAlign: "left", marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--profile-heading)", marginBottom: 6 }}>Type DELETE to confirm</label>
              <input className="profile-input" value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder='Type "DELETE"' />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-profile-outline" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button
                disabled={deleteInput !== "DELETE"}
                onClick={() => { if (deleteInput === "DELETE") { setShowDeleteConfirm(false); onToast("Account deletion requested", "info"); } }}
                style={{ flex: 1, justifyContent: "center", opacity: deleteInput !== "DELETE" ? 0.4 : 1, cursor: deleteInput !== "DELETE" ? "not-allowed" : "pointer", background: "transparent", color: "var(--profile-danger-text)", border: "1px solid var(--profile-danger-border)", borderRadius: "var(--radius-full)", height: 44, fontWeight: 600, fontSize: 15, fontFamily: "Outfit", display: "inline-flex", alignItems: "center" }}>
                Delete My Account
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
/* ─────────────────────────────────────────────
   NAV ITEMS CONFIG
───────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "overview", icon: "🏠", label: "Overview", badge: null },
  { id: "orders", icon: "📦", label: "My Orders", badge: null },
  { id: "wishlist", icon: "♡", label: "Wishlist", badge: null },
  { id: "plants", icon: "🌿", label: "My Plants", badge: null },
  { id: "personal-info", icon: "👤", label: "Personal Info", badge: null },
  { id: "addresses", icon: "📍", label: "Addresses", badge: null },
  { id: "loyalty", icon: "🏅", label: "Loyalty Rewards", badge: null },
  { id: "payments", icon: "💳", label: "Payment Methods", badge: null },
  { id: "reviews", icon: "⭐", label: "My Reviews", badge: null },
  { id: "notifications", icon: "🔔", label: "Notifications", badge: null },
  { id: "security", icon: "🔒", label: "Security", badge: null },
];
const MOBILE_TABS = [
  { id: "overview", icon: "🏠", label: "Home" },
  { id: "orders", icon: "📦", label: "Orders" },
  { id: "wishlist", icon: "♡", label: "Wishlist" },
  { id: "personal-info", icon: "👤", label: "Profile" },
];
/* ─────────────────────────────────────────────
   MAIN PROFILE PAGE
───────────────────────────────────────────── */
export default function ProfilePage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [showSignOut, setShowSignOut] = useState(false);
  const { toasts, addToast } = useToast();
  const { logout } = useAuthStore();

  // ── Real API data ────────────────────────────────────────────────────────
  const { profile, isLoading: profileLoading } = useMe();
  const { updateProfile, isLoading: isUpdatingProfile } = useUpdateProfile();
  const { addresses } = useAddresses();
  const { addAddress } = useAddAddress();
  const { updateAddress } = useUpdateAddress();
  const { deleteAddress } = useDeleteAddress();
  const { loyalty, tierMeta } = useLoyalty();
  const { items: wishlistItems } = useWishlist();
  const { addToWishlist } = useAddToWishlist();
  const { removeFromWishlist } = useRemoveWishlist();
  const { plants } = useMyPlants();
  const { addPlant } = useAddPlant();
  const { addLog: addPlantLog } = useAddPlantLog();
  const { orders: myOrders, total: myOrdersTotal } = useMyOrders(1);

  // ── Derived user display values ─────────────────────────────────────────
  const firstName   = profile?.first_name ?? "";
  const lastName    = profile?.last_name ?? "";
  const userEmail   = profile?.email ?? "";
  const initials    = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : firstName ? firstName[0].toUpperCase() : "?";
  const tierLabel   = tierMeta?.label ?? "Plant Lover";
  const points      = loyalty?.points_balance ?? 0;
  const pointsHistory = (loyalty?.recent_transactions ?? []).map((t) => ({
    date: new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    desc: t.description ?? t.type,
    points: t.points,
    positive: t.points > 0,
  }));

  // ── Sign out handler ────────────────────────────────────────────────────
  const handleSignOut = async () => {
    try { await logoutApi(); } catch (_) {}
    logout();
    router.push("/login");
  };

  // Inject profile CSS tokens
  useEffect(() => {
    const styleId = "profile-tokens";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = TOKENS;
      document.head.appendChild(style);
    }
    return () => { document.getElementById(styleId)?.remove(); };
  }, []);
  const handleNavigate = (section: string) => setActiveSection(section);
  const renderSection = () => {
    switch (activeSection) {
      case "overview": return (
        <OverviewSection
          onNavigate={handleNavigate}
          firstName={firstName}
          points={points}
          plantsCount={plants.length}
          wishlistItems={wishlistItems}
          ordersCount={myOrdersTotal}
          recentOrder={myOrders[0] ?? null}
        />
      );
      case "orders": return <OrdersSection onToast={addToast} />;
      case "wishlist": return (
        <WishlistSection
          onToast={addToast}
          wishlistItems={wishlistItems}
          onRemove={(id: number) => { removeFromWishlist(id); addToast("Removed from wishlist", "success"); }}
        />
      );
      case "plants": return (
        <PlantsSection
          onToast={addToast}
          plants={plants}
          onAddPlant={(p: any) => { addPlant(p); addToast("Plant added!", "success"); }}
          onLogCare={(plantId: number, payload: any) => { addPlantLog({ plantId, payload }); addToast("Care logged!", "success"); }}
        />
      );
      case "personal-info": return (
        <PersonalInfoSection
          onToast={addToast}
          profile={profile}
          isSaving={isUpdatingProfile}
          onSave={(data: any) => {
            updateProfile({
              first_name: data.firstName,
              last_name: data.lastName,
              phone: data.phone || undefined,
            }, {
              onSuccess: () => {
                addToast("Profile updated successfully ✓", "success");
              },
              onError: (err: any) => {
                addToast(err?.response?.data?.detail || "Failed to update profile.", "error");
              }
            });
          }}
        />
      );
      case "addresses": return (
        <AddressesSection
          onToast={addToast}
          addresses={addresses}
          onAdd={(a: any) => { addAddress(a); addToast("Address added!", "success"); }}
          onUpdate={(id: number, a: any) => { updateAddress({ id, payload: a }); addToast("Address updated!", "success"); }}
          onDelete={(id: number) => { deleteAddress(id); addToast("Address removed", "info"); }}
        />
      );
      case "loyalty": return (
        <LoyaltySection
          onToast={addToast}
          loyalty={loyalty}
          tierMeta={tierMeta}
          pointsHistory={pointsHistory}
        />
      );
      case "payments": return <PaymentSection onToast={addToast} />;
      case "reviews": return <ReviewsSection onToast={addToast} />;
      case "notifications": return <NotificationsSection onToast={addToast} />;
      case "security": return <SecuritySection onToast={addToast} />;
      default: return (
        <OverviewSection
          onNavigate={handleNavigate}
          firstName={firstName}
          points={points}
          plantsCount={plants.length}
          wishlistItems={wishlistItems}
          ordersCount={myOrdersTotal}
          recentOrder={myOrders[0] ?? null}
        />
      );
    }
  };
  return (
    <div className="profile-page">
      <h1 className="sr-only">My Account</h1>
      {/* Announcement bar */}
      <div className="announcement-bar">
        🌿 Free delivery on orders above ₹499 · Use code HERO10 for 10% off
      </div>
      {/* Navbar */}
      <nav className="profile-navbar" aria-label="Main navigation">
        <Link href="/" className="profile-navbar-brand">
          <LeafLogo />
          <span>Hero<span>.</span></span>
        </Link>
        <div className="profile-navbar-actions">
          <Link href="/" style={{ fontSize: 13, color: "var(--profile-body)", textDecoration: "none" }}>Shop</Link>
          <Link href="/ai-care" style={{ fontSize: 13, color: "var(--profile-body)", textDecoration: "none" }}>AI Care</Link>
          <Link href="/cart">
            <div style={{ position: "relative", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span style={{ position: "absolute", top: 0, right: 0, width: 16, height: 16, background: "var(--color-surface-raised)", borderRadius: "50%", fontSize: 9, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
            </div>
          </Link>
          <div className="avatar-chip" title={`${firstName} ${lastName}`}>{initials}</div>
        </div>
      </nav>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol style={{ display: "flex", listStyle: "none", gap: 8, alignItems: "center", padding: 0, margin: 0 }}>
            <li><Link href="/" style={{ color: "var(--profile-body)", textDecoration: "none" }}>Home</Link></li>
            <li className="breadcrumb-sep" aria-hidden="true">/</li>
            <li aria-current="page" className="breadcrumb-current">My Account</li>
          </ol>
        </nav>
      </div>
      {/* Main layout */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px 48px", display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Sidebar */}
        <aside className="sidebar-desktop" aria-label="Account sidebar" style={{ width: 260, flexShrink: 0, position: "sticky", top: 64, height: "calc(100vh - 64px)", overflowY: "auto", background: "var(--profile-sidebar-bg)", borderRight: "1px solid var(--profile-divider)", boxShadow: "var(--shadow-sidebar)", marginRight: 0, borderRadius: "0 var(--radius-lg) var(--radius-lg) 0", padding: "16px 12px" }}>
          {/* Profile hero */}
          <div style={{ padding: "4px 4px 16px" }}>
            {/* Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--profile-avatar-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "var(--profile-avatar-text)" }}>
                  {profileLoading ? "…" : initials}
                </div>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--profile-heading)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>
                  {profileLoading ? "Loading…" : `${firstName} ${lastName}`}
                </p>
                <p style={{ fontSize: 12, color: "var(--profile-meta)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>{userEmail}</p>
              </div>
            </div>
            {/* Tier tag */}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(0,181,102,0.10)", color: "var(--color-surface-raised)", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: "var(--radius-full)", marginBottom: 10 }}>
              {tierMeta?.emoji ?? "🌱"} {tierLabel}
            </span>
            {/* Loyalty mini bar */}
            <div title={`${points} Green Points`}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-surface-raised)" }}>{points} Green Points</span>
              </div>
              <div className="loyalty-progress-track" style={{ height: 5 }}>
                <div className="loyalty-progress-fill" style={{ width: `${Math.min((points / 500) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
          <div style={{ height: 1, background: "var(--profile-divider)", margin: "4px 0 8px" }} />
          {/* Nav items */}
          <nav role="navigation" aria-label="Account navigation">
            <ul role="list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {NAV_ITEMS.map(item => (
                <li key={item.id} role="listitem">
                  <button
                    className={`sidebar-nav-item ${activeSection === item.id ? "active" : ""}`}
                    onClick={() => setActiveSection(item.id)}
                    aria-current={activeSection === item.id ? "page" : undefined}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge !== null && (
                      <span className="nav-badge" aria-label={`${item.badge} ${item.label.toLowerCase()}`}>{item.badge}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div style={{ height: 1, background: "var(--profile-divider)", margin: "8px 0" }} />
          {/* Sign out */}
          <button className="sidebar-nav-item" style={{ color: "var(--profile-danger-text)" }} aria-label="Sign out of your account" onClick={() => setShowSignOut(true)}>
            <span className="nav-icon" style={{ color: "var(--profile-danger-text)" }}>↩</span>
            <span>Sign Out</span>
          </button>
        </aside>
        {/* Main content */}
        <main className="profile-main-content" style={{ flex: 1, minWidth: 0, paddingTop: 24 }}>
          {renderSection()}
        </main>
      </div>
      {/* Mobile bottom tab bar */}
      <div className="mobile-tab-bar" role="tablist" aria-label="Account navigation">
        {MOBILE_TABS.map(tab => (
          <button
            key={tab.id}
            className={`mobile-tab-btn ${activeSection === tab.id ? "active" : ""}`}
            role="tab"
            aria-selected={activeSection === tab.id}
            onClick={() => setActiveSection(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      {/* Sign Out Modal */}
      {showSignOut && (
        <Modal title="Sign out?" onClose={() => setShowSignOut(false)} maxWidth={400}
          footer={
            <>
              <button className="btn-profile-outline" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowSignOut(false)}>Cancel</button>
              <button style={{ flex: 1, justifyContent: "center", background: "var(--profile-danger-text)", color: "#fff", border: "none", borderRadius: "var(--radius-full)", height: 44, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "Outfit" }} onClick={() => { setShowSignOut(false); handleSignOut(); }}>Yes, Sign Out</button>
            </>
          }>
          <p style={{ fontSize: 14, color: "var(--profile-body)", lineHeight: 1.6 }}>You&apos;ll need to sign in again to access your orders, wishlist, and plants.</p>
        </Modal>
      )}
      {/* Toast container */}
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-item toast-${toast.type}`}>
            <span>{toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}</span>
            <span>{toast.msg}</span>
            {toast.onUndo && <button className="toast-undo-btn" onClick={toast.onUndo}>Undo</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
