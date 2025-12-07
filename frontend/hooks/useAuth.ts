import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import type { User } from '../types/public';
import type { LoginInput, OTPInput, RegisterInput } from '../validations';

import { apiClient } from '../lib/apiClient';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => apiClient.post('/auth/login', data),
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => apiClient.post('/auth/register', data),
  });

  const verifyOTPMutation = useMutation({
    mutationFn: (data: OTPInput & { mobile: string }) =>
      apiClient.post('/auth/verifyOTP', data),
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    onSuccess: ({ status }) => {
      if (status) {
        queryClient.clear();
        redirect('/');
      }
    },
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      try {
        const response = await apiClient.get('/auth/me');
        return response.data;
      } catch (error) {
        return null;
      }
    },
  });

  return {
    user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    verifyOTP: verifyOTPMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isVerifyingOTP: verifyOTPMutation.isPending,
  };
};
