import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerApi } from "../api/auth.api";

export function useSignUp() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (_, vars) => {
      // On success: redirect to OTP page with email in query
      router.push(`/verify-otp?email=${encodeURIComponent(vars.email)}`);
    },
  });
  return {
    signUp: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
    statusCode: (mutation.error as any)?.response?.status as number | undefined,
  };
}
