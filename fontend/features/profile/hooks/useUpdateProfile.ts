import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileApi, UpdateProfilePayload } from "../api/profile.api";
import { ME_QUERY_KEY } from "./useMe";

/**
 * useUpdateProfile — patches the authenticated user's profile.
 * PATCH /customers/me
 *
 * Usage:
 *   const { updateProfile, isLoading, isSuccess, error } = useUpdateProfile();
 *   updateProfile({ first_name: "Priya", phone: "9876543210" });
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfileApi(payload),
    onSuccess: () => {
      // Invalidate the profile cache so useMe re-fetches fresh data
      queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
    },
  });

  return {
    updateProfile: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
  };
}
