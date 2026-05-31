import type { AxiosError } from 'axios';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import type {
  CreateProductDto,
  EnrichedProduct,
  PriceRange,
  SortOption,
} from '@/types/product';
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  IListResponse,
} from '@/types/public';

import { apiClient } from '@/lib/apiClient';
import { QUERY_KEY } from '@/utils/constants';

interface ProductFilters {
  category_id?: string;
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  price_range?: PriceRange;
  in_stock?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  search?: string;
  tags?: string[];
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export const useGetProductList = (filters: ProductFilters) => {
  return useQuery<ApiSuccessResponse<IListResponse<EnrichedProduct>>>({
    queryKey: [QUERY_KEY.PRODUCT, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, String(value));
        }
      });
      const { data } = await apiClient.get<
        ApiSuccessResponse<IListResponse<EnrichedProduct>>
      >(`/products?${params.toString()}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetProductById = (id: string) => {
  return useQuery<ApiSuccessResponse<EnrichedProduct>>({
    queryKey: [QUERY_KEY.PRODUCT, id],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccessResponse<EnrichedProduct>>(
        `/products/${id}`,
      );
      return data;
    },
    enabled: !!id,
  });
};

export const useGetProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT, slug],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccessResponse<EnrichedProduct>>(
        `/products/slug/${slug}`,
      );
      return data;
    },
    enabled: !!slug,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiSuccessResponse<CreateProductDto>,
    AxiosError<ApiErrorResponse>,
    CreateProductDto
  >({
    mutationFn: async (requestBody) => {
      const { data } = await apiClient.post('/products', requestBody);
      return data;
    },
    onSuccess: () => {
      toast.success('محصول با موفقیت ایجاد شد');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در ایجاد محصول');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiSuccessResponse<CreateProductDto>,
    AxiosError<ApiErrorResponse>,
    { id: string; dto: Partial<CreateProductDto> }
  >({
    mutationFn: async ({ id, dto }) => {
      const { data } = await apiClient.put(`/products/${id}`, dto);
      return data;
    },
    onSuccess: () => {
      toast.success('محصول با موفقیت ویرایش شد');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در ویرایش محصول');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiSuccessResponse<null>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: async (id) => {
      const { data } = await apiClient.delete(`/products/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success('محصول با موفقیت حذف شد');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در حذف محصول');
    },
  });
};
