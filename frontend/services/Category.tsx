import type { AxiosError } from 'axios';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import type { ICategory } from '@/types/category';
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  IListResponse,
} from '@/types/public';

import { apiClient } from '@/lib/apiClient';
import { QUERY_KEY } from '@/utils/constants';

interface GetListProps {
  page: number;
  limit: number;
  parentId?: string;
  includeChildren?: boolean;
  isActive?: boolean;
  search?: string;
}

export type CreateCategoryDto = Omit<
  ICategory,
  'createdAt' | 'id' | 'updatedAt'
>;
export type UpsertCategoryDto = Omit<ICategory, 'createdAt' | 'updatedAt'>;

export const useGetCategoryList = ({
  page,
  limit,
  parentId,
  includeChildren,
  isActive,
  search,
}: GetListProps) => {
  return useQuery<ApiSuccessResponse<IListResponse<ICategory>>>({
    queryKey: [
      QUERY_KEY.CATEGORY,
      { page, limit, parentId, includeChildren, isActive, search },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      params.set('page', String(page));
      params.set('limit', String(limit));

      if (parentId) params.set('parent_id', parentId);
      if (includeChildren !== undefined)
        params.set('include_children', String(includeChildren));
      if (isActive !== undefined) params.set('is_active', String(isActive));
      if (search) params.set('search', search);

      const { data } = await apiClient.get<
        ApiSuccessResponse<IListResponse<ICategory>>
      >(`/categories?${params.toString()}`);

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateCategoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiSuccessResponse<CreateCategoryDto>,
    AxiosError<ApiErrorResponse>,
    CreateCategoryDto
  >({
    mutationKey: [QUERY_KEY.CATEGORY],
    mutationFn: async (requestBody: CreateCategoryDto) => {
      const { data } = await apiClient.post('/categories', requestBody);
      return data;
    },
    onSuccess: () => {
      toast.success('دسته‌بندی با موفقیت ایجاد شد');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY] });
    },
  });
};
export const useUpsertCategoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiSuccessResponse<UpsertCategoryDto>,
    AxiosError<ApiErrorResponse>,
    UpsertCategoryDto
  >({
    mutationKey: [QUERY_KEY.CATEGORY, 'upsert'],
    mutationFn: async (requestBody: UpsertCategoryDto) => {
      const { data } = await apiClient.put(
        `/categories/${requestBody.id}`,
        requestBody,
      );
      return data;
    },
    onSuccess: () => {
      toast.success('برند با موفقیت ویرایش شد');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY] });
    },
  });
};

export const useDeleteCategoryItem = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.CATEGORY, 'delete'],
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete<ApiSuccessResponse<null>>(
        `/categories/${id}`,
      );
      return data;
    },
  });
};
