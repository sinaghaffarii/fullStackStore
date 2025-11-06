import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/app-error';
import { StatusCodes } from 'http-status-codes';

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', StatusCodes.UNAUTHORIZED);
    }

    // TODO: Fetch user roles from database based on req.user.userId
    // For now, we'll assume all authenticated users are admins in this example
    const userRoles = ['admin']; // This should come from database

    const hasRole = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      throw new AppError('Insufficient permissions', StatusCodes.FORBIDDEN);
    }

    next();
  };
};
