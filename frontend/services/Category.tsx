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
  is_active?: boolean;
  search?: string;
}

export type CreateCategoryDto = Omit<
  ICategory,
  'children' | 'createdAt' | 'id' | 'updatedAt'
>;
export type UpsertCategoryDto = Omit<
  ICategory,
  'children' | 'createdAt' | 'updatedAt'
>;

export const useGetCategoryList = ({
  page,
  limit,
  parentId,
  includeChildren,
  is_active,
  search,
}: GetListProps) => {
  return useQuery<ApiSuccessResponse<IListResponse<ICategory>>>({
    queryKey: [
      QUERY_KEY.CATEGORY,
      { page, limit, parentId, includeChildren, is_active, search },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (parentId) params.set('parent_id', parentId);
      if (includeChildren !== undefined)
        params.set('include_children', String(includeChildren));
      if (is_active !== undefined) params.set('is_active', String(is_active));
      if (search) params.set('search', search);

      const { data } = await apiClient.get<
        ApiSuccessResponse<IListResponse<ICategory>>
      >(`/categories?${params.toString()}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetCategoryHierarchy = () => {
  return useQuery<ApiSuccessResponse<ICategory[]>>({
    queryKey: [QUERY_KEY.CATEGORY, 'hierarchy'],
    queryFn: async () => {
      const { data } = await apiClient.get('/categories/hierarchy');
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateCategoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiSuccessResponse<CreateCategoryDto>,
    AxiosError<ApiErrorResponse>,
    CreateCategoryDto
  >({
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
    mutationFn: async (requestBody: UpsertCategoryDto) => {
      const { data } = await apiClient.put(
        `/categories/${requestBody.id}`,
        requestBody,
      );
      return data;
    },
    onSuccess: () => {
      toast.success('دسته‌بندی با موفقیت ویرایش شد');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY] });
    },
  });
};

export const useDeleteCategoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete<ApiSuccessResponse<null>>(
        `/categories/${id}`,
      );
      return data;
    },
    onSuccess: () => {
      toast.success('دسته‌بندی با موفقیت حذف شد');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY] });
    },
  });
};
