import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPlantLogApi, AddCareLogPayload, PlantCareLog } from "../api/profile.api";
import { PLANTS_QUERY_KEY } from "./useMyPlants";

interface AddPlantLogArgs {
  plantId: number;
  payload: AddCareLogPayload;
}

/**
 * useAddPlantLog — logs a care action (watering, fertilizing, etc.) for a plant.
 * POST /customers/me/plants/{id}/log
 *
 * After logging "watered", the backend automatically updates last_watered_at
 * and next_water_due on the plant record.
 *
 * Usage:
 *   const { addLog, isLoading, error } = useAddPlantLog();
 *   addLog({ plantId: 5, payload: { type: "watered", note: "Used rainwater" } });
 */
export function useAddPlantLog() {
  const queryClient = useQueryClient();

  const mutation = useMutation<PlantCareLog, Error, AddPlantLogArgs>({
    mutationFn: ({ plantId, payload }) => addPlantLogApi(plantId, payload),
    onSuccess: () => {
      // Refetch plants so watering dates update in UI
      queryClient.invalidateQueries({ queryKey: PLANTS_QUERY_KEY });
    },
  });

  return {
    addLog: (args: AddPlantLogArgs) => mutation.mutate(args),
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    newLog: mutation.data ?? null,
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
    reset: mutation.reset,
  };
}
