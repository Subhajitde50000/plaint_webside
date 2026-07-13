import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtpApi, resendOtpApi } from "../api/auth.api";
import { useToast } from "@/hooks/useToast";

export function useVerifyOtp() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const { success } = useToast();

  // OTP expiry countdown (10 minutes = 600s)
  const [timeLeft, setTimeLeft] = useState(600);
  // Resend cooldown (60s before user can request another OTP)
  const [resendIn, setResendIn] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Main countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendIn <= 0) {
      setCanResend(true);
      return;
    }
    const t = setInterval(() => setResendIn((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const verify = useMutation({
    mutationFn: (otp: string) => verifyOtpApi(email, otp),
    onSuccess: () => {
      success("Email verified! Welcome aboard 🌿");
      router.push("/");
    },
  });

  const resend = useMutation({
    mutationFn: () => resendOtpApi(email),
    onSuccess: () => {
      success("New code sent to your email!");
      setTimeLeft(600); // reset expiry timer
      setResendIn(60); // reset cooldown
      setCanResend(false);
    },
  });

  const formattedTime = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`;

  return {
    email,
    verify: (otp: string) => verify.mutate(otp),
    resend: () => resend.mutate(),
    isVerifying: verify.isPending,
    isResending: resend.isPending,
    isSuccess: verify.isSuccess,
    isExpired: timeLeft === 0,
    verifyError: (verify.error as any)?.response?.data?.detail as
      | string
      | undefined,
    verifyErrorCode: (verify.error as any)?.response?.status as
      | number
      | undefined,
    resendSuccess: resend.isSuccess,
    timeLeft,
    formattedTime,
    canResend,
    resendIn,
  };
}
