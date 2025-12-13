import Joi from 'joi';

import {
  PriceRange,
  ProductStatus,
  SortOption,
  VariantType,
} from '../../database/models';

const variantOptionSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(VariantType))
    .required(),
  label: Joi.string().max(50).required(),
  value: Joi.string().max(100).required(),
});

const variantSchema = Joi.object({
  sku: Joi.string().max(100).required(),
  name: Joi.string().max(255).required(),
  options: Joi.array().items(variantOptionSchema).min(1).required(),
  price: Joi.number().integer().min(0).required(),
  compare_price: Joi.number().integer().min(0).optional(),
  stock: Joi.number().integer().min(0).default(0),
  image_url: Joi.string().uri().max(500).optional(),
});

const imageSchema = Joi.object({
  url: Joi.string().uri().max(500).required(),
  alt: Joi.string().max(255).optional(),
  sort_order: Joi.number().integer().min(0).default(0),
  is_primary: Joi.boolean().default(false),
});

export const productValidation = {
  create: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    slug: Joi.string()
      .min(2)
      .max(280)
      .pattern(/^[-0-9a-z]+$/)
      .required(),
    description: Joi.string().max(5000).optional().allow(''),
    base_price: Joi.number().integer().min(0).required(),
    category_id: Joi.string().uuid().required(),
    brand_id: Joi.string().uuid().optional(),
    tags: Joi.array().items(Joi.string().max(50)).max(20).default([]),
    specifications: Joi.object()
      .pattern(Joi.string(), Joi.string())
      .default({}),
    status: Joi.string()
      .valid(...Object.values(ProductStatus))
      .default(ProductStatus.DRAFT),
    is_featured: Joi.boolean().default(false),
    is_new: Joi.boolean().default(true),
    variants: Joi.array().items(variantSchema).min(1).required(),
    images: Joi.array().items(imageSchema).min(1).required(),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    slug: Joi.string()
      .min(2)
      .max(280)
      .pattern(/^[-0-9a-z]+$/)
      .optional(),
    description: Joi.string().max(5000).optional().allow(''),
    base_price: Joi.number().integer().min(0).optional(),
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
        Joi.string().custom((value) => value.split(',')),
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
