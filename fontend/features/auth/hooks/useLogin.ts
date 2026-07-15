import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginApi, getMeApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { LoginInput } from "../schemas/auth.schema";

export function useLogin(returnTo: string = "/") {
  const router = useRouter();
  const { setAccessToken, setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      // 1. POST form-encoded to FastAPI OAuth2 endpoint
      const { access_token } = await loginApi(data.email, data.password);
      // 2. Store token in Zustand (also writes to globalThis for Axios interceptor)
      setAccessToken(access_token);
      // 3. Fetch the authenticated user's profile
      const user = await getMeApi();
      // 4. Save profile to Zustand
      setUser(user);
      return user;
    },
    onSuccess: () => {
      router.push(returnTo);
    },
  });

  return {
    login: (data: LoginInput) => mutation.mutate(data),
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    // Expose raw detail string; "email_not_verified" is handled in LoginForm
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
  };
}
