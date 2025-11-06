import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../../shared/utils/jwt';
import { AppError } from '../../../shared/errors/app-error';
import { StatusCodes } from 'http-status-codes';

// تعریف تایپ extended برای Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
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
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AppError(
        'Access denied. No token provided.',
        StatusCodes.UNAUTHORIZED,
      );
    }

    const decoded = verifyAccessToken(token) as {
      userId: string;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError('Invalid token', StatusCodes.UNAUTHORIZED);
  }
};
