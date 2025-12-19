import Joi from 'joi';

export const imagePathValidator = Joi.string()
  .pattern(/^\/images\/.+\.(jpeg|jpg|png|webp)$/)
  .max(500);
