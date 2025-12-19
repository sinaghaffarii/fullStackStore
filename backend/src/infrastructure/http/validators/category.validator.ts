import Joi from 'joi';

import { imagePathValidator } from '../../../shared/utils/pathValidator';

export const categoryValidation = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    slug: Joi.string()
      .min(2)
      .max(120)
      .pattern(/^[-0-9a-z]+$/)
      .required(),
    description: Joi.string().max(500).optional().allow(''),
    image: imagePathValidator.optional(),
    parent_id: Joi.string().uuid().optional().allow(null),
    sort_order: Joi.number().integer().min(0).default(0),
    is_active: Joi.boolean().default(true),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    slug: Joi.string()
      .min(2)
      .max(120)
      .pattern(/^[-0-9a-z]+$/)
      .optional(),
    description: Joi.string().max(500).optional().allow(''),
    image: imagePathValidator.optional().allow(null),
    parent_id: Joi.string().uuid().optional().allow(null),
    sort_order: Joi.number().integer().min(0).optional(),
    is_active: Joi.boolean().optional(),
  }),

  list: Joi.object({
    parent_id: Joi.string().uuid().optional().allow(null),
    is_active: Joi.boolean().optional(),
    include_children: Joi.boolean().default(false),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};
