import axios from 'axios';
import { toast } from 'react-toastify';

import { ROUTE_OBJECT } from '@/utils/constants';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8585';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/* -------------------------------------------------------------------------- */
/*                           Request Interceptor                              */
/* -------------------------------------------------------------------------- */

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/* -------------------------------------------------------------------------- */
/*                          Response Interceptor                              */
/* -------------------------------------------------------------------------- */

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          },
        );

        return apiClient(originalRequest);
      } catch (refreshError) {
        window.location.href = ROUTE_OBJECT.HOME;
        return Promise.reject(refreshError);
      }
    }

    // Handling 409: Conflict (example: item already exists)
    if (error.response?.status === 409) {
      const errorMessage =
        error.response.data.message || 'این مورد از قبل وجود دارد.';
      toast.error(errorMessage);
      return Promise.reject(error);
    }

    if (error.response?.status === 400) {
      const errorMessage =
        error.response.data.message || 'درخواست نامعتبر است.';
      toast.error(errorMessage);
      return Promise.reject(error);
    }

    if (error.response?.status >= 500) {
      const errorMessage =
        error.response.data.message ||
        'خطای سرور رخ داده است. لطفاً بعداً دوباره امتحان کنید.';
      toast.error(errorMessage);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);
