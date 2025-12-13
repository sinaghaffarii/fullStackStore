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

  /**
   * انعطاف‌پذیر: می‌توانید عدد (statusCode) یا آبجکت AppErrorOptions بدهید.
   * مثال‌ها:
   *   throw new AppError('Not found', 404);
   *   throw new AppError('Bad request', { statusCode: 400, field: 'email' });
   */
  constructor(message: string, statusOrOptions: number | AppErrorOptions = {}) {
    super(message);
    this.name = 'AppError';

    const options: AppErrorOptions =
      typeof statusOrOptions === 'number'
        ? { statusCode: statusOrOptions }
        : statusOrOptions;

    const { statusCode = 500, isOperational = true, ...details } = options;

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = Object.keys(details).length > 0 ? details : undefined;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
