"use client";
import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function Redirector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const email = searchParams.get("email") ?? "";
    router.replace(`/verify-otp?email=${encodeURIComponent(email)}`);
  }, [router, searchParams]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif", color: "#6b7280" }}>
      Redirecting to verification...
    </div>
  );
}

export default function VerifyEmailRedirectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Redirector />
    </Suspense>
  );
}
