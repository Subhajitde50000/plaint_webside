import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../api/search.api";
import { useDebounce } from "@/hooks/useDebounce";

export function useSearch(query: string, page = 1) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ["search", debouncedQuery, page],
    queryFn: () => searchApi(debouncedQuery, page),
    enabled: debouncedQuery.length >= 2, // only search if 2+ chars
    staleTime: 30 * 1000,
  });
}
