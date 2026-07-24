import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getAdminProductsApi,
  getAdminProductApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  uploadProductImageApi,
  deleteProductImageApi,
  AdminProductFilters,
} from "../api/admin-products.api";

export function useAdminProducts(filters: AdminProductFilters = {}) {
  return useQuery({
    queryKey: ["admin-products", filters],
    queryFn: () => getAdminProductsApi(filters),
    staleTime: 30 * 1000,
  });
}

export function useAdminProduct(productId?: string | number) {
  return useQuery({
    queryKey: ["admin-product", productId],
    queryFn: () => getAdminProductApi(productId!),
    enabled: Boolean(productId),
    staleTime: 30 * 1000,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => createProductApi(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}

export function useUpdateProduct(productId: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => updateProductApi(productId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-product", productId] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}

export function useDeleteProduct() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string | number) => deleteProductApi(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      router.push("/admin/products");
    },
  });
}

export function useUploadProductImage(productId: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, isPrimary }: { file: File; isPrimary?: boolean }) =>
      uploadProductImageApi(productId, file, isPrimary),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-product", productId] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}

export function useDeleteProductImage(productId: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string | number) =>
      deleteProductImageApi(productId, imageId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-product", productId] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}
