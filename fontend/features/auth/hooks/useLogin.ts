import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { loginApi, getMeApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth.store";

export function useLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params.get("returnTo") ?? "/"; // redirect back after login
  const { setAccessToken, setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // 1. Call login api
      const { access_token } = await loginApi(data);
      // 2. Write token to Zustand (adds to globalThis for interceptors)
      setAccessToken(access_token);
      // 3. Fetch current user profile
      const user = await getMeApi();
      // 4. Save user to Zustand
      setUser(user);
      return user;
    },
    onSuccess: () => {
      router.push(returnTo);
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
  };
}
