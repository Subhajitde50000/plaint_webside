import { useQuery } from "@tanstack/react-query";
import { getMeApi, CustomerProfile } from "../api/profile.api";

export const ME_QUERY_KEY = ["me"] as const;

/**
 * useMe — fetches the authenticated user's profile.
 * GET /customers/me
 *
 * Usage:
 *   const { profile, isLoading, error } = useMe();
 */
export function useMe() {
  const query = useQuery<CustomerProfile>({
    queryKey: ME_QUERY_KEY,
    queryFn: getMeApi,
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: (query.error as any)?.response?.data?.detail as string | undefined,
    refetch: query.refetch,
  };
}
