import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { sendError } from '../../../shared/utils/response-handler';

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(
    res,
    StatusCodes.NOT_FOUND,
    `Route ${req.method} ${req.path} not found`,
    'ROUTE_NOT_FOUND',
  );
};
