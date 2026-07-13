import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "../api/auth.api";

export function useForgotPassword() {
  const mutation = useMutation({
    mutationFn: forgotPasswordApi,
  });

  return {
    sendResetLink: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
  };
}
