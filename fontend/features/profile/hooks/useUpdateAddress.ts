import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAddressApi, CreateAddressPayload, Address } from "../api/profile.api";
import { ADDRESSES_QUERY_KEY } from "./useAddresses";

interface UpdateAddressArgs {
  id: number;
  payload: Partial<CreateAddressPayload>;
}

/**
 * useUpdateAddress — updates an existing address.
 * PATCH /customers/me/addresses/{id}
 *
 * Usage:
 *   const { updateAddress, isLoading, error } = useUpdateAddress();
 *   updateAddress({ id: 3, payload: { city: "Mumbai", is_default: true } });
 */
export function useUpdateAddress() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Address, Error, UpdateAddressArgs>({
    mutationFn: ({ id, payload }) => updateAddressApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });

  return {
    updateAddress: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
  };
}
