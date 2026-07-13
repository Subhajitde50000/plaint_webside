import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "../api/auth.api";

export function useResetPassword() {
  const mutation = useMutation({
    mutationFn: resetPasswordApi,
  });

  return {
    resetPassword: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
  };
}
