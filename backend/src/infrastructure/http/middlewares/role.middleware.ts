import type { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../../shared/errors/app-error';

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('احراز هویت نشده', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('شما دسترسی به این بخش را ندارید', {
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    next();
  };
};

export const requireAdmin = requireRole('admin');
export const requireCustomer = requireRole('customer');
export const requireAnyAuth = requireRole('admin', 'customer');

export const roleMiddleware = (roles: string[]) => requireRole(...roles);
