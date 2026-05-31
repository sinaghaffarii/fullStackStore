import Joi from 'joi';

export const cartValidation = {
  addItem: Joi.object({
    variant_id: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).max(99).default(1),
  }),

  updateItem: Joi.object({
    quantity: Joi.number().integer().min(1).max(99).required(),
  }),

  removeItem: Joi.object({
    item_id: Joi.string().uuid().required(),
  }),
};
