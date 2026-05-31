import Joi from 'joi';

import { DiscountType } from '../../../shared/types-enums/enums';

export const discountValidation = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    coupon_code: Joi.string().min(2).max(100).required(),

    type: Joi.string()
      .valid(...Object.values(DiscountType))
      .required(),

    value: Joi.number()
      .min(0)
      .required()
      .when('type', {
        is: DiscountType.PERCENTAGE,
        then: Joi.number().max(100),
      })
      .when('type', {
        is: DiscountType.FIXED,
        then: Joi.number().max(2000000),
      }),

    max_amount: Joi.number().integer().min(0).optional().when('type', {
      is: DiscountType.PERCENTAGE,
      then: Joi.optional(),
      otherwise: Joi.forbidden(),
    }),

    // scope: Joi.string()
    //   .valid(...Object.values(DiscountScope))
    //   .required(),

    // targetId: Joi.string()
    //   .uuid()
    //   .when('scope', {
    //     is: Joi.valid(
    //       DiscountScope.PRODUCT,
    //       DiscountScope.CATEGORY,
    //       DiscountScope.BRAND,
    //     ),
    //     then: Joi.required(),
    //     otherwise: Joi.optional(),
    //   }),

    starts_at: Joi.date().iso().required(),
    ends_at: Joi.date().iso().greater(Joi.ref('starts_at')).required(),

    badge_text: Joi.string().max(50).optional(),
    is_active: Joi.boolean().default(true),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    coupon_code: Joi.string().min(2).max(100).optional(),
    type: Joi.string()
      .valid(...Object.values(DiscountType))
      .optional(),
    value: Joi.number()
      .min(0)
      .optional()
      .when('type', {
        is: DiscountType.PERCENTAGE,
        then: Joi.number().max(100),
      })
      .when('type', {
        is: DiscountType.FIXED,
        then: Joi.number().max(2000000),
      }),
    max_amount: Joi.number().integer().min(0).optional().allow(null),
    // scope: Joi.string()
    //   .valid(...Object.values(DiscountScope))
    //   .optional(),
    // targetId: Joi.string().uuid().optional().allow(null),
    starts_at: Joi.date().iso().optional(),
    ends_at: Joi.date().iso().optional(),
    badge_text: Joi.string().max(50).optional().allow(null),
    is_active: Joi.boolean().optional(),
  }),

  list: Joi.object({
    // scope: Joi.string()
    //   .valid(...Object.values(DiscountScope))
    //   .optional(),
    is_active: Joi.boolean().optional(),
    validOnly: Joi.boolean().default(false),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};
