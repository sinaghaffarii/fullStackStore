import type { Response } from 'express';

export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
}

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  options: {
    message: string;
    data?: T;
  },
): void {
  const response: ApiResponse<T> = {
    status: statusCode >= 200 && statusCode < 300,
    message: options.message,
    data: options.data,
  };

  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  options: {
    statusCode: number;
    message: string;
    errorCode?: string;
    details?: any;
  },
): void {
  const response: ApiResponse = {
    status: false,
    message: options.message,
    error: {
      code: options.errorCode || `ERR_${options.statusCode}`,
      details: options.details,
    },
  };

  res.status(options.statusCode).json(response);
}
