import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { adminLoginApi, getAdminMeApi } from "../api/adminAuth.api";
import { useAdminAuthStore } from "@/store/adminAuth.store";

export interface AdminLoginInput {
  email: string;
  password: string;
}

export function useAdminLogin(returnTo: string = "/admin") {
  const router = useRouter();
  const { setAdminToken, setAdmin } = useAdminAuthStore();

  const mutation = useMutation({
    mutationFn: async (data: AdminLoginInput) => {
      // 1. Authenticate with backend /admin/auth/login endpoint
      const res = await adminLoginApi(data);
      
      // 2. Save access token to Zustand & localStorage
      setAdminToken(res.access_token);

      // 3. Fetch authenticated admin profile details
      try {
        const adminProfile = await getAdminMeApi();
        setAdmin(adminProfile);
        return adminProfile;
      } catch (err) {
        // Fallback to response data if /me fails
        const fallbackAdmin = {
          uuid: res.admin_uuid,
          email: data.email.toLowerCase().trim(),
          first_name: res.first_name,
          last_name: res.last_name,
          role: res.role,
          is_active: true,
        };
        setAdmin(fallbackAdmin);
        return fallbackAdmin;
      }
    },
    onSuccess: () => {
      router.push(returnTo);
    },
  });

  const rawError = mutation.error as any;
  const errorMessage =
    rawError?.response?.data?.detail ||
    rawError?.message ||
    (mutation.isError ? "Login failed. Please check your credentials." : undefined);

  return {
    login: (data: AdminLoginInput) => mutation.mutate(data),
    loginAsync: (data: AdminLoginInput) => mutation.mutateAsync(data),
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: errorMessage,
  };
}
