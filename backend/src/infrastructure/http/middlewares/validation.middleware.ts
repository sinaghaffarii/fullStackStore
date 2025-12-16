import type { NextFunction, Request, Response } from 'express';
import type Joi from 'joi';

import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../../shared/errors/app-error';

type ValidateSource = 'body' | 'params' | 'query';

const createValidator = (source: ValidateSource) => {
  return (schema: Joi.ObjectSchema) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
      const dataToValidate = req[source];

      const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const messages = error.details.map((d) => d.message).join('، ');
        next(new AppError(messages, { statusCode: StatusCodes.BAD_REQUEST }));
        return;
      }

      if (source === 'body') {
        req.body = value;
      } else {
        Object.assign(req[source], value);
      }

      next();
    };
  };
};

export const validate = createValidator('body');
export const validateQuery = createValidator('query');
export const validateParams = createValidator('params');

export const validateRequest = (
  schema: Joi.ObjectSchema,
  source: ValidateSource = 'body',
) => {
  return createValidator(source)(schema);
};
