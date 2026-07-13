import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { loginApi, getMeApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth.store";

export function useLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params.get("returnTo") ?? "/";
  const { setAccessToken, setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),

    onSuccess: async (data) => {
      // 1. Store access token in memory (globalThis) + Zustand
      setAccessToken(data.access_token);
      // 2. Fetch full user profile with new token
      const user = await getMeApi();
      setUser(user);
      // 3. Redirect to originally intended page
      router.push(returnTo);
    },
  });

  const errorStatus = (mutation.error as any)?.response?.status as
    | number
    | undefined;
  const errorDetail = (mutation.error as any)?.response?.data?.detail as
    | string
    | undefined;

  // Map status codes to user-friendly messages
  const error =
    errorStatus === 401
      ? "Incorrect email or password."
      : errorStatus === 403 && errorDetail?.includes("blocked")
        ? "Your account has been blocked. Contact support."
        : errorStatus === 403
          ? "Please verify your email before signing in."
          : errorDetail ?? undefined;

  return {
    login: (email: string, password: string) =>
      mutation.mutate({ email, password }),
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error,
    errorStatus,
    isBlocked: errorStatus === 403 && !!errorDetail?.includes("blocked"),
    isUnverified: errorStatus === 403 && !errorDetail?.includes("blocked"),
  };
}
