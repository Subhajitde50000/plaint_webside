import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAddressApi } from "../api/profile.api";
import { ADDRESSES_QUERY_KEY } from "./useAddresses";

/**
 * useDeleteAddress — soft-deletes an address (sets is_active = false).
 * DELETE /customers/me/addresses/{id}
 *
 * Usage:
 *   const { deleteAddress, isLoading, deletingId } = useDeleteAddress();
 *   deleteAddress(3); // pass address id
 */
export function useDeleteAddress() {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, number>({
    mutationFn: deleteAddressApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });

  return {
    deleteAddress: (id: number) => mutation.mutate(id),
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    deletingId: mutation.isPending ? mutation.variables : null,
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
  };
}
