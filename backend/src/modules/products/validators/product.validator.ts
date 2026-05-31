import Joi from 'joi';

import {
  PriceRange,
  ProductStatus,
  SortOption,
} from '../../../shared/types-enums/enums';
import { imagePathValidator } from '../../../shared/utils/pathValidator';

const variantOptionSchema = Joi.object({
  type: Joi.string().valid('color', 'size', 'material', 'custom').required(),
  label: Joi.string().max(50).required(),
  value: Joi.string().max(100).required(),
});

const variantSchema = Joi.object({
  name: Joi.string().max(255).required(),
  options: Joi.array().items(variantOptionSchema).min(1).required(),
  price: Joi.number().integer().min(0).optional(),
  compare_price: Joi.number().integer().min(0).optional(),
  stock: Joi.number().integer().min(0).default(0),
  image_url: Joi.string().optional(),
});

const imageSchema = Joi.object({
  // url: Joi.string().uri().max(1000).required(),
  url: imagePathValidator.optional(),
  alt: Joi.string().max(255).optional(),
  sort_order: Joi.number().integer().min(0).optional(),
  is_primary: Joi.boolean().optional(),
});

export const productValidation = {
  create: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    slug: Joi.string()
      .regex(/^[\s\-0-9a-z]+$/i)
      .min(3)
      .max(100)
      .required(),
    description: Joi.string().max(5000).optional().allow(''),
    base_price: Joi.number().integer().min(0).required(),
    currency_code: Joi.string().length(3).default('IRR'),
    category_id: Joi.string().uuid().required(),
    brand_id: Joi.string().uuid().optional(),
    tags: Joi.array().items(Joi.string().max(50)).max(20).default([]),
    specifications: Joi.object()
      .pattern(Joi.string(), Joi.string())
      .default({}),
    status: Joi.string()
      .valid(...Object.values(ProductStatus))
      .default(ProductStatus.ACTIVE),
    is_featured: Joi.boolean().default(false),
    is_new: Joi.boolean().default(true),
    variants: Joi.array().items(variantSchema).min(1).required(),
    images: Joi.array().items(imageSchema).min(1).required(),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    slug: Joi.string()
      .regex(/^[\s\-0-9a-z]+$/i)
      .min(3)
      .max(100)
      .required(),
    description: Joi.string().max(5000).optional().allow(''),
    base_price: Joi.number().integer().min(0).optional(),
    currency_code: Joi.string().length(3).optional(),
    category_id: Joi.string().uuid().optional(),
    brand_id: Joi.string().uuid().optional().allow(null),
    tags: Joi.array().items(Joi.string().max(50)).max(20).optional(),
    specifications: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
    status: Joi.string()
      .valid(...Object.values(ProductStatus))
      .optional(),
    is_featured: Joi.boolean().optional(),
    is_new: Joi.boolean().optional(),
    variants: Joi.array().items(variantSchema).min(1).optional(),
    images: Joi.array().items(imageSchema).min(1).optional(),
  }),

  list: Joi.object({
    category_id: Joi.string().uuid().optional(),
    brand_id: Joi.string().uuid().optional(),
    min_price: Joi.number().integer().min(0).optional(),
    max_price: Joi.number().integer().min(0).optional(),
    price_range: Joi.string()
      .valid(...Object.values(PriceRange))
      .optional(),
    in_stock: Joi.boolean().optional(),
    is_featured: Joi.boolean().optional(),
    is_new: Joi.boolean().optional(),
    search: Joi.string().max(100).optional(),
    tags: Joi.alternatives()
      .try(
        Joi.array().items(Joi.string()),
        Joi.string().custom((value) => {
          if (!value) return [];
          return value
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);
        }),
      )
      .optional(),
    sort: Joi.string()
      .valid(...Object.values(SortOption))
      .default(SortOption.NEWEST),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(12),
  }),

  updateStock: Joi.object({
    variant_id: Joi.string().uuid().required(),
    stock: Joi.number().integer().min(0).required(),
  }),
};
