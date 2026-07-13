import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "../api/auth.api";

export function useForgotPassword() {
  const mutation = useMutation({
    mutationFn: forgotPasswordApi,
    // Intentionally swallow errors — we always show "check your email"
    // to prevent email enumeration attacks
    onError: () => {},
  });

  return {
    submit: (email: string) => mutation.mutate(email),
    isLoading: mutation.isPending,
    // Always show success message after submission — even on error
    // This is intentional security behaviour (anti-enumeration)
    showSuccess: mutation.isSuccess || mutation.isError,
  };
}
