import { useQuery } from "@tanstack/react-query";
import { getHomepageApi } from "../api/homepage.api";
import type { HomepageData } from "../types/homepage.types";

export function useHomepage() {
  const query = useQuery<HomepageData>({
    queryKey: ["homepage"],
    queryFn: getHomepageApi,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
