export interface AppErrorOptions {
  statusCode?: number;
  isOperational?: boolean;
  field?: string;
  [key: string]: unknown;
}

export class AppError extends Error {
  public details?: Record<string, unknown>;
  public isOperational: boolean;
  public statusCode: number;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);

    const { statusCode = 500, isOperational = true, ...details } = options;

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = Object.keys(details).length > 0 ? details : undefined;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
