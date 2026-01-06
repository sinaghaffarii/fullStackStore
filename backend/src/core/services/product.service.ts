import type { Order, Transaction, WhereOptions } from 'sequelize';

import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import type { VariantType } from '../../infrastructure/database/models';
import type {
  PriceRange,
  StockStatus,
} from '../../infrastructure/database/models/shared';
import type { PaginatedListResult } from '../../shared/types-enums/paginated-list-result';

import { sequelize } from '../../configs/database';
import {
  Brand,
  Category,
  Discount,
  getStockStatus,
  PRICE_RANGE_VALUES,
  Product,
  ProductImage,
  ProductStatus,
  ProductVariant,
  SortOption,
} from '../../infrastructure/database/models';
import { AppError } from '../../shared/errors/app-error';
import { buildPagination } from '../../shared/utils/pagination';

export interface ProductFilters {
  category_id?: string;
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  price_range?: PriceRange;
  in_stock?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  search?: string;
  tags?: string[];
  sort?: SortOption;
  page?: number;
  limit?: number;
  status?: ProductStatus;
}

export interface CreateProductDto {
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  category_id: string;
  brand_id?: string;
  tags?: string[];
  specifications?: Record<string, string>;
  is_featured?: boolean;
  is_new?: boolean;
  status?: ProductStatus;
  variants: {
    sku: string;
    name: string;
    options: { type: VariantType; label: string; value: string }[];
    price: number;
    compare_price?: number;
    stock: number;
    image_url?: string;
  }[];
  images: {
    url: string;
    alt?: string;
    sort_order?: number;
    is_primary?: boolean;
  }[];
}

export interface EnrichedProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  final_price: number;
  discount_amount: number;
  discount_percent: number;
  price_display: {
    base: number;
    final: number;
    currency: string;
    discount_percent: number;
  };
  primary_image?: string;
  images: { url: string; alt?: string }[];
  stock_status: StockStatus;
  total_stock: number;
  colors: { label: string; value: string }[];
  sizes: string[];
  category: { id: string; name: string; slug: string };
  brand?: { id: string; name: string; name_fa: string; logo?: string };
  rating: number;
  review_count: number;
  sales_count: number;
  view_count: number;
  is_featured: boolean;
  is_new: boolean;
  status: ProductStatus;
  specifications: Record<string, string>;
  tags: string[];
  active_discount?: {
    id: string;
    name: string;
    type: string;
    value: number;
    badge_text?: string;
  };
  created_at: Date;
  updated_at: Date;
}

export class ProductService {
  async create(dto: CreateProductDto): Promise<Product> {
    return sequelize.transaction(async (transaction: Transaction) => {
      const product = await Product.create(
        {
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          base_price: dto.base_price,
          category_id: dto.category_id,
          brand_id: dto.brand_id,
          tags: dto.tags || [],
          specifications: dto.specifications || {},
          is_featured: dto.is_featured ?? false,
          is_new: dto.is_new ?? true,
          status: dto.status || ProductStatus.DRAFT,
        },
        { transaction },
      );

      if (dto.variants?.length) {
        await ProductVariant.bulkCreate(
          dto.variants.map((v) => ({
            ...v,
            product_id: product.id,
          })),
          { transaction },
        );
      }

      if (dto.images?.length) {
        await ProductImage.bulkCreate(
          dto.images.map((img, index) => ({
            product_id: product.id,
            url: img.url,
            alt: img.alt,
            sort_order: img.sort_order ?? index,
            is_primary: img.is_primary ?? index === 0,
          })),
          { transaction },
        );
      }

      return product;
    });
  }

  async delete(id: string): Promise<void> {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }
    await product.update({ status: ProductStatus.INACTIVE });
  }

  async getById(id: string): Promise<EnrichedProduct> {
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        {
          model: ProductVariant,
          as: 'variants',
          where: { is_active: true },
          required: false,
        },
        { model: ProductImage, as: 'images', order: [['sort_order', 'ASC']] },
      ],
    });

    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }

    return this.enrichProduct(product);
  }

  async getBySlug(slug: string): Promise<EnrichedProduct> {
    const product = await Product.findOne({
      where: { slug, status: ProductStatus.ACTIVE },
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        {
          model: ProductVariant,
          as: 'variants',
          where: { is_active: true },
          required: false,
        },
        { model: ProductImage, as: 'images', order: [['sort_order', 'ASC']] },
      ],
    });

    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }

    await product.increment('view_count');
    return this.enrichProduct(product);
  }

  async list(
    filters: ProductFilters = {},
  ): Promise<PaginatedListResult<EnrichedProduct>> {
    const { page = 1, limit = 12, sort = SortOption.NEWEST } = filters;
    const offset = (page - 1) * limit;

    const where = this.buildWhere(filters);
    const order = this.buildOrder(sort);

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name', 'name_fa', 'logo'],
        },
        {
          model: ProductVariant,
          as: 'variants',
          where: { is_active: true },
          required: false,
        },
        {
          model: ProductImage,
          as: 'images',
          order: [['sort_order', 'ASC']],
        },
      ],
      limit,
      offset,
      order,
      distinct: true,
    });

    const items = await Promise.all(rows.map((p) => this.enrichProduct(p)));

    return {
      items,
      pagination: buildPagination(count, page, limit),
    };
  }

  async update(id: string, dto: Partial<CreateProductDto>): Promise<Product> {
    return sequelize.transaction(async (transaction: Transaction) => {
      const product = await Product.findByPk(id, { transaction });
      if (!product) {
        throw new AppError('Product not found', StatusCodes.NOT_FOUND);
      }

      await product.update(
        {
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          base_price: dto.base_price,
          category_id: dto.category_id,
          brand_id: dto.brand_id,
          tags: dto.tags,
          specifications: dto.specifications,
          is_featured: dto.is_featured,
          is_new: dto.is_new,
          status: dto.status,
        },
        { transaction },
      );

      if (dto.variants) {
        await ProductVariant.destroy({
          where: { product_id: id },
          transaction,
        });
        await ProductVariant.bulkCreate(
          dto.variants.map((v) => ({ ...v, product_id: id })),
          { transaction },
        );
      }

      if (dto.images) {
        await ProductImage.destroy({ where: { product_id: id }, transaction });
        await ProductImage.bulkCreate(
          dto.images.map((img, index) => ({
            product_id: id,
            url: img.url,
            alt: img.alt,
            sort_order: img.sort_order ?? index,
            is_primary: img.is_primary ?? index === 0,
          })),
          { transaction },
        );
      }

      return product.reload({ transaction });
    });
  }

  async updateStock(variantId: string, stock: number): Promise<ProductVariant> {
    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) {
      throw new AppError('Variant not found', StatusCodes.NOT_FOUND);
    }
    await variant.update({ stock });
    return variant;
  }

  private buildOrder(sort: SortOption): Order {
    const orderMap: Record<SortOption, Order> = {
      [SortOption.NEWEST]: [['created_at', 'DESC']],
      [SortOption.OLDEST]: [['created_at', 'ASC']],
      [SortOption.PRICE_LOW]: [['base_price', 'ASC']],
      [SortOption.PRICE_HIGH]: [['base_price', 'DESC']],
      [SortOption.BEST_SELLING]: [['sales_count', 'DESC']],
      [SortOption.MOST_POPULAR]: [['view_count', 'DESC']],
      [SortOption.HIGHEST_RATED]: [['rating', 'DESC']],
    };
    return orderMap[sort];
  }

  private buildWhere(filters: ProductFilters): WhereOptions {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    } else {
      where.status = ProductStatus.ACTIVE;
    }

    if (filters.category_id) where.category_id = filters.category_id;
    if (filters.brand_id) where.brand_id = filters.brand_id;
    if (filters.is_featured !== undefined)
      where.is_featured = filters.is_featured;
    if (filters.is_new !== undefined) where.is_new = filters.is_new;

    if (filters.price_range && PRICE_RANGE_VALUES[filters.price_range]) {
      const { min, max } = PRICE_RANGE_VALUES[filters.price_range];
      where.base_price = { [Op.gte]: min };
      if (max) where.base_price[Op.lte] = max;
    } else {
      if (filters.min_price) {
        where.base_price = { ...where.base_price, [Op.gte]: filters.min_price };
      }
      if (filters.max_price) {
        where.base_price = { ...where.base_price, [Op.lte]: filters.max_price };
      }
    }

    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
        { tags: { [Op.overlap]: [filters.search] } },
      ];
    }

    if (filters.tags?.length) {
      where.tags = { [Op.overlap]: filters.tags };
    }

    return where;
  }

  private async enrichProduct(product: Product): Promise<EnrichedProduct> {
    const variants = product.variants || [];
    const images = product.images || [];

    const discount = await Discount.findActiveForProduct(
      product.id,
      product.category_id,
      product.brand_id,
    );

    const discountAmount = discount?.calculate(product.base_price) || 0;
    const finalPrice = product.base_price - discountAmount;
    const discountPercent =
      discountAmount > 0
        ? Math.round((discountAmount / product.base_price) * 100)
        : 0;

    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
    const colors = this.extractColors(variants);
    const sizes = this.extractSizes(variants);

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      base_price: product.base_price,
      final_price: finalPrice,
      discount_amount: discountAmount,
      discount_percent: discountPercent,
      price_display: {
        base: Math.round(product.base_price / 10),
        final: Math.round(finalPrice / 10),
        currency: 'تومان',
        discount_percent: discountPercent,
      },
      primary_image: images.find((i) => i.is_primary)?.url || images[0]?.url,
      images: images.map((i) => ({ url: i.url, alt: i.alt })),
      stock_status: getStockStatus(totalStock),
      total_stock: totalStock,
      colors,
      sizes,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      },
      brand: product.brand
        ? {
            id: product.brand.id,
            name: product.brand.name,
            name_fa: product.brand.name_fa,
            logo: product.brand.logo,
          }
        : undefined,
      rating: Number(product.rating),
      review_count: product.review_count,
      sales_count: product.sales_count,
      view_count: product.view_count,
      is_featured: product.is_featured,
      is_new: product.is_new,
      status: product.status,
      specifications: product.specifications,
      tags: product.tags,
      active_discount: discount
        ? {
            id: discount.id,
            name: discount.name,
            type: discount.type,
            value: discount.value,
            badge_text: discount.badge_text,
          }
        : undefined,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }

  private extractColors(variants: any[]): { label: string; value: string }[] {
    const colorsMap = new Map<string, { label: string; value: string }>();
    variants.forEach((v) => {
      v.options?.forEach((opt: any) => {
        if (opt.type === 'color' && !colorsMap.has(opt.value)) {
          colorsMap.set(opt.value, { label: opt.label, value: opt.value });
        }
      });
    });
    return Array.from(colorsMap.values());
  }

  private extractSizes(variants: any[]): string[] {
    const sizes = new Set<string>();
    variants.forEach((v) => {
      v.options?.forEach((opt: any) => {
        if (opt.type === 'size') sizes.add(opt.value);
      });
    });
    return Array.from(sizes);
  }
}
