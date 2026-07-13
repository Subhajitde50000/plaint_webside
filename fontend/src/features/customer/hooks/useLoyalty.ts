import { useQuery } from "@tanstack/react-query";
import { getLoyaltyApi } from "../api/customer.api";

export function useLoyalty() {
  return useQuery({
    queryKey: ["loyalty"],
    queryFn: getLoyaltyApi,
    staleTime: 5 * 60 * 1000,
  });
}
