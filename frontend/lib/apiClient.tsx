import axios from 'axios';

import { ROUTE_OBJECT } from '@/utils/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

    return Promise.reject(error);
  },
);
