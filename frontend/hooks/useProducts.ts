import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useDebounce } from 'react-use';

import type { CreateProductDto } from '../types/product';

import { apiClient } from '../lib/apiClient';

export function useProducts(
  filters: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  } = {},
) {
  const debouncedSearch = useDebounce(() => filters.search, 300);

  return useQuery({
    queryKey: ['products', { ...filters, search: debouncedSearch }],
    queryFn: async () => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/products?${params}`);
      return response.data as CreateProductDto[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useInfiniteProducts(filters = {}) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: '20',
        ...filters,
      });

      const response = await apiClient.get(`/products?${params}`);
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNextPage ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
