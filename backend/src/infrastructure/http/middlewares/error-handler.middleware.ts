import type { ErrorRequestHandler } from 'express';

import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../../shared/errors/app-error';
import { sendError } from '../../../shared/utils/response-handler';

// eslint-disable-next-line max-params
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error('Error caught by error handler:', error);

  if (error instanceof AppError) {
    sendError(res, {
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
    });
    return;
  }

  if (error.name === 'SequelizeValidationError') {
    sendError(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Validation error',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    sendError(res, {
      statusCode: StatusCodes.CONFLICT,
      message: 'Resource already exists',
      errorCode: 'DUPLICATE_ERROR',
    });
    return;
  }

  if (error.name === 'JsonWebTokenError') {
    sendError(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Invalid token',
      errorCode: 'INVALID_TOKEN',
    });
    return;
  }

  sendError(res, {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
    errorCode: 'INTERNAL_ERROR',
  });
};
