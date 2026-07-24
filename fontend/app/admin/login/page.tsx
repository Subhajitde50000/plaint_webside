"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminLoginForm } from "@/features/admin/components/AdminLoginForm";

function AdminLoginPageInner() {
  const params = useSearchParams();
  const returnTo = params.get("returnTo") ?? "/admin";

  return <AdminLoginForm returnTo={returnTo} />;
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#022c22",
        color: "#ffffff"
      }}>
        Loading Admin Portal...
      </div>
    }>
      <AdminLoginPageInner />
    </Suspense>
  );
}
