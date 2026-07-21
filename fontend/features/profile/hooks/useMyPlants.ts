import { useQuery } from "@tanstack/react-query";
import { getMyPlantsApi, UserPlant } from "../api/profile.api";

export const PLANTS_QUERY_KEY = ["my-plants"] as const;

/**
 * useMyPlants — fetches the user's personal plant diary.
 * GET /customers/me/plants
 *
 * Usage:
 *   const { plants, isLoading, error } = useMyPlants();
 */
export function useMyPlants() {
  const query = useQuery<UserPlant[]>({
    queryKey: PLANTS_QUERY_KEY,
    queryFn: getMyPlantsApi,
    staleTime: 1000 * 60 * 2,
  });

  return {
    plants: query.data ?? [],
    isLoading: query.isLoading,
    error: (query.error as any)?.response?.data?.detail as string | undefined,
    refetch: query.refetch,
  };
}
