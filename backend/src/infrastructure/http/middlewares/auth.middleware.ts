import type { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../../shared/errors/app-error';
import { verifyAccessToken } from '../../../shared/utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    let token = req.cookies.accessToken;

    if (!token) {
      token = req.header('Authorization')?.replace('Bearer ', '');
    }

    if (!token) {
      throw new AppError(
        'Access denied. No token provided.',
        StatusCodes.UNAUTHORIZED,
      );
    }

    const decoded = verifyAccessToken(token) as {
      userId: string;
      email: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError('Invalid token', StatusCodes.UNAUTHORIZED);
  }
};
