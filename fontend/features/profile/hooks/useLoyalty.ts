import { useQuery } from "@tanstack/react-query";
import { getLoyaltyApi, LoyaltyData } from "../api/profile.api";

export const LOYALTY_QUERY_KEY = ["loyalty"] as const;

// Tier display metadata
export const TIER_META: Record<string, { label: string; color: string; emoji: string }> = {
  plant_lover:  { label: "Plant Lover",  color: "#6b7280", emoji: "🌱" },
  green_thumb:  { label: "Green Thumb",  color: "#16a34a", emoji: "🌿" },
  garden_guru:  { label: "Garden Guru",  color: "#0284c7", emoji: "🌳" },
  eco_champion: { label: "Eco Champion", color: "#7c3aed", emoji: "🏆" },
};

/**
 * useLoyalty — fetches the user's loyalty points, tier, and recent transactions.
 * GET /customers/me/loyalty
 *
 * Usage:
 *   const { loyalty, tierMeta, isLoading } = useLoyalty();
 */
export function useLoyalty() {
  const query = useQuery<LoyaltyData>({
    queryKey: LOYALTY_QUERY_KEY,
    queryFn: getLoyaltyApi,
    staleTime: 1000 * 60 * 5,
  });

  const tier = query.data?.tier ?? "plant_lover";

  return {
    loyalty: query.data ?? null,
    tierMeta: TIER_META[tier] ?? TIER_META["plant_lover"],
    isLoading: query.isLoading,
    error: (query.error as any)?.response?.data?.detail as string | undefined,
    refetch: query.refetch,
  };
}
