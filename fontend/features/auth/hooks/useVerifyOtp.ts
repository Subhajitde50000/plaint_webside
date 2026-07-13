import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtpApi, resendOtpApi } from "../api/auth.api";

export function useVerifyOtp() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";

  // OTP expiry timer (10 min = 600s)
  const [timeLeft, setTimeLeft] = useState(600);
  // Resend cooldown (60s)
  const [resendIn, setResendIn] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (resendCount >= 3) {
      setCanResend(false);
      return;
    }
    if (resendIn <= 0) {
      setCanResend(true);
      return;
    }
    const t = setInterval(() => setResendIn((n) => n - 1), 1000);
    return () => clearInterval(t);
  }, [resendIn, resendCount]);

  const verify = useMutation({
    mutationFn: (otp: string) => verifyOtpApi(email, otp),
  });

  const resend = useMutation({
    mutationFn: () => {
      if (resendCount >= 3) {
        return Promise.reject(new Error("Too many attempts. Try again in 10 minutes."));
      }
      return resendOtpApi(email);
    },
    onSuccess: () => {
      setResendCount((c) => c + 1);
      setTimeLeft(600); // reset OTP timer
      setResendIn(60); // reset cooldown
      setCanResend(false);
    },
  });

  return {
    email,
    verify: (otp: string) => verify.mutate(otp),
    resend: () => resend.mutate(),
    isVerifying: verify.isPending,
    isResending: resend.isPending,
    isSuccess: verify.isSuccess,
    isExpired: timeLeft === 0,
    verifyError: (verify.error as any)?.response?.data?.detail as string | undefined,
    verifyErrorCode: (verify.error as any)?.response?.status as number | undefined,
    resendSuccess: resend.isSuccess,
    resendError: (resend.error as any)?.response?.data?.detail || resend.error?.message,
    resendCount,
    timeLeft,
    formattedTime: `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`,
    canResend,
    resendIn,
  };
}
