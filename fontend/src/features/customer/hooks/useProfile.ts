import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfileApi, updateProfileApi } from "../api/customer.api";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/hooks/useToast";

const ME_KEY = ["me"];

export function useProfile() {
  const { setUser } = useAuthStore();
  const { success } = useToast();
  const qc = useQueryClient();

  const profile = useQuery({
    queryKey: ME_KEY,
    queryFn: getProfileApi,
    staleTime: 5 * 60 * 1000,
  });

  const update = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ME_KEY });
      setUser(data); // keep Zustand store in sync
      success("Profile updated!");
    },
  });

  return {
    profile: profile.data,
    isLoading: profile.isLoading,
    updateProfile: update.mutate,
    isUpdating: update.isPending,
    updateError: (update.error as any)?.response?.data?.detail as
      | string
      | undefined,
  };
}
