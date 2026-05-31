import { isAction } from '@reduxjs/toolkit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import type { IDiscountType } from '@/types/discount';
import type { ApiSuccessResponse, IListResponse } from '@/types/public';

import { apiClient } from '@/lib/apiClient';

const DISCOUNT_QUERY_LIST = 'DISCOUNT_QUERY_LIST';

interface GetListQuery {
  isActive?: string;
  validOnly?: string;
  page: number;
  limit: number;
}
export const useGetDiscountList = ({
  page,
  limit,
  isActive,
  validOnly,
}: GetListQuery) => {
  return useQuery({
    queryKey: [DISCOUNT_QUERY_LIST, page, limit, isActive, validOnly],
    queryFn: async () => {
      const params = new URLSearchParams();

      params.set('page', String(page));
      params.set('limit', String(limit));

      if (isActive !== undefined) params.set('is_active', isActive);
      if (validOnly !== undefined) params.set('validOnly', validOnly);

      const { data } = await apiClient.get<
        ApiSuccessResponse<IListResponse<IDiscountType>>
      >(`/discounts?${params.toString()}`);
      return data.data;
    },
  });
};

export const useGetDiscountActiveList = () => {
  return useQuery({
    queryKey: [DISCOUNT_QUERY_LIST],
    queryFn: async () => {
      const { data } =
        await apiClient.get<ApiSuccessResponse<IListResponse<IDiscountType>>>(
          '/discounts/banners',
        );
      return data.data;
    },
  });
};

export const useCreateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [DISCOUNT_QUERY_LIST],
    mutationFn: async (requestBody: IDiscountType) => {
      const { data } = await apiClient.post<ApiSuccessResponse<IDiscountType>>(
        '/discounts',
        requestBody,
      );
      return data;
    },
    onSuccess: ({ status }) => {
      if (status) {
        queryClient.invalidateQueries({ queryKey: [DISCOUNT_QUERY_LIST] });
        toast.success('کد تخفیف با موفقیت ایجاد شد.');
      }
    },
  });
};

export const useGetDiscountById = (discountId?: string) => {
  return useQuery({
    queryKey: [DISCOUNT_QUERY_LIST, discountId],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccessResponse<IDiscountType>>(
        `/discounts/${discountId}`,
      );
      return data;
    },
  });
};

export const useEditDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [DISCOUNT_QUERY_LIST],
    mutationFn: async (requestBody: IDiscountType) => {
      const { data } = await apiClient.put<ApiSuccessResponse<IDiscountType>>(
        `/discounts/${requestBody.id}`,
        requestBody,
      );
      return data;
    },
    onSuccess: (response) => {
      if (response.status) {
        queryClient.invalidateQueries({ queryKey: [DISCOUNT_QUERY_LIST] });
        toast.success('ویرایش کد تخفیف با موفقیت انجام شد.');
      }
    },
  });
};

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [DISCOUNT_QUERY_LIST],
    mutationFn: async (discountId: string) => {
      const { data } = await apiClient.delete<{ status: boolean }>(
        `/discounts/${discountId}`,
      );
      return data;
    },
    onSuccess: (response) => {
      if (response.status) {
        queryClient.invalidateQueries({ queryKey: [DISCOUNT_QUERY_LIST] });
        toast.success('حذف کد تخفیف با موفقیت انجام شد.');
      }
    },
  });
};

export const useToggleActiveDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [DISCOUNT_QUERY_LIST],
    mutationFn: async (discountId: string) => {
      const { data } = await apiClient.patch<ApiSuccessResponse<IDiscountType>>(
        `/discounts/${discountId}/toggle`,
      );
      return data;
    },
    onSuccess: (response) => {
      if (response.status) {
        queryClient.invalidateQueries({ queryKey: [DISCOUNT_QUERY_LIST] });
        toast.success('تغییر وضعیت با موفقیت انجام شد.');
      }
    },
  });
};
