import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAddressApi, CreateAddressPayload, Address } from "../api/profile.api";
import { ADDRESSES_QUERY_KEY } from "./useAddresses";

/**
 * useAddAddress — creates a new address for the authenticated user.
 * POST /customers/me/addresses
 *
 * Usage:
 *   const { addAddress, isLoading, isSuccess, error } = useAddAddress();
 *   addAddress({ first_name: "Priya", line1: "12 MG Road", city: "Bengaluru", ... });
 */
export function useAddAddress() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Address, Error, CreateAddressPayload>({
    mutationFn: addAddressApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });

  return {
    addAddress: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    newAddress: mutation.data ?? null,
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
    reset: mutation.reset,
  };
}
