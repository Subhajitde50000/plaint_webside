import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyPlantsApi, addPlantApi, addPlantLogApi } from "../api/customer.api";
import { useToast } from "@/hooks/useToast";

const PLANTS_KEY = ["my-plants"];

export function useMyPlants() {
  const qc = useQueryClient();
  const { success } = useToast();

  const plants = useQuery({
    queryKey: PLANTS_KEY,
    queryFn: getMyPlantsApi,
    staleTime: 5 * 60 * 1000,
  });

  const addPlant = useMutation({
    mutationFn: addPlantApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLANTS_KEY });
      success("Plant added to your diary! 🌱");
    },
  });

  const addLog = useMutation({
    mutationFn: ({ plantId, ...data }: { plantId: string; type: string; note?: string }) =>
      addPlantLogApi(plantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLANTS_KEY });
      success("Care log added!");
    },
  });

  return {
    plants: plants.data?.plants ?? [],
    isLoading: plants.isLoading,
    addPlant: addPlant.mutate,
    addLog: addLog.mutate,
    isAddingPlant: addPlant.isPending,
    isAddingLog: addLog.isPending,
  };
}
