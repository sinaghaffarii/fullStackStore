import type { Response } from 'express';

import { StatusCodes } from 'http-status-codes';

export interface ApiResponse<T = any> {
  success: boolean;
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
    success: statusCode >= 200 && statusCode < 300,
    message: options.message,
    data: options.data,
  };

  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errorCode?: string,
  details?: any,
): void {
  const response: ApiResponse = {
    success: false,
    message,
    error: {
      code: errorCode || `ERR_${statusCode}`,
      details,
    },
  };

  res.status(statusCode).json(response);
}
