import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPlantApi, CreatePlantPayload, UserPlant } from "../api/profile.api";
import { PLANTS_QUERY_KEY } from "./useMyPlants";

/**
 * useAddPlant — adds a new plant to the user's diary.
 * POST /customers/me/plants
 *
 * Usage:
 *   const { addPlant, isLoading, newPlant, error } = useAddPlant();
 *   addPlant({ nickname: "Monstera", watering_interval_days: 7 });
 */
export function useAddPlant() {
  const queryClient = useQueryClient();

  const mutation = useMutation<UserPlant, Error, CreatePlantPayload>({
    mutationFn: addPlantApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLANTS_QUERY_KEY });
    },
  });

  return {
    addPlant: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    newPlant: mutation.data ?? null,
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
    reset: mutation.reset,
  };
}
