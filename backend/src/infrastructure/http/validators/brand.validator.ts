import Joi from 'joi';

export const brandValidation = {
  create: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    name_fa: Joi.string().min(1).max(100).required(),
    slug: Joi.string()
      .min(1)
      .max(100)
      .pattern(/^[-0-9a-z]+$/)
      .required(),
    logo: Joi.string().uri().max(500).optional(),
    is_active: Joi.boolean().default(true),
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    name_fa: Joi.string().min(1).max(100).optional(),
    slug: Joi.string()
      .min(1)
      .max(100)
      .pattern(/^[-0-9a-z]+$/)
      .optional(),
    logo: Joi.string().uri().max(500).optional().allow(null),
    is_active: Joi.boolean().optional(),
  }),

  list: Joi.object({
    is_active: Joi.boolean().optional(),
    search: Joi.string().max(50).optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
  }),
};
