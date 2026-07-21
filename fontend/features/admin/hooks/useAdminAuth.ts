import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuth.store";
import { getAdminMeApi, adminLogoutApi } from "../api/adminAuth.api";

export function useAdminAuth(requireAuth: boolean = false) {
  const router = useRouter();
  const { admin, isAuthenticated, setAdmin, logoutAdmin } = useAdminAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("admin_access_token") : null;
      if (!token) {
        if (isMounted) {
          setIsLoading(false);
          if (requireAuth) {
            router.push("/admin/login");
          }
        }
        return;
      }

      if (!admin) {
        try {
          const profile = await getAdminMeApi();
          if (isMounted) {
            setAdmin(profile);
          }
        } catch (err) {
          if (isMounted) {
            logoutAdmin();
            if (requireAuth) {
              router.push("/admin/login");
            }
          }
        } finally {
          if (isMounted) setIsLoading(false);
        }
      } else {
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [admin, requireAuth, router, setAdmin, logoutAdmin]);

  const logout = async () => {
    try {
      await adminLogoutApi();
    } catch (_) {
      // Ignore API errors on logout
    } finally {
      logoutAdmin();
      router.push("/admin/login");
    }
  };

  return {
    admin,
    isAuthenticated,
    isLoading,
    logout,
    role: admin?.role,
  };
}
