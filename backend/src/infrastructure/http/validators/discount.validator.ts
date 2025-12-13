import Joi from 'joi';

import { DiscountScope, DiscountType } from '../../database/models';

export const discountValidation = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),

    type: Joi.string()
      .valid(...Object.values(DiscountType))
      .required(),

    value: Joi.number()
      .min(0)
      .required()
      .when('type', {
        is: DiscountType.PERCENTAGE,
        then: Joi.number().max(100),
      }),

    maxAmount: Joi.number().integer().min(0).optional().when('type', {
      is: DiscountType.PERCENTAGE,
      then: Joi.optional(),
      otherwise: Joi.forbidden(),
    }),

    scope: Joi.string()
      .valid(...Object.values(DiscountScope))
      .required(),

    targetId: Joi.string()
      .uuid()
      .when('scope', {
        is: Joi.valid(
          DiscountScope.PRODUCT,
          DiscountScope.CATEGORY,
          DiscountScope.BRAND,
        ),
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),

    startsAt: Joi.date().iso().required(),
    endsAt: Joi.date().iso().greater(Joi.ref('startsAt')).required(),

    badgeText: Joi.string().max(50).optional(),
    isActive: Joi.boolean().default(true),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    type: Joi.string()
      .valid(...Object.values(DiscountType))
      .optional(),
    value: Joi.number().min(0).max(100).optional(),
    maxAmount: Joi.number().integer().min(0).optional().allow(null),
    scope: Joi.string()
      .valid(...Object.values(DiscountScope))
      .optional(),
    targetId: Joi.string().uuid().optional().allow(null),
    startsAt: Joi.date().iso().optional(),
    endsAt: Joi.date().iso().optional(),
    badgeText: Joi.string().max(50).optional().allow(null),
    isActive: Joi.boolean().optional(),
  }),

  list: Joi.object({
    scope: Joi.string()
      .valid(...Object.values(DiscountScope))
      .optional(),
    isActive: Joi.boolean().optional(),
    validOnly: Joi.boolean().default(false),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};
