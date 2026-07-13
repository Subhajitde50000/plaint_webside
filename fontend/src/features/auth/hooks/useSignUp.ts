import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerApi } from "../api/auth.api";

export function useSignUp() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (_, vars) => {
      // Redirect to OTP page with email in query param
      router.push(`/auth/verify-otp?email=${encodeURIComponent(vars.email)}`);
    },
  });

  const errorStatus = (mutation.error as any)?.response?.status as
    | number
    | undefined;
  const errorDetail = (mutation.error as any)?.response?.data?.detail as
    | string
    | undefined;

  return {
    signUp: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: errorDetail,
    statusCode: errorStatus,
    isEmailTaken: errorStatus === 409,
  };
}
