import type { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../../shared/errors/app-error';

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', StatusCodes.UNAUTHORIZED);
    }

    const userRole = req.user.role;

    const hasRole = allowedRoles.includes(userRole);

    if (!hasRole) {
      throw new AppError('Insufficient permissions', StatusCodes.FORBIDDEN);
    }

    next();
  };
};
