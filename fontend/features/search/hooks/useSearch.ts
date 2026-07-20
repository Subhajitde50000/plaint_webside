import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchProductsApi } from "../api/search.api";
import type { SearchQueryParams, SearchResponse } from "../types/search.types";

export function useSearch(initialParams: SearchQueryParams = {}) {
  const [searchTerm, setSearchTerm] = useState(initialParams.q || "");
  const [debouncedQuery, setDebouncedQuery] = useState(initialParams.q || "");
  const [category, setCategory] = useState<string | undefined>(initialParams.category);
  const [minPrice, setMinPrice] = useState<number | undefined>(initialParams.min_price);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialParams.max_price);
  const [inStock, setInStock] = useState<boolean | undefined>(initialParams.in_stock);
  const [minRating, setMinRating] = useState<number | undefined>(initialParams.min_rating);
  const [sortBy, setSortBy] = useState<SearchQueryParams["sort_by"]>(initialParams.sort_by || "relevance");
  const [page, setPage] = useState(initialParams.page || 1);

  // Debounce search term by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm);
      setPage(1); // Reset page on query change
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const queryParams: SearchQueryParams = {
    q: debouncedQuery,
    category,
    min_price: minPrice,
    max_price: maxPrice,
    in_stock: inStock,
    min_rating: minRating,
    sort_by: sortBy,
    page,
    page_size: initialParams.page_size || 24,
  };

  const queryKey = ["search", queryParams];

  const query = useQuery<SearchResponse>({
    queryKey,
    queryFn: () => searchProductsApi(queryParams),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });

  const resetFilters = () => {
    setCategory(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setInStock(undefined);
    setMinRating(undefined);
    setSortBy("relevance");
    setPage(1);
  };

  return {
    searchTerm,
    setSearchTerm,
    debouncedQuery,
    category,
    setCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    inStock,
    setInStock,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    page,
    setPage,
    resetFilters,
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  };
}
