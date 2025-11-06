import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../../shared/errors/app-error';
import { sendError } from '../../../shared/utils/response-handler';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error('Error caught by error handler:', error);

  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.message);
    return;
  }

  // Sequelize validation errors
  if (error.name === 'SequelizeValidationError') {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      'Validation error',
      'VALIDATION_ERROR',
    );
    return;
  }

  // Sequelize unique constraint errors
  if (error.name === 'SequelizeUniqueConstraintError') {
    sendError(
      res,
      StatusCodes.CONFLICT,
      'Resource already exists',
      'DUPLICATE_ERROR',
    );
    return;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    sendError(res, StatusCodes.UNAUTHORIZED, 'Invalid token', 'INVALID_TOKEN');
    return;
  }

  // Default error
  sendError(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    'Internal server error',
    'INTERNAL_ERROR',
  );
};
