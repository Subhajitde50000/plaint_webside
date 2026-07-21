/**
 * /login page
 *
 * Reads ?email=&verified=true&returnTo= from the URL and passes them
 * as props to <LoginForm>.  useSearchParams() lives here inside the
 * Suspense boundary so Next.js can pre-render the shell without bailing out.
 */
"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/features/auth/components/LoginForm";

function LoginPageInner() {
  const params = useSearchParams();

  const initialEmail = params.get("email") ?? "";
  const isVerified   = params.get("verified") === "true";
  const returnTo     = params.get("returnTo") ?? "/";

  return (
    <LoginForm
      initialEmail={initialEmail}
      isVerified={isVerified}
      returnTo={returnTo}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
