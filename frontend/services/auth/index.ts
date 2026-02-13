import type { AxiosError } from 'axios';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import type { AdminLoginRequest, AdminLoginResponse } from '@/types/auth';
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  User,
} from '@/types/public';

import { apiClient } from '@/lib/apiClient';
import { QUERY_KEY, ROUTE_OBJECT } from '@/utils/constants';

/* -------------------------------------------------------------------------- */
/*                                   Queries                                  */
/* -------------------------------------------------------------------------- */

export const useCurrentUser = () => {
  return useQuery<ApiSuccessResponse<User | null>>({
    queryKey: [QUERY_KEY.AUTH, 'me'],
    queryFn: async () => {
      const { data } =
        await apiClient.get<ApiSuccessResponse<User | null>>('/auth/me');
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  Mutations                                 */
/* -------------------------------------------------------------------------- */

export const useAdminLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<
    ApiSuccessResponse<AdminLoginResponse>,
    AxiosError<ApiErrorResponse>,
    AdminLoginRequest
  >({
    mutationKey: [QUERY_KEY.AUTH, 'login'],
    mutationFn: async (requestBody) => {
      const { data } = await apiClient.post<
        ApiSuccessResponse<AdminLoginResponse>
      >('/auth/admin/login', requestBody);

      return data;
    },
    onSuccess: ({ data }) => {
      if (data?.user) {
        queryClient.setQueryData([QUERY_KEY.AUTH, 'me'], {
          success: true,
          data: data.user,
        });
      }

      toast.success(data.message || 'ورود موفقیت‌آمیز');

      router.push(ROUTE_OBJECT.DASHBOARD);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در ورود');
    },
  });
};

export const useAdminLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ApiSuccessResponse<void>, AxiosError<ApiErrorResponse>>({
    mutationKey: [QUERY_KEY.AUTH, 'logout'],
    mutationFn: async () => {
      const { data } =
        await apiClient.post<ApiSuccessResponse<void>>('/auth/logout');
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData([QUERY_KEY.AUTH, 'me'], {
        success: true,
        data: null,
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.AUTH],
      });

      toast.success('خروج موفقیت‌آمیز');

      router.push(ROUTE_OBJECT.ADMIN_LOGIN);
      router.refresh();
    },
    onError: () => {
      toast.error('خطا در خروج');
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                               Derived Helper                               */
/* -------------------------------------------------------------------------- */

export const useAuth = () => {
  const { data, isLoading, error } = useCurrentUser();

  const user = data?.data ?? null;

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    error,
  };
};
