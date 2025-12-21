import type { AxiosError } from 'axios';

import { useMutation } from '@tanstack/react-query';

import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/public';

import { apiClient } from '@/lib/apiClient';

interface UploadImageResponse {
  url: string;
}

export const useUploadImage = () => {
  return useMutation<
    ApiSuccessResponse<UploadImageResponse>,
    AxiosError<ApiErrorResponse>,
    File
  >({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
  });
};
