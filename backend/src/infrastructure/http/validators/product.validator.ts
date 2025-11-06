import Joi from 'joi';

export const productValidation = {
  createProduct: Joi.object({
    name: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'Product name is required',
      'string.max': 'Product name cannot exceed 255 characters',
    }),
    description: Joi.string().max(1000).optional().allow('', null),
    base_price: Joi.number().min(0).precision(2).required().messages({
      'number.min': 'Price cannot be negative',
      'number.precision': 'Price must have at most 2 decimal places',
    }),
    category_id: Joi.string().uuid().required().messages({
      'string.guid': 'Category ID must be a valid UUID',
    }),
    attributes: Joi.object().default({}).messages({
      'object.base': 'Attributes must be an object',
    }),
    stock_quantity: Joi.number().integer().min(0).default(0).messages({
      'number.min': 'Stock quantity cannot be negative',
      'number.integer': 'Stock quantity must be an integer',
    }),
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    description: Joi.string().max(1000).optional().allow('', null),
    base_price: Joi.number().min(0).precision(2).optional(),
    category_id: Joi.string().uuid().optional(),
    attributes: Joi.object().optional(),
    stock_quantity: Joi.number().integer().min(0).optional(),
  }),

  updateStock: Joi.object({
    quantity: Joi.number().integer().min(0).required().messages({
      'number.min': 'Quantity cannot be negative',
      'number.integer': 'Quantity must be an integer',
    }),
  }),

  listProducts: Joi.object({
    category_id: Joi.string().uuid().optional(),
    min_price: Joi.number().min(0).optional(),
    max_price: Joi.number().min(0).optional(),
    in_stock: Joi.boolean().optional(),
    search: Joi.string().max(100).optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    attributes: Joi.string()
      .custom((value, helpers) => {
        try {
          const parsed = JSON.parse(value);
          if (
            typeof parsed !== 'object' ||
            parsed === null ||
            Array.isArray(parsed)
          ) {
            return helpers.error('any.invalid');
          }
          return parsed;
        } catch {
          return helpers.error('any.invalid');
        }
      }, 'JSON validation')
      .optional(),
  }),
};
