import { useQuery } from "@tanstack/react-query";
import { getAddressesApi, Address } from "../api/profile.api";

export const ADDRESSES_QUERY_KEY = ["addresses"] as const;

/**
 * useAddresses — fetches the authenticated user's saved addresses.
 * GET /customers/me/addresses
 *
 * Usage:
 *   const { addresses, isLoading, error } = useAddresses();
 */
export function useAddresses() {
  const query = useQuery<Address[]>({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: getAddressesApi,
    staleTime: 1000 * 60 * 2,
  });

  return {
    addresses: query.data ?? [],
    isLoading: query.isLoading,
    error: (query.error as any)?.response?.data?.detail as string | undefined,
    refetch: query.refetch,
  };
}
