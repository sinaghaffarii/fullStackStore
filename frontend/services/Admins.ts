import type { AxiosError } from 'axios';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import type { CreateAdminDto, IAdmin, UpdateAdminDto } from '@/types/admin';
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  IListResponse,
} from '@/types/public';

import { apiClient } from '@/lib/apiClient';
import { QUERY_KEY } from '@/utils/constants';

interface GetAdminListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export const useGetAdminList = ({
  page = 1,
  limit = 50,
  search,
  isActive,
}: GetAdminListParams = {}) => {
  return useQuery<ApiSuccessResponse<IListResponse<IAdmin>>>({
    queryKey: [QUERY_KEY.ADMIN, { page, limit, search, isActive }],
    queryFn: async () => {
      const params = new URLSearchParams();

      params.set('page', String(page));
      params.set('limit', String(limit));

      if (search) params.set('search', search);
      if (isActive !== undefined) params.set('isActive', String(isActive));

      const { data } = await apiClient.get<
        ApiSuccessResponse<IListResponse<IAdmin>>
      >(`/auth/admin/list?${params.toString()}`);

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiSuccessResponse<IAdmin>,
    AxiosError<ApiErrorResponse>,
    CreateAdminDto
  >({
    mutationKey: [QUERY_KEY.ADMIN, 'create'],
    mutationFn: async (requestBody: CreateAdminDto) => {
      const { data } = await apiClient.post('/auth/admin/create', requestBody);
      return data;
    },
    onSuccess: () => {
      toast.success('ادمین با موفقیت ایجاد شد');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ADMIN] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'خطا در ایجاد ادمین';
      toast.error(message);
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiSuccessResponse<IAdmin>,
    AxiosError<ApiErrorResponse>,
    UpdateAdminDto
  >({
    mutationKey: [QUERY_KEY.ADMIN, 'update'],
    mutationFn: async (requestBody: UpdateAdminDto) => {
      const { data } = await apiClient.put(
        `/auth/admin/${requestBody.id}`,
        requestBody,
      );
      return data;
    },
    onSuccess: () => {
      toast.success('ادمین با موفقیت ویرایش شد');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ADMIN] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'خطا در ویرایش ادمین';
      toast.error(message);
    },
  });
};

export const useToggleAdminStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiSuccessResponse<IAdmin>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationKey: [QUERY_KEY.ADMIN, 'toggle'],
    mutationFn: async (adminId: string) => {
      const { data } = await apiClient.patch(
        `/auth/admin/${adminId}/toggle-status`,
      );
      return data;
    },
    onSuccess: ({ data }) => {
      const status = data.isActive ? 'فعال' : 'غیرفعال';
      toast.success(`ادمین با موفقیت ${status} شد`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ADMIN] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'خطا در تغییر وضعیت';
      toast.error(message);
    },
  });
};
