import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../../shared/errors/app-error';

export function validateRequest(
  schema: ObjectSchema,
  source: 'body' | 'query' = 'body',
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = source === 'body' ? req.body : req.query;
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      throw new AppError('Validation failed', StatusCodes.BAD_REQUEST);
    }

    next();
  };
}
