import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createBookingApi, getServiceTypesApi } from "../api/garden.api";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errors";

export function useServiceTypes() {
  return useQuery({
    queryKey: ["garden-service-types"],
    queryFn: getServiceTypesApi,
    staleTime: 10 * 60 * 1000, // 10 min — types don't change often
  });
}

export function useGardenBooking() {
  const router = useRouter();
  const { error: showError } = useToast();

  const mutation = useMutation({
    mutationFn: createBookingApi,
    onSuccess: (data) => {
      router.push(`/garden-services/bookings/${data.uuid}`);
    },
    onError: (err) => showError(getErrorMessage(err)),
  });

  return {
    createBooking: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: (mutation.error as any)?.response?.data?.detail as
      | string
      | undefined,
  };
}
