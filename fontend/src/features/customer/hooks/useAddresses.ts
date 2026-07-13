import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAddressesApi,
  addAddressApi,
  updateAddressApi,
  deleteAddressApi,
} from "../api/customer.api";
import { useToast } from "@/hooks/useToast";

const ADDRESSES_KEY = ["addresses"];

export function useAddresses() {
  const qc = useQueryClient();
  const { success } = useToast();

  const addresses = useQuery({
    queryKey: ADDRESSES_KEY,
    queryFn: getAddressesApi,
    staleTime: 5 * 60 * 1000,
  });

  const addAddress = useMutation({
    mutationFn: addAddressApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADDRESSES_KEY });
      success("Address added!");
    },
  });

  const updateAddress = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof updateAddressApi>[1]) =>
      updateAddressApi(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADDRESSES_KEY });
      success("Address updated!");
    },
  });

  const deleteAddress = useMutation({
    mutationFn: deleteAddressApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADDRESSES_KEY });
      success("Address removed.");
    },
  });

  return {
    addresses: addresses.data ?? [],
    isLoading: addresses.isLoading,
    addAddress: addAddress.mutate,
    updateAddress: updateAddress.mutate,
    deleteAddress: deleteAddress.mutate,
    isAdding: addAddress.isPending,
    isUpdating: updateAddress.isPending,
    isDeleting: deleteAddress.isPending,
  };
}
