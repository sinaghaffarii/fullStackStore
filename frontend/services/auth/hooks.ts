import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import type { AdminLoginRequest, AuthError } from '@/types/auth';

import { ROUTE_OBJECT } from '@/utils/constants';

import { authService } from './index';

// کلیدهای Query
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Hook برای دریافت کاربر فعلی
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 دقیقه
    retry: false,
  });
}

// Hook برای لاگین ادمین
export function useAdminLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminLoginRequest) => authService.adminLogin(data),
    onSuccess: (data) => {
      // بروزرسانی کش کاربر
      if (data.user) {
        queryClient.setQueryData(authKeys.user(), data.user);
      }

      toast.success(data.message || 'ورود موفقیت‌آمیز');

      // ریدایرکت به داشبورد
      router.push(ROUTE_OBJECT.DASHBOARD);
      router.refresh();
    },
    onError: (error: AuthError) => {
      toast.error(error.message || 'خطا در ورود');
    },
  });
}

// Hook برای خروج
export function useAdminLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // پاک کردن کش کاربر
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      toast.success('خروج موفقیت‌آمیز');

      // ریدایرکت به صفحه لاگین
      router.push(ROUTE_OBJECT.ADMIN_LOGIN);
      router.refresh();
    },
    onError: () => {
      toast.error('خطا در خروج');
    },
  });
}

// Hook برای بررسی وضعیت احراز هویت
export function useAuth() {
  const { data: user, isLoading, error } = useCurrentUser();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    error,
  };
}
