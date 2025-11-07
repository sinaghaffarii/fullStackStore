import Joi from 'joi';

export const categoryValidation = {
  createCategory: Joi.object({
    name: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'Category name is required',
      'string.max': 'Category name cannot exceed 255 characters',
    }),
    description: Joi.string().max(1000).optional().allow('', null),
    parent_id: Joi.string().uuid().optional().messages({
      'string.guid': 'Parent ID must be a valid UUID',
    }),
  }),

  updateCategory: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    description: Joi.string().max(1000).optional().allow('', null),
    parent_id: Joi.string().uuid().optional().messages({
      'string.guid': 'Parent ID must be a valid UUID',
    }),
  }),

  listCategories: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    include_children: Joi.boolean().default(false),
  }),
};
