import type { ErrorRequestHandler } from 'express';

import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../../shared/errors/app-error';
import { sendError } from '../../../shared/utils/response-handler';

// eslint-disable-next-line max-params
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error('Error caught by error handler:', error);

  if (error instanceof AppError) {
    if (error.details) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        ...error.details,
      });
      return;
    }
    sendError(res, error.statusCode, error.message);
    return;
  }

  if (error.name === 'SequelizeValidationError') {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      'Validation error',
      'VALIDATION_ERROR',
    );
    return;
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    sendError(
      res,
      StatusCodes.CONFLICT,
      'Resource already exists',
      'DUPLICATE_ERROR',
    );
    return;
  }

  if (error.name === 'JsonWebTokenError') {
    sendError(res, StatusCodes.UNAUTHORIZED, 'Invalid token', 'INVALID_TOKEN');
    return;
  }

  sendError(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    'Internal server error',
    'INTERNAL_ERROR',
  );
};
