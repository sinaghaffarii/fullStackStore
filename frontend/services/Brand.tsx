import type { AxiosError } from 'axios';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import type { IBrand } from '@/types/brand';
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  IListResponse,
} from '@/types/public';

import { apiClient } from '@/lib/apiClient';
import { QUERY_KEY } from '@/utils/constants';

interface GetBrandListParams {
  page: number;
  limit: number;
  search?: string;
  is_active?: boolean;
}

export type CreateBrandDto = Omit<IBrand, 'createdAt' | 'id' | 'updatedAt'>;
export type UpsertBrandDto = Omit<IBrand, 'createdAt' | 'updatedAt'>;

export const useGetBrandList = ({
  page,
  limit,
  search,
  is_active,
}: GetBrandListParams) => {
  return useQuery<ApiSuccessResponse<IListResponse<IBrand>>>({
    queryKey: [QUERY_KEY.BRAND, { page, limit, search, is_active }],
    queryFn: async () => {
      const params = new URLSearchParams();

      params.set('page', String(page));
      params.set('limit', String(limit));

      if (search) params.set('search', search);
      if (is_active !== undefined) params.set('is_active', String(is_active));

      const { data } = await apiClient.get<
        ApiSuccessResponse<IListResponse<IBrand>>
      >(`/brands?${params.toString()}`);

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateBrandItem = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiSuccessResponse<CreateBrandDto>,
    AxiosError<ApiErrorResponse>,
    CreateBrandDto
  >({
    mutationKey: [QUERY_KEY.BRAND],
    mutationFn: async (requestBody: CreateBrandDto) => {
      const { data } = await apiClient.post('/brands', requestBody);
      return data;
    },
    onSuccess: () => {
      toast.success('برند با موفقیت ایجاد شد');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BRAND] });
    },
  });
};
export const useUpsertBrandItem = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiSuccessResponse<UpsertBrandDto>,
    AxiosError<ApiErrorResponse>,
    UpsertBrandDto
  >({
    mutationKey: [QUERY_KEY.BRAND, 'upsert'],
    mutationFn: async (requestBody: UpsertBrandDto) => {
      const { data } = await apiClient.put(
        `/brands/${requestBody.id}`,
        requestBody,
      );
      return data;
    },
    onSuccess: () => {
      toast.success('برند با موفقیت ویرایش شد');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BRAND] });
    },
  });
};

export const useDeleteBrandItem = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiSuccessResponse<void>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationKey: [QUERY_KEY.BRAND],
    mutationFn: async (brandId: string) => {
      const { data } = await apiClient.delete(`/brands/${brandId}`);
      return data;
    },
    onSuccess: ({ success }) => {
      if (success) {
        toast.success('برند بام موفقیت حذف گردید.');
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.BRAND],
        });
      }
    },
  });
};
