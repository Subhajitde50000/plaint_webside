import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordApi } from "../api/auth.api";
import { useToast } from "@/hooks/useToast";

export function useResetPassword() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const { success } = useToast();

  const mutation = useMutation({
    mutationFn: (newPassword: string) => resetPasswordApi(token, newPassword),
    onSuccess: () => {
      success("Password reset successfully!");
      router.push("/auth/login?reset=success");
    },
  });

  return {
    submit: (newPassword: string) => mutation.mutate(newPassword),
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    // 400 = invalid/expired token
    isInvalidToken: (mutation.error as any)?.response?.status === 400,
    error: (mutation.error as any)?.response?.data?.detail as
      | string
      | undefined,
    hasToken: !!token,
  };
}
